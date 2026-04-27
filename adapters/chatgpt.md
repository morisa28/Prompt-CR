# ChatGPT Adapter

## 1. 适用场景

- Prompt 改写、文档总结、报告草拟、数据分析任务设计、PRD、RAG 方案和高风险信息整理。
- 需要清晰结构、引用要求、不确定性说明和人工复核路径的任务。

## 2. 不适用场景

- 需要直接编辑本地仓库、运行 shell 命令或验证构建的任务，除非只是生成给 coding agent 的 prompt。
- 需要实时事实、价格、法规或外部资料时，必须要求来源和日期。

## 3. Prompt 构造注意事项

- 明确输入材料、输出结构、事实/假设/推断分离规则。
- 对研究和 RAG 任务要求引用。
- 对高风险领域必须组合 `@safety://...`。

## 4. 必须包含的约束

- 不得编造来源、数据、法律条文、医学事实或金融数据。
- 缺少依据时写“未提供依据”或“需要补充材料”。
- 高风险任务只能输出信息整理、风险框架或专业咨询问题。

## 5. 推荐输出格式

```text
需求理解：
已知材料：
假设和缺口：
结构化输出：
引用/依据：
风险边界：
下一步：
```

## 6. 常见失败模式

- 把缺失信息补成事实。
- 没有区分事实、推断和建议。
- 高风险任务给出越界结论。

## 7. 相关资源

- `@branch://general-prompt/prompt-rewrite`
- `@branch://documents-research/report-writing`
- `@branch://domain-specific/medical-health-info`
- `@branch://domain-specific/legal-policy-review`
- `@branch://domain-specific/finance-investment-analysis`
- `@checklist://safety-selection`
