# Test Scenarios V2 - Individual Test Files

This folder contains **individual test files** for each of the 17 configured scenarios, plus helper files.

## File Structure

### Individual Scenario Files (17 Total)

Each numbered file tests a specific scenario with clear documentation:

#### Product Reuse & Override (5 files)
- `01-product-reuse-no-override.cy.ts` - Product reuse without overrides (Rule 1)
- `02-product-price-override-merge.cy.ts` - Product price override and merge (Rule 3)
- `03-unique-modifier-groups.cy.ts` - Unique modifier groups per product
- `04-menu-to-multiple-locations.cy.ts` - Menu published to multiple locations
- `05-nested-modifier-combinations.cy.ts` - Nested modifier chains (Rules 8-11)

#### Simple Configuration (2 files)
- `06-simple-config-all-fields.cy.ts` - Simple config with ALL fields
- `08-simple-config-mandatory-fields.cy.ts` - Simple config with ONLY mandatory fields

#### Entity Count Testing (2 files)
- `07-entity-count-9-products.cy.ts` - Verify 9 products entity count
- `11-entity-count-4-products.cy.ts` - Verify 4 products entity count

#### Location & Modifier Testing (2 files)
- `09-menu-to-single-location.cy.ts` - Basic single location publishing
- `10-modifier-group-reuse-across-products.cy.ts` - Modifier group reuse (Rule 2)

#### Multi-Location (2 files)
- `12-multi-location-reusing-modifiers.cy.ts` - Multiple locations with reused modifiers
- `13-multi-location-non-duplicated-modifiers.cy.ts` - Multiple locations with unique modifiers

#### Multi-Platform (3 files)
- `14-multi-platform-glovo-uber-eats.cy.ts` - Glovo + Uber Eats publishing
- `15-multi-platform-reusing-modifiers.cy.ts` - Multi-platform with reused modifiers
- `16-multi-platform-non-duplicated-modifiers.cy.ts` - Multi-platform with unique modifiers

#### Remove/Add Logic (1 file)
- `17-modifier-remove-add-back.cy.ts` - Modifier group remove and add back (Rule 14)

### Helper Files

- `all-scenarios.cy.ts` - **Batch runner** that executes all 17 scenarios in sequence
- `framework-verification.cy.ts` - Quick framework health check
- `TEMPLATE.cy.ts` - Template for creating new test files
- `README.md` - This file

---

## How to Run Tests

### Run All Scenarios (Batch)
```bash
npm run test:scenarios-v2
```

Or specifically run the batch file:
```bash
npx cypress run --spec "cypress/e2e/scenarios-v2/all-scenarios.cy.ts"
```

### Run Individual Scenario
```bash
# Run product reuse test
npx cypress run --spec "cypress/e2e/scenarios-v2/01-product-reuse-no-override.cy.ts"

# Run price override test
npx cypress run --spec "cypress/e2e/scenarios-v2/02-product-price-override-merge.cy.ts"

# Run entity count test
npx cypress run --spec "cypress/e2e/scenarios-v2/11-entity-count-4-products.cy.ts"
```

### Run Multiple Specific Scenarios
```bash
# Run scenarios 1, 2, and 3
npx cypress run --spec "cypress/e2e/scenarios-v2/01-*.cy.ts,cypress/e2e/scenarios-v2/02-*.cy.ts,cypress/e2e/scenarios-v2/03-*.cy.ts"
```

### Open Cypress UI (Interactive)
```bash
npx cypress open
```

---

## Test File Format

Each test file follows this structure:

```typescript
/**
 * ============================================================================
 * TEST SCENARIO: [Scenario Name]
 * ============================================================================
 *
 * BUSINESS RULE: [Which rule this tests]
 *
 * TEST SETUP:
 * - [What gets created in GC3]
 *
 * TEST ACTIONS:
 * - [What happens during the test]
 *
 * EXPECTED RESULTS (GC2 Verification):
 * ✅ [What should be verified]
 *
 * CLEANUP:
 * - [What gets cleaned up]
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

const scenario = TEST_SCENARIOS.find(s => s.id === 'scenario-id');

if (!scenario) {
  throw new Error('Scenario "scenario-id" not found');
}

createTestFromScenario(scenario);
```

