import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQuestionPlan,
  getNextFollowUpQuestions,
  missingFieldsFromQuestions,
  nextQuestions,
} from "../src/core/question-engine.ts";

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
  const questions = nextQuestions(
    "feature-development",
    {
      "l1-goal": "实现收藏功能。",
    },
    1,
  );

  assert.ok(questions.every((question) => question.level === 1));
  assert.ok(!questions.some((question) => question.id === "l1-goal"));
});

test("bugfix follow-up prioritizes error log, repro, and related files", () => {
  const questions = getNextFollowUpQuestions({
    scenario: "bugfix-debugging",
    answers: { originalPrompt: "帮我修一下报错" },
  });

  assert.deepEqual(
    questions.map((question) => question.id),
    ["bugfix-error-log", "bugfix-repro", "l2-related-files"],
  );
  assert.ok(questions.every((question) => question.reasonText.length > 0));
});

test("feature follow-up prioritizes user flow, API contract, and verification", () => {
  const questions = getNextFollowUpQuestions({
    scenario: "feature-development",
    answers: { originalPrompt: "帮我写个登录功能" },
  });

  assert.deepEqual(
    questions.map((question) => question.id),
    ["feature-user-flow", "feature-api-contract", "l4-verification"],
  );
});

test("test generation follow-up prioritizes target, coverage, and framework", () => {
  const questions = getNextFollowUpQuestions({
    scenario: "test-generation",
    answers: { originalPrompt: "帮我补测试" },
  });

  assert.deepEqual(
    questions.map((question) => question.id),
    ["test-target", "test-behaviors", "test-framework"],
  );
});
