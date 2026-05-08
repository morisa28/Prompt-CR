import type { ScenarioId, TargetTool } from "../domain/scenarios.ts";

export type RequirementAnswers = Record<string, string | string[] | undefined>;

export type StructuredRequirement = {
  scenario: ScenarioId;
  targetTool: TargetTool;
  originalPrompt: string;
  workingDirectory?: string;
  taskGoal?: string;
  projectContext?: string;
  techStack?: string;
  relatedFiles?: string[];
  inputMaterials?: string[];
  errorLog?: string;
  reproductionSteps?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  userFlow?: string;
  uiStates?: string[];
  behaviors?: string;
  testTarget?: string;
  testType?: string;
  testFramework?: string;
  reviewScope?: string;
  reviewFocus?: string[];
  apiContract?: string;
  businessRules?: string;
  acceptanceCriteria?: string[];
  modificationScope?: string;
  forbiddenActions?: string[];
  verificationCommands?: string[];
  outputFormat?: string[];
  failureHandling?: string;
  nonGoals?: string[];
  rawAnswers?: RequirementAnswers;
};

export function normalizeList(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split(/\r?\n|;|；|,|，/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createRequirementSession(input: {
  scenario: ScenarioId;
  targetTool?: TargetTool;
  originalPrompt: string;
  answers?: RequirementAnswers;
}): StructuredRequirement {
  const answers = input.answers ?? {};
  const get = (key: string) => answers[key];
  const text = (key: string) => {
    const value = get(key);
    if (Array.isArray(value)) {
      return value.join("\n");
    }
    return value;
  };

  return {
    scenario: input.scenario,
    targetTool: input.targetTool ?? "Codex",
    originalPrompt: input.originalPrompt,
    workingDirectory: text("workingDirectory") ?? text("l2-working-directory"),
    taskGoal: text("taskGoal") ?? text("l1-goal") ?? input.originalPrompt,
    projectContext: text("projectContext") ?? text("l2-tech-stack"),
    techStack: text("techStack") ?? text("l2-tech-stack"),
    relatedFiles: normalizeList(get("relatedFiles") ?? get("l2-related-files")),
    inputMaterials: normalizeList(get("inputMaterials") ?? get("l2-related-files")),
    errorLog: text("errorLog") ?? text("bugfix-error-log"),
    reproductionSteps: text("reproductionSteps") ?? text("bugfix-repro"),
    expectedBehavior: text("expectedBehavior") ?? text("bugfix-expected"),
    actualBehavior: text("actualBehavior") ?? text("bugfix-actual"),
    userFlow: text("userFlow") ?? text("feature-user-flow"),
    uiStates: normalizeList(get("uiStates") ?? get("feature-edge-states") ?? get("frontend-states")),
    behaviors: text("behaviors") ?? text("test-behaviors"),
    testTarget: text("testTarget") ?? text("test-target"),
    testType: text("testType") ?? text("test-type"),
    testFramework: text("testFramework") ?? text("test-framework"),
    reviewScope: text("reviewScope") ?? text("review-scope"),
    reviewFocus: normalizeList(get("reviewFocus") ?? get("review-focus")),
    apiContract: text("apiContract") ?? text("api-contract"),
    businessRules: text("businessRules") ?? text("backend-rules"),
    acceptanceCriteria: normalizeList(get("acceptanceCriteria") ?? get("l4-verification")),
    modificationScope: text("modificationScope") ?? text("l3-scope"),
    forbiddenActions: normalizeList(get("forbiddenActions") ?? get("l3-forbidden")),
    verificationCommands: normalizeList(get("verificationCommands") ?? get("l4-verification")),
    outputFormat: normalizeList(get("outputFormat") ?? get("l4-report")),
    failureHandling: text("failureHandling") ?? "验证失败或无法验证时，必须报告原因、阻塞项和下一步建议。",
    nonGoals: normalizeList(get("nonGoals") ?? get("feature-non-goals")),
    rawAnswers: answers,
  };
}

export function requirementToText(requirement: StructuredRequirement): string {
  return [
    requirement.originalPrompt,
    requirement.taskGoal,
    requirement.workingDirectory,
    requirement.projectContext,
    requirement.techStack,
    requirement.relatedFiles?.join("\n"),
    requirement.inputMaterials?.join("\n"),
    requirement.errorLog,
    requirement.reproductionSteps,
    requirement.expectedBehavior,
    requirement.actualBehavior,
    requirement.userFlow,
    requirement.uiStates?.join("\n"),
    requirement.behaviors,
    requirement.testTarget,
    requirement.testType,
    requirement.testFramework,
    requirement.reviewScope,
    requirement.reviewFocus?.join("\n"),
    requirement.apiContract,
    requirement.businessRules,
    requirement.acceptanceCriteria?.join("\n"),
    requirement.modificationScope,
    requirement.forbiddenActions?.join("\n"),
    requirement.verificationCommands?.join("\n"),
    requirement.outputFormat?.join("\n"),
    requirement.failureHandling,
    requirement.nonGoals?.join("\n"),
  ]
    .filter(Boolean)
    .join("\n");
}
