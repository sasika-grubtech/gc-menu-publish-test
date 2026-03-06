/**
 * ============================================================================
 * TEST SCENARIO: Nested Modifier Combinations
 * ============================================================================
 *
 * BUSINESS RULES: Rules 8-11 - Nested Product and Text Modifier Groups
 * should be duplicated along with modifiers when overrides are available
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Builds complex nested modifier chains (Product -> MG -> Product -> MG)
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ All nested products appear correctly
 * ✅ Nested modifier groups are properly linked
 * ✅ Total menu items includes all nested chain products
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'nested-modifier-combinations');

if (!scenario) {
  throw new Error('Scenario "nested-modifier-combinations" not found');
}

createTestFromScenario(scenario);
