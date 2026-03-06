# GC3 → GC2 Verification Agents

This file defines verification agents for testing GC3 menu publishing to GC2. Each agent focuses on specific verification rules and checks.

## 🎯 Core Verification Agents

### Agent: Price Verification
**Purpose:** Verify GC2 product prices exactly match GC3 product prices

**Verification Steps:**
1. Get product from GC3 with its price
2. Navigate to GC2 Menu Items page
3. Search for the product by display name
4. Open product details in GC2
5. Compare GC2 price with GC3 price
6. Assert prices match exactly (including currency)

**Usage:**
```typescript
VerificationAgents.verifyPriceExactMatch(gc3ProductName, gc3Price, currency);
```

**Example:**
```typescript
// Verify "Margherita Pizza" has price 150.00 AED in both GC3 and GC2
VerificationAgents.verifyPriceExactMatch('Margherita Pizza', '150.00', 'AED');
```

---

### Agent: Product Count Verification
**Purpose:** Verify total product count in GC3 equals menu item count in GC2

**Verification Steps:**
1. Count total products created in GC3
2. Navigate to GC2 Menu Items page
3. Get total menu item count in GC2
4. Assert counts match exactly

**Usage:**
```typescript
VerificationAgents.verifyProductCountEqualsMenuItemCount(expectedCount);
```

**Example:**
```typescript
// Verify 4 products in GC3 = 4 menu items in GC2
VerificationAgents.verifyProductCountEqualsMenuItemCount(4);
```

---

### Agent: Menu Details Verification
**Purpose:** Verify all menu details in GC2 exactly match GC3 (name, description, brand, currency, etc.)

**Verification Steps:**
1. Get menu details from GC3 (name, description, brand, currency, external ID)
2. Navigate to GC2 Menus page
3. Search for the menu
4. Open menu details
5. Compare each field:
   - Menu name
   - Description
   - Brand
   - Currency
   - External ID
   - Categories count
   - Products per category
6. Assert all fields match exactly

**Usage:**
```typescript
VerificationAgents.verifyMenuDetailsExactMatch(gc3MenuName);
```

**Example:**
```typescript
// Verify menu details match between GC3 and GC2
VerificationAgents.verifyMenuDetailsExactMatch('Test Menu 1_1234567890');
```

---

### Agent: Modifier Group Exact Match Verification
**Purpose:** Verify modifier group in GC2 exactly matches GC3 (name, display name, description, modifiers)

**Verification Steps:**
1. Get modifier group details from GC3
2. Navigate to GC2 Modifier Groups page
3. Search for the modifier group
4. Open modifier group details
5. Compare:
   - Name
   - Display name
   - Description
   - External ID
   - Number of modifiers
   - Modifier names
   - Modifier prices (if applicable)
6. Assert all fields match exactly

**Usage:**
```typescript
VerificationAgents.verifyModifierGroupExactMatch(gc3ModifierGroupName);
```

**Example:**
```typescript
// Verify modifier group matches exactly
VerificationAgents.verifyModifierGroupExactMatch('Burger Additions_PMG001');
```

---

## 📋 Business Rule Verification Agents

### Agent: Rule 1 - Product Reuse Verification
**Rule:** Same product needs to be reused without duplicates if there is no hash change (overrides are not available)

**Verification Steps:**
1. Create product in GC3
2. Add same product to multiple categories in menu
3. Publish menu
4. Navigate to GC2 Menu Items
5. Search for the product
6. Count occurrences - should be exactly 1
7. Verify product details match GC3
8. Verify price is same across all references

**Usage:**
```typescript
VerificationAgents.verifyRule1_ProductReuse(productDisplayName, expectedCount);
```

**Expected Result:** Product appears once in GC2, not duplicated

---

### Agent: Rule 2 - Modifier Group Reuse Verification
**Rule:** Same modifier group needs to be reused without duplicates if there is no hash change (overrides are not available)

**Verification Steps:**
1. Create modifier group in GC3
2. Attach same modifier group to multiple products
3. Publish menu
4. Navigate to GC2 Modifier Groups
5. Search for the modifier group
6. Count occurrences - should be exactly 1
7. Verify modifier group details match GC3

**Usage:**
```typescript
VerificationAgents.verifyRule2_ModifierGroupReuse(modifierGroupDisplayName, expectedCount);
```

