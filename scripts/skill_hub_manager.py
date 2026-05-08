#!/usr/bin/env python3
"""Prompt Engineering Skill Hub manager.

This script is intentionally conservative. Use it only when the user has
explicitly asked to add a new branch to the skill hub, or when validating,
counting, or explaining the current hub capabilities.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any


REQUIRED_BRANCH_SECTIONS = [
    "## 1. Purpose",
    "## 2. Trigger Conditions",
    "## 3. Required Inputs",
    "## 4. Prompt Construction Rules",
    "## 5. Hard Constraints",
    "## 6. Output Format",
    "## 7. Quality Checklist",
    "## 8. Common Mistakes",
    "## 9. Reusable Template",
    "## 10. Example",
]

ROOT_FILES = [
    "SKILL.md",
    "router.md",
    "common-principles.md",
    "templates.md",
    "checklists.md",
    "examples.md",
    "prompt-generation-protocol.md",
    "branch-composition.md",
    "branches/manifest.yaml",
    "metadata/resources.yaml",
    "evals/README.md",
    "evals/schema.md",
    "lessons/README.md",
    "adapters/README.md",
]

REQUIRED_EVAL_FIELDS = [
    "id:",
    "branch:",
    "title:",
    "user_request:",
    "expected_primary_branch:",
    "expected_auxiliary_branches:",
    "required_missing_inputs:",
    "risk_level:",
    "expected_prompt_features:",
    "forbidden_prompt_features:",
    "acceptance_criteria:",
]

RECOMMENDED_EVAL_FIELDS = [
    "expected_resources:",
    "related_lessons:",
]

REQUIRED_LESSON_FIELDS = [
    "id:",
    "type:",
    "related_resources:",
    "trigger:",
    "failure_mode:",
    "root_cause:",
    "fix:",
    "update_targets:",
    "severity:",
    "status:",
]

FORBIDDEN_VAGUE_PHRASES = [
    "根据情况处理",
    "适当考虑",
    "尽量详细",
    "提高质量",
    "注意风险",
]

HAN_RE = re.compile(r"[\u4e00-\u9fff]")
RESOURCE_URI_RE = re.compile(r"@[a-z-]+://[A-Za-z0-9][A-Za-z0-9._/-]*")
STABLE_YAML_IDENTIFIER_KEYS = [
    "id",
    "branch",
    "category",
    "risk_level",
    "path",
    "uri",
    "expected_primary_branch",
]
DEPRECATED_IDENTIFIER_ALIASES = [
    "domain-specific/" + "legal-" + "info",
    "domain-specific/" + "financial-" + "analysis",
    "@branch://meta/" + "prompt-system-" + "improvement",
]

DEFAULT_SPEC = {
    "category": "example-category",
    "slug": "example-branch",
    "title": "Example Branch",
    "index_summary": "为某个清晰场景生成强执行 prompt。",
    "purpose": "用于为某个清晰场景生成可执行、可验证、可复用的 prompt。",
    "triggers": [
        "用户明确提到该场景关键词",
        "用户要求为该场景生成 prompt",
    ],
    "required_inputs": [
        "{{task_goal}} 任务目标",
        "{{input_materials}} 输入材料",
        "{{constraints}} 约束",
    ],
    "missing_input_rules": [
        "缺少关键边界时标注为阻塞问题",
        "非阻塞缺失项使用 `[待补充: field]`",
    ],
    "construction_rules": [
        "必须先明确任务目标和成功标准",
        "必须列出输入材料、执行步骤、约束和验收标准",
        "必须标注假设和不确定内容",
    ],
    "hard_constraints": [
        "禁止把缺失事实写成确定结论",
        "禁止省略验收标准",
    ],
    "output_format": [
        "任务理解",
        "执行步骤",
        "输出结果",
        "验收标准",
        "不确定内容",
    ],
    "checklist": [
        "目标是否明确且可验证？",
        "输入材料是否可定位？",
        "约束是否包含必须和禁止事项？",
        "验收标准是否可判断是/否？",
    ],
    "common_mistakes": [
        {
            "mistake": "只写抽象建议",
            "risk": "目标模型无法执行",
            "repair": "改成动作、输入、输出和验收",
        }
    ],
    "template_variables": [
        "{{target_ai_tool}}",
        "{{task_goal}}",
        "{{input_materials}}",
        "{{constraints}}",
        "{{output_format}}",
        "{{acceptance_criteria}}",
    ],
    "example_user": "请为这个场景新增一个 prompt 分支。",
    "example_prompt": "你是 {{target_ai_tool}}，请基于 {{input_materials}} 完成 {{task_goal}}，遵守 {{constraints}}，按 {{output_format}} 输出，并满足 {{acceptance_criteria}}。",
    "routing_triggers": [
        "用户提到 example keyword",
        "用户要求 example branch prompt",
    ],
    "auxiliary_branches": [
        "branches/general-prompt/prompt-rewrite.md",
    ],
}


@dataclass
class ValidationResult:
    errors: list[str]
    warnings: list[str]

    @property
    def ok(self) -> bool:
        return not self.errors


def root_path(args: argparse.Namespace) -> Path:
    if args.root:
        return Path(args.root).resolve()
    return Path(__file__).resolve().parents[1]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str, dry_run: bool) -> None:
    if dry_run:
        print(f"[dry-run] write {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def branch_files(root: Path) -> list[Path]:
    return sorted((root / "branches").rglob("*.md"))


def eval_case_files(root: Path) -> list[Path]:
    cases = root / "evals" / "cases"
    if not cases.is_dir():
        return []
    return sorted(cases.rglob("*.yaml"))


def eval_feature_files(root: Path) -> list[Path]:
    features = root / "evals" / "features"
    if not features.is_dir():
        return []
    return sorted(features.rglob("*.feature"))


def lesson_files(root: Path) -> list[Path]:
    lessons = root / "lessons"
    if not lessons.is_dir():
        return []
    return sorted(path for path in lessons.rglob("*.yaml"))


def adapter_files(root: Path) -> list[Path]:
    adapters = root / "adapters"
    if not adapters.is_dir():
        return []
    return sorted(path for path in adapters.rglob("*.md"))


def safety_files(root: Path) -> list[Path]:
    safety = root / "safety"
    if not safety.is_dir():
        return []
    return sorted(path for path in safety.rglob("*.md"))


def archived_safety_files(root: Path) -> list[Path]:
    safety = root / "legacy" / "archived-general-domains" / "safety"
    if not safety.is_dir():
        return []
    return sorted(path for path in safety.rglob("*.md"))


def project_files(root: Path) -> list[Path]:
    files: list[Path] = []
    ignored_dirs = {".git", ".development", "coverage", "dist", "node_modules"}
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        rel_parts = path.relative_to(root).parts
        if rel_parts and rel_parts[0] in ignored_dirs:
            continue
        files.append(path)
    return files


def count_markdown_sections(path: Path, prefix: str) -> int:
    return sum(1 for line in read_text(path).splitlines() if line.startswith(prefix))


def collect_stats(root: Path) -> dict[str, Any]:
    branches = branch_files(root)
    categories: dict[str, int] = {}
    for path in branches:
        category = path.relative_to(root / "branches").parts[0]
        categories[category] = categories.get(category, 0) + 1

    return {
        "root": str(root),
        "branch_count": len(branches),
        "category_count": len(categories),
        "categories": dict(sorted(categories.items())),
        "template_count": count_markdown_sections(root / "templates.md", "## "),
        "checklist_count": count_markdown_sections(root / "checklists.md", "## "),
        "example_count": count_markdown_sections(root / "examples.md", "## Example"),
        "router_example_count": count_markdown_sections(root / "router.md", "### Example"),
        "eval_case_count": len(eval_case_files(root)),
        "eval_feature_count": len(eval_feature_files(root)),
        "lesson_file_count": len(lesson_files(root)),
        "adapter_file_count": len(adapter_files(root)),
        "safety_file_count": len(safety_files(root)),
        "manifest_exists": (root / "branches" / "manifest.yaml").is_file(),
        "resource_registry_exists": (root / "metadata" / "resources.yaml").is_file(),
    }


def print_stats(root: Path, as_json: bool) -> None:
    stats = collect_stats(root)
    if as_json:
        print(json.dumps(stats, ensure_ascii=False, indent=2))
        return

    print("# Skill Hub Statistics")
    print(f"- Root: `{stats['root']}`")
    print(f"- Branches: {stats['branch_count']}")
    print(f"- Categories: {stats['category_count']}")
    print(f"- Templates: {stats['template_count']}")
    print(f"- Checklists: {stats['checklist_count']}")
    print(f"- Examples: {stats['example_count']}")
    print(f"- Router examples: {stats['router_example_count']}")
    print(f"- Eval cases: {stats['eval_case_count']}")
    print(f"- Eval features: {stats['eval_feature_count']}")
    print(f"- Lesson files: {stats['lesson_file_count']}")
    print(f"- Adapter files: {stats['adapter_file_count']}")
    print(f"- Safety files: {stats['safety_file_count']}")
    print(f"- Manifest: {'yes' if stats['manifest_exists'] else 'no'}")
    print(f"- Resource registry: {'yes' if stats['resource_registry_exists'] else 'no'}")
    print("\n## Categories")
    for category, count in stats["categories"].items():
        print(f"- `{category}`: {count}")


def validate(root: Path) -> ValidationResult:
    errors: list[str] = []
    warnings: list[str] = []

    for rel in ROOT_FILES:
        if not (root / rel).is_file():
            errors.append(f"Missing root file: {rel}")

    branches_root = root / "branches"
    if not branches_root.is_dir():
        errors.append("Missing branches/ directory")
        return ValidationResult(errors, warnings)

    router = read_text(root / "router.md") if (root / "router.md").exists() else ""
    skill = read_text(root / "SKILL.md") if (root / "SKILL.md").exists() else ""

    for path in sorted(root.rglob("*")):
        rel_parts = path.relative_to(root).parts
        if rel_parts and rel_parts[0] in {".git", ".development"}:
            continue
        rel = path.relative_to(root).as_posix()
        if HAN_RE.search(rel):
            errors.append(f"Path must use English-only identifiers: {rel}")
        for alias in DEPRECATED_IDENTIFIER_ALIASES:
            if alias in rel:
                errors.append(f"Path contains deprecated identifier alias: {rel}")

    for path in project_files(root):
        rel = path.relative_to(root).as_posix()
        if HAN_RE.search(rel):
            errors.append(f"Path must use English-only identifiers: {rel}")

    for path in branch_files(root):
        rel = path.relative_to(root).as_posix()
        text = read_text(path)
        missing = [section for section in REQUIRED_BRANCH_SECTIONS if section not in text]
        if missing:
            errors.append(f"{rel} missing sections: {', '.join(missing)}")
        if "{{" not in text or "}}" not in text:
            warnings.append(f"{rel} has no template placeholders")
        if "- [ ]" not in text:
            warnings.append(f"{rel} has no checklist items")
        if rel not in router:
            warnings.append(f"{rel} is not referenced in router.md")
        if rel not in skill:
            warnings.append(f"{rel} is not referenced in SKILL.md")

    manifest_path = root / "branches" / "manifest.yaml"
    if manifest_path.exists():
        manifest = read_text(manifest_path)
        for rel_path in re.findall(r"path:\s*(branches/[^\s]+\.md)", manifest):
            if not (root / rel_path).is_file():
                errors.append(f"Manifest references missing branch: {rel_path}")
        for rel_path in re.findall(r"-\s*(evals/cases/[^\s]+\.yaml)", manifest):
            if not (root / rel_path).is_file():
                errors.append(f"Manifest references missing eval case: {rel_path}")
    else:
        errors.append("Missing branches/manifest.yaml")

    registry_path = root / "metadata" / "resources.yaml"
    if registry_path.exists():
        registry = read_text(registry_path)
        for rel_path in re.findall(r"path:\s*\"?([^\"\s]+)\"?", registry):
            if not (root / rel_path).is_file():
                errors.append(f"Resource registry references missing path: {rel_path}")
        for required_type in ["branch", "template", "checklist", "example", "eval", "adapter", "lesson"]:
            if f"- {required_type}" not in registry and f"{required_type}s:" not in registry:
                warnings.append(f"Resource registry may be missing resource type: {required_type}")
    else:
        errors.append("Missing metadata/resources.yaml")

    for path in project_files(root):
        rel = path.relative_to(root).as_posix()
        text = read_text(path)
        for alias in DEPRECATED_IDENTIFIER_ALIASES:
            if alias in text:
                errors.append(f"{rel} contains deprecated identifier alias: {alias}")
        for uri in RESOURCE_URI_RE.findall(text):
            if HAN_RE.search(uri):
                errors.append(f"{rel} contains non-English resource URI: {uri}")
            if not re.fullmatch(r"@[a-z-]+://[a-z0-9][a-z0-9./_-]*", uri):
                errors.append(f"{rel} contains non-canonical resource URI: {uri}")
        if path.suffix in {".yaml", ".yml"}:
            for line_number, line in enumerate(text.splitlines(), start=1):
                match = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
                if not match:
                    continue
                key, value = match.groups()
                if key in STABLE_YAML_IDENTIFIER_KEYS and HAN_RE.search(value):
                    errors.append(f"{rel}:{line_number} stable identifier field `{key}` contains Chinese text")

    evals = eval_case_files(root)
    if not evals:
        errors.append("Missing eval case files under evals/cases/")
    for path in evals:
        rel = path.relative_to(root).as_posix()
        text = read_text(path)
        missing_fields = [field for field in REQUIRED_EVAL_FIELDS if field not in text]
        if missing_fields:
            errors.append(f"{rel} missing eval fields: {', '.join(missing_fields)}")
        # Older eval cases remain valid without the round-2 registry fields.
        # New or touched cases should include these fields per evals/schema.md.

    features = eval_feature_files(root)
    if not features:
        errors.append("Missing eval feature files under evals/features/")
    for path in features:
        rel = path.relative_to(root).as_posix()
        text = read_text(path)
        if "Feature:" not in text or "Scenario:" not in text:
            errors.append(f"{rel} must contain Feature and Scenario blocks")

    lessons = lesson_files(root)
    if not lessons:
        errors.append("Missing lesson files under lessons/")
    for path in lessons:
        rel = path.relative_to(root).as_posix()
        text = read_text(path)
        missing_fields = [field for field in REQUIRED_LESSON_FIELDS if field not in text]
        if missing_fields:
            errors.append(f"{rel} missing lesson fields: {', '.join(missing_fields)}")

    if len(adapter_files(root)) < 6:
        errors.append("Expected adapters/README.md plus major target tool adapters")
    if not archived_safety_files(root):
        warnings.append("Archived safety files not found under legacy/archived-general-domains/safety")

    for path in [root / rel for rel in ROOT_FILES if (root / rel).exists()] + branch_files(root):
        text = read_text(path)
        for phrase in FORBIDDEN_VAGUE_PHRASES:
            if phrase in text:
                warnings.append(f"{path.relative_to(root)} contains vague phrase: {phrase}")

    return ValidationResult(errors, warnings)


def print_validation(root: Path, as_json: bool) -> int:
    result = validate(root)
    if as_json:
        print(json.dumps({"ok": result.ok, "errors": result.errors, "warnings": result.warnings}, ensure_ascii=False, indent=2))
    else:
        print("# Skill Hub Validation")
        print(f"- Root: `{root}`")
        print(f"- Status: {'OK' if result.ok else 'FAILED'}")
        if result.errors:
            print("\n## Errors")
            for item in result.errors:
                print(f"- {item}")
        if result.warnings:
            print("\n## Warnings")
            for item in result.warnings:
                print(f"- {item}")
    return 0 if result.ok else 1


def capabilities(root: Path) -> None:
    stats = collect_stats(root)
    print("# Prompt Engineering Skill Hub Capabilities")
    print(f"- Branch count: {stats['branch_count']}")
    print(f"- Template count: {stats['template_count']}")
    print(f"- Checklist count: {stats['checklist_count']}")
    print(f"- Example count: {stats['example_count']}")
    print(f"- Eval case count: {stats['eval_case_count']}")
    print(f"- Eval feature count: {stats['eval_feature_count']}")
    print(f"- Lesson file count: {stats['lesson_file_count']}")
    print(f"- Adapter file count: {stats['adapter_file_count']}")
    print(f"- Safety file count: {stats['safety_file_count']}")
    print(f"- Branch manifest: {'available' if stats['manifest_exists'] else 'missing'}")
    print(f"- Resource registry: {'available' if stats['resource_registry_exists'] else 'missing'}")
    print("\n## Supported Categories")
    for category, count in stats["categories"].items():
        print(f"- `{category}`: {count} branches")
    print("\n## Extension Automation")
    print("- `add-branch`: add a new scenario branch from a JSON spec.")
    print("- `validate`: verify branch structure, root files, router references, and vague phrase warnings.")
    print("- `stats`: count branches, categories, templates, checklists, and examples.")
    print("- `capabilities`: generate this capability summary.")
    print("\nOnly use `add-branch` after the user explicitly requests a new branch and confirms the branch spec.")


def next_number(path: Path, regex: str) -> int:
    text = read_text(path)
    numbers = [int(match.group(1)) for match in re.finditer(regex, text, flags=re.MULTILINE)]
    return max(numbers, default=0) + 1


def normalize_list(value: Any, field: str) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(item, str) and item.strip() for item in value):
        raise ValueError(f"{field} must be a non-empty list of strings")
    return [item.strip() for item in value]


def require_spec(spec: dict[str, Any], field: str) -> Any:
    value = spec.get(field)
    if value in (None, "", []):
        raise ValueError(f"Missing required spec field: {field}")
    return value


def branch_markdown(spec: dict[str, Any]) -> str:
    triggers = normalize_list(require_spec(spec, "triggers"), "triggers")
    required_inputs = normalize_list(require_spec(spec, "required_inputs"), "required_inputs")
    missing_rules = normalize_list(spec.get("missing_input_rules", ["缺失信息必须标注为待补充或阻塞问题"]), "missing_input_rules")
    construction_rules = normalize_list(require_spec(spec, "construction_rules"), "construction_rules")
    hard_constraints = normalize_list(require_spec(spec, "hard_constraints"), "hard_constraints")
    output_format = normalize_list(require_spec(spec, "output_format"), "output_format")
    checklist = normalize_list(require_spec(spec, "checklist"), "checklist")
    template_variables = normalize_list(require_spec(spec, "template_variables"), "template_variables")
    common_mistakes = spec.get("common_mistakes", [])
    if not isinstance(common_mistakes, list) or not common_mistakes:
        raise ValueError("common_mistakes must be a non-empty list")

    mistake_rows = []
    for item in common_mistakes:
        if isinstance(item, dict):
            mistake = item.get("mistake", "")
            risk = item.get("risk", "")
            repair = item.get("repair", "")
        else:
            mistake, risk, repair = item
        if not (mistake and risk and repair):
            raise ValueError("each common mistake must include mistake, risk, repair")
        mistake_rows.append(f"| {mistake} | {risk} | {repair} |")

    title = require_spec(spec, "title")
    purpose = require_spec(spec, "purpose")
    example_user = require_spec(spec, "example_user")
    example_prompt = require_spec(spec, "example_prompt")

    return f"""# {title}

