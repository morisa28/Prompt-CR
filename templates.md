# Reusable Prompt Templates

这些模板跨分支复用；分支文件中的模板会补充场景变量和专属约束。替换 `{{variable}}` 后可直接使用。

## 1. 通用高质量 Prompt 模板

**使用场景**：任何需要结构化 AI 任务的场景。

**可替换变量**：
- {{task_goal}}
- {{context}}
- {{input_materials}}
- {{constraints}}
- {{output_format}}
- {{acceptance_criteria}}

**模板正文**：
```text
你是 {{target_ai_tool}}。
任务目标：{{task_goal}}
背景：{{context}}
输入材料：{{input_materials}}
执行步骤：先读取输入，分析问题，设计方案，执行任务，验证结果，输出报告。
约束：{{constraints}}
输出格式：{{output_format}}
验收标准：{{acceptance_criteria}}
自检：检查目标、输入、约束、输出和验收是否全部满足。
```

**填写说明**：用一句话写目标；输入材料必须可定位；约束必须包含禁止事项。

**质量检查点**：
- [ ] 目标可观察
- [ ] 输入可定位
- [ ] 验收可判断

## 2. Prompt Review 模板

**使用场景**：用户已有 prompt 并要求诊断。

**可替换变量**：
- {{original_prompt}}
- {{target_ai_tool}}
- {{expected_result}}
- {{known_failures}}

**模板正文**：
```text
请评审以下 prompt：{{original_prompt}}
目标工具：{{target_ai_tool}}
期望结果：{{expected_result}}
已知问题：{{known_failures}}
先按目标、上下文、输入、约束、输出格式、验收标准、风险控制、自检八项评分；再列问题、风险、修复方式和歧义点；最后给出保留原意的优化版。
```

**填写说明**：不要直接重写；先诊断。缺失信息用待补充标记。

**质量检查点**：
- [ ] 八项维度齐全
- [ ] 每个问题有修复方式
- [ ] 优化版保留原意

## 3. Prompt Rewrite 模板

**使用场景**：把口语化需求改写为可执行 prompt。

**可替换变量**：
- {{raw_request}}
- {{target_ai_tool}}
- {{task_domain}}
- {{must_keep}}

**模板正文**：
```text
请将以下需求改写为 {{target_ai_tool}} 可执行 prompt：{{raw_request}}
任务领域：{{task_domain}}
必须保留：{{must_keep}}
改写时补齐目标、背景、输入、步骤、约束、输出格式、验收标准和自检。不确定信息标注为待补充。
```

**填写说明**：只补执行必需信息，不添加新目标。

**质量检查点**：
- [ ] 原意保留
- [ ] 目标工具已适配
- [ ] 缺失信息已标注

## 4. Prompt Expansion 模板

**使用场景**：把短 prompt 扩成强执行 prompt。

**可替换变量**：
- {{short_prompt}}
- {{target_ai_tool}}
- {{known_context}}
- {{task_scope}}

**模板正文**：
```text
请扩展短 prompt：{{short_prompt}}
目标工具：{{target_ai_tool}}
已知背景：{{known_context}}
范围：{{task_scope}}
扩展为包含目标、背景、输入、阶段、硬约束、输出格式、验收标准、风险控制和自检的完整 prompt。列出默认假设。
```

**填写说明**：扩展只能服务原目标；默认假设集中列出。

**质量检查点**：
- [ ] 未改变原意
- [ ] 阶段可执行
- [ ] 风险和验收齐全

## 5. Prompt Compression 模板

**使用场景**：过长 prompt 需要降 token。

**可替换变量**：
- {{long_prompt}}
- {{target_length}}
- {{must_preserve}}
- {{compression_level}}

**模板正文**：
```text
请压缩以下 prompt：{{long_prompt}}
目标长度：{{target_length}}
不可删除：{{must_preserve}}
压缩级别：{{compression_level}}
保留目标、关键上下文、硬约束、输出格式和验收标准；删除重复解释和空泛说明；输出压缩版和删减说明。
```

**填写说明**：先锁定禁止事项和验收，再删解释性文本。

**质量检查点**：
- [ ] 硬约束未丢
- [ ] 验收仍可检查
- [ ] 目标未变

## 6. Codex Task Prompt 模板

**使用场景**：让 Codex 执行开发、文档或仓库任务。

**可替换变量**：
- {{working_directory}}
- {{task_goal}}
- {{related_files}}
- {{verification_steps}}

