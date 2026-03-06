/**
 * ============================================================================
 * TEST SCENARIO: Unique Modifier Groups Per Product
 * ============================================================================
 *
 * BUSINESS RULE: Rule 2 - Same modifier group needs to be reused without 
 * duplicates if there is no hash change
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 * - Each category has unique products (no reuse)
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Total menu items = 9 (includes modifier chain products)
 * ✅ Modifier groups are reused (not duplicated)
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'unique-modifier-groups');

if (!scenario) {
  throw new Error('Scenario "unique-modifier-groups" not found');
}

createTestFromScenario(scenario);
