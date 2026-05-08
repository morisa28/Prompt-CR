import assert from "node:assert/strict";
import test from "node:test";
import { createRequirementSession } from "../src/core/requirement-session.ts";
import { generatePrompt } from "../src/core/prompt-generator.ts";
import { reviewGeneratedPrompt } from "../src/core/prompt-reviewer.ts";

test("generated prompt includes unrelated-refactor prohibition and verification result reporting", () => {
  const session = createRequirementSession({
    scenario: "bugfix-debugging",
    targetTool: "Codex",
    originalPrompt: "修 build。",
    answers: {
      workingDirectory: "F:/workspace/app",
      taskGoal: "修复 npm run build 报错。",
      techStack: "TypeScript",
      relatedFiles: "package.json\nsrc/main.ts",
      errorLog: "TS2322",
      reproductionSteps: "npm run build",
      modificationScope: "只改类型错误相关文件。",
      forbiddenActions: "不要新增依赖。",
      verificationCommands: "npm run build",
      outputFormat: "验证命令与结果\n剩余风险",
    },
  });
  const prompt = generatePrompt(session);

  assert.match(prompt, /不要进行无关重构/);
  assert.match(prompt, /验证命令与结果/);
  assert.match(prompt, /不要虚构验证结果/);
});

test("reviewer returns high score for generated prompt", () => {
  const session = createRequirementSession({
    scenario: "test-generation",
    targetTool: "Codex",
    originalPrompt: "给登录表单补测试。",
    answers: {
      workingDirectory: "F:/workspace/app",
      taskGoal: "为登录表单补充组件测试。",
      techStack: "React + Vitest",
      relatedFiles: "src/LoginForm.tsx\nsrc/__tests__",
      behaviors: "空输入校验；错误密码提示；成功登录回调。",
      modificationScope: "只新增或修改登录表单测试。",
      forbiddenActions: "不要改业务逻辑；不要跳过测试。",
      verificationCommands: "npm test -- LoginForm",
      outputFormat: "测试策略\n测试命令与结果\n未覆盖风险",
    },
  });
  const prompt = generatePrompt(session);
  const review = reviewGeneratedPrompt(prompt);

  assert.ok(review.score.totalScore >= 70);
  assert.equal(review.score.suitableForCodingAgent, true);
});
