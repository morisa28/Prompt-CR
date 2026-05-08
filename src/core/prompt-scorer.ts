import { scoringRubric, type ScoringDimension } from "../domain/scoring-rubric.ts";
import type { StructuredRequirement } from "./requirement-session.ts";
import { requirementToText } from "./requirement-session.ts";

export type ReadinessLevel = "not_ready" | "needs_clarification" | "usable" | "high_quality";

export type PromptScoreReport = {
  totalScore: number;
  dimensionScores: Record<ScoringDimension, number>;
  deductions: string[];
  missingCriticalInfo: string[];
  improvementSuggestions: string[];
  readinessLevel: ReadinessLevel;
  suitableForCodingAgent: boolean;
};

type EvidenceRule = {
  dimension: ScoringDimension;
  patterns: RegExp[];
  fields?: (keyof StructuredRequirement)[];
};

const rules: EvidenceRule[] = [
  {
    dimension: "clarity",
    fields: ["taskGoal", "userFlow", "behaviors", "apiContract", "businessRules"],
    patterns: [/任务目标|目标|实现|修复|重构|测试|审查|分析|设计|生成|完成/i],
  },
  {
    dimension: "context",
    fields: ["workingDirectory", "projectContext", "techStack"],
    patterns: [/工作目录|仓库|项目|技术栈|package\.json|pyproject|框架|版本|配置/i],
  },
  {
    dimension: "locatableInputs",
    fields: ["relatedFiles", "inputMaterials", "errorLog", "reproductionSteps", "reviewScope"],
    patterns: [/src\/|\.tsx?|\.jsx?|\.py|\.go|\.rs|\.java|\.yaml|\.json|路径|文件|日志|堆栈|diff|命令/i],
  },
  {
    dimension: "constraints",
    fields: ["modificationScope", "forbiddenActions", "nonGoals"],
    patterns: [/禁止|不要|不能|只允许|范围|非目标|保持|兼容|不得|最小修改|无关重构/i],
  },
  {
    dimension: "outputFormat",
    fields: ["outputFormat"],
    patterns: [/输出|报告|格式|字段|章节|修改文件|关键变更|验证结果|风险/i],
  },
  {
    dimension: "acceptanceCriteria",
    fields: ["acceptanceCriteria", "verificationCommands"],
    patterns: [/验收|测试|验证|npm test|npm run|pytest|cargo test|go test|build|lint|通过|成功标准/i],
  },
  {
    dimension: "riskHandling",
    fields: ["failureHandling"],
    patterns: [/失败|无法验证|阻塞|风险|回滚|备份|不确定|剩余风险|报告原因/i],
  },
  {
    dimension: "agentAdaptation",
    fields: ["targetTool", "workingDirectory"],
    patterns: [/Codex|Codex CLI|Claude Code|Gemini CLI|coding agent|先读|最小修改|验证命令|不要虚构/i],
  },
];

function textFor(input: string | StructuredRequirement): string {
  return typeof input === "string" ? input : requirementToText(input);
}

function fieldEvidence(input: string | StructuredRequirement, fields: (keyof StructuredRequirement)[] = []): number {
  if (typeof input === "string") {
    return 0;
  }

  return fields.reduce((score, field) => {
    const value = input[field];
    if (Array.isArray(value)) {
      return score + (value.filter(Boolean).length > 0 ? 1 : 0);
    }
    return score + (typeof value === "string" && value.trim().length > 0 ? 1 : 0);
  }, 0);
}

function dimensionScore(input: string | StructuredRequirement, dimension: ScoringDimension): number {
  const definition = scoringRubric.find((item) => item.key === dimension);
  if (!definition) {
    throw new Error(`Unknown scoring dimension: ${dimension}`);
  }

  const text = textFor(input);
  const rule = rules.find((item) => item.dimension === dimension);
  const hasTextEvidence = rule?.patterns.some((pattern) => pattern.test(text)) ?? false;
  const fields = fieldEvidence(input, rule?.fields);

  const evidence =
    typeof input === "string"
      ? (hasTextEvidence ? 0.85 : 0)
      : Math.min(1, (fields > 0 ? 0.75 : 0) + (hasTextEvidence ? 0.25 : 0));
  const score = Math.round(definition.maxScore * evidence);
  return Math.max(0, Math.min(definition.maxScore, score));
}

function readiness(totalScore: number): ReadinessLevel {
  if (totalScore >= 85) {
    return "high_quality";
  }
  if (totalScore >= 70) {
    return "usable";
  }
  if (totalScore >= 45) {
    return "needs_clarification";
  }
  return "not_ready";
}

export function scorePrompt(input: string | StructuredRequirement): PromptScoreReport {
  const dimensionScores = Object.fromEntries(
    scoringRubric.map((dimension) => [dimension.key, dimensionScore(input, dimension.key)]),
  ) as Record<ScoringDimension, number>;

  const deductions: string[] = [];
  const missingCriticalInfo: string[] = [];
  const improvementSuggestions: string[] = [];

  for (const dimension of scoringRubric) {
    const score = dimensionScores[dimension.key];
    if (score < Math.ceil(dimension.maxScore * 0.6)) {
      deductions.push(`${dimension.label}不足：${dimension.description}`);
      missingCriticalInfo.push(dimension.missingHint);
      improvementSuggestions.push(dimension.missingHint);
    }
  }

  const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
  const readinessLevel = readiness(totalScore);

  return {
    totalScore,
    dimensionScores,
    deductions,
    missingCriticalInfo: missingCriticalInfo.slice(0, 3),
    improvementSuggestions,
    readinessLevel,
    suitableForCodingAgent: readinessLevel === "usable" || readinessLevel === "high_quality",
  };
}
