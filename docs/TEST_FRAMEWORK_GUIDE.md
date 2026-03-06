# GC3 → GC2 Test Framework Documentation

## 🎯 Overview

This framework simplifies creating and managing Cypress tests for GC3 menu publishing to GC2. Instead of writing repetitive test code, you define test scenarios in a configuration file, and the framework generates the tests automatically.

## 🚀 Quick Start

### Adding a New Test (Simple Way)

1. **Open the configuration file**:
   ```
   cypress/support/test-config/test-scenarios.config.ts
   ```

2. **Add your scenario to the `TEST_SCENARIOS` array**:
   ```typescript
   {
     id: 'my-new-test',
     name: 'My New Test Scenario',
     description: 'What this test verifies',
     setup: {
       products: 4,
       modifierGroups: 2,
       nestedModifierChain: {
         chainIndex: 1,
         productCount: 4,
         modifierGroupCount: 2,
       },
       menu: {
         count: 1,
         categoriesPerMenu: 2,
         productsPerCategory: 2,
         reuseProducts: true,
       },
     },
     actions: [
       { type: 'publish' },
     ],
     verifications: [
       { type: 'gc2_menu_exists' },
       { 
         type: 'gc2_product_count_by_name',
         displayName: 'Margherita Pizza',
         expectedCount: 1,
       },
     ],
     cleanup: {
       menus: 1,
       products: 4,
       modifierGroups: 2,
       gc2MenuItems: 4,
       gc2Menus: 1,
       gc2ModifierGroups: 2,
     },
   }
   ```

3. **Create a test file**:
   ```typescript
   // cypress/e2e/scenarios-v2/my-new-test.cy.ts
   import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
   import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

   const scenario = getScenarioById('my-new-test');
   if (scenario) {
     createTestFromScenario(scenario);
   }
   ```

4. **Run the test**:
   ```bash
   npm run cy:open:master
   ```

That's it! 🎉

---

## 📋 Configuration Guide

### Scenario Structure

Each scenario has these main sections:

#### 1. **Metadata**
```typescript
id: 'unique-id',           // Unique identifier
name: 'Test Name',          // Human-readable name
description: 'What it tests', // Brief description
```

#### 2. **Setup** (What to create in GC3)
```typescript
setup: {
  products: 4,              // Number of products to create
  modifierGroups: 2,        // Number of modifier groups to create
  
  // Optional: Configure nested modifier chains
  nestedModifierChain: {
    chainIndex: 1,          // Starting index
    productCount: 4,        // Products in chain
    modifierGroupCount: 2,  // Modifier groups in chain
  },
  
  // Menu configuration
  menu: {
    count: 1,                    // Number of menus
    categoriesPerMenu: 2,        // Categories per menu
    productsPerCategory: 2,      // Products per category
    reuseProducts: true,         // true = reuse same products across categories
                                 // false = unique products per category
  },
}
```

#### 3. **Actions** (What to do with the data)
```typescript
actions: [
  // Publish the menu
  { type: 'publish' },
  
  // Override product price
  { 
    type: 'override_product_price',
    categoryIndex: 1,              // 0-based index
    productDisplayName: 'Margherita Pizza',
    newPrice: '999.00',
  },
  
  // Revert product price
  {
    type: 'revert_product_price',
    categoryIndex: 1,
    productDisplayName: 'Margherita Pizza',
    originalPrice: '150.00',
  },
  
  // More action types coming soon...
]
```

#### 4. **Verifications** (What to check in GC2)
```typescript
verifications: [
  // Check menu exists
  { type: 'gc2_menu_exists' },
  
  // Check product count by name
  { 
    type: 'gc2_product_count_by_name',
    displayName: 'Margherita Pizza',
    expectedCount: 1,
  },
  
  // Check products with different prices
  {
    type: 'gc2_product_with_different_prices',
    displayName: 'Margherita Pizza',
    price1: '150.00',
    price2: '999.00',
  },
  
  // Check modifier group count
  {
    type: 'gc2_modifier_groups_count',
    expectedCount: 1,
  },
  
  // Check modifier group doesn't exist
  {
    type: 'gc2_modifier_group_not_exists',
    displayName: 'Some Modifier Group',
  },
  
  // Check menu per location
  {
    type: 'gc2_menu_per_location',
    expectedLocationCount: 2,
    locations: ['Location A', 'Location B'],
    brandName: 'KFC',
  },
]
```

#### 5. **Cleanup** (What to delete after test)
```typescript
cleanup: {
  menus: 1,                  // GC3 menus to delete
  products: 4,               // GC3 products to delete
  modifierGroups: 2,         // GC3 modifier groups to delete
  gc2MenuItems: 4,           // GC2 menu items to delete
  gc2Menus: 1,               // GC2 menus to delete
  gc2ModifierGroups: 2,      // GC2 modifier groups to delete
}
```

---

## 🔍 Available Action Types

