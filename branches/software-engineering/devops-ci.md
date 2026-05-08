# DevOps CI

## 1. Purpose

用于为 CI/CD pipeline、GitHub Actions、GitLab CI、Docker 构建、自动化部署、构建失败排查、环境变量配置、生产部署前检查、回滚策略和多环境发布流程生成强执行 prompt。本分支关注交付链路、权限边界和部署风险；普通代码报错仍可组合 `bugfix-debugging` 分支。

## 2. Trigger Conditions

- 用户提到 CI/CD、pipeline、GitHub Actions、GitLab CI、runner、build failed、deploy failed。
- 用户要求设计 Docker build、自动化部署、多环境发布、生产部署检查或回滚策略。
- 用户要求修复 CI 构建失败、环境变量配置、secrets 权限、缓存或依赖安装问题。

## 3. Required Inputs

- {{repository_path}} 仓库路径。
- {{ci_platform}} CI 平台，例如 GitHub Actions、GitLab CI、CircleCI。
- {{deployment_target}} 部署目标，例如 staging、production、Vercel、Kubernetes、VM。
- {{build_command}} 构建命令。
- {{test_command}} 测试命令。
- {{environment_variables}} 环境变量名称和用途，禁止填真实值。
- {{current_error_log}} 当前构建或部署失败日志。
- {{branch_strategy}} 分支、tag、release 或环境触发策略。
- {{rollback_requirement}} 回滚要求和 RTO/RPO 约束。

缺失信息处理：

- CI 平台未知时，要求先读取 `.github/workflows/`、`.gitlab-ci.yml`、Dockerfile、compose、部署脚本和 package 配置。
- 环境变量未知时只列变量名、来源和配置位置，禁止要求用户粘贴真实 secrets。
- 涉及 production 时默认先生成方案和风险说明，不直接修改生产配置或执行部署。

## 4. Prompt Construction Rules

- 必须先读取现有 CI 配置文件、Dockerfile、部署脚本、依赖配置和测试配置。
- 必须识别 package manager、构建工具、测试工具、runner 环境和缓存策略。
- 必须区分本地构建失败、CI 环境失败、权限失败、secret 缺失、网络/镜像失败和部署目标失败。
- 必须要求最小修改，优先修复 pipeline 中与失败证据直接相关的配置。
- 必须要求不暴露 secrets，输出中只使用变量名或占位符。
- 必须要求输出修改文件清单、验证步骤、重跑 pipeline 的方式和失败时下一步。
- 涉及生产环境时必须要求风险说明、发布窗口、回滚方案和验证检查点。

## 5. Hard Constraints

- 禁止在 prompt 中写入真实密钥、token、私钥、连接串或账号密码。
- 禁止直接改 production 配置或执行部署，除非用户明确授权。
- 禁止删除安全检查、测试步骤或审批步骤来让 pipeline 变绿。
- 禁止把 CI 与本地环境差异写成无证据结论。
- 必须包含 pipeline 验证方式和回滚方案。

## 6. Output Format

最终 prompt 应要求目标模型输出：

- CI 现状和失败分类。
- 读取的配置文件和证据。
- 修改文件清单。
- pipeline 修复或设计方案。
- secrets 和权限处理方式。
- staging/production 风险和回滚方案。
- 验证步骤和最终报告。

## 7. Quality Checklist

- [ ] CI 平台和部署目标已明确。
- [ ] 现有 CI、Docker、部署和依赖配置被要求先读取。
- [ ] 构建命令和测试命令明确或要求从配置识别。
- [ ] 环境变量只使用名称和占位符，没有真实 secrets。
- [ ] 区分本地失败与 CI/runner 环境失败。
- [ ] staging 和 production 策略分开。
- [ ] 包含 cache、权限、依赖安装、runner 环境检查。
- [ ] 包含 pipeline 验证和回滚方案。

## 8. Common Mistakes

| Common Mistake                    | Risk               | Repair                                            |
| --------------------------------- | ------------------ | ------------------------------------------------- |
| 在 prompt 中写真实密钥            | 密钥泄露           | 只写变量名、secret 名称和配置位置                 |
| 忽略 CI 与本地环境差异            | 修复无效           | 要求比较 Node/Python 版本、OS、runner、缓存和权限 |
| 修改 pipeline 但不验证            | 发布链路仍可能失败 | 要求重跑 workflow 或给手动验证命令                |
| 没有区分 staging 和 production    | 误发布或破坏线上   | 分环境写触发条件、审批和回滚                      |
| 忽略 cache、依赖安装、runner 权限 | 间歇性失败         | 检查 cache key、lockfile、install 命令和权限声明  |

## 9. Reusable Template

```text
你是 {{target_ai_tool}}，请处理 DevOps / CI 任务。

仓库路径：{{repository_path}}
CI 平台：{{ci_platform}}
部署目标：{{deployment_target}}
构建命令：{{build_command}}
测试命令：{{test_command}}
环境变量：{{environment_variables}}（只允许写变量名和用途，禁止写真实值）
当前失败日志：{{current_error_log}}
分支策略：{{branch_strategy}}
回滚要求：{{rollback_requirement}}

执行步骤：
1. 先读取现有 CI 配置、Dockerfile、部署脚本、依赖配置和测试配置。
2. 识别 package manager、构建工具、测试工具、runner 环境、缓存策略和权限声明。
3. 区分本地构建失败、CI 环境失败、权限失败、secret 缺失和部署目标失败。
4. 设计最小修改方案；涉及 production 时先输出方案、风险和回滚，不直接部署。
5. 修改后给出 pipeline 验证步骤、重跑方式和失败时下一步。

约束：
- 禁止输出或写入真实 secrets、token、私钥、连接串或密码。
- 禁止删除测试、安全扫描或审批步骤来绕过失败。
- 禁止直接改 production 配置，除非用户明确授权。
- 必须输出修改文件清单、验证结果、风险和回滚方案。

输出格式：
CI 现状、失败分类、修改方案、修改文件、secrets/权限处理、验证步骤、回滚方案、剩余风险。
```

## 10. Example

用户原始需求：

```text
帮我写一个 prompt，让 Codex 修复 GitHub Actions 构建失败。
```

高质量 prompt：

```text
你是 Codex，请在 `/repo/web` 修复 GitHub Actions 构建失败。先读取 `.github/workflows/*`、`package.json`、lockfile、Dockerfile 和失败日志；识别 Node 版本、package manager、cache key、安装命令、构建命令和测试命令。日志为 `[粘贴 current_error_log]`。请区分本地构建问题和 GitHub runner 环境问题，做最小配置修复。禁止输出真实 secrets，禁止删除测试或安全检查。修复后说明如何重跑 workflow，并输出修改文件、验证步骤、失败时下一步和回滚方案。
```
