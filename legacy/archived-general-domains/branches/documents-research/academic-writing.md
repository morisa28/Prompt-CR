# Academic Writing

## 1. Purpose
用于把学术写作任务拆成论题、证据、结构、引用和风格要求。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求写论文或文献综述
- 用户要求研究计划、学术报告
- 用户有课程作业写作要求

## 3. Required Inputs
- {{topic}} 主题
- {{academic_requirements}} 学术要求
- {{sources}} 资料
- {{citation_style}} 引用格式
- {{word_count}} 字数

缺失信息处理：
- 资料不足时生成提纲和待补充文献清单
- 引用格式未知时询问或使用用户学校要求
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确学术要求和论证问题
- 保持论证结构
- 引用必须来自用户资料或可验证来源
- 标注需要补充的资料
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止编造引用
- 禁止代写成无法说明来源的最终稿
- 禁止把观点写成事实而无证据
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 题目/论点
- 大纲
- 论证段落计划
- 引用计划
- 草稿或修改建议
- 待补充资料

## 7. Quality Checklist
- [ ] 论点清晰
- [ ] 每段有证据目标
- [ ] 引用格式明确
- [ ] 资料缺口已标注
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 先写全文再找证据 | 引用虚假 | 先证据和提纲 |
| 语言过口语 | 不符合学术场景 | 设定读者和风格 |
| 忽略课程要求 | 跑题 | 逐条绑定 rubric |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Academic Writing 任务。

任务目标：
{{task_goal}}

输入材料：
- {{topic}}
- {{academic_requirements}}
- {{sources}}
- {{citation_style}}
- {{word_count}}
- {{input_materials}}

执行要求：
1. 明确学术要求和论证问题
2. 保持论证结构
3. 引用必须来自用户资料或可验证来源
4. 标注需要补充的资料

硬性约束：
- 禁止编造引用
- 禁止代写成无法说明来源的最终稿
- 禁止把观点写成事实而无证据
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
写一个 prompt 帮我做一篇文献综述。
```

高质量 prompt：

```text
请基于 `[sources]` 撰写关于 `[topic]` 的文献综述提纲和初稿。先提取每篇文献的研究问题、方法、结论和限制；再按主题组织而非逐篇堆叠。引用格式使用 APA 7。禁止编造未提供文献和页码；资料不足处用 `[需补充文献]` 标注。输出大纲、主题矩阵、初稿和引用清单。
```
