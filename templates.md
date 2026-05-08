# CodePrompt Coach Templates

## 1. Coding Agent Task Template

**用途**：根据结构化需求生成可交给 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 的软件工程任务 prompt。

**变量**：

- `{{target_tool}}`
- `{{working_directory}}`
- `{{task_goal}}`
- `{{project_context}}`
- `{{related_files}}`
- `{{input_materials}}`
- `{{modification_scope}}`
- `{{forbidden_actions}}`
- `{{verification_commands}}`
- `{{output_format}}`
- `{{failure_handling}}`

**模板正文**：

```text
你是 {{target_tool}}，请在 {{working_directory}} 完成以下任务。

任务目标：
{{task_goal}}

项目背景：
{{project_context}}

相关文件：
{{related_files}}

输入材料：
{{input_materials}}

执行步骤：
1. 先阅读相关文件、项目配置和现有测试。
2. 确认需求、复现问题或识别当前行为。
3. 给出简短计划。
4. 只在 {{modification_scope}} 范围内修改。
5. 运行 {{verification_commands}}。
6. 输出变更报告。

硬性约束：
{{forbidden_actions}}
- 不要进行无关重构。
- 不要全仓库格式化。
- 不要删除测试或降低断言。
- 不要虚构验证结果。

失败处理：
{{failure_handling}}

最终输出：
{{output_format}}
```

## 2. Bugfix Prompt Template

```text
你是 {{target_tool}}，请在 {{working_directory}} 修复以下失败。

错误日志：
{{error_log}}

复现步骤：
{{reproduction_steps}}

要求：
1. 先读取项目配置、错误栈指向文件、相关测试和最近改动。
2. 复现失败或说明无法复现原因。
3. 区分代码、配置、依赖、环境、数据和测试问题。
4. 只做最小修复，禁止无关重构、删除测试、降低断言或注释掉失败逻辑。
5. 运行 {{verification_commands}}，至少覆盖原失败路径。

输出：根因、证据、修改文件、关键改动、验证命令与结果、未验证项和剩余风险。
```

## 3. Feature Development Prompt Template

```text
你是 {{target_tool}}，请在 {{working_directory}} 实现新功能。

功能目标：
{{feature_goal}}

用户流程：
{{user_flow}}

相关文件和技术栈：
{{related_files}}
{{project_context}}

范围：
{{modification_scope}}

非目标：
{{non_goals}}

要求：先读现有模式，再做最小实现；覆盖加载、错误、空状态、权限或边界场景；不得破坏现有 API、路由、数据结构或用户功能。

验证方式：
{{verification_commands}}
```

## 4. Test Generation Prompt Template

```text
你是 {{target_tool}}，请在 {{working_directory}} 为以下行为补充测试。

被测对象：
{{test_target}}

需覆盖行为：
{{behaviors}}

测试框架和命令：
{{test_framework}}
{{test_command}}

要求：先读取现有测试风格和 fixture；覆盖正常路径、异常路径和边界条件；不得删除、跳过、弱化或改名规避现有测试。

输出：测试策略、覆盖场景表、新增或修改测试文件、fixture/mock 说明、测试命令与结果、未覆盖风险。
```

## 5. Code Review Prompt Template

```text
你是 {{target_tool}}，请审查以下代码。

工作目录：
{{working_directory}}

审查范围：
{{review_scope}}

关注点：
{{review_focus}}

要求：以 findings 开头，按严重程度排序；每条 finding 必须给文件位置、问题影响、证据和修复建议。没有发现问题时说明剩余测试缺口和残余风险。不要只给总体印象。
```

## 6. Prompt Score Report Template

```text
总分：
各维度得分：
- clarity:
- context:
- locatableInputs:
- constraints:
- outputFormat:
- acceptanceCriteria:
- riskHandling:
- agentAdaptation:

扣分原因：
优先改进建议：
是否适合直接交给 coding agent：
最缺失的 3 个关键信息：
```

## 7. PromptMistake Template

```ts
type PromptMistake = {
  id: string;
  createdAt: string;
  scenario: string;
  originalPrompt: string;
  generatedPrompt: string;
  scoreBefore: number;
  scoreAfter: number;
  weakDimensions: string[];
  mistakeType: string;
  mistakeDescription: string;
  suggestedFix: string;
  affectedTemplate?: string;
  shouldUpdateQuestionTree: boolean;
  shouldUpdateScoringRule: boolean;
  shouldUpdatePromptTemplate: boolean;
};
```
