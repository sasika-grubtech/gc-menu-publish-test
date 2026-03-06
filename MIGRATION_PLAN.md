# 🔄 Test Migration Guide - All 17 Scenarios

## 📊 Migration Status

I've analyzed all 17 existing test files in the `scenarios` folder. Here's the complete conversion plan:

---

## 📋 Test Inventory

| # | Old Test File | Scenario Type | Status |
|---|---------------|---------------|--------|
| 1 | `simple-config/simple-config-with-mandatory-fields.cy.ts` | Mandatory fields only | ✅ Ready |
| 2 | `simple-config/simple-config-with-all-fields.cy.ts` | All fields | ✅ Exists |
| 3 | `product-reuse-between-category/4-products-2-category-1modifier-reuse.cy.ts` | Product reuse | ✅ Exists |
| 4 | `unique-modifier-groups/4-products-2-category-1modifier.cy.ts` | Unique modifiers | ✅ Exists |
| 5 | `reuse-modifier-group-across-products/4-products-2-category-1modifier.cy.ts` | Modifier reuse | ✅ Ready |
| 6 | `nested-combination/nested.cy.ts` | Nested modifiers | ✅ Exists |
| 7 | `menu-to-multiple-locations/1-menu-to-multiple-locations.cy.ts` | Multi-location | ✅ Ready |
| 8 | `menu-to-multiple-locations/4-products-2-category-2-modifier-not-duplicated-modifier-multi-location.cy.ts` | Multi-location + no duplicate | ✅ Ready |
| 9 | `menu-to-multiple-locations/4-products-2-category-2-reusing-modifier-multi-location.cy.ts` | Multi-location + reuse | ✅ Ready |
| 10 | `same-menu-for-different-food-platforms/1-menu-multi-platform-glovo-uber-eats.cy.ts` | Multi-platform | ✅ Ready |
| 11 | `same-menu-for-different-food-platforms/4-products-2-category-2-modifier-not-duplicated-modifier-multi-platform.cy.ts` | Multi-platform + no duplicate | ✅ Ready |
| 12 | `same-menu-for-different-food-platforms/4-products-2-category-2-reusing-modifier-multi-platform.cy.ts` | Multi-platform + reuse | ✅ Ready |
| 13 | `product-price-override-gc2-merge/same-product-two-categories-price-override-gc2.cy.ts` | Price override (2 cat) | ✅ Exists |
| 14 | `product-price-override-gc2-merge/same-product-five-categories-price-override-gc2.cy.ts` | Price override (5 cat) | ✅ Ready |
| 15 | `product-price-override-gc2-merge/same-product-two-categories-modifier-remove-add-gc2.cy.ts` | Modifier remove/add | ✅ Ready |
| 16 | `entity-count-mapping/4-product-2-category-1menu-.cy.ts` | Entity count (4) | ✅ Ready |
| 17 | `entity-count-mapping/9-product-2-category-1menu-.cy.ts` | Entity count (9) | ✅ Exists |

---

## 🎯 Conversion Strategy

Due to the large number of tests, I'll provide:
1. **Add all missing scenarios** to the configuration
2. **Create converted test files** for each
3. **Maintain old tests** for reference during migration

---

## 📝 Quick Conversion Steps

For each test, the conversion follows this pattern:

### Old Way (68+ lines):
```typescript
import { ProductMiddleLayer } from "...";
// ... 10+ imports

const productMiddleLayer = new ProductMiddleLayer();
// ... 7+ initializations

describe('Test Name', () => {
  after(() => { /* 8+ cleanup calls */ });
  it('Create products', () => { /* ... */ });
  it('Create modifiers', () => { /* ... */ });
  it('Create menu', () => { /* ... */ });
  it('Publish', () => { /* ... */ });
  it('Verify', () => { /* ... */ });
});
```

### New Way (40 lines with documentation):
```typescript
/**
 * ============================================================================
 * TEST SCENARIO: Clear Name
 * Business Rules: Rule X
 * Setup: Creates X products...
 * Expected: Verifies Y...
 * ============================================================================
 */
import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

const scenario = getScenarioById('scenario-id');
if (scenario) createTestFromScenario(scenario);
```

---

## 🚀 Let Me Convert Them All

I'll now convert all 17 tests. This will take a few minutes...

