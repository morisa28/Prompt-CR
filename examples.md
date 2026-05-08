# Cross-Branch Prompt Examples

每个示例展示原始需求、路由、缺失信息、最终 prompt 和写法理由。

## Example 1. Prompt Review

- 用户原始需求：帮我看看这个 prompt 哪里不好：`帮我把这个项目优化一下。`
- 路由判断：诊断已有 prompt 的缺口，给出评分、风险、改进建议和保留原意的优化版。
- 主分支：`branches/general-prompt/prompt-review.md`
- 辅助分支：无
- 缺失信息与默认假设：目标工具未知时按 ChatGPT 通用 prompt 评审; 期望结果未知时只评估结构，不猜业务目标

最终生成的高质量 prompt：

```text
请评审以下 prompt：`帮我把这个项目优化一下。`
目标工具：Codex。
请先按目标、上下文、输入、约束、输出格式、验收标准、风险控制、自检八个维度评分并解释扣分原因；再列出歧义点和可能导致误改的风险；最后给出一个保留原意的 Codex 版 prompt。重写版必须包含工作目录、需要先读取的文件、允许和禁止修改范围、验证命令、最终报告格式。不要加入用户未要求的新功能。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Full Process Example 29. 模糊 Bugfix 请求

用户原始需求：

```text
帮我写个 prompt，让 Codex 修复项目 npm run build 报错，并确保不要乱改。
```

路由判断：

- 主分支：`branches/software-engineering/bugfix-debugging.md`
- 辅助分支：`branches/software-engineering/test-generation.md`, `branches/software-engineering/cli-agent.md`
- 缺失输入：`[待补充: working_directory]`, `[待补充: error_log]`, `[待补充: environment]`, `[待补充: verification_commands]`
- 风险等级：Medium

最终生成的高质量 prompt：

```text
你是 Codex，请在 `[待补充: working_directory]` 修复 `npm run build` 报错。错误日志：`[待补充: error_log]`。先读取 `package.json`、构建配置、错误栈指向文件和相关测试；先复现失败或说明无法复现原因，再定位根因。只做最小修复，禁止无关重构、全仓库格式化、新增依赖、删除测试、降低断言或注释掉失败逻辑。修复后运行 `npm run build` 和 `[待补充: test_command]`。最终输出根因、证据、修改文件、关键改动、验证命令与结果、未验证项和剩余风险。
```

自检结果：

- [x] 主分支由最终交付物“修复构建失败”决定。
- [x] 缺失日志和路径已标注。
- [x] 包含最小修复、禁止事项和验证。

为什么这样设计：bugfix prompt 的关键是防止 agent 猜根因或扩大改动，所以把日志、复现、最小修复和验证放在核心位置。

## Full Process Example 30. 复杂仓库分析请求

用户原始需求：

```text
分析这个 repo，告诉我架构、风险和下一步建议，不要改代码。
```

路由判断：

- 主分支：`branches/software-engineering/repository-analysis.md`
- 辅助分支：`branches/documents-research/report-writing.md`
- 缺失输入：`[待补充: working_directory]`, `[待补充: focus_areas]`, `[待补充: output_depth]`
- 风险等级：Medium

最终生成的高质量 prompt：

```text
你是 Codex，请只读分析 `[待补充: working_directory]`，不要修改任何文件。先读取 README、依赖配置、构建/测试配置、入口文件和顶层目录；建立简化文件树，识别技术栈、运行命令、测试命令、核心模块、数据流和外部依赖。所有技术栈、入口和命令判断必须引用文件证据。输出项目概览、读取范围、目录树、技术栈证据、核心模块表、数据流、风险点、改进建议和未读取区域。禁止运行破坏性命令、输出 secrets 或把未读取路径写成确定结论。
```

自检结果：

- [x] 明确只读。
- [x] 要求文件证据。
- [x] 把建议作为报告输出而非执行。

为什么这样设计：仓库分析的风险是 agent 顺手改代码或凭目录名猜结论，因此要求只读、证据和未读取区域。

## Full Process Example 31. RAG 系统搭建请求

用户原始需求：

```text
帮我设计一个公司内部文档 RAG，回答要有引用，而且不同部门权限不同。
```

路由判断：

- 主分支：`branches/ai-systems/knowledge-base-rag.md`
- 辅助分支：`branches/software-engineering/security-threat-modeling.md`, `branches/documents-research/documentation-analysis.md`
- 缺失输入：知识源、用户角色、权限规则、更新频率、评估问题集
- 风险等级：High

最终生成的高质量 prompt：

```text
请设计公司内部文档 RAG 知识库 prompt。知识源：`[待补充: knowledge_sources]`；用户角色：`[待补充: target_users]`；问答范围和非范围：`[待补充: qa_scope]`；权限规则：`[待补充: access_control]`。必须建立文档索引字段：来源、标题、路径、版本、更新时间、部门权限、metadata、chunk id。设计 chunking、embedding、向量库、metadata filter、top-k 检索、rerank、上下文组装和生成流程。回答必须带文档标题、路径和段落/chunk 引用；检索不到依据时拒答或澄清。权限过滤必须发生在检索和生成前后，并记录审计日志。输出更新策略、失效文档处理、评估问题集、命中率、引用准确率、拒答准确率和权限误放率。
```

自检结果：

- [x] 包含引用、权限、更新和评估。
- [x] 检索不到依据时不编造。
- [x] 权限作为高风险边界处理。

为什么这样设计：RAG prompt 质量取决于知识源、索引、检索、引用、权限和评估，不能只写“做知识库”。

## Full Process Example 32. PRD 转开发 Agent Prompt

用户原始需求：

```text
帮我写一个 PRD，然后生成给 Codex 实现的 prompt。
```

路由判断：

- 主分支：`branches/product-design-business/product-requirements.md`
- 辅助分支：`branches/software-engineering/coding-feature-development.md`, `branches/software-engineering/test-generation.md`
- 缺失输入：产品目标、目标用户、核心场景、MVP、非目标、成功指标、工作目录
- 风险等级：Medium

最终生成的高质量 prompt：

```text
请为 `[待补充: product_goal]` 生成 PRD，并附可交给 Codex 的实现 prompt。PRD 必须包含目标用户、核心场景、问题定义、MVP 范围、非目标、用户故事、边界条件、验收标准和成功指标。每个用户故事使用 Given/When/Then。开发 Agent prompt 必须包含：工作目录 `[待补充: working_directory]`、先读文件、允许修改范围、禁止无关重构、测试/构建验证、最终改动报告。未知业务数据或用户研究不得编造成事实，标注 `[待补充]`。
```

自检结果：

- [x] PRD 和开发 prompt 分开。
- [x] MVP、非目标和验收可测试。
- [x] Codex 执行边界清楚。

为什么这样设计：产品需求和代码执行是两个层级，混在一起会导致 scope creep 和验收不清。

## Full Process Example 33. 医疗症状整理请求

用户原始需求：

```text
我头痛三天，帮我写 prompt 整理给医生看，不要让 AI 诊断。
```

路由判断：

- 主分支：`branches/domain-specific/medical-health-info.md`
- 辅助分支：`branches/documents-research/report-writing.md`
- 缺失输入：严重程度、伴随症状、既往史、用药、检查资料
- 风险等级：High

最终生成的高质量 prompt：

```text
请把以下健康信息整理成就医准备材料。你不能替代医生，不能诊断，不能处方，不能建议停药、换药或改变剂量。症状：头痛三天；严重程度：`[待补充]`；伴随症状：`[待补充]`；既往史/用药：`[待补充]`；检查资料：`[待补充]`。先列出需要立即就医的红旗信号，如突发剧烈头痛、意识改变、发热伴颈项强直、单侧无力、视物异常、外伤后头痛等；再输出症状时间线、就医准备清单、建议询问医生的问题和待补充信息。
```

自检结果：

- [x] 不诊断、不处方、不替代医生。
- [x] 包含红旗信号。
- [x] 转成就医准备材料。

为什么这样设计：医疗场景必须把“判断疾病”收紧为安全的信息整理和专业就医准备。

## Full Process Example 34. 金融报告分析请求

用户原始需求：

```text
帮我写 prompt 分析某只股票值不值得买。
```

路由判断：

- 主分支：`branches/domain-specific/finance-investment-analysis.md`
- 辅助分支：`branches/data-analytics/data-analysis.md`, `branches/documents-research/report-writing.md`
- 缺失输入：标的、数据来源、当前日期、时间范围、风险偏好
- 风险等级：High

最终生成的高质量 prompt：

```text
请对 `[待补充: ticker]` 做信息性投资研究。这不是个性化投资建议，不能保证收益，也不能给确定买入、卖出或持有指令。请使用最新可用数据并标注来源和日期；区分事实、假设、观点和风险；分析业务、财务指标、估值、行业、催化因素、费用、流动性、监管和下行风险；输出乐观、中性、悲观情景。缺少当前价格、财报或新闻来源时列为待核验数据。最后给出适合咨询持牌专业人士的问题。
```

自检结果：

- [x] 没有买卖指令。
- [x] 要求数据来源和日期。
- [x] 区分事实、假设、观点和风险。

为什么这样设计：金融 prompt 不能替用户做个性化交易决策，只能提供有日期和来源的信息分析框架。

## Full Process Example 35. 法律合同摘要请求

用户原始需求：

```text
总结这份合同有哪些坑，告诉我能不能签。
```

路由判断：

- 主分支：`branches/domain-specific/legal-policy-review.md`
- 辅助分支：`branches/documents-research/documentation-analysis.md`, `branches/documents-research/report-writing.md`
- 缺失输入：司法辖区、合同文本、交易背景、用户角色
- 风险等级：High

最终生成的高质量 prompt：

```text
请审阅 `[待补充: contract_text]`，文件类型：`[待补充: document_type]`，司法辖区：`[待补充: jurisdiction]`，用户角色：`[待补充: party_role]`。这不是法律意见，不能替代律师，不能给最终能否签署的法律结论。只基于合同文本提取付款、交付、验收、保密、知识产权、数据处理、违约、终止、责任限制和争议解决条款；按 High/Medium/Low 标注风险、条款依据、可能影响和需律师确认事项。输出义务/期限表、风险清单、谈判点和建议咨询律师的问题。
```

自检结果：

- [x] 非法律建议边界明确。
- [x] 要求司法辖区和合同文本。
- [x] 把“能不能签”改成风险和律师问题。

为什么这样设计：法律 prompt 不能替代律师做最终结论，但可以帮助用户理解条款和准备咨询。

## Full Process Example 36. 数据分析报告请求

用户原始需求：

```text
分析用户行为数据，找出为什么转化下降，并做可视化报告。
```

路由判断：

- 主分支：`branches/data-analytics/data-analysis.md`
- 辅助分支：`branches/data-analytics/visualization-dashboard.md`, `branches/documents-research/report-writing.md`
- 缺失输入：数据源、字段含义、转化定义、时间范围、读者
- 风险等级：Medium

最终生成的高质量 prompt：

```text
请分析 `[待补充: data_source]` 的用户行为数据，目标是找出转化下降的相关因素。先读取 schema、样例行、字段类型、时间范围和样本量；建立数据字典；检查缺失、重复、异常、时间戳错误和用户 ID 一致性；定义转化率的分子、分母、时间窗口和分组维度。用可复现代码按渠道、版本、地域和首日行为分组分析。输出数据质量报告、指标表、关键图表、结论、限制和下一步验证。禁止把相关性写成因果；字段含义未知时标注 `[待补充]`。
```

自检结果：

- [x] 数据质量、指标口径和清洗规则明确。
- [x] 有图表和报告输出。
- [x] 防止因果过度结论。

为什么这样设计：数据 prompt 必须先保证口径和质量，再谈结论；否则图表报告会放大错误。

## Full Process Example 37. Prompt 系统自我改进请求

用户原始需求：

```text
审计我的 prompt skill hub，补路由、模板、eval 和 manifest。
```

路由判断：

- 主分支：`branches/meta/meta-skill-builder.md`
- 辅助分支：`branches/general-prompt/prompt-review.md`, `branches/general-prompt/prompt-template-builder.md`
- 缺失输入：项目路径、允许改动、重点分支、同步要求
- 风险等级：Medium

最终生成的高质量 prompt：

```text
你是 Prompt Engineering 架构师，请审计并改进 `[待补充: project_path]`。先只读审计入口、路由、通用原则、模板、检查表、示例、分支和维护脚本；输出结构、强项、缺口和修改计划。随后增强路由为按最终交付物选择主分支，补辅助分支组合、冲突处理和标准路由输出；深化重点分支；新增 eval cases 和轻量 manifest；更新入口文档引用。保留有效内容，不做无关工程化，不弱化高风险边界。完成后运行可用验证并报告修改文件、自检结果和后续建议。
```

自检结果：

- [x] 先审计再修改。
- [x] 覆盖路由、模板、eval、manifest。
- [x] 保留项目定位。

为什么这样设计：Prompt 系统改进要落到路由、分支、模板、检查表、eval 和 manifest，而不是泛泛建议。

## Full Process Example 38. 多分支组合请求

用户原始需求：

```text
帮我写 prompt，让 Codex 修复 GitHub Actions 构建失败，补测试，并输出给负责人看的报告。
```

路由判断：

- 主分支：`branches/software-engineering/devops-ci.md`
- 辅助分支：`branches/software-engineering/bugfix-debugging.md`, `branches/software-engineering/test-generation.md`, `branches/documents-research/report-writing.md`
- 缺失输入：workflow 文件、失败日志、runner 环境、构建命令、测试命令
- 风险等级：Medium

最终生成的高质量 prompt：

```text
你是 Codex，请修复 `[待补充: repository_path]` 的 GitHub Actions 构建失败。先读取 workflow 文件、依赖配置、构建脚本、测试配置和失败日志；区分本地失败与 runner 环境失败；定位根因后做最小修改。禁止输出真实 secrets、删除测试、降低断言、无关重构或全仓库格式化。修复后运行本地可复现的构建/测试命令，并说明如何重跑 workflow。最终输出给负责人的报告：根因、修改文件、关键改动、验证命令与结果、CI 重跑方式、剩余风险和需确认事项。
```

自检结果：

- [x] 主分支是 CI 失败修复，bugfix/test/report 是辅助。
- [x] 包含 secrets 和测试边界。
- [x] 输出可给负责人阅读的报告。

为什么这样设计：多分支任务必须让主分支定义任务完成标准，辅助分支只补验证、报告和安全边界。

## Example 2. Prompt Rewrite

- 用户原始需求：把这句话改成 Codex 可以直接执行的 prompt：我的项目 npm run dev 报错了，帮我修。
- 路由判断：把口语化或模糊需求改写成目标 AI 工具可直接执行的任务 prompt。
- 主分支：`branches/general-prompt/prompt-rewrite.md`
- 辅助分支：无
- 缺失信息与默认假设：目标工具未知时输出通用版，并标注可按工具再适配; 工作目录未知时使用 `[待补充: working_directory]`

最终生成的高质量 prompt：

```text
你是 Codex，请在 `[待补充: working_directory]` 中修复 `npm run dev` 报错。先读取 `package.json`、构建配置和报错栈指向的文件；再根据完整日志定位根因；只修改必要文件，禁止无关重构和新增依赖；修复后运行 `npm run dev` 或可替代的构建验证，并在最终报告中输出根因、修改文件、验证结果和剩余风险。若缺少完整日志，先要求用户补充终端输出。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 3. Prompt Expansion

