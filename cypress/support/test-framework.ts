/**
 * Test Framework Index
 * 
 * Convenient entry point for importing test framework components.
 * Use this to simplify imports in your test files.
 */

// Main test builder
export { ScenarioTestBuilder, createTestFromScenario } from './test-builders/scenario-test-builder';

// Configuration types and helpers
export {
  TestScenarioConfig,
  TestAction,
  TestVerification,
  TEST_SCENARIOS,
  getScenarioById,
  getScenariosByTag,
  validateScenario,
} from './test-config/test-scenarios.config';

// Verification logic library
export { VerificationLogic } from './verification-logic/verification-rules';

/**
 * Usage Example:
 * 
 * import { createTestFromScenario, getScenarioById } from 'cypress/support/test-framework';
 * 
 * const scenario = getScenarioById('my-test');
 * if (scenario) {
 *   createTestFromScenario(scenario);
 * }
 */
