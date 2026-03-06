/**
 * ============================================================================
 * TEST SCENARIO: [Your Scenario Name Here]
 * ============================================================================
 * 
 * BUSINESS RULE(S): 
 * - Rule X: [Business rule description]
 * - Rule Y: [Another business rule if applicable]
 * 
 * TEST SETUP:
 * - [Describe what gets created in GC3]
 * - Creates X products
 * - Creates Y modifier groups
 * - Creates Z menu(s) with N categories
 * - [Any special configuration, e.g., nested chains, product reuse]
 * 
 * TEST ACTIONS:
 * - [List the actions performed]
 * - Publish menu
 * - Override price/field (if applicable)
 * - Revert changes (if applicable)
 * 
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ [List what should be verified in GC2]
 * ✅ Menu exists in GC2
 * ✅ Product count matches
 * ✅ Prices match exactly
 * ✅ [Any other specific verifications]
 * 
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * 
 * HOW TO USE:
 * 1. Copy this template
 * 2. Update the scenario ID below
 * 3. Fill in the documentation above
 * 4. Run the test!
 * ============================================================================
 */

import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

// Replace 'your-scenario-id' with the actual scenario ID from test-scenarios.config.ts
const scenarioId = 'your-scenario-id';

const scenario = getScenarioById(scenarioId);

if (scenario) {
  createTestFromScenario(scenario);
} else {
  throw new Error(`Scenario "${scenarioId}" not found in configuration. 
    
    Available scenarios:
    - product-reuse-no-override
    - product-price-override-merge
    - unique-modifier-groups
    - menu-to-multiple-locations
    - nested-modifier-combinations
    - simple-config-all-fields
    - entity-count-9-products
    
    Check test-scenarios.config.ts for the complete list.`);
}
