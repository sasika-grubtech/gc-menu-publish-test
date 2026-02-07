import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { ProductHomePage } from "cypress/page-objects/pages/product/product_home_page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ProductGetDetailsService } from "cypress/services/product/product-get-details";
import { ProductDeleteService } from "cypress/services/product/product-delete";

const navigator = new PageNavigator();
const productCreate = new ProductCreatePage();
const productHome = new ProductHomePage();

// Store created product names for cleanup
const createdProductNames: string[] = [];

describe('Create 9 Products from JSON with All Fields', () => {

    before(() => {
        // Navigate once before all tests
        navigator.navigate_to_product_page();
    });

    it('Should create all 9 products from bulk_products.json with all fields filled', function () {
        // Load all required fixtures
        cy.fixture('bulk_products').then((bulkData) => {
            cy.fixture('shared/tags').then((tagsData) => {
                cy.fixture('shared/category').then((categoryData) => {
                    const products = bulkData.products;
                    
                    cy.log(`📦 Creating ${products.length} products with ALL fields from JSON file`);
                    cy.log('═══════════════════════════════════════════════════════════════');

                    products.forEach((product: any, index: number) => {
                        cy.log(`🔹 Creating product ${index + 1} of ${products.length}: ${product.name}`);

                        // Store product name for cleanup
                        createdProductNames.push(product.name);

                        // Click Create New Product button
                        productHome.step_click_create_new_product_button();

                        // ====== OVERVIEW TAB: Basic Product Info ======
                        // Fill Product Name (mandatory)
                        productCreate.step_enter_product_name(product.name);
                        
                        // Fill Product Display Name (mandatory)
                        productCreate.step_enter_product_display_name(product.displayName);
                        
                        // Fill Product Description
                        productCreate.step_enter_product_description(product.description);
                        
                        // Fill External ID
                        productCreate.step_enter_external_id(product.externalId);

                        // Select existing category (cycling through available categories)
                        const categoryIndex = index % categoryData.categories.length;
                        const category = categoryData.categories[categoryIndex];
                        productCreate.step_click_category_select_button();
                        cy.get(`[data-cy="category-checkbox-${category.id}"]`).click({ force: true });

                        // Toggle Status to Active
                        productCreate.step_change_status();

                        // ====== PRICE & TAXES TAB: Pricing ======
                        productCreate.verify_price_and_taxes_title_visible();
                        productCreate.step_click_currency_select();
                        productCreate.step_enter_price_input(product.price);

                        // ====== NUTRITION TAB: Nutritional Information ======
                        productCreate.step_click_nutritional_info_tab();
                        productCreate.step_enter_nutritional_info('100'); // Add calories

                        // ====== TAGS TAB: Add Tags ======
                        productCreate.verify_tags_title_visible();
                        productCreate.step_enter_tags_select(tagsData.tags[0].name);
                        productCreate.step_select_tag_checkbox(tagsData.tags[0].id);

                        // ====== CREATE PRODUCT ======
                        productCreate
                            .product_create_button_click()
                            .product_created_toaster_message(product.name);  // ✅ Toast validation

                        cy.log(`✅ Product ${index + 1} created with ALL fields: ${product.name}`);

                        cy.wait(2000); // Wait for toast to dismiss before next creation
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ Successfully created ${products.length} products with ALL fields filled`);
                });
            });
        });
    });


    // ============================================================================
    // CLEANUP: DELETE ALL CREATED PRODUCTS
    // ============================================================================
    after('Cleanup all created products', () => {
        const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';
        
        cy.log(`🧹 Starting cleanup of ${createdProductNames.length} products...`);

        createdProductNames.forEach((productName, index) => {
            ProductGetDetailsService.filterProductsByName(partnerId, productName)
                .then((found) => {
                    if (found) {
                        const productId = Cypress.env('PRODUCT_ID');
                        cy.log(`Deleting ${index + 1}/${createdProductNames.length}: ${productName}`);
                        ProductDeleteService.deleteProduct(partnerId, productId);
                    }
                });
        });

        cy.log('✅ Cleanup complete');
    });
});
