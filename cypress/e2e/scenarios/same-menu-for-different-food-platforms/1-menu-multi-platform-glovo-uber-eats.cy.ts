import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { MenuMiddleLayer } from "cypress/page-objects/middle-layer/menu-middle-layer";
import { MenuPublishLayer } from "cypress/page-objects/middle-layer/menu-publish-layer";
import { GC2MiddleLayer } from "cypress/page-objects/middle-layer/gc2-middle-layer";
import { GC2CleanupMethods } from "cypress/page-objects/pages/cleanup/gc2_cleanup_method";

const menuMiddleLayer = new MenuMiddleLayer();
const productMiddleLayer = new ProductMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();
const menuPublishLayer = new MenuPublishLayer();
const gc2MiddleLayer = new GC2MiddleLayer();
const gc2CleanupMethods = new GC2CleanupMethods();

// Glovo: brand row → locations. Location names must match under the selected brand (KFC).
const GLOVO_LOCATIONS = ['Dubai', 'Colombo'];

// Uber Eats: location row → service modes. Adjust to match your Uber Eats setup.
const UBER_EATS_LOCATION = 'Location1';
const UBER_EATS_SERVICE_MODES = ['Delivery by restaurant', 'Pick up'];

describe('1 menu published to multiple platforms (Glovo + Uber Eats)', () => {

    after('Should cleanup all created products and menus', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(1);
        gc2CleanupMethods.cleanup_menu_item(1);
        gc2CleanupMethods.cleanup_menu(1);
    });

    it('Should create 1 product with all fields filled', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_bulk_create(1);
    });

    it('Should create 1 menu with 1 category and 1 product', function () {
        menuMiddleLayer.menu_bulk_create(1, 1, 1);
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

    it('Should verify published menus appear in GC2 Menu Management > Menus', function () {
        gc2MiddleLayer.gc2_menus_page();
    });

    it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
        gc2MiddleLayer.gc2_menu_items_page();
    });
});
