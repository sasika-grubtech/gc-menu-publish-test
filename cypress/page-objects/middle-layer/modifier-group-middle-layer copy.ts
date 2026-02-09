import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { ProductHomePage } from "cypress/page-objects/pages/product/product_home_page";
import { ModifierGroupHomePage } from "cypress/page-objects/pages/modifier-group/modifier-group-home-page";
import { TextModifierGroupPage } from "cypress/page-objects/pages/modifier-group/text-modifier-group-page";
import { MenuHomePage } from "cypress/page-objects/pages/menu/menu-home-page";
import { MenuPage } from "cypress/page-objects/pages/menu/menu-page";
import { PublishPage } from "cypress/page-objects/pages/publish/publish-page";
import { GC2MenuItemsPage } from "cypress/page-objects/pages/gc2/gc2-menu-items-page";
import { GC2MenusPage } from "cypress/page-objects/pages/gc2/gc2-menus-page";
import { GC2ModifierGroupsPage } from "cypress/page-objects/pages/gc2/gc2-modifier-groups-page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ProductGetDetailsService } from "cypress/services/product/product-get-details";
import { ProductDeleteService } from "cypress/services/product/product-delete";
import { ModifierGroupGetDetailsService } from "cypress/services/modifier-group/modifier-group-get-details";
import { ModifierGroupDeleteService } from "cypress/services/modifier-group/modifier-group-delete";

const navigator = new PageNavigator();
const productCreate = new ProductCreatePage();
const productHome = new ProductHomePage();
const modifierGroupHome = new ModifierGroupHomePage();
const modifierGroupCreate = new TextModifierGroupPage();
const menuHome = new MenuHomePage();
const menuPage = new MenuPage();
const publishPage = new PublishPage();
const gc2MenuItemsPage = new GC2MenuItemsPage();
const gc2MenusPage = new GC2MenusPage();
const gc2ModifierGroupsPage = new GC2ModifierGroupsPage();

// Store created items for cleanup
export const createdProductNames: string[] = [];
const createdModifierGroupNames: string[] = [];
const createdMenuNames: string[] = [];
const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

export class ModifierGroupMiddleLayer {

