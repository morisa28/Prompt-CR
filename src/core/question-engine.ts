import { getBlockingQuestions, getQuestionTree, type QuestionNode } from "../domain/question-tree.ts";
import type { ScoringDimension } from "../domain/scoring-rubric.ts";
import type { ScenarioId } from "../domain/scenarios.ts";
import { detectVaguePlaceholders, type PromptScoreReport, scorePrompt } from "./prompt-scorer.ts";
import type { RequirementAnswers } from "./requirement-session.ts";

export type QuestionPlan = {
  scenario: ScenarioId;
  levels: Record<number, QuestionNode[]>;
  blockingQuestions: QuestionNode[];
  missingBlockingQuestions: QuestionNode[];
};

export type FollowUpReason =
  | "missing_required_field"
  | "low_score_dimension"
  | "scenario_specific_risk"
  | "vague_answer"
  | "verification_missing"
  | "constraint_missing";

export type FollowUpQuestion = {
  id: string;
  level: 1 | 2 | 3 | 4;
  scenario: ScenarioId;
  question: string;
  reason: FollowUpReason;
  reasonText: string;
  priority: number;
  helpText?: string;
  answerType: QuestionNode["answerType"];
  fillsPromptField: string[];
  scoringDimensions: ScoringDimension[];
  exampleAnswer?: string;
};

function hasAnswer(question: QuestionNode, answers: RequirementAnswers): boolean {
  const values = [answers[question.id], ...question.fillsPromptField.map((field) => answers[field])];
  return values.some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return typeof value === "string" && value.trim().length > 0;
  });
}

function answerText(answers: RequirementAnswers, keys: string[]): string {
  return keys
    .map((key) => answers[key])
    .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .join("\n")
    .trim();
}

function hasAnyAnswer(answers: RequirementAnswers, keys: string[]): boolean {
  return answerText(answers, keys).length > 0;
}

function isVagueAnswer(value: string): boolean {
  const clean = value.trim();
  return (
    clean.length > 0 &&
    (clean.length < 8 ||
      /不要乱改|测试通过|能运行就行|具体路径|相关文件|错误日志|待补充|TODO|N\/A|某个模块|若干文件/.test(clean) ||
      detectVaguePlaceholders(clean).length > 0)
  );
}

function toFollowUp(
  question: QuestionNode,
  scenario: ScenarioId,
  reason: FollowUpReason,
  priority: number,
  reasonText: string,
  exampleAnswer?: string,
): FollowUpQuestion {
  return {
    id: question.id,
    level: question.level === 0 ? 1 : question.level,
    scenario,
    question: question.question,
    reason,
    reasonText,
    priority,
    helpText: question.helpText,
    answerType: question.answerType,
    fillsPromptField: question.fillsPromptField,
    scoringDimensions: question.scoringDimensions as ScoringDimension[],
    exampleAnswer,
  };
}

function questionById(scenario: ScenarioId, id: string): QuestionNode | undefined {
  return getQuestionTree(scenario).find((question) => question.id === id);
}

function pushQuestion(
  questions: FollowUpQuestion[],
  scenario: ScenarioId,
  id: string,
  reason: FollowUpReason,
  priority: number,
  reasonText: string,
  exampleAnswer?: string,
): void {
  if (questions.some((question) => question.id === id)) {
    return;
  }

  const question = questionById(scenario, id);
  if (question) {
    questions.push(toFollowUp(question, scenario, reason, priority, reasonText, exampleAnswer));
  }
}

export function buildQuestionPlan(scenario: ScenarioId, answers: RequirementAnswers = {}): QuestionPlan {
  const questions = getQuestionTree(scenario);
  const levels: Record<number, QuestionNode[]> = {};

  for (const question of questions) {
    const bucket = (levels[question.level] ??= []);
    bucket.push(question);
  }

  const blockingQuestions = getBlockingQuestions(scenario);
  const missingBlockingQuestions = blockingQuestions.filter((question) => !hasAnswer(question, answers));

  return {
    scenario,
    levels,
    blockingQuestions,
    missingBlockingQuestions,
  };
}

export function nextQuestions(
  scenario: ScenarioId,
  answers: RequirementAnswers = {},
  level?: QuestionNode["level"],
): QuestionNode[] {
  const questions = getQuestionTree(scenario).filter((question) => !hasAnswer(question, answers));
  if (level === undefined) {
    return questions;
  }
  return questions.filter((question) => question.level === level);
}

export function missingFieldsFromQuestions(questions: QuestionNode[]): string[] {
  const fields = new Set<string>();
  for (const question of questions) {
    for (const field of question.fillsPromptField) {
      fields.add(field);
    }
  }
  return [...fields];
}

