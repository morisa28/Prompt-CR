# CodePrompt Coach 接续文档

## 当前状态

任务已暂停。当前项目已完成从泛领域 Prompt Engineering Skill Hub 到 CodePrompt Coach 的大范围重构，主线已经切换为：

> 面向代码生成任务的分级需求澄清、Prompt 评分、Prompt 优化与持续迭代平台。

当前仓库已具备“文档 + MVP 原型 + 示例 + 测试 + 大创申报材料”的基础闭环。

## 已完成内容

### 1. 项目定位重写

已重写以下入口和核心规则文档：

- `README.md`
- `SKILL.md`
- `router.md`
- `prompt-generation-protocol.md`
- `templates.md`
- `checklists.md`
- `metadata/resources.yaml`
- `branches/manifest.yaml`

新定位聚焦 CodePrompt Coach，不再以泛领域 prompt skill hub 作为主叙事。

### 2. 领域收缩与归档

主干保留：

- `branches/software-engineering/`
- `adapters/`
- `evals/cases/software-engineering/`
- `lessons/`
- `metadata/resources.yaml`

非 MVP 领域已归档到：

- `legacy/archived-general-domains/branches/`
- `legacy/archived-general-domains/evals/cases/`
- `legacy/archived-general-domains/safety/`

归档内容包括 AI systems、data analytics、documents research、domain specific、product/business、creative、multimodal、education、communication、automation、general prompt、meta 等旧领域资源。

### 3. TypeScript MVP 原型

新增 `src/`：

- `src/domain/scenarios.ts`
- `src/domain/question-tree.ts`
- `src/domain/scoring-rubric.ts`
- `src/domain/prompt-template.ts`
- `src/core/requirement-session.ts`
- `src/core/question-engine.ts`
- `src/core/prompt-scorer.ts`
- `src/core/prompt-generator.ts`
- `src/core/prompt-reviewer.ts`
- `src/core/lesson-engine.ts`
- `src/storage/lesson-store.ts`
- `src/storage/session-store.ts`
- `src/cli/index.ts`

当前闭环：

```text
用户模糊需求
-> 分级提问
-> 结构化需求
-> 生成前评分
-> prompt 生成
-> 生成后评分
-> 自我审查
-> PromptMistake / lessons 记录
```

### 4. 示例与测试

新增 `examples/`：

- `examples/bugfix-session.example.md`
- `examples/feature-session.example.md`
- `examples/test-generation-session.example.md`
- `examples/code-review-session.example.md`

新增 `tests/`：

- `tests/prompt-scorer.test.ts`
- `tests/question-engine.test.ts`
- `tests/prompt-generator.test.ts`
- `tests/lesson-engine.test.ts`
- `tests/run-tests.ts`

测试覆盖：

- prompt 评分维度计算；
- 缺少错误日志扣分；
- 缺少验证命令扣分；
- 生成 prompt 包含禁止无关重构；
- 生成 prompt 包含验证结果输出要求；
- 错题本记录低分维度。

### 5. 大创申报材料

新增 `docs/`：

- `docs/project-positioning.md`
- `docs/prospect-analysis.md`
- `docs/technical-route.md`
- `docs/innovation-points.md`
- `docs/development-plan.md`
- `docs/grant-proposal-outline.md`

这些文档已围绕“面向代码生成任务的需求工程辅助系统”组织，而不是普通 prompt 网站或聊天壳子。

## 已验证结果

已运行并通过：

```powershell
npm.cmd test
python scripts\skill_hub_manager.py validate
npm.cmd run demo
```

最近一次结果：

- `npm.cmd test`：9 个测试全部通过。
- `python scripts\skill_hub_manager.py validate`：Status OK。
- `npm.cmd run demo`：可生成 bugfix prompt，生成前评分 48，生成后评分 88，自审通过。

注意：PowerShell 中应使用 `npm.cmd`，不要直接用 `npm`，否则可能被本机执行策略拦截 `npm.ps1`。

## 当前 Git 状态说明

当前 git status 会显示大量旧路径删除和 `legacy/` 新增，这是预期结果，因为非 MVP 领域已从主干移动到归档目录。

主要新增目录：

- `src/`
- `tests/`
- `docs/`
- `examples/`
- `legacy/`

主要保留资产：

- `branches/software-engineering/`
- `adapters/`
- `evals/cases/software-engineering/`
- `lessons/`

## 后续建议

### 优先级 1：整理 Git 变更

确认移动后的 `legacy/` 内容完整，然后用 git diff 检查是否存在非预期删除。

建议命令：

```powershell
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' status --short
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' diff --stat
```

### 优先级 2：补充 Web 原型

当前是 CLI + 数据结构原型。后续可增加一个轻量 Web UI：

- 左侧分级问题；
- 中间结构化需求；
- 右侧评分报告和最终 prompt；
- 底部错题本记录。

### 优先级 3：将问题树配置外置

当前问题树在 `src/domain/question-tree.ts` 中硬编码。后续可迁移为 JSON/YAML，方便非开发者修改问题。

### 优先级 4：改进评分器

当前评分器是规则型 MVP。后续应基于真实学生 prompt 样本校准：

- 关键词证据；
- 字段权重；
- readiness 阈值；
- 不同场景的专属扣分规则。

### 优先级 5：申报材料深化

后续大创申报书可以围绕以下叙事展开：

- 软件工程价值：模糊需求转结构化开发任务；
- 教育价值：训练学生表达目标、上下文、约束、验收和测试；
- 工程价值：提升 coding agent 执行稳定性；
- 研究价值：积累 prompt 评分数据和错误模式；
- 创新价值：形成诊断、教学、生成、审查、迭代闭环。

## 恢复工作时的推荐入口

1. 先读 `README.md` 了解当前定位。
2. 再读 `src/domain/question-tree.ts` 和 `src/domain/scoring-rubric.ts` 理解核心设计。
3. 跑 `npm.cmd test` 确认当前原型仍通过。
4. 根据下一步目标选择继续开发 Web UI、配置化问题树、评分器优化或申报材料深化。

## 暂停点

本次暂停点为：基础重构、原型、示例、测试和申报材料已完成并验证通过；尚未提交 git commit，尚未开发 Web UI，尚未用真实用户样本校准评分规则。