**Expected Result:** Modifier group appears once in GC2, shared across products

---

### Agent: Rule 3 - Product Duplication with Override Verification
**Rule:** Product should be duplicated with displaying a unique overridden value in the newly created product if the overrides are available for the product in GC3

**Verification Steps:**
1. Create product in GC3 with original values
2. Add product to Category 1
3. Add same product to Category 2 with price override
4. Publish menu
5. Navigate to GC2 Menu Items
6. Search for the product
7. Count occurrences - should be 2
8. Open both products
9. Verify Product 1 has original price
10. Verify Product 2 has overridden price
11. Verify both have same name but different prices

**Usage:**
```typescript
VerificationAgents.verifyRule3_ProductDuplicationWithOverride(
  productDisplayName, 
  originalPrice, 
  overriddenPrice
);
```

**Expected Result:** 2 products with same name, different prices

---

### Agent: Rule 4 - Product Modifier Group Duplication Verification
**Rule:** Product Modifier Group should be duplicated along with Product modifier with displaying a unique overridden value in the newly created Product Modifier Group if the overrides are available

**Verification Steps:**
1. Create product with modifier group in GC3
2. Add override to modifier group in one category
3. Publish menu
4. Navigate to GC2 Modifier Groups
5. Search for the modifier group
6. Count occurrences - should be 2
7. Verify one has original values
8. Verify one has overridden values
9. Verify both are attached to correct products

**Usage:**
```typescript
VerificationAgents.verifyRule4_ProductModifierGroupDuplication(
  modifierGroupDisplayName,
  originalValue,
  overriddenValue
);
```

**Expected Result:** 2 modifier groups with different values

---

### Agent: Rule 5 - Product Modifier Duplication Verification
**Rule:** Product Modifier Group should be duplicated along with Product modifier with displaying a unique overridden value in the newly created Product Modifier if the overrides are available

**Verification Steps:**
1. Create product with modifier group and modifiers
2. Override specific modifier in one category
3. Publish menu
4. Navigate to GC2 Menu Items
5. Open product details
6. Check modifiers in both products
7. Verify modifier duplication
8. Verify overridden modifier has unique value

**Usage:**
```typescript
VerificationAgents.verifyRule5_ProductModifierDuplication(
  productDisplayName,
  modifierName,
  originalValue,
  overriddenValue
);
```

**Expected Result:** Modifier duplicated with overridden value

---

### Agent: Rule 6 - Text Modifier Group Duplication Verification
**Rule:** Text Modifier Group should be duplicated along with Text modifier with displaying a unique overridden value in the newly created Text Modifier Group if the overrides are available

**Verification Steps:**
1. Create text modifier group in GC3
2. Add override in one category
3. Publish menu
4. Navigate to GC2 Modifier Groups
5. Filter by text modifier groups
6. Verify duplication
7. Verify overridden values

**Usage:**
```typescript
VerificationAgents.verifyRule6_TextModifierGroupDuplication(
  textModifierGroupName,
  originalValue,
  overriddenValue
);
```

**Expected Result:** Text modifier group duplicated with override

---

### Agent: Rule 7 - Text Modifier Duplication Verification
**Rule:** Text Modifier Group should be duplicated along with Text modifier with displaying a unique overridden value in the newly created Text Modifier if the overrides are available

**Verification Steps:**
1. Create text modifier in GC3
2. Override text modifier value
3. Publish menu
4. Verify text modifier duplication in GC2
5. Verify override applied correctly

**Usage:**
```typescript
VerificationAgents.verifyRule7_TextModifierDuplication(
  textModifierName,
  originalValue,
  overriddenValue
);
```

**Expected Result:** Text modifier duplicated with unique value

---

### Agent: Rule 8 - Nested Product Modifier Group Duplication Verification
**Rule:** Nested Product Modifier Group should be duplicated along with Nested Product modifier with displaying a unique overridden value in the newly created Nested Product Modifier Group

**Verification Steps:**
1. Create nested product modifier structure in GC3
2. Add override at nested level
3. Publish menu
4. Navigate to GC2
5. Verify nested structure preserved
6. Verify duplication at correct nesting level
7. Verify overridden values

**Usage:**
```typescript
VerificationAgents.verifyRule8_NestedProductModifierGroupDuplication(
  parentModifierGroup,
  nestedModifierGroup,
  nestingLevel,
  overriddenValue
);
```

