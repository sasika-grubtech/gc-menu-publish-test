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

export class ProductMiddleLayer {

    public product_bulk_create(count?: number) {
        cy.fixture('bulk_products').then((bulkData) => {
            cy.fixture('shared/tags').then((tagsData) => {
                cy.fixture('shared/category').then((categoryData) => {
                    let products = bulkData.products;
                    
                    // Limit products to count if provided
                    if (count !== undefined) {
                        products = products.slice(0, count);
                    }

                    cy.log(`📦 STEP 1: Creating ${products.length} products`);
                    cy.log('═══════════════════════════════════════════════════════════════');

                    products.forEach((product: any, index: number) => {
                        cy.log(`🔹 Creating product ${index + 1} of ${products.length}: ${product.name}`);

                        // Store product name for cleanup
                        createdProductNames.push(product.name);

                        // Click Create New Product button
                        productHome.step_click_create_new_product_button();

                        // ====== OVERVIEW TAB ======
                        productCreate.step_enter_product_name(product.name);
                        productCreate.step_enter_product_display_name(product.displayName);
                        productCreate.step_enter_product_description(product.description);
                        productCreate.step_enter_external_id(product.externalId);

                        // Select existing category
                        const categoryIndex = index % categoryData.categories.length;
                        const category = categoryData.categories[categoryIndex];
                        productCreate.step_click_category_select_button();
                        cy.get(`[data-cy="category-checkbox-${category.id}"]`).click({ force: true });

                        // Toggle Status to Active
                       // productCreate.step_change_status();

                        // ====== PRICE & TAXES TAB ======
                        productCreate.verify_price_and_taxes_title_visible();
                        productCreate.step_click_currency_select();
                        productCreate.step_enter_price_input(product.price);

                        // ====== NUTRITION TAB ======
                        productCreate.step_click_nutritional_info_tab();
                        productCreate.step_enter_nutritional_info('100');

                        // ====== TAGS TAB ======
                        productCreate.verify_tags_title_visible();
                        productCreate.step_enter_tags_select(tagsData.tags[0].name);
                        productCreate.step_select_tag_checkbox(tagsData.tags[0].id);

                        // ====== CREATE PRODUCT ======
                        productCreate
                            .product_create_button_click()
                            .product_created_toaster_message(product.name);

                        cy.log(`✅ Product ${index + 1} created: ${product.name}`);
                        cy.wait(2000);
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ STEP 1 COMPLETE: Created ${products.length} products`);
                });
            });
        });
    }

    public product_create_with_mandatory_fields(count?: number) {

        cy.fixture('bulk_products').then((bulkData) => {
            cy.fixture('shared/tags').then((tagsData) => {
                cy.fixture('shared/category').then((categoryData) => {
                    let products = bulkData.products;
                    if (count !== undefined) {
                        products = products.slice(0, count);
                    }

                    cy.log(`📦 STEP 1: Creating ${products.length} products`); 
                    cy.log('═══════════════════════════════════════════════════════════════');

                    products.forEach((product: any, index: number) => {
                        cy.log(`🔹 Creating product ${index + 1} of ${products.length}: ${product.name}`);

                        createdProductNames.push(product.name);
                        productHome.step_click_create_new_product_button();
                        productCreate.step_enter_product_name(product.name);
                        productCreate.step_enter_product_display_name(product.displayName);
                        productCreate.verify_price_and_taxes_title_visible();
                        productCreate.step_click_currency_select();
                        productCreate.step_enter_price_input(product.price);
                        productCreate
                            .product_create_button_click()
                            .product_created_toaster_message(product.name);

                        cy.log(`✅ Product ${index + 1} created: ${product.name}`);
                        cy.wait(2000);
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ STEP 1 COMPLETE: Created ${products.length} products`);
                });
            });
        });

    }
}