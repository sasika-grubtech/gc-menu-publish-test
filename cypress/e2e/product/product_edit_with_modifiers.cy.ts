import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { ProductHomePage } from "cypress/page-objects/pages/product/product_home_page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ProductGetDetailsService } from "cypress/services/product/product-get-details";
import { ModifierGroupGetDetailsService } from "cypress/services/modifier-group/modifier-group-get-details";

const navigator = new PageNavigator();
const productCreate = new ProductCreatePage();
const productHome = new ProductHomePage();

/**
 * Product Modifier Chain Configuration:
 * 
 * Chain 1: Product 1 → MG 1 → Product 2 → MG 2 → Product 3
 * Chain 2: Product 4 → MG 3 → Product 5 → MG 4 → Product 6
 * Chain 3: Product 7 → MG 5 → Product 8 → MG 6 → Product 9
 */

// Define the nested modifier chain configuration
const modifierChains = [
    // Chain 1
    {
        parentProduct: "Classic Margherita Pizza",
        modifierGroup: "Burger Additions_PMG001",
        childProduct: "Chicken Burger Deluxe"
    },
    {
        parentProduct: "Chicken Burger Deluxe",
        modifierGroup: "Pizza Sizes_PMG002",
        childProduct: "Caesar Salad Bowl"
    },
    // Chain 2
    {
        parentProduct: "Beef Pasta Carbonara",
        modifierGroup: "Pasta Variations_PMG003",
        childProduct: "Chocolate Lava Cake"
    },
    {
        parentProduct: "Chocolate Lava Cake",
        modifierGroup: "Coffee Customization_PMG004",
        childProduct: "Grilled Salmon Fillet"
    },
    // Chain 3
    {
        parentProduct: "Vegetable Spring Rolls",
        modifierGroup: "Salad Dressings_PMG005",
        childProduct: "Iced Caramel Macchiato"
    },
    {
        parentProduct: "Iced Caramel Macchiato",
        modifierGroup: "Sandwich Breads_PMG006",
        childProduct: "BBQ Chicken Wings"
    }
];

describe('Edit Products with Nested Modifier Groups and Product Modifiers', () => {

    const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

    before(() => {
        // Navigate to product page once before all tests
        navigator.navigate_to_product_page();
    });

    modifierChains.forEach((chain, index) => {
        it(`Chain ${Math.floor(index / 2) + 1} - Step ${(index % 2) + 1}: Add "${chain.modifierGroup}" to "${chain.parentProduct}" with "${chain.childProduct}" as product modifier`, function () {
            
            // Step 1: Get Parent Product ID
            cy.log(`📦 Getting Parent Product ID: ${chain.parentProduct}`);
            ProductGetDetailsService.filterProductsByName(partnerId, chain.parentProduct).then((parentFound) => {
                expect(parentFound).to.be.true;
                const parentProductId = Cypress.env('PRODUCT_ID');
                cy.log(`✅ Parent Product ID: ${parentProductId}`);

                // Step 2: Get Modifier Group ID
                cy.log(`📦 Getting Modifier Group ID: ${chain.modifierGroup}`);
                ModifierGroupGetDetailsService.filterModifierGroupsByName(partnerId, chain.modifierGroup, 'product').then((mgFound) => {
                    expect(mgFound).to.be.true;
                    const modifierGroupId = Cypress.env('PRODUCT_MODIFIER_GROUP_ID');
                    cy.log(`✅ Modifier Group ID: ${modifierGroupId}`);

                    // Step 3: Get Child Product ID (to be used as Product Modifier)
                    cy.log(`📦 Getting Child Product ID: ${chain.childProduct}`);
                    ProductGetDetailsService.filterProductsByName(partnerId, chain.childProduct).then((childFound) => {
                        expect(childFound).to.be.true;
                        const childProductId = Cypress.env('PRODUCT_ID');
                        cy.log(`✅ Child Product ID: ${childProductId}`);

                        // Step 4: Search and Edit Parent Product
                        cy.log(`🔧 Editing product: ${chain.parentProduct}`);
                        productHome.step_search_products(chain.parentProduct);
                        productHome.step_click_edit_product();

                        // Step 5: Add Modifier Group to Product
                        cy.log(`➕ Adding Modifier Group: ${chain.modifierGroup}`);
                        productCreate.step_click_modifier_group_select();
                        productCreate.step_select_modifier_group_in_dropdown(modifierGroupId);
                        productCreate.step_click_save_add_mg_modal_button();
                        
                        // Verify modifier group was added
                        productCreate.verify_modifier_group_added_visible(modifierGroupId, chain.modifierGroup);

                        // Step 6: Expand Modifier Group and Add Product Modifier
                        cy.log(`➕ Adding Product Modifier: ${chain.childProduct}`);
                        productCreate.step_click_expand_button(modifierGroupId);
                        productCreate.step_add_modifier_first_level_override(modifierGroupId);
                        productCreate.step_search_and_select_modifier_second_level_override(chain.childProduct, childProductId);
                        productCreate.step_click_save_first_level_override_modal_button();

                        // Step 7: Save Product
                        cy.log(`💾 Saving product: ${chain.parentProduct}`);
                        productCreate.product_create_button_click();
                        
                        // Verify success toast
                        productHome.verify_toast_message("Product updated successfully");

                        cy.log(`✅ Successfully configured: ${chain.parentProduct} → ${chain.modifierGroup} → ${chain.childProduct}`);

                        // Wait for toast to dismiss before next test
                        cy.wait(2000);

                        // Clear search for next iteration
                        productHome.step_clear_search();
                        cy.wait(1000);
                    });
                });
            });
        });
    });

    it('Summary: All 3 Modifier Chains Configured', function () {
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log('✅ Chain 1: Classic Margherita Pizza → Burger Additions_PMG001 → Chicken Burger Deluxe → Pizza Sizes_PMG002 → Caesar Salad Bowl');
        cy.log('✅ Chain 2: Beef Pasta Carbonara → Pasta Variations_PMG003 → Chocolate Lava Cake → Coffee Customization_PMG004 → Grilled Salmon Fillet');
        cy.log('✅ Chain 3: Vegetable Spring Rolls → Salad Dressings_PMG005 → Iced Caramel Macchiato → Sandwich Breads_PMG006 → BBQ Chicken Wings');
        cy.log('═══════════════════════════════════════════════════════════════');
    });
});
