# Prompt Engineering Router

本路由器把用户原始需求转换为一个主分支、少量辅助分支和可执行的 prompt 构造策略。主分支由“最终交付物”决定，辅助分支由工具环境、风险领域、输出形式、验证要求和上下文复杂度决定。

## 1. Routing Goal

路由输出必须能回答：
- 用户最终想得到什么交付物。
- 哪个分支定义任务完成标准。
- 哪些辅助分支会实质提升执行、验证、安全或输出质量。
- 哪些输入缺失会阻塞或需要标注。
- 是否可以直接生成 prompt。

## 2. Multi-Layer Routing Process

1. 判断用户是否在请求 prompt 相关任务：生成 prompt、优化 prompt、扩写 prompt、压缩 prompt、审查 prompt、创建模板、创建 skill、给 AI 工具写任务说明。
2. 识别最终交付物：代码修复、功能实现、测试、仓库报告、PRD、RAG 方案、数据分析、正式报告、专业领域信息整理、Prompt 系统改进等。
3. 选择唯一主分支：只按最终交付物决定，不按关键词抢占。
4. 选择辅助分支：只补充工具适配、验证、报告、引用、权限、安全边界或多模态输入处理。
5. 处理冲突和缺失输入：按安全边界、用户约束、项目上下文、工具能力、输出格式的优先级排序。
6. 从 `metadata/resources.yaml` 选择 branch、template、checklist、example、eval、adapter、safety 和 lesson 资源。
7. 输出标准化路由结果、资源引用和 prompt 构造策略。

## 3. Primary Branch Selection

| 用户最终想得到的交付物 | 主分支 |
| --- | --- |
| 审查已有 prompt、评分、找缺口 | `branches/general-prompt/prompt-review.md` |
| 把口语需求改成可执行 prompt | `branches/general-prompt/prompt-rewrite.md` |
| 扩展短 prompt | `branches/general-prompt/prompt-expansion.md` |
| 压缩长 prompt | `branches/general-prompt/prompt-compression.md` |
| 生成可复用 prompt 模板 | `branches/general-prompt/prompt-template-builder.md` |
| 只规划不改代码 | `branches/software-engineering/plan-mode.md` |
| 新功能、页面、接口、状态逻辑 | `branches/software-engineering/coding-feature-development.md` |
| 修复报错、构建失败、白屏、CLI 错误 | `branches/software-engineering/bugfix-debugging.md` |
| 重构、模块拆分、降低耦合 | `branches/software-engineering/refactor-architecture.md` |
| 单元、集成、E2E、回归测试 | `branches/software-engineering/test-generation.md` |
| 代码审查、PR/diff review | `branches/software-engineering/code-review.md` |
| 仓库理解和只读分析报告 | `branches/software-engineering/repository-analysis.md` |
| 命令行 agent 任务说明 | `branches/software-engineering/cli-agent.md` |
| 防御性安全审查和威胁建模 | `branches/software-engineering/security-threat-modeling.md` |
| CI/CD、Docker、部署、runner、secrets | `branches/software-engineering/devops-ci.md` |
| schema migration、数据回填、rollback | `branches/software-engineering/database-migration.md` |
| REST、GraphQL、OpenAPI、鉴权、错误码 | `branches/software-engineering/api-design.md` |
| 文档、会议记录、项目资料分析 | `branches/documents-research/documentation-analysis.md` |
| PDF/书籍/论文提炼成 skill | `branches/documents-research/pdf-to-skill.md` |
| 多来源研究、论文比较、观点综合 | `branches/documents-research/research-synthesis.md` |
| 论文、文献综述、学术报告 | `branches/documents-research/academic-writing.md` |
| 项目报告、阶段总结、技术文档 | `branches/documents-research/report-writing.md` |
| 数据集、统计、趋势、异常、指标分析 | `branches/data-analytics/data-analysis.md` |
| Excel、CSV、表格分析 | `branches/data-analytics/spreadsheet-analysis.md` |
| 图表、仪表盘、BI 展示 | `branches/data-analytics/visualization-dashboard.md` |
| PRD、MVP、产品需求、用户故事 | `branches/product-design-business/product-requirements.md` |
| UX/UI、交互流程、组件规范 | `branches/product-design-business/ux-ui-design.md` |
| 商业计划、市场、竞品、增长策略 | `branches/product-design-business/business-strategy.md` |
| 营销文案、SEO、短视频脚本 | `branches/product-design-business/marketing-content.md` |
| 知识库、RAG、embedding、检索、引用 | `branches/ai-systems/knowledge-base-rag.md` |
| 客服质检、工单分析、坐席反馈 | `branches/business-operations/customer-service-qa.md` |
| 简历筛选、面试评估、招聘打分 | `branches/business-operations/recruiting-evaluation.md` |
| 课程大纲、学习路径、训练营设计 | `branches/education/curriculum-design.md` |
| 游戏概念、玩法、GDD、原型范围 | `branches/creative-design/game-design.md` |
| 图片、截图、设计稿视觉分析 | `branches/multimodal/visual-image-analysis.md` |
| 视频、音频、会议录音、时间轴笔记 | `branches/multimodal/video-audio-analysis.md` |
| Spline、Blender、3D 网页、交互视觉验证 | `branches/multimodal/visual-3d-interaction.md` |
| 合同、政策、合规、隐私条款信息分析 | `branches/domain-specific/legal-policy-review.md` |
| 症状、体检报告、就医准备、医学资料整理 | `branches/domain-specific/medical-health-info.md` |
| 金融、投资、财务分析、预算规划 | `branches/domain-specific/finance-investment-analysis.md` |
| 学习辅导、讲题、复习计划 | `branches/domain-specific/education-tutoring.md` |
| 翻译、本地化、润色、双语对照 | `branches/communication/translation-localization.md` |
| 面试、谈判、客服、销售话术模拟 | `branches/communication/roleplay-simulation.md` |
| Zapier、Make、n8n、自动化脚本和定时任务 | `branches/automation/automation-workflow.md` |
| 创建或改进 AI skill / Prompt 系统 | `branches/meta/meta-skill-builder.md` |

