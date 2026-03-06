/**
 * ============================================================================
 * TEST SCENARIO: Product Price Override and Merge
 * ============================================================================
 *
 * BUSINESS RULE: Rule 3 - Product should be duplicated with displaying a 
 * unique overridden value in the newly created product if the overrides 
 * are available for the product in GC3
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Builds nested modifier chains
 * - Creates 1 menu with 5 categories
 * - Same product is added to all categories
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 * - Override product prices in different categories
 * - Republish to verify price overrides
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ "Margherita Pizza" appears with DIFFERENT prices (duplicated products)
 * ✅ Price overrides correctly reflected in GC2
 * ✅ Each category shows the overridden price
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'product-price-override-merge');

if (!scenario) {
  throw new Error('Scenario "product-price-override-merge" not found');
}

createTestFromScenario(scenario);
