import { maxPromptScore, scoringRubric, type ScoringDimension } from "../domain/scoring-rubric.ts";
import type { StructuredRequirement } from "./requirement-session.ts";
import { requirementToText } from "./requirement-session.ts";

export type ReadinessLevel = "not_ready" | "needs_clarification" | "usable" | "high_quality";

export type DimensionEvidence = {
  keywordEvidence: number;
  fieldEvidence: number;
  contentQualityEvidence: number;
  antiGamingPenalty: number;
};

export type ConcreteArtifactReport = {
  filePaths: string[];
  commands: string[];
  errorSignals: string[];
  apiRoutes: string[];
  databaseArtifacts: string[];
  hasConcreteArtifacts: boolean;
};

export type PromptScoreReport = {
  totalScore: number;
  dimensionScores: Record<ScoringDimension, number>;
  dimensionEvidence: Record<ScoringDimension, DimensionEvidence>;
  deductions: string[];
  missingCriticalInfo: string[];
  improvementSuggestions: string[];
  antiGamingWarnings: string[];
  concreteArtifacts: ConcreteArtifactReport;
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
    patterns: [/任务目标|目标|实现|修复|重构|测试|审查|分析|设计|生成|完成|增加|补充|覆盖/i],
  },
  {
    dimension: "context",
    fields: ["workingDirectory", "projectContext", "techStack"],
    patterns: [/工作目录|仓库|项目|技术栈|package\.json|pyproject|框架|版本|配置/i],
  },
  {
    dimension: "locatableInputs",
    fields: ["relatedFiles", "inputMaterials", "errorLog", "reproductionSteps", "reviewScope"],
    patterns: [
      /src\/|app\/|packages\/|\.tsx?|\.jsx?|\.py|\.go|\.rs|\.java|\.ya?ml|\.json|路径|文件|日志|堆栈|diff|命令/i,
    ],
  },
  {
    dimension: "constraints",
    fields: ["modificationScope", "forbiddenActions", "nonGoals"],
    patterns: [/禁止|不要|不能|只允许|范围|非目标|保持|兼容|不得|不改|不改变|最小修改|无关重构/i],
  },
  {
    dimension: "outputFormat",
    fields: ["outputFormat"],
    patterns: [/输出|报告|格式|字段|章节|修改文件|关键变更|验证结果|风险|未验证项/i],
  },
  {
    dimension: "acceptanceCriteria",
    fields: ["acceptanceCriteria", "verificationCommands"],
    patterns: [/验收|测试|验证|npm test|npm run|pnpm|pytest|cargo test|go test|build|lint|通过|成功标准/i],
  },
  {
    dimension: "riskHandling",
    fields: ["failureHandling"],
    patterns: [/失败|无法验证|阻塞|风险|回滚|备份|不确定|剩余风险|报告原因|未验证项/i],
  },
  {
    dimension: "agentAdaptation",
    fields: ["targetTool", "workingDirectory"],
    patterns: [/Codex|Codex CLI|Claude Code|Gemini CLI|coding agent|先读|先阅读|最小修改|验证命令|不要虚构/i],
  },
];

const keywordStuffingTerms = [
  "任务目标",
  "上下文",
  "文件路径",
  "错误日志",
  "验证命令",
  "风险",
  "Codex",
  "输出格式",
  "约束",
  "验收",
  "测试",
];

const vagueLinePatterns = [
  /^相关文件$/i,
  /^具体路径$/i,
  /^错误日志$/i,
  /^测试命令$/i,
  /^你的项目$/i,
  /^某个模块$/i,
  /^若干文件$/i,
  /^等等$/i,
  /^n\/a$/i,
  /^todo$/i,
  /待补充/i,
  /具体路径/i,
  /某个模块/i,
  /若干文件/i,
  /你的项目/i,
];

