import { getBlockingQuestions, getQuestionTree, type QuestionNode } from "../domain/question-tree.ts";
import type { ScenarioId } from "../domain/scenarios.ts";
import type { RequirementAnswers } from "./requirement-session.ts";

export type QuestionPlan = {
  scenario: ScenarioId;
  levels: Record<number, QuestionNode[]>;
  blockingQuestions: QuestionNode[];
  missingBlockingQuestions: QuestionNode[];
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

export function buildQuestionPlan(scenario: ScenarioId, answers: RequirementAnswers = {}): QuestionPlan {
  const questions = getQuestionTree(scenario);
  const levels: Record<number, QuestionNode[]> = {};

  for (const question of questions) {
    levels[question.level] = levels[question.level] ?? [];
    levels[question.level].push(question);
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

export function nextQuestions(scenario: ScenarioId, answers: RequirementAnswers = {}, level?: QuestionNode["level"]): QuestionNode[] {
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
