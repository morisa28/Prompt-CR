# Prompt Quality Eval Cases

本目录用于验证 CodePrompt Coach 的评分器、反作弊规则和动态追问是否符合项目预期。

当前评测集包含 30 条 Prompt 质量样例，覆盖极度模糊、缺少上下文、缺少文件路径、缺少验证命令、关键词堆砌和高质量核心场景 Prompt。

运行方式：

```bash
npm.cmd run eval
```

评测集不代表真实模型执行效果，只用于本项目规则型 MVP 的回归验证和后续实验设计。
