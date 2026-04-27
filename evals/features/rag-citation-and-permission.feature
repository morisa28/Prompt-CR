Feature: RAG citation and permission control

  Scenario: Knowledge base answers require citations
    Given the user asks for a RAG knowledge base with source citations
    When the prompt is generated
    Then it should define knowledge sources, chunking, metadata, retrieval, rerank, and citation format
    And it should require citations for every substantive answer
    And it should refuse or clarify when no evidence is retrieved

  Scenario: Department permissions are enforced
    Given the user says different departments have different document access
    When the prompt is generated
    Then it should define user roles and document permissions
    And it should apply permission filters before and after retrieval
    And it should include audit logs
    And it should test permission leakage

  Scenario: Missing knowledge sources block reliable RAG design
    Given no knowledge sources are provided
    When the request is normalized
    Then knowledge_sources should be marked as blocking or required
    And the prompt should not pretend a corpus exists