---

## Scenario Configuration

All scenarios are configured in:
```
cypress/support/test-config/test-scenarios.config.ts
```

To add a new scenario:
1. Add configuration to `test-scenarios.config.ts`
2. Copy `TEMPLATE.cy.ts` to a new file
3. Update the scenario ID in the new file

See `docs/ADD_NEW_SCENARIOS.md` for detailed guide.

---

## Quick Scenario Reference

| File | Scenario | Business Rule | Products | Categories | Modifiers |
|------|----------|---------------|----------|------------|-----------|
| 01 | Product Reuse No Override | Rule 1 | 4 | 2 | 2 |
| 02 | Product Price Override Merge | Rule 3 | 4 | 5 | 2 |
| 03 | Unique Modifier Groups | Rule 2 | 4 | 2 | 2 |
| 04 | Menu to Multiple Locations | - | 1 | 1 | 0 |
| 05 | Nested Modifier Combinations | Rules 8-11 | 4 | 2 | 2 |
| 06 | Simple Config All Fields | - | 1 | 1 | 0 |
| 07 | Entity Count 9 Products | - | 9 | 2 | 2 |
| 08 | Simple Config Mandatory Fields | - | 1 | 1 | 0 |
| 09 | Menu to Single Location | - | 1 | 1 | 0 |
| 10 | Modifier Group Reuse | Rule 2 | 4 | 2 | 2 |
| 11 | Entity Count 4 Products | - | 4 | 2 | 2 |
| 12 | Multi-Location Reusing Modifiers | - | 4 | 2 | 2 |
| 13 | Multi-Location Non-Duplicated | - | 4 | 2 | 2 |
| 14 | Multi-Platform Glovo + Uber Eats | - | 1 | 1 | 0 |
| 15 | Multi-Platform Reusing Modifiers | - | 4 | 2 | 2 |
| 16 | Multi-Platform Non-Duplicated | - | 4 | 2 | 2 |
| 17 | Modifier Remove and Add Back | Rule 14 | 3 | 2 | 2 |

---

## Benefits of Individual Files

### ✅ Advantages
- **Fast feedback** - Run only the test you need
- **Easy debugging** - Isolate specific scenarios
- **Clear naming** - Know what each file tests
- **Parallel execution** - Run multiple tests simultaneously
- **Better organization** - Numbered files show execution order

### When to Use
- **Development** - Run individual files while working on specific features
- **Debugging** - Isolate and debug failing scenarios
- **Quick verification** - Test specific business rules
- **CI/CD** - Run specific scenarios in parallel pipelines

### When to Use Batch Runner
- **Regression testing** - Verify all scenarios work together
- **Release validation** - Complete system test before deployment
- **Nightly builds** - Comprehensive automated testing
- **Full coverage** - Ensure all 15 business rules pass

---

## Tips

1. **Start with individual files** during development for fast feedback
2. **Use numbered prefixes** (01-, 02-) to maintain clear ordering
3. **Read the headers** in each file to understand what's being tested
4. **Run batch file** (`all-scenarios.cy.ts`) for comprehensive testing
5. **Use framework-verification.cy.ts** to quickly check if framework is working

---

## Next Steps

1. Browse individual test files to see what each scenario tests
2. Run a specific scenario: `npx cypress run --spec "cypress/e2e/scenarios-v2/01-*.cy.ts"`
3. Add new scenarios by copying `TEMPLATE.cy.ts`
4. See `docs/ADD_NEW_SCENARIOS.md` for complete guide

---

**Happy Testing! 🚀**
