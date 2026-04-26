# Prompt Engineering Skill

A Codex skill for turning vague requests, complex development tasks, plan-mode instructions, PDF/document analysis tasks, and prompt optimization requests into clearer, more specific, and more executable agent instructions.

This is not a generic prompt-writing tutorial. Its purpose is to help Codex automatically add task goals, context, input materials, execution steps, constraints, output formats, acceptance criteria, and self-check requirements when generating or improving prompts.

## When to Use

Use this skill when:

- The user asks to optimize a prompt.
- The user asks for a more detailed prompt or a prompt better suited for Codex.
- The user asks for a prompt for Codex, Gemini CLI, or Claude Code.
- The user provides a vague request that needs to become an executable task.
- The user asks Codex to plan first and avoid immediate code changes.
- The user asks for complex feature development, bug fixing, refactoring, or multi-stage iteration.
- The user asks to read a PDF, document, image, or repository and produce structured task instructions.
- The output needs explicit constraints, acceptance criteria, testing instructions, and risk controls.

Do not use this skill for casual chat, short phrase translation, simple Q&A, or cases where the user explicitly does not want a structured prompt.

## What This Skill Does

This skill guides Codex to:

- Organize prompts around Persona, Task, Context, and Format.
- Rewrite vague goals into verifiable task goals.
- Specify input materials such as file paths, logs, screenshots, PDFs, URLs, or commands.
- Break complex tasks into stages, each with a target, input, output, and acceptance criteria.
- Write strong constraints, including must-do items, prohibited actions, preferences, and exceptions.
- Generate plan-mode prompts that analyze first and do not modify files.
- Add code-task rules such as reading files first, making minimal changes, validating with tests, and avoiding unrelated refactors.
- Add PDF/document-task rules such as structure reading, rule extraction, template generation, and uncertainty marking.
- Add self-check and failure-handling rules to the final prompt.

## Directory Structure

```text
prompt-engineering/
├── SKILL.md       # Main skill file loaded by Codex
├── templates.md   # Copy-ready prompt templates
├── checklists.md  # Prompt quality checklists
├── examples.md    # Examples from ordinary requests to strong execution prompts
├── README.md      # Chinese README
└── README_en.md   # English README
```

Codex uses `SKILL.md` to determine when the skill should be triggered. `templates.md`, `checklists.md`, and `examples.md` are loaded only when detailed templates, checklists, or examples are useful.

## Installation

### Install as a Global Codex Skill

Linux or WSL:

```bash
mkdir -p ~/.codex/skills
cp -a prompt-engineering ~/.codex/skills/
```

Windows:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills" | Out-Null
Copy-Item -Recurse -Force ".\prompt-engineering" "$env:USERPROFILE\.codex\skills\"
```

After installation, start a new Codex session so the skill list can be reloaded.

### Install as a Project-Level Codex Skill

Place the folder under the project root:

```text
.codex/skills/prompt-engineering/
```

Project-level installation is useful when you only want this skill available for a specific repository.

## Usage

After installation, you can ask:

```text
Rewrite this requirement into a prompt better suited for Codex.
```

```text
Make Codex plan first and avoid changing code immediately.
```

```text
Read this PDF, extract its methods, and turn them into a reusable skill.
```

You can also trigger it explicitly:

```text
Use the prompt-engineering skill to rewrite the following request into an executable Codex prompt.
```

Explicitly naming the skill is more reliable, especially if the current session has not reloaded newly installed skills.

## Included Templates

`templates.md` includes 10 copy-ready templates:

- General Codex task prompt template
- Prompt optimization template
- Code-fix prompt template
- Refactoring prompt template
- Document reading and summary prompt template
- Deep PDF analysis prompt template
- Complex feature development prompt template
- Multi-stage iteration prompt template
- Plan-mode task planning prompt template
- Visual/3D/interaction task prompt template

## Quality Checks

`checklists.md` provides checklists for evaluating whether a generated prompt is ready to use:

- Does it have a clear task goal?
- Does it name the working directory or execution environment?
- Does it list input materials?
- Does it include execution steps?
- Does it include hard constraints and prohibited actions?
- Does it specify the output format?
- Does it include acceptance criteria?
- Does it require self-checks?
- Does it avoid vague language?
- Does it match the task type?

## Examples

`examples.md` contains 4 complete examples:

- Turning "help me optimize this prompt" into a strong Codex prompt.
- Turning "my Vue project has an error, fix it" into a code-fix prompt.
- Turning "read this PDF and summarize the techniques" into a PDF-to-skill prompt.
- Turning "build a draggable knob in a 3D interactive webpage" into a multi-stage development prompt.

## Maintenance Notes

- When changing trigger behavior, update the frontmatter `description` in `SKILL.md` first.
- Put long new templates in `templates.md` instead of growing `SKILL.md`.
- Put new quality rules in `checklists.md`.
- Put complete examples in `examples.md`.
- Keep `SKILL.md` focused on core workflows and invocation rules.
- Before publishing, make sure `SKILL.md` still has valid YAML frontmatter.

## Notes

- Newly installed or modified skills usually require a new Codex session to become reliably available.
- Automatic triggering depends on how Codex interprets the user request. Explicitly saying `use the prompt-engineering skill` is more reliable.
- In mixed Windows/WSL setups, Codex reads the skills directory available to the environment where it is running. If Codex runs in WSL, make sure the skill is available under WSL-accessible `~/.codex/skills/` or project `.codex/skills/`.
- This skill does not require external packages or network access.

## License

Before publishing this skill on GitHub, add a suitable `LICENSE` file and update this section with the chosen license.
