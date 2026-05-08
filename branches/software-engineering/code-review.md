# Code Review

## 1. Purpose

用于让 agent 以代码审查方式输出可定位、可修复的问题清单。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions

- 用户要求 review 代码
- 用户要求找 bug、性能问题或安全问题
- 用户给 PR/diff 要审查

## 3. Required Inputs

- {{working_directory}} 工作目录
- {{review_scope}} 审查范围
- {{diff_or_files}} diff 或文件
- {{review_focus}} 关注点

缺失信息处理：

- 未指定关注点时按正确性、回归、安全、性能、测试审查
- 没有 diff 时先读取相关文件并说明范围
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules

- 按严重程度排序
- 区分必须修复和建议
- 指向具体文件或代码位置
- 每条给可执行修复建议
- 避免空泛评价
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints

- 禁止只给总体印象
- 禁止无证据指责
- 安全项只给防御性修复，不给利用步骤
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- Findings
- Open questions
- Test gaps
- Summary

## 7. Quality Checklist

- [ ] 每条发现有位置
- [ ] 严重程度合理
- [ ] 修复建议可执行
- [ ] 测试缺口已列出
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes

| Common Mistake | Risk           | Repair                      |
| -------------- | -------------- | --------------------------- |
| 泛泛说代码不错 | 没有审查价值   | 以 findings 开头            |
| 不分严重程度   | 修复优先级混乱 | 按 Critical/High/Medium/Low |
| 缺位置         | 开发者无法修   | 引用文件和行或片段          |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请处理以下 Code Review 任务。

任务目标：
{{task_goal}}

输入材料：
- {{working_directory}}
- {{review_scope}}
- {{diff_or_files}}
- {{review_focus}}
- {{severity_scale}}
- {{input_materials}}

执行要求：
1. 按严重程度排序
2. 区分必须修复和建议
3. 指向具体文件或代码位置
4. 每条给可执行修复建议
5. 避免空泛评价

硬性约束：
- 禁止只给总体印象
- 禁止无证据指责
- 安全项只给防御性修复，不给利用步骤
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
帮我写 prompt 让 AI review 这个 PR。
```

高质量 prompt：

```text
请以代码审查方式检查 `/repo/app` 的当前 diff。重点看正确性回归、安全、性能和缺失测试。输出必须先列 Findings，按严重程度排序；每条包含文件/行、问题、影响、修复建议。没有问题时明确说未发现阻塞问题，并列剩余测试缺口。禁止只写风格建议，除非它会导致维护或行为风险。
```
