# Prompt Expansion

## 1. Purpose
用于把一句话需求扩展为复杂任务前可直接交给 AI 的完整说明。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户说“写详细一点”
- 用户提供短 prompt 并要求增强执行力
- 任务复杂但原 prompt 只有目标，没有上下文和验收

## 3. Required Inputs
- {{short_prompt}} 短 prompt
- {{target_ai_tool}} 目标工具
- {{task_scope}} 范围
- {{known_context}} 已知背景

缺失信息处理：
- 范围未知时用最小安全范围
- 验证命令未知时要求目标 agent 先读取项目配置再选择
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 扩展目标、背景、输入、执行阶段、限制条件、输出格式、验收标准、风险控制
- 默认假设必须集中列出
- 保持原意，不把扩展变成重写需求
- 复杂任务必须拆成读取、分析、方案、执行、验证、报告
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止改变用户原始目标
- 禁止省略验收标准
- 禁止用空泛形容词替代具体步骤
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 扩展后的完整 prompt
- 新增模块说明
- 默认假设
- 待补充字段

## 7. Quality Checklist
- [ ] 扩展内容均服务原目标
- [ ] 每个阶段有产物
- [ ] 约束可执行
- [ ] 验收标准可判断是/否
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 扩成百科教程 | token 增加但执行力不变 | 只扩任务相关模块 |
| 无默认假设 | 模型误以为事实已给定 | 单列假设 |
| 缺验证 | 无法判断完成 | 加入命令、检查或人工验收 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Prompt Expansion 任务。

任务目标：
{{task_goal}}

输入材料：
- {{short_prompt}}
- {{target_ai_tool}}
- {{known_context}}
- {{task_scope}}
- {{acceptance_criteria}}
- {{input_materials}}

执行要求：
1. 扩展目标、背景、输入、执行阶段、限制条件、输出格式、验收标准、风险控制
2. 默认假设必须集中列出
3. 保持原意，不把扩展变成重写需求
4. 复杂任务必须拆成读取、分析、方案、执行、验证、报告

硬性约束：
- 禁止改变用户原始目标
- 禁止省略验收标准
- 禁止用空泛形容词替代具体步骤
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
把 `帮我分析这个 repo` 扩展成强 prompt。
```

高质量 prompt：

```text
你是 Codex，请在 `[待补充: repo_path]` 分析整个仓库。先读取 README、依赖配置、入口文件和测试配置；建立目录结构和技术栈判断；识别核心模块、数据流、运行命令和风险点；不要修改文件。输出项目概览、目录说明、关键模块表、运行/测试命令、可疑风险、后续可执行任务建议。若 README 或配置缺失，标注缺口并用文件证据支撑推断。
```