## 1. Purpose
{purpose} 本分支只处理该场景专属 prompt 构造；跨场景原则使用 `../../common-principles.md`。

## 2. Trigger Conditions
{chr(10).join(f"- {item}" for item in triggers)}

## 3. Required Inputs
{chr(10).join(f"- {item}" for item in required_inputs)}

缺失信息处理：
{chr(10).join(f"- {item}" for item in missing_rules)}

## 4. Prompt Construction Rules
{chr(10).join(f"- {item}" for item in construction_rules)}

## 5. Hard Constraints
{chr(10).join(f"- {item}" for item in hard_constraints)}
- 必须包含可检查的验收标准。
- 不确定时必须标注假设或提出阻塞问题。

## 6. Output Format
最终 prompt 应要求目标模型输出：
{chr(10).join(f"- {item}" for item in output_format)}

## 7. Quality Checklist
{chr(10).join(f"- [ ] {item}" for item in checklist)}
- [ ] prompt 包含目标、输入、步骤、约束、输出格式、验收标准和自检。

## 8. Common Mistakes
| Common Mistake | Risk | Repair |
| --- | --- | --- |
{chr(10).join(mistake_rows)}

## 9. Reusable Template
```text
你是 {{{{target_ai_tool}}}}，请处理以下 {title} 任务。

任务目标：
{{{{task_goal}}}}

输入材料：
{chr(10).join(f"- {item}" for item in template_variables)}

执行要求：
{chr(10).join(f"{index + 1}. {item}" for index, item in enumerate(construction_rules))}

硬性约束：
{chr(10).join(f"- {item}" for item in hard_constraints)}

输出格式：
{{{{output_format}}}}

验收标准：
{{{{acceptance_criteria}}}}

自检：
- 检查目标、输入、步骤、约束、输出格式和验收标准是否全部满足。
- 对缺失或不确定的信息标注“假设”或“待补充”。
```

