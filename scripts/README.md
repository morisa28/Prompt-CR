# Skill Hub Scripts

This directory contains maintenance scripts for the Prompt Engineering Skill Hub.

## Important Usage Policy

Do not run `add-branch` during normal prompt generation, prompt review, routing, or template lookup.

Only use `add-branch` when all of these are true:

1. The user explicitly asks to add, create, or register a new Prompt Engineering Skill Hub branch.
2. The requested branch is not already covered by an existing branch.
3. The user confirms the branch name, category, purpose, trigger conditions, required inputs, constraints, output format, checklist, and example.
4. A JSON spec has been prepared and reviewed.

For all other cases, use the existing router and branch files manually.

## Script

`skill_hub_manager.py`

Commands:

```bash
python3 scripts/skill_hub_manager.py stats
python3 scripts/skill_hub_manager.py validate
python3 scripts/skill_hub_manager.py capabilities
python3 scripts/skill_hub_manager.py init-spec --output /tmp/new-branch-spec.json
python3 scripts/skill_hub_manager.py add-branch --spec /tmp/new-branch-spec.json --dry-run
python3 scripts/skill_hub_manager.py add-branch --spec /tmp/new-branch-spec.json
```

## What `add-branch` Updates

- Creates `branches/<category>/<slug>.md`.
- Updates `SKILL.md` branch categories and branch index.
- Updates `router.md` branch selection rules, auxiliary routing rules, and routing examples.
- Appends a template to `templates.md`.
- Appends a checklist to `checklists.md`.
- Appends an example to `examples.md`.
- Runs structural validation after writing.

## Validation Scope

`validate` checks:

- Required root files exist.
- Every branch has the required 10-section structure.
- Branch files are referenced by `SKILL.md` and `router.md`.
- Branch templates include placeholders.
- Branches include checklist items.
- `prompt-generation-protocol.md`, `branch-composition.md`, `branches/manifest.yaml`, `metadata/resources.yaml`, `evals/README.md`, `evals/schema.md`, `lessons/README.md`, `adapters/README.md`, and `safety/README.md` exist.
- `branches/manifest.yaml` references existing branch files and eval case files.
- `metadata/resources.yaml` references existing paths.
- Every YAML file under `evals/cases/` contains the required prompt-quality eval fields.
- Feature files under `evals/features/` contain `Feature:` and `Scenario:` blocks.
- Lesson YAML files contain trigger, failure mode, root cause, fix, update targets, severity, and status.
- Adapter and safety directories include the expected major resource files.
- Known vague phrases are reported as warnings.

`stats` also reports eval case count, feature count, lesson file count, adapter file count, safety file count, branch manifest status, and resource registry status.
