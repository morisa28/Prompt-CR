# Prompt Engineering Skill

一个面向 Codex 的 Prompt Engineering skill，用于把模糊需求、复杂开发任务、plan 模式请求、PDF/文档分析任务和 prompt 优化请求，转化为更清晰、更具体、更可执行的代理任务说明。

该 skill 的核心目标不是提供通用 prompt 教程，而是让 Codex 在需要生成或优化 prompt 时，自动补全任务目标、上下文、输入材料、执行步骤、约束条件、输出格式、验收标准和自检流程。

## 适用场景

适合在以下场景使用：

- 用户要求优化 prompt。
- 用户要求生成更详细、更适合 Codex 执行的 prompt。
- 用户要求生成 Codex、Gemini CLI 或 Claude Code 可用的 prompt。
- 用户提供的需求比较模糊，需要转化为可执行任务。
- 用户要求 Codex 先 plan，不要直接修改代码。
- 用户要求复杂功能开发、bug 修复、项目重构或多阶段迭代。
- 用户要求阅读 PDF、文档、图片或代码仓库，并生成结构化任务说明。
- 用户需要在输出中加入明确约束、验收标准、测试方式和风险控制。

不适合用于普通闲聊、短句翻译、简单问答，或用户明确拒绝结构化 prompt 的场景。

## Skill 能力

该 skill 会引导 Codex：

- 使用 Persona、Task、Context、Format 组织 prompt。
- 将模糊目标改写为可验证的任务目标。
- 明确输入材料，例如文件路径、日志、截图、PDF、URL 或命令。
- 将复杂任务拆分为阶段，并为每个阶段定义目标、输入、输出和验收标准。
- 写出强约束，包括必须做什么、禁止做什么、优先做什么和例外条件。
- 为 plan 模式生成只分析不修改的执行计划。
- 为代码任务加入读取文件、最小改动、测试验证和禁止无关重构等规则。
- 为 PDF/文档任务加入结构阅读、规则提炼、模板生成和不确定内容标注。
- 在最终 prompt 中加入自检和失败处理规则。

## 目录结构

```text
prompt-engineering/
├── SKILL.md       # Codex 读取的主 skill 文件
├── templates.md   # 可复制使用的 prompt 模板
├── checklists.md  # prompt 质量检查表
├── examples.md    # 从普通需求到强执行 prompt 的示例
└── README.md      # 面向 GitHub 读者的说明文件
```

Codex 主要通过 `SKILL.md` 判断何时调用该 skill。`templates.md`、`checklists.md` 和 `examples.md` 会在需要完整模板、检查表或示例时再被读取。

## 安装

### 安装为全局 Codex skill

Linux 或 WSL：

```bash
mkdir -p ~/.codex/skills
cp -a prompt-engineering ~/.codex/skills/
```

Windows：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills" | Out-Null
Copy-Item -Recurse -Force ".\prompt-engineering" "$env:USERPROFILE\.codex\skills\"
```

安装后建议新开 Codex 会话，让 skill 列表重新加载。

### 安装为项目级 Codex skill

在项目根目录中放置：

```text
.codex/skills/prompt-engineering/
```

项目级安装适合只想在某个仓库中使用该 skill 的情况。

## 使用方式

安装后，可以直接提出类似请求：

```text
帮我把这个需求改成更适合 Codex 的 prompt。
```

```text
让 Codex 先 plan，不要直接改代码。
```

```text
读取这个 PDF，总结里面的方法并做成可复用 skill。
```

也可以显式指定：

```text
使用 prompt-engineering skill，把下面需求改写成适合 Codex 执行的 prompt。
```

显式指定更稳定，尤其是在当前会话尚未重新加载新 skill 时。

## 内置模板

`templates.md` 包含 10 个可复制模板：

- 通用 Codex 任务 Prompt 模板
- Prompt 优化模板
- 代码修复 Prompt 模板
- 项目重构 Prompt 模板
- 文档阅读与总结 Prompt 模板
- PDF 深度分析 Prompt 模板
- 复杂功能开发 Prompt 模板
- 多阶段迭代 Prompt 模板
- Plan 模式任务规划 Prompt 模板
- 视觉/3D/交互任务 Prompt 模板

## 质量检查

`checklists.md` 提供多个检查表，用于判断生成的 prompt 是否合格：

- 是否有明确任务目标。
- 是否有工作目录或执行环境。
- 是否列出输入材料。
- 是否有执行步骤。
- 是否包含硬性约束和禁止事项。
- 是否指定输出格式。
- 是否包含验收标准。
- 是否要求自检。
- 是否避免模糊表达。
- 是否适合当前任务类型。

## 示例

`examples.md` 提供 4 个完整示例：

- 将“帮我优化这个 prompt”改写为强执行 Codex prompt。
- 将“我的 Vue 项目报错了，帮我修”改写为代码修复 prompt。
- 将“读这个 PDF，总结里面的技巧”改写为 PDF 转 skill prompt。
- 将“做一个 3D 交互网页里的旋钮拖拽功能”改写为多阶段开发 prompt。

## 维护建议

- 修改触发场景时，优先更新 `SKILL.md` 的 frontmatter description。
- 新增长模板时，优先放入 `templates.md`，不要让 `SKILL.md` 过长。
- 新增质量规则时，优先放入 `checklists.md`。
- 新增完整案例时，优先放入 `examples.md`。
- 保持 `SKILL.md` 聚焦核心流程和调用规则，避免把所有细节都放进主文件。
- 发布前检查 `SKILL.md` 是否仍包含有效 YAML frontmatter。

## 注意事项

- 新安装或修改 skill 后，通常需要新开 Codex 会话才会稳定生效。
- 自动触发取决于 Codex 对用户请求的判断；显式写出 `使用 prompt-engineering skill` 会更稳定。
- Windows 和 WSL 混合使用时，Codex 会读取其运行环境能访问的 skills 目录。若 Codex 运行在 WSL 中，应确保 skill 位于 WSL 可访问的 `~/.codex/skills/` 或项目 `.codex/skills/` 下。
- 该 skill 不依赖外部包或网络访问。

## License

发布到 GitHub 前，请根据你的发布计划添加合适的 `LICENSE` 文件，并在此处补充许可证信息。
