import assert from "node:assert/strict";
import test from "node:test";
import { evaluateCoachPrompt } from "../src/web/evaluation.ts";

test("web evaluation returns structured score, generated prompt, and review result", () => {
  const result = evaluateCoachPrompt({
    scenario: "bugfix-debugging",
    targetTool: "Codex",
    originalPrompt: "帮我修一下 build 报错。",
    answers: {
      "l1-goal": "修复 npm run build 的 TypeScript 类型错误，并保持现有行为不变。",
      "l2-working-directory": "F:/workspace/demo-app",
      "l2-tech-stack": "React + TypeScript + Vite",
      "l2-related-files": "package.json\nsrc/pages/Profile.tsx",
      "bugfix-error-log": "TS2322: Type 'undefined' is not assignable to type 'User'.",
      "bugfix-repro": "npm run build",
      "l3-scope": "只修改 Profile 用户数据加载相关文件。",
      "l3-forbidden": "不要新增依赖；不要全仓库格式化。",
      "l4-verification": "npm run build\nnpm test",
      "l4-report": ["根因", "修改文件", "验证命令与结果", "剩余风险"],
    },
  });

  assert.ok(result.structuredScore.totalScore > result.originalScore.totalScore);
  assert.ok(result.generatedReview.score.suitableForCodingAgent);
  assert.equal(result.generatedReview.passed, true);
  assert.match(result.generatedPrompt, /不要进行无关重构/);
  assert.match(result.generatedPrompt, /npm run build/);
  assert.equal(result.missingBlockingQuestions.length, 0);
});