## 10. Example
用户原始需求：

```text
{example_user}
```

高质量 prompt：

```text
{example_prompt}
```
"""


def ensure_category_in_skill(skill: str, category: str) -> str:
    category_line = f"- `{category}`"
    if category_line not in skill:
        marker = "## 6. Branch Index"
        skill = skill.replace(marker, f"{category_line}\n\n{marker}", 1)
    return skill


def add_branch_index(skill: str, spec: dict[str, Any], branch_rel: str) -> str:
    category = require_spec(spec, "category")
    line = f"- `{branch_rel}`：{require_spec(spec, 'index_summary')}"
    if line in skill:
        return skill
    heading = f"### {category}"
    if heading in skill:
        pattern = re.compile(rf"({re.escape(heading)}\n)(.*?)(?=\n### |\n## 7\.|\n## 8\.|\Z)", re.S)
        match = pattern.search(skill)
        if not match:
            raise RuntimeError(f"Could not find branch index block for {category}")
        block = match.group(0).rstrip() + "\n" + line
        return skill[: match.start()] + block + skill[match.end():]
    marker = "## 7. Final Prompt Quality Standard"
    section = f"### {category}\n{line}\n\n"
    if marker not in skill:
        raise RuntimeError("Could not find final quality marker in SKILL.md")
    return skill.replace(marker, section + marker, 1)


def add_router_entries(router: str, spec: dict[str, Any], branch_rel: str) -> str:
    triggers = spec.get("routing_triggers") or spec.get("triggers")
    trigger_text = "；".join(normalize_list(triggers, "routing_triggers"))
    selection_line = f"- `{branch_rel}`：{trigger_text}。"
    if selection_line not in router:
        marker = "## 3.1 New Branch Auxiliary Routing Rules"
        if marker not in router:
            marker = "## 4. Multi-Branch Combination Rules"
        router = router.replace(marker, selection_line + "\n\n" + marker, 1)

    aux = normalize_list(spec.get("auxiliary_branches", []), "auxiliary_branches") if spec.get("auxiliary_branches") else []
    aux_line = f"- {require_spec(spec, 'title')}：主分支 `{branch_rel}`"
    if aux:
        aux_line += "；常见辅助分支 " + "、".join(f"`{item}`" for item in aux)
    aux_line += "。"
    if aux_line not in router:
        marker = "## 4. Multi-Branch Combination Rules"
        if "## 3.1 New Branch Auxiliary Routing Rules" not in router:
            router = router.replace(marker, "## 3.1 New Branch Auxiliary Routing Rules\n\n" + marker, 1)
        router = router.replace(marker, aux_line + "\n\n" + marker, 1)

    next_id = next_number_from_text(router, r"^### Example (\d+)")
    example = f"""### Example {next_id}
