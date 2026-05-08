# Meta Skill Builder

## 1. Purpose

用于设计、审计和改进 AI skill、Prompt 系统、路由系统、模板库、检查表、示例、评测样例和结构化 manifest。适用于把流程、知识、仓库或文档转化为可复用 Skill Hub。

不用于普通摘要、单个 prompt 小改、无执行规则的教程或把项目转成通用 benchmark/CLI 工具。

## 2. Trigger Conditions

明确命中：
- 用户要求创建或改进 skill、prompt hub、router、branch、template、checklist、eval、manifest。
- 用户要求审计 prompt 系统并提出结构改进。
- 用户要求把文档/流程固化为可复用 AI agent 工作流。

可能命中：
- PDF 转 skill、工作流自动化、提示词库升级。
- 用户要求为 Codex、Claude Code、Gemini CLI 设计可复用指令体系。

不应命中：
- 用户只要求改写一个 prompt，使用 `prompt-rewrite` 或 `prompt-review`。
- 用户只要普通教程或知识笔记。

相似分支区别：
- `prompt-template-builder` 聚焦单类模板，本分支聚焦系统结构。
- `pdf-to-skill` 从 PDF 提炼，本分支定义 skill 结构和维护规则。

## 3. Required Inputs

必需输入：
- `{{source_materials}}` 来源材料或项目路径。
- `{{skill_name}}` skill 名称。
- `{{target_users}}` 使用者。
- `{{use_cases}}` 使用场景。
- `{{routing_goals}}` 路由目标。
- `{{quality_standards}}` 质量标准。
- `{{maintenance_rules}}` 维护规则。

可选输入：
- `{{existing_structure}}` 现有目录。
- `{{focus_gaps}}` 要补的缺口。
- `{{eval_requirements}}` 评测要求。
- `{{manifest_requirements}}` 元数据要求。
- `{{output_path}}` 输出路径。

缺失时处理：
- skill 名未知：提出短横线命名候选。
- 材料不足：先输出骨架和待补充清单，不编造领域规则。
- 路由目标缺失：用最终交付物、工具适配、风险边界、输出形式四类路由维度。
- eval 要求缺失：至少给正常输入、缺失输入、风险/误用输入三类样例。

## 4. Prompt Construction Rules

- 审计先行：要求先读入口、路由、原则、模板、检查表、示例、分支和脚本。
- 路由设计：定义主分支、辅助分支、冲突处理、高风险优先级和标准路由输出。
- 分支设计：每个分支包含 Purpose、Trigger、Inputs、Construction、Constraints、Output、Checklist、Mistakes、Template、Example。
- 模板设计：模板必须可复制，包含变量、适用/不适用、输出格式和检查点。
- 评测设计：eval case 验证 prompt 生成质量，必须包含 expected 和 forbidden。
- Manifest 设计：轻量机器可读索引，不替代 Markdown。
- 改动原则：保留有效内容，增强深度，避免无关工程化。

## 5. Hard Constraints

- 不得只写抽象建议而不产出结构化文件或 prompt。
- 不得把 skill 写成普通知识笔记或教程。
- 不得删除有效内容，除非重复、冲突或低质量。
- 不得缺少路由、模板、检查表、示例或评测。
- 不得复制来源长文。
- 不得把高风险领域边界弱化。

## 6. Output Format

最终 prompt 应要求目标模型输出：

```text
审计摘要：
目标结构：
路由设计：
分支设计：
模板设计：
检查表：
示例：
eval cases：
manifest：
修改计划：
自检结果：
```

## 7. Quality Checklist

- [ ] 是否先审计再修改？
- [ ] 是否识别路由缺口、模板缺口、checklist 缺口和 eval 缺口？
- [ ] 是否定义主分支和辅助分支组合规则？
- [ ] 是否包含高风险领域边界？
- [ ] 是否输出可复制模板和可判断检查表？
- [ ] 是否设计 eval case 且包含 expected/forbidden？
- [ ] 是否设计 manifest 且保持轻量？
- [ ] 是否保留原项目定位和有效内容？

## 8. Common Mistakes

| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 写成教程 | 不能被 agent 稳定调用 | 加触发条件、流程、模板和检查表 |
| 只补目录不补质量标准 | Prompt 仍不可验证 | 定义验收标准、eval 和自检 |
| 只按关键词路由 | 主分支容易错 | 按最终交付物选择主分支 |
| manifest 过度复杂 | 难维护 | 保持索引字段轻量 |

## 9. Reusable Template

```text
你是 Prompt Engineering 架构师，请审计并改进以下 Prompt Skill Hub。

项目/材料：{{source_materials}}
skill 名称：{{skill_name}}
目标用户：{{target_users}}
使用场景：{{use_cases}}
路由目标：{{routing_goals}}
质量标准：{{quality_standards}}
维护规则：{{maintenance_rules}}
eval 要求：{{eval_requirements}}
manifest 要求：{{manifest_requirements}}

执行要求：
1. 先审计入口、路由、通用原则、模板、检查表、示例、分支和脚本，不要先改。
2. 识别内容完整性、分支深度、路由准确性、多分支组合、Prompt 质量、eval、manifest 和高风险边界缺口。
3. 增强路由、模板、检查表、示例和重点分支。
4. 新增 eval case，验证生成 prompt 的质量，而不是验证模型最终任务结果。
5. 新增轻量 manifest，索引分支、路径、触发、输入、兼容辅助分支和 eval cases。
6. 完成后自检路径引用、重复冲突、高风险边界和入口文档引用。

输出格式：
审计摘要、修改计划、文件改动、重点能力提升、自检结果、后续建议。
```

## 10. Example

用户原始需求：

```text
审计我的 prompt-engineering skill hub，补路由、重点分支、eval 和 manifest。
```

路由判断：
- 主分支：`meta/meta-skill-builder`
- 辅助分支：`general-prompt/prompt-review`, `general-prompt/prompt-template-builder`
- 风险等级：Medium

高质量 prompt：

```text
你是 Prompt Engineering 架构师，请审计并改进 `/repo/prompt-engineering`。先只读审计 `SKILL.md`、`router.md`、`common-principles.md`、`templates.md`、`checklists.md`、`examples.md`、`branches/` 和维护脚本；输出结构、强项、缺口和修改计划。随后增强路由为按最终交付物选择主分支，补辅助分支组合、冲突处理和标准路由输出；深化重点分支；新增 eval cases 和轻量 manifest；更新入口文档引用。保留有效内容，不做无关工程化，不弱化高风险边界。完成后运行可用验证并报告修改文件、自检结果和后续建议。
```

质量检查结果：
- [x] 先审计再改。
- [x] 覆盖路由、分支、模板、eval、manifest。
- [x] 有高风险边界。
- [x] 有自检和报告。
