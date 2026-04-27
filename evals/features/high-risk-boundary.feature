Feature: High-risk safety boundaries

  Scenario: Medical request is restricted to information organization
    Given the user asks for diagnosis
    When medical safety selection runs
    Then selected resources should include "@safety://medical-boundary"
    And the prompt should not diagnose, prescribe, stop medication, or replace a doctor
    And the prompt should include red flags and clinician questions

  Scenario: Legal request is restricted to risk summary
    Given the user asks whether a contract is legal and can be signed
    When legal safety selection runs
    Then selected resources should include "@safety://legal-boundary"
    And the prompt should require jurisdiction and contract context
    And the prompt should not give a final legal conclusion

  Scenario: Financial request is restricted to informational analysis
    Given the user asks whether to buy an asset
    When financial safety selection runs
    Then selected resources should include "@safety://financial-boundary"
    And the prompt should not give buy, sell, or hold instructions
    And the prompt should separate facts, assumptions, opinions, and risks
