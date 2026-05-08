# Automation Workflow

## 1. Purpose
用于把触发条件、输入输出、流程节点、失败处理、日志和通知设计成可执行自动化方案。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求自动化流程/脚本
- 用户要求 n8n/Zapier/Make 工作流
- 用户要求定时数据同步或报告生成

## 3. Required Inputs
- {{trigger}} 触发条件
- {{inputs}} 输入
- {{outputs}} 输出
- {{tools}} 工具
- {{failure_handling}} 失败处理
- {{schedule}} 调度

缺失信息处理：
- 工具未知时输出平台无关流程和可选实现
- 凭证缺失时标注为需用户配置
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确触发条件和输入输出
- 设计流程节点
- 处理失败分支
- 加入日志和通知
- 输出可执行自动化方案
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止写入真实凭证
- 禁止无重试/告警的关键流程
- 禁止省略幂等和重复执行处理
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 流程图文字版
- 节点配置
- 数据映射
- 失败分支
- 日志通知
- 测试步骤

## 7. Quality Checklist
- [ ] 触发和输出明确
- [ ] 每个节点有输入输出
- [ ] 失败分支完整
- [ ] 凭证和权限安全
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只有目标无节点 | 无法实现 | 拆成节点 |
| 无失败处理 | 自动化静默失败 | 加重试/告警 |
| 写死凭证 | 安全风险 | 用变量和密钥管理 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Automation Workflow 任务。

任务目标：
{{task_goal}}

输入材料：
- {{trigger}}
- {{inputs}}
- {{outputs}}
- {{tools}}
- {{failure_handling}}
- {{schedule}}
- {{verification_steps}}
- {{input_materials}}

执行要求：
1. 明确触发条件和输入输出
2. 设计流程节点
3. 处理失败分支
4. 加入日志和通知
5. 输出可执行自动化方案

硬性约束：
- 禁止写入真实凭证
- 禁止无重试/告警的关键流程
- 禁止省略幂等和重复执行处理
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
设计一个 n8n 自动化流程。
```

高质量 prompt：

```text
请设计一个 n8n 工作流：每天 9:00 从 Google Sheets 读取销售数据，生成销售日报并发到 Slack。请列出触发器、每个节点、字段映射、异常分支、重试、日志和通知。禁止写入真实凭证；凭证用环境变量或 n8n credential 占位。输出节点配置表、测试步骤和失败处理方案。
```
