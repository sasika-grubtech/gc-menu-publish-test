import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { MenuPublishLayer } from "cypress/page-objects/middle-layer/menu-publish-layer";
import { GC2MiddleLayer } from "cypress/page-objects/middle-layer/gc2-middle-layer";
import { GC2CleanupMethods } from "cypress/page-objects/pages/cleanup/gc2_cleanup_method";
import { Sample } from "cypress/page-objects/middle-layer/sample";
import { ModifierGroupMiddleLayer } from "cypress/page-objects/middle-layer/modifier-group-middle-layer";

const modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();
const sample = new Sample();
const productMiddleLayer = new ProductMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();
const menuPublishLayer = new MenuPublishLayer();
const gc2MiddleLayer = new GC2MiddleLayer();
const gc2CleanupMethods = new GC2CleanupMethods();

// Same hierarchy as 4-products-2-category-2-reusing-modifier-multi-location, but nested chain
// uses Beef Pasta Carbonara (Carbonara Pasta) at the deepest level instead of Classic Caesar Salad
const LOCATIONS = ['Dubai', 'Colombo'];

// From bulk_products.json: Beef Pasta Carbonara has name "Beef Pasta Carbonara", displayName "Carbonara Pasta"
const LEVEL2_PRODUCT_NAME = 'Beef Pasta Carbonara';
const LEVEL2_PRODUCT_DISPLAY_NAME = 'Carbonara Pasta';

describe('4 products, 2 categories, modifier reuse (Beef Pasta chain), 1 menu to multiple locations', () => {

    after('Should cleanup all created products, modifier groups and menus', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(4);
        cleanup.cleanup_modifier_group(2);
        gc2CleanupMethods.cleanup_menu_item(9);
        gc2CleanupMethods.cleanup_menu(1);
        gc2CleanupMethods.cleanup_modifier_group(2);
    });

    it('Should create all 4 products with all fields filled', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_create_with_mandatory_fields(4);
    });

    it('Should create 2 Product Modifier Groups', function () {
        navigator.navigate_to_modifier_group_page();
        modifierGroupMiddleLayer.modifier_group_bulk_create(2);
    });

    it('Should build Nested Modifier Chain with Beef Pasta Carbonara at deepest level', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit_chain_with_level2_product(
            LEVEL2_PRODUCT_NAME,
            LEVEL2_PRODUCT_DISPLAY_NAME
        );
    });

    it('Should create 1 menu with 2 category and 2 product', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, 2, 3, true);
    });

    it('Should publish the menu to multiple locations and verify each', function () {
        menuPublishLayer.menu_publish_to_multiple_locations(LOCATIONS, 'KFC');
    });

    it('Should verify 2 menus are published in GC2 Menu Management > Menus (one per location)', function () {
        gc2MiddleLayer.gc2_menus_page_verify_menu_per_location(LOCATIONS.length, {
            locations: LOCATIONS,
            brandName: 'KFC',
        });
    });

    it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
        navigator.navigate_to_gc2_menu_items_page();
        gc2MiddleLayer.gc2_menu_items_table_verification(3);
    });

    it('Should verify Modifier Groups appear in GC2 Menu Management > Modifier Groups', function () {
        gc2MiddleLayer.gc2_modifier_groups_page_verify(2);
    });
});
