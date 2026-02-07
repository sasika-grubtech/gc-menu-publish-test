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

// Glovo: brand row → locations
const GLOVO_LOCATIONS = ['Dubai', 'Colombo'];

// Uber Eats: location row → service modes. Adjust to match your Uber Eats setup.
const UBER_EATS_LOCATION = 'Location1';
const UBER_EATS_SERVICE_MODES = ['Delivery by restaurant', 'Pick up'];

describe('4 products, 2 categories, modifier reuse, 1 menu to multiple platforms (Glovo + Uber Eats)', () => {

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

    it('Should build Nested Modifier Chains', function () {
        modifierGroupMiddleLayer.modifier_group_bulk_edit(1, 4, 2);
    });

    it('Should create 1 menu with 2 category and 2 product', function () {
        navigator.navigate_to_menu_page();
        sample.logic(1, 2, 3, true);
    });

    it('Should publish the menu to Glovo (multiple locations) and verify each', function () {
        menuPublishLayer.menu_publish_to_multiple_locations(GLOVO_LOCATIONS, 'KFC');
    });

    it('Should publish the menu to Uber Eats (each service mode) and verify each', function () {
        menuPublishLayer.menu_publish_uber_eats_to_service_modes(
            UBER_EATS_LOCATION,
            UBER_EATS_SERVICE_MODES,
            'KFC'
        );
    });

    it('Should verify 2 menus are published in GC2 Menu Management > Menus (one per Glovo location)', function () {
        gc2MiddleLayer.gc2_menus_page_verify_menu_per_location(GLOVO_LOCATIONS.length, {
            locations: GLOVO_LOCATIONS,
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
