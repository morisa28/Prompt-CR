# Prompt Engineering Skill Hub

One-line positioning: route vague user requests to the right scenario branch and generate high-quality prompts for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, and other AI tools.

## Who It Is For

- Users who need to turn informal requests into executable prompts.
- People writing task prompts for coding, research, data, document, or automation agents.
- Teams maintaining prompt routers, branch templates, eval cases, and reusable AI workflows.
- Designers who need safe boundaries for medical, legal, finance, security, recruiting, privacy, and other high-risk domains.

## Typical Use Cases

- Fix code bugs, add tests, and generate Codex CLI task prompts.
- Analyze repository structure and produce project understanding reports.
- Write PRDs and convert them into development-agent prompts.
- Design RAG knowledge bases with citations, permissions, updates, and evaluation.
- Create data-analysis prompts with fields, cleaning rules, metrics, charts, and conclusion boundaries.
- Turn contracts, medical reports, or financial materials into safe informational prompts.
- Audit and improve prompt systems themselves.

## Natural Language Entry

Users do not need to understand the directory structure first. They can start with natural language:

- "Write a prompt for Codex to fix an npm run build error."
- "Turn this product idea into a Claude Code development task."
- "Design a RAG knowledge-base prompt with citations and permission control."
- "Check why this prompt is unstable."
- "Generate a medical information organization prompt without diagnosis."

When an AI Agent uses this project, it should:

1. Normalize the user's real task and final deliverable.
2. Select exactly one primary branch and necessary auxiliary branches.
3. Use `metadata/resources.yaml` to select templates, checklists, examples, evals, adapters, safety resources, and lessons.
4. Classify missing inputs as reasonable assumptions, pending fields, questions, or blockers.
5. Run a risk check; high-risk tasks must reference `safety/` resources.
6. Generate the final prompt and self-check it against checklists and eval cases.

Recommended output format:

```text
Request summary:
Final deliverable:
Primary branch:
Auxiliary branches:
Resources used:
Missing inputs:
Risk level:
Safety boundary:
Final prompt:
Self-check:
Matched eval:
Possible new lesson:
```

If the user only asks for the final prompt, the AI Agent can keep the route internal, but it should still perform the same routing, resource selection, risk check, and self-check.

## Fast Path

1. Read `router.md` and choose one primary branch by final deliverable.
2. Use `branch-composition.md` to add only necessary auxiliary branches.
3. Use `templates.md` and the selected branch file to draft the prompt.
4. Validate with `checklists.md`.

## Full Path

1. `prompt-generation-protocol.md`: follow Intake, Normalize, Route, Missing Inputs, Risk Check, Construct, Self Check, and Finalize.
2. `router.md`: output primary branch, auxiliary branches, hit reasons, missing inputs, risk level, and construction strategy.
3. `common-principles.md`: apply shared rules for missing inputs, constraint priority, hallucination control, high-risk boundaries, and tool adaptation.
4. `templates.md`: choose a general template, branch template, or multi-branch composition template.
5. `checklists.md`: validate with common, routing, branch, high-risk, output-format, and final-delivery checklists.
6. `examples.md`: learn from full examples that turn vague requests into final prompts.
7. `evals/`: check generated prompt quality with eval cases and feature files.
8. `branches/manifest.yaml`: read machine-friendly metadata for key branches and eval coverage.
9. `metadata/resources.yaml`: combine branch, template, checklist, example, eval, adapter, safety, and lesson resources.
10. `lessons/`: reuse known failures, successful patterns, and improvement notes.
11. `adapters/`: apply Codex, Codex CLI, Claude Code, Gemini CLI, or ChatGPT constraints when a target tool is named.
12. `safety/`: apply boundaries for medical, legal, financial, security, privacy, and other high-risk tasks.

## Core Directory Map

