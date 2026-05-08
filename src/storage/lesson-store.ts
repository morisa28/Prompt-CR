import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { PromptMistake } from "../core/lesson-engine.ts";

export async function readMistakes(path: string): Promise<PromptMistake[]> {
  try {
    const content = await readFile(path, "utf8");
    return JSON.parse(content) as PromptMistake[];
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
