# Documentation Analysis

## 1. Purpose
用于从文档中提取结构、事实、行动项、决策和不确定内容。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求总结文档
- 用户要求整理会议记录或项目资料
- 用户要求多文档归纳

## 3. Required Inputs
- {{document_paths}} 文档路径
- {{reading_scope}} 阅读范围
- {{analysis_focus}} 分析重点
- {{audience}} 读者

缺失信息处理：
- 范围未知时先读目录、标题和任务相关章节
- 来源冲突时逐项标注
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 建立文档索引
- 按主题归纳而非机械摘要
- 区分事实、推断、不确定内容
- 提取行动项、负责人和截止时间
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止编造未提供内容
- 禁止无来源地合并冲突观点
- 禁止把文档分析写成泛泛心得
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 文档索引
- 主题归纳
- 关键事实
- 行动项
- 冲突与不确定
- 建议

## 7. Quality Checklist
- [ ] 文档范围明确
- [ ] 事实和推断分开
- [ ] 行动项可执行
- [ ] 不确定内容已标注
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 按章节复述 | 用户难用 | 按主题和问题重组 |
| 不标冲突 | 结论误导 | 列来源差异 |
| 漏行动项 | 无法落地 | 抽取 owner/date/next step |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Documentation Analysis 任务。

任务目标：
{{task_goal}}

输入材料：
- {{document_paths}}
- {{reading_scope}}
- {{analysis_focus}}
- {{audience}}
- {{citation_style}}
- {{input_materials}}

执行要求：
1. 建立文档索引
2. 按主题归纳而非机械摘要
3. 区分事实、推断、不确定内容
4. 提取行动项、负责人和截止时间

硬性约束：
- 禁止编造未提供内容
- 禁止无来源地合并冲突观点
- 禁止把文档分析写成泛泛心得
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
帮我写 prompt，总结这一批项目文档。
```

高质量 prompt：

```text
请分析 `docs/project/*.md`，先建立文档索引和主题列表；再按需求、架构、风险、待办、决策归纳内容。事实必须注明来源文件或标题；推断和不确定内容单列。输出项目资料报告、行动项表和需要确认的问题。不要做逐章流水摘要。
```