**模板正文**：
```text
你是 Codex，请在 {{working_directory}} 完成任务：{{task_goal}}
先读取 {{related_files}} 和项目配置；再分析方案并按最小范围修改；禁止无关重构、删除用户功能或新增依赖，除非获得许可。完成后执行 {{verification_steps}}，最终报告修改文件、验证结果和剩余风险。
```

**填写说明**：工作目录必须写明；验证命令不能省略。

**质量检查点**：
- [ ] 先读后改
- [ ] 范围最小
- [ ] 有验证结果

## 7. Codex Plan Mode 模板

**使用场景**：只规划不修改。

**可替换变量**：
- {{working_directory}}
- {{task_goal}}
- {{read_first}}
- {{risk_focus}}

**模板正文**：
```text
你是 Codex，现在处于 plan 模式。工作目录：{{working_directory}}
目标：{{task_goal}}
请只读取 {{read_first}}，不要修改文件。输出当前状态、风险点、预计修改文件、分阶段计划、验证方式和待确认问题。未确认前不得执行改动。
```

**填写说明**：用于高风险或大范围任务；必须写 no-edit 边界。

**质量检查点**：
- [ ] 禁止修改文件
- [ ] 列预计文件
- [ ] 列验证方式

## 8. CLI Agent Prompt 模板

**使用场景**：Codex CLI、Claude Code、Gemini CLI 等命令行 agent。

**可替换变量**：
- {{cli_tool}}
- {{working_directory}}
- {{allowed_commands}}
- {{forbidden_actions}}
- {{network_policy}}

**模板正文**：
```text
你是 {{cli_tool}}。工作目录：{{working_directory}}
允许命令：{{allowed_commands}}
禁止操作：{{forbidden_actions}}
联网策略：{{network_policy}}
按读取、分析、执行、验证、报告顺序工作。命令失败时记录错误并调整方案；最终报告命令、文件和结果。
```

**填写说明**：权限默认收紧；安装依赖和联网需明确许可。

**质量检查点**：
- [ ] 权限边界明确
- [ ] 命令失败有处理
- [ ] 最终报告含命令

## 9. Multi-Stage Workflow Prompt 模板

**使用场景**：多阶段任务或长流程。

**可替换变量**：
- {{overall_goal}}
- {{stages}}
- {{failure_handling}}
- {{final_report}}

**模板正文**：
```text
总目标：{{overall_goal}}
阶段：{{stages}}
每阶段必须写目标、输入、动作、输出、验收和失败处理。若某阶段失败，先修复或报告阻塞，不进入下一阶段。最终输出：{{final_report}}。
```

**填写说明**：适合复杂开发、研究、自动化和报告任务。

**质量检查点**：
- [ ] 阶段有验收
- [ ] 失败处理明确
- [ ] 最终报告汇总

## 10. Document Analysis Prompt 模板

**使用场景**：文档、会议记录、项目资料分析。

**可替换变量**：
- {{document_paths}}
- {{reading_scope}}
- {{analysis_focus}}
- {{citation_style}}

**模板正文**：
```text
请分析文档：{{document_paths}}
阅读范围：{{reading_scope}}
分析重点：{{analysis_focus}}
先建立文档索引，再按主题提取事实、推断、不确定内容和行动项。引用方式：{{citation_style}}。
```

**填写说明**：不要机械章节摘要；事实要能回溯来源。

**质量检查点**：
- [ ] 范围明确
- [ ] 事实/推断分开
- [ ] 行动项可执行

## 11. Research Synthesis Prompt 模板

**使用场景**：多来源研究和观点综合。

**可替换变量**：
- {{research_question}}
- {{sources}}
- {{citation_requirements}}
- {{scope}}

**模板正文**：
```text
研究问题：{{research_question}}
来源：{{sources}}
范围：{{scope}}
请比较来源观点、证据、方法和限制，区分结论、证据、推测和不确定性。引用要求：{{citation_requirements}}。
```

**填写说明**：来源不足时说明限制，不编造引用。

**质量检查点**：
- [ ] 结论有证据
- [ ] 冲突已呈现
- [ ] 引用可查

## 12. Data Analysis Prompt 模板

**使用场景**：数据集、指标、趋势或异常分析。

**可替换变量**：
- {{data_source}}
- {{analysis_goal}}
- {{variables}}
- {{method_constraints}}

**模板正文**：
```text
请分析数据：{{data_source}}
目标：{{analysis_goal}}
变量：{{variables}}
方法限制：{{method_constraints}}
先做数据字典和质量检查，再设计可复现分析，输出结果、限制和下一步。
```

