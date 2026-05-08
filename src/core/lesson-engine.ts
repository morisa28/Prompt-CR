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

export type MistakeSummary = {
  total: number;
  byScenario: Record<string, number>;
  byDimension: Record<string, number>;
  byMistakeType: Record<string, number>;
  topMissingInfo: string[];
  recommendedQuestionTreeUpdates: string[];
  recommendedScoringRuleUpdates: string[];
  recommendedTemplateUpdates: string[];
  recentMistakes: PromptMistake[];
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

function increment(counter: Record<string, number>, key: string): void {
  counter[key] = (counter[key] ?? 0) + 1;
}

function topKeys(counter: Record<string, number>, limit = 5): string[] {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => `${key}: ${count}`);
}

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
    shouldUpdateQuestionTree:
      input.weakDimensions.includes("clarity") ||
      input.weakDimensions.includes("context") ||
      input.weakDimensions.includes("locatableInputs"),
    shouldUpdateScoringRule: input.after.antiGamingWarnings.length > 0 || input.weakDimensions.length > 2,
    shouldUpdatePromptTemplate:
      input.weakDimensions.includes("constraints") || input.weakDimensions.includes("acceptanceCriteria"),
  };
}

export function summarizeMistakes(mistakes: PromptMistake[]): MistakeSummary {
  const byScenario: Record<string, number> = {};
  const byDimension: Record<string, number> = {};
  const byMistakeType: Record<string, number> = {};

  for (const mistake of mistakes) {
    increment(byScenario, mistake.scenario);
    increment(byMistakeType, mistake.mistakeType);
    for (const dimension of mistake.weakDimensions) {
      increment(byDimension, dimension);
    }
  }

  const recommendedQuestionTreeUpdates: string[] = [];
  const recommendedScoringRuleUpdates: string[] = [];
  const recommendedTemplateUpdates: string[] = [];

  if ((byDimension.acceptanceCriteria ?? 0) > 0) {
    recommendedQuestionTreeUpdates.push("在 Level 4 强化验证命令、成功标准和未验证项追问。");
    recommendedTemplateUpdates.push("在 Prompt 模板中强化验证命令、实际结果和未验证项输出。");
  }
  if ((byDimension.constraints ?? 0) > 0) {
    recommendedQuestionTreeUpdates.push("在 Level 3 增加允许修改范围、禁止文件和依赖策略的具体示例。");
    recommendedTemplateUpdates.push("在模板中强化禁止事项和最小修改边界。");
  }
  if ((byDimension.locatableInputs ?? 0) > 0) {
    recommendedQuestionTreeUpdates.push("在 Level 2 的相关文件问题中加入路径、日志和命令示例。");
  }
  if ((byDimension.context ?? 0) > 0) {
    recommendedQuestionTreeUpdates.push("在 Web UI 中把工作目录和技术栈置顶，并解释其工程意义。");
  }
  if (mistakes.some((mistake) => mistake.shouldUpdateScoringRule)) {
    recommendedScoringRuleUpdates.push("检查反作弊规则是否覆盖关键词堆砌、占位符和空泛验收。");
  }

  const frequentScenario = Object.entries(byScenario).sort((a, b) => b[1] - a[1])[0];
  if (frequentScenario && frequentScenario[1] >= 2) {
    recommendedQuestionTreeUpdates.push(`为 ${frequentScenario[0]} 增加更具体的场景专属追问。`);
  }

  return {
    total: mistakes.length,
    byScenario,
    byDimension,
    byMistakeType,
    topMissingInfo: topKeys(byDimension),
    recommendedQuestionTreeUpdates,
    recommendedScoringRuleUpdates,
    recommendedTemplateUpdates,
    recentMistakes: [...mistakes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}

export function generateIterationSuggestions(summary: MistakeSummary): string[] {
  return [
    ...summary.recommendedQuestionTreeUpdates,
    ...summary.recommendedScoringRuleUpdates,
    ...summary.recommendedTemplateUpdates,
  ].filter((item, index, list) => list.indexOf(item) === index);
}
