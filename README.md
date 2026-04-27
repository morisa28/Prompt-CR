# Prompt Engineering Skill Hub

一句话定位：把用户的模糊需求路由到合适场景分支，并生成可交给 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 等工具执行的高质量 prompt。

## 面向的使用对象

- 想把口语需求改成强执行 prompt 的用户。
- 为 coding agent、研究 agent、数据分析 agent 或文档 agent 编写任务说明的人。
- 维护 Prompt Skill Hub、模板库、路由系统和 eval cases 的团队。
- 需要在医疗、法律、金融、安全、招聘、隐私等高风险领域保持边界的 AI workflow 设计者。

## 典型使用场景

- 修复代码 bug、补测试、生成 Codex CLI 任务 prompt。
- 分析仓库结构、输出项目理解报告。
- 编写 PRD，并转成开发 Agent prompt。
- 设计 RAG 知识库，包含引用、权限、更新和评估。
- 做数据分析 prompt，包含字段、清洗、指标、图表和结论边界。
- 将合同、体检报告、金融资料等高风险材料整理为安全的信息性 prompt。
- 审计和改进 Prompt 系统本身。

## 自然语言入口

用户不需要先理解目录结构，可以直接用自然语言描述需求：

- “帮我写一个 prompt，让 Codex 修复 npm run build 报错。”
- “把这个产品想法改成可交给 Claude Code 的开发任务。”
- “我想设计一个 RAG 知识库 prompt，要求带引用和权限控制。”
- “帮我检查这个 prompt 为什么不稳定。”
- “帮我生成一个医疗信息整理 prompt，但不要让模型做诊断。”

AI Agent 使用本项目时应按以下顺序处理：

1. 归一化用户真实任务和最终交付物。
2. 选择唯一主分支和必要辅助分支。
3. 从 `metadata/resources.yaml` 选择 template、checklist、example、eval、adapter、safety 和 lesson。
4. 识别缺失输入并分类为可假设、待补充、需追问或阻塞。
5. 做风险检查，高风险任务必须引用 `safety/` 资源。
6. 生成最终 prompt，并用 checklist 与 eval case 对照自检。

标准输出建议：

```text
需求摘要：
最终交付物：
主分支：
辅助分支：
使用资源：
缺失输入：
风险等级：
安全边界：
最终 prompt：
自检结果：
匹配 eval：
可能新增 lesson：
```

如果用户只要最终 prompt，AI Agent 可以不展示完整路由，但内部仍应完成同样的路由、资源选择、风险检查和自检。

## 最短使用路径

1. 读 `router.md`，按最终交付物选择唯一主分支。
2. 必要时用 `branch-composition.md` 选择 1 到 3 个辅助分支。
3. 用 `templates.md` 和对应 `branches/` 文件生成 prompt。
4. 用 `checklists.md` 自检。

## 完整使用路径

1. `prompt-generation-protocol.md`：按 Intake、Normalize、Route、Missing Inputs、Risk Check、Construct、Self Check、Finalize 执行。
2. `router.md`：输出主分支、辅助分支、命中原因、缺失输入、风险等级和构造策略。
3. `common-principles.md`：统一缺失输入、约束优先级、防幻觉、高风险边界和工具适配。
4. `templates.md`：选择通用模板、分支模板或多分支组合模板。
5. `checklists.md`：用通用、路由、分支、高风险和最终交付前检查表验收。
6. `examples.md`：参考从模糊需求到最终 prompt 的全过程示例。
7. `evals/`：用 eval case 检查生成 prompt 的质量。
8. `branches/manifest.yaml`：读取机器可用的重点分支索引和 eval 覆盖。
9. `metadata/resources.yaml`：读取统一资源注册表，组合 branch、template、checklist、example、eval、adapter、safety 和 lesson。
10. `lessons/`：参考已知失败模式、成功模式和改进建议。
11. `adapters/`：目标工具明确时套用 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 适配规则。
12. `safety/`：医疗、法律、金融、安全、隐私等高风险任务必须套用边界资源。

## 核心目录说明