| Path | Purpose | When To Use |
|---|---|---|
| `SKILL.md` | Skill entry point | Read first when an AI Agent uses this hub |
| `prompt-generation-protocol.md` | Prompt generation protocol | Use when turning natural language into a final prompt |
| `router.md` | Multi-layer routing rules | Select primary branch, auxiliary branches, risk, and resource references |
| `branch-composition.md` | Multi-branch composition rules | Use when tasks need tool adaptation, validation, reports, citations, or safety boundaries |
| `common-principles.md` | Shared quality principles | Apply to all prompts for missing inputs, hallucination control, risk, and tool adaptation |
| `templates.md` | Copyable templates | Generate general, coding, RAG, PRD, data, high-risk, and meta prompts |
| `checklists.md` | Checkable acceptance lists | Validate that prompts are executable, verifiable, and safe |
| `examples.md` | End-to-end examples | Learn how vague requests become final prompts |
| `branches/` | Scenario branches | Detailed rules for primary and auxiliary branches |
| `branches/manifest.yaml` | Key branch manifest | Machine-readable branch metadata and eval coverage |
| `metadata/resources.yaml` | Resource registry | Unified lookup for branches, templates, checklists, evals, adapters, safety, and lessons |
| `evals/` | Prompt quality evals | Test generated prompts, not downstream task outcomes |
| `lessons/` | Experience library | Record failures, successes, and improvement notes |
| `adapters/` | Target-tool adapters | Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT |
| `safety/` | High-risk boundaries | Medical, legal, financial, security, and privacy |
| `scripts/` | Maintenance scripts | Validate, count, and manage branches |

## Example

User request:

```text
Write a prompt for Codex to fix an npm run build error and avoid unrelated changes.
```

Routing:

```text
Request summary: create a Codex prompt to fix an npm build failure
Final deliverable: executable bugfix prompt for Codex
Primary branch: software-engineering/bugfix-debugging
Auxiliary branches: software-engineering/test-generation, software-engineering/cli-agent
Resources:
- @branch://software-engineering/bugfix-debugging
- @template://coding-agent/bugfix
- @adapter://codex
- @checklist://coding-agent/final-review
- @eval://software-engineering/bugfix-debugging/missing-inputs
- @lesson://routing/ambiguous-bugfix-request
Risk level: medium
Missing inputs: error log, reproduction steps, working directory, environment, verification command
```

Generated prompt:

```text
You are Codex. In `[pending: working_directory]`, fix the `npm run build` failure. Error log: `[pending: error_log]`. First read `package.json`, build config, stack-trace files, and related tests. Reproduce the failure or explain why it cannot be reproduced, then identify the root cause. Make the smallest safe fix. Do not perform unrelated refactors, repository-wide formatting, new dependencies, test deletion, assertion weakening, or error-hiding changes. After the fix, run `npm run build` and `[pending: test_command]`. Report root cause, evidence, changed files, key changes, verification command results, unverified items, and remaining risks.
```

Self-check:

- [x] Primary branch is selected by final deliverable.
- [x] Missing inputs are marked.
- [x] Minimal fix, forbidden actions, and verification commands are present.
- [x] Output format is ready for Codex.
- [x] Matched eval: `@eval://software-engineering/bugfix-debugging/missing-inputs`.
- [x] Related lesson: `@lesson://routing/ambiguous-bugfix-request`.

## How Resources Work Together

A strong prompt normally combines several resource types rather than reading one branch only.

Bugfix example:

| Resource Type | Example | Purpose |
|---|---|---|
| branch | `@branch://software-engineering/bugfix-debugging` | Defines final deliverable, inputs, hard constraints, and acceptance criteria |
| auxiliary branch | `@branch://software-engineering/test-generation` | Adds regression-test and verification requirements |
| template | `@template://coding-agent/bugfix` | Provides a copyable prompt skeleton |
| checklist | `@checklist://coding-agent/final-review` | Checks working directory, scope, verification, and report format |
| adapter | `@adapter://codex` | Adapts for repository reading, minimal edits, and verification output |
| eval | `@eval://software-engineering/bugfix-debugging/missing-inputs` | Checks that missing logs do not lead to guessed fixes |
| lesson | `@lesson://routing/ambiguous-bugfix-request` | Injects the known failure lesson: no logs means no speculative edit |

