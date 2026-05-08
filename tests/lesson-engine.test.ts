import assert from "node:assert/strict";
import test from "node:test";
import { createPromptMistake, summarizeMistakes } from "../src/core/lesson-engine.ts";
import { scorePrompt } from "../src/core/prompt-scorer.ts";

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

  assert.equal(summarizeMistakes(mistakes)[0], "acceptanceCriteria: 2");
});