| 路径 | 作用 | 何时使用 |
|---|---|---|
| `SKILL.md` | Skill 总入口 | AI Agent 使用本 Skill Hub 时先读 |
| `prompt-generation-protocol.md` | Prompt 生成协议 | 从自然语言需求生成最终 prompt 时使用 |
| `router.md` | 多层路由规则 | 判断主分支、辅助分支、风险、资源引用 |
| `branch-composition.md` | 多分支组合规则 | 一个任务同时需要工具适配、验证、报告、引用或安全边界时使用 |
| `common-principles.md` | 通用质量原则 | 所有分支共享，处理缺失输入、防幻觉、高风险和工具适配 |
| `templates.md` | 可复制模板 | 快速生成通用、coding、RAG、PRD、数据分析、高风险和 meta prompt |
| `checklists.md` | 可判断验收清单 | 交付前检查 prompt 是否可执行、可验证、未越界 |
| `examples.md` | 全流程示例 | 参考从模糊需求到最终 prompt 的写法 |
| `branches/` | 场景分支 | 主分支和辅助分支的详细规则 |
| `branches/manifest.yaml` | 重点分支 manifest | 机器读取重点分支、eval 覆盖和输出章节 |
| `metadata/resources.yaml` | 资源注册表 | 统一查找 branch、template、checklist、eval、adapter、safety、lesson |
| `evals/` | Prompt 质量评测 | 检查生成 prompt 本身是否合格 |
| `lessons/` | 经验记忆库 | 记录失败模式、成功模式和改进建议 |
| `adapters/` | 目标工具适配 | Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT |
| `safety/` | 高风险边界 | 医疗、法律、金融、安全、隐私 |
| `scripts/` | 维护脚本 | 校验、统计和分支管理 |

## 路由示例

用户输入：

```text
帮我写一个 prompt，让 Codex 修复这个项目 npm run build 报错，并确保不要乱改。
```

路由结果：

```text
需求摘要：为 Codex 生成一个修复 npm build 失败的执行 prompt
最终交付物：可交给 Codex 执行的 bugfix prompt
主分支：software-engineering/bugfix-debugging
辅助分支：software-engineering/test-generation, software-engineering/cli-agent
使用资源：
- @branch://software-engineering/bugfix-debugging
- @template://coding-agent/bugfix
- @adapter://codex
- @checklist://coding-agent/final-review
- @eval://software-engineering/bugfix-debugging/missing-inputs
- @lesson://routing/ambiguous-bugfix-request
风险等级：medium
缺失输入：错误日志、复现步骤、工作目录、环境信息、验证命令
```

最终 prompt：

```text
你是 Codex，请在 `[待补充: working_directory]` 修复 `npm run build` 报错。错误日志：`[待补充: error_log]`。先读取 `package.json`、构建配置、错误栈指向文件和相关测试；先复现失败或说明无法复现原因，再定位根因。只做最小修复，禁止无关重构、全仓库格式化、新增依赖、删除测试、降低断言或注释掉失败逻辑。修复后运行 `npm run build` 和 `[待补充: test_command]`。最终输出根因、证据、修改文件、关键改动、验证命令与结果、未验证项和剩余风险。
```

自检结果：

- [x] 主分支由最终交付物决定。
- [x] 缺失输入已标注。
- [x] 包含最小修复、禁止事项和验证命令。
- [x] 输出格式可直接交给 Codex 执行。
- [x] 匹配 eval：`@eval://software-engineering/bugfix-debugging/missing-inputs`。
- [x] 相关 lesson：`@lesson://routing/ambiguous-bugfix-request`。

## 资源如何协作

一次高质量 prompt 生成通常不是只读取一个分支，而是组合多类资源。

示例：bugfix 请求的资源组合：

| 资源类型 | 示例 | 作用 |
|---|---|---|
| branch | `@branch://software-engineering/bugfix-debugging` | 定义最终交付物、输入、硬约束和验收标准 |
| auxiliary branch | `@branch://software-engineering/test-generation` | 补充回归测试和验证要求 |
| template | `@template://coding-agent/bugfix` | 提供可复制 prompt 骨架 |
| checklist | `@checklist://coding-agent/final-review` | 检查工作目录、修改范围、验证命令和报告格式 |
| adapter | `@adapter://codex` | 适配 Codex 的仓库读取、最小修改和验证输出 |
| eval | `@eval://software-engineering/bugfix-debugging/missing-inputs` | 检查缺失日志时是否禁止猜测修复 |
| lesson | `@lesson://routing/ambiguous-bugfix-request` | 注入已知失败经验：缺日志不能直接改代码 |

示例：RAG 请求的资源组合：

| 资源类型 | 示例 | 作用 |
|---|---|---|
| branch | `@branch://ai-systems/knowledge-base-rag` | 定义知识源、chunk、metadata、retrieval、citation、eval |
| safety | `@safety://privacy-boundary`, `@safety://security-boundary` | 处理内部文档权限、隐私和审计 |
| checklist | `@checklist://rag` | 检查引用、拒答、权限、更新和评估指标 |
| eval | `@eval://ai-systems/knowledge-base-rag/citation-required` | 检查没有检索证据时不得回答 |
| lesson | `@lesson://unsafe-patterns/rag-unsourced-answer` | 防止无来源回答成为默认行为 |

