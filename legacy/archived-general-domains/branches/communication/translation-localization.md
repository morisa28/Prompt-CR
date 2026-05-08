# Translation Localization

## 1. Purpose
用于保留原意、术语和文化语境，并输出多风格版本或对照稿。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求翻译/本地化
- 用户要求润色或语气改写
- 用户要求双语对照

## 3. Required Inputs
- {{source_text}} 原文
- {{target_language}} 目标语言
- {{audience}} 受众
- {{tone}} 语气
- {{terminology}} 术语表

缺失信息处理：
- 目标语言未知时先询问或输出待补充
- 术语未知时保留原文并标注
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确目标语言和受众
- 保留专业术语
- 调整文化语境
- 输出多个风格版本
- 标注无法直译表达
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止改变事实含义
- 禁止删除关键限定词
- 禁止把本地化改成自由创作，除非用户要求
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 译文
- 术语表
- 无法直译说明
- 风格版本
- 修改理由

## 7. Quality Checklist
- [ ] 原意保留
- [ ] 术语一致
- [ ] 受众和语气匹配
- [ ] 文化改写有说明
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 逐字直译 | 不自然 | 按语境本地化 |
| 术语不一致 | 专业性差 | 使用术语表 |
| 润色改意思 | 失真 | 保留事实和限定 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Translation Localization 任务。

任务目标：
{{task_goal}}

输入材料：
- {{source_text}}
- {{target_language}}
- {{audience}}
- {{tone}}
- {{terminology}}
- {{input_materials}}

执行要求：
1. 明确目标语言和受众
2. 保留专业术语
3. 调整文化语境
4. 输出多个风格版本
5. 标注无法直译表达

硬性约束：
- 禁止改变事实含义
- 禁止删除关键限定词
- 禁止把本地化改成自由创作，除非用户要求
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
把这段产品介绍翻译成英文并更适合美国用户。
```

高质量 prompt：

```text
请将 `[source_text]` 翻译并本地化为美式英语，受众是 `[audience]`。保留产品事实、数字和专业术语；不直译中文营销套话，改成自然英文表达。输出标准版、简洁版和更有销售感的版本，并列出无法直译或已本地化处理的表达。
```
