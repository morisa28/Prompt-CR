import { buildQuestionPlan } from "../core/question-engine.ts";
import { createPromptMistake } from "../core/lesson-engine.ts";
import { generatePrompt } from "../core/prompt-generator.ts";
import { reviewGeneratedPrompt } from "../core/prompt-reviewer.ts";
import { createRequirementSession } from "../core/requirement-session.ts";
import { scorePrompt } from "../core/prompt-scorer.ts";

function runDemo(): void {
  const session = createRequirementSession({
    scenario: "bugfix-debugging",
    targetTool: "Codex",
    originalPrompt: "帮我让 Codex 修复 npm run build 报错，不要乱改。",
    answers: {
      workingDirectory: "F:/workspace/demo-app",
      taskGoal: "修复 npm run build 的 TypeScript 类型错误，并保持现有功能不变。",
      techStack: "React + TypeScript + Vite，包管理器为 npm。",
      relatedFiles: "package.json\nsrc/pages/Profile.tsx\nsrc/api/user.ts",
      errorLog: "TS2322: Type 'undefined' is not assignable to type 'User'.",
      reproductionSteps: "npm run build",
      modificationScope: "只修改与 Profile 用户数据加载相关的文件。",
      forbiddenActions: "不要全仓库格式化；不要新增依赖；不要删除测试。",
      verificationCommands: "npm run build\nnpm test -- --runInBand",
      outputFormat: "根因\n修改文件\n关键改动\n验证命令与结果\n剩余风险",
    },
  });

  const plan = buildQuestionPlan(session.scenario, {
    ...session.rawAnswers,
    scenario: session.scenario,
    targetTool: session.targetTool,
  });
  const before = scorePrompt(session.originalPrompt);
  const generatedPrompt = generatePrompt(session);
  const review = reviewGeneratedPrompt(generatedPrompt);
  const mistake = createPromptMistake({
    scenario: session.scenario,
    originalPrompt: session.originalPrompt,
    generatedPrompt,
    before,
    after: review.score,
    weakDimensions: review.weakDimensions,
    affectedTemplate: "src/domain/prompt-template.ts",
  });

  console.log(
    JSON.stringify(
      {
        missingBlockingQuestions: plan.missingBlockingQuestions.map((question) => question.id),
        scoreBefore: before.totalScore,
        scoreAfter: review.score.totalScore,
        reviewPassed: review.passed,
        generatedPrompt,
        mistake: review.weakDimensions.length > 0 ? mistake : null,
      },
      null,
      2,
    ),
  );
}

if (process.argv.includes("--demo")) {
  runDemo();
}