- 用户原始需求：把 `帮我分析这个 repo` 扩展成强 prompt。
- 路由判断：把短 prompt 扩展成包含背景、步骤、约束、验收和风险控制的强执行 prompt。
- 主分支：`branches/general-prompt/prompt-expansion.md`
- 辅助分支：无
- 缺失信息与默认假设：范围未知时用最小安全范围; 验证命令未知时要求目标 agent 先读取项目配置再选择

最终生成的高质量 prompt：

```text
你是 Codex，请在 `[待补充: repo_path]` 分析整个仓库。先读取 README、依赖配置、入口文件和测试配置；建立目录结构和技术栈判断；识别核心模块、数据流、运行命令和风险点；不要修改文件。输出项目概览、目录说明、关键模块表、运行/测试命令、可疑风险、后续可执行任务建议。若 README 或配置缺失，标注缺口并用文件证据支撑推断。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 4. Prompt Compression

- 用户原始需求：把这个长 prompt 压到 150 字以内，但保留不要改无关文件和要跑测试。
- 路由判断：压缩过长 prompt，在降低 token 的同时保留目标、关键上下文、硬约束和验收。
- 主分支：`branches/general-prompt/prompt-compression.md`
- 辅助分支：无
- 缺失信息与默认假设：未指定长度时输出短版和极简版各一份; 不可删内容未知时保留所有硬约束和验收

最终生成的高质量 prompt：

```text
你是 Codex，请修复 `[bug]`。先读相关文件和日志，定位根因后做最小改动；禁止无关重构、全仓库格式化、新增依赖或删除用户功能。修复后运行 `[test_command]`，最终报告根因、改动文件、验证结果和剩余风险。若信息不足，标注阻塞问题。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 5. Plan Mode

