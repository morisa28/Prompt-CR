# Prompt Generation Protocol

本协议说明 AI Agent 使用本 Skill Hub 生成 prompt 时必须遵循的标准流程。目标是把模糊需求转成可路由、可执行、可验证、可安全交付的 prompt。

## 1. Intake

接收用户原始需求，并保留用户的原始措辞、目标工具、输入材料、约束、期望交付物和禁止事项。

必须记录：
- 用户最终想得到什么交付物。
- prompt 要交给哪个目标工具执行。
- 已提供的材料、路径、日志、数据、截图或文档。
- 用户明确要求的范围、格式、风格、时限和验证方式。
- 任何高风险领域信号。

## 2. Normalize

将原始需求改写为一个明确任务目标。

规范化输出应包含：
- 任务目标：用动作、对象、结果表达。
- 交付物：说明最终 prompt 要驱动目标模型产出什么。
- 范围：说明包含和不包含的工作。
- 已知事实：只写用户提供或材料可证明的信息。
- 假设：非阻塞但需要补齐的默认前提。

## 3. Route

先选择唯一主分支，再选择必要辅助分支。

主分支选择依据：
- 按用户最终想得到的交付物选择，而不是按关键词抢占。
- 代码修复选择 `software-engineering/bugfix-debugging`。
- 仓库理解选择 `software-engineering/repository-analysis`。
- 新功能实现选择 `software-engineering/coding-feature-development`。
- 测试补充选择 `software-engineering/test-generation`。
- PRD 或功能规格选择 `product-design-business/product-requirements`。
- 知识库问答或 RAG 选择 `ai-systems/knowledge-base-rag`。
- 数据分析选择 `data-analytics/data-analysis` 或表格场景选择 `spreadsheet-analysis`。
- 报告写作选择 `documents-research/report-writing`。
- Prompt 系统改进选择 `meta/meta-skill-builder`，并按需要组合 `general-prompt` 分支。

辅助分支选择依据：
- 目标工具：Codex CLI、Claude Code、Gemini CLI 使用 `software-engineering/cli-agent`。
- 验证要求：需要测试时使用 `software-engineering/test-generation`。
- 输出形式：需要报告时使用 `documents-research/report-writing`。
- 知识引用：需要来源、引用、知识库时使用 `ai-systems/knowledge-base-rag` 或文档研究分支。
- 高风险领域：医疗、法律、金融、安全、招聘/人事、隐私、儿童/教育必须加入安全边界。

## 3.1 Select Resources

路由后必须从 `metadata/resources.yaml` 选择可组合资源。资源选择不是额外文档索引步骤，而是 prompt 构造输入。

资源选择顺序：
1. `@branch://...`：主分支和辅助分支。
2. `@template://...`：与主分支匹配的模板；多分支任务可再加入组合模板。
3. `@checklist://...`：通用质量、分支质量、缺失输入、输出格式和最终交付检查表。
4. `@adapter://...`：用户明确目标工具时必须选择。Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 分别使用对应 adapter。
5. `@safety://...`：高风险领域必须选择。医疗、法律、金融、安全、隐私等不得只依赖普通分支说明。
6. `@eval://...`：如果存在相似 eval case，生成 prompt 后按 expected/forbidden 对照。
7. `@lesson://...`：如果请求命中已知失败模式或成功模式，把 lesson 的 `fix` 注入构造策略。

资源引用格式示例：

```text
使用资源：
- @branch://software-engineering/bugfix-debugging
- @template://coding-agent/bugfix
- @adapter://codex
- @checklist://coding-agent/final-review
- @eval://software-engineering/bugfix-debugging/missing-inputs
- @lesson://routing/ambiguous-bugfix-request
```

## 4. Identify Missing Inputs

把缺失信息分为四类。

| 类型 | 处理方式 | 示例 |
| --- | --- | --- |
| 可合理假设 | 写入“假设”，并要求目标模型验证 | 未指定测试命令时让 coding agent 从配置识别 |
| 必须追问 | 先问用户，不能直接生成最终 prompt | 医疗急症严重程度、法律司法辖区、生产数据库备份状态 |
| 标记待补充 | 用 `[待补充: field]` 保留占位 | 工作目录、报告读者、数据字段含义 |
| 阻塞任务 | 明确说明无法安全生成执行 prompt | 无日志却要求修复具体报错、无合同文本却要求条款风险 |

