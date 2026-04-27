---
name: prompt-engineering
description: Use when the user asks to optimize or generate a prompt for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, or another AI tool; route the request through a scenario-specific prompt branch with common principles, templates, checklists, examples, and acceptance criteria.
---

# Prompt Engineering Skill Hub

## 1. Skill Purpose
This skill converts vague user needs into high-quality prompts. It routes the request to a suitable branch, combines auxiliary branches when needed, and produces prompts that are precise, executable, reusable, and adapted to Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, or another target AI tool.

It supports prompt review, rewrite, expansion, compression, template building, software development, DevOps/CI, database migration, API design, document research, data analysis, product design, AI systems/RAG, business operations, curriculum design, creative/game design, multimodal analysis, high-risk professional domains, automation workflows, meta skill creation, Codex plan mode, and CLI agent tasks.

## 2. When to Use
Use this skill when the user asks to:
- generate, optimize, review, rewrite, expand, compress, or template a prompt;
- turn a casual request into AI-executable instructions;
- write task instructions for Codex, Codex CLI, Claude Code, Gemini CLI, ChatGPT, or another agent;
- plan before execution;
- solidify a repeated workflow, document, or method into a template or skill.

## 3. When Not to Use
Do not use this skill when the user only needs casual conversation, a short direct answer, a short phrase translation, or explicitly says not to create a structured prompt. For a trivial task that can be solved directly, answer directly instead of invoking the hub.

## 4. How to Use This Skill
1. Read this `SKILL.md`.
2. Follow `prompt-generation-protocol.md`: intake, normalize, route, identify missing inputs, risk check, construct prompt, self-check, finalize.
3. Read `router.md` and select exactly one primary branch based on the user's final desired deliverable.
4. Use `branch-composition.md` to add auxiliary branches only for tool adaptation, validation, citation, report format, or safety boundaries.
5. Use `metadata/resources.yaml` to select resource URIs for branches, templates, checklists, examples, evals, adapters, safety boundaries, and lessons.
6. Apply `common-principles.md` for missing-input handling, constraint priority, hallucination control, high-risk boundaries, and tool adaptation.
7. Use `templates.md` plus the branch template to draft the final prompt.
8. If a target tool is named, apply the matching file in `adapters/`.
9. If a high-risk domain is detected, apply the matching file in `safety/`.
10. Check with `checklists.md` and the branch checklist.
11. Match against `evals/cases/` or `evals/features/` when a similar case exists.
12. Look up `lessons/` for known failure modes or successful patterns; suggest a new lesson when a generated prompt fails checklist or eval.
13. Use `examples.md` when the request benefits from a concrete pattern.
14. Use `branches/manifest.yaml` and `metadata/resources.yaml` when you need machine-readable coverage or prompt-generation quality tests.

## 4.1 Standard Prompt Generation Output
When showing the route is useful, use this format:

```text
需求摘要：
最终交付物：
主分支：
辅助分支：
使用资源：
缺失信息：
风险等级：
安全边界：
使用模板：
最终 prompt：
自检结果：
可能关联的 eval：
可能新增的 lesson：
```

If the user only wants the final prompt, keep the route internally but still apply the same self-check.

## 4.2 Natural Language Entry Rules

The user does not need to know branch names or the repository layout. When the user asks naturally, infer:
- final deliverable;
- target tool;
- primary branch;
- auxiliary branches;
- registry resources;
- missing inputs;
- risk level;
- final prompt and self-check.

Do not introduce role-platform concepts. This hub is a prompt engineering capability system, not a role activation system.

## 5. Branch Categories
- `general-prompt`
- `software-engineering`
- `documents-research`
- `data-analytics`
- `product-design-business`
- `ai-systems`
- `business-operations`
- `education`
- `creative-design`
- `multimodal`
- `domain-specific`
- `communication`
- `automation`
- `meta`

## 6. Branch Index
### general-prompt
- `branches/general-prompt/prompt-review.md`：诊断已有 prompt 的缺口，给出评分、风险、改进建议和保留原意的优化版。
- `branches/general-prompt/prompt-rewrite.md`：把口语化或模糊需求改写成目标 AI 工具可直接执行的任务 prompt。
- `branches/general-prompt/prompt-expansion.md`：把短 prompt 扩展成包含背景、步骤、约束、验收和风险控制的强执行 prompt。
- `branches/general-prompt/prompt-compression.md`：压缩过长 prompt，在降低 token 的同时保留目标、关键上下文、硬约束和验收。
- `branches/general-prompt/prompt-template-builder.md`：把一次性 prompt 抽象成带变量、填写说明、示例和检查表的可复用模板。

