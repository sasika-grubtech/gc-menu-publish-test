# Quick Reference: Adding New Test Scenarios

## 1️⃣ Copy Template (30 seconds)

Copy from `docs/SCENARIO_TEMPLATE.md` or use this minimal template:

```typescript
{
  id: 'my-new-scenario',
  name: 'My New Scenario',
  description: 'What this tests',
  
  setup: {
    products: 1,
    modifierGroups: 0,
    menu: {
      count: 1,
      categoriesPerMenu: 1,
      productsPerCategory: 1,
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
    products: 1,
    modifierGroups: 0,
    gc2MenuItems: 1,
    gc2Menus: 1,
    gc2ModifierGroups: 0,
  },
},
```

## 2️⃣ Add to Config (1 minute)

Paste into `cypress/support/test-config/test-scenarios.config.ts` before the closing `];`

## 3️⃣ Customize (2-5 minutes)

Change these key fields:
- `id` - Unique identifier (kebab-case)
- `name` - Display name
- `products` - Number of products
- `categoriesPerMenu` - Number of categories
- `reuseProducts` - true = reuse, false = unique
- `verifications` - What to check in GC2

## 4️⃣ Run Test (30 seconds)

```bash
npm run test:scenarios-v2
```

---

## Common Patterns

### Product Reuse
```typescript
reuseProducts: true,  // ✅ Reuse same products
```

### Price Override
```typescript
verifications: [
  {
    type: 'gc2_product_with_different_prices',
    displayName: 'Margherita Pizza',
    prices: [25.00, 30.00],
    expectedCount: 2,
  },
]
```

### Nested Modifiers
```typescript
nestedModifierChain: {
  chainIndex: 1,
  productCount: 4,
  modifierGroupCount: 2,
},
```

### Custom Verification
```typescript
{
  type: 'custom_agent',
  agent: 'verifyAllProductPricesMatch',
  params: { productCount: 4 },
}
```

---

## Verification Types Cheat Sheet

| Type | Purpose | Example |
|------|---------|---------|
| `gc2_menu_exists` | Menu exists | `{ type: 'gc2_menu_exists' }` |
| `gc2_menu_items_count` | Total items | `{ type: 'gc2_menu_items_count', expectedCount: 3 }` |
| `gc2_product_count_by_name` | Count by name | `{ type: 'gc2_product_count_by_name', displayName: 'Pizza', expectedCount: 1 }` |
| `gc2_modifier_groups_count` | Modifier count | `{ type: 'gc2_modifier_groups_count', expectedCount: 2 }` |
| `custom_agent` | Custom check | `{ type: 'custom_agent', agent: 'verifyPriceExactMatch', params: {...} }` |

---

## File Locations

| What | Where |
|------|-------|
| Add scenarios | `cypress/support/test-config/test-scenarios.config.ts` |
| Template | `docs/SCENARIO_TEMPLATE.md` |
| Run all tests | `npm run test:scenarios-v2` |
| Detailed guide | `docs/ADD_NEW_SCENARIOS.md` |
| Agents docs | `AGENTS.md` |

---

## 5-Minute Workflow

1. Open `test-scenarios.config.ts`
2. Copy template from `docs/SCENARIO_TEMPLATE.md`
3. Paste before `];`
4. Change `id`, `name`, `products`, `verifications`
5. Save and run: `npm run test:scenarios-v2`

---

## Current Status

✅ **17 scenarios** configured  
✅ **17 old tests** archived  
✅ **Framework** ready for new scenarios

**Start adding scenarios now!** 🚀