- 用户原始需求：让 Codex 先 plan，不要直接改代码。
- 路由判断：为 Codex plan 模式或只分析不执行的开发任务生成规划 prompt。
- 主分支：`branches/software-engineering/plan-mode.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：未列文件时要求先读 README、配置和相关入口; 验证命令未知时要求 plan 中提出

最终生成的高质量 prompt：

```text
你是 Codex，现在处于 plan 模式。工作目录：`/repo/app`。目标：重构认证模块以减少重复逻辑。请只读取 README、`package.json`、`src/auth/**` 和现有测试；不要修改文件。输出当前结构、重复点、预计修改文件、分阶段执行计划、回归测试命令、风险点和需要用户确认的问题。未确认前不得执行代码改动。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 6. Coding Feature Development

- 用户原始需求：帮我写一个 prompt，让 Codex 给设置页加暗色模式开关。
- 路由判断：为新功能、前端页面、后端接口、组件和交互逻辑生成开发 prompt。
- 主分支：`branches/software-engineering/coding-feature-development.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：技术栈未知时从配置文件识别; 测试命令未知时从项目配置推断并报告

最终生成的高质量 prompt：

```text
你是 Codex，请在 `/repo/web` 为设置页添加暗色模式开关。先读取 `package.json`、设置页组件、主题/样式文件和现有状态管理；实现一个可切换并持久化的开关，保持现有设置项不变。禁止新增依赖和重写页面结构。完成后运行 `npm run build`，若有测试运行相关测试。最终报告修改文件、状态流、验证结果和未覆盖风险。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 7. Bugfix Debugging