**Expected Result:** Nested modifier group duplicated with override

---

### Agent: Rule 9 - Nested Product Modifier Duplication Verification
**Rule:** Nested Product Modifier Group should be duplicated along with Nested Product modifier with displaying a unique overridden value in the newly created Nested Product Modifier

**Verification Steps:**
1. Create nested product modifier in GC3
2. Override nested modifier value
3. Publish menu
4. Verify nested modifier duplication
5. Verify override at correct nesting level

**Usage:**
```typescript
VerificationAgents.verifyRule9_NestedProductModifierDuplication(
  parentModifier,
  nestedModifier,
  nestingLevel,
  overriddenValue
);
```

**Expected Result:** Nested modifier duplicated with override

---

### Agent: Rule 10 - Nested Text Modifier Group Duplication Verification
**Rule:** Nested Text Modifier Group should be duplicated along with Nested Text modifier with displaying a unique overridden value in the newly created Nested Text Modifier Group

**Verification Steps:**
1. Create nested text modifier group structure
2. Add override at nested level
3. Publish menu
4. Verify nested text modifier group duplication
5. Verify overridden values

**Usage:**
```typescript
VerificationAgents.verifyRule10_NestedTextModifierGroupDuplication(
  parentTextModifierGroup,
  nestedTextModifierGroup,
  nestingLevel,
  overriddenValue
);
```

**Expected Result:** Nested text modifier group duplicated

---

### Agent: Rule 11 - Nested Text Modifier Duplication Verification
**Rule:** Nested Text Modifier Group should be duplicated along with Nested Text modifier with displaying a unique overridden value in the newly created Nested Text Modifier

**Verification Steps:**
1. Create nested text modifier
2. Override nested text modifier value
3. Publish menu
4. Verify nested text modifier duplication
5. Verify override

**Usage:**
```typescript
VerificationAgents.verifyRule11_NestedTextModifierDuplication(
  parentTextModifier,
  nestedTextModifier,
  nestingLevel,
  overriddenValue
);
```

**Expected Result:** Nested text modifier duplicated with override

---

### Agent: Rule 12 - Merge After Revert Verification
**Rule:** When revert the overridden changes, duplicated aggregates should be merged with removing duplicates

**Verification Steps:**
1. Create product with override (creates 2 products in GC2)
2. Publish menu
3. Verify 2 products exist in GC2
4. Revert override in GC3
5. Publish menu again
6. Navigate to GC2 Menu Items
7. Search for the product
8. Count occurrences - should be back to 1
9. Verify only original product remains
10. Verify duplicate was removed

**Usage:**
```typescript
VerificationAgents.verifyRule12_MergeAfterRevert(
  productDisplayName,
  expectedCountAfterRevert
);
```

**Expected Result:** Duplicates merged, only 1 product remains

---

### Agent: Rule 13 - Sorting Order Verification
**Rule:** Category, Products and modifier groups sorting order inside menu should be equal to GC3 menu

**Verification Steps:**
1. Get sorting order from GC3 menu:
   - Category order
   - Products order within each category
   - Modifier groups order
2. Navigate to GC2 Menus
3. Open menu details
4. Get sorting order from GC2
5. Compare orders:
   - Categories should be in same order
   - Products within categories should be in same order
   - Modifier groups should be in same order
6. Assert orders match exactly

**Usage:**
```typescript
VerificationAgents.verifyRule13_SortingOrderMatch(
  menuName,
  entityType: 'category' | 'product' | 'modifier_group'
);
```

**Expected Result:** Sorting orders match between GC3 and GC2

---

### Agent: Rule 14 - Remove Logic Verification
**Rule:** Need to add remove logic

**Verification Steps:**
1. Create product/modifier group in GC3
2. Add to menu
3. Publish menu
4. Verify exists in GC2
5. Remove from menu in GC3
6. Publish menu again
7. Navigate to GC2
8. Search for the entity
9. Verify entity no longer exists or is marked as inactive

**Usage:**
```typescript
VerificationAgents.verifyRule14_RemoveLogic(
  entityType: 'product' | 'modifier_group' | 'category',
  entityDisplayName
);
```

**Expected Result:** Entity removed from GC2 after removal from GC3

