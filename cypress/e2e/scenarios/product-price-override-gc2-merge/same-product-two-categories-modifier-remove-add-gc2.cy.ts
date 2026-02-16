/**
 * Scenario: Menu with same product in two categories and one modifier group; remove modifier then add back, validate in GC2.
 *
 * Structure: Menu -> Category 1 -> Product 1 -> Modifier Group 1
 *                     Category 2 -> Product 1 -> Modifier Group 1
 *
 * 1. Publish → GC2 shows 1 product, 1 modifier group.
 * 2. Remove modifier group from the product in GC3, save, publish → GC2: validate product (1 product); modifier group may be gone.
 * 3. Add modifier group back to the product in GC3, save, publish → GC2: validate 1 product, 1 modifier group.
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

const productMiddleLayer = new ProductMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();
const menuPublishLayer = new MenuPublishLayer();
const gc2MiddleLayer = new GC2MiddleLayer();
const gc2CleanupMethods = new GC2CleanupMethods();
const sample = new Sample();
const modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();

const PRODUCT_NAME = 'Classic Margherita Pizza';
const PRODUCT_DISPLAY_NAME = 'Margherita Pizza';
const MODIFIER_GROUP_DISPLAY_NAME = 'Premium Burger Add-ons';
const MODIFIER_GROUP_NAME = 'Burger Additions_PMG001';

describe('Same product in 2 categories: remove modifier group then add back, validate in GC2', () => {

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

    it('Should verify in GC2: 1 product and 1 modifier group', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
        gc2MiddleLayer.gc2_modifier_groups_page_verify(1);
    });

    it('Should remove modifier group from product in GC3 and save product', function () {
        productMiddleLayer.product_remove_modifier_group_and_save(PRODUCT_NAME, MODIFIER_GROUP_DISPLAY_NAME);
    });

    it('Should publish the menu again', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: 1 product still present (modifier group removed from product)', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
        // Optionally, if your app removes the modifier group from GC2 when unlinked:
        // gc2MiddleLayer.gc2_verify_modifier_group_not_exists(MODIFIER_GROUP_DISPLAY_NAME);
    });

    it('Should add modifier group back to product in GC3 and save product', function () {
        productMiddleLayer.product_add_modifier_group_and_save(PRODUCT_NAME, MODIFIER_GROUP_NAME);
    });

    it('Should publish the menu again', function () {
        menuPublishLayer.menu_publish();
    });

    it('Should verify in GC2: 1 product and 1 modifier group again', function () {
        gc2MiddleLayer.gc2_verify_menu_item_count_for_name(PRODUCT_DISPLAY_NAME, 1);
        gc2MiddleLayer.gc2_modifier_groups_page_verify(1);
    });
});