- 用户原始需求：我的项目 npm run dev 报错了，让 Codex 修。
- 路由判断：为报错、构建失败、页面白屏、依赖冲突和 CLI 错误生成排障修复 prompt。
- 主分支：`branches/software-engineering/bugfix-debugging.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：日志不完整时先要求补充关键栈; 最近改动未知时要求读取 git diff 或相关文件但不回退

最终生成的高质量 prompt：

```text
你是 Codex，请修复 `/repo/app` 中 `npm run dev` 报错。输入日志：`[粘贴完整 error_log]`。复现步骤：运行 `npm run dev`。先读 `package.json`、Vite/Next 配置和栈中出现的源码；定位根因并说明证据；只改必要文件，禁止无关重构、新增依赖或删除测试。修复后重新运行 `npm run dev` 或 `npm run build`，最终报告根因、修改文件、验证结果和剩余风险。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 8. Refactor Architecture

- 用户原始需求：帮我写 Codex prompt，把 auth 逻辑重构一下。
- 路由判断：为代码重构、模块拆分、架构整理和降低耦合生成 prompt。
- 主分支：`branches/software-engineering/refactor-architecture.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：行为边界不明时先列公开 API、路由、UI 和数据格式作为保护对象; 测试缺失时要求生成最小回归验证

最终生成的高质量 prompt：

```text
你是 Codex，请在 `/repo/api` 重构认证逻辑，目标是移除重复 token 解析并保持所有响应码和公开 API 不变。先读取认证中间件、路由和测试；列出重复点和风险文件；按最小阶段实施，不引入新功能。禁止修改数据库 schema 和无关路由。完成后运行认证相关测试和 `npm test`，最终输出行为保持证明、修改文件和剩余风险。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 9. Test Generation

- 用户原始需求：给登录接口生成测试 prompt。
- 路由判断：为单元、集成、E2E、回归测试和覆盖率提升生成测试 prompt。
- 主分支：`branches/software-engineering/test-generation.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：测试框架未知时从配置文件识别; 覆盖率目标未知时覆盖关键行为而非追求数字

最终生成的高质量 prompt：

```text
你是 Codex，请在 `/repo/api` 为登录接口补充测试。先读取测试配置、登录路由、认证服务和现有测试风格；使用项目已有测试框架覆盖：正确账号登录、错误密码、缺少字段、锁定用户、速率限制或等价边界。禁止删除现有测试或降低断言。运行 `[test_command]`，最终报告新增测试文件、覆盖场景和无法覆盖的原因。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 10. Repository Analysis

- 用户原始需求：帮我写一个 prompt，让 AI 分析整个 repo。
- 路由判断：为分析整个仓库、识别技术栈、入口、模块和运行方式生成 prompt。
- 主分支：`branches/software-engineering/repository-analysis.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：未指定关注点时覆盖结构、技术栈、入口、运行、测试、风险; 大型仓库先做顶层和核心路径抽样

最终生成的高质量 prompt：

```text
你是 Codex，请只读不改地分析 `/repo/app`。先读取 README、依赖配置、构建/测试配置和顶层目录；再识别入口文件、核心模块、数据流、运行命令和测试方式。输出项目概览、目录结构、技术栈证据、关键模块表、潜在风险、后续可执行任务。未读取的路径不得写成确定结论。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 11. CLI Agent

- 用户原始需求：给 Gemini CLI 写一个修 bug 的 prompt。
- 路由判断：为 Codex CLI、Gemini CLI、Claude Code 等命令行智能体生成带权限、命令和报告边界的 prompt。
- 主分支：`branches/software-engineering/cli-agent.md`
- 辅助分支：`branches/software-engineering/cli-agent.md`（当目标是 CLI agent 时）
- 缺失信息与默认假设：未说明权限时默认不联网、不安装依赖、不执行破坏性命令; 命令未知时要求先读取项目配置再选择

最终生成的高质量 prompt：

```text
你是 Gemini CLI，请在 `/repo/app` 修复 `[bug]`。允许命令：`rg`、读取文件、`npm test`；未经确认禁止联网、安装依赖、删除文件或运行破坏性 git 命令。先读取日志和相关源码，定位根因后做最小修复。若命令失败，记录完整错误并调整方案。最终报告修改文件、执行命令、验证结果和需要人工确认的问题。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 12. Documentation Analysis

- 用户原始需求：帮我写 prompt，总结这一批项目文档。
- 路由判断：为文档总结、会议记录、项目资料和多文档归纳生成结构化分析 prompt。
- 主分支：`branches/documents-research/documentation-analysis.md`
- 辅助分支：无
- 缺失信息与默认假设：范围未知时先读目录、标题和任务相关章节; 来源冲突时逐项标注

最终生成的高质量 prompt：

```text
请分析 `docs/project/*.md`，先建立文档索引和主题列表；再按需求、架构、风险、待办、决策归纳内容。事实必须注明来源文件或标题；推断和不确定内容单列。输出项目资料报告、行动项表和需要确认的问题。不要做逐章流水摘要。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 13. PDF to Skill

- 用户原始需求：读取这本 PDF，把方法提炼成 skill。
- 路由判断：把 PDF 中的方法、案例和注意事项提炼成可复用 skill 的 prompt。
- 主分支：`branches/documents-research/pdf-to-skill.md`
- 辅助分支：`branches/meta/meta-skill-builder.md`, `branches/documents-research/documentation-analysis.md`
- 缺失信息与默认假设：PDF 很长时先目录扫描再重点章节深读; 目标 skill 未定时先提出 skill 名、触发场景和目录结构

最终生成的高质量 prompt：

```text
请读取 `[pdf_path]`，目标是创建或扩展 `[skill_target]`。先扫描目录和章节，选择与方法论、流程、案例、反例、注意事项相关的章节；再把概念转成可执行规则，把案例转成模板，把注意事项转成 checklist。禁止大段复制原文，不做普通摘要。最终输出 `SKILL.md`、必要的 `templates.md`、`checklists.md`、`examples.md`，并用 3 个调用场景验证。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 14. Research Synthesis

- 用户原始需求：帮我写 prompt，综合 5 篇论文关于 RAG 评估的观点。
- 路由判断：为多来源调研、论文比较、网页资料综合和观点对比生成 prompt。
- 主分支：`branches/documents-research/research-synthesis.md`
- 辅助分支：无
- 缺失信息与默认假设：来源不足时标注限制并建议补源; 最新信息可能变化时要求查证日期和来源

最终生成的高质量 prompt：

```text
请围绕“RAG 系统应如何评估答案质量和检索质量”综合 `[5 篇论文路径/链接]`。先列来源表；再比较指标、实验设置、优缺点和适用场景；结论必须绑定论文证据，推测单列。输出观点矩阵、综合结论、分歧点、研究缺口和引用列表。禁止编造论文不存在的实验结果。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 15. Data Analysis