## 如何选择主分支

主分支只看用户最终想得到的交付物：

- 修复错误：`branches/software-engineering/bugfix-debugging.md`
- 理解仓库：`branches/software-engineering/repository-analysis.md`
- 写新功能：`branches/software-engineering/coding-feature-development.md`
- 补测试：`branches/software-engineering/test-generation.md`
- 写 PRD：`branches/product-design-business/product-requirements.md`
- 做 RAG：`branches/ai-systems/knowledge-base-rag.md`
- 做数据分析：`branches/data-analytics/data-analysis.md`
- 写报告：`branches/documents-research/report-writing.md`
- 医疗/法律/金融：对应 `branches/domain-specific/`
- 改进 Prompt 系统：`branches/meta/meta-skill-builder.md`

## 如何组合辅助分支

辅助分支只在能提升执行质量时使用：

- CLI 工具：`software-engineering/cli-agent`
- 验证或测试：`software-engineering/test-generation`
- 正式报告：`documents-research/report-writing`
- 来源引用：`documents-research/documentation-analysis` 或 `ai-systems/knowledge-base-rag`
- 安全边界：`software-engineering/security-threat-modeling` 或对应高风险分支

普通任务 0 到 1 个辅助分支，中等复杂任务 1 到 2 个，高风险或跨域任务最多 3 个。超过 3 个时拆成多阶段 prompt。

辅助分支不改变最终交付物，只补充执行质量。例如：

- `bugfix-debugging + test-generation + cli-agent`：修 bug，同时要求测试验证和 CLI 执行边界。
- `repository-analysis + report-writing`：只读分析仓库，并输出正式报告。
- `product-requirements + coding-feature-development`：先写 PRD，再生成开发 Agent prompt。
- `knowledge-base-rag + security-threat-modeling`：设计 RAG，同时处理权限、审计和泄露风险。
- `medical-health-info + report-writing`：医疗信息只做结构化整理，不做诊断。

当辅助分支过多时，优先保留：

1. 安全边界。
2. 目标工具 adapter。
3. 验证/测试。
4. 引用/证据。
5. 输出格式。

## 如何使用 Eval Cases

`evals/cases/` 里的 YAML 用来验证“生成的 prompt 是否高质量”，不是验证模型最终任务结果。

每个 case 包含：
- `expected_primary_branch`
- `expected_auxiliary_branches`
- `required_missing_inputs`
- `expected_prompt_features`
- `forbidden_prompt_features`
- `acceptance_criteria`
- `expected_resources`
- `related_lessons`

使用方式：

```bash
python3 scripts/skill_hub_manager.py validate
python3 scripts/skill_hub_manager.py stats
```

`evals/features/` 使用 Gherkin 风格描述关键行为，例如自然语言入口、资源注册表、RAG 引用权限、高风险边界和 lesson 反馈闭环。它们适合人工 review，也为未来脚本或 LLM judge 预留入口。

Eval case 的判断方式：

1. 用 `user_request` 走完整 prompt-generation protocol。
2. 比对 `expected_primary_branch` 和 `expected_auxiliary_branches`。
3. 检查是否选择 `expected_resources`。
4. 检查缺失输入是否按 `required_missing_inputs` 处理。
5. 确认 `expected_prompt_features` 全部出现在最终 prompt 中。
6. 确认 `forbidden_prompt_features` 没有出现。
7. 用 `acceptance_criteria` 判断通过或失败。

如果某个 eval 失败，应回看：

- `router.md` 是否路由错。
- `metadata/resources.yaml` 是否少绑定资源。
- `templates.md` 或分支模板是否缺关键约束。
- `checklists.md` 是否少检查 forbidden features。
- `lessons/` 是否需要新增失败经验。

## 资源注册表

`metadata/resources.yaml` 是轻量资源协议，不替代 Markdown 文档。它用 URI 把资源连接起来：

- `@branch://software-engineering/bugfix-debugging`
- `@template://coding-agent/bugfix`
- `@checklist://coding-agent/final-review`
- `@eval://software-engineering/bugfix-debugging/basic`
- `@adapter://codex-cli`
- `@safety://medical-boundary`
- `@lesson://routing/ambiguous-bugfix-request`

Router 应先选主分支，再用 registry 找模板、检查表、adapter、safety、eval 和 lesson。

Registry 中重点资源关系包括：

- `linked_templates`：该分支常用模板。
- `linked_checklists`：生成 prompt 后必须检查的清单。
- `linked_evals`：可用于验证 prompt 质量的 eval cases。
- `linked_lessons`：已知失败模式或成功模式。
- `compatible_adapters`：适合的目标工具。
- `safety_resources`：高风险边界资源。

