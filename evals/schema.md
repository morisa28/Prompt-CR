# Eval Case Schema

每个 eval case 使用 YAML，字段保持轻量，便于人工检查和未来脚本读取。

```yaml
id: software.bugfix.basic
branch: software-engineering/bugfix-debugging
title: Fix failing build with logs
user_request: "帮我让 Codex 修复 npm run build 报错，日志如下……"
expected_primary_branch: bugfix-debugging
expected_auxiliary_branches:
  - test-generation
  - cli-agent
expected_resources:
  - "@branch://software-engineering/bugfix-debugging"
  - "@template://coding-agent/bugfix"
  - "@adapter://codex-cli"
  - "@checklist://coding-agent/final-review"
  - "@eval://software-engineering/bugfix-debugging/basic"
required_missing_inputs:
  - package manager version, if not provided
risk_level: medium
expected_prompt_features:
  - includes reproduction steps
  - requires root cause analysis before changes
  - forbids unrelated refactor
  - requires tests or build verification
  - asks for changed files summary
forbidden_prompt_features:
  - tells agent to rewrite the whole project
  - allows deleting tests
  - ignores logs
acceptance_criteria:
  - generated prompt is actionable by a coding agent
  - generated prompt includes verification commands
  - generated prompt includes rollback or minimal-change guidance
related_lessons:
  - "@lesson://prompt-failures/bugfix-missing-verification"
notes: "This eval checks prompt quality, not whether Codex actually fixes the build."
```

## 字段说明

- `id`：稳定唯一 ID，建议 `<category>.<branch>.<case>`。
- `branch`：分支路径，不带 `branches/` 前缀。
- `title`：简短标题。
- `user_request`：用于路由和 prompt 生成的原始用户请求。
- `expected_primary_branch`：期望主分支 slug。
- `expected_auxiliary_branches`：期望辅助分支 slug 列表，可为空。
- `expected_resources`：期望选中的 registry URI，例如 branch、template、checklist、adapter、safety、eval 或 lesson。
- `required_missing_inputs`：若用户未提供，生成 prompt 必须标注或追问的输入。
- `risk_level`：low、medium、high。
- `expected_prompt_features`：生成 prompt 必须包含的特征。
- `forbidden_prompt_features`：生成 prompt 不得包含的特征。
- `acceptance_criteria`：该 eval 通过条件。
- `related_lessons`：相关经验记录，可为空列表。
- `notes`：补充说明，可选。

## 质量要求

- Eval case 必须同时包含 expected 和 forbidden。
- `expected_prompt_features` 应能从 prompt 文本中判断有/无。
- `forbidden_prompt_features` 应覆盖常见越界、偷懒、幻觉或错误路由。
- `acceptance_criteria` 不应评测下游任务结果，只评测 prompt 是否可执行、可验证、边界清晰。
- 高风险 case 必须包含 safety 资源或明确安全边界。
- 工具相关 case 应包含 adapter 资源。