**填写说明**：清洗规则和口径必须写出。

**质量检查点**：
- [ ] 数据质量已查
- [ ] 代码/步骤可复现
- [ ] 结论有数据支持

## 13. Report Writing Prompt 模板

**使用场景**：项目报告、正式文稿、阶段总结。

**可替换变量**：
- {{report_goal}}
- {{audience}}
- {{materials}}
- {{tone}}
- {{length}}

**模板正文**：
```text
请基于 {{materials}} 写报告。
目的：{{report_goal}}
读者：{{audience}}
语气：{{tone}}
长度：{{length}}
设计章节结构，结论绑定事实材料，输出摘要、正文、风险、建议和需补充材料。
```

**填写说明**：材料不足时先列缺口，不编造成果。

**质量检查点**：
- [ ] 读者明确
- [ ] 事实可追溯
- [ ] 章节完整

## 14. High-Risk Domain Safe Prompt 模板

**使用场景**：法律、医疗、金融、安全等高风险领域。

**可替换变量**：
- {{domain}}
- {{user_question}}
- {{source_materials}}
- {{safety_notice}}

**模板正文**：
```text
领域：{{domain}}
问题：{{user_question}}
材料：{{source_materials}}
安全声明：{{safety_notice}}
请提供信息性分析，标注来源、假设和不确定性；不要替代专业意见；必要时建议咨询专业人士。安全领域只给防御性建议，不提供攻击步骤。
```

**填写说明**：高风险结论必须降确定性并说明依据。

**质量检查点**：
- [ ] 声明清楚
- [ ] 不替代专业意见
- [ ] 不确定性已标注

## 15. Meta Skill Builder Prompt 模板

**使用场景**：把流程或知识做成 skill。

**可替换变量**：
- {{source_materials}}
- {{skill_name}}
- {{use_cases}}
- {{output_path}}

**模板正文**：
```text
请把 {{source_materials}} 提炼为 skill：{{skill_name}}
适用场景：{{use_cases}}
输出路径：{{output_path}}
生成触发条件、不适用场景、规则、流程、模板、检查表、示例和维护说明。禁止复制长段原文。最后用 3 个调用样例测试。
```

**填写说明**：把知识转为行为规则，而不是普通摘要。

**质量检查点**：
- [ ] 触发清楚
- [ ] 模板可用
- [ ] 有模拟测试
## 16. DevOps / CI Prompt 模板

**使用场景**：CI/CD pipeline 设计、GitHub Actions/GitLab CI 修复、Docker build、部署和回滚策略。

**可替换变量**：
- {{repository_path}}
- {{ci_platform}}
- {{deployment_target}}
- {{build_command}}
- {{test_command}}
- {{environment_variables}}
- {{current_error_log}}
- {{branch_strategy}}
- {{rollback_requirement}}

**模板正文**：
```text
请为 {{ci_platform}} 处理 CI/CD 任务。仓库：{{repository_path}}；部署目标：{{deployment_target}}；构建命令：{{build_command}}；测试命令：{{test_command}}；环境变量：{{environment_variables}}；失败日志：{{current_error_log}}；分支策略：{{branch_strategy}}；回滚要求：{{rollback_requirement}}。
必须先读取现有 CI 配置、Dockerfile、部署脚本和依赖配置；区分本地失败与 CI/runner 失败；只做最小修改；禁止输出真实 secrets；涉及 production 时先给风险和回滚方案。输出修改文件、验证步骤、重跑 pipeline 方式和剩余风险。
```

**填写说明**：环境变量只写名称和用途，不填真实值；生产部署默认 plan。

**质量检查点**：
- [ ] CI 平台、部署目标和命令明确
- [ ] secrets 不泄露
- [ ] pipeline 验证和 rollback 明确

## 17. Database Migration Prompt 模板

**使用场景**：schema 修改、ORM migration、数据回填、索引调整、零停机迁移和 rollback。

**可替换变量**：
- {{database_type}}
- {{orm_or_migration_tool}}
- {{current_schema}}
- {{target_schema}}
- {{migration_goal}}
- {{data_volume}}
- {{downtime_tolerance}}
- {{backup_status}}
- {{rollback_plan}}
- {{affected_tables}}
- {{affected_services}}

