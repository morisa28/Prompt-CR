# Codex Adapter

## 1. 适用场景

- 仓库内代码修改、bugfix、测试补充、文档更新和结构化文件编辑。
- 需要先读取文件、理解上下文、做最小 patch、运行验证命令的任务。

## 2. 不适用场景

- 用户只需要纯文本建议且不需要仓库上下文。
- 需要真实账号、密钥或外部登录才能完成的任务。
- 高风险生产操作未明确授权时。

## 3. Prompt 构造注意事项

- 明确 `working_directory`。
- 要求先读相关文件和配置，再修改。
- 说明允许修改范围和禁止范围。
- 对 bugfix 要求根因证据；对 feature 要求验收标准；对 docs 要求来源。

## 4. 必须包含的约束

- 禁止无关重构、全仓库格式化、删除测试、降低断言、隐藏错误。
- 不得编造文件、命令输出或验证结果。
- 无法验证时必须说明原因、已尝试命令和下一步。

## 5. 推荐输出格式

```text
任务理解：
读取的文件：
修改文件：
关键改动：
验证命令与结果：
未验证项：
剩余风险：
```

## 6. 常见失败模式

- 没有指定工作目录，导致目标工具不知道从哪里开始。
- 只说“优化项目”，导致无关重构。
- 没有验证命令，导致结果不可验收。

## 7. 相关资源

- `@branch://software-engineering/bugfix-debugging`
- `@branch://software-engineering/coding-feature-development`
- `@branch://software-engineering/repository-analysis`
- `@checklist://coding-agent/final-review`
- `@eval://software-engineering/bugfix-debugging/basic`