- 用户原始需求：帮我写 prompt，让 AI 分析一份用户行为数据。
- 路由判断：为数据集、统计分析、实验数据、业务指标、趋势和异常分析生成 prompt。
- 主分支：`branches/data-analytics/data-analysis.md`
- 辅助分支：无
- 缺失信息与默认假设：字段含义未知时先做数据字典和待确认项; 数据质量未知时先做缺失、重复、异常检查

最终生成的高质量 prompt：

```text
请分析 `[data_source]` 的用户行为数据，目标是找出留存和转化的关键趋势。先读取字段并建立数据字典；检查缺失、重复、异常和时间范围；定义转化率、留存率等指标口径；用可复现代码完成分析。输出数据质量报告、关键图表、结论、限制和下一步建议。禁止把相关性写成因果。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 16. Spreadsheet Analysis

- 用户原始需求：帮我分析 Excel 表格并生成销售报告。
- 路由判断：为 Excel、CSV、Google Sheets、财务表、订单表和成绩表分析生成 prompt。
- 主分支：`branches/data-analytics/spreadsheet-analysis.md`
- 辅助分支：`branches/documents-research/report-writing.md`
- 缺失信息与默认假设：表结构未知时先读取表头和样例行; 金额/日期字段未知时先检测并要求确认口径

最终生成的高质量 prompt：

```text
请分析 `[spreadsheet_path]` 中的销售数据。先读取表头、工作表名和样例行；检查缺失值、重复订单、异常金额和日期范围；按月份、区域、产品和销售负责人汇总销售额、订单数、客单价和环比变化。禁止覆盖原始文件；输出清洗说明、透视表、图表建议和一份销售报告。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 17. Product Requirements

- 用户原始需求：帮我写一个 PRD。
- 路由判断：为 PRD、MVP、功能规格和用户故事生成 prompt。
- 主分支：`branches/product-design-business/product-requirements.md`
- 辅助分支：无
- 缺失信息与默认假设：画像未知时用目标用户假设并标注; 商业目标未知时先以用户问题和 MVP 验证为主

最终生成的高质量 prompt：

```text
请为 `[product_idea]` 写 PRD。目标用户是 `[user_personas]`，核心场景是 `[scenarios]`。请先明确用户问题和成功指标，再拆分 MVP 功能、非目标、用户故事和验收标准。每个用户故事使用 Given/When/Then。区分首版必须做和后续迭代，不要写无法验收的愿景描述。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 18. Marketing Content

- 用户原始需求：生成小红书营销文案。
- 路由判断：为广告文案、短视频脚本、小红书、邮件营销和 SEO 内容生成 prompt。
- 主分支：`branches/product-design-business/marketing-content.md`
- 辅助分支：无
- 缺失信息与默认假设：受众未知时先输出假设画像; 合规限制未知时避免夸大功效和绝对化承诺

最终生成的高质量 prompt：

```text
请为 `[offer]` 生成小红书文案，目标受众是 `[audience]`，转化目标是引导收藏和私信咨询。输出 5 个标题、3 个正文版本、标签建议和 A/B 测试方案。每版必须有不同钩子：痛点、结果、故事。禁止夸大功效或使用无法证明的绝对化表达。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 19. Legal Policy Review

- 用户原始需求：分析一份合同里的风险。
- 路由判断：为合同、政策、条款风险、合规和隐私政策分析生成安全边界 prompt。
- 主分支：`branches/domain-specific/legal-policy-review.md`
- 辅助分支：`branches/documents-research/documentation-analysis.md`
- 缺失信息与默认假设：司法辖区未知时必须标注为待补充; 无法判断法律效力时仅做条款信息分析

最终生成的高质量 prompt：

