# Framework Complete - Ready for New Scenarios

## Summary

✅ **Old tests archived** to `cypress/e2e/scenarios-old-archive/`  
✅ **All 17 scenarios converted** to framework configuration  
✅ **17 total scenarios** now available in `test-scenarios.config.ts`  
✅ **Complete documentation** for adding new scenarios

---

## Current Scenario Count

**Total Scenarios Configured: 17**

### Product Reuse & Override (5 scenarios)
1. `product-reuse-without-override` - Product reuse without overrides
2. `product-price-override-merge-two-categories` - Price override in 2 categories
3. `product-price-override-merge-five-categories` - Price override in 5 categories
4. `product-reuse-between-category` - Product reuse between categories
5. `unique-modifier-groups` - Unique modifier groups per product

### Entity Count Testing (2 scenarios)
6. `entity-count-4-products` - 4 products, 2 categories, 1 menu
7. `entity-count-9-products` - 9 products, 2 categories, 1 menu

### Simple Configuration (2 scenarios)
8. `simple-config-all-fields` - Simple config with all fields
9. `simple-config-mandatory-fields` - Simple config with mandatory fields

### Modifier Group Testing (3 scenarios)
10. `modifier-group-reuse-across-products` - Modifier group reuse
11. `menu-to-single-location` - Menu to single location
12. `modifier-remove-add-back` - Modifier remove and add back (Rule 14)

### Multi-Location & Platform (5 scenarios)
13. `multi-location-reusing-modifiers` - Multiple locations with reuse
14. `multi-location-non-duplicated-modifiers` - Multiple locations unique
15. `multi-platform-glovo-uber-eats` - Glovo + Uber Eats
16. `multi-platform-reusing-modifiers` - Multi-platform with reuse
17. `multi-platform-non-duplicated-modifiers` - Multi-platform unique

---

## How to Add New Scenarios

### Quick Steps

1. **Copy template** from `docs/SCENARIO_TEMPLATE.md`
2. **Paste into** `cypress/support/test-config/test-scenarios.config.ts`
3. **Customize** the configuration
4. **Run** `npm run test:scenarios-v2` or `all-scenarios.cy.ts`

### Detailed Guide

See `docs/ADD_NEW_SCENARIOS.md` for:
- Step-by-step instructions
- Configuration structure
- Complete examples
- Tips & best practices

---

## Key Files

### Configuration
- `cypress/support/test-config/test-scenarios.config.ts` - All scenario configs

### Test Files
- `cypress/e2e/scenarios-v2/all-scenarios.cy.ts` - Runs ALL scenarios
- `cypress/e2e/scenarios-v2/TEMPLATE.cy.ts` - Template for new test files

### Documentation
- `docs/ADD_NEW_SCENARIOS.md` - Complete guide for adding scenarios
- `docs/SCENARIO_TEMPLATE.md` - Copy-paste template
- `docs/TEST_FRAMEWORK_GUIDE.md` - Framework architecture
- `docs/QUICK_START.md` - Quick start guide
- `AGENTS.md` - Verification agents documentation

### Archived
- `cypress/e2e/scenarios-old-archive/` - Old test files (17 files)

---

## Adding Your First New Scenario

### Example: Test Currency Sync (Rule 15)

1. **Open** `cypress/support/test-config/test-scenarios.config.ts`

2. **Add this configuration** before the closing `];`:

```typescript
  // ============================================================================
  // SCENARIO: Currency Sync Verification
  // ============================================================================
  {
    id: 'currency-sync-verification',
    name: 'Currency Sync Verification',
    description: 'Verify all currencies sync from GC3 to GC2 products',
    setup: {
      products: 3,
      modifierGroups: 0,
      menu: {
        count: 1,
        categoriesPerMenu: 1,
        productsPerCategory: 3,
        reuseProducts: false,
      },
    },
    actions: [
      { type: 'publish' },
    ],
    verifications: [
      { type: 'gc2_menu_exists' },
      { type: 'gc2_menu_items_count', expectedCount: 3 },
      {
        type: 'custom_agent',
        agent: 'verifyAllProductPricesMatch',
        params: { productCount: 3 },
      },
      { type: 'gc2_currency_synced', productCount: 3 },
    ],
    cleanup: {
      menus: 1,
      products: 3,
      modifierGroups: 0,
      gc2MenuItems: 3,
      gc2Menus: 1,
      gc2ModifierGroups: 0,
    },
  },
```

