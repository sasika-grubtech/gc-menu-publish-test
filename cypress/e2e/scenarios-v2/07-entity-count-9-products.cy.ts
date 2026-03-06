/**
 * ============================================================================
 * TEST SCENARIO: Entity Count - 9 Products
 * ============================================================================
 *
 * BUSINESS RULE: Verify correct entity count mapping when publishing
 * 9 products with nested modifier chains
 *
 * TEST SETUP:
 * - Creates 9 products in GC3
 * - Creates 2 modifier groups
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Total menu items = 9 (all products synced)
 * ✅ Product count in GC3 equals menu item count in GC2
 * ✅ No missing or duplicate products
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'entity-count-9-products');

if (!scenario) {
  throw new Error('Scenario "entity-count-9-products" not found');
}

createTestFromScenario(scenario);
