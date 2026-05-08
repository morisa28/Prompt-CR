# Prompt Rewrite

## 1. Purpose
用于把用户的一句话需求、闲散说明或半成品 prompt 改写为结构完整的执行指令。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户说“改成 Codex/Claude/Gemini 能执行的 prompt”
- 用户要求把口语化需求变成正式 prompt
- 用户给出模糊需求但希望交给 AI 处理

## 3. Required Inputs
- {{raw_request}} 原始需求
- {{target_ai_tool}} 目标工具
- {{task_domain}} 任务领域
- {{must_keep}} 必须保留的意图或限制

缺失信息处理：
- 目标工具未知时输出通用版，并标注可按工具再适配
- 工作目录未知时使用 `[待补充: working_directory]`
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 把模糊动词改成可观察动作
- 补齐背景、输入、步骤、约束、输出格式、验收标准
- 缺失但不阻塞的信息用待补充标记
- 阻塞安全执行的信息必须作为问题列出
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止过度扩写无关目标
- 禁止删除用户限制
- 禁止把一次性任务改成多阶段大工程，除非原需求需要
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 改写后的 prompt fenced code block
- 缺失信息清单
- 默认假设
- 可选增强项

## 7. Quality Checklist
- [ ] 原始意图完整保留
- [ ] 执行步骤有顺序
- [ ] 硬约束和禁止事项明确
- [ ] 目标工具差异已适配
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 把需求美化成文案 | 不能执行 | 改成任务、输入、步骤和验收 |
| 补太多新目标 | 范围失控 | 只补执行必需上下文 |
| 忽略工具差异 | Codex/ChatGPT 执行方式混乱 | 按目标工具重写工作目录、命令和输出 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Prompt Rewrite 任务。

任务目标：
{{task_goal}}

输入材料：
- {{raw_request}}
- {{target_ai_tool}}
- {{task_domain}}
- {{constraints}}
- {{output_format}}
- {{input_materials}}

执行要求：
1. 把模糊动词改成可观察动作
2. 补齐背景、输入、步骤、约束、输出格式、验收标准
3. 缺失但不阻塞的信息用待补充标记
4. 阻塞安全执行的信息必须作为问题列出

硬性约束：
- 禁止过度扩写无关目标
- 禁止删除用户限制
- 禁止把一次性任务改成多阶段大工程，除非原需求需要
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
把这句话改成 Codex 可以直接执行的 prompt：我的项目 npm run dev 报错了，帮我修。
```

高质量 prompt：

```text
你是 Codex，请在 `[待补充: working_directory]` 中修复 `npm run dev` 报错。先读取 `package.json`、构建配置和报错栈指向的文件；再根据完整日志定位根因；只修改必要文件，禁止无关重构和新增依赖；修复后运行 `npm run dev` 或可替代的构建验证，并在最终报告中输出根因、修改文件、验证结果和剩余风险。若缺少完整日志，先要求用户补充终端输出。
```
