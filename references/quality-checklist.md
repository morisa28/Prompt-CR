# Prompt Quality Checklist

Use this checklist to review or score a coding-agent prompt before returning it.

## 100 Point Rubric

- Clarity, 15: the task objective is specific, observable, and not overloaded.
- Context, 15: the prompt gives enough project, product, error, or design context.
- Locatable inputs, 10: files, directories, logs, commands, links, screenshots, or specs are identifiable.
- Constraints, 15: allowed scope, forbidden actions, non-goals, and permissions are explicit.
- Output format, 10: the target agent knows what final report or artifact to produce.
- Acceptance criteria, 15: success can be checked objectively.
- Risk handling, 10: destructive actions, security, data, production, migration, and verification risks are handled.
- Agent adaptation, 10: the prompt fits the target tool's capabilities and execution environment.

Readiness bands:
- 85-100: ready for a coding agent.
- 70-84: usable with minor assumptions.
- 50-69: needs clarification before execution.
- below 50: not safe or actionable for a coding agent.

## Blocking Gaps

Ask a clarification question before producing a final execution prompt when any of these are missing and cannot be inferred:

- no working directory or repository location for a file-editing task;
- no failure log, symptom, or reproduction path for a bugfix task;
- no observable behavior or acceptance criteria for a feature task;
- no test target or framework for a test-generation task;
- no review scope for a code review task;
- no authorization boundary for destructive, production, database, credential, payment, or security-sensitive work.

If the user wants a draft anyway, mark the missing detail with `[to provide: ...]`.

## Common Low-Quality Patterns

- "Fix the project" without the failing command, symptom, or scope.
- "Add this feature" without user flow, acceptance criteria, or allowed files.
- "Write tests" without target behavior, test level, framework, or command.
- "Do not mess things up" without concrete forbidden actions.
- "Make it better" without success criteria.
- Placeholder text such as "TODO", "specific path", "run tests", or "as needed" left unresolved.
- Claims that the target agent should report tests passing without actually running them.
- Broad permission to rewrite architecture, update dependencies, delete files, or reformat the repository without justification.

## Review Procedure

1. Identify the scenario and target agent.
2. Check for blockers.
3. Score the prompt with the rubric if requested.
4. List the top three missing or weakest details.
5. Rewrite the prompt so it includes context, scope, verification, output format, and failure handling.
6. Add a short assumptions note when details remain unknown.

## Final Self-Check

Before returning the improved prompt, verify:

- it says where the target agent should work;
- it states what the target agent should change or not change;
- it names the relevant materials or tells the agent how to discover them;
- it includes at least one verification path or a clear instruction to report inability to verify;
- it forbids fabricated command results;
- it asks for a concise final report with changed files, verification, and risks.
