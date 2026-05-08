# Video Audio Analysis

## 1. Purpose
用于把音视频材料转化为时间轴、主题、关键片段、行动项和摘要。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求视频/音频分析
- 用户要求会议录音整理
- 用户要求课程视频时间轴笔记

## 3. Required Inputs
- {{media_path}} 媒体路径
- {{transcript}} 转写文本
- {{analysis_goal}} 分析目标
- {{timestamp_granularity}} 时间戳粒度

缺失信息处理：
- 没有转写时先要求转写或使用可用音频工具
- 说话人未知时用 Speaker A/B 并标注不确定
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确时间轴
- 提取主题和关键片段
- 区分说话人
- 生成摘要、行动项和时间戳笔记
- 标注听不清或画面不明内容
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止编造未听见内容
- 禁止省略关键决策和行动项
- 禁止把说话人身份写死，除非材料提供
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 时间轴
- 主题摘要
- 关键片段
- 行动项
- 说话人
- 不确定内容

## 7. Quality Checklist
- [ ] 时间戳完整
- [ ] 行动项有 owner/next step
- [ ] 说话人不确定已标注
- [ ] 摘要覆盖目标
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只给总摘要 | 无法回看 | 加入时间戳 |
| 混淆说话人 | 行动项错 | 用 Speaker 标记 |
| 听不清也确定写 | 幻觉 | 标注 unclear |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Video Audio Analysis 任务。

任务目标：
{{task_goal}}

输入材料：
- {{media_path}}
- {{transcript}}
- {{analysis_goal}}
- {{timestamp_granularity}}
- {{input_materials}}

执行要求：
1. 明确时间轴
2. 提取主题和关键片段
3. 区分说话人
4. 生成摘要、行动项和时间戳笔记
5. 标注听不清或画面不明内容

硬性约束：
- 禁止编造未听见内容
- 禁止省略关键决策和行动项
- 禁止把说话人身份写死，除非材料提供
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
写一个 prompt 总结会议录音。
```

高质量 prompt：

```text
请分析 `[media_path/transcript]` 的会议内容。输出 5 分钟粒度时间轴、主题摘要、关键决策、行动项表和未确认问题。说话人不确定时使用 Speaker A/B；听不清内容用 `[不清楚]` 标注。行动项必须包含事项、负责人、截止时间或待确认字段。
```
