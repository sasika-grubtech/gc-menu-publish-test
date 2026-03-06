/**
 * ============================================================================
 * TEST SCENARIO: Multi-Platform with Non-Duplicated Modifiers
 * ============================================================================
 *
 * BUSINESS RULE: Verify menu published to multiple platforms with
 * unique modifier groups per platform
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Unique modifier groups per product (no reuse)
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu to multiple platforms
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2 for all platforms
 * ✅ Products correctly appear on all platforms
 * ✅ Modifier groups correctly associated per platform
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'multi-platform-non-duplicated-modifiers');

if (!scenario) {
  throw new Error('Scenario "multi-platform-non-duplicated-modifiers" not found');
}

createTestFromScenario(scenario);
