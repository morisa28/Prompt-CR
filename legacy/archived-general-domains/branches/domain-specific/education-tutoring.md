# Education Tutoring

## 1. Purpose
用于按学习者水平拆解知识、讲思路、出练习和安排复习。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求学习辅导或讲题
- 用户要求复习计划
- 用户要求知识点拆解

## 3. Required Inputs
- {{learner_level}} 学习者水平
- {{topic_or_problem}} 题目或知识点
- {{goal}} 学习目标
- {{time_available}} 时间
- {{constraints}} 限制

缺失信息处理：
- 水平未知时先用诊断问题或从题目难度假设
- 考试信息未知时按通用掌握目标
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 判断学习者水平
- 拆解知识点
- 先讲思路再给答案
- 提供练习题和反馈标准
- 设计复习计划
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止只给结论
- 禁止跳过关键步骤
- 禁止用超过学习者水平的术语不解释
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 水平判断
- 知识点拆解
- 解题思路
- 答案
- 练习
- 复习计划

## 7. Quality Checklist
- [ ] 先思路后答案
- [ ] 难度匹配
- [ ] 有练习和反馈
- [ ] 复习安排可执行
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只给答案 | 学不会 | 加入思路和迁移练习 |
| 难度不匹配 | 理解断层 | 先判断水平 |
| 无复盘 | 短期记忆 | 给错题和间隔复习 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Education Tutoring 任务。

任务目标：
{{task_goal}}

输入材料：
- {{learner_level}}
- {{topic_or_problem}}
- {{goal}}
- {{time_available}}
- {{practice_count}}
- {{input_materials}}

执行要求：
1. 判断学习者水平
2. 拆解知识点
3. 先讲思路再给答案
4. 提供练习题和反馈标准
5. 设计复习计划

硬性约束：
- 禁止只给结论
- 禁止跳过关键步骤
- 禁止用超过学习者水平的术语不解释
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
帮我写 prompt，让 AI 讲一道数学题。
```

高质量 prompt：

```text
请以高中生能理解的方式讲解 `[problem]`。先判断题型和所需知识点；再给解题思路，不要先直接给答案；然后逐步推导，并在最后给 3 道同类练习和常见错误提醒。如果题目信息不足，先指出缺失条件。
```
