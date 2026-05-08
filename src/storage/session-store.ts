import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { StructuredRequirement } from "../core/requirement-session.ts";

export async function writeSession(path: string, session: StructuredRequirement): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(session, null, 2)}\n`, "utf8");
}

export async function readSession(path: string): Promise<StructuredRequirement> {
  return JSON.parse(await readFile(path, "utf8")) as StructuredRequirement;
}
