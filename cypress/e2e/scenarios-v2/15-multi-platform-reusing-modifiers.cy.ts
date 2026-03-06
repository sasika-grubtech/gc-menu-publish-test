/**
 * ============================================================================
 * TEST SCENARIO: Multi-Platform with Reusing Modifiers
 * ============================================================================
 *
 * BUSINESS RULE: Verify menu published to multiple platforms with
 * reused modifier groups across platforms
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Same modifier groups reused (no duplication)
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu to multiple platforms (Glovo, Uber Eats, etc.)
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2 for all platforms
 * ✅ Modifier groups are REUSED (not duplicated per platform)
 * ✅ Products correctly appear on all platforms
 * ✅ Total modifier groups = 2 (shared across platforms)
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'multi-platform-reusing-modifiers');

if (!scenario) {
  throw new Error('Scenario "multi-platform-reusing-modifiers" not found');
}

createTestFromScenario(scenario);
