# Marketing Content

## 1. Purpose
用于按受众、渠道、转化目标和品牌语气生成多版本营销内容。 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
- 用户要求营销文案/SEO/短视频脚本
- 用户要求小红书或邮件营销
- 用户要求 A/B 测试文案

## 3. Required Inputs
- {{audience}} 目标受众
- {{channel}} 渠道
- {{offer}} 产品或活动
- {{conversion_goal}} 转化目标
- {{tone}} 语气

缺失信息处理：
- 受众未知时先输出假设画像
- 合规限制未知时避免夸大功效和绝对化承诺
- 涉及安全、金钱、医疗、法律、生产数据或大范围改动时，缺失的关键边界必须标注为阻塞问题。
- 非阻塞缺失项使用 `[待补充: field]`，并在最终 prompt 中要求目标模型标注假设。

## 4. Prompt Construction Rules
- 明确目标受众、渠道和转化目标
- 控制语气风格
- 生成多个版本
- 加入 A/B 测试变量和指标
- 保留产品事实
- 需要适配 Codex、Codex CLI、Claude Code、Gemini CLI 或 ChatGPT 时，必须加入目标工具的工作方式、权限边界和最终报告格式。

## 5. Hard Constraints
- 禁止虚假承诺或无法证明的绝对化表达
- 禁止忽略渠道格式限制
- 禁止把不同受众混在一版
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
- 受众假设
- 核心卖点
- 多版本文案
- A/B 测试变量
- 投放指标
- 合规检查

## 7. Quality Checklist
- [ ] 渠道格式匹配
- [ ] CTA 明确
- [ ] 每版差异可测试
- [ ] 事实和承诺可证明
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。
- [ ] 目标工具的执行环境和限制已写明。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 只有一版 | 无法比较 | 生成多版并标变量 |
| 卖点不绑定受众痛点 | 转化弱 | 先画像和场景 |
| 夸大承诺 | 合规风险 | 只用可证明事实 |

## 9. Reusable Template
```text
你是 {{target_ai_tool}}，请处理以下 Marketing Content 任务。

任务目标：
{{task_goal}}

输入材料：
- {{audience}}
- {{channel}}
- {{offer}}
- {{conversion_goal}}
- {{tone}}
- {{ab_test_metric}}
- {{input_materials}}

执行要求：
1. 明确目标受众、渠道和转化目标
2. 控制语气风格
3. 生成多个版本
4. 加入 A/B 测试变量和指标
5. 保留产品事实

硬性约束：
- 禁止虚假承诺或无法证明的绝对化表达
- 禁止忽略渠道格式限制
- 禁止把不同受众混在一版
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
生成小红书营销文案。
```

高质量 prompt：

```text
请为 `[offer]` 生成小红书文案，目标受众是 `[audience]`，转化目标是引导收藏和私信咨询。输出 5 个标题、3 个正文版本、标签建议和 A/B 测试方案。每版必须有不同钩子：痛点、结果、故事。禁止夸大功效或使用无法证明的绝对化表达。
```
