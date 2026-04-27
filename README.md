# Prompt Engineering Skill Hub

这是 `prompt-engineering` skill 的可分发副本，用于把模糊需求转化为可直接交给 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 等工具执行的高质量 prompt。

## 内容概览

- `SKILL.md`：总入口，说明用途、触发条件、分支分类和质量标准。
- `router.md`：路由系统，根据用户需求选择主分支和辅助分支。
- `common-principles.md`：跨分支通用 prompt 编写原则。
- `templates.md`：跨场景可复制模板。
- `checklists.md`：可执行质量检查表。
- `examples.md`：跨分支完整示例。
- `branches/`：场景化分支库，共 45 个分支。

## 分支分类

- `general-prompt`：prompt 评审、改写、扩写、压缩、模板化。
- `software-engineering`：plan mode、功能开发、debug、重构、测试、代码审查、仓库分析、CLI agent、安全建模、DevOps/CI、数据库迁移、API 设计。
- `documents-research`：文档分析、PDF to skill、研究综合、学术写作、报告写作。
- `data-analytics`：数据分析、表格分析、可视化仪表盘。
- `product-design-business`：PRD、UX/UI、商业策略、营销内容。
- `ai-systems`：知识库 / RAG。
- `business-operations`：客服质检、招聘评估。
- `education`：课程设计。
- `creative-design`：游戏设计。
- `multimodal`：图片、音视频、3D/交互视觉任务。
- `domain-specific`：法律、医疗、金融、教育辅导。
- `communication`：翻译本地化、角色模拟。
- `automation`：自动化工作流。
- `meta`：meta skill builder。

## 使用方式

1. 先读取 `SKILL.md`。
2. 读取 `router.md`，判断主分支和辅助分支。
3. 应用 `common-principles.md` 的通用约束。
4. 使用 `templates.md` 和对应分支模板生成 prompt。
5. 用 `checklists.md` 和分支检查表自检。
6. 必要时参考 `examples.md`。

## 质量标准

最终 prompt 必须具备：明确目标、充分上下文、清晰输入、具体步骤、强约束、输出格式、验收标准、风险控制、不确定性标注，并能直接交给目标 AI 工具执行。


