import { toolPromptSections } from "../domain/prompt-template.ts";
import { getScenario } from "../domain/scenarios.ts";
import type { StructuredRequirement } from "./requirement-session.ts";

function listOrPlaceholder(values: string[] | undefined, placeholder: string): string {
  const clean = values?.filter(Boolean) ?? [];
  if (clean.length === 0) {
    return `[待补充: ${placeholder}]`;
  }
  return clean.map((value) => `- ${value}`).join("\n");
}

function textOrPlaceholder(value: string | undefined, placeholder: string): string {
  return value?.trim() ? value : `[待补充: ${placeholder}]`;
}

function scenarioSpecificContext(requirement: StructuredRequirement): string[] {
  const sections: string[] = [];

  if (requirement.errorLog || requirement.reproductionSteps) {
    sections.push(`错误日志：\n${textOrPlaceholder(requirement.errorLog, "error_log")}`);
    sections.push(`复现步骤：\n${textOrPlaceholder(requirement.reproductionSteps, "reproduction_steps")}`);
  }

  if (requirement.userFlow) {
    sections.push(`用户流程：\n${requirement.userFlow}`);
  }

  if (requirement.behaviors) {
    sections.push(`需覆盖行为：\n${requirement.behaviors}`);
  }

  if (requirement.reviewScope) {
    sections.push(`审查范围：\n${requirement.reviewScope}`);
  }

  if (requirement.apiContract) {
    sections.push(`API 契约输入：\n${requirement.apiContract}`);
  }

  if (requirement.businessRules) {
    sections.push(`业务规则：\n${requirement.businessRules}`);
  }

  return sections;
}

export function generatePrompt(requirement: StructuredRequirement): string {
  const scenario = getScenario(requirement.scenario);
  const template = toolPromptSections[requirement.targetTool];
  const relatedFiles = listOrPlaceholder(requirement.relatedFiles, "related_files");
  const inputMaterials = listOrPlaceholder(requirement.inputMaterials, "input_materials");
  const verification = listOrPlaceholder(requirement.verificationCommands, "verification_commands");
  const forbidden = [
    ...(requirement.forbiddenActions ?? []),
    "不要进行无关重构",
    "不要全仓库格式化",
    "不要删除现有功能或弱化测试",
    "不要虚构验证结果",
  ];
  const outputFormat = requirement.outputFormat?.length ? requirement.outputFormat : template.finalReport;

  return `${template.role}

请在 ${textOrPlaceholder(requirement.workingDirectory, "working_directory")} 完成以下任务。

任务类型：
${scenario.title}（${requirement.scenario}）

任务目标：
${textOrPlaceholder(requirement.taskGoal, "task_goal")}

项目背景：
${textOrPlaceholder(requirement.projectContext ?? requirement.techStack, "project_context")}

相关文件：
${relatedFiles}

输入材料：
${inputMaterials}

${scenarioSpecificContext(requirement).join("\n\n")}

执行步骤：
1. 先阅读相关文件、项目配置、现有测试和约束说明。
2. 复现问题或确认需求边界；无法复现或无法确认时先报告阻塞原因。
3. 给出简短实现或分析计划，说明预计修改范围。
4. 只在必要范围内修改，遵循现有代码风格和目录结构。
5. 运行验证命令；命令失败时报告失败输出和下一步建议。
6. 按最终报告格式输出变更、验证和风险。

修改范围：
${textOrPlaceholder(requirement.modificationScope, "modification_scope")}

硬性约束：
${forbidden.map((item) => `- ${item}`).join("\n")}

验收标准：
${listOrPlaceholder(requirement.acceptanceCriteria, "acceptance_criteria")}

验证方式：
${verification}

失败处理规则：
${textOrPlaceholder(requirement.failureHandling, "failure_handling")}

目标工具适配要求：
${template.executionRules.map((rule) => `- ${rule}`).join("\n")}

最终输出：
${outputFormat.map((item) => `- ${item}`).join("\n")}

自检要求：
- 检查目标、上下文、输入材料、约束、输出格式和验收标准是否齐全。
- 检查是否存在未授权范围扩大、无关重构或验证缺失。
- 检查是否存在编造文件、命令输出、测试结果或事实的风险。
- 如果无法完成或无法验证，明确说明原因，不要声称完成。`;
}
