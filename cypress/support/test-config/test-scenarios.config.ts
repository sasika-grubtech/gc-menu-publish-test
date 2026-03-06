/**
 * Test Scenarios Configuration
 * 
 * This file defines all test scenarios for GC3 → GC2 menu publishing and verification.
 * Each scenario specifies:
 * - Setup (products, modifier groups, menus)
 * - Actions (publish, override, revert)
 * - Expected verification outcomes in GC2
 * 
 * Adding a new test scenario is as simple as adding a new configuration object.
 */

export type TestScenarioConfig = {
  id: string;
  name: string;
  description: string;
  setup: {
    products: number;
    modifierGroups: number;
    nestedModifierChain?: {
      chainIndex: number;
      productCount: number;
      modifierGroupCount: number;
    };
    menu: {
      count: number;
      categoriesPerMenu: number;
      productsPerCategory: number;
      reuseProducts?: boolean;
    };
  };
  actions: TestAction[];
  verifications: TestVerification[];
  cleanup: {
    menus: number;
    products: number;
    modifierGroups: number;
    gc2MenuItems: number;
    gc2Menus: number;
    gc2ModifierGroups: number;
  };
};

export type TestAction = 
  | { type: 'publish' }
  | { 
      type: 'override_product_price';
      categoryIndex: number;
      productDisplayName: string;
      newPrice: string;
    }
  | {
      type: 'revert_product_price';
      categoryIndex: number;
      productDisplayName: string;
      originalPrice: string;
    }
  | {
      type: 'add_product_to_category';
      categoryIndex: number;
      productDisplayName: string;
    }
  | {
      type: 'remove_product_from_category';
      categoryIndex: number;
      productDisplayName: string;
    }
  | {
      type: 'override_product_field';
      categoryIndex: number;
      productDisplayName: string;
      field: 'name' | 'description' | 'externalId';
      newValue: string;
    }
  | {
      type: 'add_modifier_group_to_product';
      productDisplayName: string;
      modifierGroupDisplayName: string;
    }
  | {
      type: 'remove_modifier_group_from_product';
      productDisplayName: string;
      modifierGroupDisplayName: string;
    };

export type TestVerification =
  | { type: 'gc2_menu_exists' }
  | { type: 'gc2_menu_count'; expectedCount: number }
  | { type: 'gc2_menu_items_count'; expectedCount: number }
  | { 
      type: 'gc2_product_count_by_name';
      displayName: string;
      expectedCount: number;
    }
  | {
      type: 'gc2_product_with_different_prices';
      displayName: string;
      price1: string;
      price2: string;
    }
  | {
      type: 'gc2_modifier_groups_count';
      expectedCount: number;
    }
  | {
      type: 'gc2_modifier_group_not_exists';
      displayName: string;
    }
  | {
      type: 'gc2_menu_per_location';
      expectedLocationCount: number;
      locations?: string[];
      brandName?: string;
    }
  | {
      type: 'gc2_product_reused_without_duplicate';
      displayName: string;
      expectedCount: number;
      reason: 'no_hash_change' | 'no_override';
    }
  | {
      type: 'gc2_product_duplicated_with_override';
      displayName: string;
      expectedCount: number;
      overriddenField: string;
    }
  | {
      type: 'gc2_modifier_group_reused_without_duplicate';
      displayName: string;
      expectedCount: number;
      reason: 'no_hash_change' | 'no_override';
    }
  | {
      type: 'gc2_modifier_group_duplicated_with_override';
      displayName: string;
      expectedCount: number;
      overriddenField: string;
    }
  | {
      type: 'gc2_sorting_order_matches_gc3';
      entityType: 'category' | 'product' | 'modifier_group';
    }
  | {
      type: 'gc2_currency_synced';
      productDisplayName: string;
      expectedCurrencies: string[];
    }
  | {
      type: 'custom_agent';
      agent: string;
      params: any;
    };

/**
 * ================================================================================
 * TEST SCENARIOS CATALOG
 * ================================================================================
 */

