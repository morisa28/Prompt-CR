# CodePrompt Coach

**Prompt-CR：面向代码生成智能体的分级需求澄清与 Prompt 优化系统。**

Prompt-CR 不是普通的 Prompt 模板库，也不是简单的 AI 聊天壳子。

它是一个面向代码生成任务的需求澄清、质量评分、Prompt 生成、生成后审查和错题本迭代系统。项目通过动态分级追问帮助用户明确任务目标、项目上下文、修改边界和验证标准，并将这些信息转化为适合 Codex、Claude Code、Gemini CLI 等 coding agent 执行的工程化 Prompt。

CodePrompt Coach 是产品名；Prompt-CR 是仓库名，CR 表示 Clarification & Review，即“需求澄清 + 生成后审查”。

## 1. 项目解决什么问题

AI coding agent 已经能辅助完成大量开发任务，但失败常常不是模型不会写代码，而是用户的任务表达缺少工作目录、相关文件、错误日志、修改边界、验收标准和失败处理规则。初学者常把“帮我改一下”“做个页面”“修一下报错”直接交给 agent，导致 agent 猜测上下文、扩大修改范围、跳过验证或输出不可复查的结果。

Prompt-CR 将这个问题转化为软件工程需求表达训练问题：先诊断缺失信息，再动态追问，最后生成可执行、可验证、可复盘的 coding agent Prompt。

## 2. 为什么不是普通 Prompt 生成器

普通模板通常只把用户输入拼进固定格式。Prompt-CR 的核心区别是闭环：

```text
用户原始模糊需求
  -> 初步评分
  -> 动态分级追问
  -> 结构化需求整理
  -> 再次评分
  -> 生成 coding agent Prompt
  -> 生成后自审与评分
  -> 错题本记录
  -> 统计高频问题
  -> 反向优化问题树、评分规则和模板
```

当前实现是规则型 MVP，不声称具备机器学习或自动改规则能力；错题本提供的是半自动迭代建议。

## 3. 核心场景

MVP 聚焦 3 个高频代码生成场景：

- `bugfix-debugging` Bug 修复与调试
- `feature-development` 新功能开发
- `test-generation` 测试生成

这三个场景覆盖软件工程中的核心闭环：发现问题、实现功能、验证质量。其他软件工程场景作为扩展能力保留，用于后续迭代：

- 代码重构
- 代码审查
- 仓库理解
- API 设计
- 数据库迁移
- DevOps / CI
- 算法任务
- 前端实现
- 后端实现

医疗、法律、金融、营销、创意、多模态等旧资源已归档到 `legacy/archived-general-domains/`，不作为 MVP 核心能力。

## 4. 前后对比

原始 Prompt：

```text
帮我修一下 build 报错，不要乱改。
```

系统优先追问：

```text
1. 请提供完整错误日志或关键报错行。
2. 请提供复现命令，例如 npm run build。
3. 请说明相关文件路径或目录。
```

优化后 Prompt 摘要：

```text
你是 Codex，请在 F:/workspace/demo-app 中修复 npm run build 的 TS2322 类型错误。
请先阅读 package.json、src/pages/Profile.tsx、src/api/user.ts。
只允许修改与 Profile 用户数据加载相关的文件。
不要新增依赖，不要全仓库格式化，不要删除测试。
完成后运行 npm run build 和 npm test -- --runInBand。
如果无法运行测试，说明原因。
最终输出根因、修改文件、关键改动、验证结果、未验证项和剩余风险。
```

## 5. 快速开始

要求 Node.js 20 或更高版本。

```bash
npm install
npm.cmd run format:check
npm.cmd run lint
npm.cmd test
npm.cmd run eval
npm.cmd run build
npm.cmd run demo
npm.cmd run web
```

在 PowerShell 中优先使用 `npm.cmd`，避免本机执行策略拦截 `npm.ps1`。Web 原型默认运行在 `http://localhost:4173`。

如需校验旧 skill hub 元数据：

```bash
npm.cmd run skill:validate
```

## 6. Web 原型

