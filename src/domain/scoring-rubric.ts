export type ScoringDimension =
  | "clarity"
  | "context"
  | "locatableInputs"
  | "constraints"
  | "outputFormat"
  | "acceptanceCriteria"
  | "riskHandling"
  | "agentAdaptation";

export type DimensionDefinition = {
  key: ScoringDimension;
  label: string;
  maxScore: number;
  description: string;
  missingHint: string;
};

export const scoringRubric: DimensionDefinition[] = [
  {
    key: "clarity",
    label: "任务目标清晰度",
    maxScore: 15,
    description: "是否明确要做什么、做到什么程度、最终交付物是什么。",
    missingHint: "补充任务目标、目标对象和完成定义。",
  },
  {
    key: "context",
    label: "上下文完整度",
    maxScore: 15,
    description: "是否包含项目背景、技术栈、工作目录、相关模块和已有行为。",
    missingHint: "补充项目路径、技术栈、相关模块和已有约定。",
  },
  {
    key: "locatableInputs",
    label: "输入材料可定位性",
    maxScore: 10,
    description: "是否给出文件路径、命令、日志、截图、数据或 diff 等可定位材料。",
    missingHint: "补充相关文件路径、失败命令、错误日志或复现材料。",
  },
  {
    key: "constraints",
    label: "约束与禁止事项",
    maxScore: 15,
    description: "是否说明允许范围、禁止事项、兼容性和依赖策略。",
    missingHint: "补充禁止无关重构、禁止删除功能、依赖和兼容边界。",
  },
  {
    key: "outputFormat",
    label: "输出格式明确度",
    maxScore: 10,
    description: "是否说明最终报告章节、字段或输出结构。",
    missingHint: "补充最终输出格式，例如修改文件、验证结果、风险。",
  },
  {
    key: "acceptanceCriteria",
    label: "验收标准可检查性",
    maxScore: 15,
    description: "是否包含测试命令、构建命令、手动验收步骤或成功标准。",
    missingHint: "补充验证命令、验收标准和成功/失败判断。",
  },
  {
    key: "riskHandling",
    label: "风险与异常处理",
    maxScore: 10,
    description: "是否要求说明失败、不可验证、阻塞项和潜在风险。",
    missingHint: "补充失败处理、不可验证说明和剩余风险报告。",
  },
  {
    key: "agentAdaptation",
    label: "coding agent 适配度",
    maxScore: 10,
    description: "是否适合 Codex、Codex CLI、Claude Code、Gemini CLI 等 agent 读取、修改、验证、汇报。",
    missingHint: "补充目标工具、工作目录、先读文件、最小修改和验证报告要求。",
  },
];

export const maxPromptScore = scoringRubric.reduce((sum, dimension) => sum + dimension.maxScore, 0);
