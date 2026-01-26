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


export class MenuMiddleLayer {
    public menu_bulk_create(count?: number, categoriesCount?: number, productsCount?: number) {
        // Generate unique timestamp for this test run
        const menuTimestamp = Date.now();

        // Menu configurations with brand assignments
        // 2 categories per menu - Category names include M1/M2 prefix to avoid duplicates
        let menuConfigs = [
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

        // Limit menuConfigs to count if provided
        if (count !== undefined) {
            menuConfigs = menuConfigs.slice(0, count);
        }

        // Limit categories per menu if categoriesCount is provided
        if (categoriesCount !== undefined) {
            menuConfigs = menuConfigs.map(menu => ({
                ...menu,
                categories: menu.categories.slice(0, categoriesCount)
            }));
        }

        // Extract menu names and save to file (overwrite previous file)
        const menuNamesArray = menuConfigs.map(menu => menu.name);

        // Save menu names to file - this will override previous file if it exists
        cy.writeFile('cypress/fixtures/generated_menu_names.json', {
            menuNames: menuNamesArray,
            timestamp: menuTimestamp,
            count: menuNamesArray.length
        });

        cy.log(`💾 Saved ${menuNamesArray.length} menu name(s) to file: ${menuNamesArray.join(', ')}`);

        // Navigate to menu page once
        navigator.navigate_to_menu_page();
        cy.wait(2000);

        cy.log(`📋 STEP 4: Creating ${menuConfigs.length} menus`);
        cy.log('═══════════════════════════════════════════════════════════════');

        // Execute menu creation directly (not as test cases)
        menuConfigs.forEach((menu, menuIndex) => {
            cy.log(`📋 Creating Menu ${menuIndex + 1} of ${menuConfigs.length}: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');

            // Store menu name for cleanup
            createdMenuNames.push(menu.name);

            // Click Create New Menu
            menuHome.step_click_create_new_menu_button();

            // ====== OVERVIEW TAB ======
            menuPage.step_enter_overview_name(menu.name);

            // Select brand
            menuPage.step_click_overview_brand_select();
            cy.contains(menu.brandName).click();

            menuPage.step_enter_overview_description(menu.description);
            menuPage.step_enter_overview_external_id(menu.externalId);

            // Select currency (SAR)
            menuPage.step_select_currency_dropdown();
            cy.contains('AED - United Arab Emirates Dirham').click();

            // ====== TAX MANAGER ======
            menuPage.step_click_tax_manager_custom_tax_checkbox();
            menuPage.step_click_tax_manager_custom_tax_input();
            menuPage.step_create_new_tax('VAT', '5');
            // menuPage.step_click_tax_manager_add_button();

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

                // Limit products if productsCount is provided
                const productsToAdd = productsCount !== undefined
                    ? category.products.slice(0, productsCount)
                    : category.products;

                // Add products to the category ONE BY ONE
                cy.log(`➕ Adding ${productsToAdd.length} products to ${category.name}`);

                productsToAdd.forEach((product, productIndex) => {
                    cy.log(`   ➕ Adding product ${productIndex + 1}: ${product.name} (Display: ${product.displayName})`);

                    // Click "Add Products" button - target the specific category
                    menuPage.step_click_add_products_for_category(category.name);

                    // Search and select the product - pass both name and displayName for validation
                    menuPage.step_search_and_select_product(product.name, product.displayName);

                    // Save - this adds the single product and closes modal
                    menuPage.step_click_add_products_save();
                    cy.wait(1000);
                });

                cy.log(`✅ Category ${catIndex + 1} complete: ${category.name} with ${productsToAdd.length} products`);
            });

            // ====== CREATE MENU ======
            menuPage.step_click_create_button();

            // Verify success toast
            menuHome.verify_toast_message('Menu created successfully');

            cy.log(`✅ Menu ${menuIndex + 1} created: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.wait(2000);
        });

        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log(`✅ STEP 4 COMPLETE: Created ${menuConfigs.length} menus`);
    }

    public menu_create_with_mandatory_fields(count?: number, categoriesCount?: number, productsCount?: number) {
        // Generate unique timestamp for this test run
        const menuTimestamp = Date.now();

        // Menu configurations with brand assignments
        // 2 categories per menu - Category names include M1/M2 prefix to avoid duplicates
        let menuConfigs = [
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

        // Limit menuConfigs to count if provided
        if (count !== undefined) {
            menuConfigs = menuConfigs.slice(0, count);
        }

        // Limit categories per menu if categoriesCount is provided
        if (categoriesCount !== undefined) {
            menuConfigs = menuConfigs.map(menu => ({
                ...menu,
                categories: menu.categories.slice(0, categoriesCount)
            }));
        }

        // Extract menu names and save to file (overwrite previous file)
        const menuNamesArray = menuConfigs.map(menu => menu.name);

        // Save menu names to file - this will override previous file if it exists
        cy.writeFile('cypress/fixtures/generated_menu_names.json', {
            menuNames: menuNamesArray,
            timestamp: menuTimestamp,
            count: menuNamesArray.length
        });

        cy.log(`💾 Saved ${menuNamesArray.length} menu name(s) to file: ${menuNamesArray.join(', ')}`);

        // Navigate to menu page once
        //navigator.navigate_to_menu_page();
        cy.wait(2000);

        cy.log(`📋 STEP 4: Creating ${menuConfigs.length} menus`);
        cy.log('═══════════════════════════════════════════════════════════════');

        // Execute menu creation directly (not as test cases)
        menuConfigs.forEach((menu, menuIndex) => {
            cy.log(`📋 Creating Menu ${menuIndex + 1} of ${menuConfigs.length}: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');

            // Store menu name for cleanup
            createdMenuNames.push(menu.name);

            // Click Create New Menu
            menuHome.step_click_create_new_menu_button();

            // ====== OVERVIEW TAB ======
            menuPage.step_enter_overview_name(menu.name);

            // Select brand
            menuPage.step_click_overview_brand_select();
            cy.contains(menu.brandName).click();

            // Select currency (SAR)
            menuPage.step_select_currency_dropdown();
            cy.contains('AED - United Arab Emirates Dirham').click();

            // ====== TAX MANAGER ======
            menuPage.step_click_tax_manager_custom_tax_checkbox();
            menuPage.step_click_tax_manager_custom_tax_input();
            menuPage.step_create_new_tax('VAT', '5');
            // menuPage.step_click_tax_manager_add_button();

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

                // Limit products if productsCount is provided
                const productsToAdd = productsCount !== undefined
                    ? category.products.slice(0, productsCount)
                    : category.products;

                // Add products to the category ONE BY ONE
                cy.log(`➕ Adding ${productsToAdd.length} products to ${category.name}`);

                productsToAdd.forEach((product, productIndex) => {
                    cy.log(`   ➕ Adding product ${productIndex + 1}: ${product.name} (Display: ${product.displayName})`);

                    // Click "Add Products" button - target the specific category
                    menuPage.step_click_add_products_for_category(category.name);

                    // Search and select the product - pass both name and displayName for validation
                    menuPage.step_search_and_select_product(product.name, product.displayName);

                    // Save - this adds the single product and closes modal
                    menuPage.step_click_add_products_save();
                    cy.wait(1000);
                });

                cy.log(`✅ Category ${catIndex + 1} complete: ${category.name} with ${productsToAdd.length} products`);
            });

            // ====== CREATE MENU ======
            menuPage.step_click_create_button();

            // Verify success toast
            menuHome.verify_toast_message('Menu created successfully');

            cy.log(`✅ Menu ${menuIndex + 1} created: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.wait(2000);
        });

        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log(`✅ STEP 4 COMPLETE: Created ${menuConfigs.length} menus`);
    }


    public logic(count?: number, categoriesCount?: number, productsCount?: number) {
        // Generate unique timestamp for this test run
        const menuTimestamp = Date.now();

        // Menu configurations with brand assignments
        // 2 categories per menu - Category names include M1/M2 prefix to avoid duplicates
        let menuConfigs = [
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

        // Limit menuConfigs to count if provided
        if (count !== undefined) {
            menuConfigs = menuConfigs.slice(0, count);
        }

        // Limit categories per menu if categoriesCount is provided
        if (categoriesCount !== undefined) {
            menuConfigs = menuConfigs.map(menu => ({
                ...menu,
                categories: menu.categories.slice(0, categoriesCount)
            }));
        }

        // Extract menu names and save to file (overwrite previous file)
        const menuNamesArray = menuConfigs.map(menu => menu.name);

        // Save menu names to file - this will override previous file if it exists
        cy.writeFile('cypress/fixtures/generated_menu_names.json', {
            menuNames: menuNamesArray,
            timestamp: menuTimestamp,
            count: menuNamesArray.length
        });

        cy.log(`💾 Saved ${menuNamesArray.length} menu name(s) to file: ${menuNamesArray.join(', ')}`);

        // Navigate to menu page once
        //navigator.navigate_to_menu_page();
        cy.wait(2000);

        cy.log(`📋 STEP 4: Creating ${menuConfigs.length} menus`);
        cy.log('═══════════════════════════════════════════════════════════════');

        // Execute menu creation directly (not as test cases)
        menuConfigs.forEach((menu, menuIndex) => {
            cy.log(`📋 Creating Menu ${menuIndex + 1} of ${menuConfigs.length}: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');

            // Store menu name for cleanup
            createdMenuNames.push(menu.name);

            // Click Create New Menu
            menuHome.step_click_create_new_menu_button();

            // ====== OVERVIEW TAB ======
            menuPage.step_enter_overview_name(menu.name);

            // Select brand
            menuPage.step_click_overview_brand_select();
            cy.contains(menu.brandName).click();

            // Select currency (SAR)
            menuPage.step_select_currency_dropdown();
            cy.contains('AED - United Arab Emirates Dirham').click();

            // ====== TAX MANAGER ======
            menuPage.step_click_tax_manager_custom_tax_checkbox();
            menuPage.step_click_tax_manager_custom_tax_input();
            menuPage.step_create_new_tax('VAT', '5');
            // menuPage.step_click_tax_manager_add_button();

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

                // Limit products if productsCount is provided
                const productsToAdd = productsCount !== undefined
                    ? category.products.slice(0, productsCount)
                    : category.products;

                // Add products to the category ONE BY ONE
                cy.log(`➕ Adding ${productsToAdd.length} products to ${category.name}`);

                productsToAdd.forEach((product, productIndex) => {
                    cy.log(`   ➕ Adding product ${productIndex + 1}: ${product.name} (Display: ${product.displayName})`);

                    // Click "Add Products" button - target the specific category
                    menuPage.step_click_add_products_for_category(category.name);

                    // Search and select the product - pass both name and displayName for validation
                    menuPage.step_search_and_select_product(product.name, product.displayName);

                    // Save - this adds the single product and closes modal
                    menuPage.step_click_add_products_save();
                    cy.wait(1000);
                });

                cy.log(`✅ Category ${catIndex + 1} complete: ${category.name} with ${productsToAdd.length} products`);
            });

            // ====== CREATE MENU ======
            menuPage.step_click_create_button();

            // Verify success toast
            menuHome.verify_toast_message('Menu created successfully');

            cy.log(`✅ Menu ${menuIndex + 1} created: ${menu.name}`);
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.wait(2000);
        });

        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log(`✅ STEP 4 COMPLETE: Created ${menuConfigs.length} menus`);
    }
}