```text
请审阅 `[contract_text]`，文件类型：服务合同，司法辖区：`[jurisdiction]`。这不是法律意见，请只做法律信息和风险识别。提取付款、交付、保密、违约、终止、责任限制和争议解决条款；按 High/Medium/Low 标注风险、原因、可能后果和建议询问律师的问题。不要给确定性法律结论。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 20. Automation Workflow

- 用户原始需求：设计一个 n8n 自动化流程。
- 路由判断：为自动化脚本、Zapier、Make、n8n、定时任务和数据同步生成流程 prompt。
- 主分支：`branches/automation/automation-workflow.md`
- 辅助分支：无
- 缺失信息与默认假设：工具未知时输出平台无关流程和可选实现; 凭证缺失时标注为需用户配置

最终生成的高质量 prompt：

```text
请设计一个 n8n 工作流：每天 9:00 从 Google Sheets 读取销售数据，生成销售日报并发到 Slack。请列出触发器、每个节点、字段映射、异常分支、重试、日志和通知。禁止写入真实凭证；凭证用环境变量或 n8n credential 占位。输出节点配置表、测试步骤和失败处理方案。
```

为什么这样写：它绑定了该场景的关键输入，加入硬约束、输出格式和验收标准，并把不确定内容从事实中分离。

## Example 21. DevOps CI

- 用户原始需求：帮我写一个 prompt，让 Codex 修复 GitHub Actions 构建失败。
- 路由判断：CI 构建失败，应使用 DevOps / CI 分支，并组合 bugfix 和 CLI agent 约束。
- 主分支：`branches/software-engineering/devops-ci.md`
- 辅助分支：`branches/software-engineering/bugfix-debugging.md`, `branches/software-engineering/cli-agent.md`
- 缺失信息与默认假设：需要仓库路径、workflow 文件、失败日志、构建/测试命令；secrets 只允许变量名。

最终生成的高质量 prompt：

```text
你是 Codex，请在 `/repo/web` 修复 GitHub Actions 构建失败。先读取 `.github/workflows/*`、`package.json`、lockfile、Dockerfile 和失败日志 `[current_error_log]`；识别 Node 版本、package manager、cache key、安装命令、构建命令和测试命令。请区分本地构建失败和 GitHub runner 环境失败，做最小修改。禁止输出真实 secrets，禁止删除测试、安全扫描或审批步骤。修复后说明如何重跑 workflow，并输出修改文件、验证步骤、失败时下一步和 rollback 方案。
```

为什么这样写：它把 CI 平台、runner 差异、secrets 和验证闭环写入 prompt，防止只改配置但不验证。

## Example 22. Database Migration

- 用户原始需求：让 AI 帮我设计一个数据库迁移方案，给 users 表加字段但不能影响线上。
- 路由判断：线上 schema 变更属于数据库迁移，必须组合 plan mode 和安全边界。
- 主分支：`branches/software-engineering/database-migration.md`
- 辅助分支：`branches/software-engineering/plan-mode.md`, `branches/software-engineering/security-threat-modeling.md`
- 缺失信息与默认假设：需要数据库类型、migration 工具、数据量、备份状态、停机容忍、受影响服务；生产默认只 plan。

最终生成的高质量 prompt：

```text
你是 Codex，请只 plan，不要执行生产数据库操作。目标是在 PostgreSQL 的 `users` 表新增 `last_seen_at` 字段且不影响线上。先读取 Prisma schema、migration 历史、访问 `users` 的服务和部署脚本。请识别破坏性变更、旧版本应用兼容、表数据量、锁表风险、索引需求和空值处理。输出分阶段方案：新增 nullable 字段、应用兼容改动、批量 backfill、读写切换、是否收紧约束、备份要求、rollback、staging 验证命令和生产发布检查。禁止无备份执行破坏性操作。
```

为什么这样写：它默认保护生产数据，把 schema、data migration、兼容性、备份和回滚拆开。

## Example 23. API Design

- 用户原始需求：帮我写一个 REST API 设计 prompt，要包含 OpenAPI、错误码和鉴权。
- 路由判断：接口契约设计，应使用 API 设计分支，必要时组合产品需求和测试生成。
- 主分支：`branches/software-engineering/api-design.md`
- 辅助分支：`branches/product-design-business/product-requirements.md`, `branches/software-engineering/test-generation.md`
- 缺失信息与默认假设：需要调用方、资源模型、鉴权方式、字段、错误场景和版本策略。

最终生成的高质量 prompt：

```text
请设计一个 REST API，用于让 Web 前端管理项目任务。调用方是 Web 前端；资源包括 `Project` 和 `Task`；鉴权使用 Bearer JWT，只有项目成员可读写。请输出接口表、请求/响应 JSON schema、统一错误响应、错误码、分页/排序/过滤规则、幂等性要求、版本策略、OpenAPI 3.1 片段、curl 示例和测试场景。必须覆盖 401、403、404、409、422、429 和 5xx；禁止暴露内部字段或忽略权限边界。
```

为什么这样写：它不仅定义 endpoint，还定义数据结构、鉴权、错误、兼容性和联调材料。

## Example 24. Knowledge Base RAG

- 用户原始需求：帮我设计一个内部文档 RAG 知识库 prompt，要求回答带引用。
- 路由判断：RAG 系统设计，需组合文档分析、API 设计和安全边界。
- 主分支：`branches/ai-systems/knowledge-base-rag.md`
- 辅助分支：`branches/documents-research/documentation-analysis.md`, `branches/software-engineering/api-design.md`, `branches/software-engineering/security-threat-modeling.md`
- 缺失信息与默认假设：需要知识源、文档类型、目标用户、权限、chunk 策略、评估问题和时效要求。

最终生成的高质量 prompt：

```text
请设计公司内部文档 RAG 知识库。知识源包括 Confluence 产品文档、Notion SOP 和 `docs/internal/*.md`；目标用户是客服和产品经理；回答范围只限内部流程、产品功能和故障排查。请建立文档索引字段，设计 chunk size、overlap、metadata、embedding、向量库、top-k 检索、rerank 和上下文组装流程。回答必须带文档标题、路径和段落/chunk 引用；检索不到依据时必须回复“知识库未找到依据”。必须包含权限控制、文档更新机制、过期文档处理、评估问题集、命中率和引用准确率指标。
```

为什么这样写：它把 RAG 的知识边界、引用、防幻觉、权限和评估指标写成硬约束。

## Example 25. Customer Service QA

- 用户原始需求：帮我分析客服对话质量并给坐席改进建议。
- 路由判断：客服质检场景，应基于证据评分并脱敏。
- 主分支：`branches/business-operations/customer-service-qa.md`
- 辅助分支：`branches/documents-research/documentation-analysis.md`, `branches/data-analytics/data-analysis.md`
- 缺失信息与默认假设：需要对话文本、业务场景、渠道、评分维度、合规规则和读者。

最终生成的高质量 prompt：

```text
请质检以下电商售后客服对话 `[conversation_transcript]`。渠道是在线聊天，读者是客服主管。先脱敏姓名、手机号、订单号和地址；再按响应速度、问题理解、流程合规、情绪安抚、解决方案、结束确认六个维度评分。每个扣分或表扬点必须引用对话轮次和原句片段。请区分事实、客户情绪推断和改进建议；禁止评价坐席人格。输出评分表、证据、违规风险、客诉归因、替代话术和培训建议。
```

为什么这样写：它避免主观评价和隐私泄露，让质检结果可复核、可训练。

## Example 26. Recruiting Evaluation

- 用户原始需求：帮我根据岗位 JD 和简历评估候选人，但要避免偏见。
- 路由判断：招聘评估属于业务运营高风险决策辅助，需要偏见控制和证据引用。
- 主分支：`branches/business-operations/recruiting-evaluation.md`
- 辅助分支：`branches/communication/roleplay-simulation.md`, `branches/documents-research/documentation-analysis.md`
- 缺失信息与默认假设：需要 JD、must-have、nice-to-have、简历、面试记录、评分标准和偏见控制规则。

最终生成的高质量 prompt：

```text
请基于 `[job_description]` 和 `[candidate_resume]` 评估候选人与高级后端工程师岗位的匹配度。先拆分 must-have：Go/Java 服务经验、数据库设计、分布式系统、线上故障处理；再拆分 nice-to-have：Kubernetes、可观测性、团队协作。每个评分必须引用简历或面试记录证据；材料不足标注“待验证”。禁止推断或使用年龄、性别、婚育、种族、宗教、残疾等受保护属性。不要给绝对录用/淘汰结论；输出匹配表、风险、后续面试问题和合规提醒。AI 输出只作辅助决策。
```

为什么这样写：它把岗位要求、证据、偏见控制和后续验证问题放在同一套评估流程里。

## Example 27. Curriculum Design

- 用户原始需求：帮我设计一个 6 周 AI 入门课程。
- 路由判断：课程设计场景，需明确学习目标、模块、活动、练习和评估。
- 主分支：`branches/education/curriculum-design.md`
- 辅助分支：`branches/domain-specific/education-tutoring.md`, `branches/documents-research/report-writing.md`
- 缺失信息与默认假设：需要学习者画像、先修知识、周期、授课形式、评估方式和最终项目。

最终生成的高质量 prompt：

```text
请设计一个 6 周 AI 入门课程，学习者是有基础编程能力但不了解机器学习的产品经理和初级开发者。目标是完成后能解释常见 AI 概念、调用大模型 API、设计简单 RAG demo，并判断 AI 功能风险。请按每周 2 次课、每次 90 分钟设计。每周必须包含学习目标、核心概念、课堂活动、练习、作业和验收标准。最终项目是一个带引用的内部知识问答原型。输出课程大纲、课时安排、作业、评分 rubric 和阶段性反馈机制。
```

为什么这样写：它把课程从主题列表转成可教学、可练习、可评估的学习路径。

## Example 28. Game Design

- 用户原始需求：帮我写一个游戏设计 prompt，输出 GDD 和可测试原型范围。
- 路由判断：游戏设计场景；若要实现原型，应组合 coding-feature-development 和 UX/UI。
- 主分支：`branches/creative-design/game-design.md`
- 辅助分支：`branches/software-engineering/coding-feature-development.md`, `branches/product-design-business/ux-ui-design.md`
- 缺失信息与默认假设：需要类型、玩家、平台、核心循环、机制、原型范围和成功指标。

最终生成的高质量 prompt：

```text
请设计一个 PC 平台 2D roguelike 小游戏，并输出 GDD 和可测试原型范围。目标玩家是喜欢 10-15 分钟短局和构筑选择的玩家。先定义核心循环：探索房间、战斗、获得随机能力、选择升级、进入下一层。必须写清玩家操作、敌人反馈、胜利条件、失败条件、房间结构、难度曲线、3 个核心道具、基础数值假设和 UI/UX。原型范围限制为 1 个角色、3 种敌人、6 个房间、1 个 boss、键鼠控制。输出 playtest 标准：完成率、平均局时、受伤来源、升级选择分布和玩家困惑点。不要只写故事。
```

为什么这样写：它先固定核心玩法循环和原型边界，避免只写世界观或机制过载。

## Natural Language Example 39. Bugfix With Registry And Eval

用户原始输入：

```text
帮我写一个 prompt，让 Codex 修复 npm run build 报错，但不要乱改项目。
```

需求归一化：

- 最终交付物：可交给 Codex 执行的 bugfix prompt。
- 任务目标：定位 `npm run build` 失败根因，做最小修复并验证。
- 已知事实：用户要求 Codex、build 报错、不要乱改。
- 缺失输入：工作目录、错误日志、复现步骤、环境信息、测试命令。

路由结果：

- 主分支：`branches/software-engineering/bugfix-debugging.md`
- 辅助分支：`branches/software-engineering/test-generation.md`, `branches/software-engineering/cli-agent.md`
- 风险等级：Medium

使用资源：

- `@branch://software-engineering/bugfix-debugging`
- `@template://coding-agent/bugfix`
- `@adapter://codex`
- `@checklist://coding-agent/final-review`
- `@eval://software-engineering/bugfix-debugging/missing-inputs`
- `@lesson://routing/ambiguous-bugfix-request`

