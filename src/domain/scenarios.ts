export type ScenarioId =
  | "feature-development"
  | "bugfix-debugging"
  | "refactor-architecture"
  | "test-generation"
  | "code-review"
  | "repository-analysis"
  | "api-design"
  | "database-migration"
  | "devops-ci"
  | "algorithm-problem-solving"
  | "frontend-implementation"
  | "backend-implementation";

export type TargetTool = "Codex" | "Codex CLI" | "Claude Code" | "Gemini CLI" | "ChatGPT";
export type ScenarioPriority = "core" | "extension";

export type Scenario = {
  id: ScenarioId;
  title: string;
  branchPath: string;
  description: string;
  defaultTargetTool: TargetTool;
  primaryDeliverable: string;
  nonGoals: string[];
  priority: ScenarioPriority;
  recommendedForMvp: boolean;
};

export const scenarios: Scenario[] = [
  {
    id: "feature-development",
    title: "新功能开发",
    branchPath: "branches/software-engineering/coding-feature-development.md",
    description: "把产品想法、用户流程或功能规格转成 coding agent 可执行任务。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "可实现的新功能及验证结果",
    nonGoals: ["无关重构", "无验收标准的功能堆叠"],
    priority: "core",
    recommendedForMvp: true,
  },
  {
    id: "bugfix-debugging",
    title: "Bug 修复与调试",
    branchPath: "branches/software-engineering/bugfix-debugging.md",
    description: "围绕错误日志、复现步骤和失败命令做根因定位与最小修复。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "根因明确、最小修复且验证通过的 bugfix",
    nonGoals: ["猜测修复", "删除测试", "掩盖异常"],
    priority: "core",
    recommendedForMvp: true,
  },
  {
    id: "refactor-architecture",
    title: "代码重构",
    branchPath: "branches/software-engineering/refactor-architecture.md",
    description: "在保持行为不变的前提下整理架构、模块边界和依赖关系。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "可回归验证的结构改进",
    nonGoals: ["混入新功能", "破坏公开 API"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "test-generation",
    title: "测试生成",
    branchPath: "branches/software-engineering/test-generation.md",
    description: "为函数、组件、接口或回归路径补充可运行测试。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "覆盖关键行为的测试和命令结果",
    nonGoals: ["表面测试", "弱化断言"],
    priority: "core",
    recommendedForMvp: true,
  },
  {
    id: "code-review",
    title: "代码审查",
    branchPath: "branches/software-engineering/code-review.md",
    description: "按严重程度输出可定位、可修复的 findings。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "带文件位置、风险和修复建议的审查报告",
    nonGoals: ["泛泛评价", "无证据判断"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "repository-analysis",
    title: "仓库理解",
    branchPath: "branches/software-engineering/repository-analysis.md",
    description: "只读分析仓库结构、技术栈、入口、运行方式和风险。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "有证据的仓库理解报告",
    nonGoals: ["直接修改文件", "未读取区域的确定结论"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "api-design",
    title: "API 设计",
    branchPath: "branches/software-engineering/api-design.md",
    description: "设计 REST、GraphQL 或 RPC 接口契约、鉴权、错误码和测试场景。",
    defaultTargetTool: "ChatGPT",
    primaryDeliverable: "可联调的 API 契约和示例",
    nonGoals: ["只列 endpoint", "忽略权限和错误处理"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "database-migration",
    title: "数据库迁移",
    branchPath: "branches/software-engineering/database-migration.md",
    description: "设计 schema/data migration、备份、回滚和 staging 验证路径。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "可回滚、可验证的迁移方案或 migration patch",
    nonGoals: ["无备份执行破坏性迁移", "忽略旧版本兼容"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "devops-ci",
    title: "DevOps / CI",
    branchPath: "branches/software-engineering/devops-ci.md",
    description: "处理 CI/CD、构建、部署、runner、secrets 和回滚策略。",
    defaultTargetTool: "Codex CLI",
    primaryDeliverable: "可验证的 pipeline 修改或诊断方案",
    nonGoals: ["输出真实 secrets", "删除质量门禁"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "algorithm-problem-solving",
    title: "算法与数据结构",
    branchPath: "branches/software-engineering/algorithm-problem-solving.md",
    description: "澄清题意、约束、复杂度、边界用例和验证方式。",
    defaultTargetTool: "ChatGPT",
    primaryDeliverable: "含算法思路、复杂度和测试用例的解题 prompt",
    nonGoals: ["忽略输入范围", "只给代码不解释验证"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "frontend-implementation",
    title: "前端页面与交互开发",
    branchPath: "branches/software-engineering/coding-feature-development.md",
    description: "实现页面、组件、状态、响应式和交互验收。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "可运行、可验收的前端功能",
    nonGoals: ["无设计约束的视觉发散", "忽略可访问性"],
    priority: "extension",
    recommendedForMvp: false,
  },
  {
    id: "backend-implementation",
    title: "后端接口与业务逻辑开发",
    branchPath: "branches/software-engineering/coding-feature-development.md",
    description: "实现服务端接口、业务规则、数据校验和测试。",
    defaultTargetTool: "Codex",
    primaryDeliverable: "带测试和接口验证的后端功能",
    nonGoals: ["绕过鉴权", "破坏数据兼容"],
    priority: "extension",
    recommendedForMvp: false,
  },
];

export const scenarioById = new Map<ScenarioId, Scenario>(scenarios.map((scenario) => [scenario.id, scenario]));
export const coreScenarios = scenarios.filter((scenario) => scenario.priority === "core");
export const extensionScenarios = scenarios.filter((scenario) => scenario.priority === "extension");

export function getScenario(id: ScenarioId): Scenario {
  const scenario = scenarioById.get(id);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${id}`);
  }
  return scenario;
}