## 4. Auxiliary Branch Selection

辅助分支只在能改变执行质量时加入，普通任务最多 1 个，中等复杂任务最多 2 个，高风险或跨域任务最多 3 个。超过 3 个时拆成多阶段 prompt。

| 辅助需求 | 常用辅助分支 |
| --- | --- |
| 目标工具是 Codex CLI、Claude Code、Gemini CLI | `branches/software-engineering/cli-agent.md` |
| 需要先规划不执行 | `branches/software-engineering/plan-mode.md` |
| 需要测试、回归、覆盖率或验收 | `branches/software-engineering/test-generation.md` |
| 需要防御性安全边界 | `branches/software-engineering/security-threat-modeling.md` |
| 需要 API 契约或调用格式 | `branches/software-engineering/api-design.md` |
| 需要正式报告 | `branches/documents-research/report-writing.md` |
| 需要文档索引、摘要或引用 | `branches/documents-research/documentation-analysis.md` |
| 需要研究来源综合 | `branches/documents-research/research-synthesis.md` |
| 需要数据证据或指标分析 | `branches/data-analytics/data-analysis.md` |
| 需要表格处理 | `branches/data-analytics/spreadsheet-analysis.md` |
| 需要图表或仪表盘 | `branches/data-analytics/visualization-dashboard.md` |
| 需要产品验收标准 | `branches/product-design-business/product-requirements.md` |
| 需要多模态图片证据 | `branches/multimodal/visual-image-analysis.md` |
| 需要法律、医疗、金融、招聘等安全边界 | 对应 `branches/domain-specific/*` 或 `branches/business-operations/recruiting-evaluation.md` |
| 需要模板化或 Prompt 系统改进 | `branches/general-prompt/prompt-template-builder.md`、`branches/meta/meta-skill-builder.md` |

