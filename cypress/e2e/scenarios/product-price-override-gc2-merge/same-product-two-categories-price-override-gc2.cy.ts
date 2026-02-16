/**
 * Scenario: Menu with same product in two categories, price override in one category, GC2 merge/dedupe.
 *
 * Structure: Menu -> Category 1 -> Product 1 -> Modifier Group 1 -> Product Modifier 1
 *                     Category 2 -> Product 1 -> Modifier Group 1 -> Product Modifier 1
 *
 * 1. Publish → GC2 shows 1 product, 1 modifier group (same product deduped).
 * 2. Edit price of Category 2 -> Product 1 in GC3, publish → GC2 shows 2 products (same name, different prices).
 * 3. Revert Category 2 -> Product 1 price to original, publish → GC2 shows 1 product again (price-different product removed).
 */
import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { MenuPublishLayer } from "cypress/page-objects/middle-layer/menu-publish-layer";
import { GC2MiddleLayer } from "cypress/page-objects/middle-layer/gc2-middle-layer";
import { GC2CleanupMethods } from "cypress/page-objects/pages/cleanup/gc2_cleanup_method";
import { Sample } from "cypress/page-objects/middle-layer/sample";
import { ModifierGroupMiddleLayer } from "cypress/page-objects/middle-layer/modifier-group-middle-layer";
import { MenuHomePage } from "cypress/page-objects/pages/menu/menu-home-page";
import { MenuPage } from "cypress/page-objects/pages/menu/menu-page";

const modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();
const sample = new Sample();
const productMiddleLayer = new ProductMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();
const menuPublishLayer = new MenuPublishLayer();
const gc2MiddleLayer = new GC2MiddleLayer();
const gc2CleanupMethods = new GC2CleanupMethods();
const menuHome = new MenuHomePage();
const menuPage = new MenuPage();

const PRODUCT_DISPLAY_NAME = 'Margherita Pizza';
const ORIGINAL_PRICE = '150.00';
const OVERRIDE_PRICE = '999.00';

describe('Same product in 2 categories: price override in GC3, GC2 merge/dedupe', () => {

    after('Should cleanup all created products, modifier groups and menus', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(3);
        cleanup.cleanup_modifier_group(2);
        gc2CleanupMethods.cleanup_menu_item(3);
        gc2CleanupMethods.cleanup_menu(1);
        gc2CleanupMethods.cleanup_modifier_group(2);
        cleanup.cleanup_hierarchy_mapping_clearance();
    });

    it('Should create 3 products (for chain: 1 root + 2 in modifier levels)', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_create_with_mandatory_fields(3);
    });

    it('Should create 2 Product Modifier Groups', function () {
        navigator.navigate_to_modifier_group_page();
        modifierGroupMiddleLayer.modifier_group_bulk_create(2);
    });

    it('Should build 1 nested modifier chain (Product 1 -> MG1 -> Product Modifier 1 -> MG2 -> ...)', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit(1, 3, 2);
    });

    it('Should create 1 menu with 2 categories and 1 product each (reuse same product)', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, 2, 1, true);
    });

    it('Should publish the menu', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: only 1 product and 1 modifier group', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
        gc2MiddleLayer.gc2_modifier_groups_page_verify(1);
    });

    it('Should edit price of Category 2 -> Product 1 in GC3 and save menu', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            const menuTimestamp = menuName.split('_').pop();
            const category2Name = `M1_Category 2_${menuTimestamp}`;

            navigator.navigate_to_menu_page();
            cy.wait(2000);
            menuHome.step_search_menu(menuName);
            menuHome.step_click_edit_menu();
            cy.wait(2000);
            menuPage.step_click_category_products_tab();
            cy.wait(2000);
            menuPage.step_edit_product_price_in_category(category2Name, PRODUCT_DISPLAY_NAME, OVERRIDE_PRICE);
            menuPage.step_click_update_menu_button();
            menuHome.verify_toast_message('Menu updated successfully');
        });
    });

    it('Should publish the menu again', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: 2 products with same name and different prices (150 and 999)', function () {
        gc2MiddleLayer.gc2_verify_two_menu_items_same_name_different_prices(
            PRODUCT_DISPLAY_NAME,
            ORIGINAL_PRICE,
            OVERRIDE_PRICE
        );
    });

    it('Should revert price of Category 2 -> Product 1 to original in GC3 and save menu', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            const menuTimestamp = menuName.split('_').pop();
            const category2Name = `M1_Category 2_${menuTimestamp}`;

            navigator.navigate_to_menu_page();
            cy.wait(2000);
            menuHome.step_search_menu(menuName);
            menuHome.step_click_edit_menu();
            cy.wait(2000);
            menuPage.step_click_category_products_tab();
            cy.wait(2000);
            menuPage.step_edit_product_price_in_category(category2Name, PRODUCT_DISPLAY_NAME, ORIGINAL_PRICE);
            menuPage.step_click_update_menu_button();
            menuHome.verify_toast_message('Menu updated successfully');
        });
    });

    it('Should publish the menu again', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: only 1 product again (price-different product removed)', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
    });
});
