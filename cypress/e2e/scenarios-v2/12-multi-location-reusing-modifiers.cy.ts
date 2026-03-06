/**
 * ============================================================================
 * TEST SCENARIO: Multi-Location with Reusing Modifiers
 * ============================================================================
 *
 * BUSINESS RULE: Verify menu published to multiple locations with
 * reused modifier groups
 *
 * TEST SETUP:
 * - Creates 4 products in GC3
 * - Creates 2 modifier groups
 * - Same modifier groups attached to products (reuse enabled)
 * - Builds nested modifier chains
 * - Creates 1 menu with 2 categories
 *
 * TEST ACTIONS:
 * - Publish menu to multiple locations (e.g., Dubai, Colombo)
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2 for all locations
 * ✅ Modifier groups are REUSED (not duplicated per location)
 * ✅ Products correctly appear in all locations
 * ✅ Total modifier groups = 2 (shared across locations)
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'multi-location-reusing-modifiers');

if (!scenario) {
  throw new Error('Scenario "multi-location-reusing-modifiers" not found');
}

createTestFromScenario(scenario);
