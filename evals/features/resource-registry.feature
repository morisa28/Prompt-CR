Feature: Resource registry selection

  Scenario: Bugfix branch maps to template, checklist, adapter, eval, and lesson
    Given the primary branch is "@branch://software-engineering/bugfix-debugging"
    When resources are selected from "metadata/resources.yaml"
    Then linked templates should include "@template://coding-agent/bugfix"
    And linked checklists should include "@checklist://coding-agent/final-review"
    And linked evals should include "@eval://software-engineering/bugfix-debugging/basic"
    And linked lessons should include "@lesson://routing/ambiguous-bugfix-request"

  Scenario: High-risk medical branch maps to safety resource
    Given the primary branch is "@branch://domain-specific/medical-health-info"
    When resources are selected
    Then safety resources should include "@safety://medical-boundary"
    And the final prompt should include the safety boundary

  Scenario: Target tool maps to adapter resource
    Given the user names "Codex CLI"
    When adapter selection runs
    Then selected resources should include "@adapter://codex-cli"
    And the generated prompt should include working directory, commands, verification, and failure reporting
