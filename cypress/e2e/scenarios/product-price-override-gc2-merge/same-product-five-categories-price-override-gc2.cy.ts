/**
 * Scenario: Menu with same product in 5 categories; change price one by one then revert one by one.
 * GC2 product count increases 1-by-1 as we give each category a different price, then decreases
 * 1-by-1 as we revert each category back to the original price.
 *
 * Structure: Menu -> Category 1..5 -> same Product 1 -> Modifier Group 1 -> Product Modifier 1
 *
 * Phase 1: First publish → 1 product in GC2. Change price in Category 1 → publish → 2 products.
 *          Change price in Category 2 → publish → 3 products. ... Category 5 → 5 products.
 * Phase 2: Revert Category 5 to original → publish → 4 products. Revert Category 4 → 3 products.
 *          Revert Category 3 → 2 products. Revert Category 2 → 1 product. (Revert Category 1 → 1 product.)
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
const CATEGORY_COUNT = 5;
// Different price per category so GC2 creates one product variant per distinct price
const OVERRIDE_PRICES = ['999.00', '888.00', '777.00', '666.00', '555.00'];

function getCategoryName(categoryIndex: number, menuTimestamp: string): string {
    return `M1_Category ${categoryIndex}_${menuTimestamp}`;
}

function editCategoryProductPriceAndSave(
    menuName: string,
    categoryIndex: number,
    newPrice: string
) {
    const menuTimestamp = menuName.split('_').pop();
    const categoryName = getCategoryName(categoryIndex, menuTimestamp as string);

    navigator.navigate_to_menu_page();
    cy.wait(2000);
    menuHome.step_search_menu(menuName);
    menuHome.step_click_edit_menu();
    cy.wait(2000);
    menuPage.step_click_category_products_tab();
    cy.wait(2000);
    menuPage.step_edit_product_price_in_category(categoryName, PRODUCT_DISPLAY_NAME, newPrice);
    menuPage.step_click_update_menu_button();
    menuHome.verify_toast_message('Menu updated successfully');
}

describe('Same product in 5 categories: change price one by one, GC2 count up then down', () => {

    after('Should cleanup all created products, modifier groups and menus', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(3);
        cleanup.cleanup_modifier_group(2);
        gc2CleanupMethods.cleanup_menu_item(3);
        gc2CleanupMethods.cleanup_menu(1);
        gc2CleanupMethods.cleanup_modifier_group(2);
    });

    it('Should create 3 products (for chain: 1 root + 2 in modifier levels)', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_create_with_mandatory_fields(3);
    });

    it('Should create 2 Product Modifier Groups', function () {
        navigator.navigate_to_modifier_group_page();
        modifierGroupMiddleLayer.modifier_group_bulk_create(2);
    });

    it('Should build 1 nested modifier chain', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit(1, 3, 2);
    });

    it('Should create 1 menu with 5 categories and 1 product each (reuse same product)', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, CATEGORY_COUNT, 1, true);
    });

    it('Should publish the menu (first time)', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: only 1 product and 1 modifier group', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
        gc2MiddleLayer.gc2_modifier_groups_page_verify(1);
    });

    // Phase 1: Change price in each category one by one; product count in GC2 increases 1 by 1
    it('Should change price in Category 1, publish, and verify GC2 has 2 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 1, OVERRIDE_PRICES[0]);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 2);
    });

    it('Should change price in Category 2, publish, and verify GC2 has 3 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 2, OVERRIDE_PRICES[1]);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 3);
    });

    it('Should change price in Category 3, publish, and verify GC2 has 4 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 3, OVERRIDE_PRICES[2]);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 4);
    });

    it('Should change price in Category 4, publish, and verify GC2 has 5 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 4, OVERRIDE_PRICES[3]);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 5);
    });

    it('Should change price in Category 5, publish, and verify GC2 has 5 products (all different prices)', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 5, OVERRIDE_PRICES[4]);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 5);
    });

    // Phase 2: Revert each category to original price one by one; product count in GC2 decreases 1 by 1
    it('Should revert Category 5 to original price, publish, and verify GC2 has 4 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 5, ORIGINAL_PRICE);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 4);
    });

    it('Should revert Category 4 to original price, publish, and verify GC2 has 3 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 4, ORIGINAL_PRICE);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 3);
    });

    it('Should revert Category 3 to original price, publish, and verify GC2 has 2 products', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 3, ORIGINAL_PRICE);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 2);
    });

    it('Should revert Category 2 to original price, publish, and verify GC2 has 1 product', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 2, ORIGINAL_PRICE);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
    });

    it('Should revert Category 1 to original price, publish, and verify GC2 still has 1 product', function () {
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            const menuName = data.menuNames[0];
            editCategoryProductPriceAndSave(menuName, 1, ORIGINAL_PRICE);
        });
        menuPublishLayer.menu_publish();
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
    });
});
