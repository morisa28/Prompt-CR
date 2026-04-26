---
name: prompt-engineering
description: Use when the user asks to optimize or generate a prompt for Codex, Gemini CLI, Claude Code, or another coding agent; when a vague request must become an executable task prompt; when plan mode, complex development, debugging, refactoring, document/PDF analysis, visual/3D interaction work, or multi-stage iteration needs structured instructions with context, constraints, outputs, acceptance criteria, and self-checks.
---

# Prompt Engineering Skill

## 1. Skill Overview
Use this skill to turn an incomplete user request into an executable prompt that an agent can follow.

The prompt must convert the request into:
- a specific task goal;
- the necessary context and source material;
- staged execution steps;
- hard constraints and prohibited actions;
- output format;
- acceptance criteria;
- self-check and iteration rules.

This skill supports Codex plan mode, complex development task decomposition, prompt rewriting, multi-stage execution design, and conversion of PDF/document/code/image inputs into agent-ready tasks.

## 2. When to Use This Skill
Use this skill when any of these triggers appear:
- The user asks to optimize a prompt.
- The user asks for a more detailed prompt.
- The user asks for a Codex prompt.
- The user asks for a Gemini CLI or Claude Code prompt.
- The user gives a vague requirement that must become an executable task.
- The user asks for plan mode planning.
- The user asks for complex code development, bug fixing, or refactoring.
- The user asks to read multiple files and produce a structured result.
- The user asks to generate task instructions from a PDF, document, image, or repository.
- The user asks for multi-stage iteration, staged delivery, or a reusable workflow.

## 3. When Not to Use This Skill
Do not use this skill when:
- the user only needs a short direct answer;
- the user only asks to translate a short phrase;
- the user is having ordinary casual conversation;
- the user explicitly refuses a structured prompt;
- the task is small enough that a direct command or one-paragraph answer solves it.

## 4. Core Prompt Engineering Principles
- **Use Persona, Task, Context, Format as the base frame.** Persona states the agent role, Task states the verb and result, Context states source facts and boundaries, Format states the exact shape of the output.
- **Start with an observable verb.** Use verbs such as read, inspect, compare, implement, fix, refactor, test, summarize, extract, convert, validate, or report. Avoid weak verbs such as handle, improve, polish, look at, or help with unless they are followed by concrete outputs.
- **Bind claims to inputs.** Name files, folders, logs, screenshots, PDFs, URLs, commands, or pasted text. If a fact is not provided, require the agent to mark it as an assumption or ask only blocking questions.
- **Split related tasks.** If a request contains several outputs or decisions, break it into stages with a target, input, output, and acceptance condition for each stage.
- **Write constraints explicitly.** Use "must" for hard requirements, "must not" for prohibited actions, "prefer" for ranking, and "unless" for exceptions.
- **Specify the output before execution starts.** Choose Markdown sections, a table, checklist, JSON, file tree, patch summary, test report, or final report based on the task type.
- **Add acceptance criteria.** State how the user or agent knows the task is complete.
- **Add self-checks.** Require checks for missing context, conflicts, hallucinated facts, excessive changes, output-format drift, and unmet acceptance criteria.
- **Use iterative prompting deliberately.** For follow-up prompts, state what to keep, what to change, and how to judge the new output.
- **Review generated output before use.** The final prompt must require the agent to check clarity, relevance, and factual support before final delivery.

## 5. Prompt Construction Workflow

| Step | Purpose | Operation | Common Error | Output |
| --- | --- | --- | --- | --- |
| 1. Identify task type | Select the correct prompt shape | Classify as code, bug, refactor, plan, document, PDF, visual, CLI, research, or mixed | Using one generic prompt for all tasks | `Task type: ...` |
| 2. Extract user goal | Define the final result | Rewrite the desired outcome as one sentence with an action verb and object | Keeping "make it better" as the goal | `Goal: ...` |
| 3. Complete context | Provide source facts and boundaries | Add repo, language, framework, business context, user constraints, and known errors | Asking the agent to infer project facts before reading files | `Context: ...` |
| 4. Define inputs | Prevent source ambiguity | List exact paths, logs, PDFs, screenshots, pasted text, URLs, or commands | Saying "the file" without naming it | `Inputs: ...` |
| 5. Split execution stages | Make complex work controllable | Create ordered stages: inspect, analyze, design, implement, test, report | Combining reading, editing, and validation in one vague step | `Steps: 1...` |
| 6. Set hard constraints | Protect scope and user work | State must, must not, prefer, unless, and approval boundaries | Omitting forbidden actions | `Constraints: ...` |
| 7. Design output format | Make results machine/user checkable | Pick sections, table, JSON, checklist, code block, file list, or test report | Letting the model choose any format | `Output format: ...` |
| 8. Add acceptance criteria | Define done | List functional, format, test, safety, and reproducibility checks | Ending at "finish the task" | `Acceptance criteria: ...` |
| 9. Add risk controls | Reduce unintended damage | Add rollback, minimal-change, no unrelated refactor, dependency, network, or visual-analysis boundaries | Allowing broad rewrites for narrow issues | `Risk controls: ...` |
| 10. Add self-checks | Catch omissions | Require final review against constraints, inputs, and acceptance criteria | Trusting first output without verification | `Self-check: ...` |
| 11. Output final prompt | Deliver reusable instruction | Produce a clean prompt without commentary unless requested | Mixing analysis notes into the prompt body | `Final prompt: ...` |

