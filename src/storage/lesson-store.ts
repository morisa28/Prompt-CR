import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  generateIterationSuggestions,
  summarizeMistakes,
  type MistakeSummary,
  type PromptMistake,
} from "../core/lesson-engine.ts";

export const defaultMistakeStorePath = "data/prompt-mistakes.json";

export async function readMistakes(path = defaultMistakeStorePath): Promise<PromptMistake[]> {
  try {
    const content = await readFile(path, "utf8");
    const parsed = JSON.parse(content) as PromptMistake[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function appendMistake(path: string, mistake: PromptMistake): Promise<void> {
  const mistakes = await readMistakes(path);
  mistakes.push(mistake);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(mistakes, null, 2)}\n`, "utf8");
}

export async function savePromptMistake(mistake: PromptMistake, path = defaultMistakeStorePath): Promise<void> {
  await appendMistake(path, mistake);
}

export async function loadPromptMistakes(path = defaultMistakeStorePath): Promise<PromptMistake[]> {
  return readMistakes(path);
}

export async function loadMistakeSummary(
  path = defaultMistakeStorePath,
): Promise<MistakeSummary & { suggestions: string[] }> {
  const mistakes = await loadPromptMistakes(path);
  const summary = summarizeMistakes(mistakes);
  return {
    ...summary,
    suggestions: generateIterationSuggestions(summary),
  };
}
