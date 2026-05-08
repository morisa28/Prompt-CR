import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { scorePrompt } from "../src/core/prompt-scorer.ts";

test("eval case dataset has at least 30 cases", async () => {
  const cases = JSON.parse(await readFile("evals/prompt-quality-cases.json", "utf8"));

  assert.ok(Array.isArray(cases));
  assert.ok(cases.length >= 30);
});

test("critical eval cases satisfy score boundaries", async () => {
  const cases = JSON.parse(await readFile("evals/prompt-quality-cases.json", "utf8")) as {
    id: string;
    inputPrompt: string;
    expectedMaxScore?: number;
    expectedMinScore?: number;
  }[];
  const critical = cases.filter((item) =>
    ["vague-001", "keyword-stuffing-001", "high-bugfix-001", "high-feature-001"].includes(item.id),
  );

  for (const item of critical) {
    const report = scorePrompt(item.inputPrompt);
    if (item.expectedMaxScore !== undefined) {
      assert.ok(report.totalScore <= item.expectedMaxScore, `${item.id} score ${report.totalScore}`);
    }
    if (item.expectedMinScore !== undefined) {
      assert.ok(report.totalScore >= item.expectedMinScore, `${item.id} score ${report.totalScore}`);
    }
  }
});
