import { readFile } from "node:fs/promises";
import { scorePrompt, type ReadinessLevel } from "../src/core/prompt-scorer.ts";
import { scoringRubric, type ScoringDimension } from "../src/domain/scoring-rubric.ts";
import type { ScenarioId } from "../src/domain/scenarios.ts";

type PromptQualityCase = {
  id: string;
  scenario: ScenarioId;
  inputPrompt: string;
  expectedReadiness: ReadinessLevel;
  expectedMaxScore?: number;
  expectedMinScore?: number;
  expectedMissingDimensions: ScoringDimension[];
  notes: string;
};

type EvalFailure = {
  id: string;
  reason: string;
  score: number;
  readiness: ReadinessLevel;
};

const content = await readFile("evals/prompt-quality-cases.json", "utf8");
const cases = JSON.parse(content) as PromptQualityCase[];
const failures: EvalFailure[] = [];
const rubricByDimension = new Map(scoringRubric.map((dimension) => [dimension.key, dimension]));

for (const item of cases) {
  const report = scorePrompt(item.inputPrompt);

  if (item.expectedMaxScore !== undefined && report.totalScore > item.expectedMaxScore) {
    failures.push({
      id: item.id,
      reason: `score ${report.totalScore} exceeded max ${item.expectedMaxScore}`,
      score: report.totalScore,
      readiness: report.readinessLevel,
    });
  }

  if (item.expectedMinScore !== undefined && report.totalScore < item.expectedMinScore) {
    failures.push({
      id: item.id,
      reason: `score ${report.totalScore} below min ${item.expectedMinScore}`,
      score: report.totalScore,
      readiness: report.readinessLevel,
    });
  }

  if (item.expectedReadiness !== report.readinessLevel && item.expectedMinScore === undefined) {
    failures.push({
      id: item.id,
      reason: `readiness ${report.readinessLevel} did not match ${item.expectedReadiness}`,
      score: report.totalScore,
      readiness: report.readinessLevel,
    });
  }

  for (const dimension of item.expectedMissingDimensions) {
    const maxScore = rubricByDimension.get(dimension)?.maxScore ?? 10;
    const missingThreshold = Math.ceil(maxScore * 0.6);
    if (report.dimensionScores[dimension] >= missingThreshold) {
      failures.push({
        id: item.id,
        reason: `expected missing dimension ${dimension}, got score ${report.dimensionScores[dimension]} (threshold ${missingThreshold})`,
        score: report.totalScore,
        readiness: report.readinessLevel,
      });
    }
  }
}

console.log(
  JSON.stringify(
    {
      total: cases.length,
      passed: cases.length - new Set(failures.map((failure) => failure.id)).size,
      failed: failures.length,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length > 0) {
  process.exitCode = 1;
}