export function getNextFollowUpQuestions(input: {
  scenario: ScenarioId;
  answers: RequirementAnswers;
  scoreReport?: PromptScoreReport;
  maxQuestions?: number;
}): FollowUpQuestion[] {
  const maxQuestions = input.maxQuestions ?? 3;
  const answers = input.answers;
  const scoreReport = input.scoreReport ?? scorePrompt(answerText(answers, Object.keys(answers)) || "");
  const followUps: FollowUpQuestion[] = [];

  if (!hasAnyAnswer(answers, ["taskGoal", "l1-goal", "originalPrompt"])) {
    pushQuestion(
      followUps,
      input.scenario,
      "l1-goal",
      "missing_required_field",
      96,
      "任务目标决定 agent 要完成什么，不明确时后续路径、边界和验收都会失真。",
      "修复登录页 token 过期后无限重定向的问题，并保持 OAuth 登录流程不变。",
    );
  }

  if (!hasAnyAnswer(answers, ["workingDirectory", "l2-working-directory"])) {
    pushQuestion(
      followUps,
      input.scenario,
      "l2-working-directory",
      "missing_required_field",
      80,
      "工作目录让 coding agent 能定位仓库和命令运行位置，是可执行 prompt 的基础。",
      "F:/workspace/demo-app",
    );
  }

  if (!hasAnyAnswer(answers, ["relatedFiles", "inputMaterials", "l2-related-files"])) {
    pushQuestion(
      followUps,
      input.scenario,
      "l2-related-files",
      "low_score_dimension",
      input.scenario === "bugfix-debugging" ? 94 : 74,
      "相关文件路径能降低 agent 猜测范围，避免全仓库搜索和无关修改。",
      "package.json\nsrc/pages/Login.tsx\nsrc/auth/session.ts",
    );
  }

  if (!hasAnyAnswer(answers, ["modificationScope", "l3-scope"])) {
    pushQuestion(
      followUps,
      input.scenario,
      "l3-scope",
      "constraint_missing",
      78,
      "修改边界能约束 agent 只做必要改动，降低无关重构和误删功能风险。",
      "只允许修改 src/auth/session.ts 和 src/pages/Login.tsx，不新增依赖。",
    );
  }

  if (!hasAnyAnswer(answers, ["verificationCommands", "acceptanceCriteria", "l4-verification"])) {
    pushQuestion(
      followUps,
      input.scenario,
      "l4-verification",
      "verification_missing",
      input.scenario === "feature-development" || input.scenario === "test-generation" ? 90 : 76,
      "验证命令让任务结果可检查，也能防止 agent 编造完成情况。",
      "npm run build\nnpm test -- --runInBand",
    );
  }

  if (input.scenario === "bugfix-debugging") {
    if (!hasAnyAnswer(answers, ["errorLog", "bugfix-error-log"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "bugfix-error-log",
        "scenario_specific_risk",
        100,
        "Bugfix 没有错误日志时，agent 很容易猜测修复；日志是定位根因的第一证据。",
        "TS2322: Type 'undefined' is not assignable to type 'User'.",
      );
    }
    if (!hasAnyAnswer(answers, ["reproductionSteps", "bugfix-repro"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "bugfix-repro",
        "scenario_specific_risk",
        98,
        "复现步骤或失败命令能确认问题存在，并作为修复后的回归验证入口。",
        "npm run build",
      );
    }
  }

  if (input.scenario === "feature-development") {
    if (!hasAnyAnswer(answers, ["userFlow", "feature-user-flow"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "feature-user-flow",
        "scenario_specific_risk",
        100,
        "新功能需要先明确目标用户和使用流程，否则 agent 容易只实现表面 UI。",
        "用户进入课程卡片，点击收藏按钮，成功后按钮变为已收藏并刷新收藏列表。",
      );
    }
    if (!hasAnyAnswer(answers, ["apiContract", "api-contract"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "feature-api-contract",
        "scenario_specific_risk",
        96,
        "接口输入输出决定前后端数据流，缺失时需要明确由 agent 读取还是新设计。",
        "POST /api/favorites，body: { courseId }，返回 { favorited: true }。",
      );
    }
  }

  if (input.scenario === "test-generation") {
    if (!hasAnyAnswer(answers, ["testTarget", "test-target", "relatedFiles", "l2-related-files"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "test-target",
        "scenario_specific_risk",
        100,
        "测试生成必须先定位被测对象，否则 agent 无法知道应该为哪个文件、函数或组件补测试。",
        "src/components/LoginForm.tsx",
      );
    }
    if (!hasAnyAnswer(answers, ["behaviors", "test-behaviors"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "test-behaviors",
        "scenario_specific_risk",
        96,
        "测试生成必须知道被测行为、正常路径、异常路径和边界条件。",
        "覆盖空输入校验、错误密码提示、成功登录回调和网络失败提示。",
      );
    }
    if (!hasAnyAnswer(answers, ["testFramework", "test-framework"])) {
      pushQuestion(
        followUps,
        input.scenario,
        "test-framework",
        "verification_missing",
        94,
        "测试框架和命令决定 agent 应生成哪种测试以及如何验证。",
        "Vitest + React Testing Library，运行 npm test -- LoginForm。",
      );
    }
  }

  for (const [key, value] of Object.entries(answers)) {
    const text = Array.isArray(value) ? value.join("\n") : value;
    if (text && isVagueAnswer(text)) {
      const matchingQuestion = getQuestionTree(input.scenario).find(
        (question) => question.id === key || question.fillsPromptField.includes(key),
      );
      if (matchingQuestion) {
        followUps.push(
          toFollowUp(
            matchingQuestion,
            input.scenario,
            "vague_answer",
            86,
            "这个回答过于空泛，不能转化为可执行约束或验收条件，需要补成具体路径、命令或边界。",
            matchingQuestion.answerType === "command"
              ? "npm run build\nnpm test"
              : "写出具体文件、命令、行为或禁止事项。",
          ),
        );
      }
    }
  }

  for (const [dimension, score] of Object.entries(scoreReport.dimensionScores) as [ScoringDimension, number][]) {
    const definition = scoreReport.dimensionScores[dimension];
    if (definition === undefined || score >= 6) {
      continue;
    }
    const candidate = getQuestionTree(input.scenario).find((question) =>
      question.scoringDimensions.includes(dimension),
    );
    if (candidate) {
      followUps.push(
        toFollowUp(
          candidate,
          input.scenario,
          "low_score_dimension",
          60,
          `当前 ${dimension} 维度得分偏低，需要补充该维度的真实证据。`,
        ),
      );
    }
  }

  return followUps
    .sort((a, b) => b.priority - a.priority)
    .filter((question, index, list) => list.findIndex((item) => item.id === question.id) === index)
    .slice(0, maxQuestions);
}
