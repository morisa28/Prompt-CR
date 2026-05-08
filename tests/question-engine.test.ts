import assert from "node:assert/strict";
import test from "node:test";
import { buildQuestionPlan, missingFieldsFromQuestions, nextQuestions } from "../src/core/question-engine.ts";

test("question engine exposes blocking bugfix questions", () => {
  const plan = buildQuestionPlan("bugfix-debugging", {
    workingDirectory: "F:/workspace/app",
  });

  const missingIds = plan.missingBlockingQuestions.map((question) => question.id);
  assert.ok(missingIds.includes("bugfix-error-log"));
  assert.ok(missingIds.includes("bugfix-repro"));

  const fields = missingFieldsFromQuestions(plan.missingBlockingQuestions);
  assert.ok(fields.includes("errorLog"));
  assert.ok(fields.includes("reproductionSteps"));
});

test("nextQuestions filters answered questions by level", () => {
  const questions = nextQuestions("feature-development", {
    "l1-goal": "实现收藏功能。",
  }, 1);

  assert.ok(questions.every((question) => question.level === 1));
  assert.ok(!questions.some((question) => question.id === "l1-goal"));
});
