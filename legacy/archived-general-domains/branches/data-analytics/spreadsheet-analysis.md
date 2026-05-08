# Spreadsheet Analysis

## 1. Purpose
用于明确表格结构、清洗规则、汇总维度和报告输出。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求分析 Excel/CSV/表格
- 用户要求生成销售/财务/成绩报告
- 用户要求透视分析

## 3. Required Inputs
- {{spreadsheet_path}} 表格路径
- {{sheet_names}} 工作表
- {{analysis_goal}} 分析目标
- {{grouping_dimensions}} 汇总维度
- {{report_format}} 报告格式

缺失信息处理：
- 表结构未知时先读取表头和样例行
- 金额/日期字段未知时先检测并要求确认口径
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确表格结构
- 检查缺失值和异常值
- 设计汇总维度
- 生成透视分析
- 保留原始数据
- 输出公式、图表或报告
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止覆盖原始表
- 禁止无说明地删除行列
- 禁止混用币种、日期或统计口径
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 表结构
- 数据质量
- 透视汇总
- 公式/代码
- 图表建议
- 报告

## 7. Quality Checklist
- [ ] 原始数据保留
- [ ] 汇总维度清楚
- [ ] 异常处理有记录
- [ ] 报告能复现
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 直接改原表 | 数据损坏 | 复制或输出新表 |
| 不看表头 | 字段误用 | 先读取结构 |
| 口径不明 | 汇总错误 | 定义日期、金额、状态 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Spreadsheet Analysis 任务。

任务目标：
{{task_goal}}

输入材料：
- {{spreadsheet_path}}
- {{sheet_names}}
- {{analysis_goal}}
- {{grouping_dimensions}}
- {{report_format}}
- {{input_materials}}

执行要求：
1. 明确表格结构
2. 检查缺失值和异常值
3. 设计汇总维度
4. 生成透视分析
5. 保留原始数据

硬性约束：
- 禁止覆盖原始表
- 禁止无说明地删除行列
- 禁止混用币种、日期或统计口径
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
帮我分析 Excel 表格并生成销售报告。
```

高质量 prompt：

```text
请分析 `[spreadsheet_path]` 中的销售数据。先读取表头、工作表名和样例行；检查缺失值、重复订单、异常金额和日期范围；按月份、区域、产品和销售负责人汇总销售额、订单数、客单价和环比变化。禁止覆盖原始文件；输出清洗说明、透视表、图表建议和一份销售报告。
```
