# 2026-04-27 Capability System Iteration 更新文档

## 1. 更新定位

本次更新把 Prompt Engineering Skill Hub 从“分支 + 模板 + 检查表 + eval case”的结构，进一步升级为一个更清晰、更可索引、更可测试、更能沉淀经验的 Prompt Engineering Capability System。

本轮更新不做角色化能力，不把分支包装成专家角色，不引入激活语、角色模块或 PromptX 风格角色平台。本项目仍然聚焦一件事：把用户的模糊需求转成可交给 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 等工具执行的高质量 prompt。

## 2. 本轮解决的问题

上一轮已经补齐了分支深度、路由规则、模板、检查表和基础 eval cases，但仍存在四类问题：

| 问题 | 影响 | 本轮解决方式 |
|---|---|---|
| 用户需要先理解目录结构 | 首次使用门槛高 | 增强自然语言入口和 prompt-generation protocol |
| 分支、模板、检查表、eval 等资源关系分散 | AI Agent 难以稳定组合资源 | 新增 `metadata/resources.yaml` 统一索引 |
| 使用经验无法沉淀 | 同类路由或 prompt 失败可能重复发生 | 新增 `lessons/` 经验库 |
| eval 还停留在 YAML case | 缺少人类可读的行为测试 | 新增 `evals/features/` Gherkin 行为测试 |

## 3. 新增能力总览

### 3.1 自然语言入口

用户可以直接输入自然语言需求，例如：

```text
帮我写一个 prompt，让 Codex 修复 npm run build 报错，但不要乱改项目。
```

系统应按以下路径处理：

1. 归一化需求。
2. 判断最终交付物。
3. 选择唯一主分支。
4. 选择必要辅助分支。
5. 选择 registry 资源。
6. 识别缺失输入。
7. 判断风险等级。
8. 构造最终 prompt。
9. 用 checklist 和 eval 自检。
10. 如发现失败模式，建议新增 lesson。

### 3.2 资源注册表

新增 `metadata/resources.yaml`，用轻量 URI 描述资源关系。

示例 URI：

```text
@branch://software-engineering/bugfix-debugging
@template://coding-agent/bugfix
@checklist://coding-agent/final-review
@eval://software-engineering/bugfix-debugging/basic
@adapter://codex-cli
@safety://medical-boundary
@lesson://routing/ambiguous-bugfix-request
```

该注册表不替代 Markdown 文档，只用于：

- 稳定路由。
- 资源组合。
- eval 反向绑定。
- lesson 反向改进。
- 未来 CLI、Web UI 或 MCP prompt provider 的轻量基础。

### 3.3 Prompt 经验记忆库

新增 `lessons/`，包含：

- `routing-failures.yaml`
- `prompt-failures.yaml`
- `unsafe-patterns.yaml`
- `successful-patterns.yaml`
- `improvement-notes.yaml`

每条 lesson 记录：

```yaml
id:
type:
related_resources:
trigger:
failure_mode:
root_cause:
fix:
update_targets:
severity:
status:
```

它不是运行时记忆系统，不保存用户隐私或完整对话，只记录抽象后的失败模式、成功模式和改进建议。

### 3.4 Prompt 可测试评测体系

eval case 总数从 36 个扩展到 51 个，并新增 6 个 Gherkin feature：

- `natural-language-entry.feature`
- `resource-registry.feature`
- `bugfix-prompt-quality.feature`
- `rag-citation-and-permission.feature`
- `high-risk-boundary.feature`
- `lesson-feedback-loop.feature`

eval 的目标仍然是检查“生成出来的 prompt 是否合格”，不是检查 Codex 是否真的修好了 bug，也不是检查模型是否真的完成 RAG、金融分析或法律总结。

## 4. 主要新增文件

