/**
 * ============================================================================
 * TEST SCENARIO: Modifier Group Remove and Add Back
 * ============================================================================
 *
 * BUSINESS RULE: Rule 14 - Need to add remove logic
 * Verify modifier group removal and re-addition workflow
 *
 * TEST SETUP:
 * - Creates 3 products in GC3
 * - Creates 2 modifier groups
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 * - Same product reused in both categories
 *
 * TEST WORKFLOW:
 * 1. Publish menu → verify 1 product, 1 modifier group in GC2
 * 2. Remove modifier group from product in GC3 → republish
 * 3. Verify product still exists, modifier group removed
 * 4. Add modifier group back to product in GC3 → republish
 * 5. Verify 1 product and 1 modifier group again
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Initial: 1 product, 1 modifier group
 * ✅ After remove: 1 product, modifier group removed from product
 * ✅ After add back: 1 product, 1 modifier group restored
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'modifier-remove-add-back');

if (!scenario) {
  throw new Error('Scenario "modifier-remove-add-back" not found');
}

createTestFromScenario(scenario);
