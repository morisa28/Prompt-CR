import type { ScoringDimension } from "../domain/scoring-rubric.ts";
import type { ScenarioId } from "../domain/scenarios.ts";
import type { PromptScoreReport } from "./prompt-scorer.ts";

export type PromptMistake = {
  id: string;
  createdAt: string;
  scenario: string;
  originalPrompt: string;
  generatedPrompt: string;
  scoreBefore: number;
  scoreAfter: number;
  weakDimensions: string[];
  mistakeType: string;
  mistakeDescription: string;
  suggestedFix: string;
  affectedTemplate?: string;
  shouldUpdateQuestionTree: boolean;
  shouldUpdateScoringRule: boolean;
  shouldUpdatePromptTemplate: boolean;
};

const dimensionMistakeType: Record<ScoringDimension, string> = {
  clarity: "目标不清",
  context: "缺少项目上下文",
  locatableInputs: "缺少相关文件路径或日志",
  constraints: "缺少禁止事项",
  outputFormat: "输出格式不明确",
  acceptanceCriteria: "缺少验证命令或验收标准",
  riskHandling: "风险与异常处理不足",
  agentAdaptation: "对 coding agent 约束不足",
};

export function createPromptMistake(input: {
  scenario: ScenarioId;
  originalPrompt: string;
  generatedPrompt: string;
  before: PromptScoreReport;
  after: PromptScoreReport;
  weakDimensions: ScoringDimension[];
  affectedTemplate?: string;
}): PromptMistake {
  const primaryWeak = input.weakDimensions[0] ?? "clarity";
  const missing = input.after.missingCriticalInfo.join("；") || input.before.missingCriticalInfo.join("；");

  return {
    id: `mistake-${input.scenario}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    scenario: input.scenario,
    originalPrompt: input.originalPrompt,
    generatedPrompt: input.generatedPrompt,
    scoreBefore: input.before.totalScore,
    scoreAfter: input.after.totalScore,
    weakDimensions: input.weakDimensions,
    mistakeType: dimensionMistakeType[primaryWeak],
    mistakeDescription: `生成后仍存在低分维度：${input.weakDimensions.join(", ")}。`,
    suggestedFix: missing || "补充目标、上下文、约束、验证和报告格式。",
    affectedTemplate: input.affectedTemplate,
    shouldUpdateQuestionTree: input.weakDimensions.includes("clarity") || input.weakDimensions.includes("context"),
    shouldUpdateScoringRule: input.after.totalScore > input.before.totalScore + 30 && input.weakDimensions.length > 2,
    shouldUpdatePromptTemplate: input.weakDimensions.includes("constraints") || input.weakDimensions.includes("acceptanceCriteria"),
  };
}

export function summarizeMistakes(mistakes: PromptMistake[]): string[] {
  const counts = new Map<string, number>();
  for (const mistake of mistakes) {
    for (const dimension of mistake.weakDimensions) {
      counts.set(dimension, (counts.get(dimension) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([dimension, count]) => `${dimension}: ${count}`);
}
