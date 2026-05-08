# Business Strategy

## 1. Purpose
用于把商业目标拆成市场、用户、竞品、收入、风险和执行动作。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求商业策略或商业计划
- 用户要求市场/竞品/增长分析
- 用户要求变现路径

## 3. Required Inputs
- {{business_goal}} 商业目标
- {{market}} 市场
- {{target_customers}} 客户
- {{competitors}} 竞品
- {{constraints}} 资源限制

缺失信息处理：
- 数据缺失时标注假设并输出需验证信息
- 竞品未知时先定义竞品类别
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确商业目标
- 分析用户、市场、竞品
- 设计收入模型
- 评估风险
- 输出可执行策略和验证实验
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止空泛创业建议
- 禁止承诺增长结果
- 禁止忽略成本、渠道和风险
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 目标
- 市场和用户
- 竞品矩阵
- 定位
- 收入模型
- 增长实验
- 风险
- 下一步

## 7. Quality Checklist
- [ ] 策略绑定目标
- [ ] 有验证动作
- [ ] 风险和假设明确
- [ ] 指标可追踪
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 口号式策略 | 不可执行 | 写动作、负责人和指标 |
| 无竞品证据 | 判断偏 | 列来源和假设 |
| 忽略资源 | 方案落不了地 | 写预算/人力限制 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Business Strategy 任务。

任务目标：
{{task_goal}}

输入材料：
- {{business_goal}}
- {{market}}
- {{target_customers}}
- {{competitors}}
- {{constraints}}
- {{input_materials}}

执行要求：
1. 明确商业目标
2. 分析用户、市场、竞品
3. 设计收入模型
4. 评估风险
5. 输出可执行策略和验证实验

硬性约束：
- 禁止空泛创业建议
- 禁止承诺增长结果
- 禁止忽略成本、渠道和风险
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
帮我生成竞品分析 prompt。
```

高质量 prompt：

```text
请为 `[product]` 做竞品分析，目标是找到差异化定位和 3 个可验证增长实验。比较 `[competitors]` 的目标客户、核心功能、定价、渠道、优势和弱点。数据缺失必须标注为假设。输出竞品矩阵、机会点、风险、收入模型建议和 30 天实验计划。
```
