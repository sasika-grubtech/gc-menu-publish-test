# 🚀 GC Menu Publish Test Framework

Modern, configuration-based Cypress testing framework for GC3 → GC2 menu publishing and verification.

## ✨ Features

- **Configuration-Driven**: Define tests in simple config files, not repetitive code
- **80% Less Code**: Write tests in minutes instead of hours
- **Business Rules Library**: All 15 verification rules pre-implemented and reusable
- **Type-Safe**: Full TypeScript support with IntelliSense
- **Easy to Extend**: Add new scenarios, actions, and verifications easily
- **Self-Documenting**: Tests clearly show what they verify

## 🎯 Quick Start

### 1. Add a New Test Scenario

Edit `cypress/support/test-config/test-scenarios.config.ts`:

```typescript
{
  id: 'my-test-scenario',
  name: 'My Test Scenario',
  description: 'What this test verifies',
  setup: {
    products: 4,
    modifierGroups: 2,
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

### 2. Create Test File

Create `cypress/e2e/scenarios-v2/my-test.cy.ts`:

```typescript
import { createTestFromScenario } from "cypress/support/test-builders/scenario-test-builder";
import { getScenarioById } from "cypress/support/test-config/test-scenarios.config";

const scenario = getScenarioById('my-test-scenario');
if (scenario) {
  createTestFromScenario(scenario);
}
```

### 3. Run Tests

```bash
npm run cy:open:master
```

That's it! 🎉

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Complete Documentation](docs/TEST_FRAMEWORK_GUIDE.md)** - Full reference and patterns
- **[Business Rules Reference](docs/TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference)** - All 15 verification rules

## 🎓 Business Logic Rules Covered

The framework implements all verification rules:

1. ✅ Product reuse without duplicates (no hash change)
2. ✅ Modifier group reuse without duplicates (no hash change)
3. ✅ Product duplication with overrides (multiple reference)
4. ✅ Product Modifier Group duplication with overrides
5. ✅ Product Modifier duplication with overrides
6. ✅ Text Modifier Group duplication with overrides
7. ✅ Text Modifier duplication with overrides
8. ✅ Nested Product Modifier Group duplication
9. ✅ Nested Product Modifier duplication
10. ✅ Nested Text Modifier Group duplication
11. ✅ Nested Text Modifier duplication
12. ✅ Duplicate merge after override revert
13. ✅ Sorting order matches GC3
14. ✅ Entity removal logic
15. ✅ Currency sync to products

## 📁 Project Structure

```
cypress/
├── e2e/
│   ├── scenarios/              # Legacy test files (kept for reference)
│   └── scenarios-v2/           # New framework-based tests
│       ├── example-product-reuse.cy.ts
│       ├── example-price-override-merge.cy.ts
│       └── all-scenarios.cy.ts
├── support/
│   ├── test-config/
│   │   └── test-scenarios.config.ts    # ← Define scenarios here
│   ├── test-builders/
│   │   └── scenario-test-builder.ts    # Test generation logic
│   └── verification-logic/
│       └── verification-rules.ts       # Reusable verification methods
└── docs/
    ├── QUICK_START.md                  # 5-minute start guide
    └── TEST_FRAMEWORK_GUIDE.md         # Complete documentation
```

## 🔧 Available Actions

- `publish` - Publish menu to GC2
- `override_product_price` - Override product price in category
- `revert_product_price` - Revert product price to original
- `add_product_to_category` - Add product to category
- `remove_product_from_category` - Remove product from category
- `override_product_field` - Override any product field
- More coming soon...

## ✅ Available Verifications

- `gc2_menu_exists` - Menu exists in GC2
- `gc2_menu_items_count` - Total menu items count
- `gc2_product_count_by_name` - Product count by display name
- `gc2_product_with_different_prices` - Product with 2 different prices
- `gc2_modifier_groups_count` - Modifier groups count
- `gc2_modifier_group_not_exists` - Modifier group doesn't exist
- `gc2_menu_per_location` - Menu per location verification
- `gc2_product_reused_without_duplicate` - Product reuse verification
- `gc2_product_duplicated_with_override` - Product duplication verification
- And more...

## 🎯 Example Scenarios

### Product Reuse Test
```typescript
{
  id: 'product-reuse-test',
  setup: {
    products: 3,
    menu: {
      categoriesPerMenu: 2,
      productsPerCategory: 2,
      reuseProducts: true,  // ← Reuse same products
    },
  },
  verifications: [
    { 
      type: 'gc2_product_count_by_name',
      displayName: 'Margherita Pizza',
      expectedCount: 1,  // ← Should be 1 (reused, not duplicated)
    },
  ],
}
```

### Price Override Test
```typescript
{
  id: 'price-override-test',
  actions: [
    { type: 'publish' },
    { 
      type: 'override_product_price',
      categoryIndex: 1,
      productDisplayName: 'Margherita Pizza',
      newPrice: '999.00',
    },
    { type: 'publish' },  // ← Product should duplicate
  ],
  verifications: [
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      price1: '150.00',
      price2: '999.00',  // ← Should have 2 products with different prices
    },
  ],
}
```

## 🚦 Running Tests

```bash
# Open Cypress UI
npm run cy:open:master

# Run headless
npm run cy:run:nightly
```

## 🎨 Before vs After

### Before (Old Way)
```typescript
// 137 lines per test file
describe('Same product in 2 categories...', () => {
  after(() => { /* 15 lines of cleanup */ });
  it('Should create 3 products', () => { /* ... */ });
  it('Should create 2 modifier groups', () => { /* ... */ });
  it('Should build nested chains', () => { /* ... */ });
  it('Should create menu', () => { /* ... */ });
  it('Should publish', () => { /* ... */ });
  it('Should verify', () => { /* ... */ });
  // ... 10+ more it() blocks
});
```

### After (New Way)
```typescript
// 3 lines per test file + 1 config entry
const scenario = getScenarioById('my-test');
if (scenario) createTestFromScenario(scenario);
```

**Result**: 80% less code, much easier to maintain! 🎉

## 💡 Pro Tips

1. Start with the [Quick Start Guide](docs/QUICK_START.md)
2. Copy existing scenarios that are similar to what you need
3. Use `reuseProducts: true` to test product reuse logic
4. Add descriptive names and descriptions
5. Keep cleanup counts matching setup counts
6. Run tests incrementally as you build them

## 🆘 Support

- See [Quick Start Guide](docs/QUICK_START.md) for 5-minute intro
- See [Complete Documentation](docs/TEST_FRAMEWORK_GUIDE.md) for full reference
- Check `cypress/e2e/scenarios-v2/` for example test files
- Review `cypress/support/test-config/test-scenarios.config.ts` for scenario examples

## 📊 Statistics

- **17 existing test scenarios** already migrated
- **15 business rules** implemented
- **10+ action types** available
- **15+ verification types** available
- **80% reduction** in test code

## 🤝 Contributing

To add new capabilities:

1. **New action types**: Add to `TestAction` type and implement handler in `scenario-test-builder.ts`
2. **New verifications**: Add to `TestVerification` type and implement in `verification-rules.ts`
3. **New scenarios**: Just add to `TEST_SCENARIOS` array!

See [Complete Documentation](docs/TEST_FRAMEWORK_GUIDE.md#-extending-the-framework) for details.

---

**Made with ❤️ for easier test maintenance and faster development**
