# API Design

## 1. Purpose

用于为 REST、GraphQL、RPC/gRPC、OpenAPI、接口字段、鉴权、错误码、版本控制、API 文档和前后端联调生成 prompt。本分支定义接口契约；需要实现代码时组合 `coding-feature-development`，需要测试时组合 `test-generation`。

## 2. Trigger Conditions

- 用户提到 REST API、GraphQL、gRPC、OpenAPI、接口设计、请求响应、联调。
- 用户要求设计资源模型、字段、鉴权、错误码、分页、排序、过滤、幂等性或版本控制。
- 用户要求输出 API 文档、示例请求响应或测试场景。

## 3. Required Inputs

- {{api_goal}} API 目标。
- {{api_style}} API 风格：REST、GraphQL、RPC/gRPC。
- {{consumer}} 调用方和核心用例。
- {{resource_model}} 资源模型。
- {{auth_method}} 鉴权方式。
- {{request_fields}} 请求字段。
- {{response_fields}} 响应字段。
- {{error_cases}} 错误场景。
- {{versioning_requirement}} 版本策略。
- {{rate_limit_requirement}} 限流要求。
- {{openapi_required}} 是否需要 OpenAPI。

缺失信息处理：

- 调用方未知时必须先列调用场景和消费者假设。
- 鉴权未知时按“必须明确鉴权和权限边界”处理，不默认公开接口。
- 版本策略未知时要求输出向后兼容假设和破坏性变更处理。

## 4. Prompt Construction Rules

- 必须先明确 API 使用者、核心用例、资源模型和非目标。
- 必须定义资源、操作、路径/方法或 schema、请求字段、响应字段和状态码。
- 必须要求错误码和错误响应格式，并覆盖权限、校验、资源不存在、限流和服务错误。
- 必须要求鉴权方式、角色权限和敏感字段处理。
- 必须要求分页、排序、过滤、幂等性和 rate limit 规则，如适用。
- 必须要求兼容性与版本策略，明确 breaking change 的处理。
- 必须要求输出 OpenAPI 或接口表格，如用户要求或用于联调。
- 必须提供示例请求、示例响应和测试场景。

## 5. Hard Constraints

- 禁止只写 endpoint 不写请求/响应结构。
- 禁止忽略鉴权、权限边界和错误处理。
- 禁止破坏向后兼容而不说明版本策略。
- 禁止把内部字段或敏感字段默认暴露。
- 必须包含示例请求响应、错误响应和测试场景。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- API 目标和调用方。
- 资源模型和接口清单。
- 请求/响应 schema。
- 鉴权与权限规则。
- 错误码和错误响应格式。
- 分页、排序、过滤、幂等、限流。
- OpenAPI 片段或接口表格。
- 示例请求响应和测试场景。

## 7. Quality Checklist

- [ ] API 使用者和核心用例明确。
- [ ] 资源模型、路径/操作、请求和响应明确。
- [ ] 鉴权和权限边界明确。
- [ ] 错误码和错误响应格式明确。
- [ ] 分页、排序、过滤、幂等性和限流按需定义。
- [ ] 版本策略和向后兼容要求明确。
- [ ] OpenAPI 或接口表格按需输出。
- [ ] 示例请求响应和测试场景完整。

## 8. Common Mistakes

| Common Mistake | Risk               | Repair                           |
| -------------- | ------------------ | -------------------------------- |
| 只写 endpoint  | 前后端无法联调     | 定义请求、响应、状态码和示例     |
| 忽略错误处理   | 客户端无法处理失败 | 设计错误码、错误体和常见错误     |
| 忽略鉴权       | 数据越权           | 写清 auth、角色和字段权限        |
| 命名不一致     | API 难维护         | 统一资源命名、字段风格和错误格式 |
| 破坏向后兼容   | 老客户端失败       | 给版本策略和弃用计划             |
| 没有示例       | 使用方误解         | 提供 curl/JSON 示例和测试场景    |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请设计 API。

API 目标：{{api_goal}}
API 风格：{{api_style}}
调用方：{{consumer}}
资源模型：{{resource_model}}
鉴权方式：{{auth_method}}
请求字段：{{request_fields}}
响应字段：{{response_fields}}
错误场景：{{error_cases}}
版本策略：{{versioning_requirement}}
限流要求：{{rate_limit_requirement}}
是否需要 OpenAPI：{{openapi_required}}

执行要求：
1. 先明确使用者、核心用例、非目标和资源模型。
2. 定义接口路径/操作、请求 schema、响应 schema、状态码和错误响应格式。
3. 写清鉴权、权限边界、敏感字段和 rate limit。
4. 按需定义分页、排序、过滤、幂等性和版本策略。
5. 输出 OpenAPI 或接口表格，并提供示例请求、示例响应和测试场景。

输出格式：
API 概览、接口表、schema、错误码、鉴权、兼容性、OpenAPI、示例、测试场景、待确认问题。
```

## 10. Example

用户原始需求：

```text
帮我写一个 REST API 设计 prompt，要包含 OpenAPI、错误码和鉴权。
```

高质量 prompt：

```text
请设计一个 REST API，用于让前端管理项目任务。调用方是 Web 前端；资源包括 `Project` 和 `Task`；鉴权使用 Bearer JWT，只有项目成员可读写。请输出接口表、请求/响应 JSON schema、错误码和统一错误响应、分页/排序/过滤规则、幂等性要求、版本策略、OpenAPI 3.1 片段、curl 示例和测试场景。必须覆盖 401、403、404、409、422、429 和 5xx；禁止暴露内部字段或忽略权限边界。
```
