# CodePrompt Coach

**CodePrompt Coach：面向代码生成任务的分级需求澄清与 Prompt 质量优化平台。**

本项目已从泛领域 Prompt Engineering Skill Hub 收缩为一个“文档 + MVP 原型”的大创项目基础，聚焦软件工程与计算机科学场景。它不把 AI 定位为替用户猜需求的工具，而是通过分级提问、量化评分、prompt 生成、自我审查和错题本反馈，帮助学生与初级开发者把模糊开发想法转化为可交给 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 等 coding agent 执行的高质量任务 prompt。

## 项目背景

代码生成工具已经能完成大量开发辅助工作，但实际使用中，失败往往不是模型完全不会写代码，而是任务描述缺少工作目录、相关文件、错误日志、修改边界、验收标准和失败处理规则。初学者常把“帮我改一下”“做个页面”“修一下报错”直接交给 coding agent，导致 agent 猜测上下文、扩大修改范围、跳过验证或输出不可复查的结果。

CodePrompt Coach 将这个问题转化为需求工程问题：先引导用户澄清任务，再评价 prompt 质量，最后生成可执行、可验证、可复盘的 coding agent prompt。

## 项目痛点

- 模糊需求无法直接驱动稳定的代码生成。
- 用户不知道哪些信息对 coding agent 是关键上下文。
- prompt 缺少约束，容易导致无关重构、删除测试、虚构验证结果。
- prompt 缺少可检查验收标准，无法判断 agent 是否真正完成。
- 失败经验没有沉淀，下一次仍会重复缺少日志、路径、验证命令等问题。

## 核心功能

1. **分级需求澄清**：按 Level 0 到 Level 4 引导用户补齐任务类型、交付物、项目上下文、约束边界和验证方式。
2. **软件工程场景分类**：保留新功能开发、bugfix、重构、测试生成、代码审查、仓库理解、API 设计、数据库迁移、DevOps/CI、算法、前端和后端实现等 MVP 场景。
3. **Prompt 量化评分**：按 8 个维度输出 100 分评分、扣分原因、缺失关键信息和是否可交给 coding agent。
4. **Prompt 生成器**：根据结构化需求生成适配 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 的任务 prompt。
5. **生成后自审**：对生成 prompt 再评分，识别低分维度并给出修订建议。
6. **错题本机制**：将低分维度、错误类型、改进建议和是否应更新问题树/评分规则/模板写入 lesson 数据。

## 技术路线

当前 MVP 使用轻量 TypeScript 结构，不依赖外部包，Node 24 可直接运行 TypeScript strip-types 模式。

```text
用户模糊需求
  -> 分级问题树
  -> 结构化需求
  -> 初始 prompt 评分
  -> coding agent prompt 生成
  -> 生成后评分与自审
  -> PromptMistake / lessons 记录
  -> 反向优化问题树、评分规则和模板
```

## MVP 范围

保留并强化的软件工程场景：

- `feature-development` 新功能开发
- `bugfix-debugging` Bug 修复与调试
- `refactor-architecture` 代码重构
- `test-generation` 测试生成
- `code-review` 代码审查
- `repository-analysis` 仓库理解
- `api-design` API 设计
- `database-migration` 数据库迁移
- `devops-ci` DevOps / CI
- `algorithm-problem-solving` 算法与数据结构任务
- `frontend-implementation` 前端页面与交互开发
- `backend-implementation` 后端接口与业务逻辑开发

医疗、法律、金融、营销、创意、多模态、通用数据分析等旧资源已归档到 `legacy/archived-general-domains/`，不作为 MVP 核心能力。

## 使用流程

1. 用户输入原始需求，例如“帮我写一个 prompt，让 Codex 修复 npm run build 报错”。
2. 系统识别任务类型为 `bugfix-debugging`。
3. 系统按层级追问：工作目录、错误日志、复现命令、相关文件、允许修改范围、禁止事项、验证命令。
4. 系统对原始需求评分，指出缺少日志、路径、验证命令等问题。
5. 系统生成最终 coding agent prompt。
6. 系统对生成 prompt 再评分，低分项写入错题本。
7. 后续根据错题统计优化问题树、评分规则和 prompt 模板。

## 示例

原始需求：

```text
帮我让 Codex 修复 npm run build 报错，不要乱改。
```

补齐关键问题后，系统生成的 prompt 会包含：

- 工作目录和目标工具；
- 错误日志和复现步骤；
- 相关文件；
- 最小修复和禁止无关重构；
- 构建与测试命令；
- 验证失败时的报告规则；
- 最终输出格式。

完整示例见 `examples/bugfix-session.example.md`、`examples/feature-session.example.md`、`examples/test-generation-session.example.md` 和 `examples/code-review-session.example.md`。

## 评分体系

总分 100 分：

| 维度 | 分值 |
|---|---:|
| 任务目标清晰度 | 15 |
| 上下文完整度 | 15 |
| 输入材料可定位性 | 10 |
| 约束与禁止事项 | 15 |
| 输出格式明确度 | 10 |
| 验收标准可检查性 | 15 |
| 风险与异常处理 | 10 |
| coding agent 适配度 | 10 |

评分输出包含总分、各维度得分、扣分原因、优先改进建议、是否适合直接交给 coding agent，以及最缺失的 3 个关键信息。

## 错题本机制

`PromptMistake` 记录每次评分和生成中的低分点：

- 原始 prompt 与生成 prompt；
- 生成前后得分；
- 低分维度；
- 错误类型与修复建议；
- 是否应更新问题树、评分规则或 prompt 模板。

这一机制既服务工程迭代，也可作为大创申报材料中的“持续反馈与自我改进机制”。

## 目录说明

```text
docs/                         大创申报与项目设计文档
src/domain/                   场景、问题树、评分规则、模板配置
src/core/                     需求会话、问题引擎、评分器、生成器、自审、错题本
src/storage/                  lesson/session 的轻量文件存储
src/cli/                      MVP 演示入口
tests/                        Node test 测试
examples/                     四个完整问答与最终 prompt 示例
branches/software-engineering 原仓库保留的软件工程分支资产
adapters/                     Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 适配规则
evals/                        prompt 质量 eval
lessons/                      经验记录与错题本机制
legacy/archived-general-domains/ 非 MVP 旧领域归档
```

## 运行方式

要求 Node.js 24 或更高版本。

```bash
npm.cmd run demo
npm.cmd test
npm.cmd run validate
```

在 PowerShell 中优先使用 `npm.cmd`，避免本机执行策略拦截 `npm.ps1`。

## 大创项目价值

- **软件工程价值**：把模糊需求转成结构化开发任务，降低 coding agent 误改和漏验风险。
- **教育价值**：训练学生表达目标、上下文、约束、验收和测试。
- **工程价值**：提高 Codex 等 coding agent 的执行稳定性和可复查性。
- **研究价值**：沉淀 prompt 评分数据、缺失信息模式和失败类型。
- **创新价值**：从“prompt 生成器”升级为“诊断、教学、生成、审查、迭代”的闭环系统。

## 后续规划

1. 将问题树从静态规则扩展为可配置 JSON/YAML。
2. 接入 Web 原型，支持多轮分级澄清和评分可视化。
3. 建立真实学生 coding prompt 数据集，统计常见缺失信息。
4. 让错题本自动生成问题树和模板更新建议。
5. 补充 CLI 或 MCP 接口，让 CodePrompt Coach 可嵌入现有 coding agent 工作流。