## 6. Prompt Optimization Workflow
When rewriting an existing prompt:
1. Identify the original prompt's task type and intended user outcome.
2. Check whether the target result is observable.
3. Check whether required context, files, logs, versions, screenshots, or documents are named.
4. Check whether boundaries are missing: allowed files, forbidden refactors, dependencies, network, visual tools, or destructive actions.
5. Check whether output format is missing.
6. Check whether acceptance criteria are missing.
7. Check whether execution order is missing.
8. Check whether ambiguous words remain, such as "better", "nice", "quickly", "clean", "fix it", or "summarize well".
9. Check whether the prompt is too open-ended for one pass.
10. Rewrite it as a strong execution prompt with role, task, context, inputs, steps, constraints, output format, acceptance criteria, and self-check.

## 7. Plan Mode Prompting Rules
For Codex plan mode, the prompt must:
- request analysis before modification;
- require Codex to read the relevant files first;
- require Codex to identify risks, unknowns, and likely touched files;
- require an execution plan with ordered steps;
- require validation commands or manual verification steps;
- require explicit pending questions only when a missing answer blocks a safe plan;
- require waiting for user confirmation before code edits, unless the user explicitly authorizes automatic execution.

For plan mode, the prompt must not:
- ask Codex to immediately rewrite large areas of code;
- combine planning and implementation in the same unconfirmed step;
- hide uncertainty behind confident assumptions;
- omit the files or areas likely to change.

## 8. Complex Task Decomposition Rules
Break complex tasks into these stages when applicable:
- **Requirement clarification:** target, non-goals, constraints, unknowns.
- **File scan:** paths, configs, entry points, tests, assets, docs.
- **Current-state analysis:** existing behavior, failure mode, dependencies.
- **Solution design:** smallest coherent change, alternatives, risk tradeoffs.
- **Minimal implementation:** scoped edits only.
- **Test verification:** automated tests, build, lint, visual/manual checks.
- **Issue repair:** fix failures caused by the change.
- **Documentation update:** only when user-facing behavior or workflow changes.
- **Final report:** changed files, verification result, residual risks.

Each stage must state:
- target;
- inputs;
- output;
- acceptance condition.

## 9. Context Gathering Rules
For code and repository tasks, instruct Codex to gather context in this order:
1. Read the user-specified paths.
2. Read README or project docs when available.
3. Read project config such as `package.json`, `pyproject.toml`, `vite.config.js`, `tsconfig.json`, lockfiles, or test config.
4. Read relevant source files, tests, and error logs.
5. Search with targeted keywords when the entry point is unclear.
6. For PDF or document tasks, read the table of contents, headings, representative sections, and task-relevant excerpts before extraction.
7. For visual tasks, inspect screenshots, object names, camera/view constraints, and reproduction steps before changing UI or 3D logic.

Do not ask Codex to guess project structure, framework behavior, or file contents when local context can be read.

## 10. Constraint Writing Rules
- Use **must** for non-negotiable requirements.
- Use **must not** for prohibited actions.
- Use **prefer** for ranking when more than one valid approach exists.
- Use **unless** for explicit exceptions.
- Write paths, commands, framework versions, dependency rules, and environment constraints literally.
- For network search, dependency installation, browser automation, visual analysis, and destructive commands, state when they are allowed and whether approval is required.
- For Windows/WSL paths, include both the user path and expected WSL path when known.

## 11. Output Format Design Rules

| Task Type | Preferred Output |
| --- | --- |
| Plan mode | Markdown sections: findings, risks, plan, files, validation, questions |
| Bug fix | cause, changed files, patch summary, tests, residual risk |
| Refactor | scope table, behavior preserved, staged plan, regression tests |
| Document/PDF analysis | sectioned report, extracted rules, uncertain items, citations or page markers when available |
| Prompt rewriting | final prompt in one fenced block, then optional rationale |
| Data extraction | JSON or table with schema stated first |
| CLI execution | commands, expected output, failure handling |
| Visual/3D/interaction | target behavior, object names, viewport, interaction rules, screenshot/manual checks |
| Final completion | files changed, validation run, result, remaining issues |

## 12. Acceptance Criteria Design Rules
Acceptance criteria must answer:
- Is the requested function or artifact complete?
- Does it obey the constraints and prohibited actions?
- Did required tests, builds, lint, screenshots, or manual checks run?
- Did the change avoid breaking existing behavior?
- Were specified files created or modified?
- Can the user reproduce the result?
- Can the user inspect the output format directly?
- Is there a failure-handling path or next repair step?