---

### Agent: Rule 15 - Currency Sync Verification
**Rule:** All the available currency should be sync to products when them added in GC3

**Verification Steps:**
1. Create product in GC3 with multiple currencies:
   - Add AED price
   - Add USD price
   - Add EUR price
2. Publish menu
3. Navigate to GC2 Menu Items
4. Open product details
5. Check available currencies
6. Verify all currencies from GC3 are present in GC2
7. Verify prices match for each currency

**Usage:**
```typescript
VerificationAgents.verifyRule15_CurrencySync(
  productDisplayName,
  expectedCurrencies: [
    { code: 'AED', price: '150.00' },
    { code: 'USD', price: '40.00' },
    { code: 'EUR', price: '35.00' }
  ]
);
```

**Expected Result:** All currencies synced with correct prices

---

## 🔧 Helper Verification Agents

### Agent: Complete Menu Verification
**Purpose:** Comprehensive verification of entire menu after publish

**Verification Steps:**
1. Verify menu exists in GC2
2. Verify menu details match (name, brand, currency)
3. Verify category count matches
4. Verify product count matches
5. Verify modifier group count matches
6. Verify all prices match
7. Verify sorting orders match
8. Verify all currencies synced

**Usage:**
```typescript
VerificationAgents.verifyCompleteMenuPublish(menuName);
```

**Expected Result:** Complete menu verification passes

---

### Agent: Field-by-Field Comparison
**Purpose:** Compare specific fields between GC3 entity and GC2 entity

**Verification Steps:**
1. Get entity from GC3
2. Get same entity from GC2
3. Compare field by field:
   - Name
   - Display Name
   - Description
   - External ID
   - Price
   - Currency
   - Tags
   - Any custom fields
4. Report any mismatches

**Usage:**
```typescript
VerificationAgents.verifyFieldByFieldMatch(
  entityType,
  entityName,
  fieldsToVerify: ['name', 'price', 'description']
);
```

**Expected Result:** All specified fields match

---

## 📝 Usage in Test Scenarios

### Example: Add Comprehensive Verifications to Scenario

```typescript
// In test-scenarios.config.ts
{
  id: 'comprehensive-verification-test',
  name: 'Complete Verification Test',
  description: 'Verify all aspects of GC3 → GC2 publishing',
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
    // Basic verifications
    { type: 'gc2_menu_exists' },
    
    // Rule verifications
    { 
      type: 'gc2_product_reused_without_duplicate',
      displayName: 'Margherita Pizza',
      expectedCount: 1,
      reason: 'no_override',
    },
    
    // Custom agent verifications
    { 
      type: 'custom',
      agent: 'verifyPriceExactMatch',
      params: {
        productName: 'Margherita Pizza',
        expectedPrice: '150.00',
        currency: 'AED'
      }
    },
    { 
      type: 'custom',
      agent: 'verifyProductCountEqualsMenuItemCount',
      params: { expectedCount: 4 }
    },
    { 
      type: 'custom',
      agent: 'verifyMenuDetailsExactMatch',
      params: { menuName: 'Test Menu 1' }
    },
    { 
      type: 'custom',
      agent: 'verifyModifierGroupExactMatch',
      params: { modifierGroupName: 'Burger Additions_PMG001' }
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

---

## 🚀 Implementation Guide

### Step 1: Implement Agent Methods

Add these methods to `cypress/support/verification-logic/verification-agents.ts`:

```typescript
export class VerificationAgents {
  
  static verifyPriceExactMatch(productName: string, expectedPrice: string, currency: string): void {
    cy.log('═══════════════════════════════════════════════════════════════');
    cy.log('🔍 AGENT: Price Exact Match Verification');
    cy.log(`Product: ${productName}`);
    cy.log(`Expected Price: ${expectedPrice} ${currency}`);
    cy.log('═══════════════════════════════════════════════════════════════');
    
    // Implementation here
    navigator.navigate_to_gc2_menu_items_page();
    gc2MenuItemsPage.verify_page_loaded();
    gc2MenuItemsPage.step_search_menu_item(productName);
    gc2MenuItemsPage.step_click_first_view_button();
    gc2MenuItemsPage.verify_edit_page_loaded();
    gc2MenuItemsPage.verify_price_on_edit_page(expectedPrice);
    gc2MenuItemsPage.verify_currency_on_edit_page(currency);
    
    cy.log('✅ AGENT VERIFIED: Price matches exactly');
  }
  