Registry 的设计原则：

- 轻量，不做数据库。
- 可读，不替代 Markdown。
- 稳定，URI 不随标题变化。
- 可组合，支持主分支、辅助分支、adapter、safety 和 eval 一起使用。
- 可扩展，为未来 CLI、Web UI 或 MCP prompt provider 留基础，但当前不实现这些平台能力。

## Lessons 经验库

`lessons/` 记录项目经验，不是运行时记忆系统。它用于沉淀：

- 路由失败。
- Prompt 生成失败。
- 高风险越界风险。
- 成功 prompt 组合模式。
- registry、eval、checklist 和示例的改进建议。

如果一个生成 prompt 没通过 eval，应考虑新增 lesson，记录触发条件、失败模式、根因、修复建议和 update targets。

Lesson 推荐使用场景：

- 路由失败：例如 RAG 请求被路由为普通文档总结。
- Prompt 失败：例如 bugfix prompt 没有验证命令。
- 高风险误用：例如医疗 prompt 给出诊断。
- 成功模式：例如 bugfix 的“根因分析 + 最小修复 + 验证命令”模式稳定有效。
- 改进建议：例如 registry 应把 branch 绑定到 eval 和 lesson。

Lesson 不应记录：

- 用户身份、账号、密钥、患者细节、合同原文、财务账户。
- 完整私人对话。
- 未经来源支持的事实。

## Adapters 与 Safety

`adapters/` 说明不同目标工具的 prompt 构造差异。目标工具明确时必须引用对应 adapter。

`safety/` 说明高风险边界。医疗、法律、金融、安全、隐私相关 prompt 必须引用对应 safety resource，不得只写普通免责声明。

Adapter 选择示例：

| 目标工具 | Adapter | Prompt 重点 |
|---|---|---|
| Codex | `@adapter://codex` | 工作目录、先读文件、最小改动、验证命令、变更报告 |
| Codex CLI | `@adapter://codex-cli` | 命令权限、shell 验证、失败处理、不可验证说明 |
| Claude Code | `@adapter://claude-code` | 渐进修改、现有风格、上下文读取、测试回归 |
| Gemini CLI | `@adapter://gemini-cli` | 路径、命令、日志、环境假设 |
| ChatGPT | `@adapter://chatgpt` | 结构化输出、事实/假设分离、引用和不确定性 |

Safety 选择示例：

| 风险领域 | Safety | Prompt 边界 |
|---|---|---|
| 医疗 | `@safety://medical-boundary` | 不诊断、不处方、不停药换药 |
| 法律 | `@safety://legal-boundary` | 不替代律师、不做最终法律结论 |
| 金融 | `@safety://financial-boundary` | 不给个性化买卖建议、不保证收益 |
| 安全 | `@safety://security-boundary` | 只做防御性安全，不提供攻击链 |
| 隐私 | `@safety://privacy-boundary` | 最小化、脱敏、权限、保留边界 |

## 维护和验证

运行结构校验：

```bash
python3 scripts/skill_hub_manager.py validate
```

查看能力统计：

```bash
python3 scripts/skill_hub_manager.py stats
```

当前能力统计包括：

- 45 个分支。
- 34 个模板。
- 48 个检查表。
- 51 个 eval cases。
- 6 个 Gherkin feature。
- 5 个 lesson YAML。
- 6 个 adapter 文档。
- 6 个 safety 文档。

`validate` 会检查根文件、分支结构、manifest、resource registry、eval schema、feature 文件、lesson 字段、adapter 和 safety 资源。

## 如何扩展新分支

新增分支时应同步更新：
- `SKILL.md`
- `router.md`
- `templates.md`
- `checklists.md`
- `examples.md`
- `branches/manifest.yaml`
- `metadata/resources.yaml`
- `evals/cases/<category>/<branch>/`
- `lessons/` 中相关失败或成功模式，如适用

每个分支必须包含 10 节：Purpose、Trigger Conditions、Required Inputs、Prompt Construction Rules、Hard Constraints、Output Format、Quality Checklist、Common Mistakes、Reusable Template、Example。

## 高风险领域说明

- 医疗：不诊断、不处方、不停药换药，只做症状整理、红旗信号和就医准备。
- 法律：不替代律师，不给最终法律结论，必须要求司法辖区和文本。
- 金融：不构成个性化投资建议，不保证收益，不给买卖指令。
- 安全：只支持防御性安全，不提供攻击链、payload、绕过或持久化。
- 招聘/人事：不使用受保护属性，必须基于岗位相关证据。
- 隐私/个人数据：最小化、脱敏、限定用途和保留边界。
