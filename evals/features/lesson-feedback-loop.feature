Feature: Lesson feedback loop

  Scenario: Known bugfix failure informs prompt construction
    Given the request matches "@lesson://routing/ambiguous-bugfix-request"
    When the final prompt is constructed
    Then the prompt should require logs or reproduction steps before changes
    And the route output should list the related lesson

  Scenario: Eval failure suggests a new lesson
    Given a generated prompt fails because it allows unsourced RAG answers
    When the eval result is reviewed
    Then the reviewer should suggest a lesson with trigger, failure_mode, root_cause, fix, update_targets, severity, and status
    And the lesson should point to the RAG branch, checklist, and eval case

  Scenario: Successful pattern becomes reusable guidance
    Given a prompt pattern repeatedly passes evals for repository analysis
    When a lesson is recorded
    Then the lesson type should be "successful-pattern"
    And it should identify the resource combination and reusable prompt structure
