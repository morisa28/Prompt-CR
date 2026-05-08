# Prompt Compression

## 1. Purpose
用于把冗长、重复或说明性过强的 prompt 压缩为短版、中版或极简版。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户说 prompt 太长
- 用户要求保留核心约束但减少 token
- 用户需要短版/中版/极简版

## 3. Required Inputs
- {{long_prompt}} 长 prompt
- {{target_length}} 目标长度
- {{must_preserve}} 不可删内容
- {{target_ai_tool}} 目标工具

缺失信息处理：
- 未指定长度时输出短版和极简版各一份
- 不可删内容未知时保留所有硬约束和验收
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 保留目标、关键上下文、硬约束、输出格式和验收标准
- 删除重复解释、背景故事和软性形容词
- 禁止删除否定约束和安全边界
- 输出压缩说明，说明删了什么、保留了什么
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止把多阶段任务压成单句
- 禁止删除用户禁止事项
- 必须保留不确定性标注
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 压缩版 prompt
- 删减说明
- 保留约束清单
- 风险提醒

## 7. Quality Checklist
- [ ] 目标未变
- [ ] 硬约束完整
- [ ] 输出格式仍明确
- [ ] 验收标准仍可检查
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只做摘要 | 不能直接执行 | 压缩后仍保留命令式结构 |
| 删掉禁止事项 | 产生越界执行 | 先锁定 must/must not |
| 删掉验收 | 完成标准消失 | 压缩为一行验收也要保留 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Prompt Compression 任务。

任务目标：
{{task_goal}}

输入材料：
- {{long_prompt}}
- {{target_length}}
- {{must_preserve}}
- {{compression_level}}
- {{input_materials}}

执行要求：
1. 保留目标、关键上下文、硬约束、输出格式和验收标准
2. 删除重复解释、背景故事和软性形容词
3. 禁止删除否定约束和安全边界
4. 输出压缩说明，说明删了什么、保留了什么

硬性约束：
- 禁止把多阶段任务压成单句
- 禁止删除用户禁止事项
- 必须保留不确定性标注
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
把这个长 prompt 压到 150 字以内，但保留不要改无关文件和要跑测试。
```

高质量 prompt：

```text
你是 Codex，请修复 `[bug]`。先读相关文件和日志，定位根因后做最小改动；禁止无关重构、全仓库格式化、新增依赖或删除用户功能。修复后运行 `[test_command]`，最终报告根因、改动文件、验证结果和剩余风险。若信息不足，标注阻塞问题。
```
