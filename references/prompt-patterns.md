# Prompt Construction Patterns

Use these patterns to assemble the final coding-agent prompt. Adapt wording to the target tool and scenario.

## Universal Coding-Agent Prompt

```text
You are {{target_agent}}. Work in {{working_directory}}.

Task:
{{task_objective}}

Context:
{{known_context}}

Relevant materials:
{{files_logs_specs_or_links}}

Execution requirements:
1. Read the relevant project files, configuration, tests, and provided materials before editing.
2. Confirm the current behavior or failure path when practical.
3. Implement the smallest change that satisfies the task and preserves unrelated behavior.
4. Follow existing project patterns and helper APIs.
5. Do not perform unrelated refactors, broad formatting, dependency changes, file deletion, or public contract changes unless explicitly requested.
6. Run {{verification_commands}}. If a command cannot run, explain why and what was attempted.

Acceptance criteria:
{{acceptance_criteria}}

Final response:
- Task understanding:
- Files changed:
- Key changes:
- Verification commands and results:
- Unverified items:
- Remaining risks:
```

## Bugfix Prompt Skeleton

```text
You are {{target_agent}}. In {{working_directory}}, fix the failure below.

Failure:
{{error_log_or_symptom}}

Reproduction:
{{reproduction_steps_or_command}}

Expected behavior:
{{expected_behavior}}

Actual behavior:
{{actual_behavior}}

Requirements:
1. Read the failing log, stack trace, related configuration, referenced source files, tests, and recent changes before editing.
2. Reproduce the failure or explain why reproduction is not possible.
3. Identify root cause with evidence before changing code.
4. Apply the smallest safe fix. Do not delete tests, weaken assertions, hide errors, or do unrelated refactors.
5. Run the original failing command and relevant regression tests.

Final response:
- Root cause:
- Evidence:
- Files changed:
- Key changes:
- Verification:
- Unverified items:
- Remaining risks:
```

## Feature Prompt Skeleton

```text
You are {{target_agent}}. In {{working_directory}}, implement {{feature_goal}}.

User flow:
{{user_flow}}

Acceptance criteria:
{{acceptance_criteria}}

Allowed scope:
{{allowed_scope}}

Non-goals:
{{non_goals}}

Requirements:
1. Read existing project configuration, related files, styles, tests, and patterns before editing.
2. Design the smallest implementation that covers normal, loading, empty, error, permission, and edge states where relevant.
3. Follow existing style and architecture. Do not introduce dependencies or public contract changes unless required and explained.
4. Add or update tests when the project has a relevant test pattern.
5. Run {{verification_commands}} or explain why verification cannot run.

Final response:
- Implementation approach:
- Files changed:
- Key logic:
- User-flow coverage:
- Verification:
- Unverified items:
- Remaining risks:
```

## Test Prompt Skeleton

```text
You are {{target_agent}}. In {{working_directory}}, add or improve tests for {{test_target}}.

Behaviors to cover:
{{behaviors}}

Test level and framework:
{{test_level_and_framework}}

Test command:
{{test_command}}

Requirements:
1. Read test configuration, target code, existing tests, fixtures, and mocks before editing.
2. Cover public behavior and stable contracts, not brittle implementation details.
3. Include happy path, error path, boundary cases, permission cases, and regression cases where relevant.
4. Do not delete, skip, weaken, or rename existing tests to pass.
5. Run {{test_command}} and report results.

Final response:
- Test strategy:
- Covered scenarios:
- Test files changed:
- Fixture/mock notes:
- Command results:
- Uncovered cases:
```

## Review Prompt Skeleton

```text
You are {{target_agent}}. Review {{review_scope}} in {{working_directory}}.

Review focus:
{{review_focus}}

Materials:
{{diff_files_or_commit_range}}

Requirements:
1. Inspect the relevant diff, files, tests, and contracts.
2. Lead with findings ordered by severity.
3. For each finding, include file/line reference, impact, and a concrete fix direction.
4. Prioritize bugs, regressions, security issues, data loss, and missing tests over style.
5. If no issues are found, say so and note residual test gaps or risk.

Final response:
- Findings:
- Open questions:
- Test gaps:
- Brief summary:
```

## Read-Only Analysis Prompt Skeleton

```text
You are {{target_agent}}. Analyze {{analysis_goal}} in {{working_directory}} without editing files.

Focus areas:
{{focus_areas}}

Requirements:
1. Read only. Do not modify files, run migrations, or generate commits.
2. Inspect entry points, configuration, relevant modules, tests, and docs.
3. Cite file paths for claims.
4. Separate confirmed facts from inferences and unknowns.

Final response:
- Overview:
- Files inspected:
- Architecture or flow:
- Risks or gaps:
- Recommendations:
```

## Target-Agent Adaptation

Codex / Codex CLI:
- include working directory, editable scope, forbidden actions, command permissions, verification commands, and final reporting requirements;
- tell the agent to read files first and avoid unrelated changes;
- require honest reporting of failed or skipped checks.

Claude Code / Gemini CLI:
- include repository path, command plan, expected files, permission boundaries, and failure handling;
- keep the task concrete and avoid open-ended "improve the project" language.

ChatGPT / web chat:
- if the model cannot access files, ask it to produce a prompt or plan and clearly mark required user-provided materials;
- avoid asking it to claim it has run commands or inspected local files.

Cursor / IDE assistant:
- include target files, edit boundaries, test command, style constraints, and desired diff size;
- ask it to preserve existing APIs and avoid global reformatting.