| Action Type | Description | Parameters |
|------------|-------------|------------|
| `publish` | Publish menu to GC2 | None |
| `override_product_price` | Override product price in category | `categoryIndex`, `productDisplayName`, `newPrice` |
| `revert_product_price` | Revert product price to original | `categoryIndex`, `productDisplayName`, `originalPrice` |
| `add_product_to_category` | Add product to category | `categoryIndex`, `productDisplayName` |
| `remove_product_from_category` | Remove product from category | `categoryIndex`, `productDisplayName` |
| `override_product_field` | Override product field | `categoryIndex`, `productDisplayName`, `field`, `newValue` |

*More action types will be added as needed*

---

## ✅ Available Verification Types

| Verification Type | Description | Parameters |
|------------------|-------------|------------|
| `gc2_menu_exists` | Check menu exists in GC2 | None |
| `gc2_menu_items_count` | Check total menu items | `expectedCount` |
| `gc2_product_count_by_name` | Check product count by name | `displayName`, `expectedCount` |
| `gc2_product_with_different_prices` | Check product with 2 prices | `displayName`, `price1`, `price2` |
| `gc2_modifier_groups_count` | Check modifier group count | `expectedCount` |
| `gc2_modifier_group_not_exists` | Check modifier group doesn't exist | `displayName` |
| `gc2_menu_per_location` | Check menu per location | `expectedLocationCount`, `locations?`, `brandName?` |
| `gc2_product_reused_without_duplicate` | Verify product reuse (Rule 1) | `displayName`, `expectedCount`, `reason` |
| `gc2_product_duplicated_with_override` | Verify product duplication (Rule 3) | `displayName`, `expectedCount`, `overriddenField` |
| `gc2_sorting_order_matches_gc3` | Verify sorting order (Rule 13) | `entityType` |
| `gc2_currency_synced` | Verify currency sync (Rule 15) | `productDisplayName`, `expectedCurrencies` |

---

## 📚 Common Patterns

### Pattern 1: Product Reuse Testing
```typescript
{
  id: 'product-reuse-test',
  name: 'Test Product Reuse',
  description: 'Verify products are reused across categories without duplication',
  setup: {
    products: 3,
    modifierGroups: 1,
    menu: {
      count: 1,
      categoriesPerMenu: 3,
      productsPerCategory: 2,
      reuseProducts: true,  // ← Key: reuse same products
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { 
      type: 'gc2_product_count_by_name',
      displayName: 'Margherita Pizza',
      expectedCount: 1,  // ← Should be 1 (reused, not duplicated)
    },
  ],
  cleanup: { /* ... */ },
}
```

### Pattern 2: Override Testing
```typescript
{
  id: 'override-test',
  name: 'Test Price Override',
  description: 'Verify product duplication when price is overridden',
  setup: {
    products: 2,
    modifierGroups: 1,
    menu: {
      count: 1,
      categoriesPerMenu: 2,
      productsPerCategory: 1,
      reuseProducts: true,
    },
  },
  actions: [
    { type: 'publish' },
    { 
      type: 'override_product_price',
      categoryIndex: 1,
      productDisplayName: 'Margherita Pizza',
      newPrice: '999.00',
    },
    { type: 'publish' },
    {
      type: 'revert_product_price',
      categoryIndex: 1,
      productDisplayName: 'Margherita Pizza',
      originalPrice: '150.00',
    },
    { type: 'publish' },
  ],
  verifications: [
    // After first publish: 1 product
    // After override publish: 2 products (duplicated)
    // After revert publish: 1 product (merged back)
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      price1: '150.00',
      price2: '999.00',
    },
  ],
  cleanup: { /* ... */ },
}
```

### Pattern 3: Multi-Location Testing
```typescript
{
  id: 'multi-location-test',
  name: 'Test Multi-Location Publishing',
  description: 'Verify menu appears once per location',
  setup: {
    products: 4,
    modifierGroups: 2,
    menu: {
      count: 1,
      categoriesPerMenu: 2,
      productsPerCategory: 2,
      reuseProducts: false,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    {
      type: 'gc2_menu_per_location',
      expectedLocationCount: 2,
      locations: ['Dubai Mall', 'Marina Mall'],
      brandName: 'KFC',
    },
  ],
  cleanup: { /* ... */ },
}
```

---

## 🎓 Business Logic Rules Reference

The framework implements all 15 business logic rules:

| Rule # | Description | Verification Type |
|--------|-------------|------------------|
| 1 | Product reuse without duplicates (no override) | `gc2_product_reused_without_duplicate` |
| 2 | Modifier group reuse without duplicates (no override) | `gc2_modifier_group_reused_without_duplicate` |
| 3 | Product duplication with override | `gc2_product_duplicated_with_override` |
| 4 | Product Modifier Group duplication with override | `gc2_modifier_group_duplicated_with_override` |
| 5 | Product Modifier duplication with override | Custom verification |
| 6 | Text Modifier Group duplication with override | Custom verification |
| 7 | Text Modifier duplication with override | Custom verification |
| 8 | Nested Product Modifier Group duplication | Custom verification |
| 9 | Nested Product Modifier duplication | Custom verification |
| 10 | Nested Text Modifier Group duplication | Custom verification |
| 11 | Nested Text Modifier duplication | Custom verification |
| 12 | Merge duplicates after revert | `gc2_product_count_by_name` (after revert) |
| 13 | Sorting order matches GC3 | `gc2_sorting_order_matches_gc3` |
| 14 | Entity removal | `gc2_modifier_group_not_exists` |
| 15 | Currency sync | `gc2_currency_synced` |

