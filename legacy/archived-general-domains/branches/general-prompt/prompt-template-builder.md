# Prompt Template Builder

## 1. Purpose
用于为团队、个人或固定流程建设可复用 prompt 模板。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求做 prompt 模板
- 用户要把某类任务固化
- 用户想复用一套 AI 工作流

## 3. Required Inputs
- {{task_family}} 任务类型
- {{repeatable_steps}} 可复用步骤
- {{variables}} 变量字段
- {{audience}} 使用者

缺失信息处理：
- 变量缺失时先从样例 prompt 中抽取
- 没有样例时输出最小可用模板和待补充字段
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 提取变量字段并定义填写说明
- 模板正文必须可复制
- 必须提供示例输入和示例输出
- 必须提供模板使用检查表
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止把一次性细节写死在模板主体
- 禁止只给变量名不解释
- 禁止缺少失败处理
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 变量表
- 模板正文
- 填写说明
- 示例输入
- 示例输出
- 检查表

## 7. Quality Checklist
- [ ] 变量命名稳定
- [ ] 必填/可选字段区分
- [ ] 示例能跑通模板
- [ ] 模板包含验收标准
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 变量太少 | 模板复用时要改正文 | 抽出路径、目标、约束、输出 |
| 变量太多 | 填写成本过高 | 区分必填和可选 |
| 没有示例 | 使用者误填 | 给完整填充样例 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Prompt Template Builder 任务。

任务目标：
{{task_goal}}

输入材料：
- {{template_name}}
- {{task_family}}
- {{variables}}
- {{example_input}}
- {{acceptance_criteria}}
- {{input_materials}}

执行要求：
1. 提取变量字段并定义填写说明
2. 模板正文必须可复制
3. 必须提供示例输入和示例输出
4. 必须提供模板使用检查表

硬性约束：
- 禁止把一次性细节写死在模板主体
- 禁止只给变量名不解释
- 禁止缺少失败处理
- 必须按 {{output_format}} 输出。
- 必须满足 {{acceptance_criteria}}。

验证与自检：
- 完成后检查目标、输入、约束、输出格式和验收标准是否全部满足。
- 对缺失或不确定的信息标注“假设”或“待补充”。
- 如果无法完成，说明阻塞原因和下一步需要的输入。
```

## 10. Example
用户原始需求：

```text
把我的 bug 修复 prompt 做成团队可复用模板。
```

高质量 prompt：

```text
请创建一个 Bugfix Prompt 模板。变量包括 `{{working_directory}}`、`{{error_log}}`、`{{reproduction_steps}}`、`{{environment}}`、`{{related_files}}`、`{{verification_steps}}`。模板必须要求先定位根因、做最小修复、禁止无关重构、修复后验证。请输出变量表、可复制模板、填写说明、一个 Vue 报错样例和使用前检查表。
```