## 5. Conflict Handling

- 唯一主分支：如果多个分支命中，选择最能定义最终交付物和验收标准的分支。
- 辅助分支数量：保留工具适配、验证、安全、引用、输出格式中最关键的 1 到 3 个。
- 高风险优先级：医疗、法律、金融、安全、招聘/人事、隐私、儿童/教育优先于速度、风格和完整性。
- 需求不清晰：先生成带 `[待补充: field]` 的 prompt，只有阻塞输入缺失时才追问。
- 用户要求与安全冲突：拒绝越界部分，改写为安全替代任务。
- 代码 + 文档 + 产品混合：按最终交付物决定。若要给开发 Agent 执行，主分支通常是 `coding-feature-development` 或 `product-requirements`，报告写作和测试作为辅助。
- 只读 vs 修改冲突：用户说“分析/理解/评估”时默认只读；用户说“修复/实现/改”时允许最小修改并加验证。

## 5.1 Resource Selection Rules

路由结果必须尽量输出资源 URI，便于 AI Agent 不用人工翻目录即可组合 prompt。

资源选择规则：
- 主分支：输出一个 `@branch://...`，由最终交付物决定。
- 辅助分支：输出 0 到 3 个 `@branch://...`，只用于工具适配、验证、引用、报告、多模态或安全边界。
- 模板：优先使用 `metadata/resources.yaml` 中 linked_templates；没有专用模板时使用 `@template://general/task` 或对应分支模板。
- 检查表：至少包含通用 prompt 质量、路由、缺失输入、输出格式和最终交付前检查表；coding/high-risk/RAG/data 等任务加入专属检查表。
- Adapter：用户明确 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 或通用 Agent 时，必须选择对应 `@adapter://...`。
- Safety：医疗、法律、金融、安全、隐私、招聘/人事、儿童/教育、生产系统风险出现时，必须选择对应 `@safety://...`。
- Eval：如果存在同类 `@eval://...`，加入“可匹配 eval”，用于最终 prompt 自检。
- Lesson：如果请求命中已知失败模式或成功模式，加入 `@lesson://...`，并把 lesson 的 `fix` 写入 prompt 构造策略。

## 5.2 Adapter Selection

| 用户目标工具 | Adapter |
| --- | --- |
| Codex | `@adapter://codex` |
| Codex CLI | `@adapter://codex-cli` |
| Claude Code | `@adapter://claude-code` |
| Gemini CLI | `@adapter://gemini-cli` |
| ChatGPT | `@adapter://chatgpt` |
| 未说明但任务是仓库修改 | 默认 `@adapter://codex` 或通用 coding agent 约束 |

## 5.3 Safety Selection

| 风险信号 | Safety Resource |
| --- | --- |
| 症状、诊断、处方、停药、换药、体检报告 | `@safety://medical-boundary` |
| 合同、合法性、能否签、诉讼、合规结论 | `@safety://legal-boundary` |
| 买卖资产、收益保证、个性化投资建议 | `@safety://financial-boundary` |
| 漏洞、权限、攻击、防护、日志、内部系统 | `@safety://security-boundary` |
| 个人数据、内部文档、候选人、客户记录、权限隔离 | `@safety://privacy-boundary` |

## 5.4 Eval Matching And Lesson Lookup

Eval matching：
- 从主分支、风险领域和目标工具选择相似 eval。
- 优先匹配同分支的正常输入、缺失输入、风险/误用输入。
- 生成 prompt 后检查 expected features 是否出现，forbidden features 是否缺席。

Lesson lookup：
- bugfix 缺日志：`@lesson://routing/ambiguous-bugfix-request`。
- RAG 缺 citation：`@lesson://routing/rag-citation-missed`。
- 医疗诊断越界：`@lesson://routing/medical-safety-missed`。
- 删除测试掩盖 bug：`@lesson://unsafe-patterns/delete-tests-to-pass`。
- RAG 无来源回答：`@lesson://unsafe-patterns/rag-unsourced-answer`。
- registry 改进：`@lesson://improvement-notes/router-resource-references`、`@lesson://improvement-notes/registry-bind-evals-lessons`。

