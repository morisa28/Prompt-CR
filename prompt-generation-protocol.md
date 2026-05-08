# CodePrompt Coach Prompt Generation Protocol

本协议描述 CodePrompt Coach 如何从模糊软件工程需求生成高质量 coding agent prompt。

## 1. Intake

记录用户原始需求、目标工具、工作目录、相关材料、显式约束和期望交付物。保留用户原话，用于生成前评分和错题本记录。

## 2. Scenario Selection

按最终交付物选择唯一主场景：

- 修复错误：`bugfix-debugging`
- 新功能：`feature-development`
- 重构：`refactor-architecture`
- 测试：`test-generation`
- 代码审查：`code-review`
- 仓库理解：`repository-analysis`
- API 设计：`api-design`
- 数据库迁移：`database-migration`
- DevOps / CI：`devops-ci`
- 算法：`algorithm-problem-solving`
- 前端实现：`frontend-implementation`
- 后端实现：`backend-implementation`

## 3. Clarify By Levels

不要一次性让用户填写超长表单。按层级推进：

1. Level 0：任务类型。
2. Level 1：目标与交付物。
3. Level 2：项目上下文。
4. Level 3：约束与边界。
5. Level 4：验证方式。

问题必须绑定评分维度和最终 prompt 字段。

## 4. Structure Requirement

将回答写入 `StructuredRequirement`：

- `scenario`
- `targetTool`
- `originalPrompt`
- `workingDirectory`
- `taskGoal`
- `projectContext`
- `relatedFiles`
- `inputMaterials`
- `modificationScope`
- `forbiddenActions`
- `verificationCommands`
- `outputFormat`
- `failureHandling`

不同场景可补充 `errorLog`、`reproductionSteps`、`userFlow`、`behaviors`、`reviewScope`、`apiContract` 等字段。

## 5. Score Before Generation

使用 8 个维度评分：

- clarity
- context
- locatableInputs
- constraints
- outputFormat
- acceptanceCriteria
- riskHandling
- agentAdaptation

如果低于 45 分，默认不能直接交给 coding agent；如果存在阻塞信息，必须先追问或生成带 `[待补充]` 的草案。

## 6. Generate Prompt

最终 prompt 必须包含：

1. 角色与目标工具。
2. 工作目录。
3. 任务目标。
4. 项目背景。
5. 相关文件。
6. 输入材料。
7. 执行步骤。
8. 修改范围。
9. 禁止事项。
10. 验收标准。
11. 验证命令。
12. 输出报告格式。
13. 失败处理规则。
14. 自检要求。

Codex prompt 必须强调先读文件、最小修改、不做无关重构、执行验证、报告验证结果、无法验证时说明原因、不虚构执行结果。

## 7. Review After Generation

生成后再次调用评分器。若任何维度低于阈值：

- 列出低分维度；
- 给出修订建议；
- 创建 `PromptMistake`；
- 标记是否应更新问题树、评分规则或 prompt 模板。

## 8. Learn From Failure

错题本不是用户长期记忆，不记录隐私、密钥、合同原文、病历或完整私人对话。它只记录抽象后的 prompt 失败模式、低分维度、修复建议和更新目标。

## 9. Final Output

```text
修改摘要或需求摘要：
主场景：
目标工具：
生成前评分：
生成后评分：
缺失信息：
最终 prompt：
自检结果：
可能新增的 PromptMistake：
```