---

## 🔧 Advanced Usage

### Running Specific Scenarios
```typescript
// Run only specific scenarios
import { TEST_SCENARIOS } from "cypress/support/test-config/test-scenarios.config";

const scenariosToRun = ['product-reuse-no-override', 'product-price-override-merge'];

TEST_SCENARIOS
  .filter(s => scenariosToRun.includes(s.id))
  .forEach(scenario => createTestFromScenario(scenario));
```

### Custom Verification Logic
If you need custom verification logic not covered by the framework:

```typescript
// cypress/support/verification-logic/verification-rules.ts

export class VerificationLogic {
  static myCustomVerification(param1: string, param2: number): void {
    cy.log('Running custom verification...');
    // Your custom logic here
  }
}
```

---

## 📁 File Structure

```
cypress/
├── e2e/
│   ├── scenarios/              # Old test files (keep for reference)
│   └── scenarios-v2/           # New framework-based tests
│       ├── example-product-reuse.cy.ts
│       ├── example-price-override-merge.cy.ts
│       └── all-scenarios.cy.ts
├── support/
│   ├── test-config/
│   │   └── test-scenarios.config.ts    # ← Add scenarios here
│   ├── test-builders/
│   │   └── scenario-test-builder.ts    # Test generation logic
│   └── verification-logic/
│       └── verification-rules.ts       # Verification methods
```

---

## 🎯 Benefits

### Before (Old Way)
```typescript
// 137 lines of repetitive code per test file
describe('Same product in 2 categories...', () => {
  after('Should cleanup...', function () {
    AuthenticationService.authenticate();
    cleanup.cleanup_menu(1);
    cleanup.cleanup_product(3);
    // ... 10+ more lines
  });

  it('Should create 3 products...', function () {
    navigator.navigate_to_product_page();
    productMiddleLayer.product_create_with_mandatory_fields(3);
  });

  // ... 15+ more it() blocks
});
```

### After (New Way)
```typescript
// 1 scenario config + 3-line test file
const scenario = getScenarioById('product-price-override-merge');
if (scenario) {
  createTestFromScenario(scenario);
}
```

**Benefits:**
- ✅ **80% less code** to write and maintain
- ✅ **Consistent test structure** across all scenarios
- ✅ **Easy to add new combinations** (just add config)
- ✅ **Clear separation** of test data vs test logic
- ✅ **Reusable verification rules** (DRY principle)
- ✅ **Self-documenting** tests with business rules mapped

---

## 🚧 Extending the Framework

### Adding New Action Types

1. Add type definition in `test-scenarios.config.ts`:
```typescript
export type TestAction = 
  | { type: 'my_new_action'; param1: string; param2: number }
  | // ... existing types
```

2. Implement handler in `scenario-test-builder.ts`:
```typescript
case 'my_new_action':
  it(`Should perform my new action`, () => {
    // Implementation
  });
  break;
```

### Adding New Verification Types

1. Add type definition in `test-scenarios.config.ts`:
```typescript
export type TestVerification =
  | { type: 'my_new_verification'; someParam: string }
  | // ... existing types
```

2. Implement verification in `verification-rules.ts`:
```typescript
static myNewVerification(someParam: string): void {
  cy.log('Running my new verification...');
  // Implementation
}
```

3. Add handler in `scenario-test-builder.ts`:
```typescript
case 'my_new_verification':
  VerificationLogic.myNewVerification(verification.someParam);
  break;
```

---

## 💡 Tips & Best Practices

1. **Start simple**: Begin with basic scenarios, then add complexity
2. **Reuse products wisely**: Set `reuseProducts: true` to test reuse/merge logic
3. **Clear naming**: Use descriptive IDs and names for scenarios
4. **Test incrementally**: Add one verification at a time, run tests often
5. **Document edge cases**: Add comments in config for complex scenarios
6. **Keep cleanup accurate**: Ensure cleanup counts match what was created

---

## ❓ Troubleshooting

### "Scenario not found"
- Check the scenario ID matches exactly (case-sensitive)
- Ensure scenario is in the `TEST_SCENARIOS` array

### "Verification failed"
- Check expected values match actual GC2 data
- Use Cypress UI to debug: `npm run cy:open:master`
- Add `cy.wait()` if timing issues occur

### "Cleanup errors"
- Verify cleanup counts match setup counts
- Check authentication is working
- Run cleanup manually if needed

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review example test files in `cypress/e2e/scenarios-v2/`
3. Look at existing scenarios in `test-scenarios.config.ts`
4. Review old test files in `cypress/e2e/scenarios/` for reference

---

**Happy Testing! 🚀**