最终 prompt：

```text
你是 Codex，请在 `[待补充: working_directory]` 修复 `npm run build` 报错。

已知信息：
- 用户要求不要乱改项目。
- 错误日志：`[待补充: error_log]`
- 复现步骤：`npm run build`，其他步骤 `[待补充]`

执行要求：
1. 先读取 `package.json`、构建配置、错误日志指向文件和相关测试。
2. 如果错误日志缺失，先要求获取或运行命令收集日志；不要猜测修复。
3. 复现失败或说明无法复现原因，再定位根因。
4. 只做最小修复；禁止无关重构、全仓库格式化、新增依赖、删除测试、降低断言或注释掉失败逻辑。
5. 修复后运行 `npm run build` 和 `[待补充: test_command]`。

输出：
- 根因：
- 证据：
- 修改文件：
- 关键改动：
- 验证命令与结果：
- 未验证项：
- 剩余风险：
```

自检结果：

- [x] 主分支由最终交付物决定。
- [x] adapter 已选择 Codex。
- [x] 缺失日志和复现步骤已处理。
- [x] forbidden features 未出现：删除测试、忽略日志、无关重构。

匹配 eval：`@eval://software-engineering/bugfix-debugging/missing-inputs`

是否需要记录 lesson：不需要，已命中 `@lesson://routing/ambiguous-bugfix-request`。

## Natural Language Example 40. RAG With Citation And Permission

用户原始输入：

```text
我想设计一个 RAG 知识库 prompt，要求带引用和权限控制。
```

需求归一化：

- 最终交付物：RAG prompt 设计任务。
- 任务目标：设计知识源、chunking、metadata、retrieval、citation、permission 和 eval。
- 缺失输入：知识源、文档类型、目标用户、权限规则、更新频率、评估问题。

路由结果：

- 主分支：`branches/ai-systems/knowledge-base-rag.md`
- 辅助分支：`branches/software-engineering/security-threat-modeling.md`, `branches/documents-research/documentation-analysis.md`
- 风险等级：High

使用资源：

- `@branch://ai-systems/knowledge-base-rag`
- `@template://ai-systems/rag-design`
- `@checklist://rag`
- `@safety://privacy-boundary`
- `@safety://security-boundary`
- `@eval://ai-systems/knowledge-base-rag/citation-required`
- `@eval://ai-systems/knowledge-base-rag/permission-control`

最终 prompt：

```text
请设计一个 RAG 知识库 prompt。知识源：`[待补充: knowledge_sources]`；目标用户：`[待补充: target_users]`；权限规则：`[待补充: access_control]`。

必须设计文档索引字段：来源、标题、路径、版本、更新时间、部门/角色权限、metadata、chunk id。必须说明 chunk size、overlap、结构化切分、embedding、向量库、metadata filter、top-k、hybrid retrieval、rerank 和上下文组装。

回答必须带引用，引用格式至少包含文档标题、路径和段落或 chunk id。检索不到依据时必须拒答或澄清，不得编造。权限过滤必须发生在检索前、上下文组装前和生成后审计阶段。输出更新策略、失效文档处理、评估问题、命中率、引用准确率、拒答准确率和权限误放率。
```

