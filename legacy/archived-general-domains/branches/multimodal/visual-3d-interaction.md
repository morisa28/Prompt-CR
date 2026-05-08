# Visual 3D Interaction

## 1. Purpose
用于让 coding agent 在保护现有资源、材质、灯光和交互的前提下修改 3D/视觉交互。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求 3D/Spline/Blender 交互
- 用户要求旋钮拖拽、模型对齐、动画调整
- 用户要求视觉验证节点

## 3. Required Inputs
- {{working_directory}} 工作目录
- {{object_names}} 对象名称
- {{initial_view}} 初始视角
- {{current_issue}} 当前异常
- {{target_visual}} 目标视觉效果
- {{interaction_behavior}} 交互行为

缺失信息处理：
- 对象名未知时先读取场景和组件并列候选
- 不允许视觉工具时输出手动截图验证步骤
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 写清对象名称、初始视角、空间关系、目标视觉效果和交互行为
- 禁止破坏已有交互、灯光、材质和资源
- 明确是否允许视觉分析和 dev server
- 设置用户手动截图验证节点
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止替换整个 3D 场景
- 禁止删除资产或改变无关材质
- 禁止让 UI 与 3D 对象重叠
- 禁止跳过桌面/移动验证
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 目标行为
- 对象和资源
- 实现步骤
- 视觉验证
- 截图/手动检查
- 风险

## 7. Quality Checklist
- [ ] 对象和视角明确
- [ ] 交互映射可测
- [ ] 资源保护项列出
- [ ] 视觉验证路径明确
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 对象名缺失 | 改错模型 | 先列候选并确认 |
| 只改代码不看画面 | 视觉失真 | 要求截图或手动节点 |
| 破坏现有资源 | 回归大 | 列保护项 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Visual 3D Interaction 任务。

任务目标：
{{task_goal}}

输入材料：
- {{working_directory}}
- {{object_names}}
- {{initial_view}}
- {{current_issue}}
- {{target_visual}}
- {{interaction_behavior}}
- {{verification_steps}}
- {{input_materials}}

执行要求：
1. 写清对象名称、初始视角、空间关系、目标视觉效果和交互行为
2. 禁止破坏已有交互、灯光、材质和资源
3. 明确是否允许视觉分析和 dev server
4. 设置用户手动截图验证节点

硬性约束：
- 禁止替换整个 3D 场景
- 禁止删除资产或改变无关材质
- 禁止让 UI 与 3D 对象重叠
- 禁止跳过桌面/移动验证
- 必须按 {{output_format}} 输出。
- 必须满足 {{acceptance_criteria}}。

验证与自检：
- 完成后检查目标、输入、约束、输出格式和验收标准是否全部满足。
- 对缺失或不确定的信息标注“假设”或“待补充”。
- 如果无法完成，说明阻塞原因和下一步需要的输入。
```

## 10. Example
用户原始需求：

```text
帮我做一个 3D 旋钮拖拽 prompt。
```

高质量 prompt：

```text
你是 Codex，请在 `/repo/3d-web` 实现 3D 旋钮拖拽。对象名：`Knob_Main`；初始视口：1440x900；目标：拖拽旋钮映射 0-100 数值，松开后停止。先读取场景加载、事件绑定和状态文件；禁止替换场景、删除对象、破坏灯光材质或现有交互。允许启动 dev server 和浏览器截图验证。输出修改文件、交互映射、桌面/移动验证结果和手动截图检查步骤。
```
