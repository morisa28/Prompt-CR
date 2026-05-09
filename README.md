# Prompt-CR

Prompt-CR is a Codex skill for turning vague software engineering requests into coding-agent-ready prompts.

It focuses on clarification, execution boundaries, verification requirements, and prompt review for agents such as Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, Cursor, and Copilot.

## Branch Rule

`Prompt_CR-skill` is a permanent isolated skill branch. It must never be merged into `main`.

If this branch needs to influence `main`, manually port only the specific reviewed files or ideas into a separate branch. Do not open, approve, or complete a pull request whose head branch is `Prompt_CR-skill` and base branch is `main`.

## Structure

```text
SKILL.md                    Skill trigger and core workflow
agents/openai.yaml          Codex UI metadata
references/scenarios.md     Software engineering scenario rules
references/prompt-patterns.md
references/quality-checklist.md
references/examples.md
scripts/validate_skill.py   Lightweight repository validation
.github/workflows/          PR guard against merging this branch into main
```

## Usage

Install or copy this folder as a Codex skill, then invoke it with:

```text
Use $prompt-cr to turn this development request into a Codex-ready task prompt.
```

The skill does not run a prompt generator, web server, TypeScript pipeline, or autonomous learning loop. It is a compact instruction package for AI agents.

## Validate

```powershell
python scripts/validate_skill.py
python "C:\Users\Just Monika\.codex\skills\.system\skill-creator\scripts\quick_validate.py" "F:\file\wsl_shared_files\study\new skill\Prompt_CR"
```