自检结果：

- [x] 引用和拒答规则明确。
- [x] 权限作为高风险边界处理。
- [x] 包含 eval 指标。

匹配 eval：`@eval://ai-systems/knowledge-base-rag/citation-required`, `@eval://ai-systems/knowledge-base-rag/permission-control`

是否需要记录 lesson：不需要，已有 `@lesson://routing/rag-citation-missed` 和 `@lesson://unsafe-patterns/rag-unsourced-answer`。

## Natural Language Example 41. Medical Safety Boundary

用户原始输入：

```text
帮我生成一个医疗信息整理 prompt，但不要让模型做诊断。
```

需求归一化：

- 最终交付物：安全的医疗信息整理 prompt。
- 任务目标：整理症状、时间线、红旗信号和就医问题。
- 缺失输入：症状、时间线、严重程度、伴随症状、病史、用药。

路由结果：

- 主分支：`branches/domain-specific/medical-health-info.md`
- 辅助分支：`branches/documents-research/report-writing.md`
- 风险等级：High

使用资源：

- `@branch://domain-specific/medical-health-info`
- `@template://high-risk/safe-boundary`
- `@safety://medical-boundary`
- `@checklist://high-risk-domain`
- `@eval://domain-specific/medical-health-info/diagnosis-boundary`

最终 prompt：

```text
请把以下健康信息整理为就医准备材料。你不能替代医生，不能诊断，不能处方，不能建议停药、换药或改变剂量。

输入：
- 症状：`[待补充: symptoms]`
- 时间线：`[待补充: timeline]`
- 严重程度和伴随症状：`[待补充]`
- 既往史、用药、检查资料：`[待补充]`

请先列出需要及时就医的红旗信号，再整理症状时间线、已知信息、待补充信息和建议询问医生的问题。不要输出疾病结论。
```

自检结果：

- [x] medical safety 已注入。
- [x] 不诊断、不处方、不停药换药。
- [x] 输出可用于就医准备。

匹配 eval：`@eval://domain-specific/medical-health-info/diagnosis-boundary`

是否需要记录 lesson：如果生成 prompt 出现诊断或处方，应新增或更新 `@lesson://unsafe-patterns/medical-diagnosis-overreach`。

## Natural Language Example 42. Data Analysis Missing Fields

用户原始输入：

```text
把这个需求整理成数据分析任务 prompt：分析用户行为数据，找转化下降原因并输出图表报告。
```

需求归一化：

- 最终交付物：数据分析 prompt。
- 任务目标：用可复现步骤分析转化下降相关因素，并输出图表报告。
- 缺失输入：数据源、字段含义、转化定义、时间范围、报告读者。

路由结果：

- 主分支：`branches/data-analytics/data-analysis.md`
- 辅助分支：`branches/data-analytics/visualization-dashboard.md`, `branches/documents-research/report-writing.md`
- 风险等级：Medium

使用资源：

- `@branch://data-analytics/data-analysis`
- `@template://data-analysis/reproducible-report`
- `@checklist://data-analysis`
- `@eval://data-analytics/data-analysis/missing-data-dictionary`

最终 prompt：

```text
请把 `[待补充: data_source]` 转成可复现的数据分析任务。目标是分析转化下降的相关因素并输出图表报告。

执行要求：
1. 先读取数据 schema、样例行、字段类型、时间范围和样本量。
2. 建立数据字典；字段含义不明时标注 `[待补充]`，不得猜成事实。
3. 定义转化率分子、分母、时间窗口和分组维度。
4. 检查缺失、重复、异常、时间戳和用户 ID 一致性。
5. 输出指标表、图表建议、结论、限制和下一步验证。
6. 禁止把相关性写成因果。
```

自检结果：

- [x] 数据字典和指标口径是前置步骤。
- [x] 图表和报告作为辅助输出。
- [x] 结论边界明确。

匹配 eval：`@eval://data-analytics/data-analysis/missing-data-dictionary`

是否需要记录 lesson：如果 prompt 跳过字段字典，应新增或更新 `@lesson://prompt-failures/data-analysis-missing-dictionary`。

## Natural Language Example 43. Prompt System Improvement

用户原始输入：

```text
帮我改进这个 prompt skill hub，让资源更好索引，也能沉淀失败经验。
```

需求归一化：

- 最终交付物：Prompt 系统改进 prompt。
- 任务目标：审计并设计 registry、eval、lessons、adapter 和 safety 资源。
- 缺失输入：项目路径、允许改动、现有结构、同步要求。

路由结果：

- 主分支：`branches/meta/meta-skill-builder.md`
- 辅助分支：`branches/general-prompt/prompt-review.md`, `branches/general-prompt/prompt-template-builder.md`
- 风险等级：Medium

使用资源：

- `@branch://meta/meta-skill-builder`
- `@checklist://prompt-system-improvement`
- `@checklist://resource-registry`
- `@eval://meta/resource-registry/basic`
- `@lesson://improvement-notes/router-resource-references`
- `@lesson://improvement-notes/registry-bind-evals-lessons`

最终 prompt：

```text
请审计并改进 `[待补充: project_path]` 的 Prompt Engineering Skill Hub。先只读审计 README、SKILL、router、protocol、templates、checklists、examples、branches、evals 和 scripts。

改进目标：
1. 让自然语言请求能完成归一化、路由、资源选择、缺失输入识别、风险检查、prompt 生成和自检。
2. 设计轻量 registry，索引 branch、template、checklist、example、eval、adapter、safety 和 lesson。
3. 设计 lessons 机制，记录失败模式、根因、修复建议和 update targets。
4. 增强 eval schema 和 feature 行为测试，只评测生成 prompt 的质量。

约束：不要引入角色化能力，不要实现 MCP Server、Web UI 或复杂 CLI，不要把项目改成角色平台。完成后运行可用验证并输出改动文件、自检和后续建议。
```

自检结果：

- [x] 先审计再修改。
- [x] registry/eval/lesson 是轻量机制。
- [x] 避免角色化能力和平台化跑偏。

匹配 eval：`@eval://meta/resource-registry/basic`

是否需要记录 lesson：如果发现新失败模式，应在 `lessons/improvement-notes.yaml` 或对应失败文件中新增记录。