**模板正文**：
```text
请设计数据库迁移方案。数据库：{{database_type}}；工具：{{orm_or_migration_tool}}；当前 schema：{{current_schema}}；目标 schema：{{target_schema}}；目标：{{migration_goal}}；数据量：{{data_volume}}；停机容忍：{{downtime_tolerance}}；备份状态：{{backup_status}}；rollback：{{rollback_plan}}；受影响表：{{affected_tables}}；受影响服务：{{affected_services}}。
必须先读取 schema 和 migration 历史；识别破坏性变更；区分 schema migration 与 data migration；生产环境只 plan 不直接执行；输出分阶段方案、备份、回滚、staging 验证和数据一致性检查。
```

**填写说明**：备份状态未知时不得生成直接执行指令。

**质量检查点**：
- [ ] schema/data migration 分开
- [ ] 破坏性变更和大表锁表风险已识别
- [ ] 备份、rollback、staging 验证明确

## 18. API Design Prompt 模板

**使用场景**：REST、GraphQL、gRPC、OpenAPI、鉴权、错误码、分页和联调。

**可替换变量**：
- {{api_goal}}
- {{api_style}}
- {{consumer}}
- {{resource_model}}
- {{auth_method}}
- {{request_fields}}
- {{response_fields}}
- {{error_cases}}
- {{versioning_requirement}}
- {{rate_limit_requirement}}
- {{openapi_required}}

**模板正文**：
```text
请设计 {{api_style}} API。目标：{{api_goal}}；调用方：{{consumer}}；资源模型：{{resource_model}}；鉴权：{{auth_method}}；请求字段：{{request_fields}}；响应字段：{{response_fields}}；错误场景：{{error_cases}}；版本策略：{{versioning_requirement}}；限流：{{rate_limit_requirement}}；OpenAPI：{{openapi_required}}。
必须定义资源、操作、请求/响应 schema、错误码、统一错误响应、鉴权权限、分页/排序/过滤、幂等性和测试场景。按需输出 OpenAPI、示例请求和示例响应。
```

**填写说明**：鉴权未知时不得默认公开接口。

**质量检查点**：
- [ ] 请求/响应和错误格式明确
- [ ] 鉴权、权限和版本策略明确
- [ ] 示例和测试场景完整

## 19. Knowledge Base / RAG Prompt 模板

**使用场景**：知识库、RAG、embedding、向量库、检索、rerank、引用和防幻觉。

**可替换变量**：
- {{knowledge_sources}}
- {{document_types}}
- {{target_users}}
- {{qa_scope}}
- {{chunking_strategy}}
- {{embedding_model}}
- {{vector_database}}
- {{retrieval_strategy}}
- {{reranking_strategy}}
- {{citation_requirement}}
- {{access_control}}
- {{evaluation_questions}}
- {{freshness_requirement}}

**模板正文**：
```text
请设计 RAG 知识库。知识源：{{knowledge_sources}}；文档类型：{{document_types}}；用户：{{target_users}}；范围：{{qa_scope}}；chunk：{{chunking_strategy}}；embedding：{{embedding_model}}；向量库：{{vector_database}}；检索：{{retrieval_strategy}}；rerank：{{reranking_strategy}}；引用：{{citation_requirement}}；权限：{{access_control}}；评估问题：{{evaluation_questions}}；时效：{{freshness_requirement}}。
必须建立文档索引、设计 chunk/metadata、检索/重排/生成流程；回答必须带引用；无依据时拒答或说明未找到依据；包含权限、更新、版本、审计和评估指标。
```

**填写说明**：知识源不明确时先补知识源，不直接设计实现。

**质量检查点**：
- [ ] 知识源、范围和权限明确
- [ ] chunk、metadata、检索和 rerank 明确
- [ ] 引用、不命中策略和评估指标明确

## 20. Customer Service QA Prompt 模板

**使用场景**：客服对话质检、工单分析、情绪分析、违规话术和坐席培训反馈。

**可替换变量**：
- {{conversation_transcript}}
- {{business_context}}
- {{service_channel}}
- {{quality_dimensions}}
- {{scoring_rubric}}
- {{compliance_rules}}
- {{customer_sentiment_focus}}
- {{privacy_requirements}}
- {{output_audience}}

**模板正文**：
```text
请质检客服对话。材料：{{conversation_transcript}}；业务：{{business_context}}；渠道：{{service_channel}}；维度：{{quality_dimensions}}；评分：{{scoring_rubric}}；合规：{{compliance_rules}}；情绪关注：{{customer_sentiment_focus}}；隐私：{{privacy_requirements}}；读者：{{output_audience}}。
必须先脱敏；每个评分点引用对话证据；区分事实、推断和建议；避免人身评价；输出评分表、证据片段、违规风险、情绪/归因和改进话术。
```