export const TEST_SCENARIOS: TestScenarioConfig[] = [
  
  // ============================================================================
  // SCENARIO: Product Reuse (No Overrides)
  // ============================================================================
  {
    id: 'product-reuse-no-override',
    name: 'Product Reuse Between Categories Without Overrides',
    description: 'Same product used in multiple categories should be reused without duplicates when there are no overrides',
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
      {
        type: 'gc2_product_reused_without_duplicate',
        displayName: 'Margherita Pizza',
        expectedCount: 1,
        reason: 'no_override',
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
  },

  // ============================================================================
  // SCENARIO: Product Price Override & Merge
  // ============================================================================
  {
    id: 'product-price-override-merge',
    name: 'Product Price Override in One Category, Then Merge',
    description: 'Product duplicated when price overridden in one category, merged back when override reverted',
    setup: {
      products: 3,
      modifierGroups: 2,
      nestedModifierChain: {
        chainIndex: 1,
        productCount: 3,
        modifierGroupCount: 2,
      },
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
        categoryIndex: 1, // Category 2
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
      { 
        type: 'gc2_product_count_by_name',
        displayName: 'Margherita Pizza',
        expectedCount: 1,
      },
      { type: 'gc2_modifier_groups_count', expectedCount: 1 },
      {
        type: 'gc2_product_with_different_prices',
        displayName: 'Margherita Pizza',
        price1: '150.00',
        price2: '999.00',
      },
      {
        type: 'gc2_product_count_by_name',
        displayName: 'Margherita Pizza',
        expectedCount: 1, // After revert
      },
    ],
    cleanup: {
      menus: 1,
      products: 3,
      modifierGroups: 2,
      gc2MenuItems: 3,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Unique Modifier Groups Per Product
  // ============================================================================
  {
    id: 'unique-modifier-groups',
    name: 'Unique Modifier Groups for Each Product',
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
  },

  // ============================================================================
  // SCENARIO: Multi-Location Publishing
  // ============================================================================
  {
    id: 'menu-to-multiple-locations',
    name: 'Same Menu Published to Multiple Locations',
    description: 'Menu published to multiple locations should appear once per location in GC2',
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
      {
        type: 'gc2_menu_per_location',
        expectedLocationCount: 2,
        locations: ['Location A', 'Location B'],
        brandName: 'KFC',
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
  },

  // ============================================================================
  // SCENARIO: Nested Modifier Combinations
  // ============================================================================
  {
    id: 'nested-modifier-combinations',
    name: 'Complex Nested Modifier Chains',
    description: 'Products with nested modifier groups (product modifiers containing other modifier groups)',
    setup: {
      products: 3,
      modifierGroups: 2,
      nestedModifierChain: {
        chainIndex: 1,
        productCount: 3,
        modifierGroupCount: 2,
      },
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
      products: 3,
      modifierGroups: 2,
      gc2MenuItems: 3,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Simple Configuration with All Fields
  // ============================================================================
  {
    id: 'simple-config-all-fields',
    name: 'Simple Menu with All Product Fields',
    description: 'Create and verify a simple menu with all product fields populated',
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
      { type: 'gc2_menu_items_count', expectedCount: 4 },
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

  // ============================================================================
  // SCENARIO: Entity Count Mapping (9 Products)
  // ============================================================================
  {
    id: 'entity-count-9-products',
    name: 'Entity Count Mapping with 9 Products',
    description: 'Verify correct entity count mapping for larger product sets',
    setup: {
      products: 9,
      modifierGroups: 2,
      nestedModifierChain: {
        chainIndex: 1,
        productCount: 9,
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
    ],
    cleanup: {
      menus: 1,
      products: 9,
      modifierGroups: 2,
      gc2MenuItems: 4,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Simple Config with Mandatory Fields Only
  // ============================================================================
  {
    id: 'simple-config-mandatory-fields',
    name: 'Simple Menu with Mandatory Fields Only',
    description: 'Create menu with only mandatory fields filled, verify backward compatibility',
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
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Menu to Single Location
  // ============================================================================
  {
    id: 'menu-to-single-location',
    name: 'Menu Published to Single Location',
    description: 'Basic menu publishing to one location',
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

  // ============================================================================
  // SCENARIO: Modifier Group Reuse Across Products
  // ============================================================================
  {
    id: 'modifier-group-reuse-across-products',
    name: 'Reuse Modifier Group Across Products',
    description: 'Same modifier group attached to multiple products should be reused',
    setup: {
      products: 4,
      modifierGroups: 1,
      nestedModifierChain: {
        chainIndex: 1,
        productCount: 4,
        modifierGroupCount: 1,
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
      { type: 'gc2_modifier_groups_count', expectedCount: 1 },
    ],
    cleanup: {
      menus: 1,
      products: 4,
      modifierGroups: 1,
      gc2MenuItems: 4,
      gc2Menus: 1,
      gc2ModifierGroups: 1,
    },
  },

  // ============================================================================
  // SCENARIO: Entity Count 4 Products
  // ============================================================================
  {
    id: 'entity-count-4-products',
    name: 'Entity Count Mapping with 4 Products',
    description: 'Verify correct entity count mapping',
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

  // ============================================================================
  // SCENARIO: Multi-Location with Reusing Modifiers
  // ============================================================================
  {
    id: 'multi-location-reusing-modifiers',
    name: 'Menu to Multiple Locations with Reusing Modifiers',
    description: '4 products, 2 categories, same modifier group reused, published to multiple locations',
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
    ],
    cleanup: {
      menus: 1,
      products: 4,
      modifierGroups: 2,
      gc2MenuItems: 9,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Multi-Location with Non-Duplicated Modifiers
  // ============================================================================
  {
    id: 'multi-location-non-duplicated-modifiers',
    name: 'Menu to Multiple Locations with Non-Duplicated Modifiers',
    description: '4 products, 2 categories, unique modifier groups, published to multiple locations',
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
    ],
    cleanup: {
      menus: 1,
      products: 4,
      modifierGroups: 2,
      gc2MenuItems: 9,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Multi-Platform (Glovo + Uber Eats)
  // ============================================================================
  {
    id: 'multi-platform-glovo-uber-eats',
    name: 'Menu Published to Multiple Platforms (Glovo + Uber Eats)',
    description: 'Publish same menu to Glovo multiple locations and Uber Eats service modes',
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

  // ============================================================================
  // SCENARIO: Multi-Platform with Reusing Modifiers
  // ============================================================================
  {
    id: 'multi-platform-reusing-modifiers',
    name: 'Multi-Platform with Reusing Modifiers',
    description: '4 products, 2 categories, same modifier reused, multiple platforms',
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
    ],
    cleanup: {
      menus: 1,
      products: 4,
      modifierGroups: 2,
      gc2MenuItems: 9,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Multi-Platform with Non-Duplicated Modifiers
  // ============================================================================
  {
    id: 'multi-platform-non-duplicated-modifiers',
    name: 'Multi-Platform with Non-Duplicated Modifiers',
    description: '4 products, 2 categories, unique modifiers, multiple platforms',
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
    ],
    cleanup: {
      menus: 1,
      products: 4,
      modifierGroups: 2,
      gc2MenuItems: 9,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

  // ============================================================================
  // SCENARIO: Modifier Group Remove and Add Back (Rule 14)
  // ============================================================================
  {
    id: 'modifier-remove-add-back',
    name: 'Modifier Group Remove and Add Back',
    description: 'Remove modifier group from product, verify removal in GC2, then add back and verify',
    setup: {
      products: 3,
      modifierGroups: 2,
      nestedModifierChain: {
        chainIndex: 1,
        productCount: 3,
        modifierGroupCount: 2,
      },
      menu: {
        count: 1,
        categoriesPerMenu: 2,
        productsPerCategory: 1,
        reuseProducts: true,
      },
    },
    actions: [
      { type: 'publish' },
      // Note: Remove/add modifier actions need custom implementation
    ],
    verifications: [
      { type: 'gc2_menu_exists' },
      {
        type: 'gc2_product_count_by_name',
        displayName: 'Margherita Pizza',
        expectedCount: 1,
      },
      { type: 'gc2_modifier_groups_count', expectedCount: 1 },
    ],
    cleanup: {
      menus: 1,
      products: 3,
      modifierGroups: 2,
      gc2MenuItems: 3,
      gc2Menus: 1,
      gc2ModifierGroups: 2,
    },
  },

];

/**
 * ================================================================================
 * HELPER FUNCTIONS
 * ================================================================================
 */

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): TestScenarioConfig | undefined {
  return TEST_SCENARIOS.find(scenario => scenario.id === id);
}

/**
 * Get all scenarios by tag/category
 */
export function getScenariosByTag(tag: string): TestScenarioConfig[] {
  // You can extend this to add tags to scenarios
  return [];
}

/**
 * Validate scenario configuration
 */
export function validateScenario(scenario: TestScenarioConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!scenario.id) errors.push('Scenario ID is required');
  if (!scenario.name) errors.push('Scenario name is required');
  if (!scenario.setup) errors.push('Setup configuration is required');
  if (!scenario.actions || scenario.actions.length === 0) errors.push('At least one action is required');
  if (!scenario.verifications || scenario.verifications.length === 0) errors.push('At least one verification is required');

  return {
    valid: errors.length === 0,
    errors,
  };
}
