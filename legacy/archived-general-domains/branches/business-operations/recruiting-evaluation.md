# Recruiting Evaluation

## 1. Purpose

用于为简历筛选、面试评估、岗位匹配、面试题设计和面试记录总结生成公平、证据驱动、岗位相关的 prompt。

不用于基于受保护属性排序候选人、给绝对录用/淘汰结论、替代 HR/法律合规判断或做歧视性筛选。

## 2. Trigger Conditions

明确命中：
- 用户要求根据 JD、简历、面试记录评估候选人。
- 用户要求设计面试问题、评分表、岗位匹配矩阵。
- 用户要求避免偏见或提升招聘一致性。

可能命中：
- 客服、销售、技术岗位等面试模拟可组合 `roleplay-simulation`。
- 招聘报告可组合 `report-writing`。

不应命中：
- 用户要求根据年龄、性别、婚育、种族、宗教、残疾、国籍等判断。
- 用户要求 AI 做最终招聘决定。

相似分支区别：
- `roleplay-simulation` 模拟面试，本分支定义评估和公平性。
- `legal-policy-review` 可辅助合规政策，但本分支控制招聘使用边界。

## 3. Required Inputs

必需输入：
- `{{job_description}}` JD。
- `{{must_have_requirements}}` 必备条件。
- `{{nice_to_have_requirements}}` 加分项。
- `{{candidate_materials}}` 简历、作品集、面试记录。
- `{{evaluation_rubric}}` 评分标准。
- `{{seniority_level}}` 职级。
- `{{bias_control_rules}}` 偏见控制规则。

可选输入：
- `{{interview_stage}}` 面试阶段。
- `{{work_authorization_constraints}}` 与岗位合法相关的工作授权要求。
- `{{followup_question_goal}}` 后续面试问题目标。

缺失时处理：
- 缺少 JD：只做材料摘要，不做岗位匹配结论。
- 缺少证据：标注“材料不足”，提出后续验证问题。
- 出现受保护属性：不得用于评分、排序或建议；必要时建议移除或忽略。
- 评分标准缺失：先生成待确认 rubric，不输出最终排名。

## 4. Prompt Construction Rules

- 目标定义：只做辅助评估，最终由人类招聘团队决策。
- 岗位拆解：先拆 must-have、nice-to-have、职级期望和工作场景。
- 证据绑定：每项判断必须引用 JD、简历或面试记录证据。
- 公平性：不得使用受保护属性，不得推断家庭、健康、年龄、宗教等信息。
- 评分一致性：按统一 rubric 输出，不因个人印象改变标准。
- 后续问题：针对材料缺口和岗位关键能力设计行为面试或技术问题。
- 边界：避免绝对录用/淘汰结论，输出风险、待验证项和建议下一步。

## 5. Hard Constraints

- 不得基于受保护属性做推断、排序、拒绝或推荐。
- 不得给绝对录用/淘汰结论。
- 不得凭主观印象、人身评价或无证据偏好打分。
- 不得忽略 must-have 要求。
- 不得把 AI 输出作为唯一招聘决策依据。
- 必须包含公平性和一致性检查。

## 6. Output Format

最终 prompt 应要求目标模型输出：

```text
辅助决策声明：
岗位要求摘要：
候选人证据摘要：
must-have 匹配表：
nice-to-have 匹配表：
评分表：
信息不足和待验证项：
后续面试问题：
公平性和一致性检查：
```

## 7. Quality Checklist

- [ ] 是否明确 JD、must-have 和 nice-to-have？
- [ ] 是否只基于岗位相关材料证据评估？
- [ ] 是否每个判断引用简历或面试证据？
- [ ] 是否标注材料不足和待验证项？
- [ ] 是否排除受保护属性和推断？
- [ ] 是否避免绝对录用/淘汰结论？
- [ ] 是否输出后续面试问题？
- [ ] 是否包含公平性和一致性检查？

## 8. Common Mistakes

| Common Mistake | Risk | Repair |
| --- | --- | --- |
| 凭主观印象评价候选人 | 不公平且不可复核 | 每项判断绑定 JD 和材料证据 |
| 忽略 must-have | 匹配结论失真 | 先拆必备条件再评分 |
| 推断受保护属性 | 歧视和合规风险 | 明确忽略并禁止使用 |
| 给绝对录用/淘汰 | 过度依赖 AI | 输出辅助意见、风险和待验证问题 |

## 9. Reusable Template

```text
请进行招聘辅助评估。AI 输出只用于辅助，不作为唯一招聘决策依据。禁止基于年龄、性别、种族、婚育、宗教、残疾、国籍等受保护属性做推断、排序或建议。

岗位 JD：{{job_description}}
必备条件：{{must_have_requirements}}
加分项：{{nice_to_have_requirements}}
候选人材料：{{candidate_materials}}
评分标准：{{evaluation_rubric}}
职级：{{seniority_level}}
偏见控制：{{bias_control_rules}}

执行要求：
1. 先拆解岗位 must-have、nice-to-have、职级期望和工作场景。
2. 每个判断必须引用简历、作品集或面试记录证据。
3. 材料不足时标注“待验证”，并设计后续面试问题。
4. 不给绝对录用/淘汰结论。
5. 输出公平性和一致性检查。

输出格式：
辅助声明、岗位摘要、证据摘要、must-have 表、nice-to-have 表、评分、待验证项、后续问题、公平性检查。
```

## 10. Example

用户原始需求：

```text
根据 JD 和简历评估候选人，并设计面试问题，注意不要有偏见。
```

路由判断：
- 主分支：`business-operations/recruiting-evaluation`
- 辅助分支：`communication/roleplay-simulation`
- 风险等级：High

高质量 prompt：

```text
请基于 `[job_description]` 和 `[candidate_resume]` 做招聘辅助评估。AI 输出只用于辅助，不作为唯一招聘决策依据。先拆分 must-have：Go/Java 服务经验、数据库设计、分布式系统、线上故障处理；再拆分 nice-to-have：Kubernetes、可观测性、团队协作。每个评分必须引用简历或面试记录证据；材料不足标注“待验证”。禁止推断或使用年龄、性别、婚育、种族、宗教、残疾、国籍等受保护属性。不要给绝对录用/淘汰结论；输出匹配表、风险、后续面试问题和公平性检查。
```

质量检查结果：
- [x] 岗位相关、证据驱动。
- [x] 禁止受保护属性。
- [x] 避免最终决策。
- [x] 输出后续问题。
