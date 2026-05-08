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

function section(title: string, body: string): string {
  return `## ${title}\n${body.trim()}`;
}

function optionalText(label: string, value: string | undefined): string | null {
  return value?.trim() ? `${label}：\n${value}` : null;
}

function optionalList(label: string, values: string[] | undefined): string | null {
  const clean = values?.filter(Boolean) ?? [];
  return clean.length > 0 ? `${label}：\n${clean.map((item) => `- ${item}`).join("\n")}` : null;
}

function uniqueList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter((value, index, list) => value && list.indexOf(value) === index);
}

function knownDetails(requirement: StructuredRequirement): string {
  const details: (string | null)[] = [];

  if (requirement.scenario === "bugfix-debugging") {
    details.push(optionalText("错误日志", requirement.errorLog));
    details.push(optionalText("复现步骤", requirement.reproductionSteps));
    details.push(optionalText("预期行为", requirement.expectedBehavior));
    details.push(optionalText("实际行为", requirement.actualBehavior));
    details.push("回归验证：修复后必须重新运行复现命令，并尽量运行相关测试。");
  }

  if (requirement.scenario === "feature-development") {
    details.push(optionalText("用户故事 / 用户流程", requirement.userFlow));
    details.push(optionalText("UI / API / 数据流", requirement.apiContract));
    details.push(optionalList("异常与边界状态", requirement.uiStates));
    details.push("功能边界：不要混入未要求的新功能，保持现有行为兼容。");
  }

  if (requirement.scenario === "test-generation") {
    details.push(optionalText("被测对象", requirement.testTarget ?? requirement.relatedFiles?.join("\n")));
    details.push(optionalText("测试类型", requirement.testType));
    details.push(optionalText("覆盖路径", requirement.behaviors));
    details.push(
      optionalText("测试框架与命令", requirement.testFramework ?? requirement.verificationCommands?.join("\n")),
    );
    details.push("Mock / stub 要求：优先复用项目现有测试模式，不降低现有覆盖质量。");
  }

  const clean = details.filter(Boolean) as string[];
  return clean.length > 0 ? clean.join("\n\n") : "无专属细节；请先从相关文件和原始需求中确认。";
}

export function generatePrompt(requirement: StructuredRequirement): string {
  const scenario = getScenario(requirement.scenario);
  const template = toolPromptSections[requirement.targetTool];
  const forbidden = uniqueList([
    ...(requirement.forbiddenActions ?? []),
    "不要进行无关重构",
    "不要全仓库格式化",
    "不要删除现有测试或弱化断言",
    "不要删除现有功能",
    "不要新增依赖，除非说明必要性并获得允许",
    "不要虚构验证结果、命令输出或已读取文件",
  ]);
  const outputFormat = requirement.outputFormat?.length ? requirement.outputFormat : template.finalReport;

  return [
    section("1. 角色与目标工具", `${template.role}\n目标工具：${requirement.targetTool}`),
    section("2. 工作目录", textOrPlaceholder(requirement.workingDirectory, "working_directory")),
    section(
      "3. 任务目标",
      `${textOrPlaceholder(requirement.taskGoal, "task_goal")}\n任务类型：${scenario.title}（${requirement.scenario}）`,
    ),
    section("4. 项目背景", textOrPlaceholder(requirement.projectContext ?? requirement.techStack, "project_context")),
    section("5. 相关文件", listOrPlaceholder(requirement.relatedFiles, "related_files")),
    section(
      "6. 已知问题 / 需求细节",
      `${optionalList("输入材料", requirement.inputMaterials) ?? "输入材料：请从相关文件和原始需求中确认。"}\n\n${knownDetails(requirement)}`,
    ),
    section("7. 修改范围", textOrPlaceholder(requirement.modificationScope, "modification_scope")),
    section("8. 禁止事项", forbidden.map((item) => `- ${item}`).join("\n")),
    section(
      "9. 执行步骤",
      [
        "1. 先阅读相关文件、项目配置、现有测试和约束说明，不要直接修改。",
        "2. 复现问题或确认需求边界；无法复现或无法确认时先报告阻塞原因。",
        "3. 给出简短实现或测试计划，说明预计修改范围。",
        "4. 只在必要范围内修改，遵循现有代码风格和目录结构。",
        "5. 运行验证命令；命令失败时报告失败输出和下一步建议。",
        "6. 按最终报告格式输出变更、验证、未验证项和风险。",
      ].join("\n"),
    ),
    section("10. 验证命令", listOrPlaceholder(requirement.verificationCommands, "verification_commands")),
    section(
      "11. 输出报告格式",
      outputFormat
        .concat(["未验证项", "剩余风险"])
        .filter((item, index, list) => list.indexOf(item) === index)
        .map((item) => `- ${item}`)
        .join("\n"),
    ),
    section("12. 失败处理规则", textOrPlaceholder(requirement.failureHandling, "failure_handling")),
    section(
      "13. 自检清单",
      [
        "- 目标、上下文、输入材料、约束、输出格式和验收标准是否齐全。",
        "- 是否存在未授权范围扩大、无关重构、删除测试或新增依赖。",
        "- 是否运行了验证命令，并报告实际结果。",
        "- 如果无法运行测试，是否说明原因和替代检查方式。",
        "- 是否存在编造文件、命令输出、测试结果或事实的风险。",
        "- 最终报告是否包含修改文件、验证命令、实际结果、未验证项和剩余风险。",
      ].join("\n"),
    ),
    section("目标工具适配要求", template.executionRules.map((rule) => `- ${rule}`).join("\n")),
  ].join("\n\n");
}
