# Tool Adapters

Adapters describe how to shape the final prompt for a target AI tool. They are not tool implementations, CLIs, wrappers, or runtime integrations. They are lightweight prompt-construction resources referenced by `metadata/resources.yaml` with `@adapter://...` URIs.

## Adapter Selection

- Use `@adapter://codex` when the target tool edits a shared workspace and can inspect files.
- Use `@adapter://codex-cli` when the prompt will be run from a command-line coding agent with shell commands and local verification.
- Use `@adapter://claude-code` when the tool should work through incremental repository edits with strong context reading.
- Use `@adapter://gemini-cli` when the prompt should emphasize terminal workflow, explicit paths, and command logs.
- Use `@adapter://chatgpt` when the task is primarily reasoning, writing, analysis, transformation, or prompt drafting rather than direct repository edits.

## Common Requirements

- State the working directory, source materials, allowed scope, and forbidden actions.
- Require the target tool to distinguish facts, assumptions, missing inputs, and unverified results.
- For code tasks, require minimal changes, verification commands, and a final change summary.
- For high-risk tasks, combine the adapter with a `@safety://...` resource.

## Registry Links

Adapters are indexed in `metadata/resources.yaml` and should be selected during `prompt-generation-protocol.md` after branch selection and before final prompt construction.
