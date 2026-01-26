import { MenuItemDeleteService } from "cypress/services/gc2/menu-item-delete";
import { MenuItemGetDetailsService } from "cypress/services/gc2/menu-item-get-details";
import { MenuGetDetailsService } from "cypress/services/gc2/menu-get-details";
import { MenuDeleteService } from "cypress/services/gc2/menu-delete";

const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

export class GC2CleanupMethods {

    public cleanup_menu_item(count?: number) {
        cy.fixture('bulk_products').then((bulkData) => {
            // Create a new array reference to ensure proper slicing
            let productsToCleanup = bulkData.products;
            
            // Limit products to count if provided
            if (count !== undefined && count > 0) {
                productsToCleanup = productsToCleanup.slice(0, count);
            }

            cy.log(`🧹 Cleaning up ${productsToCleanup.length} menu items (recipes) from fixture...`);
            if (count !== undefined) {
                cy.log(`📊 Count limit applied: ${count}`);
            }

            // Process products sequentially - check one by one and delete
            cy.wrap(productsToCleanup).each((product: any, index: number) => {
                const recipeName = product.displayName; // Use displayName (what appears in GC2)
                cy.log(`🔄 Checking menu item ${index + 1}/${productsToCleanup.length}: ${recipeName}`);
                
                cy.then(() => {
                    return MenuItemGetDetailsService.findRecipeByName(partnerId, recipeName)
                        .then((found) => {
                            if (found) {
                                const recipeId = Cypress.env('RECIPE_ID');
                                cy.log(`   ✓ Found recipe ID: ${recipeId}`);
                                cy.log(`   🗑️ Deleting menu item (recipe): ${recipeName}`);
                                return MenuItemDeleteService.deleteRecipe(recipeId)
                                    .then(() => {
                                        cy.log(`   ✅ Successfully deleted: ${recipeName}`);
                                    });
                            } else {
                                cy.log(`   ⚠️ Menu item (recipe) not found: ${recipeName} - skipping`);
                            }
                        });
                });
            }).then(() => {
                cy.log('✅ Menu items (recipes) cleanup complete');
            });
        });
    }

    public cleanup_menu(count?: number) {
        // Read menu names from generated file (saved during menu creation)
        cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
            if (!data || !data.menuNames || data.menuNames.length === 0) {
                cy.log('⚠️ No menu names found in generated file - nothing to clean up');
                return;
            }

            let menuNames = data.menuNames;
            
            // Limit menus to count if provided
            if (count !== undefined) {
                menuNames = menuNames.slice(0, count);
            }

            cy.log(`🧹 Cleaning up ${menuNames.length} GC2 menus from generated file...`);

            // Process menus sequentially - check one by one and delete
            cy.wrap(menuNames).each((menuName: string, index: number) => {
                cy.log(`🔄 Checking GC2 menu ${index + 1}/${menuNames.length}: ${menuName}`);
                
                cy.then(() => {
                    return MenuGetDetailsService.findMenuByName(partnerId, menuName)
                        .then((found) => {
                            if (found) {
                                const menuId = Cypress.env('GC2_MENU_ID');
                                const version = Cypress.env('GC2_MENU_VERSION');
                                cy.log(`   ✓ Found GC2 menu ID: ${menuId}`);
                                cy.log(`   🗑️ Deleting GC2 menu: ${menuName}`);
                                return MenuDeleteService.deleteMenu(menuId, version)
                                    .then(() => {
                                        cy.log(`   ✅ Successfully deleted: ${menuName}`);
                                    });
                            } else {
                                cy.log(`   ⚠️ GC2 menu not found: ${menuName} - skipping`);
                            }
                        });
                });
            }).then(() => {
                cy.log('✅ GC2 menus cleanup complete');
            });
        });
    }
}

