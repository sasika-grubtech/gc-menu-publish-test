/**
 * ============================================================================
 * TEST SCENARIO: Multi-Platform (Glovo + Uber Eats)
 * ============================================================================
 *
 * BUSINESS RULE: Verify same menu can be published to multiple
 * food delivery platforms (Glovo and Uber Eats)
 *
 * TEST SETUP:
 * - Creates 1 product in GC3
 * - Creates 1 menu with 1 category
 *
 * TEST ACTIONS:
 * - Publish menu to Glovo (multiple locations: Dubai, Colombo)
 * - Publish menu to Uber Eats (multiple service modes: Delivery, Pickup)
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ Menu exists in GC2 for Glovo locations
 * ✅ Menu exists in GC2 for Uber Eats service modes
 * ✅ Product appears correctly for all platforms
 * ✅ Platform-specific configurations are respected
 *
 * CLEANUP:
 * - Automatically cleans up all created entities in GC3 and GC2
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'multi-platform-glovo-uber-eats');

if (!scenario) {
  throw new Error('Scenario "multi-platform-glovo-uber-eats" not found');
}

createTestFromScenario(scenario);
