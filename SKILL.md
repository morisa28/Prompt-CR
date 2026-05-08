---
name: codeprompt-coach
description: Use when the user needs to turn a vague software engineering request into a clarified, scored, and coding-agent-ready prompt for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, or a similar coding agent.
---

# CodePrompt Coach Skill

## 1. Skill Purpose

CodePrompt Coach helps users clarify software engineering tasks before handing them to a coding agent. It guides the user through graded questions, scores the prompt quality, generates a target-tool prompt, reviews the generated prompt again, and records low-score patterns as lessons.

The project focuses on software engineering and computer science tasks. It no longer treats business, medical, legal, finance, marketing, creative, multimodal, and broad education prompts as MVP scope.

## 2. When to Use

Use this skill when the user asks to:

- generate or improve a prompt for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, Cursor, Copilot, or another coding agent;
- clarify a vague development task before execution;
- score an existing coding prompt;
- convert bugfix, feature, refactor, test, code review, repository analysis, API, database, CI, frontend, backend, or algorithm work into a high-quality prompt;
- build examples, evals, or lesson records for coding prompt quality.

## 3. When Not to Use

Do not use this skill for broad non-MVP domains such as medical, legal, finance, marketing, creative writing, generic document analysis, or broad tutoring. Those legacy assets are archived under `legacy/archived-general-domains/` and should not drive the MVP flow.

## 4. How to Use This Skill

1. Intake the user's original request and target tool.
2. Select one software engineering scenario from `src/domain/scenarios.ts`.
3. Ask Level 0 to Level 4 clarification questions from `src/domain/question-tree.ts`.
4. Convert answers into `StructuredRequirement` with `src/core/requirement-session.ts`.
5. Score the original prompt and structured requirement with `src/core/prompt-scorer.ts`.
6. Generate the final coding-agent prompt with `src/core/prompt-generator.ts`.
7. Review the generated prompt with `src/core/prompt-reviewer.ts`.
8. If low dimensions remain, create a `PromptMistake` using `src/core/lesson-engine.ts`.
9. Use `branches/software-engineering/`, `adapters/`, `evals/cases/software-engineering/`, and `lessons/` as reusable evidence and policy assets.

## 5. MVP Scenarios

- `feature-development`: new features, UI components, backend logic, interaction flows; source asset `branches/software-engineering/coding-feature-development.md`.
- `bugfix-debugging`: build failures, runtime errors, failing tests, CLI errors; source asset `branches/software-engineering/bugfix-debugging.md`.
- `refactor-architecture`: behavior-preserving restructuring and architecture cleanup; source asset `branches/software-engineering/refactor-architecture.md`.
- `test-generation`: unit, integration, E2E, regression, and coverage tests; source asset `branches/software-engineering/test-generation.md`.
- `code-review`: findings-first review with locations, severity, and test gaps; source asset `branches/software-engineering/code-review.md`.
- `repository-analysis`: read-only codebase understanding reports; source asset `branches/software-engineering/repository-analysis.md`.
- `api-design`: API contracts, auth, errors, pagination, OpenAPI, examples; source asset `branches/software-engineering/api-design.md`.
- `database-migration`: schema/data migration, backup, rollback, staging validation; source asset `branches/software-engineering/database-migration.md`.
- `devops-ci`: CI/CD, build, deploy, runner, secrets, rollback; source asset `branches/software-engineering/devops-ci.md`.
- `algorithm-problem-solving`: constraints, complexity, examples, edge cases; source asset `branches/software-engineering/algorithm-problem-solving.md`.
- `frontend-implementation`: pages, components, states, responsiveness, accessibility; source asset `branches/software-engineering/coding-feature-development.md`.
- `backend-implementation`: interfaces, business rules, validation, auth, data writes; source asset `branches/software-engineering/coding-feature-development.md`.
- `cli-agent`: command-line permissions and reporting; source asset `branches/software-engineering/cli-agent.md`.
- `plan-mode`: read-only planning before high-risk edits; source asset `branches/software-engineering/plan-mode.md`.
- `security-threat-modeling`: defensive security review prompts; source asset `branches/software-engineering/security-threat-modeling.md`.

## 6. Scoring Standard

Score every prompt out of 100:

- clarity: 15
- context: 15
- locatableInputs: 10
- constraints: 15
- outputFormat: 10
- acceptanceCriteria: 15
- riskHandling: 10
- agentAdaptation: 10

The report must include total score, dimension scores, deductions, priority improvements, readiness level, whether it is suitable for a coding agent, and the three most missing critical details.

## 7. Final Prompt Quality Standard

A generated coding-agent prompt must include:

- role and target tool;
- working directory;
- task objective;
- project context;
- related files and input materials;
- execution steps;
- modification scope;
- hard constraints and forbidden actions;
- verification commands;
- final report format;
- failure handling rules;
- self-check requirements.

For Codex-style prompts, always emphasize reading files first, minimal changes, no unrelated refactors, verification, honest reporting of failed checks, and no fabricated execution results.

## 8. Project Files

- `README.md`: project positioning and usage.
- `docs/`: grant proposal and project design materials.
- `src/domain/`: scenarios, question tree, scoring rubric, prompt template settings.
- `src/core/`: requirement sessions, question engine, scorer, generator, reviewer, lesson engine.
- `src/storage/`: JSON session and lesson stores.
- `src/cli/`: demo CLI.
- `tests/`: Node test suite.
- `examples/`: complete scenario examples.
- `branches/software-engineering/`: retained branch assets from the original hub.
- `adapters/`: target tool adaptation.
- `metadata/resources.yaml`: coding-focused resource registry.
- `lessons/`: failure memory and improvement notes.

## 9. Run And Verify

```bash
npm.cmd run demo
npm.cmd test
npm.cmd run validate
```

PowerShell users should prefer `npm.cmd` when script execution policy blocks `npm.ps1`.
