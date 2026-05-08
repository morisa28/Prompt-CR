import type { ScenarioId } from "./scenarios.ts";
import { scenarios } from "./scenarios.ts";

export type AnswerType = "text" | "single-choice" | "multi-choice" | "file-path" | "command" | "log";

export type QuestionNode = {
  id: string;
  level: 0 | 1 | 2 | 3 | 4;
  scenario: ScenarioId | "all";
  question: string;
  helpText?: string;
  answerType: AnswerType;
  required: boolean;
  blocking: boolean;
  options?: string[];
  fillsPromptField: string[];
  scoringDimensions: string[];
  next?: string[];
  branchWhen?: {
    field: string;
    includes: string;
    next: string[];
  };
};

const level0: QuestionNode = {
  id: "l0-task-type",
  level: 0,
  scenario: "all",
  question: "你想让 AI 帮你完成哪类代码生成任务？",
  answerType: "single-choice",
  required: true,
  blocking: true,
  options: scenarios.map((scenario) => `${scenario.id}: ${scenario.title}`),
  fillsPromptField: ["scenario"],
  scoringDimensions: ["clarity", "agentAdaptation"],
  next: ["l1-goal", "l1-deliverable"],
};

const sharedQuestions: QuestionNode[] = [
  level0,
  {
    id: "l1-goal",
    level: 1,
    scenario: "all",
    question: "最终希望得到什么结果？请用一句话说明任务目标。",
    helpText: "例如：修复 npm run build 的 TS 类型错误，并保证现有测试通过。",
    answerType: "text",
    required: true,
    blocking: true,
    fillsPromptField: ["taskGoal"],
    scoringDimensions: ["clarity"],
    next: ["l1-deliverable"],
  },
  {
    id: "l1-deliverable",
    level: 1,
    scenario: "all",
    question: "希望 AI 直接修改代码、只输出方案，还是生成可交给 coding agent 的 prompt？",
    answerType: "single-choice",
    required: true,
    blocking: false,
    options: ["直接修改代码", "只输出方案", "生成 coding agent prompt", "先分析再确认"],
    fillsPromptField: ["deliveryMode", "outputFormat"],
    scoringDimensions: ["clarity", "outputFormat"],
    next: ["l2-working-directory", "l2-tech-stack"],
  },
  {
    id: "l2-working-directory",
    level: 2,
    scenario: "all",
    question: "工作目录或仓库路径在哪里？",
    answerType: "file-path",
    required: true,
    blocking: true,
    fillsPromptField: ["workingDirectory"],
    scoringDimensions: ["context", "locatableInputs", "agentAdaptation"],
    next: ["l2-related-files"],
  },
  {
    id: "l2-tech-stack",
    level: 2,
    scenario: "all",
    question: "项目技术栈、包管理器、框架或语言版本是什么？如果不清楚，可说明让 agent 从配置识别。",
    answerType: "text",
    required: false,
    blocking: false,
    fillsPromptField: ["techStack", "projectContext"],
    scoringDimensions: ["context"],
    next: ["l2-related-files"],
  },
  {
    id: "l2-related-files",
    level: 2,
    scenario: "all",
    question: "相关文件、目录、日志、截图、配置或 diff 在哪里？",
    answerType: "text",
    required: false,
    blocking: false,
    fillsPromptField: ["relatedFiles", "inputMaterials"],
    scoringDimensions: ["locatableInputs", "context"],
    next: ["l3-scope", "l3-forbidden"],
  },
  {
    id: "l3-scope",
    level: 3,
    scenario: "all",
    question: "允许修改的范围是什么？是否允许新增依赖、调整接口或重构相关模块？",
    answerType: "text",
    required: true,
    blocking: false,
    fillsPromptField: ["modificationScope", "dependencyPolicy"],
    scoringDimensions: ["constraints"],
    next: ["l3-forbidden"],
  },
  {
    id: "l3-forbidden",
    level: 3,
    scenario: "all",
    question: "哪些文件、行为、API、数据结构或用户功能禁止修改？",
    answerType: "text",
    required: false,
    blocking: false,
    fillsPromptField: ["forbiddenActions", "nonGoals"],
    scoringDimensions: ["constraints", "riskHandling"],
    next: ["l4-verification", "l4-report"],
  },
  {
    id: "l4-verification",
    level: 4,
    scenario: "all",
    question: "需要运行哪些命令或手动步骤验证结果？",
    answerType: "command",
    required: true,
    blocking: false,
    fillsPromptField: ["verificationCommands", "acceptanceCriteria"],
    scoringDimensions: ["acceptanceCriteria", "agentAdaptation"],
    next: ["l4-report"],
  },
  {
    id: "l4-report",
    level: 4,
    scenario: "all",
    question: "最终报告希望包含哪些内容？",
    answerType: "multi-choice",
    required: false,
    blocking: false,
    options: ["修改文件", "关键变更", "验证命令与结果", "未验证项", "剩余风险", "后续建议"],
    fillsPromptField: ["outputFormat", "failureHandling"],
    scoringDimensions: ["outputFormat", "riskHandling"],
  },
];