- 用户原始需求：{require_spec(spec, 'example_user')}
- 路由判断：{require_spec(spec, 'index_summary')}
- 主分支：`{branch_rel}`
- 辅助分支：{', '.join(f'`{item}`' for item in aux) if aux else '无'}
- 需要补充的信息：{'; '.join(normalize_list(require_spec(spec, 'required_inputs'), 'required_inputs')[:6])}
- prompt 生成策略：使用 `{require_spec(spec, 'title')}` 分支模板，补齐输入、约束、输出格式和验收标准。"""
    if example not in router:
        router = router.rstrip() + "\n" + example + "\n"
    return router


def next_number_from_text(text: str, regex: str) -> int:
    numbers = [int(match.group(1)) for match in re.finditer(regex, text, flags=re.MULTILINE)]
    return max(numbers, default=0) + 1


def append_template(root: Path, spec: dict[str, Any], dry_run: bool) -> None:
    path = root / "templates.md"
    text = read_text(path)
    title = require_spec(spec, "title")
    if f"{title} Prompt 模板" in text:
        return
    number = next_number(path, r"^## (\d+)\.")
    variables = normalize_list(require_spec(spec, "template_variables"), "template_variables")
    body = f"""## {number}. {title} Prompt 模板

**使用场景**：{require_spec(spec, 'index_summary')}

