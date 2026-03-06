/**
 * ============================================================================
 * TEST SCENARIO: Menu Published to Multiple Locations
 * ============================================================================
 *
 * BUSINESS RULE: Verify menu can be published to multiple locations
 * and appears correctly in GC2 for each location
 *
 * TEST SETUP:
 * - Creates 1 product in GC3
 * - Creates 1 menu with 1 category
 * - Adds product to category
 *
 * TEST ACTIONS:
 * - Publish menu to multiple locations (e.g., Dubai, Colombo)
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Menu appears for all published locations
 * ✅ Products are correctly associated with each location
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'menu-to-multiple-locations');

if (!scenario) {
  throw new Error('Scenario "menu-to-multiple-locations" not found');
}

createTestFromScenario(scenario);
