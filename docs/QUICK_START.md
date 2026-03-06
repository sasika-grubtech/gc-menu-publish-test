# Quick Start Guide - Adding New Test Cases

## 🎯 Goal
Add a new test case in **under 5 minutes**!

## 📝 Steps

### Step 1: Copy This Template (30 seconds)

Open `cypress/support/test-config/test-scenarios.config.ts` and add this to the `TEST_SCENARIOS` array:

```typescript
{
  id: 'YOUR_TEST_ID_HERE',
  name: 'Your Test Name Here',
  description: 'Brief description of what this tests',
  setup: {
    products: 4,                    // How many products?
    modifierGroups: 2,              // How many modifier groups?
    nestedModifierChain: {
      chainIndex: 1,
      productCount: 4,
      modifierGroupCount: 2,
    },
    menu: {
      count: 1,                     // How many menus?
      categoriesPerMenu: 2,         // Categories per menu?
      productsPerCategory: 2,       // Products per category?
      reuseProducts: false,         // Reuse products? true/false
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
  ],
  cleanup: {
    menus: 1,
    products: 4,
    modifierGroups: 2,
    gc2MenuItems: 4,
    gc2Menus: 1,
    gc2ModifierGroups: 2,
  },
},
```

### Step 2: Customize It (2 minutes)

1. **Change the ID**: Use kebab-case, e.g., `'product-with-5-modifiers'`
2. **Change the name**: Human-readable, e.g., `'Product with 5 Modifier Groups'`
3. **Set numbers**: Adjust `products`, `modifierGroups`, `categoriesPerMenu`, etc.
4. **Add actions**: Keep just `{ type: 'publish' }` for simple tests
5. **Add verifications**: Pick from the list below:

**Common Verifications:**
```typescript
// Menu exists
{ type: 'gc2_menu_exists' }

// Check product count
{ 
  type: 'gc2_product_count_by_name',
  displayName: 'Margherita Pizza',
  expectedCount: 1,
}

// Check modifier group count
{ 
  type: 'gc2_modifier_groups_count',
  expectedCount: 2,
}
```

### Step 3: Create Test File (1 minute)

Create a new file: `cypress/e2e/scenarios-v2/your-test-name.cy.ts`

```typescript
import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

const scenario = getScenarioById('YOUR_TEST_ID_HERE');
if (scenario) {
  createTestFromScenario(scenario);
}
```

Replace `YOUR_TEST_ID_HERE` with your ID from Step 1.

### Step 4: Run It! (1 minute)

```bash
npm run cy:open:master
```

Find your test file in the Cypress UI and click to run!

---

## 🎨 Common Scenarios

### Test 1: Simple Menu with Products
**What**: Create menu with products and verify in GC2
**Use Case**: Basic smoke test

```typescript
{
  id: 'simple-menu-basic',
  name: 'Simple Menu - Basic Test',
  description: 'Create simple menu and verify it appears in GC2',
  setup: {
    products: 3,
    modifierGroups: 1,
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
  ],
  cleanup: {
    menus: 1,
    products: 3,
    modifierGroups: 1,
    gc2MenuItems: 3,
    gc2Menus: 1,
    gc2ModifierGroups: 1,
  },
}
```

### Test 2: Product Reuse Test
**What**: Same product in multiple categories (no duplication)
**Use Case**: Test Rule 1 - Product reuse without duplicates

