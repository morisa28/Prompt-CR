# CodePrompt Coach Router

本路由器只处理软件工程与计算机科学 MVP 场景。它的目标不是把用户需求路由到泛领域 prompt 分支，而是把模糊开发需求转化为可澄清、可评分、可生成、可验证、可写入错题本的 coding agent prompt 流程。

## 1. Routing Goal

路由输出必须回答：

- 用户最终想完成哪类代码生成任务。
- 哪个软件工程场景定义任务完成标准。
- 还缺哪些工作目录、文件、日志、约束和验证信息。
- 原始 prompt 是否适合直接交给 coding agent。
- 应使用哪个 adapter 和哪些评分/模板/lesson 资源。

## 2. Multi-Layer Routing Process

1. 判断用户是否在请求 coding agent prompt、代码生成、代码修改、代码审查、仓库理解或测试相关任务。
2. 选择唯一主场景，主场景由最终交付物决定。
3. 用 Level 0 到 Level 4 的问题树收集需求。
4. 将缺失信息分成可假设、待补充、必须追问和阻塞。
5. 对原始 prompt 和结构化需求评分。
6. 生成目标工具 prompt，并做生成后评分。
7. 将低分维度写入 PromptMistake / lessons。

## 3. Primary Scenario Selection

| 用户最终想得到的交付物                           | 主场景                      | 资源                                                          |
| ------------------------------------------------ | --------------------------- | ------------------------------------------------------------- |
| 新功能、页面、组件、接口或交互逻辑               | `feature-development`       | `branches/software-engineering/coding-feature-development.md` |
| 修复报错、构建失败、测试失败、页面白屏、CLI 错误 | `bugfix-debugging`          | `branches/software-engineering/bugfix-debugging.md`           |
| 保持行为不变的结构整理、模块拆分、架构改造       | `refactor-architecture`     | `branches/software-engineering/refactor-architecture.md`      |
| 单元、集成、E2E、回归测试或覆盖率补强            | `test-generation`           | `branches/software-engineering/test-generation.md`            |
| PR/diff/文件审查，输出 findings                  | `code-review`               | `branches/software-engineering/code-review.md`                |
| 只读理解仓库结构、技术栈、入口和风险             | `repository-analysis`       | `branches/software-engineering/repository-analysis.md`        |
| REST、GraphQL、gRPC、OpenAPI、接口契约           | `api-design`                | `branches/software-engineering/api-design.md`                 |
| schema/data migration、备份、回滚、staging 验证  | `database-migration`        | `branches/software-engineering/database-migration.md`         |
| CI/CD、构建、部署、runner、secrets、回滚         | `devops-ci`                 | `branches/software-engineering/devops-ci.md`                  |
| 算法题、复杂度、边界用例、数据结构               | `algorithm-problem-solving` | `src/domain/question-tree.ts`                                 |
| 前端页面、组件状态、响应式、可访问性             | `frontend-implementation`   | `branches/software-engineering/coding-feature-development.md` |
| 后端接口、业务规则、鉴权、校验、数据读写         | `backend-implementation`    | `branches/software-engineering/coding-feature-development.md` |

## 3.1 Retained Branch File Index

- `branches/software-engineering/algorithm-problem-solving.md`
- `branches/software-engineering/api-design.md`
- `branches/software-engineering/bugfix-debugging.md`
- `branches/software-engineering/cli-agent.md`
- `branches/software-engineering/code-review.md`
- `branches/software-engineering/coding-feature-development.md`
- `branches/software-engineering/database-migration.md`
- `branches/software-engineering/devops-ci.md`
- `branches/software-engineering/plan-mode.md`
- `branches/software-engineering/refactor-architecture.md`
- `branches/software-engineering/repository-analysis.md`
- `branches/software-engineering/security-threat-modeling.md`
- `branches/software-engineering/test-generation.md`

## 4. Target Tool Adapter Selection

| 目标工具           | Adapter                  |
| ------------------ | ------------------------ |
| Codex              | `@adapter://codex`       |
| Codex CLI          | `@adapter://codex-cli`   |
| Claude Code        | `@adapter://claude-code` |
| Gemini CLI         | `@adapter://gemini-cli`  |
| ChatGPT            | `@adapter://chatgpt`     |
| 未说明但需要改仓库 | 默认 `@adapter://codex`  |

## 5. Level-Based Clarification

- Level 0：任务类型识别，判断主场景。
- Level 1：目标与交付物，明确最终结果和成功定义。
- Level 2：项目上下文，收集工作目录、技术栈、相关文件、日志、命令。
- Level 3：约束与边界，确认允许修改范围、禁止事项、依赖和兼容要求。
- Level 4：验证方式，确认测试命令、手动验收、失败报告和最终输出格式。

问题树实现见 `src/domain/question-tree.ts`。

## 6. Missing Input Handling

| 类型       | 处理方式                    | 例子                              |
| ---------- | --------------------------- | --------------------------------- |
| 可合理假设 | 写入假设并要求 agent 验证   | 未说明测试命令时从配置识别        |
| 待补充     | 使用 `[待补充: field]` 占位 | 工作目录、相关文件                |
| 必须追问   | 先问用户再生成最终 prompt   | 生产数据库备份状态                |
| 阻塞       | 不能生成可执行修复 prompt   | bugfix 完全没有错误日志或复现信号 |

## 7. Resource Selection

常用资源：

- Branch：`@branch://software-engineering/bugfix-debugging` 等。
- Template：`@template://codeprompt-coach/coding-agent-task`。
- Checklist：`@checklist://codeprompt-coach/final-review`。
- Eval：`@eval://software-engineering/bugfix-debugging/basic` 等。
- Adapter：`@adapter://codex`、`@adapter://codex-cli` 等。
- Lesson：`@lesson://prompt-failures/bugfix-missing-verification` 等。

非软件工程旧资源只可作为归档参考，不进入 MVP 路由。

## 8. Standard Routing Output

```text
需求摘要：
主场景：
目标工具：
当前得分：
缺失信息：
阻塞问题：
建议追问：
使用资源：
生成策略：
是否可直接交给 coding agent：
```

## 9. Prompt Construction Strategy

最终 prompt 必须组合：

- 主场景的目标、输入、步骤、硬约束和验收标准；
- 目标工具 adapter 的执行方式；
- 评分器发现的缺失信息；
- 最小修改、禁止无关重构、验证命令和失败报告规则；
- 最终报告格式；
- 自检要求。

## 10. Examples

### Example 1. Bugfix

- 用户原始需求：帮我写 prompt，让 Codex 修复 npm run build 报错。
- 主场景：`bugfix-debugging`
- 缺失信息：工作目录、完整错误日志、失败命令、相关文件、验证命令。
- 生成策略：先要求读取配置和日志，复现失败，定位根因，最小修复，运行原失败命令和相关测试，报告验证结果。

### Example 2. Feature

- 用户原始需求：帮我做一个课程收藏功能。
- 主场景：`feature-development`
- 缺失信息：用户流程、技术栈、相关页面/API、验收标准、非目标。
- 生成策略：先澄清用户可见行为，再限定修改范围和验证方式。

### Example 3. Code Review

- 用户原始需求：帮我 review 这次 PR。
- 主场景：`code-review`
- 缺失信息：diff 或文件范围、关注点、严重程度标准。
- 生成策略：findings 优先，按严重程度排序，必须给文件位置、影响和修复建议。