**可替换变量**：
{chr(10).join(f"- {item}" for item in variables)}

**模板正文**：
```text
请处理 {title} 任务。
任务目标：{{{{task_goal}}}}
输入材料：{{{{input_materials}}}}
约束：{{{{constraints}}}}
输出格式：{{{{output_format}}}}
验收标准：{{{{acceptance_criteria}}}}
必须先确认输入是否充分；不足时标注待补充或阻塞问题。
```

**填写说明**：按分支文件补齐场景专属变量，不要删除硬约束和验收标准。

**质量检查点**：
- [ ] 变量已填完整
- [ ] 硬约束已保留
- [ ] 验收标准可判断
"""
    write_text(path, text.rstrip() + "\n\n" + body, dry_run)


def append_checklist(root: Path, spec: dict[str, Any], dry_run: bool) -> None:
    path = root / "checklists.md"
    text = read_text(path)
    title = require_spec(spec, "title")
    if f"{title} Prompt 检查表" in text:
        return
    number = next_number(path, r"^## (\d+)\.")
    checklist = normalize_list(require_spec(spec, "checklist"), "checklist")
    body = f"""## {number}. {title} Prompt 检查表

{chr(10).join(f"- [ ] {item}" for item in checklist)}
"""
    write_text(path, text.rstrip() + "\n\n" + body, dry_run)


def append_example(root: Path, spec: dict[str, Any], branch_rel: str, dry_run: bool) -> None:
    path = root / "examples.md"
    text = read_text(path)
    title = require_spec(spec, "title")
    if f". {title}" in text:
        return
    number = next_number(path, r"^## Example (\d+)\.")
    aux = spec.get("auxiliary_branches", [])
    body = f"""## Example {number}. {title}