Web 原型提供：

- 核心三场景默认展示，扩展场景折叠展示；
- 原始需求输入与“分析当前需求”按钮；
- 当前评分、缺失信息和最多 3 个动态追问；
- 每个追问说明“为什么问”、示例答案和对应评分维度；
- 展开全部问题的高级模式；
- 一键生成最终 Prompt；
- 生成后自审和错题本候选；
- 错题本统计与迭代建议。

## 7. 评分体系

总分 100 分，保留 8 个软件工程维度：

| 维度                | 分值 |
| ------------------- | ---: |
| 任务目标清晰度      |   15 |
| 上下文完整度        |   15 |
| 输入材料可定位性    |   10 |
| 约束与禁止事项      |   15 |
| 输出格式明确度      |   10 |
| 验收标准可检查性    |   15 |
| 风险与异常处理      |   10 |
| coding agent 适配度 |   10 |

评分器已加入反作弊与内容质量判断：

- 识别关键词堆砌；
- 识别 `TODO`、`待补充`、`具体路径` 等空泛占位符；
- 识别真实文件路径、命令、错误码、API 路由和数据库 artefact；
- 对“不要乱改”“测试通过”等空泛约束和验收降权。

## 8. 错题本机制

错题本记录 `PromptMistake`，包括原始 Prompt、生成 Prompt、生成前后得分、低分维度、错误类型和建议修复。当前错题本是半自动迭代建议机制：

- 可保存到 `data/prompt-mistakes.json`；
- 可统计高频低分维度和错误类型；
- 可生成问题树、评分规则和模板的修改建议；
- 不会自动学习或自动修改系统规则。

## 9. Eval 数据集

`evals/prompt-quality-cases.json` 包含 30 条 Prompt 质量样例，覆盖模糊输入、缺少上下文、缺少路径、缺少验证命令、关键词堆砌和高质量核心场景 Prompt。

```bash
npm.cmd run eval
```

评测集用于规则型 MVP 的回归验证，也为后续人工评分一致性实验和 coding agent 执行效果实验提供基础。

## 10. 项目结构

```text
docs/                         大创申报与项目设计文档
src/domain/                   场景、问题树、评分规则、模板配置
src/core/                     需求会话、问题引擎、评分器、生成器、自审、错题本
src/storage/                  lesson/session 的轻量文件存储
src/web/                      Web API 与静态资源服务
src/cli/                      MVP 演示入口
public/                       Web 原型静态界面
tests/                        Node test 测试
evals/                        Prompt 质量评测样例
examples/                     完整问答与最终 Prompt 示例
data/                         错题本落盘数据
legacy/archived-general-domains/ 非 MVP 旧领域归档
```

## 11. 大创项目价值

- 软件工程价值：把模糊需求转成结构化开发任务，降低 coding agent 误改和漏验风险。
- 教育价值：训练学生表达目标、上下文、约束、验收和测试。
- 工程价值：提高 Codex 等 coding agent 的执行稳定性和可复查性。
- 研究价值：沉淀 Prompt 评分数据、缺失信息模式和失败类型。
- 创新价值：形成“诊断、教学、生成、审查、迭代”的闭环。

## 12. 实验评估计划

后续评估围绕 3 个研究问题展开：

- RQ1：分级需求澄清是否能显著提升代码生成 Prompt 的完整性和可执行性？
- RQ2：基于软件工程维度的 Prompt 评分能否预测 coding agent 执行任务的成功率或人工评价质量？
- RQ3：错题本高频缺失信息能否反向优化问题树，降低后续用户 Prompt 的关键字段缺失率？

量化指标包括平均评分提升、关键字段缺失率降低、usable/high_quality 占比、人工评分一致性和 coding agent 执行成功率。

## 13. 后续路线图

1. 用真实学生 Prompt 样本校准评分权重。
2. 做人工评分一致性分析。
3. 接入真实 coding agent 执行实验。
4. 将问题树、评分规则和模板完全配置化。
5. 增加 CLI / MCP 插件接口。