| 路径 | 作用 |
|---|---|
| `metadata/resources.yaml` | 统一资源注册表 |
| `lessons/README.md` | 经验库说明 |
| `lessons/*.yaml` | 路由失败、prompt 失败、危险模式、成功模式、改进建议 |
| `adapters/README.md` | 工具适配资源说明 |
| `adapters/codex.md` | Codex prompt 适配规则 |
| `adapters/codex-cli.md` | Codex CLI prompt 适配规则 |
| `adapters/claude-code.md` | Claude Code prompt 适配规则 |
| `adapters/gemini-cli.md` | Gemini CLI prompt 适配规则 |
| `adapters/chatgpt.md` | ChatGPT prompt 适配规则 |
| `safety/README.md` | 高风险边界资源说明 |
| `safety/medical-boundary.md` | 医疗边界 |
| `safety/legal-boundary.md` | 法律边界 |
| `safety/financial-boundary.md` | 金融边界 |
| `safety/security-boundary.md` | 安全边界 |
| `safety/privacy-boundary.md` | 隐私边界 |
| `evals/features/*.feature` | 行为测试 |
| `UPDATE_2026-04-27_CAPABILITY_SYSTEM_ITERATION.md` | 本更新文档 |

## 5. 主要增强文件

| 文件 | 增强内容 |
|---|---|
| `README.md` | 更详细的自然语言入口、资源协议、eval、lessons、adapter、safety 说明 |
| `README_en.md` | 英文入口补充资源注册、lessons、adapter、safety |
| `SKILL.md` | AI Agent 使用流程加入 registry、adapter、safety、eval、lessons |
| `router.md` | 路由输出加入资源引用、目标工具 adapter、safety、eval、lessons |
| `prompt-generation-protocol.md` | 新增 resource selection、eval matching、learn from failures |
| `checklists.md` | 新增本轮能力相关检查表 |
| `templates.md` | 新增自然语言入口、registry selection、lesson capture 模板 |
| `examples.md` | 新增自然语言到最终 prompt 的完整流程示例 |
| `evals/schema.md` | 新增 `expected_resources`、`related_lessons` 字段说明 |
| `scripts/skill_hub_manager.py` | validate/stats 覆盖新资源 |

## 6. 典型处理示例

用户输入：

```text
帮我写一个 prompt，让 Codex 修复 npm run build 报错，但不要乱改项目。
```

路由与资源：

```text
需求摘要：生成 Codex bugfix prompt
最终交付物：可交给 Codex 执行的修复任务 prompt
主分支：software-engineering/bugfix-debugging
辅助分支：software-engineering/test-generation, software-engineering/cli-agent
使用资源：
- @branch://software-engineering/bugfix-debugging
- @template://coding-agent/bugfix
- @adapter://codex
- @checklist://coding-agent/final-review
- @eval://software-engineering/bugfix-debugging/missing-inputs
- @lesson://routing/ambiguous-bugfix-request
缺失输入：working_directory, error_log, reproduction_steps, environment, test_command
风险等级：medium
```

生成 prompt 的关键要求：

- 先获取或读取错误日志，不猜测修复。
- 先复现失败，再做根因分析。
- 只做最小修复。
- 禁止无关重构、删除测试、降低断言或隐藏错误。
- 修复后运行构建和测试命令。
- 输出根因、证据、修改文件、验证结果和剩余风险。

## 7. 安全边界

本轮把高风险边界从分支和通用原则中抽出为可引用资源：

- 医疗：不诊断、不处方、不停药换药，只做症状整理、红旗信号和就医准备。
- 法律：不替代律师，不给最终法律结论，要求司法辖区和合同上下文。
- 金融：不构成个性化投资建议，不保证收益，不给买卖指令。
- 安全：仅防御性安全，不提供攻击链、payload、绕过或持久化。
- 隐私：最小化、脱敏、用途限定、权限控制和保留边界。

## 8. 验证结果

本轮完成后，源目录和同步副本均通过：

```bash
python3 scripts/skill_hub_manager.py validate --json
```

统计结果：

```text
branches: 45
templates: 34
checklists: 48
eval cases: 51
eval features: 6
lesson yaml files: 5
adapter docs: 6
safety docs: 6
resource registry: yes
```

## 9. 后续建议

- 为 `metadata/resources.yaml` 增加更严格的 URI 引用校验。
- 为 eval cases 增加自动检查器或 LLM judge。
- 为 lessons 增加状态流转和 resolved 记录。
- 从 registry 自动生成资源索引文档。
- 未来可考虑 CLI 或 MCP prompt provider，但不应改变项目的 Prompt Engineering Capability System 定位。
