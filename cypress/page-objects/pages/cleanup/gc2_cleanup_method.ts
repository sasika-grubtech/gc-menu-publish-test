import { MenuItemDeleteService } from "cypress/services/gc2/menu-item-delete";
import { MenuItemGetDetailsService } from "cypress/services/gc2/menu-item-get-details";
import { MenuGetDetailsService } from "cypress/services/gc2/menu-get-details";
import { MenuDeleteService } from "cypress/services/gc2/menu-delete";
import { ModifierGroupGetDetailsService } from "cypress/services/gc2/modifier-group-get-details";
import { ModifierGroupDeleteService } from "cypress/services/gc2/modifier-group-delete";

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

            // Recursive function to process items sequentially
            const processNext = (index: number) => {
                if (index >= productsToCleanup.length) {
                    cy.log('✅ Menu items (recipes) cleanup complete');
                    return;
                }

                const product = productsToCleanup[index];
                const recipeName = product.displayName; // Use displayName (what appears in GC2)
                
                cy.then(() => {
                    cy.log(`🔄 Checking menu item ${index + 1}/${productsToCleanup.length}: ${recipeName}`);
                    return MenuItemGetDetailsService.findRecipeByName(partnerId, recipeName)
                        .then((found) => {
                            if (found) {
                                const recipeId = Cypress.env('RECIPE_ID');
                                const version = Cypress.env('RECIPE_VERSION');
                                cy.log(`   ✓ Found recipe ID: ${recipeId}`);
                                if (version) {
                                    cy.log(`   ✓ Recipe version: ${version}`);
                                }
                                
                                // Retry deletion with verification
                                const deleteWithRetry = (attempt: number, maxAttempts: number = 3): Cypress.Chainable<any> => {
                                    cy.log(`   🗑️ Deleting menu item (recipe) (attempt ${attempt}/${maxAttempts}): ${recipeName}`);
                                    
                                    return MenuItemDeleteService.deleteRecipe(recipeId, version)
                                        .then((response: any) => {
                                            if (response && response.status && (response.status === 200 || response.status === 204)) {
                                                cy.log(`   ✅ Delete request successful, verifying deletion...`);
                                                // Wait for backend to process deletion
                                                cy.wait(2000);
                                                
                                                // Verify item is actually deleted
                                                return MenuItemGetDetailsService.findRecipeByName(partnerId, recipeName)
                                                    .then((stillExists) => {
                                                        if (stillExists && attempt < maxAttempts) {
                                                            cy.log(`   ⚠️ Item still exists after deletion, retrying... (attempt ${attempt + 1}/${maxAttempts})`);
                                                            return deleteWithRetry(attempt + 1, maxAttempts);
                                                        } else if (stillExists) {
                                                            cy.log(`   ❌ Item still exists after ${maxAttempts} deletion attempts: ${recipeName}`);
                                                            return cy.wrap(null);
                                                        } else {
                                                            cy.log(`   ✅ Successfully deleted and verified: ${recipeName}`);
                                                            return cy.wrap(null);
                                                        }
                                                    });
                                            } else {
                                                cy.log(`   ⚠️ Deletion request failed (status: ${response?.status || 'unknown'})`);
                                                if (attempt < maxAttempts) {
                                                    cy.log(`   🔄 Retrying deletion... (attempt ${attempt + 1}/${maxAttempts})`);
                                                    cy.wait(1000);
                                                    return deleteWithRetry(attempt + 1, maxAttempts);
                                                } else {
                                                    cy.log(`   ❌ Failed to delete after ${maxAttempts} attempts: ${recipeName}`);
                                                    return cy.wrap(null);
                                                }
                                            }
                                        });
                                };
                                
                                return deleteWithRetry(1).then(() => {
                                    return cy.then(() => processNext(index + 1));
                                });
                            } else {
                                cy.log(`   ⚠️ Menu item (recipe) not found: ${recipeName} - skipping`);
                                // Process next item even if not found
                                return cy.then(() => processNext(index + 1));
                            }
                        });
                });
            };

            // Start processing from index 0
            processNext(0);
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

            // Process menus sequentially using forEach with cy.then() for proper promise chaining
            menuNames.forEach((menuName: string, index: number) => {
                cy.then(() => {
                    cy.log(`🔄 Checking GC2 menu ${index + 1}/${menuNames.length}: ${menuName}`);
                    return MenuGetDetailsService.findMenuByName(partnerId, menuName)
                        .then((found) => {
                            if (found) {
                                const menuId = Cypress.env('GC2_MENU_ID');
                                const version = Cypress.env('GC2_MENU_VERSION');
                                cy.log(`   ✓ Found GC2 menu ID: ${menuId}`);
                                
                                // Retry deletion with verification
                                const deleteWithRetry = (attempt: number, maxAttempts: number = 3): Cypress.Chainable<any> => {
                                    cy.log(`   🗑️ Deleting GC2 menu (attempt ${attempt}/${maxAttempts}): ${menuName}`);
                                    
                                    return MenuDeleteService.deleteMenu(menuId, version)
                                        .then((response: any) => {
                                            if (response && response.status && (response.status === 200 || response.status === 204)) {
                                                cy.log(`   ✅ Delete request successful, verifying deletion...`);
                                                // Wait for backend to process deletion
                                                cy.wait(2000);
                                                
                                                // Verify item is actually deleted
                                                return MenuGetDetailsService.findMenuByName(partnerId, menuName)
                                                    .then((stillExists) => {
                                                        if (stillExists && attempt < maxAttempts) {
                                                            cy.log(`   ⚠️ Item still exists after deletion, retrying... (attempt ${attempt + 1}/${maxAttempts})`);
                                                            return deleteWithRetry(attempt + 1, maxAttempts);
                                                        } else if (stillExists) {
                                                            cy.log(`   ❌ Item still exists after ${maxAttempts} deletion attempts: ${menuName}`);
                                                            return cy.wrap(null);
                                                        } else {
                                                            cy.log(`   ✅ Successfully deleted and verified: ${menuName}`);
                                                            return cy.wrap(null);
                                                        }
                                                    });
                                            } else {
                                                cy.log(`   ⚠️ Deletion request failed (status: ${response?.status || 'unknown'})`);
                                                if (attempt < maxAttempts) {
                                                    cy.log(`   🔄 Retrying deletion... (attempt ${attempt + 1}/${maxAttempts})`);
                                                    cy.wait(1000);
                                                    return deleteWithRetry(attempt + 1, maxAttempts);
                                                } else {
                                                    cy.log(`   ❌ Failed to delete after ${maxAttempts} attempts: ${menuName}`);
                                                    return cy.wrap(null);
                                                }
                                            }
                                        });
                                };
                                
                                return deleteWithRetry(1);
                            } else {
                                cy.log(`   ⚠️ GC2 menu not found: ${menuName} - skipping`);
                            }
                        });
                });
            });

            cy.then(() => {
                cy.log('✅ GC2 menus cleanup complete');
            });
        });
    }

    public cleanup_modifier_group(count?: number) {
        cy.fixture('bulk_product_modifier_groups').then((bulkData: any) => {
            let modifierGroupsToCleanup = bulkData.productModifierGroups;
            
            // Limit modifier groups to count if provided
            if (count !== undefined && count > 0) {
                modifierGroupsToCleanup = modifierGroupsToCleanup.slice(0, count);
                cy.log(`📊 Count limit applied for GC2 modifier groups: ${count}`);
            }

            cy.log(`🧹 Cleaning up ${modifierGroupsToCleanup.length} GC2 modifier groups from fixture...`);

            // Recursive function to process items sequentially
            const processNext = (index: number) => {
                if (index >= modifierGroupsToCleanup.length) {
                    cy.log('✅ GC2 modifier groups cleanup complete');
                    return;
                }

                const mg = modifierGroupsToCleanup[index];
                const modifierGroupName = mg.displayName; // Use displayName (what appears in GC2)
                
                cy.then(() => {
                    cy.log(`🔄 Checking GC2 modifier group ${index + 1}/${modifierGroupsToCleanup.length}: ${modifierGroupName}`);
                    return ModifierGroupGetDetailsService.findModifierGroupByName(partnerId, modifierGroupName)
                        .then((found) => {
                            if (found) {
                                const mgId = Cypress.env('GC2_MODIFIER_GROUP_ID');
                                const version = Cypress.env('GC2_MODIFIER_GROUP_VERSION');
                                cy.log(`   ✓ Found GC2 modifier group ID: ${mgId}`);
                                if (version) {
                                    cy.log(`   ✓ Modifier group version: ${version}`);
                                }
                                
                                // Retry deletion with verification
                                const deleteWithRetry = (attempt: number, maxAttempts: number = 3): Cypress.Chainable<any> => {
                                    cy.log(`   🗑️ Deleting GC2 modifier group (attempt ${attempt}/${maxAttempts}): ${modifierGroupName}`);
                                    
                                    return ModifierGroupDeleteService.deleteModifierGroup(mgId, version)
                                        .then((response: any) => {
                                            if (response && response.status && (response.status === 200 || response.status === 204)) {
                                                cy.log(`   ✅ Delete request successful, verifying deletion...`);
                                                // Wait for backend to process deletion
                                                cy.wait(2000);
                                                
                                                // Verify item is actually deleted
                                                return ModifierGroupGetDetailsService.findModifierGroupByName(partnerId, modifierGroupName)
                                                    .then((stillExists) => {
                                                        if (stillExists && attempt < maxAttempts) {
                                                            cy.log(`   ⚠️ Item still exists after deletion, retrying... (attempt ${attempt + 1}/${maxAttempts})`);
                                                            return deleteWithRetry(attempt + 1, maxAttempts);
                                                        } else if (stillExists) {
                                                            cy.log(`   ❌ Item still exists after ${maxAttempts} deletion attempts: ${modifierGroupName}`);
                                                            return cy.wrap(null);
                                                        } else {
                                                            cy.log(`   ✅ Successfully deleted and verified: ${modifierGroupName}`);
                                                            return cy.wrap(null);
                                                        }
                                                    });
                                            } else {
                                                cy.log(`   ⚠️ Deletion request failed (status: ${response?.status || 'unknown'})`);
                                                if (attempt < maxAttempts) {
                                                    cy.log(`   🔄 Retrying deletion... (attempt ${attempt + 1}/${maxAttempts})`);
                                                    cy.wait(1000);
                                                    return deleteWithRetry(attempt + 1, maxAttempts);
                                                } else {
                                                    cy.log(`   ❌ Failed to delete after ${maxAttempts} attempts: ${modifierGroupName}`);
                                                    return cy.wrap(null);
                                                }
                                            }
                                        });
                                };
                                
                                return deleteWithRetry(1).then(() => {
                                    return cy.then(() => processNext(index + 1));
                                });
                            } else {
                                cy.log(`   ⚠️ GC2 modifier group not found: ${modifierGroupName} - skipping`);
                                // Process next item even if not found
                                return cy.then(() => processNext(index + 1));
                            }
                        });
                });
            };

            // Start processing from index 0
            processNext(0);
        });
    }
}

