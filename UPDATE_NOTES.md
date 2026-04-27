# 更新说明

## 2026-04-27 Capability System Iteration

本次迭代目标：不继续堆叠分支，也不引入角色化能力，而是把项目升级为更清晰、更可索引、更可测试、更能沉淀经验的 Prompt Engineering Capability System。

详细更新文档：`UPDATE_2026-04-27_CAPABILITY_SYSTEM_ITERATION.md`

## 本轮主要新增

- `metadata/resources.yaml`：轻量资源注册表，统一索引 branch、template、checklist、example、eval、adapter、safety 和 lesson。
- `lessons/`：Prompt 经验记忆库，记录 routing failures、prompt failures、unsafe patterns、successful patterns 和 improvement notes。
- `adapters/`：Codex、Codex CLI、Claude Code、Gemini CLI、ChatGPT 的目标工具适配文档。
- `safety/`：医疗、法律、金融、安全、隐私的 prompt 生成边界。
- `evals/features/`：Gherkin 风格行为测试，覆盖自然语言入口、资源注册、bugfix prompt 质量、RAG 引用权限、高风险边界和 lesson 反馈闭环。
- 新增重点 eval cases，使 eval case 总数从 36 增至 51。

## 本轮主要增强

- `prompt-generation-protocol.md`：加入 resource selection、optional eval matching 和 learn from failures。
- `router.md`：标准路由输出增加资源引用、adapter、safety、suggested template、checklist、matched eval 和 related lessons。
- `README.md` / `README_en.md`：加入自然语言入口、registry、eval features、lessons、adapters 和 safety 说明。
- `SKILL.md`：要求 AI Agent 通过 protocol、registry、adapter、safety、eval 和 lessons 完成 prompt 生成。
- `checklists.md`：新增自然语言入口、资源注册表、prompt 评测、lesson 记录、adapter 选择、safety 选择和 eval case 质量检查表。
- `examples.md`：新增自然语言到最终 prompt 的完整流程示例，包含资源 URI、matched eval 和 lesson 判断。
- `scripts/skill_hub_manager.py`：`validate` 和 `stats` 覆盖 registry、lessons、adapters、safety 和 feature evals。

## 本轮边界

- 未新增角色化专家、角色字段、激活字段或专家平台叙事。
- 未实现 MCP Server、Web UI、桌面客户端或复杂 CLI。
- 未处理 CI、Release、License 或社区治理。

## 2026-04-27 Skill Hub System Upgrade

本次升级目标：把 `prompt-engineering` 从 Prompt 模板知识库 / Skill Hub 雏形升级为更完整、更可验证、更易扩展的 Prompt Engineering Skill Hub。

## 主要新增

- `prompt-generation-protocol.md`：标准 Prompt 生成流程协议。
- `branch-composition.md`：主分支和辅助分支组合规则。
- `branches/manifest.yaml`：重点分支机器可读索引。
- `evals/README.md` 和 `evals/schema.md`：评测体系说明和 schema。
- `evals/cases/`：12 个重点分支各 3 个 eval case，共 36 个。
- `README.md`、`README_en.md`：面向首次使用者和 AI Agent 的入口文档。

## 主要增强

- `router.md`：升级为按最终交付物选择主分支的多层路由系统，补充辅助分支、冲突处理、风险等级、标准路由输出和复杂示例。
- `common-principles.md`：补充高质量 prompt 构成、缺失输入分级、约束优先级、防幻觉、高风险领域和工具适配。
- `templates.md`：新增 bugfix、repo analysis、PRD to dev agent、RAG、缺失输入补全、自检、多分支组合和 prompt system improvement 等模板。
- `checklists.md`：新增路由、主分支、辅助分支、coding agent、文档研究、数据分析、RAG、高风险、输出格式、缺失输入、幻觉风险和最终交付前检查表。
- `examples.md`：新增 10 个从模糊需求到最终 prompt 的全过程示例。

## 重点分支增强

- `software-engineering/bugfix-debugging.md`
- `software-engineering/repository-analysis.md`
- `software-engineering/coding-feature-development.md`
- `software-engineering/test-generation.md`
- `product-design-business/product-requirements.md`
- `ai-systems/knowledge-base-rag.md`
- `data-analytics/data-analysis.md`
- `documents-research/report-writing.md`
- `domain-specific/medical-health-info.md`
- `domain-specific/legal-policy-review.md`
- `domain-specific/finance-investment-analysis.md`
- `software-engineering/security-threat-modeling.md`
- `business-operations/recruiting-evaluation.md`
- `meta/meta-skill-builder.md`

## 维护脚本更新

`scripts/skill_hub_manager.py` 的 `validate` 和 `stats` 已覆盖：

- 新增协议文件。
- `branches/manifest.yaml` 引用检查。
- `evals/cases/` schema 字段检查。
- eval case 统计。

## 高风险边界

本次升级明确收紧：

- 医疗：不诊断、不处方、不停药换药，输出红旗信号和就医准备。
- 法律：不替代律师，不给最终法律结论，要求司法辖区和合同背景。
- 金融：不构成个性化投资建议，不保证收益，不给买卖指令。
- 安全：仅防御性安全，不提供攻击链、payload、绕过、隐蔽或持久化。
- 招聘/人事：不使用受保护属性，要求岗位相关证据和公平性检查。
- 隐私/个人数据：最小化、脱敏、用途和保留边界。

## 当前建议

- 后续可增加自动化 eval runner。
- 后续可生成 manifest 到 README 的索引表。
- 后续可扩展更多非重点分支的 eval case。
- 后续可考虑 CLI 或 Web UI，但本次未把项目包装成正式包。