- 用户原始需求：{require_spec(spec, 'example_user')}
- 路由判断：{require_spec(spec, 'index_summary')}
- 主分支：`{branch_rel}`
- 辅助分支：{', '.join(f'`{item}`' for item in aux) if aux else '无'}
- 缺失信息与默认假设：缺失的关键输入必须标注为 `[待补充: field]`，涉及风险时作为阻塞问题。

最终生成的高质量 prompt：

```text
{require_spec(spec, 'example_prompt')}
```

为什么这样写：它绑定该场景关键输入、硬约束、输出格式和验收标准，并标注不确定内容。
"""
    write_text(path, text.rstrip() + "\n\n" + body, dry_run)


def add_branch(root: Path, spec_path: Path, dry_run: bool, overwrite: bool) -> int:
    spec = json.loads(read_text(spec_path))
    category = require_spec(spec, "category")
    slug = require_spec(spec, "slug")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", category):
        raise ValueError("category must use lowercase letters, digits, and hyphens")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug):
        raise ValueError("slug must use lowercase letters, digits, and hyphens")

    branch_rel = f"branches/{category}/{slug}.md"
    branch_path = root / branch_rel
    if branch_path.exists() and not overwrite:
        raise FileExistsError(f"Branch already exists: {branch_rel}. Use --overwrite only after review.")

    write_text(branch_path, branch_markdown(spec), dry_run)

    skill = ensure_category_in_skill(read_text(root / "SKILL.md"), category)
    skill = add_branch_index(skill, spec, branch_rel)
    write_text(root / "SKILL.md", skill, dry_run)

    router = add_router_entries(read_text(root / "router.md"), spec, branch_rel)
    write_text(root / "router.md", router, dry_run)

    append_template(root, spec, dry_run)
    append_checklist(root, spec, dry_run)
    append_example(root, spec, branch_rel, dry_run)

    if not dry_run:
        result = validate(root)
        if not result.ok:
            print("Branch added, but validation failed:", file=sys.stderr)
            for error in result.errors:
                print(f"- {error}", file=sys.stderr)
            return 1

    print(f"{'Would add' if dry_run else 'Added'} branch: {branch_rel}")
    return 0


def write_sample(path: Path) -> None:
    path.write_text(json.dumps(DEFAULT_SPEC, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(path)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manage Prompt Engineering Skill Hub branches.")
    parser.add_argument("--root", help="Skill root. Defaults to the parent directory of this script.")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add-branch", help="Add a new branch from a JSON spec.")
    add.add_argument("--root", help="Skill root. Can also be passed before the subcommand.")
    add.add_argument("--spec", required=True, help="Path to branch spec JSON.")
    add.add_argument("--dry-run", action="store_true", help="Print writes without changing files.")
    add.add_argument("--overwrite", action="store_true", help="Overwrite an existing branch file after explicit review.")

    val = sub.add_parser("validate", help="Validate hub structure.")
    val.add_argument("--root", help="Skill root. Can also be passed before the subcommand.")
    val.add_argument("--json", action="store_true")

    stats = sub.add_parser("stats", help="Print hub statistics.")
    stats.add_argument("--root", help="Skill root. Can also be passed before the subcommand.")
    stats.add_argument("--json", action="store_true")

    caps = sub.add_parser("capabilities", help="Explain current hub capabilities.")
    caps.add_argument("--root", help="Skill root. Can also be passed before the subcommand.")

    init = sub.add_parser("init-spec", help="Write a sample branch spec JSON.")
    init.add_argument("--root", help="Skill root. Can also be passed before the subcommand.")
    init.add_argument("--output", default="branch-spec.sample.json")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    root = root_path(args)

    if args.command == "add-branch":
        return add_branch(root, Path(args.spec), args.dry_run, args.overwrite)
    if args.command == "validate":
        return print_validation(root, args.json)
    if args.command == "stats":
        print_stats(root, args.json)
        return 0
    if args.command == "capabilities":
        capabilities(root)
        return 0
    if args.command == "init-spec":
        write_sample(Path(args.output))
        return 0
    raise AssertionError(args.command)


if __name__ == "__main__":
    raise SystemExit(main())
