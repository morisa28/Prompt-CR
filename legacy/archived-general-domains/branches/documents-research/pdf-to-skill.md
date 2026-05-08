# PDF to Skill

## 1. Purpose
用于深度读取 PDF，并把知识转化为规则、模板、检查表和示例。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求 PDF 转 skill
- 用户要求从书籍/论文提炼方法并固化
- 用户说不要普通摘要而要可复用工作流

## 3. Required Inputs
- {{pdf_path}} PDF 路径
- {{reading_scope}} 阅读范围
- {{skill_target}} 目标 skill
- {{extraction_rules}} 提取规则

缺失信息处理：
- PDF 很长时先目录扫描再重点章节深读
- 目标 skill 未定时先提出 skill 名、触发场景和目录结构
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 多轮阅读：结构、方法、案例、规则转化
- 不做普通摘要
- 不大段复制 PDF
- 理论转行为规则，案例转模板，注意事项转 checklist
- 最终生成可复用 skill 文件
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止复制长段原文
- 禁止把 PDF 未支持的观点写成确定规则
- 必须包含触发、不适用、流程、模板、检查表、示例
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- PDF 结构
- 抽取方法
- skill 目录
- 生成文件
- 模板和检查表
- 模拟验证

## 7. Quality Checklist
- [ ] 阅读范围有依据
- [ ] 规则可执行
- [ ] 模板可复制
- [ ] 示例覆盖真实调用
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只总结章节 | 不能作为 skill | 转换成行为规则 |
| 复制原文 | 版权和可维护性风险 | 用转述和结构化规则 |
| 没有模拟测试 | 触发条件不清 | 至少三条调用样例 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 PDF to Skill 任务。

任务目标：
{{task_goal}}

输入材料：
- {{pdf_path}}
- {{reading_scope}}
- {{skill_target}}
- {{extraction_rules}}
- {{output_skill_path}}
- {{input_materials}}

执行要求：
1. 多轮阅读：结构、方法、案例、规则转化
2. 不做普通摘要
3. 不大段复制 PDF
4. 理论转行为规则，案例转模板，注意事项转 checklist
5. 最终生成可复用 skill 文件

硬性约束：
- 禁止复制长段原文
- 禁止把 PDF 未支持的观点写成确定规则
- 必须包含触发、不适用、流程、模板、检查表、示例
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
读取这本 PDF，把方法提炼成 skill。
```

高质量 prompt：

```text
请读取 `[pdf_path]`，目标是创建或扩展 `[skill_target]`。先扫描目录和章节，选择与方法论、流程、案例、反例、注意事项相关的章节；再把概念转成可执行规则，把案例转成模板，把注意事项转成 checklist。禁止大段复制原文，不做普通摘要。最终输出 `SKILL.md`、必要的 `templates.md`、`checklists.md`、`examples.md`，并用 3 个调用场景验证。
```
