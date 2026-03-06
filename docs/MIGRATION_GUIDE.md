# Migration Guide - Converting Old Tests to New Framework

## 🎯 Overview

This guide helps you convert existing test files to the new configuration-based framework.

## 📋 Migration Process

### Step 1: Analyze Your Old Test

Let's say you have this old test:

```typescript
// OLD: cypress/e2e/scenarios/product-reuse-between-category/4-products-2-category-1modifier-reuse.cy.ts
describe('4 product , 2 category , modifier groups (unique)  1 menu to 1 location  reuse', () => {
    after('Should cleanup all created products and modifier groups', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(4);
        cleanup.cleanup_modifier_group(2);
        gc2CleanupMethods.cleanup_menu_item(9);
        gc2CleanupMethods.cleanup_menu(1);
        gc2CleanupMethods.cleanup_modifier_group(2);
        cleanup.cleanup_hierarchy_mapping_clearance();
    });

    it('Should create all 4 products with all fields filled', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_create_with_mandatory_fields(4);
    });

    it('Should create 2 Product Modifier Groups', function () {
        navigator.navigate_to_modifier_group_page();
        modifierGroupMiddleLayer.modifier_group_bulk_create(2);
    });

    it('Should build Nested Modifier Chains', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit(1, 4, 2);
    });

    it('Should create 1 menu with 2 category and 2 product', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, 2, 3, true);
    });

    it('Should publish the menu', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify published menus appear in GC2 Menu Management > Menus', function () {
        gc2MiddleLayer.gc2_menus_page();
    });

    it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
        navigator.navigate_to_gc2_menu_items_page();
        gc2MiddleLayer.gc2_menu_items_table_verification(3);
    });
});
```

### Step 2: Extract the Configuration Data

Break down what the test does:

| Section | Value | Notes |
|---------|-------|-------|
| **Setup** | | |
| Products | 4 | `product_create_with_mandatory_fields(4)` |
| Modifier Groups | 2 | `modifier_group_bulk_create(2)` |
| Nested Chain | Yes | `modifier_group_bulk_edit(1, 4, 2)` |
| Menus | 1 | `sample.logic(1, ...)` |
| Categories | 2 | `sample.logic(1, 2, ...)` |
| Products per Category | 3 | `sample.logic(1, 2, 3, ...)` |
| Reuse Products | true | `sample.logic(1, 2, 3, true)` |
| **Actions** | | |
| Publish | Yes | `menuPublishLayer.menu_publish()` |
| **Verifications** | | |
| GC2 Menu Exists | Yes | `gc2MiddleLayer.gc2_menus_page()` |
| GC2 Menu Items Count | 3 | `gc2_menu_items_table_verification(3)` |
| **Cleanup** | | |
| GC3 Menus | 1 | `cleanup.cleanup_menu(1)` |
| GC3 Products | 4 | `cleanup.cleanup_product(4)` |
| GC3 Modifier Groups | 2 | `cleanup.cleanup_modifier_group(2)` |
| GC2 Menu Items | 9 | `gc2CleanupMethods.cleanup_menu_item(9)` |
| GC2 Menus | 1 | `gc2CleanupMethods.cleanup_menu(1)` |
| GC2 Modifier Groups | 2 | `gc2CleanupMethods.cleanup_modifier_group(2)` |

### Step 3: Create New Configuration

Add to `cypress/support/test-config/test-scenarios.config.ts`:

```typescript
{
  id: 'product-reuse-between-category',
  name: '4 Products, 2 Categories - Product Reuse Test',
  description: 'Verify products are reused without duplication across categories when no overrides exist',
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
      productsPerCategory: 3,
      reuseProducts: true,
    },
  },
  actions: [
    { type: 'publish' },
  ],
  verifications: [
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 3 },
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

### Step 4: Create New Test File

Create `cypress/e2e/scenarios-v2/product-reuse-between-category.cy.ts`:

```typescript
import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

