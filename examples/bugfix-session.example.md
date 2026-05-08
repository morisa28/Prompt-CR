# Bugfix 场景完整示例

## 原始需求

```text
帮我写一个 prompt，让 Codex 修复 npm run build 报错，不要乱改。
```

## 分级问答

| Level | 问题 | 回答 |
|---:|---|---|
| 0 | 你想让 AI 帮你完成哪类代码生成任务？ | Bug 修复与调试 |
| 1 | 最终希望得到什么结果？ | 修复构建失败，并保持现有页面行为不变 |
| 2 | 工作目录在哪里？ | `F:/workspace/course-app` |
| 2 | 错误日志是什么？ | `TS2322: Type 'undefined' is not assignable to type 'Course'` |
| 2 | 复现步骤是什么？ | `npm run build` |
| 2 | 相关文件在哪里？ | `src/pages/CourseDetail.tsx`、`src/api/course.ts` |
| 3 | 允许修改范围是什么？ | 只改课程详情数据加载和类型处理相关文件 |
| 3 | 禁止事项是什么？ | 不新增依赖、不删除测试、不全仓库格式化、不改路由 |
| 4 | 如何验证？ | `npm run build`、`npm test -- --runInBand` |

## 评分摘要

- 原始 prompt：约 38/100，缺少工作目录、日志、相关文件、验证命令。
- 结构化需求：约 86/100，可交给 coding agent。

## 最终 Prompt

```text
你是 Codex，一名严谨的软件工程 Agent。

请在 F:/workspace/course-app 完成以下任务。

任务类型：
Bug 修复与调试（bugfix-debugging）

任务目标：
修复 npm run build 的 TS2322 类型错误，并保持现有页面行为不变。

项目背景：
React + TypeScript 项目，课程详情页从 API 加载课程数据。

相关文件：
- src/pages/CourseDetail.tsx
- src/api/course.ts

错误日志：
TS2322: Type 'undefined' is not assignable to type 'Course'

复现步骤：
npm run build

执行步骤：
1. 先阅读 package.json、TypeScript 配置、相关源码和现有测试。
2. 复现 `npm run build` 或说明无法复现原因。
3. 根据错误栈定位根因，区分类型定义、空值处理、API 返回和组件渲染问题。
4. 只在课程详情数据加载和类型处理相关范围内做最小修复。
5. 运行 `npm run build` 和 `npm test -- --runInBand`。
6. 输出根因、修改文件、关键改动、验证命令与结果、未验证项和剩余风险。

硬性约束：
- 不要进行无关重构。
- 不要新增依赖。
- 不要删除测试或降低断言。
- 不要全仓库格式化。
- 不要修改路由。
- 不要虚构验证结果。
```

## 可新增 Lesson

如果用户没有提供日志，应记录“bugfix 缺少错误日志导致 agent 猜测修复”的错题。