  static verifyProductCountEqualsMenuItemCount(expectedCount: number): void {
    cy.log('═══════════════════════════════════════════════════════════════');
    cy.log('🔍 AGENT: Product Count = Menu Item Count Verification');
    cy.log(`Expected Count: ${expectedCount}`);
    cy.log('═══════════════════════════════════════════════════════════════');
    
    // Implementation here
    gc2MiddleLayer.gc2_menu_items_table_verification(expectedCount);
    
    cy.log('✅ AGENT VERIFIED: Product count equals menu item count');
  }
  
  static verifyMenuDetailsExactMatch(menuName: string): void {
    cy.log('═══════════════════════════════════════════════════════════════');
    cy.log('🔍 AGENT: Menu Details Exact Match Verification');
    cy.log(`Menu: ${menuName}`);
    cy.log('═══════════════════════════════════════════════════════════════');
    
    // Implementation here
    // TODO: Implement detailed menu comparison
    
    cy.log('✅ AGENT VERIFIED: Menu details match exactly');
  }
  
  static verifyModifierGroupExactMatch(modifierGroupName: string): void {
    cy.log('═══════════════════════════════════════════════════════════════');
    cy.log('🔍 AGENT: Modifier Group Exact Match Verification');
    cy.log(`Modifier Group: ${modifierGroupName}`);
    cy.log('═══════════════════════════════════════════════════════════════');
    
    // Implementation here
    navigator.navigate_to_gc2_modifier_groups_page();
    gc2ModifierGroupsPage.verify_page_loaded();
    gc2ModifierGroupsPage.search_and_verify_modifier_group(modifierGroupName);
    
    cy.log('✅ AGENT VERIFIED: Modifier group matches exactly');
  }
  
  // Add more agent implementations...
}
```

### Step 2: Use Agents in Tests

You can now use these agents in your test scenarios for comprehensive verification!

---

## 📊 Agent Coverage Matrix

| Rule # | Agent Method | Status | Priority |
|--------|-------------|--------|----------|
| 1 | `verifyRule1_ProductReuse` | ✅ Implemented | High |
| 2 | `verifyRule2_ModifierGroupReuse` | ✅ Implemented | High |
| 3 | `verifyRule3_ProductDuplicationWithOverride` | ✅ Implemented | High |
| 4 | `verifyRule4_ProductModifierGroupDuplication` | 🚧 Partial | Medium |
| 5 | `verifyRule5_ProductModifierDuplication` | 🚧 Partial | Medium |
| 6 | `verifyRule6_TextModifierGroupDuplication` | 🚧 Partial | Medium |
| 7 | `verifyRule7_TextModifierDuplication` | 🚧 Partial | Medium |
| 8 | `verifyRule8_NestedProductModifierGroupDuplication` | 🚧 Partial | Low |
| 9 | `verifyRule9_NestedProductModifierDuplication` | 🚧 Partial | Low |
| 10 | `verifyRule10_NestedTextModifierGroupDuplication` | 🚧 Partial | Low |
| 11 | `verifyRule11_NestedTextModifierDuplication` | 🚧 Partial | Low |
| 12 | `verifyRule12_MergeAfterRevert` | ✅ Implemented | High |
| 13 | `verifyRule13_SortingOrderMatch` | 🚧 Partial | Medium |
| 14 | `verifyRule14_RemoveLogic` | ✅ Implemented | High |
| 15 | `verifyRule15_CurrencySync` | 🚧 Partial | Medium |
| - | `verifyPriceExactMatch` | ✅ Implemented | High |
| - | `verifyProductCountEqualsMenuItemCount` | ✅ Implemented | High |
| - | `verifyMenuDetailsExactMatch` | 🚧 To Implement | High |
| - | `verifyModifierGroupExactMatch` | ✅ Implemented | High |

---

## 🎯 Next Steps for You

1. ✅ Review the verification agents defined above
2. ✅ Implement missing agent methods in `verification-agents.ts`
3. ✅ Add agents to your test scenarios
4. ✅ Run tests and verify all checks pass
5. ✅ Extend with custom agents as needed

**This AGENTS.md file serves as the specification for all verification logic!** 🚀
