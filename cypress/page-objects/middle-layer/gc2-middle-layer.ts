import { GC2MenusPage } from "cypress/page-objects/pages/gc2/gc2-menus-page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { GC2MenuItemsPage } from "../pages/gc2/gc2-menu-items-page";



const navigator = new PageNavigator();
const gc2MenusPage = new GC2MenusPage();
const gc2MenuItemsPage = new GC2MenuItemsPage();




export class GC2MiddleLayer {

    public gc2_menus_page() {
        cy.log('🔍 STEP 7: Verify Backward Compatibility (GC2 Menu Management)');
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log('📋 Verifying menus in GC2 Menu Management section...');

        // Read menu names from generated file
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            if (!data || !data.menuNames || data.menuNames.length === 0) {
                throw new Error('No menu names found in generated file. Please create menus first.');
            }

            // Navigate to GC2 Menu Management > Menus
            navigator.navigate_to_gc2_menus_page();

            // Verify page loaded
            gc2MenusPage.verify_page_loaded();

            // Verify Menu 1 appears in the list
            const menu1Name = data.menuNames[0];
            cy.log(`🔍 Searching for Menu 1: ${menu1Name}`);
            gc2MenusPage.verify_menu_exists(menu1Name);
            cy.log(`✅ Menu 1 found: ${menu1Name}`);

            // Verify Menu 2 appears in the list if it exists
            if (data.menuNames.length > 1) {
                const menu2Name = data.menuNames[1];
                cy.log(`🔍 Searching for Menu 2: ${menu2Name}`);
                gc2MenusPage.verify_menu_exists(menu2Name);
                cy.log(`✅ Menu 2 found: ${menu2Name}`);
            }

            gc2MenusPage.step_click_view_button_for_menu(menu1Name);
            gc2MenusPage.step_click_save_button_for_menu();

            cy.log('✅ Menus verified in GC2 Menu Management');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    }

    public gc2_menu_items_page() {

        cy.log('📋 Verifying Menu Items in GC2 Menu Management section...');

        // Navigate to GC2 Menu Management > Menu Items
        navigator.navigate_to_gc2_menu_items_page();

        // Verify page loaded - Menu Items = Products + Product Modifiers in GC2
        gc2MenuItemsPage.verify_page_loaded();

        // TODO: Once publishing bug is fixed, verify actual published products
        // For now, verify with manually created test data
        cy.log('🔍 Searching for test Menu Item: Margherita Pizza');
        gc2MenuItemsPage.search_and_verify_menu_item('Margherita Pizza');
        cy.log('✅ Menu Item found: Margherita Pizza');

        // Click View to navigate to edit page
        cy.log('📝 Opening Menu Item edit page...');
        gc2MenuItemsPage.step_click_first_view_button();
        gc2MenuItemsPage.verify_edit_page_loaded();
        cy.log('✅ Edit page loaded');

        // Verify details on the edit page
        cy.log('🔍 Verifying Menu Item details...');

        // Verify menu item name
        gc2MenuItemsPage.verify_menu_item_name_on_edit_page('Margherita Pizza');
        cy.log('✅ Menu Item name verified: Margherita Pizza');

        // Verify brand
        gc2MenuItemsPage.verify_brand_on_edit_page('KFC');
        cy.log('✅ Brand verified: KFC');
        // Verify external ID
        gc2MenuItemsPage.verify_external_id_on_edit_page('EXT_MARG_001');
        cy.log('✅ External ID verified: EXT_MARG_001');

        // Verify currency
        gc2MenuItemsPage.verify_currency_on_edit_page('AED - United Arab Emirates Dirham');
        cy.log('✅ Currency verified: AED - United Arab Emirates Dirham');

        // Verify price
        gc2MenuItemsPage.verify_price_on_edit_page('150.00');
        cy.log('✅ Price verified: 150.00');

        // Verify tags
        gc2MenuItemsPage.verify_tag_exists_on_edit_page('Vegetarian');
        cy.log('✅ Tag verified: Vegetarian');
        // gc2MenuItemsPage.verify_tag_exists_on_edit_page('Popular');
        // cy.log('✅ Tag verified: Popular');

        cy.log('✅ All Menu Item details verified successfully');
        cy.log('═══════════════════════════════════════════════════════════════');
    }

    public gc2_menu_items_page_with_mandatory_fields_validation() {

        cy.log('📋 Verifying Menu Items in GC2 Menu Management section...');
        gc2MenuItemsPage.verify_page_loaded();
        cy.log('🔍 Searching for test Menu Item: Margherita Pizza');
        gc2MenuItemsPage.search_and_verify_menu_item('Margherita Pizza');
        cy.log('✅ Menu Item found: Margherita Pizza');
        cy.log('📝 Opening Menu Item edit page...');
        gc2MenuItemsPage.step_click_first_view_button();
        gc2MenuItemsPage.verify_edit_page_loaded();
        cy.log('✅ Edit page loaded');
        cy.log('🔍 Verifying Menu Item details...');
        gc2MenuItemsPage.verify_menu_item_name_on_edit_page('Margherita Pizza');
        cy.log('✅ Menu Item name verified: Margherita Pizza');

        // Verify brand
        gc2MenuItemsPage.verify_brand_on_edit_page('KFC');
        cy.log('✅ Brand verified: KFC');
        gc2MenuItemsPage.verify_currency_on_edit_page('AED - United Arab Emirates Dirham');
        cy.log('✅ Currency verified: AED - United Arab Emirates Dirham');
        gc2MenuItemsPage.verify_price_on_edit_page('150.00');
        cy.log('✅ Price verified: 150.00');
        cy.get('#submit').click({ force: true });
        cy.log('✅ All Menu Item details verified successfully');
        cy.log('═══════════════════════════════════════════════════════════════');
    }

    public gc2_menu_items_table_verification(count?: number) {
        cy.log('📋 Verifying Menu Items in GC2 Menu Management section...');
        navigator.navigate_to_gc2_menu_items_page();
        gc2MenuItemsPage.verify_page_loaded();
        cy.fixture('bulk_products').then((bulkData) => {
            let products = bulkData.products;
            if (count !== undefined) {
                products = products.slice(0, count);
            }

            cy.log(`🔍 Verifying ${products.length} menu items from fixture...`);

            // Process products sequentially - verify each one
            cy.wrap(products).each((product: any, index: number) => {
                const menuItemName = product.displayName; // Use displayName (what appears in GC2)
                cy.log(`🔍 Verifying menu item ${index + 1}/${products.length}: ${menuItemName}`);

                gc2MenuItemsPage.search_and_verify_menu_item(menuItemName);
                cy.log(`✅ Menu Item ${index + 1} found: ${menuItemName}`);

                // Clear search before next iteration
                if (index < products.length - 1) {
                    gc2MenuItemsPage.step_clear_search();
                    gc2MenuItemsPage.step_click_first_view_button()
                    cy.wait(9000);
                    cy.get('#submit').click({ force: true });
                    cy.wait(2000);
                }
            }).then(() => {
                cy.log('✅ All menu items verified successfully');
                cy.log('═══════════════════════════════════════════════════════════════');
            });

        });
    }
}