    public modifier_group_bulk_create( count?: number) {
        cy.fixture('bulk_product_modifier_groups').then((bulkData) => {
            cy.fixture('shared/tags').then((tagsData) => {
                cy.fixture('shared/category').then((categoryData) => {
                    // Only create first 6 modifier groups (for 3 chains, 2 per chain)
                    const modifierGroups = bulkData.productModifierGroups.slice(0, 6);

                    cy.log(`📦 STEP 2: Creating ${modifierGroups.length} product modifier groups`);
                    cy.log('═══════════════════════════════════════════════════════════════');

                    modifierGroups.forEach((mg: any, index: number) => {
                        cy.log(`🔹 Creating modifier group ${index + 1} of ${modifierGroups.length}: ${mg.name}`);

                        // Store modifier group name for cleanup
                        createdModifierGroupNames.push(mg.name);

                        // ====== OVERVIEW TAB ======
                        modifierGroupHome
                            .step_click_create_new_modifier_group_button()
                            .step_click_modifier_type_product_button()
                            .step_enter_overview_name(mg.name)
                            .step_enter_overview_display_name(mg.displayName)
                            .step_enter_overview_description(mg.description)
                            .step_enter_overview_external_id(mg.externalId);

                        // Select existing category
                        const categoryIndex = index % categoryData.categories.length;
                        const category = categoryData.categories[categoryIndex];
                        modifierGroupCreate.step_click_category_select_textbox();
                        cy.get(`[data-cy="category-checkbox-${category.id}"]`).click({ force: true });

                        // Toggle Status to Active
                       // modifierGroupCreate.step_change_overview_status();

                        // ====== TAGS TAB ======
                        modifierGroupCreate.verify_tags_title_visible();
                        modifierGroupCreate.step_enter_tags_select(tagsData.tags[0].name);
                        modifierGroupCreate.step_select_tag_checkbox(tagsData.tags[0].id);

                        // ====== CREATE MODIFIER GROUP ======
                        modifierGroupCreate.step_click_create_modifier_group_button();

                        // Validate toast message
                        modifierGroupHome
                            .verify_toast_message("Modifier group created successfully")
                            .verify_toast_message_text(`New modifier group, "${mg.name}" has been successfully created`);

                        cy.log(`✅ Modifier group ${index + 1} created: ${mg.name}`);
                        cy.wait(2000);
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ STEP 2 COMPLETE: Created ${modifierGroups.length} modifier groups`);
                });
            });
        });

    }


    public modifier_group_bulk_edit(count?: number) {
        // Define complete nested chains - each entry builds the full chain on one product
        // Note: productModifierName is used for search, productModifierDisplayName is used for verification
        const nestedChains = [
            // Chain 1: Classic Margherita Pizza → MG1 → Chicken Burger Deluxe → MG2 → Caesar Salad Bowl
            {
                chainNumber: 1,
                rootProduct: "Classic Margherita Pizza",
                level1: {
                    modifierGroupName: "Burger Additions_PMG001",
                    modifierGroupDisplayName: "Premium Burger Add-ons",
                    productModifierName: "Chicken Burger Deluxe",
                    productModifierDisplayName: "Deluxe Chicken Burger"
                },
                level2: {
                    modifierGroupName: "Pizza Sizes_PMG002",
                    modifierGroupDisplayName: "Pizza Size Selection",
                    productModifierName: "Caesar Salad Bowl",
                    productModifierDisplayName: "Classic Caesar Salad"
                }
            },
            // Chain 2: Beef Pasta Carbonara → MG3 → Chocolate Lava Cake → MG4 → Grilled Salmon Fillet
            {
                chainNumber: 2,
                rootProduct: "Beef Pasta Carbonara",
                level1: {
                    modifierGroupName: "Pasta Variations_PMG003",
                    modifierGroupDisplayName: "Pasta Type Selection",
                    productModifierName: "Chocolate Lava Cake",
                    productModifierDisplayName: "Molten Chocolate Cake"
                },
                level2: {
                    modifierGroupName: "Coffee Customization_PMG004",
                    modifierGroupDisplayName: "Coffee Preferences",
                    productModifierName: "Grilled Salmon Fillet",
                    productModifierDisplayName: "Atlantic Grilled Salmon"
                }
            },
            // Chain 3: Vegetable Spring Rolls → MG5 → Iced Caramel Macchiato → MG6 → BBQ Chicken Wings
            {
                chainNumber: 3,
                rootProduct: "Vegetable Spring Rolls",
                level1: {
                    modifierGroupName: "Salad Dressings_PMG005",
                    modifierGroupDisplayName: "Dressing Selection",
                    productModifierName: "Iced Caramel Macchiato",
                    productModifierDisplayName: "Caramel Macchiato"
                },
                level2: {
                    modifierGroupName: "Sandwich Breads_PMG006",
                    modifierGroupDisplayName: "Bread Type",
                    productModifierName: "BBQ Chicken Wings",
                    productModifierDisplayName: "Spicy BBQ Wings"
                }
            }
        ];

        beforeEach(() => {
            navigator.navigate_to_product_page();
        });

        nestedChains.forEach((chain) => {
            it(`Chain ${chain.chainNumber}: ${chain.rootProduct} → ${chain.level1.modifierGroupDisplayName} → ${chain.level1.productModifierDisplayName} → ${chain.level2.modifierGroupDisplayName} → ${chain.level2.productModifierDisplayName}`, function () {
                
                cy.log(`📦 Building Complete Nested Chain ${chain.chainNumber}`);
                cy.log('═══════════════════════════════════════════════════════════════');
                cy.log(`Root Product: ${chain.rootProduct}`);
                cy.log(`Level 1: → ${chain.level1.modifierGroupDisplayName} → ${chain.level1.productModifierDisplayName}`);
                cy.log(`Level 2: → ${chain.level2.modifierGroupDisplayName} → ${chain.level2.productModifierDisplayName}`);

                // ========== STEP 1: Search and Edit Root Product ==========
                cy.log(`🔧 Step 1: Searching and editing root product: ${chain.rootProduct}`);
                productHome.step_search_products(chain.rootProduct);
                productHome.step_click_edit_product();
                cy.wait(3000); // Wait for product edit page to fully load

                // ========== STEP 2: Add Level 1 Modifier Group ==========
                cy.log(`➕ Step 2: Adding Level 1 Modifier Group: ${chain.level1.modifierGroupName}`);
                productCreate.step_click_modifier_group_select();
                
                cy.get('[data-cy="enter-search-modifier-group-name-input"]').type(chain.level1.modifierGroupName);
                cy.wait(2000);
                
                cy.get('[data-cy^="modifier-group-table-select-"]')
                    .filter(':visible')
                    .first()
                    .click({ force: true });
                
                productCreate.step_click_save_add_mg_modal_button();
                cy.wait(2000);
                
                // Verify Level 1 MG was added
                cy.log(`✅ Verifying Level 1 MG added: ${chain.level1.modifierGroupDisplayName}`);
                cy.get('#modifier-groups').within(() => {
                    cy.contains(chain.level1.modifierGroupDisplayName).should('be.visible');
                });

                // ========== STEP 3: Add Level 1 Product Modifier ==========
                // Get the MG1 ID from DOM
                cy.get('#modifier-groups')
                    .find('[data-cy$="-display-name"]')
                    .contains(chain.level1.modifierGroupDisplayName)
                    .closest('[data-cy$="-display-name"]')
                    .invoke('attr', 'data-cy')
                    .then((dataCy) => {
                        const mg1Id = dataCy?.replace('-display-name', '') || '';
                        cy.log(`✅ Level 1 MG ID: ${mg1Id}`);

                        // Expand MG1
                        cy.log(`➕ Step 3: Expanding MG1 to add Product Modifier: ${chain.level1.productModifierName}`);
                        productCreate.step_click_expand_button(mg1Id);
                        
                        // Click Add Modifier button on MG1
                        productCreate.step_add_modifier_first_level_override(mg1Id);
                        
                        // Search and select Product 2 by name
                        cy.get('[data-cy="-input"]').type(chain.level1.productModifierName);
                        cy.wait(2000);
                        
                        cy.get('[data-cy^="product-table-select-"]')
                            .filter(':visible')
                            .first()
                            .click({ force: true });
                        
                        productCreate.step_click_save_first_level_override_modal_button();
                        cy.wait(2000);

                        // Verify Product 2 was added as modifier (by display name)
                        cy.log(`✅ Verifying Product Modifier added: ${chain.level1.productModifierDisplayName}`);
                        cy.get('#modifier-groups').within(() => {
                            cy.contains(chain.level1.productModifierDisplayName).should('be.visible');
                        });

                        // ========== STEP 4: Expand Product 2 and Add Level 2 Modifier Group ==========
                        // Get Product 2 ID from DOM (it should have a data-cy attribute)
                        cy.log(`➕ Step 4: Expanding Product Modifier to add Level 2 MG`);
                        
                        // Find the product modifier row and get its ID (using display name)
                        cy.get('#modifier-groups')
                            .contains(chain.level1.productModifierDisplayName)
                            .closest('[data-cy*="-display-name"]')
                            .invoke('attr', 'data-cy')
                            .then((productDataCy) => {
                                const product2Id = productDataCy?.replace('-display-name', '') || '';
                                cy.log(`✅ Product Modifier ID: ${product2Id}`);

                                // Expand Product 2 (the product modifier)
                                productCreate.step_click_expand_button(product2Id);
                                cy.wait(1000);

                                // Click "Add Modifier Groups" button on Product 2
                                cy.log(`➕ Clicking Add Modifier Groups on Product Modifier`);
                                cy.get(`[data-cy="add-modifier-group-button-${product2Id}"]`).click({ force: true });
                                cy.wait(2000);

                                // Search and select MG2
                                cy.log(`➕ Adding Level 2 MG: ${chain.level2.modifierGroupName}`);
                                cy.get('[data-cy="enter-search-modifier-group-name-input"]').clear().type(chain.level2.modifierGroupName);
                                cy.wait(2000);
                                
                                cy.get('[data-cy^="modifier-group-table-select-"]')
                                    .filter(':visible')
                                    .first()
                                    .click({ force: true });
                                
                                productCreate.step_click_save_add_mg_modal_button();
                                cy.wait(2000);

                                // Verify MG2 was added
                                cy.log(`✅ Verifying Level 2 MG added: ${chain.level2.modifierGroupDisplayName}`);
                                cy.contains(chain.level2.modifierGroupDisplayName).should('be.visible');

                                // ========== STEP 5: Expand MG2 and Add Level 2 Product Modifier ==========
                                // Get MG2 ID from DOM
                                cy.get('#modifier-groups')
                                    .contains(chain.level2.modifierGroupDisplayName)
                                    .closest('[data-cy$="-display-name"]')
                                    .invoke('attr', 'data-cy')
                                    .then((mg2DataCy) => {
                                        const mg2Id = mg2DataCy?.replace('-display-name', '') || '';
                                        cy.log(`✅ Level 2 MG ID: ${mg2Id}`);

                                        // Expand MG2
                                        cy.log(`➕ Step 5: Expanding MG2 to add Product Modifier: ${chain.level2.productModifierName}`);
                                        productCreate.step_click_expand_button(mg2Id);
                                        cy.wait(1000);

                                        // Click Add Modifier button on MG2
                                        productCreate.step_add_modifier_first_level_override(mg2Id);
                                        
                                        // Search and select Product 3 by name
                                        cy.get('[data-cy="-input"]').clear().type(chain.level2.productModifierName);
                                        cy.wait(2000);
                                        
                                        cy.get('[data-cy^="product-table-select-"]')
                                            .filter(':visible')
                                            .first()
                                            .click({ force: true });
                                        
                                        productCreate.step_click_save_first_level_override_modal_button();
                                        cy.wait(2000);

                                        // Verify Product 3 was added (by display name)
                                        cy.log(`✅ Verifying Product Modifier added: ${chain.level2.productModifierDisplayName}`);
                                        cy.get('#modifier-groups').within(() => {
                                            cy.contains(chain.level2.productModifierDisplayName).should('be.visible');
                                        });

                                        // ========== STEP 6: Save Product ==========
                                        cy.log(`💾 Step 6: Saving product with complete nested chain`);
                                        productCreate.product_create_button_click();
                                        
                                        // Verify success toast
                                        productHome.verify_toast_message("Product updated successfully");

                                        cy.log(`✅ CHAIN ${chain.chainNumber} COMPLETE!`);
                                        cy.log(`   ${chain.rootProduct}`);
                                        cy.log(`   → ${chain.level1.modifierGroupDisplayName}`);
                                        cy.log(`     → ${chain.level1.productModifierDisplayName}`);
                                        cy.log(`       → ${chain.level2.modifierGroupDisplayName}`);
                                        cy.log(`         → ${chain.level2.productModifierDisplayName}`);

                                        cy.wait(2000);
                                    });
                            });
                    });
            });
        });
    }
}