RAG example:

| Resource Type | Example | Purpose |
|---|---|---|
| branch | `@branch://ai-systems/knowledge-base-rag` | Defines sources, chunking, metadata, retrieval, citation, and evals |
| safety | `@safety://privacy-boundary`, `@safety://security-boundary` | Handles internal permissions, privacy, and audit requirements |
| checklist | `@checklist://rag` | Checks citation, refusal, permissions, updates, and metrics |
| eval | `@eval://ai-systems/knowledge-base-rag/citation-required` | Ensures no answer is allowed without retrieved evidence |
| lesson | `@lesson://unsafe-patterns/rag-unsourced-answer` | Prevents unsourced answers from becoming the default behavior |

## Primary Branch Rule

Choose the primary branch by the final deliverable:

- Fix an error: `branches/software-engineering/bugfix-debugging.md`
- Understand a repository: `branches/software-engineering/repository-analysis.md`
- Implement a feature: `branches/software-engineering/coding-feature-development.md`
- Add tests: `branches/software-engineering/test-generation.md`
- Write a PRD: `branches/product-design-business/product-requirements.md`
- Design RAG: `branches/ai-systems/knowledge-base-rag.md`
- Analyze data: `branches/data-analytics/data-analysis.md`
- Write a report: `branches/documents-research/report-writing.md`
- Handle medical/legal/finance: corresponding `branches/domain-specific/` branch
- Improve a prompt system: `branches/meta/meta-skill-builder.md`

## Auxiliary Branch Composition

Auxiliary branches improve execution quality without changing the final deliverable.

Common combinations:

- `bugfix-debugging + test-generation + cli-agent`: fix a bug while requiring tests and CLI execution boundaries.
- `repository-analysis + report-writing`: analyze a repository read-only and produce a formal report.
- `product-requirements + coding-feature-development`: write a PRD first, then generate a development-agent prompt.
- `knowledge-base-rag + security-threat-modeling`: design RAG while handling permissions, audit, and leakage risk.
- `medical-health-info + report-writing`: organize medical information safely without diagnosis.

When too many auxiliary branches match, keep them in this order:

1. Safety boundary.
2. Target-tool adapter.
3. Verification or tests.
4. Citation or evidence.
5. Output format.

## Eval Cases

`evals/cases/` YAML files validate generated prompt quality. They do not validate downstream task results.

Each case can include:

- `expected_primary_branch`
- `expected_auxiliary_branches`
- `required_missing_inputs`
- `expected_prompt_features`
- `forbidden_prompt_features`
- `acceptance_criteria`
- `expected_resources`
- `related_lessons`

Evaluation process:

1. Run `user_request` through the full prompt-generation protocol.
2. Compare `expected_primary_branch` and `expected_auxiliary_branches`.
3. Check whether `expected_resources` were selected.
4. Check whether missing inputs match `required_missing_inputs`.
5. Confirm every `expected_prompt_features` item appears in the prompt.
6. Confirm no `forbidden_prompt_features` item appears.
7. Use `acceptance_criteria` to decide pass or fail.

If an eval fails, review:

- Whether `router.md` routed the task incorrectly.
- Whether `metadata/resources.yaml` missed a resource binding.
- Whether `templates.md` or a branch template missed a key constraint.
- Whether `checklists.md` failed to check forbidden features.
- Whether `lessons/` needs a new failure record.

`evals/features/` contains Gherkin-style behavior checks for natural-language entry, resource registry use, bugfix quality, RAG citation and permission control, high-risk boundaries, and the lesson feedback loop.

## Resource Registry

`metadata/resources.yaml` is a lightweight resource protocol. It does not replace Markdown documentation. It connects resources with stable URIs:

