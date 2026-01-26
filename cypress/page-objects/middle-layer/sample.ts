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

export class Sample {

    // Generate menu configurations dynamically from fixture data
    private generateMenuConfigs(allProducts: any[], menuCount: number, catCount: number, prodCount: number, menuTimestamp: number, reuseProducts: boolean = false) {
        const brands = ["KFC", "Pizza Hut"];
        const menuConfigs = [];

        for (let menuIndex = 0; menuIndex < menuCount; menuIndex++) {
            const categories = [];
            
            for (let catIndex = 0; catIndex < catCount; catIndex++) {
                const categoryProducts = [];
                
                // If reuseProducts is true, use same products starting from index 0 for all categories
                // Otherwise, distribute products sequentially across categories
                let startIndex: number;
                if (reuseProducts) {
                    // Use same products for all categories (starting from 0)
                    startIndex = 0;
                } else {
                    // Sequential distribution (original behavior)
                    startIndex = (menuIndex * catCount * prodCount) + (catIndex * prodCount);
                }
                
                for (let i = 0; i < prodCount; i++) {
                    const productIndex = (startIndex + i) % allProducts.length;
                    const product = allProducts[productIndex];
                    categoryProducts.push({
                        name: product.name,
                        displayName: product.displayName
                    });
                }
                
                categories.push({
                    name: `M${menuIndex + 1}_Category ${catIndex + 1}_${menuTimestamp}`,
                    products: categoryProducts
                });
            }
            
            menuConfigs.push({
                name: `Test Menu ${menuIndex + 1}_${menuTimestamp}`,
                description: `Test menu ${menuIndex + 1} with categories and products`,
                externalId: `TEST_MENU_${String(menuIndex + 1).padStart(3, '0')}_${menuTimestamp}`,
                brandName: brands[menuIndex % brands.length],
                categories: categories
            });
        }

        return menuConfigs;
    }

    // Save menu names to file for later use
    private saveMenuNames(menuConfigs: any[], menuTimestamp: number) {
        const menuNamesArray = menuConfigs.map(menu => menu.name);
        cy.writeFile('cypress/fixtures/generated_menu_names.json', {
            menuNames: menuNamesArray,
            timestamp: menuTimestamp,
            count: menuNamesArray.length
        });
        cy.log(`💾 Saved ${menuNamesArray.length} menu name(s) to file`);
    }

    // Fill menu overview tab (name, brand, currency)
    private fillMenuOverview(menu: any) {
        menuPage.step_enter_overview_name(menu.name);
        menuPage.step_click_overview_brand_select();
        cy.contains(menu.brandName).click();
        menuPage.step_select_currency_dropdown();
        cy.contains('AED - United Arab Emirates Dirham').click();
    }

    // Setup tax manager
    private setupTaxManager() {
        menuPage.step_click_tax_manager_custom_tax_checkbox();
        menuPage.step_click_tax_manager_custom_tax_input();
        menuPage.step_create_new_tax('VAT', '5');
    }

    // Add products to a category
    private addProductsToCategory(category: any) {
        cy.log(`➕ Adding ${category.products.length} products to ${category.name}`);
        
        category.products.forEach((product: any, productIndex: number) => {
            cy.log(`   ➕ Adding product ${productIndex + 1}/${category.products.length}: ${product.name}`);
            menuPage.step_click_add_products_for_category(category.name);
            menuPage.step_search_and_select_product(product.name, product.displayName);
            menuPage.step_click_add_products_save();
            cy.wait(1000);
        });
    }

    // Create a single category with products
    private createCategory(category: any, catIndex: number) {
        cy.log(`➕ Creating New Category ${catIndex + 1}: ${category.name}`);

        if (catIndex === 0) {
            menuPage.step_click_create_category_initial();
        } else {
            menuPage.step_click_create_category_header();
        }

        menuPage.step_enter_category_products_name(category.name);
        menuPage.step_click_category_save();
        cy.log(`✅ Category created: ${category.name}`);

        menuPage.step_expand_category_section();
        this.addProductsToCategory(category);
        
        cy.log(`✅ Category ${catIndex + 1} complete: ${category.name} with ${category.products.length} products`);
    }

    // Create a menu with all its categories and products
    private createMenuWithCategories(menu: any, menuIndex: number) {
        cy.log(`📋 Creating Menu ${menuIndex + 1}: ${menu.name}`);
        cy.log('═══════════════════════════════════════════════════════════════');

        createdMenuNames.push(menu.name);
        menuHome.step_click_create_new_menu_button();

        this.fillMenuOverview(menu);
        this.setupTaxManager();

        menuPage.step_click_category_products_tab();
        menu.categories.forEach((category: any, catIndex: number) => {
            this.createCategory(category, catIndex);
        });

        menuPage.step_click_create_button();
        menuHome.verify_toast_message('Menu created successfully');

        cy.log(`✅ Menu ${menuIndex + 1} created: ${menu.name}`);
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.wait(2000);
    }

    // Main orchestrator method - easy to reuse
    public logic(count?: number, categoriesCount?: number, productsCount?: number, reuseProducts?: boolean) {
        const menuTimestamp = Date.now();
        const menuCount = count || 1;
        const catCount = categoriesCount || 1;
        const prodCount = productsCount || 1;
        const reuseSameProducts = reuseProducts || false;

        cy.fixture('bulk_products').then((bulkData: any) => {
            const allProducts = bulkData.products;
            const menuConfigs = this.generateMenuConfigs(allProducts, menuCount, catCount, prodCount, menuTimestamp, reuseSameProducts);

            this.saveMenuNames(menuConfigs, menuTimestamp);
            cy.log(`📊 Configuration: ${menuCount} menu(s), ${catCount} category/categories per menu, ${prodCount} product(s) per category`);
            if (reuseSameProducts) {
                cy.log(`🔄 Product reuse: Same products will be used across all categories`);
            }

            navigator.navigate_to_menu_page();
            cy.wait(2000);

            cy.log(`📋 Creating ${menuConfigs.length} menus`);
            cy.log('═══════════════════════════════════════════════════════════════');

            menuConfigs.forEach((menu: any, menuIndex: number) => {
                this.createMenuWithCategories(menu, menuIndex);
            });

            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log(`✅ COMPLETE: Created ${menuConfigs.length} menus`);
        });
    }
}


// sample.logic(1, 2, 2); // 1 menu, 2 categories, 2 products each
// // Category 1: Products 0-1
// // Category 2: Products 2-3

// // Reuse same products across all categories
// sample.logic(1, 2, 2, true); // 1 menu, 2 categories, 2 products each, reuse products
// // Category 1: Products 0-1
// // Category 2: Products 0-1 (same as Category 1)

// // Reuse products with more categories
// sample.logic(1, 3, 2, true); // 1 menu, 3 categories, 2 products each, reuse products
// // Category 1: Products 0-1
// // Category 2: Products 0-1 (same)