**填写说明**：评分标准缺失时先生成待确认 rubric。

**质量检查点**：
- [ ] 评分维度和证据引用明确
- [ ] 隐私脱敏明确
- [ ] 改进建议可执行

## 21. Recruiting Evaluation Prompt 模板

**使用场景**：简历筛选、面试评估、岗位匹配、候选人打分和面试题设计。

**可替换变量**：
- {{job_description}}
- {{must_have_requirements}}
- {{nice_to_have_requirements}}
- {{candidate_resume}}
- {{interview_notes}}
- {{evaluation_rubric}}
- {{seniority_level}}
- {{location_or_work_authorization_constraints}}
- {{bias_control_rules}}

**模板正文**：
```text
请进行招聘评估。JD：{{job_description}}；必备：{{must_have_requirements}}；加分：{{nice_to_have_requirements}}；简历：{{candidate_resume}}；面试记录：{{interview_notes}}；评分：{{evaluation_rubric}}；职级：{{seniority_level}}；地点/授权：{{location_or_work_authorization_constraints}}；偏见控制：{{bias_control_rules}}。
必须基于岗位要求和材料证据；区分 must-have 与 nice-to-have；标注信息不足；禁止基于受保护属性推断；输出结构化评分、证据、风险和后续面试问题。AI 输出不得作为唯一招聘决策依据。
```

**填写说明**：缺 JD 时只做材料摘要，不做匹配结论。

**质量检查点**：
- [ ] 证据引用明确
- [ ] 受保护属性偏见被排除
- [ ] 后续验证问题明确

## 22. Curriculum Design Prompt 模板

**使用场景**：课程大纲、教学计划、训练营、作业、评估和企业内训。

**可替换变量**：
- {{learner_profile}}
- {{prerequisites}}
- {{learning_objectives}}
- {{course_duration}}
- {{delivery_format}}
- {{module_topics}}
- {{assessment_method}}
- {{practice_requirements}}
- {{final_project_requirement}}

**模板正文**：
```text
请设计课程。学习者：{{learner_profile}}；先修：{{prerequisites}}；目标：{{learning_objectives}}；周期：{{course_duration}}；形式：{{delivery_format}}；模块：{{module_topics}}；评估：{{assessment_method}}；练习：{{practice_requirements}}；最终项目：{{final_project_requirement}}。
必须把目标写成可观察能力；按学习者水平设计难度递进；每个模块包含目标、活动、练习、作业和验收；输出课时安排、最终项目、评分 rubric 和反馈机制。
```

**填写说明**：不要只列主题；每个主题要绑定活动和产出。

**质量检查点**：
- [ ] 学习目标可观察
- [ ] 模块有活动、练习和评估
- [ ] 最终项目和反馈机制明确

## 23. Game Design Prompt 模板

**使用场景**：游戏概念、核心玩法、机制、关卡、数值、GDD 和可测试原型。

**可替换变量**：
- {{game_genre}}
- {{target_players}}
- {{platform}}
- {{core_loop}}
- {{main_mechanics}}
- {{progression_system}}
- {{level_design_goal}}
- {{art_style}}
- {{narrative_scope}}
- {{prototype_scope}}
- {{success_metrics}}

**模板正文**：
```text
请设计游戏。类型：{{game_genre}}；玩家：{{target_players}}；平台：{{platform}}；核心循环：{{core_loop}}；机制：{{main_mechanics}}；成长：{{progression_system}}；关卡目标：{{level_design_goal}}；美术：{{art_style}}；叙事：{{narrative_scope}}；原型：{{prototype_scope}}；指标：{{success_metrics}}。
必须先定义核心玩法循环，说明玩家目标、操作、反馈和奖励；区分概念、机制和实现；输出胜利/失败条件、难度曲线、关卡结构、原型范围、GDD 和 playtest 标准。
```

**填写说明**：若要求 Codex 实现原型，组合 coding-feature-development 分支。

**质量检查点**：
- [ ] 核心循环明确
- [ ] 原型范围可测试
- [ ] playtest 验收标准明确

## 24. Bugfix Debugging 强化模板

**使用场景**：代码报错、构建失败、测试失败、页面白屏、CLI 错误。

**不适用场景**：用户要从零开发新功能、做大范围重构或只读理解仓库。

**必填输入**：
- {{working_directory}}
- {{error_log}}
- {{reproduction_steps}}
- {{environment}}
- {{verification_commands}}

**可选输入**：
- {{recent_changes}}
- {{related_files}}
- {{package_manager_version}}

