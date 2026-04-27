# Codex CLI Adapter

## 1. 适用场景

- 通过命令行在本地仓库执行代码、测试、构建、文档和验证工作。
- 需要 shell 命令、工作目录、权限边界和命令结果报告的任务。

## 2. 不适用场景

- 未授权的网络访问、依赖安装、破坏性命令或生产系统操作。
- 缺少仓库路径且无法合理定位上下文的任务。

## 3. Prompt 构造注意事项

- 写明工作目录、sandbox/approval 约束、允许命令和禁止命令。
- 要求使用快速搜索和本地项目脚本发现上下文。
- 对需要验证的任务，给出明确命令或要求从配置识别命令。
- 命令失败时必须记录 stderr、退出码和调整后的下一步。

## 4. 必须包含的约束

- 最小改动。
- 禁止无关重构、删除测试、降低断言、隐藏错误。
- 禁止触碰用户未授权的 secrets、账号、私钥和生产数据。
- 无法运行验证时必须如实报告。

## 5. 推荐输出格式

```text
工作目录：
执行命令：
修改文件：
验证结果：
失败命令和原因：
未验证项：
后续建议：
```

## 6. 常见失败模式

- 没有说明命令权限，导致目标工具执行越界命令。
- 只让 agent “跑测试”，但没有说明失败时如何处理。
- 忽略 `.git`、构建产物、用户改动或现有 worktree 状态。

## 7. 相关资源

- `@branch://software-engineering/bugfix-debugging`
- `@branch://software-engineering/test-generation`
- `@branch://software-engineering/cli-agent`
- `@template://coding-agent/bugfix`
- `@checklist://adapter-selection`
