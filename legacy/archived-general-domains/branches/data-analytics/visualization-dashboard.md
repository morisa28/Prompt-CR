# Visualization Dashboard

## 1. Purpose
用于把数据字段和业务问题转化为不误导的图表与仪表盘设计。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求做图表或仪表盘
- 用户要求 BI 报告
- 用户要求指标展示

## 3. Required Inputs
- {{dashboard_goal}} 仪表盘目标
- {{metrics}} 指标
- {{data_fields}} 数据字段
- {{audience}} 用户
- {{tool}} 工具

缺失信息处理：
- 工具未知时输出工具无关规范
- 指标口径不明时先列待确认口径
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确指标和受众
- 选择合适图表
- 设计布局和筛选器
- 标明字段映射
- 避免误导性可视化
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止截断坐标轴造成误导
- 禁止使用与数据类型不匹配的图表
- 禁止隐藏样本量和口径
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 指标字典
- 图表清单
- 布局
- 交互筛选
- 数据字段映射
- 误导检查

## 7. Quality Checklist
- [ ] 每张图有问题目标
- [ ] 字段映射明确
- [ ] 口径和样本量可见
- [ ] 视觉编码匹配数据类型
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 图表堆砌 | 看不出结论 | 每图绑定问题 |
| 误用饼图/双轴 | 误导比较 | 按数据类型选图 |
| 无字段映射 | 无法实现 | 写字段和聚合方式 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Visualization Dashboard 任务。

任务目标：
{{task_goal}}

输入材料：
- {{dashboard_goal}}
- {{metrics}}
- {{data_fields}}
- {{audience}}
- {{tool}}
- {{input_materials}}

执行要求：
1. 明确指标和受众
2. 选择合适图表
3. 设计布局和筛选器
4. 标明字段映射
5. 避免误导性可视化

硬性约束：
- 禁止截断坐标轴造成误导
- 禁止使用与数据类型不匹配的图表
- 禁止隐藏样本量和口径
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
写一个仪表盘设计 prompt。
```

高质量 prompt：

```text
请设计一个面向销售经理的销售仪表盘。目标是监控月度收入、订单数、客单价、区域表现和产品 Top 10。请定义每个指标口径、需要的数据字段、推荐图表、筛选器和布局。避免截断坐标轴和混淆环比/同比。输出指标字典、图表清单、布局草图说明和数据缺口。
```
