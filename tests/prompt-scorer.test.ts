import assert from "node:assert/strict";
import test from "node:test";
import { createRequirementSession } from "../src/core/requirement-session.ts";
import { scorePrompt } from "../src/core/prompt-scorer.ts";

test("scorer calculates higher dimension scores for structured coding requirements", () => {
  const raw = scorePrompt("帮我修一下 build 报错。");
  const structured = createRequirementSession({
    scenario: "bugfix-debugging",
    targetTool: "Codex",
    originalPrompt: "帮我修一下 build 报错。",
    answers: {
      workingDirectory: "F:/workspace/app",
      taskGoal: "修复 npm run build 报错。",
      techStack: "TypeScript + Vite",
      relatedFiles: "package.json\nsrc/App.tsx",
      errorLog: "TS2322",
      reproductionSteps: "npm run build",
      modificationScope: "只修改类型错误相关文件。",
      forbiddenActions: "不要无关重构，不要删除测试。",
      verificationCommands: "npm run build\nnpm test",
      outputFormat: "修改文件\n验证命令与结果\n剩余风险",
    },
  });
  const report = scorePrompt(structured);

  assert.ok(report.totalScore > raw.totalScore);
  assert.ok(report.dimensionScores.acceptanceCriteria > raw.dimensionScores.acceptanceCriteria);
  assert.ok(report.suitableForCodingAgent);
});

test("missing error log and locatable inputs cause deductions", () => {
  const report = scorePrompt("让 Codex 修复项目问题，越快越好。");

  assert.ok(report.dimensionScores.locatableInputs < 6);
  assert.ok(report.deductions.some((item) => item.includes("输入材料")));
  assert.ok(report.missingCriticalInfo.length > 0);
});

test("missing verification commands lowers acceptance criteria score", () => {
  const session = createRequirementSession({
    scenario: "feature-development",
    originalPrompt: "实现课程收藏功能。",
    answers: {
      workingDirectory: "F:/workspace/app",
      taskGoal: "实现课程收藏功能。",
      relatedFiles: "src/CourseCard.tsx",
      modificationScope: "只改课程卡片。",
      forbiddenActions: "不要新增依赖。",
    },
  });
  const report = scorePrompt(session);

  assert.ok(report.dimensionScores.acceptanceCriteria < 9);
  assert.ok(report.deductions.some((item) => item.includes("验收标准")));
});
