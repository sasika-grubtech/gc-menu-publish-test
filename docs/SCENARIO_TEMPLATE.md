// ============================================================================
// Copy this template to test-scenarios.config.ts to add a new scenario
// ============================================================================

{
  // Unique ID for this scenario (kebab-case)
  id: 'your-scenario-id',
  
  // Display name for the test
  name: 'Your Scenario Name',
  
  // Brief description of what this scenario tests
  description: 'Brief description of the test scenario',
  
  // ============================================================================
  // SETUP: What to create in GC3
  // ============================================================================
  setup: {
    // Number of products to create
    products: 4,
    
    // Number of modifier groups to create
    modifierGroups: 2,
    
    // (Optional) Build nested modifier chain
    nestedModifierChain: {
      chainIndex: 1,              // Which chain to build
      productCount: 4,            // Products to use in chain
      modifierGroupCount: 2,      // Modifier groups to use
    },
    
    // Menu configuration
    menu: {
      count: 1,                   // Number of menus to create
      categoriesPerMenu: 2,       // Categories per menu
      productsPerCategory: 2,     // Products per category
      reuseProducts: true,        // true = reuse same products, false = unique
    },
  },
  
  // ============================================================================
  // ACTIONS: What to do
  // ============================================================================
  actions: [
    { type: 'publish' },          // Publish menu to GC2
  ],
  
  // ============================================================================
  // VERIFICATIONS: What to verify in GC2
  // ============================================================================
  verifications: [
    // Basic verifications
    { type: 'gc2_menu_exists' },
    { type: 'gc2_menu_items_count', expectedCount: 3 },
    
    // Product count by name
    { 
      type: 'gc2_product_count_by_name',
      displayName: 'Margherita Pizza',
      expectedCount: 1,
    },
    
    // Product with different prices
    {
      type: 'gc2_product_with_different_prices',
      displayName: 'Margherita Pizza',
      prices: [25.00, 30.00],
      expectedCount: 2,
    },
    
    // Modifier group verifications
    { type: 'gc2_modifier_groups_count', expectedCount: 2 },
    { 
      type: 'gc2_modifier_group_not_exists',
      displayName: 'Some Modifier Group',
    },
    
    // Custom agent verification
    {
      type: 'custom_agent',
      agent: 'verifyAllProductPricesMatch',
      params: { productCount: 4 },
    },
  ],
  
  // ============================================================================
  // CLEANUP: What to clean up
  // ============================================================================
  cleanup: {
    menus: 1,                     // Menus to cleanup in GC3
    products: 4,                  // Products to cleanup in GC3
    modifierGroups: 2,            // Modifier groups to cleanup in GC3
    gc2MenuItems: 9,              // Menu items to cleanup in GC2
    gc2Menus: 1,                  // Menus to cleanup in GC2
    gc2ModifierGroups: 2,         // Modifier groups to cleanup in GC2
  },
},

// ============================================================================
// AVAILABLE VERIFICATION TYPES
// ============================================================================
/*

1. gc2_menu_exists
   - Verifies menu exists in GC2
   { type: 'gc2_menu_exists' }

2. gc2_menu_count
   - Verifies total menu count in GC2
   { type: 'gc2_menu_count', expectedCount: 1 }

3. gc2_menu_items_count
   - Verifies total menu items count
   { type: 'gc2_menu_items_count', expectedCount: 3 }

4. gc2_product_count_by_name
   - Verifies count of products by display name
   { 
     type: 'gc2_product_count_by_name',
     displayName: 'Product Name',
     expectedCount: 1,
   }

5. gc2_product_with_different_prices
   - Verifies products with specific prices
   {
     type: 'gc2_product_with_different_prices',
     displayName: 'Product Name',
     prices: [25.00, 30.00],
     expectedCount: 2,
   }

6. gc2_modifier_groups_count
   - Verifies total modifier group count
   { type: 'gc2_modifier_groups_count', expectedCount: 2 }

7. gc2_modifier_group_not_exists
   - Verifies modifier group doesn't exist
   { 
     type: 'gc2_modifier_group_not_exists',
     displayName: 'Modifier Group Name',
   }

8. custom_agent
   - Calls custom verification agent
   {
     type: 'custom_agent',
     agent: 'agentMethodName',
     params: { param1: 'value1', param2: 123 },
   }

*/

// ============================================================================
// COMMON CUSTOM AGENTS
// ============================================================================
/*

Price Verification:
- verifyPriceExactMatch(productName, price, currency)
- verifyAllProductPricesMatch(productCount)

Count Verification:
- verifyProductCountEqualsMenuItemCount(productCount)

Details Verification:
- verifyMenuDetailsExactMatch(menuName, expectedFields)
- verifyModifierGroupExactMatch(modifierGroupName, expectedFields)

Business Rules (Rule 1-15):
- verifyRule1_ProductReuse(productName)
- verifyRule2_ModifierGroupReuse(modifierGroupName)
- verifyRule3_ProductDuplicationWithOverride(productName, overrideField)
- ... and more (see AGENTS.md)

*/
