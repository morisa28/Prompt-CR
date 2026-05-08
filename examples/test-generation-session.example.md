# Test Generation 场景完整示例

## 原始需求

```text
给登录表单补测试。
```

## 分级问答

| Level | 问题 | 回答 |
|---:|---|---|
| 0 | 任务类型 | 测试生成 |
| 1 | 最终结果 | 为登录表单补充可运行的单元/组件测试 |
| 2 | 工作目录 | `F:/workspace/admin-web` |
| 2 | 相关文件 | `src/components/LoginForm.tsx`、`src/api/auth.ts`、`src/components/__tests__/` |
| 2 | 测试框架 | Vitest + Testing Library |
| 3 | 覆盖行为 | 空输入校验、错误密码提示、成功登录回调、提交中禁用按钮 |
| 3 | 禁止事项 | 不改业务逻辑，不跳过现有测试，不引入新测试框架 |
| 4 | 验证命令 | `npm test -- LoginForm` |

## 最终 Prompt

```text
你是 Codex，请在 F:/workspace/admin-web 为登录表单补充测试。

被测对象：
src/components/LoginForm.tsx

相关文件：
- src/api/auth.ts
- src/components/__tests__/

测试框架：
Vitest + Testing Library

需覆盖行为：
- 空输入校验
- 错误密码提示
- 成功登录回调
- 提交中禁用按钮

执行要求：
1. 先读取现有测试配置、测试风格、LoginForm 实现和 auth mock 方式。
2. 选择最小有效测试层级，优先组件测试。
3. 使用稳定的用户可见行为断言，避免过度耦合内部实现。
4. 不得删除、跳过、弱化或改名规避现有测试。
5. 不得引入新测试框架。
6. 运行 `npm test -- LoginForm` 并报告结果。

输出：
- 测试策略
- 覆盖场景表
- 新增/修改测试文件
- mock/fixture 说明
- 测试命令与结果
- 未覆盖风险
```