const scenarioSpecific: Record<ScenarioId, QuestionNode[]> = {
  "feature-development": [
    {
      id: "feature-user-flow",
      level: 1,
      scenario: "feature-development",
      question: "这个新功能的用户流程是什么？请描述用户从进入到完成的主要路径。",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["userFlow", "acceptanceCriteria"],
      scoringDimensions: ["clarity", "acceptanceCriteria"],
    },
    {
      id: "feature-api-contract",
      level: 2,
      scenario: "feature-development",
      question: "这个功能涉及哪些 UI、API 或数据流？请说明接口输入输出或由 agent 从现有代码识别。",
      helpText: "例如：POST /api/favorites，body: { courseId }，返回 { favorited: true }。",
      answerType: "text",
      required: false,
      blocking: false,
      fillsPromptField: ["apiContract", "inputMaterials"],
      scoringDimensions: ["context", "locatableInputs", "acceptanceCriteria"],
    },
    {
      id: "feature-edge-states",
      level: 3,
      scenario: "feature-development",
      question: "需要覆盖哪些边界状态：loading、empty、error、权限不足、重复提交或兼容旧行为？",
      answerType: "multi-choice",
      required: false,
      blocking: false,
      options: ["loading", "empty", "error", "权限不足", "重复提交", "兼容旧行为"],
      fillsPromptField: ["uiStates", "acceptanceCriteria", "riskHandling"],
      scoringDimensions: ["constraints", "acceptanceCriteria", "riskHandling"],
    },
    {
      id: "feature-non-goals",
      level: 3,
      scenario: "feature-development",
      question: "这个功能的非目标是什么？哪些需求留到后续版本？",
      answerType: "text",
      required: false,
      blocking: false,
      fillsPromptField: ["nonGoals", "forbiddenActions"],
      scoringDimensions: ["constraints"],
    },
  ],
  "bugfix-debugging": [
    {
      id: "bugfix-error-log",
      level: 2,
      scenario: "bugfix-debugging",
      question: "完整错误日志、失败断言或堆栈是什么？",
      helpText: "没有日志时，prompt 应要求 agent 先复现并收集日志，不能猜测修复。",
      answerType: "log",
      required: true,
      blocking: true,
      fillsPromptField: ["errorLog", "inputMaterials"],
      scoringDimensions: ["locatableInputs", "context"],
    },
    {
      id: "bugfix-repro",
      level: 2,
      scenario: "bugfix-debugging",
      question: "复现步骤或失败命令是什么？",
      answerType: "command",
      required: true,
      blocking: true,
      fillsPromptField: ["reproductionSteps", "verificationCommands"],
      scoringDimensions: ["locatableInputs", "acceptanceCriteria"],
    },
  ],
  "refactor-architecture": [
    {
      id: "refactor-preserve",
      level: 3,
      scenario: "refactor-architecture",
      question: "哪些外部行为、公开 API、路由、数据格式必须保持不变？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["behaviorToPreserve", "forbiddenActions", "acceptanceCriteria"],
      scoringDimensions: ["constraints", "acceptanceCriteria"],
    },
  ],
  "test-generation": [
    {
      id: "test-target",
      level: 1,
      scenario: "test-generation",
      question: "被测对象是什么？请给出文件、函数、组件、接口或模块路径。",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["testTarget", "relatedFiles"],
      scoringDimensions: ["clarity", "locatableInputs"],
    },
    {
      id: "test-behaviors",
      level: 1,
      scenario: "test-generation",
      question: "需要测试哪些具体行为、边界条件或回归路径？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["behaviors", "acceptanceCriteria"],
      scoringDimensions: ["clarity", "acceptanceCriteria"],
    },
    {
      id: "test-type",
      level: 2,
      scenario: "test-generation",
      question: "希望生成哪类测试：unit、integration、e2e、组件测试还是回归测试？",
      answerType: "single-choice",
      required: false,
      blocking: false,
      options: ["unit", "integration", "e2e", "组件测试", "回归测试"],
      fillsPromptField: ["testType", "outputFormat"],
      scoringDimensions: ["clarity", "outputFormat"],
    },
    {
      id: "test-framework",
      level: 2,
      scenario: "test-generation",
      question: "使用哪个测试框架和测试命令？如果未知，是否允许 agent 从配置识别？",
      answerType: "text",
      required: true,
      blocking: false,
      fillsPromptField: ["testFramework", "verificationCommands"],
      scoringDimensions: ["context", "acceptanceCriteria"],
    },
  ],
  "code-review": [
    {
      id: "review-scope",
      level: 2,
      scenario: "code-review",
      question: "审查范围是什么：PR diff、指定文件、最近提交还是整个模块？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["reviewScope", "relatedFiles"],
      scoringDimensions: ["locatableInputs", "context"],
    },
    {
      id: "review-focus",
      level: 3,
      scenario: "code-review",
      question: "重点关注正确性、回归、安全、性能、可维护性还是测试缺口？",
      answerType: "multi-choice",
      required: false,
      blocking: false,
      options: ["正确性", "回归风险", "安全", "性能", "可维护性", "测试缺口"],
      fillsPromptField: ["reviewFocus", "outputFormat"],
      scoringDimensions: ["clarity", "outputFormat"],
    },
  ],
  "repository-analysis": [
    {
      id: "repo-analysis-depth",
      level: 1,
      scenario: "repository-analysis",
      question: "希望仓库理解报告达到什么深度：快速概览、模块交接、风险审计还是后续开发规划？",
      answerType: "single-choice",
      required: true,
      blocking: false,
      options: ["快速概览", "模块交接", "风险审计", "后续开发规划"],
      fillsPromptField: ["analysisDepth", "outputFormat"],
      scoringDimensions: ["clarity", "outputFormat"],
    },
  ],
  "api-design": [
    {
      id: "api-contract",
      level: 1,
      scenario: "api-design",
      question: "API 的调用方、资源模型、请求字段、响应字段和错误场景是什么？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["apiContract", "acceptanceCriteria"],
      scoringDimensions: ["clarity", "context", "acceptanceCriteria"],
    },
  ],
  "database-migration": [
    {
      id: "migration-safety",
      level: 3,
      scenario: "database-migration",
      question: "数据库类型、migration 工具、数据量、备份状态和回滚方案是什么？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["migrationSafety", "failureHandling", "verificationCommands"],
      scoringDimensions: ["context", "constraints", "riskHandling"],
    },
  ],
  "devops-ci": [
    {
      id: "ci-context",
      level: 2,
      scenario: "devops-ci",
      question: "CI 平台、构建命令、测试命令、部署目标和当前失败日志是什么？",
      answerType: "text",
      required: true,
      blocking: false,
      fillsPromptField: ["ciContext", "verificationCommands", "errorLog"],
      scoringDimensions: ["context", "locatableInputs", "acceptanceCriteria"],
    },
  ],
  "algorithm-problem-solving": [
    {
      id: "algorithm-constraints",
      level: 1,
      scenario: "algorithm-problem-solving",
      question: "题目输入输出、数据范围、复杂度要求和边界用例是什么？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["problemStatement", "acceptanceCriteria", "verificationCommands"],
      scoringDimensions: ["clarity", "acceptanceCriteria"],
    },
  ],
  "frontend-implementation": [
    {
      id: "frontend-states",
      level: 1,
      scenario: "frontend-implementation",
      question: "页面或组件需要覆盖哪些状态：加载、空状态、错误、权限、响应式和可访问性？",
      answerType: "multi-choice",
      required: true,
      blocking: false,
      options: ["加载", "空状态", "错误", "权限", "响应式", "可访问性"],
      fillsPromptField: ["uiStates", "acceptanceCriteria"],
      scoringDimensions: ["clarity", "acceptanceCriteria"],
    },
  ],
  "backend-implementation": [
    {
      id: "backend-rules",
      level: 1,
      scenario: "backend-implementation",
      question: "后端业务规则、鉴权、输入校验、数据读写和错误响应要求是什么？",
      answerType: "text",
      required: true,
      blocking: true,
      fillsPromptField: ["businessRules", "constraints", "acceptanceCriteria"],
      scoringDimensions: ["clarity", "constraints", "acceptanceCriteria"],
    },
  ],
};

export function getQuestionTree(scenario: ScenarioId): QuestionNode[] {
  return [...sharedQuestions, ...scenarioSpecific[scenario]];
}

export function getQuestionsByLevel(scenario: ScenarioId, level: QuestionNode["level"]): QuestionNode[] {
  return getQuestionTree(scenario).filter((question) => question.level === level);
}

export function getBlockingQuestions(scenario: ScenarioId): QuestionNode[] {
  return getQuestionTree(scenario).filter((question) => question.blocking);
}
