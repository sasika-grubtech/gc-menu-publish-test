/**
 * ============================================================================
 * TEST SCENARIO: Simple Configuration with All Fields
 * ============================================================================
 *
 * BUSINESS RULE: Verify basic menu creation and publishing with all 
 * product fields populated
 *
 * TEST SETUP:
 * - Creates 1 product in GC3 (with ALL fields filled)
 * - Creates 1 menu with 1 category
 * - Adds product to category
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Total menu items = 1
 * ✅ Product details match exactly (name, description, price, etc.)
 * ✅ All fields are correctly synced from GC3
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'simple-config-all-fields');

if (!scenario) {
  throw new Error('Scenario "simple-config-all-fields" not found');
}

createTestFromScenario(scenario);
