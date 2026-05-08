import { buildQuestionPlan, missingFieldsFromQuestions } from "../core/question-engine.ts";
import { createPromptMistake, type PromptMistake } from "../core/lesson-engine.ts";
import { generatePrompt } from "../core/prompt-generator.ts";
import { reviewGeneratedPrompt, type PromptReviewResult } from "../core/prompt-reviewer.ts";
import { createRequirementSession, type RequirementAnswers, type StructuredRequirement } from "../core/requirement-session.ts";
import { scorePrompt, type PromptScoreReport } from "../core/prompt-scorer.ts";
import type { ScoringDimension } from "../domain/scoring-rubric.ts";
import type { ScenarioId, TargetTool } from "../domain/scenarios.ts";

export type CoachEvaluationInput = {
  scenario: ScenarioId;
  targetTool?: TargetTool;
  originalPrompt: string;
  answers?: RequirementAnswers;
};

export type CoachEvaluationResult = {
  session: StructuredRequirement;
  originalScore: PromptScoreReport;
  structuredScore: PromptScoreReport;
  generatedPrompt: string;
  generatedReview: PromptReviewResult;
  missingBlockingQuestions: {
    id: string;
    level: number;
    question: string;
    fillsPromptField: string[];
  }[];
  missingBlockingFields: string[];
  scoreDelta: {
    structured: number;
    generated: number;
  };
  lessonCandidate: PromptMistake | null;
};

export function evaluateCoachPrompt(input: CoachEvaluationInput): CoachEvaluationResult {
  if (!input.originalPrompt.trim()) {
    throw new Error("originalPrompt is required");
  }

  const session = createRequirementSession({
    scenario: input.scenario,
    targetTool: input.targetTool,
    originalPrompt: input.originalPrompt,
    answers: input.answers,
  });

  const planAnswers: RequirementAnswers = {
    ...session.rawAnswers,
    scenario: session.scenario,
    targetTool: session.targetTool,
  };
  const plan = buildQuestionPlan(session.scenario, planAnswers);
  const originalScore = scorePrompt(input.originalPrompt);
  const structuredScore = scorePrompt(session);
  const generatedPrompt = generatePrompt(session);
  const generatedReview = reviewGeneratedPrompt(generatedPrompt);
  const weakDimensions = generatedReview.weakDimensions as ScoringDimension[];
  const lessonCandidate = weakDimensions.length > 0
    ? createPromptMistake({
      scenario: session.scenario,
      originalPrompt: session.originalPrompt,
      generatedPrompt,
      before: originalScore,
      after: generatedReview.score,
      weakDimensions,
      affectedTemplate: "src/domain/prompt-template.ts",
    })
    : null;

  return {
    session,
    originalScore,
    structuredScore,
    generatedPrompt,
    generatedReview,
    missingBlockingQuestions: plan.missingBlockingQuestions.map((question) => ({
      id: question.id,
      level: question.level,
      question: question.question,
      fillsPromptField: question.fillsPromptField,
    })),
    missingBlockingFields: missingFieldsFromQuestions(plan.missingBlockingQuestions),
    scoreDelta: {
      structured: structuredScore.totalScore - originalScore.totalScore,
      generated: generatedReview.score.totalScore - originalScore.totalScore,
    },
    lessonCandidate,
  };
}
