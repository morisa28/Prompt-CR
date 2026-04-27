# Prompt Lessons

`lessons/` 是 Prompt Engineering Skill Hub 的项目经验库。它不是运行时长期记忆、数据库、用户画像系统或 Agent 插件；它只记录可复用的失败模式、成功模式和改进建议，用来反向改进 router、branch、template、checklist、eval、adapter 和 safety 资源。

## 记录什么

- 路由失败：主分支选错、辅助分支遗漏、安全边界未触发。
- Prompt 生成失败：缺少输入、验证、输出格式、禁止事项或验收标准。
- 高风险越界：医疗诊断、法律结论、投资买卖建议、攻击性安全步骤、隐私泄露。
- 成功模式：某类任务中已证明稳定的资源组合、输出结构和检查方式。
- 改进建议：registry、eval、examples、checklists 或分支文档的可执行修改方向。

## 不记录什么

- 不记录用户账号、密钥、身份信息、患者详情、合同原文、财务账户、候选人隐私等敏感内容。
- 不保存完整私人对话，只记录抽象后的触发条件和失败模式。
- 不把 lessons 当作事实来源。需要事实时仍应引用用户材料、代码、文档、数据或知识库。

## Lesson 字段

```yaml
id: lesson.bugfix.missing-log.001
type: prompt-failure
related_resources:
  - "@branch://software-engineering/bugfix-debugging"
trigger: "用户只说 build 报错，但没有提供日志"
failure_mode: "生成的 prompt 直接要求修改代码，缺少先获取日志和复现信息的步骤"
root_cause: "bugfix 分支没有把错误日志标记为阻塞输入"
fix: "在 router、branch、checklist 中明确：没有错误日志时不得猜测修复"
update_targets:
  - router.md
  - branches/software-engineering/bugfix-debugging.md
severity: medium
status: open
```

## 使用方式

1. 路由后，根据 `metadata/resources.yaml` 查找相关 `@lesson://...`。
2. 如果 lesson 的 `trigger` 与当前用户需求匹配，把 `fix` 注入 prompt 构造策略。
3. 如果生成的 prompt 暴露新失败模式，建议新增 lesson，并在 `update_targets` 指向需要修改的资源。
4. 当对应文档、模板或 eval 已修复，更新 `status` 为 `resolved` 或 `monitoring`。
