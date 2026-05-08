# CodePrompt Coach

**Prompt-CR: a graded requirement clarification and prompt optimization system for coding agents.**

Prompt-CR is not a generic prompt template library, and it is not a simple AI chat wrapper.

It is a rule-based MVP that helps users turn vague software-development requests into executable, verifiable, and reviewable prompts for coding agents such as Codex, Claude Code, and Gemini CLI. The system evaluates the original request, asks prioritized follow-up questions, structures the requirement, generates a coding-agent prompt, reviews the generated prompt, and records reusable mistakes for later iteration.

CodePrompt Coach is the product name. Prompt-CR is the repository name. CR means Clarification & Review: requirement clarification plus post-generation review.

## 1. Problem

Coding agents often fail because the task is underspecified, not because the model is unable to write code. Common missing inputs include working directory, related files, error logs, allowed edit scope, acceptance criteria, verification commands, and risk boundaries.

Prompt-CR treats this as a software-engineering requirement-expression problem. It diagnoses missing information first, then guides the user toward a prompt that an agent can actually execute and verify.

## 2. Why It Is Not A Generic Prompt Generator

Generic templates usually paste user input into a fixed format. Prompt-CR is built around a closed loop:

```text
vague user request
  -> initial score
  -> dynamic graded follow-up questions
  -> structured requirement
  -> score again
  -> coding-agent prompt generation
  -> post-generation review
  -> mistake record
  -> mistake statistics
  -> suggestions for improving question trees, scoring rules, and templates
```

The current system is a rule-based MVP. It does not claim machine learning, automatic rule rewriting, or autonomous prompt-system improvement. The mistake book produces semi-automatic iteration suggestions.

## 3. Core Scenarios

The MVP focuses on three high-frequency coding-agent scenarios:

- `bugfix-debugging`: bug fixing and debugging
- `feature-development`: new feature development
- `test-generation`: test generation

These three scenarios cover the core software-engineering loop: finding problems, implementing behavior, and verifying quality.

Extension scenarios are retained for later iterations:

- refactoring
- code review
- repository analysis
- API design
- database migration
- DevOps / CI
- algorithm tasks
- frontend implementation
- backend implementation

Older general-domain prompt resources such as medical, legal, finance, marketing, creative writing, and multimodal branches are not part of the MVP core.

## 4. Before And After

Original request:

```text
Fix my build error. Do not change unrelated things.
```

The system asks first:

```text
1. Please provide the complete error log or the key failing lines.
2. Please provide the reproduction command, for example npm run build.
3. Please provide the related file paths or directories.
```

Generated prompt excerpt:

```text
You are Codex. In F:/workspace/demo-app, fix the TS2322 error from npm run build.
First read package.json, src/pages/Profile.tsx, and src/api/user.ts.
Only edit files related to Profile user-data loading.
Do not add dependencies, format the whole repository, or delete tests.
After the fix, run npm run build and npm test -- --runInBand.
If a verification command cannot be run, explain why.
Report the root cause, changed files, key changes, verification results, unverified items, and remaining risks.
```

## 5. Quick Start

Requires Node.js 20 or later.

```bash
npm install
npm run format:check
npm run lint
npm test
npm run eval
npm run build
npm run demo
npm run web
```

On Windows PowerShell, use `npm.cmd` if the local execution policy blocks `npm.ps1`:

```powershell
npm.cmd run validate
```

The web prototype starts at `http://localhost:4173` by default.

## 6. Web Prototype

The web prototype provides:

- default display for the three MVP scenarios;
- collapsed extension scenario pills;
- original request input and demand analysis;
- score, missing information, and up to three dynamic follow-up questions;
- explanation, sample answer, and scoring dimensions for each follow-up question;
- advanced mode for all questions;
- final prompt generation;
- post-generation review;
- mistake-book summary and iteration suggestions.

## 7. Scoring System

The score is 100 points across eight software-engineering dimensions:

| Dimension          | Points |
| ------------------ | -----: |
| clarity            |     15 |
| context            |     15 |
| locatableInputs    |     10 |
| constraints        |     15 |
| outputFormat       |     10 |
| acceptanceCriteria |     15 |
| riskHandling       |     10 |
| agentAdaptation    |     10 |

The scorer includes anti-gaming and content-quality checks:

- detects keyword stuffing;
- detects vague placeholders such as `TODO`, `pending`, and `specific path`;
- detects concrete artifacts such as file paths, commands, error codes, API routes, and database entities;
- downranks vague constraints like "do not change unrelated things";
- downranks vague acceptance criteria like "tests pass".

## 8. Mistake Book

The mistake book records `PromptMistake` items, including original prompt, generated prompt, before/after scores, weak dimensions, mistake types, and improvement suggestions.

It can:

- save records to `data/prompt-mistakes.json`;
- summarize frequent weak dimensions and mistake types;
- generate suggestions for question-tree, scoring-rule, and template updates.

It does not automatically learn or modify project rules.

## 9. Evaluation Dataset

`evals/prompt-quality-cases.json` contains 30 prompt-quality cases covering vague prompts, missing context, missing file paths, missing verification commands, keyword stuffing, and high-quality prompts for the three MVP scenarios.

```bash
npm run eval
```

The dataset is used for regression checks in the rule-based MVP and as a basis for later human-rating and coding-agent execution experiments.

## 10. Project Structure

```text
docs/        project positioning, grant proposal, evaluation, and defense documents
src/domain/  scenarios, question tree, scoring rubric, and prompt templates
src/core/    requirement session, question engine, scorer, generator, reviewer, and lesson logic
src/storage/ lightweight lesson and session storage
src/web/     web API and static file server
src/cli/     CLI and demo entry
public/      web prototype UI
tests/       Node test suite
evals/       prompt-quality evaluation cases
examples/    example sessions
data/        mistake-book persistence file
```

## 11. Project Value

- Software engineering: reduces vague-agent-task failures and unrelated edits.
- Education: trains students to express goals, context, constraints, acceptance criteria, and verification commands.
- Engineering practice: produces prompts that are easier to execute, verify, and review.
- Research: collects prompt-quality signals, missing-information patterns, and failure types.
- Innovation: combines diagnosis, teaching, generation, review, and iteration in one workflow.

## 12. Roadmap

1. Calibrate scoring weights with real student prompts.
2. Run human rating consistency analysis.
3. Evaluate execution outcomes with real coding agents.
4. Make question trees, scoring rules, and templates fully configurable.
5. Add CLI / MCP plugin interfaces.
