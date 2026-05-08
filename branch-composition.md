# Branch Composition

本文件说明如何把一个主分支和少量辅助分支组合成稳定的 prompt 生成策略。

## 1. 主分支

主分支负责用户最终交付物。每次路由只能有一个主分支。

选择主分支时优先问：

- 用户最终想让目标模型产出什么？
- 交付物是代码修改、测试、仓库报告、PRD、RAG 方案、数据结论、正式报告还是安全边界内的信息整理？
- 如果只能保留一个分支，哪个分支最能定义任务完成标准？

## 2. 辅助分支

辅助分支用于补充执行环境、风险边界、输出形式、验证方式或上下文处理。辅助分支不应抢占主分支。

常见辅助分支类型：

- 工具适配：`software-engineering/cli-agent`。
- 验证：`software-engineering/test-generation`。
- 只读规划：`software-engineering/plan-mode`。
- 报告输出：`documents-research/report-writing`。
- 文档引用：`documents-research/documentation-analysis`、`ai-systems/knowledge-base-rag`。
- 安全边界：`security-threat-modeling` 或 domain-specific 高风险分支。

## 3. 何时需要多个分支

出现以下情况时需要组合：

- 用户交付物需要另一个分支定义验证方式。
- 用户指定目标工具或运行环境。
- 任务涉及高风险领域。
- 输出形态是报告、表格、JSON、开发 Agent prompt 或可执行计划。
- 输入上下文跨文档、数据、代码和图片。

## 4. 组合顺序

1. 先用主分支定义目标、输入、步骤、验收。
2. 再用辅助分支加入工具适配、验证、格式或安全规则。
3. 最后用 `common-principles.md` 统一缺失输入、约束优先级、幻觉控制和自检。

辅助分支数量建议：

- 普通任务：0 到 1 个。
- 中等复杂任务：1 到 2 个。
- 高风险或跨域任务：最多 3 个，超过 3 个时应拆成多阶段 prompt。

## 5. 冲突处理

- 主分支冲突：按最终交付物决定唯一主分支。
- 辅助分支过多：保留能改变安全边界、验证方式或执行环境的分支。
- 高风险冲突：高风险安全边界优先于用户风格偏好和输出速度。
- 用户要求与安全约束冲突：拒绝越界部分，保留安全替代任务。
- 代码 + 文档 + 产品混合：若最终交付物是开发 Agent prompt，主分支使用产品或开发分支，报告写作只作为输出辅助。

## 6. 常见组合模式

| 需求模式                                                  | 主分支                        | 辅助分支                                             |
| --------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| Bugfix + Test Generation + Coding Agent                   | `bugfix-debugging`            | `test-generation`, `cli-agent`                       |
| Repository Analysis + Report Writing                      | `repository-analysis`         | `report-writing`                                     |
| PRD + Development Prompt + Acceptance Criteria            | `product-requirements`        | `coding-feature-development`, `test-generation`      |
| RAG + Data Governance + Citation                          | `knowledge-base-rag`          | `security-threat-modeling`, `documentation-analysis` |
| Medical Info + Safety Boundary + Structured Summary       | `medical-health-info`         | `report-writing`                                     |
| Legal Summary + Jurisdiction + Risk Checklist             | `legal-policy-review`         | `documentation-analysis`, `report-writing`           |
| Financial Analysis + Risk Disclosure + Data Assumptions   | `finance-investment-analysis` | `data-analysis`, `report-writing`                    |
| Security Review + Threat Modeling + Defensive Constraints | `security-threat-modeling`    | `code-review`, `cli-agent`                           |
| Prompt Improvement + Evaluation + Template Refactoring    | `meta-skill-builder`          | `prompt-review`, `prompt-template-builder`           |

## 7. 示例

用户需求：

```text
帮我写一个 prompt，让 Codex 修复 npm run build 报错，补测试，并且最后输出一份变更报告。
```

路由：

- 主分支：`software-engineering/bugfix-debugging`。
- 辅助分支：`software-engineering/test-generation`、`software-engineering/cli-agent`、`documents-research/report-writing`。
- 风险等级：Medium。
- 缺失输入：完整日志、工作目录、测试命令、环境版本。

构造策略：

- 用 bugfix 分支定义根因分析、最小修复和禁止事项。
- 用 test-generation 加入回归测试和断言要求。
- 用 cli-agent 加入命令权限、失败处理和最终报告。
- 用 report-writing 约束输出为根因、改动、验证、剩余风险。