3. **Run the test**:
```bash
npm run test:scenarios-v2
```

That's it! Your new scenario is now part of the test suite.

---

## Common Scenario Patterns

### Pattern 1: Product Reuse
```typescript
{
  id: 'my-product-reuse-test',
  setup: {
    products: 1,
    menu: {
      categoriesPerMenu: 3,      // 3 categories
      productsPerCategory: 1,    // Same product in all
      reuseProducts: true,       // ✅ Enable reuse
    },
  },
  verifications: [
    { 
      type: 'gc2_product_count_by_name',
      displayName: 'Margherita Pizza',
      expectedCount: 1,          // Only 1 product in GC2
    },
  ],
}
```

### Pattern 2: Price Override
```typescript
{
  id: 'my-price-override-test',
  setup: {
    products: 1,
    menu: {
      categoriesPerMenu: 3,
      productsPerCategory: 1,
      reuseProducts: true,
    },
  },
  verifications: [
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      prices: [25.00, 30.00, 35.00],
      expectedCount: 3,          // 3 products with different prices
    },
  ],
}
```

### Pattern 3: Modifier Groups
```typescript
{
  id: 'my-modifier-test',
  setup: {
    products: 4,
    modifierGroups: 2,
    nestedModifierChain: {       // ✅ Build nested chain
      chainIndex: 1,
      productCount: 4,
      modifierGroupCount: 2,
    },
  },
  verifications: [
    { type: 'gc2_modifier_groups_count', expectedCount: 2 },
  ],
}
```

### Pattern 4: Complex Verification
```typescript
{
  id: 'my-complex-test',
  verifications: [
    // Simple checks
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 5 },
    
    // Custom agent for deep verification
    {
      type: 'custom_agent',
      agent: 'verifyMenuDetailsExactMatch',
      params: {
        menuName: 'My Menu',
        expectedFields: {
          displayName: 'My Menu',
          categoryCount: 2,
          productCount: 5,
        },
      },
    },
  ],
}
```

---

## Available Verification Types

### Basic Verifications
- `gc2_menu_exists` - Menu exists
- `gc2_menu_count` - Total menu count
- `gc2_menu_items_count` - Total menu items
- `gc2_modifier_groups_count` - Total modifier groups

### Product Verifications
- `gc2_product_count_by_name` - Count by product name
- `gc2_product_with_different_prices` - Products with specific prices

### Modifier Verifications
- `gc2_modifier_group_not_exists` - Modifier group doesn't exist

### Currency Verification
- `gc2_currency_synced` - All currencies synced

### Custom Agents
- `custom_agent` - Call any method from `VerificationAgents`

---

## Custom Verification Agents

See `AGENTS.md` for full documentation. Quick reference:

### Price Agents
```typescript
{
  type: 'custom_agent',
  agent: 'verifyPriceExactMatch',
  params: {
    productName: 'Margherita Pizza',
    price: 25.00,
    currency: 'USD',
  },
}

{
  type: 'custom_agent',
  agent: 'verifyAllProductPricesMatch',
  params: { productCount: 4 },
}
```

### Count Agents
```typescript
{
  type: 'custom_agent',
  agent: 'verifyProductCountEqualsMenuItemCount',
  params: { productCount: 4 },
}
```

### Details Agents
```typescript
{
  type: 'custom_agent',
  agent: 'verifyMenuDetailsExactMatch',
  params: {
    menuName: 'My Menu',
    expectedFields: { displayName: 'My Menu', categoryCount: 2 },
  },
}
```

