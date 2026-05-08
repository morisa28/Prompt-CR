# Visual Image Analysis

## 1. Purpose
用于让模型基于可见内容输出结构化视觉分析，并区分事实和推断。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求分析图片/截图/设计稿
- 用户要求定位页面视觉问题
- 用户要求看图解题

## 3. Required Inputs
- {{image_inputs}} 图片或截图
- {{observation_focus}} 观察重点
- {{context}} 背景
- {{output_need}} 输出需求

缺失信息处理：
- 无法确认的内容标注为不确定
- 图片分辨率不足时要求用户补高清图或局部截图
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 指定观察重点
- 区分可见事实和推断
- 描述空间关系
- 标注不确定区域
- 输出结构化视觉分析
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止声称看见图中不存在的内容
- 禁止推断敏感身份或不可见属性
- 禁止跳过不确定性标注
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 可见事实
- 空间关系
- 问题定位
- 推断
- 不确定区域
- 建议

## 7. Quality Checklist
- [ ] 事实和推断分开
- [ ] 空间关系具体
- [ ] 观察重点已覆盖
- [ ] 不确定内容已标注
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 把推断当事实 | 误导 | 分栏输出 |
| 不描述位置 | 难定位 | 用上/下/左/右/前景/背景 |
| 忽略分辨率 | 过度判断 | 标注不可读区域 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Visual Image Analysis 任务。

任务目标：
{{task_goal}}

输入材料：
- {{image_inputs}}
- {{observation_focus}}
- {{context}}
- {{output_need}}
- {{input_materials}}

执行要求：
1. 指定观察重点
2. 区分可见事实和推断
3. 描述空间关系
4. 标注不确定区域
5. 输出结构化视觉分析

硬性约束：
- 禁止声称看见图中不存在的内容
- 禁止推断敏感身份或不可见属性
- 禁止跳过不确定性标注
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
分析这张页面截图哪里不协调。
```

高质量 prompt：

```text
请分析 `[screenshot]` 的页面视觉问题。重点观察布局、层级、对齐、文字溢出、按钮状态和视觉噪音。输出可见事实、问题位置、影响、修复建议和不确定区域。必须区分截图中可见内容和你的推断；不要评价截图外无法确认的实现。
```
