# Prompt-CR 接续文档

生成时间：2026-05-08

## 1. 当前暂停点

任务已按用户要求暂停。

当前项目目录：

```text
F:\file\wsl_shared_files\study\new skill\Prompt_CR
```

本轮迭代依据：

```text
F:\file\wsl_shared_files\study\new skill\prompt_cr_iteration_workflow.md
```

当前状态：本轮大范围工程化迭代已基本完成，尚未提交 git commit，尚未 push 到 GitHub。工作区仍有大量已修改和新增文件，属于预期状态。

本轮主线已经从旧的泛领域 Prompt Engineering Skill Hub 收缩为：

```text
Prompt-CR / CodePrompt Coach：
面向代码生成智能体的分级需求澄清、Prompt 评分、Prompt 生成、生成后审查与错题本迭代系统。
```

## 2. 已完成的核心改动

### 2.1 项目命名与 README 叙事统一

已统一为：

- 中文定位：面向代码生成智能体的分级需求澄清与 Prompt 优化系统
- 英文产品名：CodePrompt Coach
- 仓库名：Prompt-CR
- CR 含义：Clarification & Review，即“需求澄清 + 生成后审查”

重点文件：

- `README.md`
- `README_en.md`
- `docs/grant-proposal-outline.md`
- `docs/technical-route.md`
- `docs/development-plan.md`

### 2.2 MVP 场景收缩

核心 MVP 场景已收缩为 3 个：

- `bugfix-debugging`：Bug 修复与调试
- `feature-development`：新功能开发
- `test-generation`：测试生成

扩展场景保留为 9 个：

- 代码重构
- 代码审查
- 仓库理解
- API 设计
- 数据库迁移
- DevOps / CI
- 算法任务
- 前端实现
- 后端实现

重点文件：

- `src/domain/scenarios.ts`
- `README.md`
- `public/app.js`
- `src/web/server.ts`

### 2.3 Node 20 工程化工具链

已从依赖 Node 24 / `experimental-strip-types` 调整为 Node 20 兼容方案。

