# Plan Mode

## 1. Purpose

用于大范围或高风险开发前，只让 agent 阅读、分析、规划并等待确认。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions

- 用户要求先 plan
- 用户说不要直接改代码
- 任务涉及大范围修改、迁移或架构决策

## 3. Required Inputs

- {{working_directory}} 工作目录
- {{task_goal}} 任务目标
- {{read_first}} 先读文件
- {{risk_focus}} 关注风险

缺失信息处理：

- 未列文件时要求先读 README、配置和相关入口
- 验证命令未知时要求 plan 中提出
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules

- 明确只分析不修改
- 先读取相关文件再输出计划
- 列出涉及文件、风险点、验证方式和阻塞问题
- 用户确认前不得执行大规模改动
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints

- 禁止修改文件
- 禁止运行会改变项目状态的命令
- 禁止把 plan 写成已执行结果
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- 任务理解
- 已读/待读文件
- 当前状态
- 风险和未知
- 分阶段计划
- 预计修改文件
- 验证方式
- 待确认问题

## 7. Quality Checklist

- [ ] 包含 no-edit 约束
- [ ] 计划按阶段可执行
- [ ] 风险和验证明确
- [ ] 阻塞问题与假设分开
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes

| Common Mistake   | Risk             | Repair             |
| ---------------- | ---------------- | ------------------ |
| 计划里直接改文件 | 违反用户模式     | 写明只读和等待确认 |
| 不读文件就规划   | 计划脱离项目     | 指定先读范围       |
| 缺验证           | 无法执行后续阶段 | 加入命令或手动检查 |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请处理以下 Plan Mode 任务。

任务目标：
{{task_goal}}

输入材料：
- {{working_directory}}
- {{task_goal}}
- {{read_first}}
- {{risk_focus}}
- {{verification_steps}}
- {{input_materials}}

执行要求：
1. 明确只分析不修改
2. 先读取相关文件再输出计划
3. 列出涉及文件、风险点、验证方式和阻塞问题
4. 用户确认前不得执行大规模改动

硬性约束：
- 禁止修改文件
- 禁止运行会改变项目状态的命令
- 禁止把 plan 写成已执行结果
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
让 Codex 先 plan，不要直接改代码。
```

高质量 prompt：

```text
你是 Codex，现在处于 plan 模式。工作目录：`/repo/app`。目标：重构认证模块以减少重复逻辑。请只读取 README、`package.json`、`src/auth/**` 和现有测试；不要修改文件。输出当前结构、重复点、预计修改文件、分阶段执行计划、回归测试命令、风险点和需要用户确认的问题。未确认前不得执行代码改动。
```
