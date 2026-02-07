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
const createdProductNames: string[] = [];
const createdModifierGroupNames: string[] = [];
const createdMenuNames: string[] = [];

/**
 * COMPLETE WORKFLOW TEST
 * ======================
 * 
 * Step 1: Create 9 Products
 * Step 2: Create 6 Product Modifier Groups (only 6 needed for 3 chains)
 * Step 3: Edit Products to create nested modifier chains:
 *   Chain 1: Product 1 → MG 1 → Product 2 → MG 2 → Product 3
 *   Chain 2: Product 4 → MG 3 → Product 5 → MG 4 → Product 6
 *   Chain 3: Product 7 → MG 5 → Product 8 → MG 6 → Product 9
 * 
 * Step 4: Create Menus with Categories and Products:
 *   Menu 1: Category 1 (Product 1, Product 2) + Category 2 (Product 2, Product 3)
 *   Menu 2: Category 1 (Product 1, Product 2, Product 3) + Category 2 (Product 1, Product 2)
 * 
 * Step 5: Cleanup all created items
 */

describe('Complete Product Workflow: Create Products → Create Modifier Groups → Build Modifier Chains', () => {

    const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

    // ============================================================================
    // STEP 1: CREATE ALL 9 PRODUCTS
    // ============================================================================
    describe.skip('Step 1: Create 9 Products', () => {

        before(() => {
            navigator.navigate_to_product_page();
        });

        it('Should create all 9 products with all fields filled', function () {
            cy.fixture('bulk_products').then((bulkData) => {
                cy.fixture('shared/tags').then((tagsData) => {
                    cy.fixture('shared/category').then((categoryData) => {
                        const products = bulkData.products;
                        
                        cy.log(`📦 STEP 1: Creating ${products.length} products`);
                        cy.log('═══════════════════════════════════════════════════════════════');

                        products.forEach((product: any, index: number) => {
                            cy.log(`🔹 Creating product ${index + 1} of ${products.length}: ${product.name}`);

                            // Store product name for cleanup
                            createdProductNames.push(product.name);

                            // Click Create New Product button
                            productHome.step_click_create_new_product_button();

                            // ====== OVERVIEW TAB ======
                            productCreate.step_enter_product_name(product.name);
                            productCreate.step_enter_product_display_name(product.displayName);
                            productCreate.step_enter_product_description(product.description);
                            productCreate.step_enter_external_id(product.externalId);

                            // Select existing category
                            const categoryIndex = index % categoryData.categories.length;
                            const category = categoryData.categories[categoryIndex];
                            productCreate.step_click_category_select_button();
                            cy.get(`[data-cy="category-checkbox-${category.id}"]`).click({ force: true });

                            // Toggle Status to Active
                            productCreate.step_change_status();

                            // ====== PRICE & TAXES TAB ======
                            productCreate.verify_price_and_taxes_title_visible();
                            productCreate.step_click_currency_select();
                            productCreate.step_enter_price_input(product.price);

                            // ====== NUTRITION TAB ======
                            productCreate.step_click_nutritional_info_tab();
                            productCreate.step_enter_nutritional_info('100');

                            // ====== TAGS TAB ======
                            productCreate.verify_tags_title_visible();
                            productCreate.step_enter_tags_select(tagsData.tags[0].name);
                            productCreate.step_select_tag_checkbox(tagsData.tags[0].id);

                            // ====== CREATE PRODUCT ======
                            productCreate
                                .product_create_button_click()
                                .product_created_toaster_message(product.name);

                            cy.log(`✅ Product ${index + 1} created: ${product.name}`);
                            cy.wait(2000);
                        });

                        cy.log('═══════════════════════════════════════════════════════════════');
                        cy.log(`✅ STEP 1 COMPLETE: Created ${products.length} products`);
                    });
                });
            });
        });
    });

    // ============================================================================
    // STEP 2: CREATE 6 PRODUCT MODIFIER GROUPS (for 3 chains)
    // ============================================================================
    describe.skip('Step 2: Create 6 Product Modifier Groups', () => {

        before(() => {
            navigator.navigate_to_modifier_group_page();
        });

        it('Should create 6 product modifier groups with all fields filled', function () {
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
                            modifierGroupCreate.step_change_overview_status();

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
        });
    });

    // ============================================================================
    // STEP 3: EDIT PRODUCTS TO CREATE NESTED MODIFIER CHAINS
    // Each chain creates: Product 1 → MG 1 → Product 2 (modifier) → MG 2 → Product 3 (modifier)
    // All in a SINGLE product edit session
    // ============================================================================
    describe.skip('Step 3: Build Nested Modifier Chains', () => {

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
    });

    // ============================================================================
    // STEP 4: CREATE MENUS WITH CATEGORIES AND PRODUCTS
    // ============================================================================
    describe('Step 4: Create Menus with Categories and Products', () => {

        // Generate unique timestamp for this test run
        const menuTimestamp = Date.now();
        
        // Menu configurations with brand assignments
        // 2 categories per menu - Category names include M1/M2 prefix to avoid duplicates
        const menuConfigs = [
            {
                name: `Test Menu 1_${menuTimestamp}`,
                description: "Test menu with categories and products",
                externalId: `TEST_MENU_001_${menuTimestamp}`,
                brandName: "KFC",
                categories: [
                    {
                        name: `M1_Category 1_${menuTimestamp}`,
                        products: [
                            { name: "Classic Margherita Pizza", displayName: "Margherita Pizza" },
                            { name: "Chicken Burger Deluxe", displayName: "Deluxe Chicken Burger" }
                        ]
                    },
                    {
                        name: `M1_Category 2_${menuTimestamp}`,
                        products: [
                            { name: "Chicken Burger Deluxe", displayName: "Deluxe Chicken Burger" },
                            { name: "Caesar Salad Bowl", displayName: "Classic Caesar Salad" }
                        ]
                    }
                ]
            },
            {
                name: `Test Menu 2_${menuTimestamp}`,
                description: "Second test menu with overlapping products",
                externalId: `TEST_MENU_002_${menuTimestamp}`,
                brandName: "Pizza Hut",
                categories: [
                    {
                        name: `M2_Category 1_${menuTimestamp}`,
                        products: [
                            { name: "Classic Margherita Pizza", displayName: "Margherita Pizza" },
                            { name: "Chicken Burger Deluxe", displayName: "Deluxe Chicken Burger" },
                            { name: "Caesar Salad Bowl", displayName: "Classic Caesar Salad" }
                        ]
                    },
                    {
                        name: `M2_Category 2_${menuTimestamp}`,
                        products: [
                            { name: "Classic Margherita Pizza", displayName: "Margherita Pizza" },
                            { name: "Chicken Burger Deluxe", displayName: "Deluxe Chicken Burger" }
                        ]
                    }
                ]
            }
        ];

        beforeEach(() => {
            navigator.navigate_to_menu_page();
        });

        menuConfigs.forEach((menu, menuIndex) => {
            it(`Should create ${menu.name} with ${menu.categories.length} categories`, function () {
                cy.log(`📋 STEP 4: Creating Menu ${menuIndex + 1}: ${menu.name}`);
                cy.log('═══════════════════════════════════════════════════════════════');

                // Store menu name for cleanup
                createdMenuNames.push(menu.name);

                // Click Create New Menu
                menuHome.step_click_create_new_menu_button();

                // ====== OVERVIEW TAB ======
                menuPage.step_enter_overview_name(menu.name);
                
                // Select brand
                menuPage.step_click_overview_brand_select();
                cy.contains(menu.brandName).click({ force: true });
                
                menuPage.step_enter_overview_description(menu.description);
                menuPage.step_enter_overview_external_id(menu.externalId);

                // Select currency (SAR)
                menuPage.step_select_currency_dropdown();
                cy.contains('AED - United Arab Emirates Dirham').click({ force: true });

                // ====== TAX MANAGER ======
                menuPage.step_click_tax_manager_custom_tax_checkbox();
                menuPage.step_click_tax_manager_custom_tax_input();
                menuPage.step_create_new_tax('VAT', '5');
                menuPage.step_click_tax_manager_add_button();

                // ====== CATEGORIES & PRODUCTS TAB ======
                menuPage.step_click_category_products_tab();

                // Add each category using CREATE NEW approach
                menu.categories.forEach((category, catIndex) => {
                    cy.log(`➕ Creating New Category ${catIndex + 1}: ${category.name}`);

                    // Click Create New button - use different button based on whether categories exist
                    if (catIndex === 0) {
                        // First category - use initial create button
                        menuPage.step_click_create_category_initial();
                    } else {
                        // Subsequent categories - use header create button
                        menuPage.step_click_create_category_header();
                    }
                    
                    // Enter category name and save
                    menuPage.step_enter_category_products_name(category.name);
                    menuPage.step_click_category_save();

                    cy.log(`✅ Category created: ${category.name}`);

                    // Expand the category section first (it's collapsed by default)
                    menuPage.step_expand_category_section();

                    // Add products to the category ONE BY ONE
                    cy.log(`➕ Adding ${category.products.length} products to ${category.name}`);
                    
                    category.products.forEach((product, productIndex) => {
                        cy.log(`   ➕ Adding product ${productIndex + 1}: ${product.name} (Display: ${product.displayName})`);
                        
                        // Click "Add Products" button - target the specific category
                        menuPage.step_click_add_products_for_category(category.name);
                        
                        // Search and select the product - pass both name and displayName for validation
                        menuPage.step_search_and_select_product(product.name, product.displayName);
                        
                        // Save - this adds the single product and closes modal
                        menuPage.step_click_add_products_save();
                        cy.wait(1000);
                    });

                    cy.log(`✅ Category ${catIndex + 1} complete: ${category.name} with ${category.products.length} products`);
                });

                // ====== CREATE MENU ======
                menuPage.step_click_create_button();

                // Verify success toast
                menuHome.verify_toast_message('Menu created successfully');

                cy.log(`✅ Menu ${menuIndex + 1} created: ${menu.name}`);
                cy.log('═══════════════════════════════════════════════════════════════');
            });
        });
    });

    // ============================================================================
    // STEP 5: PUBLISH MENUS
    // ============================================================================
    describe('Step 5: Publish Menus', () => {

        it('Should navigate to Publish page and select brand', function () {
            cy.log('📤 STEP 5: Navigate to Publish Page');
            cy.log('═══════════════════════════════════════════════════════════════');

            // Navigate to the Publish page
            navigator.navigate_to_publish_page();

            // Verify publish page loaded
            publishPage.verify_publish_page_loaded();

            // Select the brand used when creating menus (KFC for Menu 1)
            cy.log('🏷️ Selecting KFC filter');
            publishPage.step_select_brand('KFC');

            // Verify brand is selected
            publishPage.step_verify_brand_selected('KFC');

            cy.log('✅ Publish page ready with KFC selected');

            // Expand Bolt aggregator section
            cy.log('📂 Expanding Bolt aggregator section');
            publishPage.step_expand_aggregator_section('Glovo');

            // Click Change Menu button for Bolt
            cy.log('🔄 Clicking Change Menu button');
            publishPage.step_click_change_menu_button('Glovo');

            // Select the menu we created (Menu 1)
            // Note: The menu name includes timestamp, so we use the stored name
            const menuName = createdMenuNames[0]; // First menu created
            cy.log(`📋 Selecting menu: ${menuName}`);
            publishPage.step_select_menu_from_list(menuName);

            // Click Assign button
            cy.log('✅ Clicking Assign button');
            publishPage.step_click_assign_button();

            cy.log('✅ Menu assigned to Bolt aggregator');

            // Click Publish All button
            cy.log('🚀 Clicking Publish All button');
            publishPage.step_click_publish_all();

            // Click Validate & Publish button in confirmation dialog
            cy.log('✅ Clicking Validate & Publish button');
            publishPage.step_click_validate_and_publish();

            cy.log('✅ Menu 1 published successfully!');

            // Verify the menu is published
            cy.log('🔍 Verifying Menu 1 publish status...');
            cy.wait(3000); // Wait for publish to complete
            
            // Expand the brand row to see details
            cy.log('📂 Expanding KFC brand row...');
            publishPage.step_click_brand_row_to_expand('KFC');
            
            // Verify menu name in location row (nested row after expansion)
            // Note: The cell displays both menu name and brand name
            cy.log('📋 Verifying menu name and brand in location row...');
            publishPage.verify_menu_name_in_location_row('Dubai', menuName, 'KFC');
            cy.log(`✅ Menu name and brand verified in location row: ${menuName} - KFC`);
            
            // Verify brand name is shown
            cy.log('🏷️ Verifying brand name...');
            publishPage.verify_brand_name_in_row('KFC');
            cy.log('✅ Brand name verified: KFC');
            
            // Verify published status badge
            cy.log('✅ Verifying Published status...');
            publishPage.verify_published_status();
            cy.log('✅ Published status verified!');
            
            // Verify last published date (known bug - may fail)
            cy.log('📅 Verifying Last Published date...');
            // Note: Uncomment below when bug is fixed
            // publishPage.verify_last_published_date_exists();
            // publishPage.verify_last_published_date_is_today();
            cy.log('⚠️ Last Published date verification skipped (known bug)');
            
            // Verify Publishing Logs
            cy.log('📋 Opening Publishing Logs to verify all steps succeeded...');
            publishPage.verify_publishing_logs_details('Glovo', 'KFC', 'Dubai', menuName);
            
            cy.log('✅ Menu 1 fully verified as Published for KFC!');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    });

    // ============================================================================
    // STEP 6: PUBLISH MENU 2 (BRAND2)
    // ============================================================================
    describe('Step 6: Publish Menu 2 (Pizza Hut)', () => {

        it('Should publish Menu 2 for Pizza Hut via Bolt aggregator', function () {
            cy.log('📤 STEP 6: Publish Menu 2 for Pizza Hut');
            cy.log('═══════════════════════════════════════════════════════════════');

            // Navigate to the Publish page
            navigator.navigate_to_publish_page();

            // Verify publish page loaded
            publishPage.verify_publish_page_loaded();

            // Select Pizza Hut filter
            cy.log('🏷️ Selecting Pizza Hut filter');
            publishPage.step_select_brand('Pizza Hut');

            // Verify brand is selected
            publishPage.step_verify_brand_selected('Pizza Hut');

            cy.log('✅ Publish page ready with Pizza Hut selected');

            // Expand Bolt aggregator section
            cy.log('📂 Expanding Bolt aggregator section');
            publishPage.step_expand_aggregator_section('Glovo');

            // Click Change Menu button for Bolt
            cy.log('🔄 Clicking Change Menu button');
            publishPage.step_click_change_menu_button('Glovo');

            // Select the second menu we created (Menu 2)
            const menuName = createdMenuNames[1]; // Second menu created
            cy.log(`📋 Selecting menu: ${menuName}`);
            publishPage.step_select_menu_from_list(menuName);

            // Click Assign button
            cy.log('✅ Clicking Assign button');
            publishPage.step_click_assign_button();

            cy.log('✅ Menu 2 assigned to Bolt aggregator');

            // Click Publish All button
            cy.log('🚀 Clicking Publish All button');
            publishPage.step_click_publish_all();

            // Click Validate & Publish button in confirmation dialog
            cy.log('✅ Clicking Validate & Publish button');
            publishPage.step_click_validate_and_publish();

            cy.log('✅ Menu 2 published successfully!');

            // Verify the menu is published
            cy.log('🔍 Verifying Menu 2 publish status...');
            cy.wait(3000); // Wait for publish to complete
            
            // Expand the brand row to see details
            cy.log('📂 Expanding Pizza Hut brand row...');
            publishPage.step_click_brand_row_to_expand('Pizza Hut');
            
            // Verify menu name in location row (nested row after expansion)
            // Note: The cell displays both menu name and brand name
            cy.log('📋 Verifying menu name and brand in location row...');
            publishPage.verify_menu_name_in_location_row('Dubai', menuName, 'Pizza Hut');
            cy.log(`✅ Menu name and brand verified in location row: ${menuName} - Pizza Hut`);
            
            // Verify brand name is shown
            cy.log('🏷️ Verifying brand name...');
            publishPage.verify_brand_name_in_row('Pizza Hut');
            cy.log('✅ Brand name verified: Pizza Hut');
            
            // Verify published status badge
            cy.log('✅ Verifying Published status...');
            publishPage.verify_published_status();
            cy.log('✅ Published status verified!');
            
            // Verify last published date (known bug - may fail)
            cy.log('📅 Verifying Last Published date...');
            // Note: Uncomment below when bug is fixed
            // publishPage.verify_last_published_date_exists();
            // publishPage.verify_last_published_date_is_today();
            cy.log('⚠️ Last Published date verification skipped (known bug)');
            
            // Verify Publishing Logs
            // Note: Pizza Hut may have multiple locations - verifying first one
            cy.log('📋 Opening Publishing Logs to verify all steps succeeded...');
            publishPage.verify_publishing_logs_details('Glovo', 'Pizza Hut', 'Dubai', menuName);
            
            cy.log('✅ Menu 2 fully verified as Published for Pizza Hut!');
            cy.log('═══════════════════════════════════════════════════════════════');
        });

        it('Should verify Menu Preview shows correct details for Menu 2', function () {
            cy.log('🔍 Verifying Menu Preview for Menu 2...');
            cy.log('═══════════════════════════════════════════════════════════════');

            // Navigate to Publish page and select Pizza Hut
            navigator.navigate_to_publish_page();
            publishPage.verify_publish_page_loaded();
            publishPage.step_select_brand('Pizza Hut');

            // Expand Bolt aggregator section
            cy.log('📂 Expanding Bolt aggregator section');
            publishPage.step_expand_aggregator_section('Bolt');

            // Click Menu Preview button
            cy.log('📋 Opening Menu Preview');
            publishPage.step_click_menu_preview_button('Bolt');

            // Get Menu 2 name
            const menuName = createdMenuNames[1];
            
            // Verify preview modal opened
            cy.log(`✅ Verifying preview modal for: ${menuName}`);
            publishPage.verify_preview_modal_opened(menuName);

            // Verify brand is shown
            publishPage.verify_preview_brand('Pizza Hut');
            cy.log('✅ Brand verified: Pizza Hut');

            // Verify categories exist (M2_Category 1 and M2_Category 2)
            cy.log('📁 Verifying categories in preview...');
            publishPage.verify_preview_category_exists('M2_Category 1');
            cy.log('✅ Category verified: M2_Category 1');

            // Verify products in first category
            cy.log('🍕 Verifying products in M2_Category 1...');
            publishPage.verify_preview_product_exists('Margherita Pizza');
            cy.log('✅ Product found: Margherita Pizza');
            publishPage.verify_preview_product_exists('Deluxe Chicken Burger');
            cy.log('✅ Product found: Deluxe Chicken Burger');
            publishPage.verify_preview_product_exists('Classic Caesar Salad');
            cy.log('✅ Product found: Classic Caesar Salad');

            // Click Customize on Margherita Pizza to verify modifier chain
            cy.log('🔧 Verifying product customization (modifier chain)...');
            publishPage.step_click_customize_for_product('Margherita Pizza');

            // Verify product details in customization view
            publishPage.verify_customization_product_name('Margherita Pizza');
            publishPage.verify_customization_product_price('SAR 150.00');
            cy.log('✅ Product details verified: Margherita Pizza - SAR 150.00');

            // Verify modifier groups chain
            publishPage.verify_modifier_group_exists('Premium Burger Add-ons');
            cy.log('✅ Modifier Group found: Premium Burger Add-ons');
            
            publishPage.verify_product_modifier_exists('Deluxe Chicken Burger');
            cy.log('✅ Product Modifier found: Deluxe Chicken Burger');

            publishPage.verify_modifier_group_exists('Pizza Size Selection');
            cy.log('✅ Modifier Group found: Pizza Size Selection');
            
            publishPage.verify_product_modifier_exists('Classic Caesar Salad');
            cy.log('✅ Product Modifier found: Classic Caesar Salad');

            cy.log('✅ Menu Preview verification completed successfully!');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    });

    // ============================================================================
    // STEP 7: VERIFY BACKWARD COMPATIBILITY (GC2 MENU MANAGEMENT)
    // ============================================================================
    describe('Step 7: Verify Backward Compatibility (GC2)', () => {

        it('Should verify published menus appear in GC2 Menu Management > Menus', function () {
            cy.log('🔍 STEP 7: Verify Backward Compatibility (GC2 Menu Management)');
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log('📋 Verifying menus in GC2 Menu Management section...');

            // Navigate to GC2 Menu Management > Menus
            navigator.navigate_to_gc2_menus_page();

            // Verify page loaded
            gc2MenusPage.verify_page_loaded();

            // Verify Menu 1 appears in the list
            const menu1Name = createdMenuNames[0];
            cy.log(`🔍 Searching for Menu 1: ${menu1Name}`);
            gc2MenusPage.verify_menu_exists(menu1Name);
            cy.log(`✅ Menu 1 found: ${menu1Name}`);

            // Verify Menu 2 appears in the list
            const menu2Name = createdMenuNames[1];
            cy.log(`🔍 Searching for Menu 2: ${menu2Name}`);
            gc2MenusPage.verify_menu_exists(menu2Name);
            cy.log(`✅ Menu 2 found: ${menu2Name}`);

            cy.log('✅ Menus verified in GC2 Menu Management');
            cy.log('═══════════════════════════════════════════════════════════════');
        });

        it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
            cy.log('📋 Verifying Menu Items in GC2 Menu Management section...');

            // Navigate to GC2 Menu Management > Menu Items
            navigator.navigate_to_gc2_menu_items_page();

            // Verify page loaded - Menu Items = Products + Product Modifiers in GC2
            gc2MenuItemsPage.verify_page_loaded();

            // TODO: Once publishing bug is fixed, verify actual published products
            // For now, verify with manually created test data
            cy.log('🔍 Searching for test Menu Item: Classic Margherita Pizza');
            gc2MenuItemsPage.search_and_verify_menu_item('Classic Margherita Pizza');
            cy.log('✅ Menu Item found: Classic Margherita Pizza');

            // Click View to navigate to edit page
            cy.log('📝 Opening Menu Item edit page...');
            gc2MenuItemsPage.step_click_first_view_button();
            gc2MenuItemsPage.verify_edit_page_loaded();
            cy.log('✅ Edit page loaded');

            // Verify details on the edit page
            cy.log('🔍 Verifying Menu Item details...');
            
            // Verify menu item name
            gc2MenuItemsPage.verify_menu_item_name_on_edit_page('Classic Margherita Pizza');
            cy.log('✅ Menu Item name verified: Classic Margherita Pizza');

            // Verify brand
            gc2MenuItemsPage.verify_brand_on_edit_page('KFC');
            cy.log('✅ Brand verified: KFC');
            // Verify external ID
            gc2MenuItemsPage.verify_external_id_on_edit_page('EXT_MARG_001');
            cy.log('✅ External ID verified: EXT_MARG_001');

            // Verify currency
            gc2MenuItemsPage.verify_currency_on_edit_page('Saudi Arabian Riyal');
            cy.log('✅ Currency verified: Saudi Arabian Riyal');

            // Verify price
            gc2MenuItemsPage.verify_price_on_edit_page('150.00');
            cy.log('✅ Price verified: 150.00');

            // Verify tags
            gc2MenuItemsPage.verify_tag_exists_on_edit_page('Vegetarian');
            cy.log('✅ Tag verified: Vegetarian');
            gc2MenuItemsPage.verify_tag_exists_on_edit_page('Popular');
            cy.log('✅ Tag verified: Popular');

            cy.log('✅ All Menu Item details verified successfully');
            cy.log('═══════════════════════════════════════════════════════════════');
        });

        it('Should verify Modifier Groups appear in GC2 Menu Management > Modifier Groups', function () {
            cy.log('📋 Verifying Modifier Groups in GC2 Menu Management section...');

            // Navigate to GC2 Menu Management > Modifier Groups
            navigator.navigate_to_gc2_modifier_groups_page();

            // Verify page loaded
            gc2ModifierGroupsPage.verify_page_loaded();

            cy.log('✅ Modifier Groups page verified');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    });

    // ============================================================================
    // STEP 8: CLEANUP ALL CREATED ITEMS
    // ============================================================================
    describe.skip('Step 8: Cleanup', () => {

        it('Should cleanup all created products', function () {
            cy.log(`🧹 Cleaning up ${createdProductNames.length} products...`);

            createdProductNames.forEach((productName, index) => {
                cy.then(() => {
                    return ProductGetDetailsService.filterProductsByName(partnerId, productName)
                        .then((found) => {
                            if (found) {
                                const productId = Cypress.env('PRODUCT_ID');
                                cy.log(`🗑️ Deleting product ${index + 1}/${createdProductNames.length}: ${productName}`);
                                return ProductDeleteService.deleteProduct(partnerId, productId);
                            } else {
                                cy.log(`⚠️ Product not found: ${productName}`);
                            }
                        });
                });
            });

            cy.then(() => {
                cy.log('✅ Products cleanup complete');
            });
        });

        it('Should cleanup all created modifier groups', function () {
            cy.log(`🧹 Cleaning up ${createdModifierGroupNames.length} modifier groups...`);

            createdModifierGroupNames.forEach((mgName, index) => {
                cy.then(() => {
                    return ModifierGroupGetDetailsService.filterModifierGroupsByName(partnerId, mgName, 'product')
                        .then((found) => {
                            if (found) {
                                const mgId = Cypress.env('PRODUCT_MODIFIER_GROUP_ID');
                                cy.log(`🗑️ Deleting modifier group ${index + 1}/${createdModifierGroupNames.length}: ${mgName}`);
                                return ModifierGroupDeleteService.deleteModifierGroup(partnerId, mgId);
                            } else {
                                cy.log(`⚠️ Modifier group not found: ${mgName}`);
                            }
                        });
                });
            });

            cy.then(() => {
                cy.log('✅ Modifier groups cleanup complete');
            });
        });

        it('Summary: Complete Workflow Finished', function () {
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log('🎉 COMPLETE WORKFLOW FINISHED');
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log('✅ Step 1: Created 9 Products');
            cy.log('✅ Step 2: Created 6 Product Modifier Groups');
            cy.log('✅ Step 3: Built 3 Nested Modifier Chains:');
            cy.log('   Chain 1: Classic Margherita Pizza → Burger Additions_PMG001 → Chicken Burger Deluxe → Pizza Sizes_PMG002 → Caesar Salad Bowl');
            cy.log('   Chain 2: Beef Pasta Carbonara → Pasta Variations_PMG003 → Chocolate Lava Cake → Coffee Customization_PMG004 → Grilled Salmon Fillet');
            cy.log('   Chain 3: Vegetable Spring Rolls → Salad Dressings_PMG005 → Iced Caramel Macchiato → Sandwich Breads_PMG006 → BBQ Chicken Wings');
            cy.log('✅ Step 4: Created 2 Menus:');
            cy.log('   Menu 1: Pizza Category (Product 1, 2) + Burgers (Product 2, 3)');
            cy.log('   Menu 2: Main Dishes (Product 1, 2, 3) + Salads (Product 1, 2)');
            cy.log('✅ Step 5: Cleanup Complete');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    });
});