新增或更新：

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.js`
- `.prettierrc`
- `.prettierignore`
- `.nvmrc`
- `.gitignore`

当前主要脚本：

```powershell
npm.cmd run format:check
npm.cmd run lint
npm.cmd test
npm.cmd run eval
npm.cmd run build
npm.cmd run demo
npm.cmd run validate
npm.cmd run web
npm.cmd run skill:validate
```

注意：PowerShell 中优先使用 `npm.cmd`，避免执行策略拦截 `npm.ps1`。

### 2.4 评分器升级

评分器已升级为规则 + 内容质量 + 反作弊判断的混合评分器。

重点能力：

- 保留 8 个评分维度；
- 输出 `dimensionEvidence`；
- 检测关键词堆砌；
- 检测 `TODO`、`待补充`、`具体路径` 等空泛占位符；
- 检测具体文件路径、命令、错误码、API 路由、数据库实体等 concrete artifacts；
- 对“不要乱改”“测试通过”等空泛约束和验收降权；
- 输出 `antiGamingWarnings`、`concreteArtifacts`、`readinessLevel` 和 `suitableForCodingAgent`。

重点文件：

- `src/core/prompt-scorer.ts`
- `tests/prompt-scorer.test.ts`
- `evals/prompt-quality-cases.json`

### 2.5 动态追问机制

已实现 `getNextFollowUpQuestions()`，可根据场景、当前 answers 和评分报告返回最多 3 个优先追问。

已覆盖：

- Bugfix：错误日志、复现步骤、相关文件；
- Feature：用户流程、API 契约、验证标准；
- Test-generation：被测对象、覆盖路径、测试框架。

重点文件：

- `src/core/question-engine.ts`
- `src/domain/question-tree.ts`
- `tests/question-engine.test.ts`
- `src/web/server.ts`
- `public/app.js`

### 2.6 Prompt 生成器升级

生成器已输出 13 个基础章节，并补充 coding agent 执行约束。

重点要求已覆盖：

- 工作目录；
- 项目背景；
- 相关文件；
- 已知问题 / 需求细节；
- 修改范围；
- 禁止事项；
- 执行步骤；
- 验证命令；
- 输出报告格式；
- 失败处理规则；
- 自检清单；
- 目标工具适配要求；
- 禁止虚构验证结果。

重点文件：

- `src/core/prompt-generator.ts`
- `tests/prompt-generator.test.ts`

### 2.7 错题本机制

错题本已从候选记录升级为可落盘、可统计、可生成迭代建议的半自动机制。

已实现：

- `PromptMistake` 记录；
- `summarizeMistakes()`；
- `generateIterationSuggestions()`；
- 默认数据文件 `data/prompt-mistakes.json`；
- Web API 展示统计。

重点文件：

- `src/core/lesson-engine.ts`
- `src/storage/lesson-store.ts`
- `data/prompt-mistakes.json`
- `docs/lesson-system.md`
- `tests/lesson-engine.test.ts`

### 2.8 Web 原型升级

Web 原型已从静态表单升级为教学式交互。

已实现：

- 核心场景默认展示；
- 扩展场景 pills；
- 原始需求输入；
- “分析当前需求”；
- 当前评分与缺失信息；
- 最多 3 个动态追问；
- 每个追问显示原因、示例答案和评分维度；
- 展开全部问题的高级模式；
- 一键生成最终 Prompt；
- 错题本统计。

重点文件：

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `src/web/server.ts`

### 2.9 Eval 数据集

已新增 30 条 Prompt 质量 eval case。

覆盖类型：

- 极度模糊 Prompt；
- 缺少上下文；
- 缺少文件路径；
- 缺少验证命令；
- 关键词堆砌；
- 高质量 bugfix；
- 高质量 feature；
- 高质量 test-generation。

重点文件：

- `evals/prompt-quality-cases.json`
- `evals/README.md`
- `scripts/run-evals.ts`
- `tests/eval-cases.test.ts`

### 2.10 大创申报材料补强

新增或更新：

- `docs/evaluation-plan.md`
- `docs/defense-q-and-a.md`
- `docs/risk-analysis.md`
- `docs/lesson-system.md`
- `docs/grant-proposal-outline.md`
- `docs/technical-route.md`
- `docs/development-plan.md`

当前文档已强调：

- 需求澄清 + 评分 + 生成 + 自审 + 错题本闭环；
- 3 个核心场景的选择原因；
- 规则型 MVP 的边界；
- 不声称自动学习或自动修改规则；
- 后续人工评分一致性和 coding agent 执行实验计划。

### 2.11 维护脚本修复

`scripts/skill_hub_manager.py` 已修复一个实际问题：安装依赖后，旧脚本会递归读取 `node_modules`，导致 UTF-8 解码崩溃。

当前已让 `project_files()` 跳过：

- `.git`
- `.development`
- `coverage`
- `dist`
- `node_modules`

修复后 `npm.cmd run skill:validate` 已通过。

## 3. 已验证结果

以下命令已在本轮暂停前运行并通过。

### 3.1 Eval

```powershell
npm.cmd run eval
```

结果：

```json
{
  "total": 30,
  "passed": 30,
  "failed": 0,
  "failures": []
}
```

### 3.2 总验证

```powershell
npm.cmd run validate
```

包含：

- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run build`

结果：

- Prettier：通过；
- ESLint：通过；
- Node test：23 个测试全部通过；
- TypeScript build：通过。

### 3.3 Demo

```powershell
npm.cmd run demo
```

结果摘要：

```json
{
  "missingBlockingQuestions": [],
  "scoreBefore": 24,
  "scoreAfter": 82,
  "reviewPassed": true
}
```

### 3.4 Web HTTP 快速验证

已启动本地 Web 服务并检查：

- `/`：HTTP 200，包含 `CodePrompt Coach`；
- `/api/scenarios`：返回 12 个场景，其中核心 3 个、扩展 9 个；
- `/api/follow-up`：模糊 bugfix 输入返回 3 个追问，第一项为 `bugfix-error-log`；
- `/api/lessons/summary`：可访问。

### 3.5 Skill Hub 旧元数据校验

```powershell
npm.cmd run skill:validate
```

结果：

```text
# Skill Hub Validation
- Root: `F:\file\wsl_shared_files\study\new skill\Prompt_CR`
- Status: OK
```

### 3.6 Git 空白检查

```powershell
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' -C 'F:\file\wsl_shared_files\study\new skill\Prompt_CR' diff --check
```

结果：通过。只出现 Windows 换行提示，不是错误。

## 4. 当前 Git 状态

当前工作区仍未提交，存在大量修改和新增文件，这是预期状态。

需要特别注意：

