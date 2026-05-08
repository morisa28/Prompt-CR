# Database Migration

## 1. Purpose

用于为数据库 schema 修改、ORM migration、数据迁移、字段新增/删除/重命名、索引调整、数据回填、零停机迁移和迁移失败回滚生成安全 prompt。本分支默认保护线上数据，生产数据库任务优先 plan，不直接执行。

## 2. Trigger Conditions

- 用户提到 database migration、schema、migration、Prisma、TypeORM、Alembic、Django migrations、Rails migrations。
- 用户要求新增、删除、重命名字段，调整索引、约束、默认值、外键或唯一性。
- 用户要求数据回填、零停机迁移、迁移失败排查或 rollback 方案。

## 3. Required Inputs

- {{database_type}} 数据库类型和版本。
- {{orm_or_migration_tool}} ORM 或 migration 工具。
- {{current_schema}} 当前 schema 或 schema 文件路径。
- {{target_schema}} 目标 schema。
- {{migration_goal}} 迁移目标。
- {{data_volume}} 数据量和表大小。
- {{downtime_tolerance}} 可接受停机时间。
- {{backup_status}} 备份状态。
- {{rollback_plan}} 回滚计划。
- {{affected_tables}} 受影响表。
- {{affected_services}} 受影响服务或 API。

缺失信息处理：

- 备份状态未知时必须把执行生产迁移列为阻塞问题。
- 数据量未知时要求先估算表大小、索引大小和锁表风险。
- 生产环境默认只输出方案、migration 文件建议和验证步骤，不直接执行 migration。

## 4. Prompt Construction Rules

- 必须先读取现有 schema、migration 历史、ORM 配置和受影响代码路径。
- 必须识别破坏性变更，例如删除字段、重命名字段、变更类型、收紧 null/unique/foreign key。
- 必须区分 schema migration 和 data migration，并明确执行顺序。
- 必须要求生成可回滚方案和备份要求。
- 必须要求在本地或 staging 测试迁移和回滚。
- 必须说明对线上数据、旧版本应用、读写路径和部署顺序的影响。
- 必须检查索引、约束、默认值、外键、唯一性、空值处理和大表锁表风险。

## 5. Hard Constraints

- 禁止无备份执行破坏性操作。
- 禁止直接删除字段或重命名字段导致数据丢失，除非有分阶段迁移和回滚。
- 禁止在生产数据库直接执行未经测试的 migration。
- 禁止忽略旧版本应用兼容性。
- 必须包含 rollback、备份、staging 验证和数据一致性检查。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- 当前 schema 和 migration 历史摘要。
- 破坏性变更识别。
- schema migration 方案。
- data migration / backfill 方案。
- 部署顺序和兼容性策略。
- 备份、rollback 和验证步骤。
- 受影响服务与残留风险。

## 7. Quality Checklist

- [ ] 数据库类型和 migration 工具明确。
- [ ] 当前 schema、目标 schema 和 migration 历史被要求读取。
- [ ] schema migration 与 data migration 分开。
- [ ] 删除、重命名、类型变更、not null、unique、foreign key 风险被识别。
- [ ] 大表锁表和数据量影响被要求评估。
- [ ] 备份状态和 rollback 明确。
- [ ] 生产环境默认 plan，不直接执行。
- [ ] staging 测试和数据一致性验证明确。

## 8. Common Mistakes

| Common Mistake         | Risk                     | Repair                                  |
| ---------------------- | ------------------------ | --------------------------------------- |
| 直接删除字段           | 数据不可恢复             | 分阶段弃用、备份、回填和延迟删除        |
| 重命名字段一步到位     | 旧代码读写失败或数据丢失 | 增新字段、双写、回填、切读、再清理      |
| 忽略旧版本应用兼容     | 滚动发布期间出错         | 设计向后兼容迁移顺序                    |
| 未考虑大表锁表         | 线上阻塞                 | 评估数据量、索引创建方式和批量回填      |
| 未准备 rollback 或备份 | 失败无法恢复             | 要求备份、回滚脚本和恢复演练            |
| 未测试 migration       | 生产失败                 | 要求本地/staging apply 和 rollback 验证 |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请设计数据库迁移 prompt。

数据库：{{database_type}}
ORM/migration 工具：{{orm_or_migration_tool}}
当前 schema：{{current_schema}}
目标 schema：{{target_schema}}
迁移目标：{{migration_goal}}
数据量：{{data_volume}}
停机容忍：{{downtime_tolerance}}
备份状态：{{backup_status}}
回滚计划：{{rollback_plan}}
受影响表：{{affected_tables}}
受影响服务：{{affected_services}}

执行要求：
1. 先读取现有 schema、migration 历史、ORM 配置和受影响代码。
2. 标出破坏性变更和旧版本应用兼容风险。
3. 区分 schema migration、data migration、backfill 和部署顺序。
4. 生产环境只输出方案，不直接执行；执行前必须有备份和 rollback。
5. 在本地或 staging 验证 apply、rollback、数据一致性和受影响服务测试。

约束：
- 禁止无备份执行破坏性操作。
- 禁止直接删除或重命名字段导致数据丢失。
- 必须检查索引、约束、默认值、外键、唯一性和空值处理。

输出格式：
现状、风险、分阶段迁移方案、migration 文件建议、backfill 方案、部署顺序、rollback、验证步骤、剩余风险。
```

## 10. Example

用户原始需求：

```text
让 AI 帮我设计一个数据库迁移方案，给 users 表加字段但不能影响线上。
```

高质量 prompt：

```text
你是 Codex，请为线上 PostgreSQL 设计 schema migration 方案：给 `users` 表新增 `last_seen_at` 字段，不能影响线上。先读取 Prisma schema、migration 历史、访问 `users` 的服务和部署脚本。请只 plan，不直接执行生产 migration。输出分阶段方案：新增 nullable 字段、应用兼容改动、批量 backfill、读写切换、约束收紧可行性、备份与 rollback、staging 验证命令和生产发布检查。必须评估表数据量、锁表风险、索引需求和旧版本应用兼容性。
```
