/**
 * ============================================================================
 * TEST SCENARIO: Product Reuse Without Override
 * ============================================================================
 *
 * BUSINESS RULE: Rule 1 - Same product needs to be reused without duplicates
 * if there is no hash change (overrides are not available)
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 * - Each category uses the SAME products (reuse enabled)
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Total menu items count = 3
 * ✅ "Margherita Pizza" appears only ONCE (not duplicated)
 * ✅ Product is reused across categories without duplication
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'product-reuse-no-override');

if (!scenario) {
  throw new Error('Scenario "product-reuse-no-override" not found');
}

createTestFromScenario(scenario);
