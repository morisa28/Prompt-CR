# UX UI Design

## 1. Purpose
用于把用户目标、信息架构和视觉要求转化为可执行设计说明。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求 UI/UX 设计
- 用户要求优化交互流程
- 用户要求组件规范或设计稿说明

## 3. Required Inputs
- {{target_users}} 目标用户
- {{user_tasks}} 用户任务
- {{screens}} 页面
- {{style_constraints}} 视觉约束
- {{platform}} 平台

缺失信息处理：
- 视觉风格未知时沿用现有设计系统
- 没有截图时要求先描述页面结构和关键路径
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确信息架构
- 设计用户流程
- 规定视觉风格和组件状态
- 加入可用性检查
- 输出交互和空/错/加载状态
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止做纯营销式描述替代界面规范
- 禁止忽略移动端/响应式要求
- 禁止缺少状态设计
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 用户流程
- 信息架构
- 页面结构
- 组件规范
- 状态说明
- 可用性检查

## 7. Quality Checklist
- [ ] 目标用户明确
- [ ] 主路径和异常路径覆盖
- [ ] 组件状态完整
- [ ] 可用性标准可检查
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只讲好看 | 开发不可执行 | 写布局、组件、状态 |
| 无用户任务 | 交互失焦 | 按任务流设计 |
| 忽略错误状态 | 体验断裂 | 列 empty/error/loading |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 UX UI Design 任务。

任务目标：
{{task_goal}}

输入材料：
- {{target_users}}
- {{user_tasks}}
- {{screens}}
- {{style_constraints}}
- {{platform}}
- {{input_materials}}

执行要求：
1. 明确信息架构
2. 设计用户流程
3. 规定视觉风格和组件状态
4. 加入可用性检查
5. 输出交互和空/错/加载状态

硬性约束：
- 禁止做纯营销式描述替代界面规范
- 禁止忽略移动端/响应式要求
- 禁止缺少状态设计
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
写一个 prompt，让 AI 设计 SaaS 仪表盘 UI。
```

高质量 prompt：

```text
请为 B2B SaaS 数据仪表盘设计 UX/UI 方案。目标用户是运营经理，核心任务是查看指标、筛选时间、发现异常并导出报告。输出信息架构、主流程、页面布局、组件清单、空/错/加载状态和可用性检查。视觉风格必须克制、信息密度适中，避免营销页式 hero。
```
