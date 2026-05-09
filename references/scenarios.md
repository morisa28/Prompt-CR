# Software Engineering Scenarios

Use this reference to select a primary scenario and collect the minimum information needed for a coding-agent-ready prompt.

## Bugfix / Debugging

Use for build failures, failing tests, runtime errors, blank screens, CLI errors, regressions, and dependency conflicts.

Required details:
- working directory;
- failing command, reproduction steps, or failing user flow;
- complete error log, stack trace, assertion, or visible symptom;
- expected behavior and actual behavior;
- relevant files, recent changes, environment, and verification commands when known.

Prompt rules:
- require the agent to read logs, configs, referenced files, tests, and recent changes before editing;
- require root-cause evidence before changing code;
- ask for the smallest fix that addresses the failing path;
- forbid deleting tests, weakening assertions, swallowing errors, broad refactors, and unrelated formatting;
- require rerunning the original failing command or explaining why it cannot run.

Final report should include root cause, evidence, changed files, key changes, verification results, unverified items, and remaining risks.

## Feature Implementation

Use for new user-visible behavior, UI components, backend logic, workflows, integrations, and product requirements that need implementation.

Required details:
- working directory;
- feature goal;
- user flow or API behavior;
- acceptance criteria;
- allowed modification scope;
- verification steps.

Optional details:
- tech stack, related files, design assets, API contracts, data model, non-goals, accessibility or performance expectations.

Prompt rules:
- ask the agent to inspect project patterns before editing;
- define observable behavior, not only internal changes;
- cover normal, loading, empty, error, permission, and edge states when relevant;
- forbid unrelated refactors, new dependencies without justification, and public contract changes unless requested;
- require tests, build, lint, or manual verification.

Final report should include implementation approach, changed files, key logic, user-flow coverage, verification, and risks.

## Refactor / Architecture

Use when the goal is structural improvement while preserving behavior.

Required details:
- working directory;
- refactor goal;
- behavior that must remain unchanged;
- allowed scope and files;
- regression tests or verification commands.

Prompt rules:
- make behavior preservation explicit;
- require the agent to map current dependencies before moving code;
- stage changes in small reversible steps;
- forbid feature additions unless explicitly requested;
- require regression verification and a summary of public interfaces touched.

## Test Generation

Use when the task is to add or improve unit, integration, E2E, regression, or coverage tests.

Required details:
- working directory;
- test target;
- behaviors to cover;
- test level;
- framework or existing test style;
- test command.

Prompt rules:
- ask the agent to read test configuration, target code, existing tests, fixtures, and mocks first;
- assert public behavior or stable contracts rather than brittle implementation details;
- cover happy path, error path, boundary cases, permissions, and regression paths when relevant;
- forbid deleting, skipping, weakening, or renaming existing tests to pass;
- require running the test command or reporting why it cannot run.

Final report should include test strategy, covered scenarios, new or changed test files, fixture/mock notes, command results, and uncovered cases.

## Code Review

Use when the user wants review findings rather than direct implementation.

Required details:
- working directory or diff location;
- review scope;
- files, commit range, PR, or patch;
- review focus such as correctness, security, performance, maintainability, or tests.

Prompt rules:
- require findings first, ordered by severity;
- require file and line references when available;
- prioritize bugs, regressions, risks, and missing tests over style;
- include open questions and test gaps;
- do not ask the target agent to edit unless the user requested fixes.

## Repository Analysis

Use for read-only understanding, onboarding, architecture mapping, module explanations, and risk reports.

Required details:
- working directory;
- analysis goal;
- focus areas;
- output depth and audience.

Prompt rules:
- state that the task is read-only;
- require the agent to cite inspected files and evidence;
- ask for architecture, entry points, data flow, dependencies, risks, and next steps as relevant;
- forbid edits, generated migrations, or speculative claims.

## API Design

Use for REST, GraphQL, gRPC, OpenAPI, webhook, or SDK contract design.

Required details:
- API goal and consumers;
- resource model;
- request and response fields;
- auth and authorization model;
- error cases;
- versioning, pagination, rate limits, and examples when relevant.

Prompt rules:
- define contracts before implementation;
- require examples and failure responses;
- include validation, auth, observability, compatibility, and tests;
- avoid changing existing public contracts without migration notes.

## Database Migration

Use for schema changes, data migrations, ORM migrations, backfills, indexes, and rollback plans.

Required details:
- database type and migration tool;
- current schema and target schema;
- affected tables/services;
- data volume and downtime tolerance when known;
- backup status, rollback plan, and staging validation.

Prompt rules:
- treat destructive changes as high risk;
- require backup, rollback, compatibility, and staging checks;
- include transaction strategy, idempotency, lock risk, and data validation;
- forbid production changes without explicit authorization.

## DevOps / CI

Use for CI/CD, build pipelines, runners, Docker, deployment, caching, secrets, and rollback.

Required details:
- repository path;
- CI/CD platform;
- failing job or deployment target;
- build/test/deploy commands;
- logs;
- secrets and environment policy.

Prompt rules:
- require evidence from workflow files, logs, and environment assumptions;
- protect secrets;
- separate local code bugs from pipeline configuration issues;
- include rollback and validation for deployment changes.

## Security Threat Modeling

Use only for defensive security review, threat modeling, auth/permission analysis, data exposure, and mitigation prompts.

Required details:
- system scope;
- assets;
- actors;
- trust boundaries;
- entry points;
- authorization model;
- existing controls and audit requirements when known.

Prompt rules:
- keep the task defensive;
- ask for risks, impact, likelihood, mitigations, validation, and logging;
- avoid exploit instructions, bypass steps, persistence, or offensive payloads.

## Algorithm Problem Solving

Use for coding interview tasks, algorithm design, data structures, complexity, proof, and edge cases.

Required details:
- problem statement;
- input and output format;
- constraints;
- examples;
- target language;
- desired explanation depth.

Prompt rules:
- require edge cases and complexity;
- include proof or correctness argument when requested;
- ask for tests based on examples and boundary constraints.

## CLI Agent Execution

Use as an auxiliary scenario when the target tool will run commands in a repository.

Required details:
- CLI tool;
- working directory;
- allowed commands;
- forbidden actions;
- approval/network policy;
- final report format.

Prompt rules:
- require reading before editing;
- make command permissions explicit;
- require honest reporting of failed commands;
- forbid fabricated outputs and unapproved destructive actions.

## Plan Mode

Use when the user wants a plan before edits or when the task is high risk.

Required details:
- working directory;
- task goal;
- read-first scope;
- risk focus;
- expected verification.

Prompt rules:
- make the task non-mutating until plan approval;
- require current-state findings, risks, staged implementation plan, and acceptance criteria;
- forbid file edits during planning.

## Frontend Implementation

Use as a feature implementation specialization for UI pages, components, dashboards, tools, games, and interactions.

Required details:
- target route/page/component;
- users and workflow;
- states to support;
- responsive requirements;
- visual/design constraints;
- verification method.

Prompt rules:
- inspect existing design system and component patterns first;
- cover loading, empty, error, mobile, desktop, accessibility, and text overflow;
- require browser or visual verification when possible;
- avoid marketing-style pages unless requested.

## Backend Implementation

Use as a feature implementation specialization for services, APIs, jobs, auth, validation, data writes, and integrations.

Required details:
- service/module target;
- behavior and business rules;
- inputs/outputs;
- data model;
- validation and error handling;
- tests and observability.

Prompt rules:
- inspect existing service patterns first;
- define compatibility and migration concerns;
- include auth, validation, idempotency, logging, and rollback where relevant.