### software-engineering
- `branches/software-engineering/plan-mode.md`：为 Codex plan 模式或只分析不执行的开发任务生成规划 prompt。
- `branches/software-engineering/coding-feature-development.md`：为新功能、前端页面、后端接口、组件和交互逻辑生成开发 prompt。
- `branches/software-engineering/bugfix-debugging.md`：为报错、构建失败、页面白屏、依赖冲突和 CLI 错误生成排障修复 prompt。
- `branches/software-engineering/refactor-architecture.md`：为代码重构、模块拆分、架构整理和降低耦合生成 prompt。
- `branches/software-engineering/test-generation.md`：为单元、集成、E2E、回归测试和覆盖率提升生成测试 prompt。
- `branches/software-engineering/code-review.md`：为代码质量、安全、性能、可维护性和潜在 bug 审查生成 review prompt。
- `branches/software-engineering/repository-analysis.md`：为分析整个仓库、识别技术栈、入口、模块和运行方式生成 prompt。
- `branches/software-engineering/cli-agent.md`：为 Codex CLI、Gemini CLI、Claude Code 等命令行智能体生成带权限、命令和报告边界的 prompt。
- `branches/software-engineering/security-threat-modeling.md`：为防御性安全审查、威胁建模、权限边界和数据泄露风险分析生成 prompt。
- `branches/software-engineering/devops-ci.md`：为 CI/CD、GitHub Actions、GitLab CI、Docker 构建、部署、secrets、runner 和回滚策略生成 prompt。
- `branches/software-engineering/database-migration.md`：为 schema 修改、ORM migration、数据回填、零停机迁移和 rollback 生成 prompt。
- `branches/software-engineering/api-design.md`：为 REST、GraphQL、OpenAPI、鉴权、错误码、分页、版本和联调生成 API 设计 prompt。

### documents-research
- `branches/documents-research/documentation-analysis.md`：为文档总结、会议记录、项目资料和多文档归纳生成结构化分析 prompt。
- `branches/documents-research/pdf-to-skill.md`：把 PDF 中的方法、案例和注意事项提炼成可复用 skill 的 prompt。
- `branches/documents-research/research-synthesis.md`：为多来源调研、论文比较、网页资料综合和观点对比生成 prompt。
- `branches/documents-research/academic-writing.md`：为论文、文献综述、研究计划、学术报告和课程作业生成 prompt。
- `branches/documents-research/report-writing.md`：为项目报告、实习报告、课程报告、阶段总结和技术文档生成 prompt。

### data-analytics
- `branches/data-analytics/data-analysis.md`：为数据集、统计分析、实验数据、业务指标、趋势和异常分析生成 prompt。
- `branches/data-analytics/spreadsheet-analysis.md`：为 Excel、CSV、Google Sheets、财务表、订单表和成绩表分析生成 prompt。
- `branches/data-analytics/visualization-dashboard.md`：为图表、仪表盘、BI 报告、指标展示和数据可视化生成 prompt。

### product-design-business
- `branches/product-design-business/product-requirements.md`：为 PRD、MVP、功能规格和用户故事生成 prompt。
- `branches/product-design-business/ux-ui-design.md`：为界面设计、体验优化、交互流程、设计稿说明和组件规范生成 prompt。
- `branches/product-design-business/business-strategy.md`：为商业计划、市场分析、竞品分析、增长策略和变现路径生成 prompt。
- `branches/product-design-business/marketing-content.md`：为广告文案、短视频脚本、小红书、邮件营销和 SEO 内容生成 prompt。

### multimodal
- `branches/multimodal/visual-image-analysis.md`：为图片、截图、设计稿、图像题目和页面视觉问题分析生成 prompt。
- `branches/multimodal/video-audio-analysis.md`：为视频总结、音频转写、会议录音、课程视频和时间轴笔记生成 prompt。
- `branches/multimodal/visual-3d-interaction.md`：为 Spline、Blender、3D 网页、交互动画、拖拽和视觉对齐任务生成 prompt。

### ai-systems
- `branches/ai-systems/knowledge-base-rag.md`：为知识库、RAG、embedding、向量数据库、检索、rerank、引用和防幻觉生成 prompt。

### business-operations
- `branches/business-operations/customer-service-qa.md`：为客服对话质检、工单分析、服务评分、违规话术和坐席改进建议生成 prompt。
- `branches/business-operations/recruiting-evaluation.md`：为简历筛选、面试评估、岗位匹配、候选人打分和偏见控制生成 prompt。