- `@branch://software-engineering/bugfix-debugging`
- `@template://coding-agent/bugfix`
- `@checklist://coding-agent/final-review`
- `@eval://software-engineering/bugfix-debugging/basic`
- `@adapter://codex-cli`
- `@safety://medical-boundary`
- `@lesson://routing/ambiguous-bugfix-request`

Important registry relationships:

- `linked_templates`: common templates for a branch.
- `linked_checklists`: checklists that must be used after prompt generation.
- `linked_evals`: eval cases for prompt quality validation.
- `linked_lessons`: known failures or successful patterns.
- `compatible_adapters`: suitable target tools.
- `safety_resources`: high-risk boundary resources.

Registry design principles:

- Lightweight, not a database.
- Readable, not a replacement for Markdown.
- Stable, with URIs that do not depend on titles.
- Composable, supporting branches, adapters, safety resources, evals, and lessons together.
- Extensible, leaving room for future CLI, Web UI, or MCP prompt provider support without implementing those platforms now.

## Lessons

`lessons/` records project experience. It is not runtime memory.

Use lessons for:

- Routing failures, such as RAG being routed as a generic document summary.
- Prompt failures, such as a bugfix prompt missing verification commands.
- Unsafe patterns, such as a medical prompt giving diagnosis.
- Successful patterns, such as root-cause analysis + minimal fix + verification for bugfix tasks.
- Improvement notes, such as binding branches to evals and lessons in the registry.

A lesson should include trigger, failure mode, root cause, fix, update targets, severity, and status.

Lessons should not record:

- User identity, accounts, keys, patient details, contract text, or financial accounts.
- Full private conversations.
- Unsupported facts.

## Adapters And Safety

`adapters/` describes target-tool prompt constraints. Select an adapter whenever a target tool is named.

| Target Tool | Adapter | Prompt Focus |
|---|---|---|
| Codex | `@adapter://codex` | Working directory, read first, minimal edits, verification commands, change report |
| Codex CLI | `@adapter://codex-cli` | Command permissions, shell verification, failure handling, unverified-item reporting |
| Claude Code | `@adapter://claude-code` | Incremental edits, existing style, context reading, regression checks |
| Gemini CLI | `@adapter://gemini-cli` | Paths, commands, logs, environment assumptions |
| ChatGPT | `@adapter://chatgpt` | Structured output, fact/assumption separation, citations, uncertainty |

`safety/` defines high-risk boundaries. High-risk prompts must reference the matching safety resource instead of relying on a generic disclaimer.

| Risk Domain | Safety Resource | Prompt Boundary |
|---|---|---|
| Medical | `@safety://medical-boundary` | No diagnosis, prescription, stop/change medication advice |
| Legal | `@safety://legal-boundary` | No lawyer replacement, no final legal conclusion |
| Finance | `@safety://financial-boundary` | No personalized buy/sell advice, no guaranteed returns |
| Security | `@safety://security-boundary` | Defensive only; no exploit chain |
| Privacy | `@safety://privacy-boundary` | Minimize, redact, permission, retention boundaries |

## Maintenance And Validation

Run structural validation:

```bash
python3 scripts/skill_hub_manager.py validate
```

Show capability statistics:

```bash
python3 scripts/skill_hub_manager.py stats
```

Current capability counts:

- 45 branches.
- 34 templates.
- 48 checklists.
- 51 eval cases.
- 6 Gherkin feature files.
- 5 lesson YAML files.
- 6 adapter docs.
- 6 safety docs.

`validate` checks root files, branch structure, manifest, resource registry, eval schema, feature files, lesson fields, adapter resources, and safety resources.

## High-Risk Domains

- Medical: no diagnosis, no prescription, no stop/switch medication advice.
- Legal: no final legal conclusion, require jurisdiction and source text.
- Finance: no personalized investment advice, no guaranteed returns, no buy/sell instruction.
- Security: defensive only; no exploit chains, payloads, bypass, stealth, or persistence.
- Recruiting: no protected-attribute judgment; use job-related evidence only.
- Privacy: minimize, redact, limit purpose, and define retention boundaries.
