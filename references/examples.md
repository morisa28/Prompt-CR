# Prompt-CR Examples

These examples show the expected before/after style. Do not copy facts that the user did not provide.

## Bugfix

Original:

```text
Help me fix the build error. Do not change random stuff.
```

Improved:

```text
You are Codex. Work in `F:/workspace/demo-app`.

Task:
Fix the `npm run build` failure. The reported error is `TS2322` in the profile user-data flow.

Relevant materials:
- `package.json`
- `src/pages/Profile.tsx`
- `src/api/user.ts`
- Full build log: [to provide: complete build log]

Requirements:
1. Read the build configuration, the files above, related types, and relevant tests before editing.
2. Reproduce the failure with `npm run build` or explain why it cannot run.
3. Identify root cause with evidence before changing code.
4. Only modify files related to the profile user-data loading path.
5. Do not add dependencies, reformat the repository, delete tests, weaken assertions, or hide the type error.
6. After the fix, run `npm run build` and relevant tests.

Final response:
- Root cause:
- Evidence:
- Files changed:
- Key changes:
- Verification commands and results:
- Unverified items:
- Remaining risks:
```

## Feature Implementation

Original:

```text
Write a prompt for Codex to add dark mode to settings.
```

Improved:

```text
You are Codex. Work in `/repo/web`.

Task:
Add a dark-mode toggle to the settings page.

User flow:
Users can open settings, switch dark mode on or off, refresh the page, and keep their selected theme.

Acceptance criteria:
- The settings page shows a clear theme toggle.
- The selected theme is applied immediately.
- The selection persists across refresh.
- Loading/default state does not flash incorrect UI if the app already has a theme-loading pattern.
- Existing settings behavior remains unchanged.

Allowed scope:
- Settings page/component files.
- Theme state/persistence files.
- Relevant tests.

Non-goals:
- Do not redesign the settings page.
- Do not introduce a new UI library.
- Do not change unrelated routes.

Requirements:
1. Read `package.json`, settings page files, theme/style files, state management, and existing tests first.
2. Follow existing component and styling patterns.
3. Cover normal, default, persistence-failure, and accessibility states where relevant.
4. Run `npm run build` and the relevant test command. If unavailable, explain what was checked manually.

Final response:
- Implementation approach:
- Files changed:
- Key logic:
- User-flow coverage:
- Verification:
- Unverified items:
- Remaining risks:
```

## Test Generation

Original:

```text
Add tests for login.
```

Improved:

```text
You are Codex. Work in `/repo/api`.

Task:
Add behavior-focused tests for the login endpoint.

Behaviors to cover:
- successful login;
- wrong password;
- missing required fields;
- locked user;
- rate-limit or equivalent abuse protection if already implemented.

Test level and framework:
Use the existing API test framework and fixtures discovered from the repository.

Test command:
`[to provide or discover from package/pyproject config]`

Requirements:
1. Read test configuration, login route/controller, auth service, existing tests, fixtures, and mocks before editing.
2. Assert response codes, error shape, authentication state, and relevant side effects.
3. Do not delete, skip, weaken, or rename existing tests.
4. Do not change business logic solely to make tests pass. If a real bug is found, report it with evidence and make the smallest fix only if in scope.
5. Run the relevant test command and report results.

Final response:
- Test strategy:
- Covered scenarios:
- Test files changed:
- Fixture/mock notes:
- Command results:
- Uncovered cases:
```

## Code Review / Repository Analysis Boundary

Original:

```text
Look at this repo and tell me what is wrong.
```

Improved for read-only analysis:

```text
You are Codex. Analyze `/repo/app` without editing files.

Goal:
Identify the main architecture, entry points, high-risk modules, and likely test gaps.

Focus areas:
- build and runtime entry points;
- data flow between frontend and backend;
- authentication and permission boundaries;
- existing test coverage signals.

Requirements:
1. Read only. Do not modify files or run migrations.
2. Inspect configuration, entry points, key modules, and tests.
3. Cite file paths for each claim.
4. Separate confirmed facts from inferences.

Final response:
- Overview:
- Files inspected:
- Architecture and data flow:
- Risks and test gaps:
- Recommendations:
```

Improved for code review:

```text
You are Codex. Review the current diff in `/repo/app`.

Review focus:
Correctness, regressions, security-sensitive behavior, and missing tests.

Requirements:
1. Inspect the diff and related files.
2. Lead with findings ordered by severity.
3. Include file/line references when available.
4. Do not focus on style unless it creates a concrete risk.
5. If no issues are found, say so and mention residual test gaps.

Final response:
- Findings:
- Open questions:
- Test gaps:
- Brief summary:
```
