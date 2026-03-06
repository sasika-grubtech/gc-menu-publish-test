/**
 * ============================================================================
 * TEST SCENARIO: Menu Published to Single Location
 * ============================================================================
 *
 * BUSINESS RULE: Verify basic single-location menu publishing
 *
 * TEST SETUP:
 * - Creates 1 product in GC3
 * - Creates 1 menu with 1 category
 * - Adds product to category
 *
 * TEST ACTIONS:
 * - Publish menu to a single location
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Menu is correctly associated with the location
 * ✅ Product appears in the menu
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'menu-to-single-location');

if (!scenario) {
  throw new Error('Scenario "menu-to-single-location" not found');
}

createTestFromScenario(scenario);
