import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { pathToFileURL } from "node:url";
import { buildQuestionPlan, getNextFollowUpQuestions } from "../core/question-engine.ts";
import { createRequirementSession } from "../core/requirement-session.ts";
import { scorePrompt } from "../core/prompt-scorer.ts";
import { scoringRubric } from "../domain/scoring-rubric.ts";
import {
  coreScenarios,
  extensionScenarios,
  getScenario,
  scenarios,
  type ScenarioId,
  type TargetTool,
} from "../domain/scenarios.ts";
import { loadMistakeSummary, savePromptMistake } from "../storage/lesson-store.ts";
import { evaluateCoachPrompt, type CoachEvaluationInput } from "./evaluation.ts";

const publicRoot = new URL("../../public/", import.meta.url);
const targetTools: TargetTool[] = ["Codex", "Codex CLI", "Claude Code", "Gemini CLI", "ChatGPT"];

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function parseScenario(value: string | null): ScenarioId {
  if (!value) {
    throw new HttpError(400, "Missing scenario");
  }

  getScenario(value as ScenarioId);
  return value as ScenarioId;
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) {
      throw new HttpError(413, "Request body is too large");
    }
    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

function staticFileUrl(pathname: string): URL | null {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  if (!relativePath || relativePath.includes("..") || relativePath.includes("\\") || relativePath.startsWith(".")) {
    return null;
  }
  return new URL(relativePath, publicRoot);
}

async function serveStatic(pathname: string, response: ServerResponse): Promise<void> {
  const fileUrl = staticFileUrl(pathname);
  if (!fileUrl) {
    throw new HttpError(403, "Forbidden path");
  }

  try {
    const content = await readFile(fileUrl);
    response.writeHead(200, {
      "content-type": contentTypes[extname(fileUrl.pathname)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new HttpError(404, "Not found");
    }
    throw error;
  }
}

async function route(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/api/scenarios") {
    sendJson(response, 200, { scenarios, coreScenarios, extensionScenarios, targetTools, scoringRubric });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/questions") {
    const scenario = parseScenario(url.searchParams.get("scenario"));
    const plan = buildQuestionPlan(scenario);
    sendJson(response, 200, {
      scenario,
      levels: plan.levels,
      blockingQuestionIds: plan.blockingQuestions.map((question) => question.id),
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/evaluate") {
    const body = (await readJsonBody(request)) as CoachEvaluationInput;
    const scenario = parseScenario(body.scenario);
    const result = evaluateCoachPrompt({ ...body, scenario });
    sendJson(response, 200, result);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/follow-up") {
    const body = (await readJsonBody(request)) as CoachEvaluationInput;
    const scenario = parseScenario(body.scenario);
    const answers = {
      originalPrompt: body.originalPrompt,
      ...(body.answers ?? {}),
    };
    const session = createRequirementSession({
      scenario,
      targetTool: body.targetTool,
      originalPrompt: body.originalPrompt ?? "",
      answers,
    });
    const score = scorePrompt(session);
    const followUpQuestions = getNextFollowUpQuestions({
      scenario,
      answers,
      scoreReport: score,
      maxQuestions: 3,
    });
    sendJson(response, 200, { score, followUpQuestions, session });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/lessons/summary") {
    sendJson(response, 200, await loadMistakeSummary());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/lessons") {
    const body = (await readJsonBody(request)) as CoachEvaluationInput & { lessonCandidate?: unknown };
    if ("lessonCandidate" in body && body.lessonCandidate) {
      await savePromptMistake(body.lessonCandidate as never);
      sendJson(response, 201, { saved: true });
      return;
    }
    const scenario = parseScenario(body.scenario);
    const result = evaluateCoachPrompt({ ...body, scenario });
    if (!result.lessonCandidate) {
      sendJson(response, 200, { saved: false, reason: "No lesson candidate generated." });
      return;
    }
    await savePromptMistake(result.lessonCandidate);
    sendJson(response, 201, { saved: true, lesson: result.lessonCandidate });
    return;
  }

  if (request.method === "GET") {
    await serveStatic(url.pathname, response);
    return;
  }

  throw new HttpError(405, "Method not allowed");
}

export function createCoachServer() {
  return createServer((request, response) => {
    route(request, response).catch((error: unknown) => {
      const status = error instanceof HttpError ? error.status : 500;
      const message = error instanceof Error ? error.message : "Internal server error";
      sendJson(response, status, { error: message });
    });
  });
}

function portFromArgs(): number {
  const index = process.argv.indexOf("--port");
  const raw = index >= 0 ? process.argv[index + 1] : process.env.PORT;
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 ? port : 4173;
}

export function startServer(port = portFromArgs()): void {
  const server = createCoachServer();
  server.listen(port, () => {
    console.log(`CodePrompt Coach web prototype: http://localhost:${port}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