**模板正文**：
```text
你是 {{target_ai_tool}}，请在 {{working_directory}} 修复以下错误。

错误日志：
{{error_log}}

复现步骤：
{{reproduction_steps}}

环境：
{{environment}}

要求：
1. 先读取项目配置、错误栈指向的文件和相关测试，再定位根因。
2. 区分代码、配置、依赖、环境和数据问题；根因必须有文件、日志或命令证据。
3. 只做最小修复，禁止无关重构、全仓库格式化、删除测试、降低断言或注释掉失败逻辑。
4. 如需新增依赖或破坏性操作，先说明必要性并请求确认。
5. 修复后运行 {{verification_commands}}，至少覆盖原失败路径。

输出格式：
- 根因：
- 修改文件：
- 关键改动：
- 验证命令与结果：
- 未验证项和剩余风险：
```

**质量检查点**：
- [ ] 使用了完整日志和复现步骤
- [ ] 有根因证据
- [ ] 有最小修复边界
- [ ] 有验证命令和失败处理

## 25. Repository Analysis 强化模板

**使用场景**：只读分析仓库结构、技术栈、入口、模块、数据流、风险和改进建议。

**不适用场景**：用户要求直接改代码、修 bug 或写新功能。

**必填输入**：
- {{repository_path}}
- {{analysis_goal}}
- {{focus_areas}}
- {{output_depth}}

**可选输入**：
- {{known_questions}}
- {{excluded_paths}}
- {{report_audience}}

**模板正文**：
```text
你是 {{target_ai_tool}}，请只读分析 {{repository_path}}，不要修改文件。

分析目标：{{analysis_goal}}
关注重点：{{focus_areas}}
输出深度：{{output_depth}}

执行步骤：
1. 读取 README、依赖配置、构建/测试配置、入口文件和顶层目录。
2. 输出简化文件树，标注核心模块、数据流、外部依赖和运行方式。
3. 区分事实、推断和未读取区域；未读取路径不得写成确定结论。
4. 输出风险点、改进建议和后续可执行任务，但不要执行修改。

输出格式：
- 项目概览
- 文件树和入口
- 技术栈证据
- 核心模块与数据流
- 运行/测试命令
- 风险点
- 改进建议
- 不确定性和待补充材料
```

**质量检查点**：
- [ ] 明确只读
- [ ] 技术栈有证据
- [ ] 核心模块和数据流清楚
- [ ] 建议不冒充已执行改动

## 26. PRD To Development Agent 模板

**使用场景**：把产品想法或 PRD 产出为可交给开发 Agent 的任务 prompt。

**不适用场景**：纯营销文案、纯视觉稿或没有任何产品目标的随意功能清单。

**必填输入**：
- {{product_goal}}
- {{target_users}}
- {{user_scenarios}}
- {{mvp_scope}}
- {{non_goals}}
- {{success_metrics}}

**可选输入**：
- {{technical_context}}
- {{design_constraints}}
- {{release_constraints}}

**模板正文**：
```text
请基于以下信息生成 PRD，并附带可交给开发 Agent 的实现 prompt。

产品目标：{{product_goal}}
目标用户：{{target_users}}
核心场景：{{user_scenarios}}
MVP 范围：{{mvp_scope}}
非目标：{{non_goals}}
成功指标：{{success_metrics}}
技术/设计约束：{{technical_context}} {{design_constraints}}

PRD 必须包含：问题定义、用户故事、功能范围、非目标、边界条件、指标、验收标准。
开发 Agent prompt 必须包含：工作目录占位符、先读文件、实现边界、禁止无关重构、测试/构建验证、最终改动报告。
每个用户故事使用 Given/When/Then，不能写无法验收的愿景描述。
```

**质量检查点**：
- [ ] PRD 和开发 prompt 分开
- [ ] MVP 与后续迭代分开
- [ ] 每个功能有验收标准
- [ ] 有非目标和边界条件

## 27. RAG System Design 模板

**使用场景**：知识库问答、内部文档助手、引用、权限控制、RAG 评估。

**不适用场景**：没有知识源却要求凭模型常识回答。

**必填输入**：
- {{knowledge_sources}}
- {{target_users}}
- {{qa_scope}}
- {{citation_requirement}}
- {{access_control}}
- {{freshness_requirement}}

**可选输入**：
- {{chunking_strategy}}
- {{embedding_model}}
- {{vector_database}}
- {{reranking_strategy}}
- {{evaluation_questions}}

