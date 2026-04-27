# 更新说明

## 副本信息

- 副本名称：`prompt-engineering`
- 生成日期：2026-04-27

## 本次副本包含

- 总入口：`SKILL.md`
- 路由系统：`router.md`
- 通用原则：`common-principles.md`
- 通用模板：`templates.md`
- 通用检查表：`checklists.md`
- 跨分支示例：`examples.md`
- 场景化分支：`branches/`
- 中文 README：`README.md`
- English README：`README.en.md`
- 更新说明：`UPDATE_NOTES.md`

## 当前能力范围

该副本是一个 Prompt Engineering Skill Hub，支持：

- 根据用户需求自动路由 prompt 生成场景。
- 选择主分支和必要辅助分支。
- 为不同 AI 工具适配 prompt，包括 Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT。
- 生成具备目标、上下文、输入、步骤、约束、输出格式、验收标准和自检要求的 prompt。
- 支持软件工程、文档研究、数据分析、产品设计、AI systems、业务运营、教育课程、创意设计、多模态、专业领域、自动化和 meta skill 构建等场景。

## 规模统计

- 分支文件：45 个。
- 通用模板：23 个。
- 通用检查表：28 个。
- 跨分支示例：28 个。
- 新增后续扩展分支：8 个。

## 最近新增的 8 个扩展分支

- `branches/software-engineering/devops-ci.md`：DevOps / CI、pipeline、部署、secrets、回滚。
- `branches/software-engineering/database-migration.md`：数据库 schema migration、数据回填、rollback。
- `branches/software-engineering/api-design.md`：REST / GraphQL / OpenAPI、鉴权、错误码、联调。
- `branches/ai-systems/knowledge-base-rag.md`：知识库、RAG、检索、引用、防幻觉。
- `branches/business-operations/customer-service-qa.md`：客服质检、评分、证据片段、坐席改进建议。
- `branches/business-operations/recruiting-evaluation.md`：招聘评估、岗位匹配、偏见控制、面试问题。
- `branches/education/curriculum-design.md`：课程大纲、学习路径、作业、评估标准。
- `branches/creative-design/game-design.md`：游戏设计、核心玩法循环、GDD、原型验证。

## 验证结果

- 已将源目录复制到目标目录。
- 已对源目录和目标目录执行内容比较，复制内容一致。
- 已新增 `README.md`、`README.en.md`、`UPDATE_NOTES.md`。

## 使用建议

- 若要作为 Codex skill 使用，可将整个 `prompt-engineering` 目录放入 Codex skills 目录。
- 如果只想参考模板，可直接读取 `router.md`、`templates.md`、`checklists.md` 和对应 `branches/` 文件。
- 修改或新增分支时，应同步更新 `SKILL.md`、`router.md`、`templates.md`、`checklists.md` 和 `examples.md`，避免路由失效。
