import assert from "node:assert/strict";
import test from "node:test";
import { createCoachServer } from "../src/web/server.ts";

async function withServer<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
  const server = createCoachServer();
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");

  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("web server serves metadata, questions, and evaluation APIs", async () => {
  await withServer(async (baseUrl) => {
    const metadata = await fetch(`${baseUrl}/api/scenarios`);
    assert.equal(metadata.status, 200);
    const metadataJson = await metadata.json();
    assert.ok(metadataJson.scenarios.length >= 10);
    assert.ok(metadataJson.scoringRubric.length >= 8);

    const questions = await fetch(`${baseUrl}/api/questions?scenario=bugfix-debugging`);
    assert.equal(questions.status, 200);
    const questionJson = await questions.json();
    assert.ok(questionJson.blockingQuestionIds.includes("bugfix-error-log"));

    const followUp = await fetch(`${baseUrl}/api/follow-up`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scenario: "bugfix-debugging",
        targetTool: "Codex",
        originalPrompt: "帮我修一下报错",
        answers: {},
      }),
    });
    assert.equal(followUp.status, 200);
    const followUpJson = await followUp.json();
    assert.equal(followUpJson.followUpQuestions.length, 3);
    assert.equal(followUpJson.followUpQuestions[0].id, "bugfix-error-log");

    const evaluation = await fetch(`${baseUrl}/api/evaluate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scenario: "bugfix-debugging",
        targetTool: "Codex",
        originalPrompt: "帮我修 build。",
        answers: {
          "l1-goal": "修复 npm run build 的 TypeScript 类型错误。",
          "l2-working-directory": "F:/workspace/app",
          "l2-tech-stack": "TypeScript + Vite",
          "l2-related-files": "package.json\nsrc/main.ts",
          "bugfix-error-log": "TS2322",
          "bugfix-repro": "npm run build",
          "l3-scope": "只改类型错误相关文件。",
          "l3-forbidden": "不要新增依赖；不要全仓库格式化；不要删除测试。",
          "l4-verification": "npm run build",
          "l4-report": ["修改文件", "验证命令与结果", "未验证项", "剩余风险"],
        },
      }),
    });
    assert.equal(evaluation.status, 200);
    const evaluationJson = await evaluation.json();
    assert.ok(evaluationJson.generatedPrompt.includes("npm run build"));
    assert.ok(evaluationJson.generatedReview.score.totalScore >= 70);

    const lessonSummary = await fetch(`${baseUrl}/api/lessons/summary`);
    assert.equal(lessonSummary.status, 200);
  });
});
