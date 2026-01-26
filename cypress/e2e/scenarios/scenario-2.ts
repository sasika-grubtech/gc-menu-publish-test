import { ProductMiddleLayer } from "cypress/page-objects/middle-layer/product-middle-layer";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ProductGetDetailsService } from "cypress/services/product/product-get-details";
import { ProductDeleteService } from "cypress/services/product/product-delete";
import { Cleanup } from "cypress/page-objects/middle-layer/cleanup";
import { AuthenticationService } from "cypress/scripts/authenticationService";
import { ModifierGroupMiddleLayer } from "cypress/page-objects/middle-layer/modifier-group-middle-layer";
import { MenuMiddleLayer } from "cypress/page-objects/middle-layer/menu-middle-layer";

const menuMiddleLayer = new MenuMiddleLayer();
const productMiddleLayer = new ProductMiddleLayer();
const modifierGroupMiddleLayer = new ModifierGroupMiddleLayer();
const navigator = new PageNavigator();
const cleanup = new Cleanup();

describe('Complete Product Workflow: Create Products → Create Modifier Groups → Build Modifier Chains', () => {

    describe('Step 1: Create 9 Products', () => {

        before(() => {
            navigator.navigate_to_product_page();
        });

        it('Should create all 9 products with all fields filled', function () {
            productMiddleLayer.product_bulk_create(9);
        });
    })

    describe('Step 2: Create 6 Product Modifier Groups', () => {

        before(() => {
            navigator.navigate_to_modifier_group_page();
        });

        it('Should create 6 product modifier groups with all fields filled', function () {
            modifierGroupMiddleLayer.modifier_group_bulk_create(6);
        });
    });

    describe('Step 3: Build Nested Modifier Chains', () => {
        modifierGroupMiddleLayer.modifier_group_bulk_edit();
    })

    describe('Step 4: Create Menus with Categories and Products', () => {
        menuMiddleLayer.menu_bulk_create(1,1);
    })

    describe.skip('Step 8: Cleanup', () => {

        before(() => {
            AuthenticationService.authenticate();
        });

        it('Should cleanup all created products', function () {
            cleanup.cleanup_product(2);
            cleanup.cleanup_modifier_group(2);
        });
    });

});