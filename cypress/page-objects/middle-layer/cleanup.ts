import { ProductGetDetailsService } from "cypress/services/product/product-get-details";
import { ProductDeleteService } from "cypress/services/product/product-delete";
import { ModifierGroupGetDetailsService } from "cypress/services/modifier-group/modifier-group-get-details";
import { ModifierGroupDeleteService } from "cypress/services/modifier-group/modifier-group-delete";
import { MenuGetDetailsService } from "cypress/services/menu/menu-get-details";
import { MenuDeleteService } from "cypress/services/menu/menu-delete";
import { HierarchyClearanceService } from "../../services/mapping/hierarchy-clearance";

const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

export class Cleanup {

    public cleanup_hierarchy_mapping_clearance() {
        cy.log('🧹 Calling hierarchy mapping clearance...');
        return HierarchyClearanceService.clearHierarchyMapping(partnerId).then(() => {
            cy.log('✅ Hierarchy mapping clearance complete');
        });
    }

    public cleanup_product(count?: number) {
        cy.fixture('bulk_products').then((bulkData) => {
            let products = bulkData.products;
            
            // Limit products to count if provided
            if (count !== undefined) {
                products = products.slice(0, count);
            }

            cy.log(`🧹 Cleaning up ${products.length} products from fixture...`);

            // Process products sequentially - check one by one and delete
            cy.wrap(products).each((product: any, index: number) => {
                const productName = product.name;
                cy.log(`🔄 Checking product ${index + 1}/${products.length}: ${productName}`);
                
                cy.then(() => {
                    return ProductGetDetailsService.filterProductsByName(partnerId, productName)
                        .then((found) => {
                            if (found) {
                                const productId = Cypress.env('PRODUCT_ID');
                                cy.log(`   ✓ Found product ID: ${productId}`);
                                cy.log(`   🗑️ Deleting product: ${productName}`);
                                return ProductDeleteService.deleteProduct(partnerId, productId)
                                    .then(() => {
                                        cy.log(`   ✅ Successfully deleted: ${productName}`);
                                    });
                            } else {
                                cy.log(`   ⚠️ Product not found: ${productName} - skipping`);
                            }
                        });
                });
            }).then(() => {
                cy.log('✅ Products cleanup complete');
            });
        });
    }

    public cleanup_modifier_group(count?: number) {
        cy.fixture('bulk_product_modifier_groups').then((bulkData) => {
            let modifierGroups = bulkData.productModifierGroups;
            
            // Limit modifier groups to count if provided
            if (count !== undefined) {
                modifierGroups = modifierGroups.slice(0, count);
            }

            cy.log(`🧹 Cleaning up ${modifierGroups.length} modifier groups from fixture...`);

            // Process modifier groups sequentially - check one by one and delete
            cy.wrap(modifierGroups).each((modifierGroup: any, index: number) => {
                const modifierGroupName = modifierGroup.name;
                cy.log(`🔄 Checking modifier group ${index + 1}/${modifierGroups.length}: ${modifierGroupName}`);
                
                cy.then(() => {
                    return ModifierGroupGetDetailsService.filterModifierGroupsByName(partnerId, modifierGroupName, 'product')
                        .then((found) => {
                            if (found) {
                                const mgId = Cypress.env('PRODUCT_MODIFIER_GROUP_ID');
                                cy.log(`   ✓ Found modifier group ID: ${mgId}`);
                                cy.log(`   🗑️ Deleting modifier group: ${modifierGroupName}`);
                                return ModifierGroupDeleteService.deleteModifierGroup(partnerId, mgId)
                                    .then(() => {
                                        cy.log(`   ✅ Successfully deleted: ${modifierGroupName}`);
                                    });
                            } else {
                                cy.log(`   ⚠️ Modifier group not found: ${modifierGroupName} - skipping`);
                            }
                        });
                });
            }).then(() => {
                cy.log('✅ Modifier groups cleanup complete');
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

            cy.log(`🧹 Cleaning up ${menuNames.length} menus from generated file...`);

            // Process menus sequentially - check one by one and delete
            cy.wrap(menuNames).each((menuName: string, index: number) => {
                cy.log(`🔄 Checking menu ${index + 1}/${menuNames.length}: ${menuName}`);
                
                cy.then(() => {
                    return MenuGetDetailsService.filterMenusByName(partnerId, menuName)
                        .then((found) => {
                            if (found) {
                                const menuId = Cypress.env('MENU_ID');
                                cy.log(`   ✓ Found menu ID: ${menuId}`);
                                cy.log(`   🗑️ Deleting menu: ${menuName}`);
                                return MenuDeleteService.deleteMenu(partnerId, menuId)
                                    .then(() => {
                                        cy.log(`   ✅ Successfully deleted: ${menuName}`);
                                    });
                            } else {
                                cy.log(`   ⚠️ Menu not found: ${menuName} - skipping`);
                            }
                        });
                });
            }).then(() => {
                cy.log('✅ Menus cleanup complete');
            });
        });
    }

}