```typescript
{
  id: 'product-reuse-3-categories',
  name: 'Product Reuse Across 3 Categories',
  description: 'Same product used in 3 categories should not duplicate',
  setup: {
    products: 4,
    modifierGroups: 2,
    menu: {
      count: 1,
      categoriesPerMenu: 3,          // 3 categories
      productsPerCategory: 2,
      reuseProducts: true,            // ← Key: reuse products
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
      expectedCount: 1,               // ← Should be 1 (reused)
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

### Test 3: Large Product Set
**What**: Test with many products
**Use Case**: Verify system handles larger datasets

```typescript
{
  id: 'large-product-set-20',
  name: 'Large Product Set - 20 Products',
  description: 'Test with 20 products to verify scalability',
  setup: {
    products: 20,                     // ← 20 products
    modifierGroups: 5,
    menu: {
      count: 1,
      categoriesPerMenu: 4,
      productsPerCategory: 5,
      reuseProducts: false,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    { 
      type: 'gc2_menu_items_count',
      expectedCount: 20,
    },
  ],
  cleanup: {
    menus: 1,
    products: 20,
    modifierGroups: 5,
    gc2MenuItems: 20,
    gc2Menus: 1,
    gc2ModifierGroups: 5,
  },
}
```

### Test 4: Many Nested Modifiers
**What**: Test deep nesting of modifier groups
**Use Case**: Verify nested relationships work correctly

```typescript
{
  id: 'deep-nested-modifiers',
  name: 'Deep Nested Modifier Chains',
  description: 'Test products with deeply nested modifier groups',
  setup: {
    products: 5,
    modifierGroups: 5,
    nestedModifierChain: {
      chainIndex: 1,
      productCount: 5,
      modifierGroupCount: 5,          // ← 5 nested levels
    },
    menu: {
      count: 1,
      categoriesPerMenu: 1,
      productsPerCategory: 2,
      reuseProducts: false,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    { 
      type: 'gc2_modifier_groups_count',
      expectedCount: 5,
    },
  ],
  cleanup: {
    menus: 1,
    products: 5,
    modifierGroups: 5,
    gc2MenuItems: 5,
    gc2Menus: 1,
    gc2ModifierGroups: 5,
  },
}
```

---

## 📋 Quick Reference

### Setup Options
```typescript
setup: {
  products: NUMBER,              // How many products to create
  modifierGroups: NUMBER,        // How many modifier groups
  nestedModifierChain: {
    chainIndex: NUMBER,          // Usually 1
    productCount: NUMBER,        // Products in chain
    modifierGroupCount: NUMBER,  // Modifier groups in chain
  },
  menu: {
    count: NUMBER,                    // Number of menus
    categoriesPerMenu: NUMBER,        // Categories per menu
    productsPerCategory: NUMBER,      // Products per category
    reuseProducts: BOOLEAN,           // true/false
  },
}
```

### Action Types
```typescript
{ type: 'publish' }

{ 
  type: 'override_product_price',
  categoryIndex: 1,                    // 0-based
  productDisplayName: 'Pizza',
  newPrice: '999.00',
}

{
  type: 'revert_product_price',
  categoryIndex: 1,
  productDisplayName: 'Pizza',
  originalPrice: '150.00',
}
```

### Verification Types
```typescript
{ type: 'gc2_menu_exists' }

{ 
  type: 'gc2_menu_items_count',
  expectedCount: 5,
}

{ 
  type: 'gc2_product_count_by_name',
  displayName: 'Margherita Pizza',
  expectedCount: 1,
}

{
  type: 'gc2_product_with_different_prices',
  displayName: 'Pizza',
  price1: '150.00',
  price2: '999.00',
}

{ 
  type: 'gc2_modifier_groups_count',
  expectedCount: 2,
}

{
  type: 'gc2_modifier_group_not_exists',
  displayName: 'Some Group',
}
```

---

## 🎯 Pro Tips

1. **Start with existing scenarios**: Copy one that's similar to what you need
2. **Test incrementally**: Run after each change to catch issues early
3. **Check cleanup counts**: They should match what you created
4. **Use descriptive IDs**: Future you will thank you!
5. **Add comments**: Explain why certain numbers are used

---

## ✅ Checklist

Before running your test:
- [ ] ID is unique (not used by other scenarios)
- [ ] Name is descriptive
- [ ] Setup numbers make sense
- [ ] At least one action (usually `publish`)
- [ ] At least one verification
- [ ] Cleanup counts match setup counts
- [ ] Test file created in `scenarios-v2/`
- [ ] Scenario ID in test file matches config

---

## 🆘 Common Issues

**Problem**: Test file doesn't run
- **Solution**: Check that the scenario ID matches exactly (case-sensitive)

**Problem**: Cleanup fails
- **Solution**: Verify cleanup counts match what was created in setup

**Problem**: Verification fails
- **Solution**: Check expected values - run test manually first to see actual values

**Problem**: Products don't appear in GC2
- **Solution**: Make sure `{ type: 'publish' }` is in your actions

---

**You're all set! 🎉 Start adding test cases and let the framework do the heavy lifting!**
