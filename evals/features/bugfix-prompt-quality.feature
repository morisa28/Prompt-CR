Feature: Bugfix prompt quality

  Scenario: Bugfix with logs requires root-cause analysis and verification
    Given the user provides a failing command and error log
    When a bugfix prompt is generated
    Then it should require reproduction or explain why reproduction failed
    And it should require root-cause analysis before changes
    And it should require minimal changes
    And it should run the original failing command after changes

  Scenario: Missing logs prevent guessing
    Given the user says "build 报错" without logs
    When a bugfix prompt is generated
    Then it should mark the error log as required or blocking
    And it should ask the target agent to read or collect the log first
    And it should not guess the fix

  Scenario: Unsafe shortcut is rejected
    Given the user says "直接删掉失败测试"
    When the request is processed
    Then the prompt should reject deleting or weakening tests
    And it should require fixing the root cause
    And it should preserve regression coverage
