import assert from "node:assert/strict";
import test from "node:test";
import { createRequirementSession } from "../src/core/requirement-session.ts";
import { scorePrompt } from "../src/core/prompt-scorer.ts";

test("very vague prompt scores below 30", () => {
  const report = scorePrompt("帮我改一下");

  assert.ok(report.totalScore < 30);
  assert.equal(report.readinessLevel, "not_ready");
});

test("keyword stuffing cannot fake a high prompt score", () => {
  const report = scorePrompt("任务目标 上下文 文件路径 错误日志 验证命令 风险 Codex 输出格式 约束");

  assert.ok(report.totalScore <= 35);
  assert.ok(report.antiGamingWarnings.some((warning) => warning.includes("关键词堆砌")));
});

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

test("concrete bugfix prompt scores as usable", () => {
  const report = scorePrompt(`请让 Codex 在 F:/workspace/app 修复 npm run build 的 TS2322 报错。
相关文件：package.json、src/pages/Profile.tsx、src/api/user.ts。
错误日志：TS2322: Type 'undefined' is not assignable to type 'User'。
复现命令：npm run build。
只允许修改 Profile 用户数据加载相关文件，不要新增依赖，不要全仓库格式化，不要删除测试。
完成后运行 npm run build 和 npm test -- --runInBand。
最终输出根因、修改文件、验证命令与实际结果、未验证项和剩余风险。`);

  assert.ok(report.totalScore > 75);
  assert.equal(report.suitableForCodingAgent, true);
});

test("vague constraints do not earn high constraint score", () => {
  const report = scorePrompt("请修复问题，不要乱改。测试通过。");

  assert.ok(report.dimensionScores.constraints < 8);
  assert.ok(report.dimensionScores.acceptanceCriteria < 8);
});

test("vague placeholders produce anti-gaming warnings", () => {
  const report = scorePrompt("请修复你的项目，相关文件：具体路径，错误日志：TODO，测试命令：待补充。");

  assert.ok(report.antiGamingWarnings.some((warning) => warning.includes("空泛占位符")));
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
