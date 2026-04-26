# Prompt Quality Checklists

Use these checklists after drafting or rewriting a prompt. A prompt fails if any required item for its task type is missing.

## A. Final Prompt Qualification Checklist

- [ ] The task goal is explicit and contains an action verb.
- [ ] The working directory, environment, or target platform is named.
- [ ] Input materials are named: files, folders, logs, PDFs, screenshots, URLs, pasted text, or commands.
- [ ] Execution steps are ordered.
- [ ] Hard constraints use must/must not language.
- [ ] Prohibited actions are stated.
- [ ] Output format is specified.
- [ ] Acceptance criteria are testable.
- [ ] Self-check requirements are included.
- [ ] Vague words are removed or defined with measurable criteria.
- [ ] The prompt can be handed directly to Codex or the target agent.
- [ ] The prompt matches the task type.
- [ ] The prompt prevents unrelated broad changes.
- [ ] Uncertain information is marked as an assumption or a blocking question.

## B. Prompt Optimization Checklist

- [ ] Original intent is preserved.
- [ ] Missing context is marked as `[待补充: ...]`.
- [ ] The rewritten prompt states role, task, context, and format.
- [ ] The rewritten prompt includes specific inputs and source boundaries.
- [ ] The rewritten prompt includes execution order.
- [ ] The rewritten prompt includes constraints and non-goals.
- [ ] The rewritten prompt includes acceptance criteria.
- [ ] The rewritten prompt includes final self-check.
- [ ] Open-ended work is split into stages.
- [ ] Plan-only requests include a no-edit rule.

## C. Plan Mode Checklist

- [ ] Prompt says "analyze and plan only".
- [ ] Prompt says "do not modify files".
- [ ] Prompt lists files or directories to read first.
- [ ] Prompt asks for current-state analysis.
- [ ] Prompt asks for risk points and unknowns.
- [ ] Prompt asks for likely modified files.
- [ ] Prompt asks for verification commands or manual checks.
- [ ] Prompt requires user confirmation before edits.
- [ ] Prompt separates blocking questions from assumptions.

## D. Code Task Checklist

- [ ] Repository path is named.
- [ ] Framework/language/runtime is named or discoverable from specified config files.
- [ ] Error logs or reproduction steps are included for bugs.
- [ ] Relevant files and tests are listed or search rules are stated.
- [ ] Modification boundary is explicit.
- [ ] Unrelated refactors and dependency additions are prohibited.
- [ ] Verification command is specified.
- [ ] Final report must include changed files and test results.

## E. Document/PDF Task Checklist

- [ ] Document path is named.
- [ ] Reading range or full-document requirement is stated.
- [ ] The prompt requires structure reading before content extraction.
- [ ] The prompt asks for methods, rules, templates, examples, and uncertain items when the task is knowledge extraction.
- [ ] The prompt prohibits simple chapter summaries when the target is a reusable artifact.
- [ ] Output sections are specified.
- [ ] Page markers, section titles, or other traceable references are requested when available.

## F. Visual/3D/Interaction Checklist

- [ ] Target visual effect is observable.
- [ ] Current abnormal behavior is described or marked as unknown.
- [ ] Object/component/asset names are listed.
- [ ] Viewport, initial camera, device, or screenshot requirement is stated.
- [ ] Interaction trigger and expected response are stated.
- [ ] Existing interactions and assets that must remain unchanged are listed.
- [ ] Visual analysis and browser automation boundaries are explicit.
- [ ] Manual verification steps are provided when automated visual checks are unavailable.

## G. Multi-Stage Task Checklist

- [ ] Each stage has a target.
- [ ] Each stage has inputs.
- [ ] Each stage has actions.
- [ ] Each stage has outputs.
- [ ] Each stage has acceptance criteria.
- [ ] Stage transitions are explicit.
- [ ] Failure handling is stated.
- [ ] The final report aggregates stage status, files changed, validation, and residual risk.

## H. Vague Phrase Repair Checklist

Replace vague wording with operational language:

| Vague Phrase | Replace With |
| --- | --- |
| `帮我看看` | `读取 [path/log]，定位 [issue] 的根因，并输出修复方案。` |
| `修一下` | `修复 [error/behavior]，复现步骤是 [steps]，验证命令是 [command]。` |
| `写好一点` | `将输出改为 [tone/audience/length/format]，保留 [content]，删除 [content]。` |
| `总结一下` | `按 [sections] 提取 [facts/methods/risks/actions]，标注不确定内容。` |
| `做得更详细` | `增加 [context/steps/constraints/acceptance/tests]，每项必须可检查。` |
| `像专业的` | `面向 [audience]，使用 [tone]，包含 [required sections]，禁止 [style/content]。` |
| `优化 prompt` | `诊断目标、上下文、边界、输出、验收和自检缺口，并重写为强执行 prompt。` |
