---
name: prompt-cr
description: Use when a user needs to clarify, review, or rewrite a software engineering request into a coding-agent-ready prompt for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, Cursor, Copilot, or another AI coding agent.
---

# Prompt-CR

Prompt-CR turns vague software engineering requests into prompts that a coding agent can execute safely and verify. It is a lightweight clarification and review skill, not a prompt-generation service, scorer runtime, or autonomous learning system.

## Branch Isolation Rule

This repository variant is maintained on the `Prompt_CR-skill` branch as an isolated skill package. Do not merge `Prompt_CR-skill` into `main` at any time. If content from this branch is needed elsewhere, manually port the specific reviewed files or ideas through a different branch.

## Use This Skill When

- The user wants a better prompt for Codex, Claude Code, Gemini CLI, ChatGPT, Cursor, Copilot, or another coding agent.
- The request is about bug fixing, feature implementation, refactoring, tests, code review, repository analysis, API design, database migration, DevOps/CI, frontend/backend work, algorithms, CLI-agent execution, planning, or defensive security review.
- The user asks whether a prompt is ready for a coding agent, or wants missing information and risks identified before handing the task to an agent.

Do not use this skill for broad non-software domains such as medical, legal, finance, marketing, creative writing, generic tutoring, or document analysis unless the final deliverable is specifically a software engineering agent prompt.

## Core Workflow

1. Identify the primary software engineering scenario. If more than one applies, choose one primary scenario and at most two auxiliary scenarios.
2. Extract known facts: target agent/tool, working directory, objective, existing materials, constraints, allowed changes, forbidden actions, verification commands, and expected output.
3. Detect blockers. Ask concise clarification questions only for missing information that would make the target agent unsafe or unable to act. For non-blocking gaps, use explicit placeholders such as `[to provide: verification command]`.
4. Build the final agent prompt with:
   - role and target tool;
   - working directory or repository location;
   - task objective and current context;
   - relevant files, logs, screenshots, specs, diffs, or commands;
   - execution steps;
   - allowed modification scope and forbidden actions;
   - verification commands or manual checks;
   - final report format;
   - failure handling and honesty rules.
5. Review the prompt against the quality checklist before returning it. Fix vague language, missing acceptance criteria, missing verification, unsafe broad permissions, or fabricated facts.
6. Return the improved prompt plus a short note listing remaining assumptions or missing details.

## Load References As Needed

- Read `references/scenarios.md` when choosing scenario-specific required inputs and prompt rules.
- Read `references/prompt-patterns.md` when assembling the final prompt format or adapting it to a coding agent.
- Read `references/quality-checklist.md` when scoring or reviewing prompt readiness.
- Read `references/examples.md` when the user needs examples or before/after comparisons.

## Scenario Selection Rules

- Use bugfix/debugging when there is an error log, failing command, failing test, runtime exception, blank screen, CLI failure, or regression.
- Use feature implementation when the user wants new observable behavior, UI, backend logic, integration, or workflow.
- Use test generation when the task is primarily to add or improve tests.
- Use code review when the expected output is findings, severity, file locations, and test gaps rather than edits.
- Use repository analysis when the task is explicitly read-only understanding, mapping, or explanation.
- Use refactor/architecture when behavior should stay the same while structure changes.
- Use API design, database migration, DevOps/CI, algorithm, security, CLI-agent, or plan-mode scenarios when those concerns dominate.

## Output Shape

Prefer this response structure:

```text
Scenario:
Readiness:
Missing or assumed details:
Improved coding-agent prompt:
```

When the user asks only for review, lead with issues and do not rewrite the whole prompt unless useful. When the user asks for a final prompt, provide a copy-ready prompt.

## Non-Negotiables

- Do not invent files, logs, command outputs, screenshots, tests, or repository facts.
- Do not hide uncertainty. Mark unknowns as assumptions or placeholders.
- Do not grant the target agent broad permission to rewrite unrelated parts of a repository unless the user explicitly asks for that scope.
- Do not remove verification just because commands are unknown; ask for them or tell the target agent how to discover and report them.
- Do not claim the prompt is guaranteed to succeed. The skill improves task clarity, execution boundaries, and verifiability.
