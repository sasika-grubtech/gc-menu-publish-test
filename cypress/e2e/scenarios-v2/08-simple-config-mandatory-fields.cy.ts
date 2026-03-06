/**
 * ============================================================================
 * TEST SCENARIO: Simple Configuration with Mandatory Fields Only
 * ============================================================================
 *
 * BUSINESS RULE: Verify menu creation and publishing works with only
 * mandatory fields (minimal configuration)
 *
 * TEST SETUP:
 * - Creates 1 product in GC3 (ONLY mandatory fields)
 * - Creates 1 menu with 1 category
 * - Adds product to category
 *
 * TEST ACTIONS:
 * - Publish menu from GC3 to GC2
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2
 * ✅ Total menu items = 1
 * ✅ Product appears with mandatory fields only
 * ✅ No errors with minimal configuration
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'simple-config-mandatory-fields');

if (!scenario) {
  throw new Error('Scenario "simple-config-mandatory-fields" not found');
}

createTestFromScenario(scenario);