- `node_modules/` 已存在于本地，但 `.gitignore` 已忽略；
- `package-lock.json` 应提交，用于可复现安装；
- `node_modules/` 不应提交；
- `data/prompt-mistakes.json` 是错题本默认数据文件，应提交；
- `.gitignore`、`.nvmrc`、`.prettierrc`、`.prettierignore`、`eslint.config.js`、`tsconfig.json` 都应提交。

当前新增文件包括：

```text
.gitignore
.nvmrc
.prettierignore
.prettierrc
data/
docs/defense-q-and-a.md
docs/evaluation-plan.md
docs/lesson-system.md
docs/risk-analysis.md
eslint.config.js
evals/prompt-quality-cases.json
package-lock.json
scripts/run-evals.ts
tests/eval-cases.test.ts
tsconfig.json
```

当前被修改的重点文件包括：

```text
README.md
README_en.md
package.json
public/app.js
public/index.html
public/styles.css
scripts/skill_hub_manager.py
src/core/prompt-scorer.ts
src/core/question-engine.ts
src/core/prompt-generator.ts
src/core/lesson-engine.ts
src/storage/lesson-store.ts
src/web/server.ts
tests/*.test.ts
```

## 5. 恢复工作时的建议步骤

### 5.1 先确认状态

```powershell
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' -C 'F:\file\wsl_shared_files\study\new skill\Prompt_CR' status --short
```

确认 `node_modules/` 没有出现在普通未跟踪文件中。

可检查忽略状态：

```powershell
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' -C 'F:\file\wsl_shared_files\study\new skill\Prompt_CR' status --ignored --short
```

应看到类似：

```text
!! node_modules/
```

### 5.2 重新跑验证

```powershell
npm.cmd run eval
npm.cmd run validate
npm.cmd run demo
npm.cmd run skill:validate
```

如需检查 Web：

```powershell
npm.cmd run web -- --port 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

### 5.3 提交前检查

建议提交前运行：

```powershell
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' -C 'F:\file\wsl_shared_files\study\new skill\Prompt_CR' diff --check
git -c safe.directory='F:/file/wsl_shared_files/study/new skill/Prompt_CR' -C 'F:\file\wsl_shared_files\study\new skill\Prompt_CR' diff --stat
```

然后检查是否误加入：

```text
node_modules/
dist/
coverage/
*.log
```

## 6. 推荐下一步

如果继续开发，优先级建议如下。

### P0：提交当前稳定版本

当前验证已经通过，下一步最合理的是将本轮结果提交到 git，并按用户此前要求推送到远程仓库。

建议提交信息：

```text
refactor Prompt-CR into CodePrompt Coach MVP
```

### P1：修正一个生成器小瑕疵

`npm.cmd run demo` 输出里，禁止事项中出现了重复项：

```text
不要全仓库格式化
```

这不影响测试和功能，但后续可在 `src/core/prompt-generator.ts` 中做去重，让最终 Prompt 更干净。

### P2：补充 Web 视觉回归检查

HTTP 端点已验证，但尚未做浏览器截图级 UI 检查。若继续打磨 Web 原型，可启动服务后用浏览器检查：

- 桌面布局是否拥挤；
- 移动端文本是否溢出；
- 评分颜色是否清晰；
- 动态追问区域是否随回答更新。

### P3：用真实样本校准评分器

当前评分器是规则型 MVP，后续应使用真实学生 Prompt 样本校准：

- 关键词权重；
- concrete artifact 权重；
- readiness 阈值；
- 场景专属扣分；
- 人工评分一致性。

## 7. 不要做的事

恢复工作时请注意：

- 不要提交 `node_modules/`；
- 不要声称系统已经具备真实机器学习能力；
- 不要声称错题本会自动修改规则；
- 不要虚构 Web 视觉检查结果；
- 不要把医疗、法律、金融、营销等泛领域重新作为 MVP 核心；
- 不要为通过测试删除关键断言或降低 eval 标准；
- 不要回退用户或其他模型已经做出的有效修改。

## 8. 最终交付报告建议结构

如果后续恢复并完成提交，最终报告建议按迭代文档要求输出：

```markdown
## 修改摘要

## 解决的核心问题

## 关键文件变更

## 新增能力

## 核心场景收缩说明

## 评分器升级说明

## 动态追问机制说明

## 错题本机制说明

## Web 原型改进说明

## 大创申报材料改进说明

## 运行与验证结果

## 尚未完成的问题

## 后续建议
```
