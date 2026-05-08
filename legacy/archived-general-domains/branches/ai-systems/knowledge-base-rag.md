# Knowledge Base RAG

## 1. Purpose

用于为知识库、RAG 系统、文档切分、embedding、向量数据库、检索、rerank、引用溯源、权限控制、更新策略、防幻觉和检索评估生成 prompt。

不用于没有知识源的常识问答、无引用要求的普通摘要，或绕过权限读取内部材料。

## 2. Trigger Conditions

明确命中：
- 用户提到 RAG、知识库、向量数据库、embedding、retrieval、rerank、内部文档助手。
- 用户要求回答必须带引用、仅基于知识库回答、检索不到拒答。
- 用户要求设计 chunk、metadata、权限、更新机制或 evaluation。

可能命中：
- 文档问答、客服知识库、企业搜索、合规资料助手。
- 多文档研究中需要引用和权限边界。

不应命中：
- 只要总结一个文档，使用 `documentation-analysis`。
- 只要写研究报告，使用 `research-synthesis` 或 `report-writing`。
- 没有知识源却要求“回答所有问题”，应标注阻塞。

相似分支区别：
- `documentation-analysis` 处理文档理解，本分支处理检索增强系统。
- `api-design` 可辅助设计 RAG 服务接口。
- `security-threat-modeling` 可辅助权限、审计和数据泄露风险。

## 3. Required Inputs

必需输入：
- `{{knowledge_sources}}` 文档库、路径、URL、所有者。
- `{{document_types}}` 文档类型和格式。
- `{{target_users}}` 用户角色。
- `{{qa_scope}}` 回答范围和不回答范围。
- `{{citation_requirement}}` 引用格式。
- `{{access_control}}` 权限规则。
- `{{freshness_requirement}}` 更新频率和时效。
- `{{evaluation_questions}}` 评估问题集。

可选输入：
- `{{chunking_strategy}}` chunk size、overlap、结构化切分。
- `{{metadata_schema}}` metadata 字段。
- `{{embedding_model}}` embedding 模型。
- `{{vector_database}}` 向量库。
- `{{retrieval_strategy}}` top-k、hybrid、filter。
- `{{reranking_strategy}}` rerank 策略。

缺失时处理：
- 知识源未知：阻塞，必须先列文档范围、所有者和更新方式。
- 权限未知：默认最小权限，禁止跨用户或跨部门泄露。
- chunk/embedding/vector store 未定：可输出选型方案，但必须标注假设。
- 引用格式未知：默认引用文档标题、路径、段落或 chunk id。

## 4. Prompt Construction Rules

- 目标定义：说明系统只基于允许访问的知识源回答。
- 文档索引：要求建立来源、标题、路径、版本、更新时间、权限、metadata、chunk id。
- Chunking：设计结构化切分、chunk size、overlap、去重、表格/代码/图片处理和版本策略。
- Embedding 和存储：说明 embedding 模型、向量库、索引字段、过滤条件和刷新策略。
- 检索：定义 query rewriting、metadata filter、top-k、hybrid retrieval、rerank、上下文组装。
- 生成：要求答案带引用；无依据时拒答、澄清或说明知识库未找到依据。
- 权限：检索前后都必须执行权限过滤，记录审计日志。
- 评估：设计问题集、命中率、引用准确率、拒答准确率、权限误放率、人工抽检。
- 工具适配：开发 Agent prompt 应包含接口、数据流、测试集和验证命令。

## 5. Hard Constraints

- 不得允许模型在检索不到依据时编造答案。
- 不得允许无引用回答内部知识问题。
- 不得绕过或弱化权限控制。
- 不得把所有文档一刀切 chunk 而不定义 metadata。
- 不得忽略文档更新、版本、失效和审计。
- 不得把 private 文档内容暴露给无权限用户。

## 6. Output Format

最终 prompt 应要求目标模型输出：

```text
知识源和范围：
文档索引字段：
chunking 和 metadata：
embedding / vector store：
retrieval / rerank 流程：
回答生成和引用规则：
权限控制和审计：
更新和失效策略：
评估集和指标：
风险和待确认问题：
```

## 7. Quality Checklist

- [ ] 是否明确知识源、文档类型、所有者和更新频率？
- [ ] 是否定义问答范围和不回答范围？
- [ ] 是否定义 chunk、overlap、metadata、去重和版本策略？
- [ ] 是否定义 embedding、向量库、检索、rerank 和上下文组装？
- [ ] 是否强制回答带引用并定义引用格式？
- [ ] 是否有检索不到依据时的拒答或澄清规则？
- [ ] 是否覆盖权限过滤、敏感信息、审计和更新？
- [ ] 是否定义评估问题和检索/引用/拒答/权限指标？

## 8. Common Mistakes

| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只说“做知识库” | 范围不清，无法实现 | 列知识源、用户、问答范围和非范围 |
| 没有 chunk 和 metadata | 检索质量不可控 | 定义 chunk、overlap、结构化切分和索引字段 |
| 没有引用和拒答 | 幻觉不可追踪 | 强制引用和不命中策略 |
| 忽略权限 | 内部信息泄露 | 检索前后权限过滤和审计 |
| 没有评估集 | 无法验证质量 | 设计命中、引用、拒答和权限测试 |

## 9. Reusable Template

```text
请设计 RAG 知识库系统 prompt。

知识源：{{knowledge_sources}}
文档类型：{{document_types}}
目标用户：{{target_users}}
问答范围和非范围：{{qa_scope}}
引用要求：{{citation_requirement}}
权限控制：{{access_control}}
更新频率：{{freshness_requirement}}
评估问题：{{evaluation_questions}}

执行要求：
1. 建立文档索引字段：来源、标题、路径、版本、更新时间、权限、metadata、chunk id。
2. 设计 chunking、overlap、metadata、去重、表格/代码/图片处理和版本策略。
3. 设计 embedding、向量库、检索、metadata filter、rerank、上下文组装和生成流程。
4. 回答必须带引用；检索不到依据时必须拒答或澄清，不得编造。
5. 权限过滤必须发生在检索和生成前后，记录审计日志。
6. 设计评估集和指标：命中率、引用准确率、拒答准确率、权限误放率、人工抽检。

输出格式：
知识源和范围、索引字段、chunk/metadata、检索流程、回答规则、权限审计、更新策略、评估方案、风险。
```

## 10. Example

用户原始需求：

```text
做一个公司内部文档 RAG，回答必须带引用，不同部门不能看到彼此文档。
```

路由判断：
- 主分支：`ai-systems/knowledge-base-rag`
- 辅助分支：`software-engineering/security-threat-modeling`, `documents-research/documentation-analysis`
- 风险等级：High

高质量 prompt：

```text
请设计公司内部文档 RAG 知识库。知识源包括 Confluence 产品文档、Notion SOP 和 `docs/internal/*.md`；目标用户是客服和产品经理；回答范围只限内部流程、产品功能和故障排查。建立索引字段：标题、路径、版本、更新时间、部门权限、chunk id、metadata。设计 chunk size、overlap、结构化切分、embedding、向量库、metadata filter、top-k 检索、rerank 和上下文组装。回答必须带文档标题、路径和段落/chunk 引用；检索不到依据时回复“知识库未找到依据”。权限过滤必须发生在检索和生成前后，并记录审计日志。输出更新策略、失效文档处理、评估问题集、命中率、引用准确率、拒答准确率和权限误放率。
```

质量检查结果：
- [x] 包含知识源、引用和权限。
- [x] 包含 chunk、metadata、retrieval、rerank。
- [x] 包含不命中拒答。
- [x] 包含评估指标。