## 6. Risk Levels

| 风险等级 | 场景 | 路由要求 |
| --- | --- | --- |
| Low | 普通翻译、文案、非敏感总结 | 标注缺失输入和输出格式 |
| Medium | 代码修改、数据分析、业务报告、自动化 | 加验证、禁止无关改动、说明不确定性 |
| High | 医疗、法律、金融、安全、招聘、隐私、生产系统 | 加安全边界、来源依据、人工复核路径，必要时限制或拒绝 |

## 7. Standard Routing Output

```text
需求摘要：
最终交付物：
主分支：
辅助分支：
命中原因：
资源引用：
缺失输入：
风险等级：
安全边界：
目标工具 adapter：
建议模板：
建议检查表：
可参考示例：
可匹配 eval：
相关 lessons：
是否需要澄清：
是否可以直接生成 prompt：
prompt 构造策略：
最终输出格式：
```

缺失输入分类：
- 可合理假设：
- 需标记为 `[待补充]`：
- 需追问：
- 阻塞任务：

## 8. Prompt Construction Strategy

路由完成后，最终 prompt 必须组合：
- 主分支的目标、输入、步骤、硬约束和验收标准。
- 辅助分支的工具适配、验证、引用、报告或安全规则。
- `metadata/resources.yaml` 的模板、检查表、adapter、safety、eval 和 lesson 引用。
- `common-principles.md` 的缺失输入、约束优先级、防幻觉和高风险规则。
- `checklists.md` 的通用检查表、路由检查表和分支专属检查表。

## 9. Complex Routing Examples

### Example 1. 修复代码 bug + 需要写测试

- 用户原始需求：帮我让 Codex 修复 `npm run build` 报错，并补回归测试。
- 主分支：`branches/software-engineering/bugfix-debugging.md`
- 辅助分支：`branches/software-engineering/test-generation.md`, `branches/software-engineering/cli-agent.md`
- 命中原因：最终交付物是修复构建失败；测试和 Codex 执行是辅助要求。
- 缺失输入：完整日志、工作目录、环境、测试命令。
- 风险等级：Medium。
- prompt 构造策略：先根因分析，最小修复，禁止删除测试，运行原失败命令和相关测试。

### Example 2. 分析 GitHub 仓库 + 生成改进建议

- 用户原始需求：分析这个 GitHub repo，告诉我结构、风险和下一步优化建议，不要改代码。
- 主分支：`branches/software-engineering/repository-analysis.md`
- 辅助分支：`branches/documents-research/report-writing.md`
- 命中原因：最终交付物是只读仓库分析报告。
- 缺失输入：仓库路径或链接、关注点、输出深度。
- 风险等级：Medium。
- prompt 构造策略：只读，读取 README/配置/入口，事实和推断分开，输出风险和建议。

### Example 3. 构建 RAG 系统 + 引用和权限控制

- 用户原始需求：做一个内部知识库问答系统，回答必须引用来源，不同部门不能看到彼此文档。
- 主分支：`branches/ai-systems/knowledge-base-rag.md`
- 辅助分支：`branches/software-engineering/security-threat-modeling.md`, `branches/documents-research/documentation-analysis.md`
- 命中原因：最终交付物是 RAG 方案，引用和权限是核心辅助。
- 缺失输入：知识源、文档类型、用户角色、权限规则、更新频率、评估集。
- 风险等级：High。
- prompt 构造策略：定义索引字段、chunk、metadata、retrieval/rerank、引用、不命中拒答、权限和审计。

### Example 4. 编写 PRD + 输出给开发 Agent

