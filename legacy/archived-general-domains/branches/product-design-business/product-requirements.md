# Product Requirements

## 1. Purpose

用于把产品想法转化为 PRD、MVP 范围、用户故事、验收标准、指标和可交给开发 Agent 的实现提示。

不用于写营销文案、纯 UI 视觉稿、商业计划或没有用户目标的功能堆砌。

## 2. Trigger Conditions

明确命中：
- 用户要求写 PRD、MVP、产品需求、功能规格、用户故事。
- 用户要把想法转成开发团队或 coding agent 可执行需求。
- 用户要求定义验收标准、非目标、指标、边界条件。

可能命中：
- 用户要求“帮我设计一个功能”，但重点是需求而非代码。
- 用户提供业务目标，要求拆成产品方案。

不应命中：
- 用户要直接实现代码，使用 `coding-feature-development`。
- 用户要 UI 交互细节，使用 `ux-ui-design`。
- 用户要商业策略，使用 `business-strategy`。

相似分支区别：
- `coding-feature-development` 执行实现，本分支定义需求。
- `api-design` 定义接口契约，可作为后续辅助。
- `report-writing` 输出正式报告，可作为文档格式辅助。

## 3. Required Inputs

必需输入：
- `{{product_goal}}` 产品目标。
- `{{target_users}}` 目标用户。
- `{{user_scenarios}}` 使用场景。
- `{{problem_statement}}` 要解决的问题。
- `{{mvp_scope}}` 首版范围。
- `{{non_goals}}` 非目标。
- `{{success_metrics}}` 成功指标。

可选输入：
- `{{business_constraints}}` 商业、合规、时间或资源约束。
- `{{technical_context}}` 技术上下文。
- `{{stakeholders}}` 干系人。
- `{{release_plan}}` 迭代计划。

缺失时处理：
- 用户画像缺失：提出假设画像，并标注需确认。
- 成功指标缺失：先输出候选指标，不写成已确认 KPI。
- MVP 范围缺失：必须区分首版、后续迭代和非目标。
- 高风险产品场景：涉及医疗、金融、法律、儿童、隐私时加入对应边界。

## 4. Prompt Construction Rules

- 目标定义：先明确用户问题和业务目标，不从功能清单开始。
- 上下文整理：列用户、场景、约束、已有材料、未知项。
- 任务分解：问题定义、用户故事、功能范围、非目标、边界条件、验收标准、指标、开放问题。
- 验收标准：每个用户故事使用 Given/When/Then 或等价可测试格式。
- 开发 Agent 适配：如用户要交给开发 Agent，附实现 prompt，包括工作目录占位符、先读文件、禁止事项、验证步骤和报告格式。
- 输出格式：PRD 主体和开发 prompt 分开，避免把需求和实现细节混成一段。

## 5. Hard Constraints

- 不得把愿景写成无法验收的需求。
- 不得混合 MVP、后续迭代和非目标。
- 不得忽略目标用户、使用场景和成功指标。
- 不得编造用户研究、数据或业务结论。
- 不得给开发 Agent 无边界的“自由实现”指令。
- 涉及高风险领域时不得省略安全边界和人工复核。

## 6. Output Format

最终 prompt 应要求目标模型输出：

```text
PRD 标题：
背景和问题：
目标用户：
核心场景：
目标和非目标：
MVP 范围：
用户故事：
功能需求：
边界条件：
验收标准：
成功指标：
开放问题：
开发 Agent 实现提示：
```

## 7. Quality Checklist

- [ ] 是否明确目标用户和核心场景？
- [ ] 是否先定义问题再列功能？
- [ ] MVP、后续迭代和非目标是否分开？
- [ ] 每个用户故事是否有可测试验收标准？
- [ ] 是否包含边界条件、异常流程和限制？
- [ ] 是否包含成功指标或待确认指标？
- [ ] 是否输出可交给开发 Agent 的实现提示？
- [ ] 是否避免编造用户研究或商业数据？

## 8. Common Mistakes

| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只写功能清单 | 开发不知道用户价值 | 先写用户、场景和问题 |
| 没有非目标 | 范围膨胀 | 明确 MVP、后续和不做什么 |
| 验收标准不可测试 | 无法验收 | 使用 Given/When/Then |
| 把 PRD 直接当开发 prompt | coding agent 缺边界 | 额外输出实现提示和验证要求 |

## 9. Reusable Template

```text
请为以下产品想法生成 PRD，并附可交给开发 Agent 的实现提示。

产品目标：{{product_goal}}
目标用户：{{target_users}}
用户问题：{{problem_statement}}
核心场景：{{user_scenarios}}
MVP 范围：{{mvp_scope}}
非目标：{{non_goals}}
成功指标：{{success_metrics}}
约束：{{business_constraints}}
技术上下文：{{technical_context}}

执行要求：
1. 先定义用户问题、目标用户和核心场景。
2. 区分 MVP、后续迭代和非目标。
3. 输出用户故事，每条使用 Given/When/Then 验收标准。
4. 包含边界条件、异常流程、指标和开放问题。
5. 如果要交给开发 Agent，额外输出实现 prompt：工作目录占位符、先读文件、修改范围、禁止无关重构、测试/构建验证、最终报告格式。

禁止编造用户研究、业务数据或已确认 KPI；未知项标注为 [待补充]。
```

## 10. Example

用户原始需求：

```text
帮我写一个 PRD，做团队知识库搜索，并输出给开发 Agent 的 prompt。
```

路由判断：
- 主分支：`product-design-business/product-requirements`
- 辅助分支：`ai-systems/knowledge-base-rag`, `software-engineering/coding-feature-development`
- 风险等级：Medium

高质量 prompt：

```text
请为“团队知识库搜索”生成 PRD，并附可交给 Codex 的实现提示。目标用户是客服和产品经理；核心场景是搜索 SOP、产品说明和故障排查文档；MVP 范围包括关键词搜索、结果摘要、来源链接和权限过滤；非目标包括自动写入知识库和跨部门越权访问。每个用户故事使用 Given/When/Then 验收标准。成功指标先提出候选：搜索成功率、无结果率、点击来源率和权限误放率，标注待确认。开发 Agent prompt 必须包含工作目录占位符、先读文档和权限相关文件、禁止绕过权限、测试/构建验证和最终报告格式。
```

质量检查结果：
- [x] 有目标用户、场景、MVP、非目标。
- [x] 有验收标准要求。
- [x] 有开发 Agent 边界。
- [x] 覆盖权限风险。
