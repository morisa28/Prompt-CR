# Code Review 场景完整示例

## 原始需求

```text
帮我 review 这个 PR，看看有没有问题。
```

## 分级问答

| Level | 问题     | 回答                                               |
| ----: | -------- | -------------------------------------------------- |
|     0 | 任务类型 | 代码审查                                           |
|     1 | 最终结果 | 输出按严重程度排序的 findings                      |
|     2 | 工作目录 | `F:/workspace/payments-api`                        |
|     2 | 审查范围 | `git diff origin/main...HEAD`                      |
|     2 | 相关文件 | `src/routes/payments.ts`、`src/services/refund.ts` |
|     3 | 关注点   | 正确性、权限、幂等性、测试缺口                     |
|     3 | 禁止事项 | 不修改文件，只输出审查意见                         |
|     4 | 验证方式 | 可建议测试，但不要声称已运行                       |

## 最终 Prompt

```text
你是 Codex，请只读审查 F:/workspace/payments-api 当前 PR。

审查范围：
git diff origin/main...HEAD

重点文件：
- src/routes/payments.ts
- src/services/refund.ts

关注点：
- 正确性
- 权限
- 幂等性
- 测试缺口

硬性约束：
- 不要修改文件。
- 不要只给总体印象。
- 不要输出无证据的猜测。
- 如需引用代码位置，尽量给文件和行号或最小代码片段。

输出格式：
1. Findings：按严重程度排序，每条包含标题、位置、影响、证据、建议修复。
2. Open questions：需要作者确认的问题。
3. Test gaps：缺失测试和建议测试。
4. Summary：简短总结。

如果没有发现问题，请明确说明，并列出剩余测试缺口或残余风险。
```