**模板正文**：
```text
请设计 RAG 知识库系统 prompt。

知识源：{{knowledge_sources}}
用户：{{target_users}}
问答范围和非范围：{{qa_scope}}
引用要求：{{citation_requirement}}
权限控制：{{access_control}}
更新频率：{{freshness_requirement}}

必须设计：
1. 文档索引字段：来源、标题、路径、版本、更新时间、权限、metadata。
2. chunking、overlap、metadata、去重和版本策略。
3. embedding、向量库、检索、rerank、上下文组装和生成流程。
4. 引用格式：至少能回溯到文档、标题、段落或 chunk。
5. 不命中策略：无依据时拒答或澄清，不得编造。
6. 权限、更新、失效文档、审计日志和评估指标。

输出格式：范围、架构、索引字段、检索流程、回答规则、权限策略、评估集、风险。
```

**质量检查点**：
- [ ] 知识源和权限明确
- [ ] 引用和拒答规则明确
- [ ] 检索和评估可验证
- [ ] 防幻觉边界明确

## 28. Missing Input Completion 模板

**使用场景**：用户需求模糊但可以继续生成带占位符的 prompt。

**不适用场景**：缺失信息会导致医疗、法律、金融、安全或生产系统任务越界。

**必填输入**：
- {{raw_request}}
- {{target_tool}}
- {{known_context}}

**模板正文**：
```text
请先不要直接补事实。请把以下需求拆成缺失输入清单，并生成可继续使用的 prompt 草案。

原始需求：{{raw_request}}
目标工具：{{target_tool}}
已知上下文：{{known_context}}

输出：
1. 可合理假设的信息。
2. 必须标记为 [待补充] 的信息。
3. 必须追问用户的信息。
4. 阻塞任务的信息。
5. 带占位符的最终 prompt 草案。

禁止把缺失事实写成确定结论。
```

**质量检查点**：
- [ ] 缺失信息已分级
- [ ] 占位符清楚
- [ ] 阻塞项没有被绕过

## 29. Prompt Self-Check 模板

**使用场景**：最终 prompt 交付前检查质量、路由、风险和可执行性。

**不适用场景**：用户只要极短口号或无需结构化 prompt 的简单任务。

**必填输入**：
- {{draft_prompt}}
- {{routing_result}}
- {{risk_level}}

**模板正文**：
```text
请审查以下待交付 prompt。

路由结果：{{routing_result}}
风险等级：{{risk_level}}
待审查 prompt：
{{draft_prompt}}

按以下维度给出 Yes/No 和修复建议：
- 是否明确最终交付物？
- 是否包含目标、背景、输入、步骤、约束、输出格式和验收标准？
- 是否区分事实、假设和待补充信息？
- 是否存在编造文件、数据、引用或专业结论的风险？
- 对 coding agent 是否包含最小修改、禁止事项、验证命令和变更摘要？
- 对文档/研究任务是否包含来源、引用和不确定性？
- 对高风险任务是否限制到安全范围？
- 是否可以直接复制给目标工具执行？
```

**质量检查点**：
- [ ] 每项有 Yes/No
- [ ] 失败项有修复动作
- [ ] 高风险边界被检查

## 30. Multi-Branch Combination 模板

**使用场景**：任务同时涉及主交付物、工具适配、验证、报告或安全边界。

**不适用场景**：单一简单任务，辅助分支不会改变执行质量。

**必填输入**：
- {{primary_branch}}
- {{auxiliary_branches}}
- {{raw_request}}
- {{target_tool}}

**模板正文**：
```text
请基于以下路由生成最终 prompt。

原始需求：{{raw_request}}
目标工具：{{target_tool}}
主分支：{{primary_branch}}
辅助分支：{{auxiliary_branches}}

构造规则：
1. 主分支定义目标、输入、步骤、验收标准。
2. 辅助分支只加入工具适配、验证、引用、报告或安全边界。
3. 若辅助分支超过 3 个，拆成多阶段 prompt。
4. 冲突时按安全边界、用户约束、项目上下文、工具能力、输出格式排序。

输出：路由摘要、缺失输入、最终 prompt、自检结果。
```

**质量检查点**：
- [ ] 主分支唯一
- [ ] 辅助分支有明确作用
- [ ] 冲突处理清楚

## 31. Prompt System Improvement 模板

**使用场景**：审计或改进 prompt skill、路由系统、模板库、检查表、eval、manifest。

**不适用场景**：只要求改写一个普通 prompt。

**必填输入**：
- {{project_path}}
- {{improvement_goal}}
- {{focus_areas}}
- {{allowed_changes}}
- {{sync_or_output_requirements}}

