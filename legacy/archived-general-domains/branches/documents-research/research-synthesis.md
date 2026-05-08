# Research Synthesis

## 1. Purpose
用于围绕研究问题综合多来源证据并形成可追溯结论。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求综合多来源研究
- 用户要求论文比较或研究报告
- 用户要求观点对比

## 3. Required Inputs
- {{research_question}} 研究问题
- {{sources}} 来源列表
- {{scope}} 范围
- {{citation_requirements}} 引用要求

缺失信息处理：
- 来源不足时标注限制并建议补源
- 最新信息可能变化时要求查证日期和来源
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确研究问题
- 比较不同观点
- 标注证据
- 区分结论、证据、推测和不确定性
- 说明来源质量
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止编造引用
- 禁止把单一来源当共识
- 禁止省略反方证据
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 研究问题
- 来源表
- 观点矩阵
- 证据摘要
- 综合结论
- 限制和下一步

## 7. Quality Checklist
- [ ] 每个结论有证据
- [ ] 不同观点被比较
- [ ] 引用格式明确
- [ ] 不确定性已标注
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只堆摘要 | 没有综合 | 用观点矩阵和结论链 |
| 无引用 | 不可验证 | 给来源或页码 |
| 忽略冲突 | 结论偏 | 列冲突证据 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Research Synthesis 任务。

任务目标：
{{task_goal}}

输入材料：
- {{research_question}}
- {{sources}}
- {{scope}}
- {{citation_requirements}}
- {{output_format}}
- {{input_materials}}

执行要求：
1. 明确研究问题
2. 比较不同观点
3. 标注证据
4. 区分结论、证据、推测和不确定性
5. 说明来源质量

硬性约束：
- 禁止编造引用
- 禁止把单一来源当共识
- 禁止省略反方证据
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
帮我写 prompt，综合 5 篇论文关于 RAG 评估的观点。
```

高质量 prompt：

```text
请围绕“RAG 系统应如何评估答案质量和检索质量”综合 `[5 篇论文路径/链接]`。先列来源表；再比较指标、实验设置、优缺点和适用场景；结论必须绑定论文证据，推测单列。输出观点矩阵、综合结论、分歧点、研究缺口和引用列表。禁止编造论文不存在的实验结果。
```
