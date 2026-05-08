import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createPromptMistake, generateIterationSuggestions, summarizeMistakes } from "../src/core/lesson-engine.ts";
import { scorePrompt } from "../src/core/prompt-scorer.ts";
import { loadPromptMistakes, loadMistakeSummary, savePromptMistake } from "../src/storage/lesson-store.ts";

test("lesson engine records low-score dimensions", () => {
  const before = scorePrompt("帮我修一下。");
  const after = scorePrompt("你是 Codex，请修复问题，但没有验证命令。");
  const mistake = createPromptMistake({
    scenario: "bugfix-debugging",
    originalPrompt: "帮我修一下。",
    generatedPrompt: "你是 Codex，请修复问题，但没有验证命令。",
    before,
    after,
    weakDimensions: ["acceptanceCriteria", "locatableInputs"],
    affectedTemplate: "templates.md",
  });

  assert.equal(mistake.scenario, "bugfix-debugging");
  assert.ok(mistake.weakDimensions.includes("acceptanceCriteria"));
  assert.equal(mistake.shouldUpdatePromptTemplate, true);
});

test("summarizeMistakes counts frequent weak dimensions", () => {
  const before = scorePrompt("修一下。");
  const after = scorePrompt("Codex 修复问题。");
  const mistakes = [
    createPromptMistake({
      scenario: "bugfix-debugging",
      originalPrompt: "a",
      generatedPrompt: "b",
      before,
      after,
      weakDimensions: ["context", "acceptanceCriteria"],
    }),
    createPromptMistake({
      scenario: "test-generation",
      originalPrompt: "c",
      generatedPrompt: "d",
      before,
      after,
      weakDimensions: ["acceptanceCriteria"],
    }),
  ];

  const summary = summarizeMistakes(mistakes);
  assert.equal(summary.byDimension.acceptanceCriteria, 2);
  assert.ok(generateIterationSuggestions(summary).some((item) => item.includes("验证命令")));
});

test("lesson store saves, reads, and summarizes prompt mistakes", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "prompt-cr-lessons-"));
  const path = join(tempDir, "prompt-mistakes.json");
  const before = scorePrompt("修一下。");
  const after = scorePrompt("请在 F:/workspace/app 修复 src/App.tsx 的 TS2322，并运行 npm run build。");
  const mistake = createPromptMistake({
    scenario: "bugfix-debugging",
    originalPrompt: "修一下。",
    generatedPrompt: "请在 F:/workspace/app 修复 src/App.tsx 的 TS2322，并运行 npm run build。",
    before,
    after,
    weakDimensions: ["acceptanceCriteria", "constraints"],
  });

  try {
    await savePromptMistake(mistake, path);
    const loaded = await loadPromptMistakes(path);
    const summary = await loadMistakeSummary(path);

    assert.equal(loaded.length, 1);
    assert.equal(summary.total, 1);
    assert.ok(summary.suggestions.length > 0);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