**模板正文**：
```text
你是 Prompt Engineering 架构师，请改进 {{project_path}} 的 Prompt Skill Hub。

目标：{{improvement_goal}}
重点：{{focus_areas}}
允许改动：{{allowed_changes}}
同步/输出要求：{{sync_or_output_requirements}}

必须先审计再修改。审计至少覆盖入口、路由、通用原则、模板、检查表、示例、分支、脚本、eval 和 manifest。
修改时只围绕提升 prompt 的清晰度、可执行性、可验证性、安全性和扩展性。
完成后运行可用的结构校验或引用检查，并报告修改文件、风险和后续建议。
```

**质量检查点**：
- [ ] 先审计再改
- [ ] 改动范围聚焦 Prompt Hub
- [ ] 有 eval 和 manifest 设计
- [ ] 有自检报告

## 32. Natural Language Entry 模板

**使用场景**：用户用自然语言描述 prompt 生成需求，不知道该选哪个分支。

**不适用场景**：用户只要一个短答案，或明确不需要结构化 prompt。

**必填输入**：
- {{raw_request}}
- {{target_tool}}
- {{known_materials}}
- {{constraints}}

**模板正文**：
```text
请把以下自然语言需求转换为高质量 prompt。

用户原始需求：
{{raw_request}}

目标工具：
{{target_tool}}

已知材料：
{{known_materials}}

用户约束：
{{constraints}}

执行流程：
1. 归一化需求，写出最终交付物。
2. 选择唯一主分支和必要辅助分支。
3. 从 registry 选择 branch、template、checklist、adapter、safety、eval 和 lesson 资源。
4. 分类缺失输入：可假设、待补充、需追问、阻塞。
5. 判断风险等级并注入安全边界。
6. 生成最终 prompt。
7. 用 checklist 和匹配 eval 自检。

输出格式：
需求摘要、最终交付物、主分支、辅助分支、使用资源、缺失输入、风险等级、安全边界、最终 prompt、自检结果、匹配 eval、可能新增 lesson。
```

**质量检查点**：
- [ ] 用户不需要知道目录结构
- [ ] 使用资源 URI
- [ ] 缺失输入和风险等级明确
- [ ] 最终 prompt 可复制执行

## 33. Resource Registry Selection 模板

**使用场景**：路由后需要选择可组合资源。

**不适用场景**：单一短 prompt 且无需展示路由。

**必填输入**：
- {{primary_branch}}
- {{auxiliary_branches}}
- {{target_tool}}
- {{risk_signals}}
- {{matched_lessons}}

**模板正文**：
```text
请为以下路由选择 registry 资源。

主分支：{{primary_branch}}
辅助分支：{{auxiliary_branches}}
目标工具：{{target_tool}}
风险信号：{{risk_signals}}
相关 lessons：{{matched_lessons}}

必须输出：
- branch resources
- template resources
- checklist resources
- adapter resources
- safety resources
- example resources
- eval resources
- lesson resources

规则：
1. 目标工具明确时必须选择 adapter。
2. 高风险信号出现时必须选择 safety。
3. 存在相似 eval 时必须列入。
4. 命中 lesson 时必须把 fix 写入 prompt 构造策略。
5. 不选择与任务无关的资源。
```

**质量检查点**：
- [ ] 资源 URI 稳定
- [ ] adapter/safety/eval/lesson 未遗漏
- [ ] 没有堆无关资源

## 34. Lesson Capture 模板

**使用场景**：prompt 生成失败、eval 未通过、出现高风险越界或发现可复用成功模式。

**不适用场景**：记录用户隐私、完整对话、账号、密钥或专业敏感材料。

**必填输入**：
- {{trigger}}
- {{failure_or_success_pattern}}
- {{root_cause}}
- {{fix}}
- {{related_resources}}
- {{update_targets}}

**模板正文**：
```yaml
id: lesson.<category>.<slug>.001
type: <routing-failure | prompt-failure | unsafe-pattern | successful-pattern | improvement-note>
related_resources:
  - "{{related_resources}}"
trigger: "{{trigger}}"
failure_mode: "{{failure_or_success_pattern}}"
root_cause: "{{root_cause}}"
fix: "{{fix}}"
update_targets:
  - "{{update_targets}}"
severity: <low | medium | high>
status: <open | active | monitoring | resolved>
```

**质量检查点**：
- [ ] 触发条件具体
- [ ] 根因和修复建议可执行
- [ ] 指向相关资源和 update targets
- [ ] 不含敏感个人信息