const scenario = getScenarioById('product-reuse-between-category');
if (scenario) {
  createTestFromScenario(scenario);
}
```

### Step 5: Test and Compare

Run both versions side-by-side:
1. Run old test: Check it passes
2. Run new test: Check it behaves the same
3. Compare results

---

## 📝 Common Patterns

### Pattern 1: Simple Setup → Publish → Verify

**Old:**
```typescript
it('Should create 4 products', () => { /* ... */ });
it('Should create 2 modifier groups', () => { /* ... */ });
it('Should create menu', () => { /* ... */ });
it('Should publish', () => { /* ... */ });
it('Should verify', () => { /* ... */ });
```

**New:**
```typescript
{
  setup: { products: 4, modifierGroups: 2, menu: { /* ... */ } },
  actions: [{ type: 'publish' }],
  verifications: [{ type: 'gc2_menu_exists' }],
}
```

### Pattern 2: Override Tests

**Old:**
```typescript
it('Should publish', () => { menuPublishLayer.menu_publish(); });
it('Should override price', () => {
  // 30 lines of code to override price
});
it('Should publish again', () => { menuPublishLayer.menu_publish(); });
it('Should verify 2 products', () => { /* ... */ });
```

**New:**
```typescript
{
  actions: [
    { type: 'publish' },
    { 
      type: 'override_product_price',
      categoryIndex: 1,
      productDisplayName: 'Margherita Pizza',
      newPrice: '999.00',
    },
    { type: 'publish' },
  ],
  verifications: [
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      price1: '150.00',
      price2: '999.00',
    },
  ],
}
```

---

## 🔄 Quick Conversion Reference

### Setup Section

| Old Code | Extract | New Config |
|----------|---------|------------|
| `product_create_with_mandatory_fields(4)` | Number: 4 | `products: 4` |
| `modifier_group_bulk_create(2)` | Number: 2 | `modifierGroups: 2` |
| `modifier_group_bulk_edit(1, 4, 2)` | Params: 1, 4, 2 | `nestedModifierChain: { chainIndex: 1, productCount: 4, modifierGroupCount: 2 }` |
| `sample.logic(1, 2, 3, true)` | Params: 1, 2, 3, true | `menu: { count: 1, categoriesPerMenu: 2, productsPerCategory: 3, reuseProducts: true }` |

### Actions Section

| Old Code | New Action |
|----------|------------|
| `menuPublishLayer.menu_publish()` | `{ type: 'publish' }` |
| Override price code | `{ type: 'override_product_price', categoryIndex: N, productDisplayName: 'X', newPrice: 'Y' }` |
| Revert price code | `{ type: 'revert_product_price', categoryIndex: N, productDisplayName: 'X', originalPrice: 'Y' }` |

### Verifications Section

| Old Code | New Verification |
|----------|------------------|
| `gc2MiddleLayer.gc2_menus_page()` | `{ type: 'gc2_menu_exists' }` |
| `gc2_menu_items_table_verification(3)` | `{ type: 'gc2_menu_items_count', expectedCount: 3 }` |
| `gc2_verify_menu_item_count_for_name('Pizza', 1)` | `{ type: 'gc2_product_count_by_name', displayName: 'Pizza', expectedCount: 1 }` |
| `gc2_verify_two_menu_items_same_name_different_prices(...)` | `{ type: 'gc2_product_with_different_prices', displayName: 'Pizza', price1: '150.00', price2: '999.00' }` |
| `gc2_modifier_groups_page_verify(2)` | `{ type: 'gc2_modifier_groups_count', expectedCount: 2 }` |

### Cleanup Section

| Old Code | Extract | New Config |
|----------|---------|------------|
| `cleanup.cleanup_menu(1)` | Number: 1 | `menus: 1` |
| `cleanup.cleanup_product(4)` | Number: 4 | `products: 4` |
| `cleanup.cleanup_modifier_group(2)` | Number: 2 | `modifierGroups: 2` |
| `gc2CleanupMethods.cleanup_menu_item(9)` | Number: 9 | `gc2MenuItems: 9` |
| `gc2CleanupMethods.cleanup_menu(1)` | Number: 1 | `gc2Menus: 1` |
| `gc2CleanupMethods.cleanup_modifier_group(2)` | Number: 2 | `gc2ModifierGroups: 2` |

---

## 🎯 Full Example: Complete Migration

### Before (68 lines)

```typescript
import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { MenuPublishLayer } from "cypress/page-objects/middle-layer/menu-publish-layer";
import { GC2MiddleLayer } from "cypress/page-objects/middle-layer/gc2-middle-layer";
import { GC2CleanupMethods } from "cypress/page-objects/pages/cleanup/gc2_cleanup_method";
import { Sample } from "cypress/page-objects/middle-layer/sample";
import { ModifierGroupMiddleLayer } from "cypress/page-objects/middle-layer/modifier-group-middle-layer";

const modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();
const sample = new Sample();
const productMiddleLayer = new ProductMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();
const menuPublishLayer = new MenuPublishLayer();
const gc2MiddleLayer = new GC2MiddleLayer();
const gc2CleanupMethods = new GC2CleanupMethods();

describe('4 unique product , 2 category , modifier groups (unique)  1 menu to 1 location', () => {

    after('Should cleanup all created products and modifier groups', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(4);
        cleanup.cleanup_modifier_group(2);
        gc2CleanupMethods.cleanup_menu_item(4);
        gc2CleanupMethods.cleanup_menu(1);
        gc2CleanupMethods.cleanup_modifier_group(2);
        cleanup.cleanup_hierarchy_mapping_clearance();
    });

    it('Should create all 4 products with all fields filled', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_create_with_mandatory_fields(4);
    });

    it('Should create 2 Product Modifier Groups', function () {
        navigator.navigate_to_modifier_group_page();
        modifierGroupMiddleLayer.modifier_group_bulk_create(2);
    });

    it('Should build Nested Modifier Chains', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit(1,4,2);
    });

    it('Should create 1 menu with 2 category and 2 product', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, 2, 2);
    });

    it('Should publish the menu', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify published menus appear in GC2 Menu Management > Menus', function () {
        gc2MiddleLayer.gc2_menus_page();
    });

    it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
        navigator.navigate_to_gc2_menu_items_page();
        gc2MiddleLayer.gc2_menu_items_table_verification(3);
    });
});
```

### After (Config: 30 lines + Test File: 5 lines = 35 lines total)

**Config:**
```typescript
// cypress/support/test-config/test-scenarios.config.ts
{
  id: 'unique-modifier-groups',
  name: '4 Unique Products, 2 Categories, Unique Modifier Groups',
  description: 'Each product has its own unique modifier group without reuse',
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
    { type: 'gc2_menu_items_count', expectedCount: 3 },
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

**Test File:**
```typescript
// cypress/e2e/scenarios-v2/unique-modifier-groups.cy.ts
import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

const scenario = getScenarioById('unique-modifier-groups');
if (scenario) {
  createTestFromScenario(scenario);
}
```

**Result:** 48% less code (68 → 35 lines), much more maintainable!

---

## ✅ Migration Checklist

For each test you migrate:

- [ ] Analyze old test structure
- [ ] Extract setup numbers (products, modifier groups, menu config)
- [ ] Extract actions (publish, override, etc.)
- [ ] Extract verifications (what to check in GC2)
- [ ] Extract cleanup numbers
- [ ] Create scenario config
- [ ] Create new test file
- [ ] Run both tests to compare
- [ ] Verify results match
- [ ] Keep old test for reference (don't delete yet)
- [ ] Add migration note in old test file

---

## 🎓 Tips for Successful Migration

1. **Start with simple tests**: Migrate basic publish-verify tests first
2. **One at a time**: Don't try to migrate everything at once
3. **Compare results**: Run old and new side-by-side
4. **Keep originals**: Don't delete old tests until you're confident
5. **Document differences**: Note any behavioral differences you find
6. **Test incrementally**: Run the test after each section you migrate

---

## 📊 Migration Progress Tracker

Track your migration progress:

```markdown
## Migration Status

### ✅ Completed (3/17)
- [x] product-reuse-between-category
- [x] unique-modifier-groups
- [x] simple-config-all-fields

### 🚧 In Progress (2/17)
- [ ] product-price-override-gc2-merge
- [ ] nested-combination

### 📋 Todo (12/17)
- [ ] menu-to-multiple-locations
- [ ] same-menu-for-different-food-platforms
- [ ] entity-count-mapping-4-products
- [ ] entity-count-mapping-9-products
- [ ] simple-config-with-mandatory-fields
- ... (and 7 more)
```

---

**Good luck with your migration! 🚀**