## 13. Self-Check and Iteration Rules
Before finalizing a generated prompt, require a self-check:
- Goal is concrete and contains an action verb.
- Inputs are named or missing inputs are marked.
- Steps are ordered and executable.
- Constraints do not conflict.
- Output format is explicit.
- Acceptance criteria are testable.
- Unrelated changes are prohibited.
- Claims are grounded in supplied or readable context.
- If verification fails, the agent must report the failing command/check and the next fix step.

For iterative follow-up prompts, state:
- what existing output must be preserved;
- what must change;
- what new constraint or context is being added;
- what acceptance criterion decides success.

## 14. Common Prompt Problems and Fixes

| Problem | Risk | Fix | Example Rewrite |
| --- | --- | --- | --- |
| Vague goal | Agent chooses the wrong target | Replace vague wording with action + object + result | `Refactor the auth middleware to remove duplicated token parsing while preserving response codes.` |
| Missing context | Agent guesses | Name repo, path, logs, inputs, and environment | `Work in /repo/app. Read package.json, src/auth.ts, and the pasted stack trace first.` |
| Task too large | Low-quality broad changes | Split into stages with approval points | `First analyze and propose a plan; do not edit files until confirmation.` |
| No output format | Hard to review | Specify sections, table, JSON, checklist, or report | `Return a table with file, issue, severity, and fix.` |
| No constraints | Scope creep | Add must/must not/prefer/unless | `Must not introduce dependencies or rewrite unrelated components.` |
| No acceptance criteria | "Done" is unclear | Add functional, test, and format checks | `Done when npm test passes and the report lists changed files.` |
| No execution order | Agent edits too soon | Require read, analyze, plan, implement, verify | `Read related files, explain cause, then patch the smallest file set.` |
| No negative instructions | Agent removes needed behavior | Name protected behavior and files | `Must preserve existing keyboard shortcuts and saved settings.` |
| Summary written as development | Agent modifies files | State read-only mode | `Analyze the PDF and produce rules; do not edit source code.` |
| Plan written as execution | Agent changes files in plan mode | Add confirmation boundary | `Output a plan and wait for approval before edits.` |
| Visual task lacks observable detail | Agent cannot verify UI | Name object, viewport, interaction, screenshot checks | `On 1440x900, dragging knob A clockwise must increase value 0-100 without moving knob B.` |
| Code task lacks path or logs | Search is too broad | Include paths, reproduction, logs, tests | `Bug occurs in src/router.ts after running npm test; use the pasted error as primary evidence.` |

## 15. Reusable Prompt Templates
Detailed copy-ready templates live in [templates.md](templates.md). Load that file when the user asks for a full prompt or when the task is complex.

Available templates:
- 15.1 通用 Codex 任务 Prompt 模板
- 15.2 Prompt 优化模板
- 15.3 代码修复 Prompt 模板
- 15.4 项目重构 Prompt 模板
- 15.5 文档阅读与总结 Prompt 模板
- 15.6 PDF 深度分析 Prompt 模板
- 15.7 复杂功能开发 Prompt 模板
- 15.8 多阶段迭代 Prompt 模板
- 15.9 Plan 模式任务规划 Prompt 模板
- 15.10 视觉/3D/交互任务 Prompt 模板

## 16. Codex-Specific Rules
- Prefer the existing project stack, helpers, style, and tests.
- Read related files before modifying code.
- Do not create unrelated structure.
- Do not rewrite broad areas when a local fix is sufficient.
- Do not delete user functionality or user changes.
- Do not add dependencies without a stated need and user-compatible install path.
- Do not ignore logs, failing commands, or reproduction steps.
- Treat Windows and WSL paths carefully; preserve spaces and parentheses in paths.
- For npm, Vite, Vue, Spline, Blender, and similar projects, preserve existing interaction flow and asset references unless the task explicitly changes them.
- Strictly honor user constraints such as "do not use visual analysis components" or "plan only".

## 17. Examples
Full examples live in [examples.md](examples.md). Load that file when the user asks for examples or when a rewrite would benefit from a concrete pattern.

Examples included:
- User asks to make a prompt better for Codex.
- User asks to fix a Vue project error.
- User asks to read a PDF and turn its methods into a skill.
- User asks to build a 3D interaction such as knob dragging.

## 18. Final Checklist
Use this checklist before returning a prompt:
- Clear task goal.
- Working directory or execution context.
- Input materials named.
- Ordered execution steps.
- Hard constraints.
- Prohibited actions.
- Output format.
- Acceptance criteria.
- Self-check requirements.
- No unresolved vague expressions.
- Directly executable by Codex.
- Fits the task type.
- Avoids broad unrelated changes.
- Marks uncertain information.

Additional checklists live in [checklists.md](checklists.md).
