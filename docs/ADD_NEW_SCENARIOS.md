# How to Add New Test Scenarios

This guide explains how to easily add new test scenarios to the framework.

## Table of Contents
- [Quick Start](#quick-start)
- [Step-by-Step Guide](#step-by-step-guide)
- [Scenario Configuration Structure](#scenario-configuration-structure)
- [Examples](#examples)
- [Tips & Best Practices](#tips--best-practices)

---

## Quick Start

**Adding a new scenario takes 2 steps:**

1. **Add configuration** to `cypress/support/test-config/test-scenarios.config.ts`
2. **Create test file** in `cypress/e2e/scenarios-v2/` (optional, can use `all-scenarios.cy.ts`)

---

## Step-by-Step Guide

### Step 1: Add Scenario Configuration

Open `cypress/support/test-config/test-scenarios.config.ts` and add your scenario:

```typescript
{
  id: 'your-scenario-id',
  name: 'Your Scenario Name',
  description: 'Brief description of what this scenario tests',
  
  // What to create in GC3
  setup: {
    products: 4,                    // Number of products to create
    modifierGroups: 2,              // Number of modifier groups
    
    // Optional: Nested modifier chain
    nestedModifierChain: {
      chainIndex: 1,                // Which chain to build
      productCount: 4,              // Products to use in chain
      modifierGroupCount: 2,        // Modifier groups to use
    },
    
    // Menu structure
    menu: {
      count: 1,                     // Number of menus
      categoriesPerMenu: 2,         // Categories per menu
      productsPerCategory: 2,       // Products per category
      reuseProducts: true,          // Reuse same products across categories
    },
  },
  
  // What actions to perform
  actions: [
    { type: 'publish' },            // Publish menu to GC2
  ],
  
  // What to verify in GC2
  verifications: [
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 3 },
    { 
      type: 'gc2_product_count_by_name',
      displayName: 'Margherita Pizza',
      expectedCount: 1,
    },
    {
      type: 'custom_agent',
      agent: 'verifyAllProductPricesMatch',
      params: { productCount: 4 },
    },
  ],
  
  // What to cleanup
  cleanup: {
    menus: 1,
    products: 4,
    modifierGroups: 2,
    gc2MenuItems: 9,
    gc2Menus: 1,
    gc2ModifierGroups: 2,
  },
}
```

### Step 2: Create Test File (Optional)

You can either:
- **Option A:** Use `all-scenarios.cy.ts` (runs all scenarios automatically)
- **Option B:** Create a dedicated test file

**Option B - Create dedicated test file:**

Copy `cypress/e2e/scenarios-v2/TEMPLATE.cy.ts` to a new file:

```typescript
/**
 * ============================================================================
 * TEST SCENARIO: Your Scenario Name
 * ============================================================================
 *
 * BUSINESS RULE: [Which rule(s) this tests]
 *
 * TEST SETUP:
 * - [What gets created]
 *
 * TEST ACTIONS:
 * - [What happens]
 *
 * EXPECTED RESULTS:
 * ✅ [What should be verified]
 *
 * ============================================================================
 */

import { createTestFromScenario } from '../../support/test-builders/scenario-test-builder';
import { TEST_SCENARIOS } from '../../support/test-config/test-scenarios.config';

// Load scenario by ID
const scenario = TEST_SCENARIOS.find(s => s.id === 'your-scenario-id');

if (!scenario) {
  throw new Error('Scenario "your-scenario-id" not found');
}

// Generate and run the test
createTestFromScenario(scenario);
```

---

## Scenario Configuration Structure

### Setup Options

```typescript
setup: {
  // Required
  products: number;              // Number of products to create
  modifierGroups: number;        // Number of modifier groups
  
  // Optional
  nestedModifierChain?: {
    chainIndex: number;          // Which chain to build (1, 2, 3...)
    productCount: number;        // Products to use
    modifierGroupCount: number;  // Modifier groups to use
  };
  
  menu: {
    count: number;               // Number of menus to create
    categoriesPerMenu: number;   // Categories per menu
    productsPerCategory: number; // Products per category
    reuseProducts: boolean;      // Reuse products across categories
  };
}
```

### Action Options

```typescript
actions: [
  { type: 'publish' },           // Publish menu
  // More action types can be added
]
```

### Verification Options

```typescript
verifications: [
  // Check if menu exists in GC2
  { type: 'gc2_menu_exists' },
  
  // Check total menu item count
  { type: 'gc2_menu_items_count', expectedCount: 3 },
  
  // Check count by product name
  { 
    type: 'gc2_product_count_by_name',
    displayName: 'Product Name',
    expectedCount: 1,
  },
  
  // Check product with different prices
  {
    type: 'gc2_product_with_different_prices',
    displayName: 'Product Name',
    prices: [25.00, 30.00],
    expectedCount: 2,
  },
  
  // Check modifier groups count
  { type: 'gc2_modifier_groups_count', expectedCount: 2 },
  
  // Check modifier group doesn't exist
  { 
    type: 'gc2_modifier_group_not_exists',
    displayName: 'Modifier Group Name',
  },
  
  // Custom verification agent
  {
    type: 'custom_agent',
    agent: 'verifyPriceExactMatch',
    params: { productName: 'Pizza', price: 25.00, currency: 'USD' },
  },
]
```

### Cleanup Options

```typescript
cleanup: {
  menus: number;             // Menus to cleanup in GC3
  products: number;          // Products to cleanup in GC3
  modifierGroups: number;    // Modifier groups to cleanup in GC3
  gc2MenuItems: number;      // Menu items to cleanup in GC2
  gc2Menus: number;          // Menus to cleanup in GC2
  gc2ModifierGroups: number; // Modifier groups to cleanup in GC2
}
```

---

## Examples

### Example 1: Simple Product Reuse

```typescript
{
  id: 'simple-product-reuse',
  name: 'Product Reuse Without Overrides',
  description: 'Test same product reused across multiple categories without duplication',
  setup: {
    products: 1,
    modifierGroups: 0,
    menu: {
      count: 1,
      categoriesPerMenu: 2,
      productsPerCategory: 1,
      reuseProducts: true,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 1 },
  ],
  cleanup: {
    menus: 1,
    products: 1,
    modifierGroups: 0,
    gc2MenuItems: 1,
    gc2Menus: 1,
    gc2ModifierGroups: 0,
  },
}
```

### Example 2: Price Override with Verification

```typescript
{
  id: 'price-override-five-categories',
  name: 'Same Product in Five Categories with Price Override',
  description: 'Product with different prices across 5 categories',
  setup: {
    products: 1,
    modifierGroups: 0,
    menu: {
      count: 1,
      categoriesPerMenu: 5,
      productsPerCategory: 1,
      reuseProducts: true,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      prices: [25.00, 30.00, 35.00, 40.00, 45.00],
      expectedCount: 5,
    },
    {
      type: 'custom_agent',
      agent: 'verifyAllProductPricesMatch',
      params: { productCount: 1 },
    },
  ],
  cleanup: {
    menus: 1,
    products: 1,
    modifierGroups: 0,
    gc2MenuItems: 1,
    gc2Menus: 1,
    gc2ModifierGroups: 0,
  },
}
```

### Example 3: Complex Nested Modifiers

```typescript
{
  id: 'nested-modifiers-complex',
  name: 'Complex Nested Modifier Chain',
  description: 'Nested product and text modifiers with multiple levels',
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
      reuseProducts: false,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 9 },
    { type: 'gc2_modifier_groups_count', expectedCount: 2 },
    {
      type: 'custom_agent',
      agent: 'verifyModifierGroupExactMatch',
      params: {
        modifierGroupName: 'Premium Burger Add-ons',
        expectedFields: { name: 'Premium Burger Add-ons', minSelect: 1 },
      },
    },
  ],
  cleanup: {
    menus: 1,
    products: 4,
    modifierGroups: 2,
    gc2MenuItems: 9,
    gc2Menus: 1,
    gc2ModifierGroups: 2,
  },
}
```

---

## Tips & Best Practices

### 1. Choose a Clear ID
- Use kebab-case: `product-reuse-two-categories`
- Be descriptive: `price-override-five-categories`
- Avoid generic names: ❌ `test-1`, ✅ `modifier-group-reuse`

### 2. Write Clear Descriptions
```typescript
// ❌ Bad
description: 'Test products'

// ✅ Good
description: 'Same product reused across 5 categories with price overrides'
```

### 3. Add Business Rules to Test File Headers
```typescript
/**
 * BUSINESS RULE: Rule 1 - Product Reuse Without Overrides
 * 
 * Same product needs to be reused without duplicates if there 
 * is no hash change (overrides are not available)
 */
```

### 4. Use Custom Agents for Complex Verifications
```typescript
verifications: [
  // Simple built-in verification
  { type: 'gc2_menu_exists' },
  
  // Complex verification with agent
  {
    type: 'custom_agent',
    agent: 'verifyAllProductPricesMatch',
    params: { productCount: 4 },
  },
]
```

### 5. Group Related Scenarios
```typescript
// ============================================================================
// CATEGORY: Product Reuse Scenarios
// ============================================================================
{
  id: 'product-reuse-simple',
  // ...
},
{
  id: 'product-reuse-with-modifiers',
  // ...
},
```

### 6. Test Incrementally
1. Add configuration
2. Run `all-scenarios.cy.ts` to test your new scenario
3. Fix any issues
4. Create dedicated test file if needed

### 7. Use Fixture Data
Your scenarios automatically use:
- `bulk_products.json` - Product data
- `bulk_product_modifier_groups.json` - Modifier group data

Make sure your counts match the available data:
```typescript
// Check fixture first: bulk_products.json has 10 products
products: 4,  // ✅ Good (4 <= 10)
products: 20, // ❌ Bad (20 > 10)
```

### 8. Verify Cleanup Counts Match
```typescript
setup: {
  products: 4,
  modifierGroups: 2,
  // ...
},
cleanup: {
  products: 4,          // ✅ Matches setup
  modifierGroups: 2,    // ✅ Matches setup
  // ...
}
```

---

## Running Your New Scenarios

### Run All Scenarios (including new ones)
```bash
npm run test:scenarios-v2
```

### Run Specific Scenario
```bash
npx cypress run --spec "cypress/e2e/scenarios-v2/your-scenario.cy.ts"
```

### Open Cypress UI
```bash
npx cypress open
```

---

## Available Custom Agents

See `AGENTS.md` for complete list. Common agents:

```typescript
// Price verification
verifyPriceExactMatch(productName, price, currency)
verifyAllProductPricesMatch(productCount)

// Count verification
verifyProductCountEqualsMenuItemCount(productCount)

// Details verification
verifyMenuDetailsExactMatch(menuName, expectedFields)
verifyModifierGroupExactMatch(modifierGroupName, expectedFields)

// Business rules (Rule 1-15)
verifyRule1_ProductReuse(productName)
verifyRule3_ProductDuplicationWithOverride(productName, overrideField)
// ... and more
```

---

## Need Help?

- Check `docs/TEST_FRAMEWORK_GUIDE.md` for framework details
- See `docs/QUICK_START.md` for basic usage
- Read `AGENTS.md` for verification agent documentation
- Look at existing scenarios in `test-scenarios.config.ts` for examples

---

**Happy Testing! 🚀**