- 用户原始需求：帮我写一个 PRD，并把它转成 Codex 能实现的开发 prompt。
- 主分支：`branches/product-design-business/product-requirements.md`
- 辅助分支：`branches/software-engineering/coding-feature-development.md`, `branches/software-engineering/test-generation.md`
- 命中原因：最终交付物先是 PRD，开发 prompt 是后续执行形式。
- 缺失输入：目标用户、核心场景、MVP 范围、非目标、成功指标。
- 风险等级：Medium。
- prompt 构造策略：先生成 PRD，再输出开发 Agent 任务、验收标准和验证方式。

### Example 5. 医疗信息整理 + 安全边界

- 用户原始需求：我最近胸痛，帮我写 prompt 让 AI 判断是什么病。
- 主分支：`branches/domain-specific/medical-health-info.md`
- 辅助分支：无或 `branches/documents-research/report-writing.md`
- 命中原因：医疗高风险，必须限制为症状整理和就医准备。
- 缺失输入：症状时间线、严重程度、伴随症状、病史、用药。
- 风险等级：High。
- prompt 构造策略：不诊断、不处方，先列急症红旗信号和就医建议，再整理给医生的问题。

### Example 6. 金融分析 + 风险披露

- 用户原始需求：帮我写 prompt 分析某只股票要不要买。
- 主分支：`branches/domain-specific/finance-investment-analysis.md`
- 辅助分支：`branches/data-analytics/data-analysis.md`, `branches/documents-research/report-writing.md`
- 命中原因：金融高风险，最终交付物应改为信息性研究框架。
- 缺失输入：标的、时间范围、数据来源、风险偏好、当前日期。
- 风险等级：High。
- prompt 构造策略：不做买卖指令，不保证收益；区分事实、假设、观点和风险。

### Example 7. 法律合同总结 + 非法律建议边界

- 用户原始需求：总结这份合同有哪些坑，告诉我能不能签。
- 主分支：`branches/domain-specific/legal-policy-review.md`
- 辅助分支：`branches/documents-research/documentation-analysis.md`, `branches/documents-research/report-writing.md`
- 命中原因：法律高风险，最终交付物应是条款摘要和风险点，不是最终法律结论。
- 缺失输入：司法辖区、合同类型、合同文本、交易背景、风险关注。
- 风险等级：High。
- prompt 构造策略：要求非法律建议声明、条款义务、风险等级、律师咨询问题。

### Example 8. Prompt 系统优化 + 分支结构改进

- 用户原始需求：审计我的 prompt skill hub，补路由、模板、eval 和 manifest。
- 主分支：`branches/meta/meta-skill-builder.md`
- 辅助分支：`branches/general-prompt/prompt-review.md`, `branches/general-prompt/prompt-template-builder.md`
- 命中原因：最终交付物是 Prompt 系统改进方案和文件修改。
- 缺失输入：项目路径、目标工具、重点分支、是否允许新增文件。
- 风险等级：Medium。
- prompt 构造策略：先审计再改，补齐路由、模板、检查表、示例、eval 和结构化元数据。

### Example 9. 数据分析 + 可视化报告

- 用户原始需求：分析用户行为 CSV，找留存问题并输出可视化报告。
- 主分支：`branches/data-analytics/data-analysis.md`
- 辅助分支：`branches/data-analytics/visualization-dashboard.md`, `branches/documents-research/report-writing.md`
- 命中原因：最终交付物是数据分析结论，图表和报告是辅助输出形式。
- 缺失输入：CSV 路径、字段含义、指标口径、时间范围、报告读者。
- 风险等级：Medium。
- prompt 构造策略：数据字典、质量检查、指标定义、可复现分析、图表和结论边界。

### Example 10. 多模态图片分析 + 结构化描述

- 用户原始需求：分析这张 UI 截图，输出结构化问题清单。
- 主分支：`branches/multimodal/visual-image-analysis.md`
- 辅助分支：`branches/product-design-business/ux-ui-design.md`
- 命中原因：最终交付物是基于可见内容的视觉分析。
- 缺失输入：图片、观察重点、目标设备、输出格式。
- 风险等级：Low。
- prompt 构造策略：区分可见事实和推断，描述空间位置，不推断不可见实现。
