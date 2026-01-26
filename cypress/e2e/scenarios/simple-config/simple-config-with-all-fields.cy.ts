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

describe('1 product , 1 category , 1 menu to 1 location', () => {

    after('Should cleanup all created products and modifier groups', function () {
        AuthenticationService.authenticate();
        cleanup.cleanup_menu(1);
        cleanup.cleanup_product(2);
        gc2CleanupMethods.cleanup_menu_item(1);
        gc2CleanupMethods.cleanup_menu(1);
    });

    it('Should create all 1 products with all fields filled', function () {
        navigator.navigate_to_product_page();
        productMiddleLayer.product_bulk_create(1);
    });

    it('Should create 1 menu with 1 category and 1 product', function () {
        menuMiddleLayer.menu_bulk_create(1, 1, 1);
    });

    it('Should publish the menu', function () {
        menuPublishLayer.menu_publish();
    });


    it('Should verify published menus appear in GC2 Menu Management > Menus', function () {
        gc2MiddleLayer.gc2_menus_page();
    });

    it('Should verify Menu Items (Products) appear in GC2 Menu Management > Menu Items', function () {
        gc2MiddleLayer.gc2_menu_items_page();
    });
});

