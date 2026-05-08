import { scoringRubric, type ScoringDimension } from "../domain/scoring-rubric.ts";
import { scorePrompt, type PromptScoreReport } from "./prompt-scorer.ts";

export type PromptReviewResult = {
  score: PromptScoreReport;
  passed: boolean;
  weakDimensions: ScoringDimension[];
  revisionHints: string[];
};

export function reviewGeneratedPrompt(prompt: string, minimumDimensionRatio = 0.7): PromptReviewResult {
  const score = scorePrompt(prompt);
  const weakDimensions = scoringRubric
    .filter((dimension) => score.dimensionScores[dimension.key] < Math.ceil(dimension.maxScore * minimumDimensionRatio))
    .map((dimension) => dimension.key);

  return {
    score,
    passed: score.totalScore >= 75 && weakDimensions.length === 0,
    weakDimensions,
    revisionHints: scoringRubric
      .filter((dimension) => weakDimensions.includes(dimension.key))
      .map((dimension) => dimension.missingHint),
  };
}