缺失信息不应被编造成事实。可以生成带占位符的 prompt，但必须在 prompt 中要求目标模型处理这些占位符。

## 5. Risk Check

判断风险等级：
- Low：普通写作、非敏感摘要、低风险模板。
- Medium：代码修改、测试生成、仓库操作、业务数据分析、对外报告。
- High：医疗、法律、金融、安全、招聘/人事、儿童/教育、隐私/个人数据、生产系统、破坏性命令。

高风险任务必须：
- 明确非专业意见边界。
- 只输出信息整理、风险识别、问题清单或防御性建议。
- 要求来源、依据、日期、司法辖区或专业复核路径。
- 拒绝或限制越界请求。

## 6. Construct Prompt

最终 prompt 至少包含：
- 角色：目标模型或目标 agent 的身份。
- 目标：要完成的交付物。
- 背景：用户需求和上下文。
- 输入材料：路径、文本、日志、数据、图片、文档。
- 任务步骤：按读取、分析、构造、验证、报告排序。
- 约束：必须、禁止、优先、除非。
- 输出格式：明确章节、表格、JSON 字段或文件清单。
- 验收标准：可判断是否完成。
- 风险边界：安全、合规、隐私、专业意见边界。
- 自检要求：让目标模型检查缺失、冲突、幻觉、越界和验证结果。

## 7. Self Check

生成 prompt 后，用 `checklists.md` 和对应分支检查表自检。

自检必须回答：
- 主分支是否由最终交付物决定？
- 辅助分支是否必要，是否超过合理数量？
- 缺失输入是否分类处理？
- prompt 是否可直接交给目标工具执行？
- 输出格式是否明确可复制？
- 验收标准是否能判断是/否？
- 是否存在编造文件、数据、引用、事实或专业结论的风险？
- 高风险任务是否收紧到安全范围？

## 7.1 Optional Eval Matching

如果 `metadata/resources.yaml` 或 `evals/cases/` 中存在相似 eval case，必须用该 case 对照生成 prompt。

Eval matching 检查：
- `expected_primary_branch` 是否命中。
- `expected_auxiliary_branches` 是否覆盖必要辅助能力。
- `expected_resources` 是否包含主分支、模板、checklist、adapter、safety 或 lesson。
- `required_missing_inputs` 是否已标记、追问或阻塞。
- `expected_prompt_features` 是否全部出现。
- `forbidden_prompt_features` 是否全部未出现。
- `acceptance_criteria` 是否可判断。

Eval 只检查 prompt 本身是否合格，不判断目标模型最终是否真的修复 bug、完成 RAG 或得出正确分析结论。

## 7.2 Learn From Failures

如果生成的 prompt 未通过 checklist 或 eval，应建议新增或更新 lesson。不要把 lesson 当运行时记忆；它只是项目经验沉淀。

Lesson 建议至少包含：
- 触发条件。
- 失败模式。
- 根因。
- 修复建议。
- 需要更新的资源。
- 严重等级。
- 状态。

## 8. Finalize

最终输出格式：

```text
需求摘要：
最终交付物：
主分支：
辅助分支：
命中原因：
使用资源：
缺失信息：
风险等级：
安全边界：
使用模板：
最终 prompt：
自检结果：
可能关联的 eval：
可能新增的 lesson：
```

如果用户只要最终 prompt，可以省略路由说明，但内部仍应完成路由和自检。

## 9. Refuse Or Restrict

当用户要求与安全边界冲突时，不生成越界 prompt。

处理方式：
- 医疗：拒绝诊断、处方、停药、换药；改为症状整理、红旗信号和就医问题。
- 法律：拒绝最终法律结论；改为条款摘要、风险点和律师咨询清单。
- 金融：拒绝个性化买卖建议和收益保证；改为数据框架、风险、假设和情景分析。
- 安全：拒绝攻击链、绕过权限、隐蔽攻击、恶意持久化；改为威胁建模、日志分析和加固建议。
- 招聘/人事：拒绝基于受保护属性排序或判断；改为岗位相关证据和公平性检查。
- 隐私/个人数据：要求最小化、脱敏、用途和保留边界。
