/**
 * ============================================================================
 * TEST SCENARIO: Modifier Group Reuse Across Products
 * ============================================================================
 *
 * BUSINESS RULE: Rule 2 - Same modifier group needs to be reused without
 * duplicates if there is no hash change (overrides are not available)
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Attaches SAME modifier group to multiple products
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Modifier group appears ONCE (reused, not duplicated)
 * ✅ Multiple products reference the same modifier group
 * ✅ Total modifier groups = 2 (no duplicates)
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'modifier-group-reuse-across-products');

if (!scenario) {
  throw new Error('Scenario "modifier-group-reuse-across-products" not found');
}

createTestFromScenario(scenario);