### education
- `branches/education/curriculum-design.md`：为课程大纲、学习路径、训练营、作业、评估标准和教学活动生成 prompt。

### creative-design
- `branches/creative-design/game-design.md`：为游戏概念、核心玩法、机制、关卡、GDD 和可测试原型范围生成 prompt。

### domain-specific
- `branches/domain-specific/legal-policy-review.md`：为合同、政策、条款风险、合规和隐私政策分析生成安全边界 prompt。
- `branches/domain-specific/medical-health-info.md`：为健康信息解释、症状整理、就医准备、医学资料和体检报告解释生成安全 prompt。
- `branches/domain-specific/finance-investment-analysis.md`：为财务分析、投资研究、股票/基金/加密资产和预算规划生成风险受控 prompt。
- `branches/domain-specific/education-tutoring.md`：为学习计划、题目讲解、考试复习、课程辅导和知识点拆解生成 prompt。

### communication
- `branches/communication/translation-localization.md`：为翻译、本地化、润色、双语对照和语气改写生成 prompt。
- `branches/communication/roleplay-simulation.md`：为面试、谈判、客服、销售话术和口语练习生成多轮模拟 prompt。

### automation
- `branches/automation/automation-workflow.md`：为自动化脚本、Zapier、Make、n8n、定时任务和数据同步生成流程 prompt。

### meta
- `branches/meta/meta-skill-builder.md`：把流程、知识、文档或经验提炼为新的可复用 AI skill。

## 7. Final Prompt Quality Standard
A final prompt must have a clear objective, sufficient context, named input materials, ordered execution steps, strong constraints, explicit output format, checkable acceptance criteria, risk and uncertainty handling, and target-tool adaptation. It must be ready to hand to the target AI tool without requiring the tool to guess the task, the source materials, the boundaries, or the definition of done.

The final prompt must also:
- choose the primary branch by final deliverable, not by keyword;
- classify missing inputs as assumptions, `[待补充]`, questions, or blockers;
- keep high-risk domains within safe informational boundaries;
- require evidence, citations, logs, files, data, screenshots, or source materials for factual claims;
- include verification commands or acceptance checks when the target tool can execute work;
- require the target model to report failed checks instead of claiming success.

## 7.1 Evaluation And Metadata

- `branches/manifest.yaml` indexes重点分支、触发条件、输入、兼容辅助分支、输出章节和 eval cases。
- `metadata/resources.yaml` indexes branch, template, checklist, example, eval, adapter, safety, and lesson resources through stable `@type://...` URIs.
- `evals/schema.md` defines the lightweight eval schema.
- `evals/cases/` contains branch-specific cases for normal input, missing input, and risk/misuse input.
- `evals/features/` contains Gherkin-style behavior checks for natural language entry, resource registry, prompt quality, high-risk boundaries, and lesson feedback.
- `lessons/` records documented project experience, not runtime memory.
- `adapters/` describes target-tool prompt constraints.
- `safety/` describes prompt-generation boundaries for high-risk domains.
- Eval cases judge prompt quality, not the downstream model's final task result.

## 8. Extension Automation

This skill includes maintenance scripts in `scripts/` for branch extension, validation, statistics, and capability reporting.

Script policy:
- Do not invoke scripts during ordinary prompt generation, prompt review, prompt rewrite, routing, or template lookup.
- Invoke `scripts/skill_hub_manager.py add-branch` only when the user explicitly asks to add a new branch to this Skill Hub.
- Before invoking `add-branch`, ask the user to confirm the branch category, slug, purpose, trigger conditions, required inputs, construction rules, hard constraints, output format, checklist, and example.
- Prefer `--dry-run` first, review the planned changes, then run without `--dry-run` only after the branch spec is complete.
- After adding a branch, run `validate`, `stats`, and `capabilities`, then summarize changed files and remaining issues.
- `validate` also checks `prompt-generation-protocol.md`, `branch-composition.md`, `branches/manifest.yaml`, `metadata/resources.yaml`, adapters, safety resources, lessons, feature evals, and eval case schemas.

Available script commands:
- `python3 scripts/skill_hub_manager.py add-branch --spec <branch-spec.json> --dry-run`
- `python3 scripts/skill_hub_manager.py add-branch --spec <branch-spec.json>`
- `python3 scripts/skill_hub_manager.py validate`
- `python3 scripts/skill_hub_manager.py stats`
- `python3 scripts/skill_hub_manager.py capabilities`
- `python3 scripts/skill_hub_manager.py init-spec --output <branch-spec.json>`