### Business Rule Agents (Rule 1-15)
```typescript
{
  type: 'custom_agent',
  agent: 'verifyRule1_ProductReuse',
  params: { productName: 'Margherita Pizza' },
}
```

---

## Running Tests

### Run All Scenarios
```bash
npm run test:scenarios-v2
```

### Run Specific Scenario
```bash
npx cypress run --spec "cypress/e2e/scenarios-v2/your-test.cy.ts"
```

### Open Cypress UI
```bash
npx cypress open
```

---

## File Structure

```
cypress/
├── e2e/
│   ├── scenarios-v2/               ← NEW framework tests
│   │   ├── all-scenarios.cy.ts     ← Runs ALL scenarios
│   │   ├── TEMPLATE.cy.ts          ← Template for new tests
│   │   └── *.cy.ts                 ← Individual test files
│   └── scenarios-old-archive/      ← OLD archived tests
│
├── support/
│   ├── test-config/
│   │   └── test-scenarios.config.ts    ← ALL scenario configs
│   ├── test-builders/
│   │   └── scenario-test-builder.ts    ← Test generator
│   ├── verification-logic/
│   │   ├── verification-agents.ts      ← Custom agents
│   │   └── verification-rules.ts       ← Verification helpers
│   └── test-framework.ts               ← Export index
│
docs/
├── ADD_NEW_SCENARIOS.md            ← Complete guide
├── SCENARIO_TEMPLATE.md            ← Copy-paste template
├── TEST_FRAMEWORK_GUIDE.md         ← Architecture docs
├── QUICK_START.md                  ← Quick start
└── ARCHITECTURE.md                 ← System architecture

AGENTS.md                           ← Verification agents docs
```

---

## Next Steps

1. **Review** the 16 configured scenarios in `test-scenarios.config.ts`
2. **Read** `docs/ADD_NEW_SCENARIOS.md` for detailed guide
3. **Copy** template from `docs/SCENARIO_TEMPLATE.md`
4. **Add** your new scenarios to `test-scenarios.config.ts`
5. **Run** tests with `npm run test:scenarios-v2`

---

## Tips for Success

### ✅ DO
- Use descriptive scenario IDs
- Add business rule comments
- Test incrementally (add 1 scenario at a time)
- Use `all-scenarios.cy.ts` for quick validation
- Leverage custom agents for complex checks

### ❌ DON'T
- Hardcode product names (use fixture data)
- Create duplicate scenarios
- Skip cleanup configuration
- Forget to update documentation

---

## Need Help?

### Documentation
- `docs/ADD_NEW_SCENARIOS.md` - Adding scenarios
- `docs/TEST_FRAMEWORK_GUIDE.md` - Framework details
- `AGENTS.md` - Verification agents

### Examples
- Look at existing scenarios in `test-scenarios.config.ts`
- Check `cypress/e2e/scenarios-v2/*.cy.ts` for test files

---

## Business Rules Coverage

All 15 business rules are supported:

✅ **Rule 1:** Product reuse without overrides  
✅ **Rule 2:** Modifier group reuse without overrides  
✅ **Rule 3:** Product duplication with overrides  
✅ **Rule 4:** Product Modifier Group duplication with overrides  
✅ **Rule 5:** Product Modifier duplication with overrides  
✅ **Rule 6:** Text Modifier Group duplication with overrides  
✅ **Rule 7:** Text Modifier duplication with overrides  
✅ **Rule 8:** Nested Product Modifier Group duplication  
✅ **Rule 9:** Nested Product Modifier duplication  
✅ **Rule 10:** Nested Text Modifier Group duplication  
✅ **Rule 11:** Nested Text Modifier duplication  
✅ **Rule 12:** Merge duplicates when overrides reverted  
✅ **Rule 13:** Sorting order sync from GC3  
✅ **Rule 14:** Remove logic  
✅ **Rule 15:** Currency sync  

---

**Framework is ready! Start adding your new scenarios now! 🚀**
