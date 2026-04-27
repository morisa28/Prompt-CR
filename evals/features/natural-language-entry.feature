Feature: Natural language prompt generation

  Scenario: User asks for a Codex prompt to fix a build error
    Given the user says "帮我写一个 prompt，让 Codex 修复 npm run build 报错，但不要乱改项目"
    And the user does not provide the full error log
    When the Prompt Engineering Skill Hub processes the request
    Then the primary branch should be "software-engineering/bugfix-debugging"
    And the auxiliary branches should include "software-engineering/test-generation"
    And the adapter resources should include "@adapter://codex"
    And the missing error log should be marked as required or blocking
    And the generated prompt should forbid unrelated refactors and deleting tests
    And the generated prompt should include verification commands

  Scenario: User describes a product idea for a development agent
    Given the user says "把这个产品想法改成可交给 Claude Code 的开发任务"
    When the request is normalized
    Then the final deliverable should be a dev-agent prompt
    And the primary branch should be "product-design-business/product-requirements" or "software-engineering/coding-feature-development"
    And the adapter resources should include "@adapter://claude-code"
    And the prompt should require scope, non-goals, acceptance criteria, and verification

  Scenario: User asks for a medical prompt without diagnosis
    Given the user says "帮我生成一个医疗信息整理 prompt，但不要让模型做诊断"
    When the request is routed
    Then the safety resources should include "@safety://medical-boundary"
    And the risk level should be "high"
    And the generated prompt should organize symptoms and red flags
    And the generated prompt should not diagnose or prescribe
