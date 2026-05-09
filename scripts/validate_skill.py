#!/usr/bin/env python3
"""Lightweight validation for the Prompt-CR skill package."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "SKILL.md",
    ".github/workflows/block-main-merge.yml",
    "agents/openai.yaml",
    "references/scenarios.md",
    "references/prompt-patterns.md",
    "references/quality-checklist.md",
    "references/examples.md",
    "README.md",
    "LICENSE",
]
FORBIDDEN_PATHS = [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "eslint.config.js",
    "src",
    "tests",
    "public",
    "evals",
    "node_modules",
]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def fail(message: str) -> None:
    print(f"[FAIL] {message}")
    sys.exit(1)


def check_required_files() -> None:
    for path in REQUIRED_FILES:
        if not (ROOT / path).exists():
            fail(f"Missing required file: {path}")


def check_forbidden_paths() -> None:
    for path in FORBIDDEN_PATHS:
        if (ROOT / path).exists():
            fail(f"Old system artifact still exists: {path}")


def check_skill_frontmatter() -> None:
    content = read("SKILL.md")
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        fail("SKILL.md must start with YAML frontmatter")

    frontmatter = match.group(1)
    if "name: prompt-cr" not in frontmatter:
        fail("SKILL.md frontmatter must include name: prompt-cr")
    if "description:" not in frontmatter:
        fail("SKILL.md frontmatter must include description")
    if "$prompt-cr" in content:
        fail("Do not mention invocation syntax inside SKILL.md body; keep it in README/openai.yaml")

    for reference in [
        "references/scenarios.md",
        "references/prompt-patterns.md",
        "references/quality-checklist.md",
        "references/examples.md",
    ]:
        if reference not in content:
            fail(f"SKILL.md does not link {reference}")


def check_openai_yaml() -> None:
    content = read("agents/openai.yaml")
    required = [
        'display_name: "Prompt-CR"',
        "short_description:",
        'default_prompt: "Use $prompt-cr',
    ]
    for item in required:
        if item not in content:
            fail(f"agents/openai.yaml missing {item}")


def check_reference_content() -> None:
    scenarios = read("references/scenarios.md")
    expected_terms = [
        "Bugfix",
        "Feature",
        "Refactor",
        "Test",
        "Code Review",
        "Repository Analysis",
        "API Design",
        "Database Migration",
        "DevOps",
        "Security Threat Modeling",
        "Algorithm",
        "CLI Agent",
        "Plan Mode",
        "Frontend",
        "Backend",
    ]
    for term in expected_terms:
        if term not in scenarios:
            fail(f"references/scenarios.md missing scenario term: {term}")

    checklist = read("references/quality-checklist.md")
    for dimension in [
        "Clarity",
        "Context",
        "Locatable inputs",
        "Constraints",
        "Output format",
        "Acceptance criteria",
        "Risk handling",
        "Agent adaptation",
    ]:
        if dimension not in checklist:
            fail(f"quality checklist missing dimension: {dimension}")


def check_branch_guard() -> None:
    readme = read("README.md")
    skill = read("SKILL.md")
    workflow = read(".github/workflows/block-main-merge.yml")

    for label, content in [("README.md", readme), ("SKILL.md", skill)]:
        if "Prompt_CR-skill" not in content or "main" not in content:
            fail(f"{label} must document the Prompt_CR-skill to main merge ban")

    required_workflow_terms = [
        "pull_request:",
        "branches:",
        "- main",
        "github.head_ref == 'Prompt_CR-skill'",
        "github.base_ref == 'main'",
        "exit 1",
    ]
    for term in required_workflow_terms:
        if term not in workflow:
            fail(f"branch guard workflow missing: {term}")


def main() -> None:
    check_required_files()
    check_forbidden_paths()
    check_skill_frontmatter()
    check_openai_yaml()
    check_reference_content()
    check_branch_guard()
    print("[OK] Prompt-CR skill package is valid")


if __name__ == "__main__":
    main()