const vagueGoalPatterns = [/帮我改一下|优化一下|修一下|写个功能|处理一下|弄一下|看一下/];
const vagueConstraintPatterns = [/不要乱改|注意安全|保持稳定|别搞坏|尽量少改/];
const vagueAcceptancePatterns = [/能运行就行|测试通过|跑通即可|没问题就行/];

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function textFor(input: string | StructuredRequirement): string {
  return typeof input === "string" ? input : requirementToText(input);
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function isMeaningfulValue(value: string): boolean {
  const clean = normalizeWhitespace(value);
  if (clean.length < 3) {
    return false;
  }
  if (detectVaguePlaceholders(clean).length > 0 && clean.length < 18) {
    return false;
  }
  return ![...vagueGoalPatterns, ...vagueConstraintPatterns, ...vagueAcceptancePatterns].some((pattern) =>
    pattern.test(clean),
  );
}

function fieldEvidence(input: string | StructuredRequirement, fields: (keyof StructuredRequirement)[] = []): number {
  if (typeof input === "string" || fields.length === 0) {
    return 0;
  }

  const meaningfulCount = fields.reduce((score, field) => {
    const value = input[field];
    if (Array.isArray(value)) {
      return score + (value.some((item) => isMeaningfulValue(item)) ? 1 : 0);
    }
    return score + (typeof value === "string" && isMeaningfulValue(value) ? 1 : 0);
  }, 0);

  return clamp((meaningfulCount / fields.length) * 0.4, 0, 0.4);
}

export function detectKeywordStuffing(text: string): boolean {
  const normalized = normalizeWhitespace(text);
  const matchedTerms = keywordStuffingTerms.filter((term) => normalized.includes(term));
  const artifacts = detectConcreteArtifacts(text);
  const shortKeywordOnly = normalized.length <= 120 && matchedTerms.length >= 6 && !artifacts.hasConcreteArtifacts;
  const mostlyNouns = matchedTerms.length >= 8 && normalized.split(/[，,；;\s]+/).filter(Boolean).length <= 16;
  return shortKeywordOnly || mostlyNouns;
}

export function detectVaguePlaceholders(text: string): string[] {
  const lines = text
    .split(/\r?\n|[；;]/)
    .map((line) => line.trim())
    .filter(Boolean);
  const hits: string[] = [];

  for (const line of lines) {
    for (const pattern of vagueLinePatterns) {
      if (pattern.test(line)) {
        hits.push(line);
      }
    }
  }

  return unique(hits);
}

export function detectConcreteArtifacts(text: string): ConcreteArtifactReport {
  const filePaths = unique(
    text.match(
      /(?:[A-Za-z]:[\\/])?(?:(?:src|app|packages|tests|scripts|docs|public|lib|server|client|migrations)[\\/][\w./\\-]+|[\w.-]+\.(?:tsx|ts|jsx|json|js|py|ya?ml|md|go|rs|java|cs|vue|svelte|sql))/gi,
    ) ?? [],
  );
  const commands = unique(
    text.match(
      /\b(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?[\w:-]+(?:\s+[^。\n；;]*)?|pytest(?:\s+[^。\n；;]*)?|go test(?:\s+[^。\n；;]*)?|cargo test(?:\s+[^。\n；;]*)?|mvn test(?:\s+[^。\n；;]*)?)\b/gi,
    ) ?? [],
  );
  const errorSignals = unique(
    text.match(/\b(?:TS\d{4}|E[A-Z0-9]{2,}|HTTP\s*[45]\d\d|TypeError|ReferenceError|AssertionError|stack trace)\b/gi) ??
      [],
  );
  const apiRoutes = unique(text.match(/\b(?:GET|POST|PUT|PATCH|DELETE)\s+\/api\/[^\s，。；;]+/gi) ?? []);
  const databaseArtifacts = unique(
    text.match(/\b(?:\w+\s*表|migration|migrations\/[\w./-]+|schema|CREATE TABLE|ALTER TABLE)\b/gi) ?? [],
  );

  return {
    filePaths,
    commands,
    errorSignals,
    apiRoutes,
    databaseArtifacts,
    hasConcreteArtifacts:
      filePaths.length + commands.length + errorSignals.length + apiRoutes.length + databaseArtifacts.length > 0,
  };
}

function hasPattern(patterns: RegExp[], text: string): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function qualityEvidence(
  input: string | StructuredRequirement,
  dimension: ScoringDimension,
  artifacts: ConcreteArtifactReport,
): number {
  const text = textFor(input);
  const normalized = normalizeWhitespace(text);
  const hasFileOrCommand = artifacts.filePaths.length > 0 || artifacts.commands.length > 0;

  switch (dimension) {
    case "clarity": {
      const goal = typeof input === "string" ? normalized : normalizeWhitespace(input.taskGoal ?? input.originalPrompt);
      if (vagueGoalPatterns.some((pattern) => pattern.test(goal)) && goal.length < 18) {
        return 0;
      }
      return clamp(
        (goal.length >= 18 ? 0.35 : 0.1) + (/修复|实现|补充|生成|重构|审查|分析|增加|覆盖|调用/.test(goal) ? 0.2 : 0),
        0,
        0.55,
      );
    }
    case "context":
      return clamp(
        (typeof input !== "string" && input.workingDirectory ? 0.22 : 0) +
          (/(?:[A-Za-z]:[\\/][\w .\\/:-]+|\/workspace\/|\bworkspace\b|工作目录|仓库|项目)/i.test(text) ? 0.18 : 0) +
          (artifacts.filePaths.some((item) => item.includes("package.json") || item.includes("pyproject")) ? 0.2 : 0) +
          (/React|TypeScript|Vite|Node|Python|Go|Java|Vitest|Jest|Testing Library|组件测试|集成测试|框架|包管理器|技术栈|相关文件|测试目录/i.test(
            text,
          )
            ? 0.2
            : 0) +
          (/测试|组件|集成|单元|e2e|mock|stub/i.test(text) && artifacts.filePaths.length > 0 ? 0.08 : 0),
        0,
        0.75,
      );
    case "locatableInputs":
      return clamp(
        (artifacts.filePaths.length > 0 ? 0.28 : 0) +
          (artifacts.commands.length > 0 ? 0.14 : 0) +
          (artifacts.errorSignals.length > 0 ? 0.18 : 0),
        0,
        0.6,
      );
    case "constraints": {
      const onlyVague = vagueConstraintPatterns.some((pattern) => pattern.test(normalized)) && normalized.length < 40;
      if (onlyVague) {
        return 0.05;
      }
      return clamp(
        (/只允许|只修改|不要新增依赖|不要删除|不要全仓库格式化|保持.*不变|不改变.*API|禁止/.test(text) ? 0.3 : 0) +
          (/不改|不改变|不新增依赖|不跳过测试|不弱化|不要改|不要删除|只新增|只修改/.test(text) ? 0.18 : 0) +
          (artifacts.filePaths.length > 0 || /schema|依赖|public API|数据库|路由|mock|stub/.test(text) ? 0.14 : 0),
        0,
        0.65,
      );
    }
    case "outputFormat":
      return clamp(
        (/修改文件|关键变更|验证命令与结果|实际结果|未验证项|剩余风险|根因|最终报告|最终输出/.test(text) ? 0.52 : 0) +
          (/列表|章节|字段|测试策略|未覆盖风险|未覆盖项|验证结果/.test(text) ? 0.1 : 0),
        0,
        0.62,
      );
    case "acceptanceCriteria": {
      const onlyVague = vagueAcceptancePatterns.some((pattern) => pattern.test(normalized)) && normalized.length < 40;
      if (onlyVague) {
        return 0.05;
      }
      return clamp(
        (artifacts.commands.length > 0 ? 0.34 : 0) +
          (/手动验证|成功标准|验收|验证.*结果|实际结果|通过.*判断|回归验证|测试策略|覆盖|未覆盖|运行/.test(text)
            ? 0.28
            : 0),
        0,
        0.7,
      );
    }
    case "riskHandling":
      return clamp(
        /无法验证|失败.*原因|阻塞|剩余风险|回滚|未验证项|未覆盖|风险|替代检查/.test(text) ? 0.58 : 0,
        0,
        0.62,
      );
    case "agentAdaptation":
      return clamp(
        (/Codex|Codex CLI|Claude Code|Gemini CLI|coding agent/i.test(text) ? 0.2 : 0) +
          (/先阅读|先读|最小修改|不要虚构|运行验证命令|验证命令|不要新增依赖|不要全仓库格式化|不要删除测试|最终报告|最终输出/.test(
            text,
          )
            ? 0.35
            : 0) +
          (/只允许|只修改|不改|不要改|不新增依赖|不跳过测试/.test(text) ? 0.12 : 0) +
          (hasFileOrCommand ? 0.12 : 0),
        0,
        0.8,
      );
  }
}

function dimensionEvidence(input: string | StructuredRequirement, dimension: ScoringDimension): DimensionEvidence {
  const text = textFor(input);
  const artifacts = detectConcreteArtifacts(text);
  const rule = rules.find((item) => item.dimension === dimension);
  const keywordEvidence = hasPattern(rule?.patterns ?? [], text) ? 0.18 : 0;
  const fields = fieldEvidence(input, rule?.fields);
  const contentQualityEvidence = qualityEvidence(input, dimension, artifacts);
  const placeholders = detectVaguePlaceholders(text);
  const antiGamingPenalty =
    (detectKeywordStuffing(text) ? 0.55 : 0) +
    Math.min(0.22, placeholders.length * 0.06) +
    (dimension === "constraints" && vagueConstraintPatterns.some((pattern) => pattern.test(text)) ? 0.1 : 0) +
    (dimension === "acceptanceCriteria" && vagueAcceptancePatterns.some((pattern) => pattern.test(text)) ? 0.1 : 0);

  return {
    keywordEvidence,
    fieldEvidence: fields,
    contentQualityEvidence,
    antiGamingPenalty,
  };
}

function dimensionScore(input: string | StructuredRequirement, dimension: ScoringDimension): number {
  const definition = scoringRubric.find((item) => item.key === dimension);
  if (!definition) {
    throw new Error(`Unknown scoring dimension: ${dimension}`);
  }

  const evidence = dimensionEvidence(input, dimension);
  const ratio = clamp(
    evidence.keywordEvidence + evidence.fieldEvidence + evidence.contentQualityEvidence - evidence.antiGamingPenalty,
  );
  return Math.max(0, Math.min(definition.maxScore, Math.round(definition.maxScore * ratio)));
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

function antiGamingWarnings(text: string): string[] {
  const warnings: string[] = [];
  if (detectKeywordStuffing(text)) {
    warnings.push("疑似关键词堆砌：包含评分关键词但缺少真实路径、命令、日志或验收细节。");
  }

  const placeholders = detectVaguePlaceholders(text);
  if (placeholders.length > 0) {
    warnings.push(`存在空泛占位符：${placeholders.slice(0, 5).join("、")}。`);
  }

  if (vagueConstraintPatterns.some((pattern) => pattern.test(text))) {
    warnings.push("约束表达偏空泛，建议具体说明允许修改范围、禁止文件、依赖和兼容边界。");
  }

  if (vagueAcceptancePatterns.some((pattern) => pattern.test(text))) {
    warnings.push("验收表达偏空泛，建议给出可运行命令、手动验证步骤和成功/失败判断。");
  }

  return warnings;
}

export function scorePrompt(input: string | StructuredRequirement): PromptScoreReport {
  const text = textFor(input);
  const concreteArtifacts = detectConcreteArtifacts(text);
  const dimensionEvidenceMap = Object.fromEntries(
    scoringRubric.map((dimension) => [dimension.key, dimensionEvidence(input, dimension.key)]),
  ) as Record<ScoringDimension, DimensionEvidence>;
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

  const warnings = antiGamingWarnings(text);
  const rawTotal = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
  const globalPenalty = warnings.length > 0 ? Math.min(8, warnings.length * 3) : 0;
  const totalScore = Math.max(0, Math.min(maxPromptScore, rawTotal - globalPenalty));
  const readinessLevel = readiness(totalScore);

  return {
    totalScore,
    dimensionScores,
    dimensionEvidence: dimensionEvidenceMap,
    deductions,
    missingCriticalInfo: missingCriticalInfo.slice(0, 3),
    improvementSuggestions,
    antiGamingWarnings: warnings,
    concreteArtifacts,
    readinessLevel,
    suitableForCodingAgent: readinessLevel === "usable" || readinessLevel === "high_quality",
  };
}
