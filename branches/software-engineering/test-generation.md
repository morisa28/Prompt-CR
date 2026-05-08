# Test Generation

## 1. Purpose

用于让 agent 为指定行为生成可运行、可维护、可验证的测试，包括单元测试、集成测试、E2E 测试、回归测试和覆盖率补强。

不用于用测试掩盖错误、替代真实 bugfix、写无法运行的表面测试或随意改业务逻辑。

## 2. Trigger Conditions

明确命中：

- 用户要求写测试、补测试、提升覆盖率。
- bugfix 后需要回归测试。
- 用户要求单元、集成、E2E、快照或端到端验证。

可能命中：

- 用户要求验收新功能，测试生成作为辅助分支。
- 用户要求构建质量门禁。

不应命中：

- 用户只要修复当前错误，主分支是 `bugfix-debugging`。
- 用户要实现功能，主分支是 `coding-feature-development`。
- 用户只要测试计划但不生成测试，可作为计划输出而不是代码修改。

相似分支区别：

- `bugfix-debugging` 修复失败，测试是验证辅助。
- `code-review` 找缺陷，测试可作为建议。
- `devops-ci` 把测试接入 pipeline。

## 3. Required Inputs

必需输入：

- `{{working_directory}}` 工作目录。
- `{{test_target}}` 被测对象：函数、组件、接口、流程或 bug。
- `{{behaviors}}` 需要覆盖的行为。
- `{{test_level}}` unit、integration、e2e、regression。
- `{{test_framework}}` 测试框架。
- `{{test_command}}` 测试命令。

可选输入：

- `{{fixtures}}` fixture、mock、测试数据。
- `{{coverage_goal}}` 覆盖目标。
- `{{existing_tests}}` 现有测试路径。
- `{{edge_cases}}` 边界条件。

缺失时处理：

- 测试框架未知：让 agent 读取配置和现有测试风格。
- 测试命令未知：让 agent 从 package/pyproject/Cargo 等配置识别并报告。
- 行为列表缺失：先从用户目标和源码提取关键行为，标注假设。
- 依赖外部服务：优先 mock、fixture 或本地测试环境。

## 4. Prompt Construction Rules

- 目标定义：测试应保护具体行为，而不是追求空泛覆盖率。
- 上下文整理：先读测试配置、被测代码、现有测试、fixture 和错误历史。
- 范围设计：区分 unit、integration、e2e 和 regression，选择最小有效测试层级。
- 场景覆盖：正常路径、异常路径、边界条件、权限/输入校验、回归路径。
- 断言原则：断言用户可见行为、公开 API 或稳定契约，避免过度耦合实现细节。
- 验证测试有效：要求先看现有失败或手动确认测试能失败，再确认修复后通过；无法做到时说明原因。
- 工具适配：Coding agent 必须运行测试命令并报告结果。

## 5. Hard Constraints

- 不得删除、跳过、弱化或改名规避现有测试。
- 不得为通过测试随意改业务逻辑；若发现真实 bug，必须说明证据并最小修复。
- 不得依赖外部不稳定服务、真实支付、真实邮件或生产数据。
- 不得只写 smoke test 或快照来假装覆盖关键行为。
- 不得引入新测试框架，除非用户允许并说明必要性。

## 6. Output Format

最终 prompt 应要求目标模型输出：

```text
测试策略：
测试层级：
覆盖场景表：
新增/修改测试文件：
fixture/mock 说明：
测试命令与结果：
未覆盖原因：
```

## 7. Quality Checklist

- [ ] 是否明确被测对象和行为？
- [ ] 是否区分 unit、integration、e2e、regression？
- [ ] 是否覆盖正常、异常、边界和回归路径？
- [ ] 是否沿用项目已有测试框架和风格？
- [ ] 是否禁止删除、跳过或弱化测试？
- [ ] 是否断言行为而不是脆弱实现细节？
- [ ] 是否要求运行测试命令并报告结果？
- [ ] 是否说明未覆盖项和原因？

## 8. Common Mistakes

| Common Mistake            | Risk           | Repair                              |
| ------------------------- | -------------- | ----------------------------------- |
| 只测 happy path           | 缺少缺陷保护   | 列出异常、边界和回归路径            |
| 断言内部实现细节          | 重构时测试易碎 | 断言公开行为、输出、状态或 API 契约 |
| 只写快照或浅层 smoke test | 覆盖表面       | 明确关键断言和失败条件              |
| 不运行测试                | 不知道是否可用 | 要求执行命令或说明无法运行原因      |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请在 {{working_directory}} 为 {{test_target}} 补充测试。

被测行为：
{{behaviors}}

测试层级：
{{test_level}}

测试框架和命令：
{{test_framework}}
{{test_command}}

执行要求：
1. 先读取测试配置、被测代码、现有测试风格和 fixture/mock。
2. 区分 unit、integration、e2e、regression 的适用范围，选择最小有效测试层级。
3. 覆盖正常路径、异常路径、边界条件和回归路径。
4. 断言公开行为或稳定契约，避免过度耦合实现细节。
5. 禁止删除、跳过、弱化现有测试；禁止为通过测试随意改业务逻辑。
6. 运行 {{test_command}}，输出测试结果。

输出格式：
测试策略、测试层级、覆盖场景表、新增/修改测试文件、fixture/mock、命令结果、未覆盖原因。
```

## 10. Example

用户原始需求：

```text
给登录接口补测试，覆盖错误密码、缺字段和锁定用户。
```

路由判断：

- 主分支：`software-engineering/test-generation`
- 辅助分支：`software-engineering/cli-agent`
- 风险等级：Medium

高质量 prompt：

```text
你是 Codex，请在 `/repo/api` 为登录接口补充测试。先读取测试配置、登录路由、认证服务、现有测试和 fixture。使用项目已有测试框架覆盖：正确登录、错误密码、缺少字段、锁定用户、速率限制或等价边界。断言响应码、错误结构、认证状态和副作用。禁止删除、跳过或弱化现有测试；禁止为通过测试随意改业务逻辑。运行 `[test_command]`，最终输出测试策略、覆盖场景表、新增/修改测试文件、测试命令与结果、未覆盖原因。
```

质量检查结果：

- [x] 明确测试层级和行为。
- [x] 覆盖正常、异常和边界。
- [x] 禁止表面测试和弱化断言。
- [x] 包含验证命令。
