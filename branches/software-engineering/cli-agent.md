# CLI Agent

## 1. Purpose

用于适配命令行 agent 的工作目录、权限、命令顺序、联网和文件修改范围。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions

- 用户目标是 Codex CLI、Gemini CLI、Claude Code
- 用户要求写命令行智能体任务说明
- 任务需要明确可执行命令和禁止操作

## 3. Required Inputs

- {{cli_tool}} CLI 工具
- {{working_directory}} 工作目录
- {{allowed_commands}} 可执行命令
- {{forbidden_actions}} 禁止操作
- {{network_policy}} 联网规则

缺失信息处理：

- 未说明权限时默认不联网、不安装依赖、不执行破坏性命令
- 命令未知时要求先读取项目配置再选择
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules

- 写明工作目录和执行顺序
- 列出可执行命令与需要确认的命令
- 写明文件修改范围
- 最终报告必须包含命令结果
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints

- 禁止破坏性命令，除非用户明确授权
- 禁止私自安装依赖或联网
- 禁止忽略命令失败
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- 任务说明
- 命令计划
- 权限边界
- 失败处理
- 最终报告格式

## 7. Quality Checklist

- [ ] CLI 名称明确
- [ ] 工作目录明确
- [ ] 权限边界明确
- [ ] 命令失败处理明确
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes

| Common Mistake   | Risk               | Repair               |
| ---------------- | ------------------ | -------------------- |
| 不给工作目录     | agent 跑错路径     | 第一行写目录         |
| 未定义权限       | 可能联网或安装依赖 | 列 allowed/forbidden |
| 只写目标不写命令 | CLI 执行不稳定     | 给命令顺序和失败处理 |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请处理以下 CLI Agent 任务。

任务目标：
{{task_goal}}

输入材料：
- {{cli_tool}}
- {{working_directory}}
- {{allowed_commands}}
- {{forbidden_actions}}
- {{network_policy}}
- {{final_report_format}}
- {{input_materials}}

执行要求：
1. 写明工作目录和执行顺序
2. 列出可执行命令与需要确认的命令
3. 写明文件修改范围
4. 最终报告必须包含命令结果

硬性约束：
- 禁止破坏性命令，除非用户明确授权
- 禁止私自安装依赖或联网
- 禁止忽略命令失败
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
给 Gemini CLI 写一个修 bug 的 prompt。
```

高质量 prompt：

```text
你是 Gemini CLI，请在 `/repo/app` 修复 `[bug]`。允许命令：`rg`、读取文件、`npm test`；未经确认禁止联网、安装依赖、删除文件或运行破坏性 git 命令。先读取日志和相关源码，定位根因后做最小修复。若命令失败，记录完整错误并调整方案。最终报告修改文件、执行命令、验证结果和需要人工确认的问题。
```
