# Refactor Architecture

## 1. Purpose

用于在保持外部行为不变的前提下整理代码结构或架构边界。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions

- 用户要求重构
- 用户要求模块拆分或降低耦合
- 用户要求提升可维护性但不改变功能

## 3. Required Inputs

- {{working_directory}} 工作目录
- {{refactor_goal}} 重构目标
- {{behavior_to_preserve}} 必须保持行为
- {{allowed_scope}} 允许范围
- {{regression_tests}} 回归测试

缺失信息处理：

- 行为边界不明时先列公开 API、路由、UI 和数据格式作为保护对象
- 测试缺失时要求生成最小回归验证
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules

- 保持现有行为不变
- 按阶段重构，每阶段可验证
- 先识别风险文件和依赖关系
- 必要时给回滚方案
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints

- 禁止同时引入新功能
- 禁止改变公开接口，除非用户明确要求
- 禁止大范围格式化掩盖逻辑改动
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- 范围表
- 重构计划
- 改动说明
- 行为保持证明
- 回归测试结果
- 风险

## 7. Quality Checklist

- [ ] 行为保持项明确
- [ ] 每个阶段可回归
- [ ] 无新功能混入
- [ ] 风险和回滚路径清楚
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes

| Common Mistake | Risk         | Repair             |
| -------------- | ------------ | ------------------ |
| 重构中改功能   | 验收失真     | 把功能变化列为禁止 |
| 一次改太大     | 难回滚       | 分阶段并验证       |
| 缺行为保护     | 破坏用户流程 | 列必须保持行为     |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请处理以下 Refactor Architecture 任务。

任务目标：
{{task_goal}}

输入材料：
- {{working_directory}}
- {{refactor_goal}}
- {{behavior_to_preserve}}
- {{allowed_scope}}
- {{regression_tests}}
- {{input_materials}}

执行要求：
1. 保持现有行为不变
2. 按阶段重构，每阶段可验证
3. 先识别风险文件和依赖关系
4. 必要时给回滚方案

硬性约束：
- 禁止同时引入新功能
- 禁止改变公开接口，除非用户明确要求
- 禁止大范围格式化掩盖逻辑改动
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
帮我写 Codex prompt，把 auth 逻辑重构一下。
```

高质量 prompt：

```text
你是 Codex，请在 `/repo/api` 重构认证逻辑，目标是移除重复 token 解析并保持所有响应码和公开 API 不变。先读取认证中间件、路由和测试；列出重复点和风险文件；按最小阶段实施，不引入新功能。禁止修改数据库 schema 和无关路由。完成后运行认证相关测试和 `npm test`，最终输出行为保持证明、修改文件和剩余风险。
```
