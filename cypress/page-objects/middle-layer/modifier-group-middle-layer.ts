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

export class ModifierGroupMiddleLayer {

    // Fill modifier group overview tab
    private fillModifierGroupOverview(mg: any, category: any) {
        modifierGroupHome
            .step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(mg.name)
            .step_enter_overview_display_name(mg.displayName)
            .step_enter_overview_description(mg.description)
            .step_enter_overview_external_id(mg.externalId);

        modifierGroupCreate.step_click_category_select_textbox();
        cy.get(`[data-cy="category-checkbox-${category.id}"]`).click({ force: true });
    }

    // Add tags to modifier group
    private addTagsToModifierGroup(tag: any) {
        modifierGroupCreate.verify_tags_title_visible();
        modifierGroupCreate.step_enter_tags_select(tag.name);
        modifierGroupCreate.step_select_tag_checkbox(tag.id);
    }

    // Create a single modifier group
    private createModifierGroup(mg: any, index: number, category: any, tag: any) {
        cy.log(`🔹 Creating modifier group ${index + 1}: ${mg.name}`);
        createdModifierGroupNames.push(mg.name);

        this.fillModifierGroupOverview(mg, category);
        this.addTagsToModifierGroup(tag);

        modifierGroupCreate.step_click_create_modifier_group_button();
        modifierGroupHome
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${mg.name}" has been successfully created`);

        cy.log(`✅ Modifier group ${index + 1} created: ${mg.name}`);
        cy.wait(2000);
    }

    // Main method to create modifier groups in bulk
    public modifier_group_bulk_create(count?: number) {
        cy.fixture('bulk_product_modifier_groups').then((bulkData: any) => {
            cy.fixture('shared/tags').then((tagsData: any) => {
                cy.fixture('shared/category').then((categoryData: any) => {
                    let modifierGroups = bulkData.productModifierGroups;
                    
                    // Limit to count if provided
                    if (count !== undefined) {
                        modifierGroups = modifierGroups.slice(0, count);
                    }

                    cy.log(`📦 Creating ${modifierGroups.length} product modifier groups`);
                    cy.log('═══════════════════════════════════════════════════════════════');

                    modifierGroups.forEach((mg: any, index: number) => {
                        const categoryIndex = index % categoryData.categories.length;
                        const category = categoryData.categories[categoryIndex];
                        const tag = tagsData.tags[0];
                        this.createModifierGroup(mg, index + 1, category, tag);
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ COMPLETE: Created ${modifierGroups.length} modifier groups`);
                });
            });
        });
    }


    // Generate nested chains dynamically from fixture data
    // Uses only the created products and modifier groups (limited by counts)
    private generateNestedChains(allProducts: any[], allModifierGroups: any[], chainCount: number, productCount: number, mgCount: number) {
        const chains: any[] = [];
        // Use only the created products (first productCount products)
        const availableProducts = allProducts.slice(0, productCount);
        // Use only the created modifier groups (first mgCount groups)
        const availableModifierGroups = allModifierGroups.slice(0, mgCount);
        
        if (availableModifierGroups.length < 2) {
            cy.log(`⚠️ Need at least 2 modifier groups to create chains. Available: ${availableModifierGroups.length}`);
            return chains;
        }
        
        if (availableProducts.length < 3) {
            cy.log(`⚠️ Need at least 3 products to create chains. Available: ${availableProducts.length}`);
            return chains;
        }
        
        for (let i = 0; i < chainCount; i++) {
            // Use products in groups of 3 per chain, cycle through available products if needed
            const productIndex = (i * 3) % availableProducts.length;
            const product1Index = (productIndex + 1) % availableProducts.length;
            const product2Index = (productIndex + 2) % availableProducts.length;
            
            const rootProduct = availableProducts[productIndex];
            const product1 = availableProducts[product1Index];
            const product2 = availableProducts[product2Index];
            
            // Reuse modifier groups - cycle through available groups
            // Each chain needs 2 modifier groups (level1 and level2)
            const mg1Index = (i * 2) % availableModifierGroups.length;
            const mg2Index = (mg1Index + 1) % availableModifierGroups.length;
            
            const mg1 = availableModifierGroups[mg1Index];
            const mg2 = availableModifierGroups[mg2Index];
            
            chains.push({
                chainNumber: i + 1,
                rootProduct: rootProduct.name,
                level1: {
                    modifierGroupName: mg1.name,
                    modifierGroupDisplayName: mg1.displayName,
                    productModifierName: product1.name,
                    productModifierDisplayName: product1.displayName
                },
                level2: {
                    modifierGroupName: mg2.name,
                    modifierGroupDisplayName: mg2.displayName,
                    productModifierName: product2.name,
                    productModifierDisplayName: product2.displayName
                }
            });
        }
        
        return chains;
    }

    // Search and edit a product
    private searchAndEditProduct(productName: string) {
        cy.log(`🔧 Searching and editing product: ${productName}`);
        productHome.step_search_products(productName);
        productHome.step_click_edit_product();
        cy.wait(3000);
    }

    // Add modifier group to product
    private addModifierGroupToProduct(modifierGroupName: string, modifierGroupDisplayName: string) {
        cy.log(`➕ Adding Modifier Group: ${modifierGroupName}`);
        productCreate.step_click_modifier_group_select();
        
        cy.get('[data-cy="enter-search-modifier-group-name-input"]').type(modifierGroupName);
        cy.wait(2000);
        
        cy.get('[data-cy^="modifier-group-table-select-"]')
            //.filter(':visible')
            .first()
            .click({ force: true });
        
        productCreate.step_click_save_add_mg_modal_button();
        cy.wait(2000);
        
        cy.log(`✅ Verifying Modifier Group added: ${modifierGroupDisplayName}`);
        cy.get('#modifier-groups').within(() => {
            cy.contains(modifierGroupDisplayName).scrollIntoView().should('be.visible');
        });
    }

    // Get element ID from display name
    private getElementId(displayName: string, selector: string = '[data-cy$="-display-name"]'): Cypress.Chainable<string> {
        return cy.get('#modifier-groups')
            .find(selector)
            .contains(displayName)
            .closest(selector)
            .invoke('attr', 'data-cy')
            .then((dataCy) => dataCy?.replace('-display-name', '') || '');
    }

    // Add product modifier to modifier group
    private addProductModifierToModifierGroup(mgId: string, productName: string, productDisplayName: string) {
        cy.log(`➕ Expanding MG to add Product Modifier: ${productName}`);
        productCreate.step_click_expand_button(mgId);
        productCreate.step_add_modifier_first_level_override(mgId);
        
        cy.get('[data-cy="-input"]').type(productName);
        cy.wait(2000);
        
        cy.get('[data-cy^="product-table-select-"]')
           // .filter(':visible')
            .first()
            .click({ force: true });
        
        // Click save button with force since it might be disabled initially
        cy.get('.flex-col-reverse > .bg-button-primary-bg').click({ force: true });
        cy.wait(2000);
        
        cy.log(`✅ Verifying Product Modifier added: ${productDisplayName}`);
        cy.get('#modifier-groups').within(() => {
            cy.contains(productDisplayName).scrollIntoView().should('be.visible');
        });
    }

    // Add modifier group to product modifier
    private addModifierGroupToProductModifier(productModifierId: string, modifierGroupName: string, modifierGroupDisplayName: string) {
        cy.log(`➕ Adding Modifier Group to Product Modifier`);
        productCreate.step_click_expand_button(productModifierId);
        cy.wait(1000);
        
        cy.get(`[data-cy="add-modifier-group-button-${productModifierId}"]`).click({ force: true });
        cy.wait(2000);
        
        cy.get('[data-cy="enter-search-modifier-group-name-input"]').clear().type(modifierGroupName);
        cy.wait(2000);
        
        cy.get('[data-cy^="modifier-group-table-select-"]')
           // .filter(':visible')
            .first()
            .click({ force: true });
        
        productCreate.step_click_save_add_mg_modal_button();
        cy.wait(2000);
        
        cy.log(`✅ Verifying Modifier Group added: ${modifierGroupDisplayName}`);
        cy.contains(modifierGroupDisplayName).scrollIntoView().should('be.visible');
    }

    // Build a complete nested chain
    private buildNestedChain(chain: any) {
        cy.log(`📦 Building Complete Nested Chain ${chain.chainNumber}`);
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log(`Root Product: ${chain.rootProduct}`);
        cy.log(`Level 1: → ${chain.level1.modifierGroupDisplayName} → ${chain.level1.productModifierDisplayName}`);
        cy.log(`Level 2: → ${chain.level2.modifierGroupDisplayName} → ${chain.level2.productModifierDisplayName}`);

        this.searchAndEditProduct(chain.rootProduct);
        this.addModifierGroupToProduct(chain.level1.modifierGroupName, chain.level1.modifierGroupDisplayName);

        this.getElementId(chain.level1.modifierGroupDisplayName).then((mg1Id) => {
            cy.log(`✅ Level 1 MG ID: ${mg1Id}`);
            this.addProductModifierToModifierGroup(mg1Id, chain.level1.productModifierName, chain.level1.productModifierDisplayName);

            this.getElementId(chain.level1.productModifierDisplayName, '[data-cy*="-display-name"]').then((productModifierId) => {
                cy.log(`✅ Product Modifier ID: ${productModifierId}`);
                this.addModifierGroupToProductModifier(productModifierId, chain.level2.modifierGroupName, chain.level2.modifierGroupDisplayName);

                this.getElementId(chain.level2.modifierGroupDisplayName).then((mg2Id) => {
                    cy.log(`✅ Level 2 MG ID: ${mg2Id}`);
                    this.addProductModifierToModifierGroup(mg2Id, chain.level2.productModifierName, chain.level2.productModifierDisplayName);

                    cy.log(`💾 Saving product with complete nested chain`);
                    productCreate.product_create_button_click();
                    productHome.verify_toast_message("Product updated successfully");

                    cy.log(`✅ CHAIN ${chain.chainNumber} COMPLETE!`);
                    cy.log(`   ${chain.rootProduct}`);
                    cy.log(`   → ${chain.level1.modifierGroupDisplayName}`);
                    cy.log(`     → ${chain.level1.productModifierDisplayName}`);
                    cy.log(`       → ${chain.level2.modifierGroupDisplayName}`);
                    cy.log(`         → ${chain.level2.productModifierDisplayName}`);
                    cy.wait(2000);
                });
            });
        });
    }

    // Main method to create nested modifier group chains
    public modifier_group_bulk_edit(chainCount?: number, productCount?: number, mgCount?: number) {
        const chainsToCreate = chainCount || 1;
        const productsCreated = productCount || 4; // Default to 4 if not specified
        const modifierGroupsCreated = mgCount || 2; // Default to 2 if not specified
        
        navigator.navigate_to_product_page();

        cy.fixture('bulk_products').then((productsData: any) => {
            cy.fixture('bulk_product_modifier_groups').then((mgData: any) => {
                const allProducts = productsData.products;
                const allModifierGroups = mgData.productModifierGroups;
                
                const nestedChains = this.generateNestedChains(allProducts, allModifierGroups, chainsToCreate, productsCreated, modifierGroupsCreated);
                
                if (nestedChains.length === 0) {
                    cy.log(`⚠️ No chains generated. Check that you have created at least 3 products and 2 modifier groups.`);
                    return;
                }
                
                cy.log(`📦 Creating ${nestedChains.length} nested modifier group chains`);
                cy.log(`📊 Using ${productsCreated} created product(s) and ${modifierGroupsCreated} created modifier group(s)`);
                cy.log('═══════════════════════════════════════════════════════════════');

                nestedChains.forEach((chain: any) => {
                    this.buildNestedChain(chain);
                });

                cy.log('═══════════════════════════════════════════════════════════════');
                cy.log(`✅ COMPLETE: Created ${nestedChains.length} nested chains`);
            });
        });
    }

    /**
     * Build one nested chain with the same hierarchy as the default (root → MG1 → product1 → MG2 → product2),
     * but use a custom product at level 2 (deepest level) instead of the default from the fixture cycle.
     * Example: Classic Margherita Pizza → Premium Burger Add-ons → Deluxe Chicken Burger → Pizza Size Selection → Beef Pasta Carbonara.
     */
    public modifier_group_bulk_edit_chain_with_level2_product(level2ProductName: string, level2ProductDisplayName: string) {
        navigator.navigate_to_product_page();

        cy.fixture('bulk_products').then((productsData: any) => {
            cy.fixture('bulk_product_modifier_groups').then((mgData: any) => {
                const products = productsData.products.slice(0, 4);
                const modifierGroups = mgData.productModifierGroups.slice(0, 2);

                if (modifierGroups.length < 2 || products.length < 3) {
                    throw new Error('Need at least 3 products and 2 modifier groups in fixtures.');
                }

                const rootProduct = products[0];
                const product1 = products[1];
                const mg1 = modifierGroups[0];
                const mg2 = modifierGroups[1];

                const chain = {
                    chainNumber: 1,
                    rootProduct: rootProduct.name,
                    level1: {
                        modifierGroupName: mg1.name,
                        modifierGroupDisplayName: mg1.displayName,
                        productModifierName: product1.name,
                        productModifierDisplayName: product1.displayName,
                    },
                    level2: {
                        modifierGroupName: mg2.name,
                        modifierGroupDisplayName: mg2.displayName,
                        productModifierName: level2ProductName,
                        productModifierDisplayName: level2ProductDisplayName,
                    },
                };

                cy.log(`📦 Building nested chain with custom level 2 product: ${level2ProductDisplayName}`);
                this.buildNestedChain(chain);
                cy.log(`✅ COMPLETE: Chain created with ${level2ProductDisplayName} at deepest level`);
            });
        });
    }
}


// // Create 2 modifier groups first
// mgLayer.modifier_group_bulk_create(2);

// // Then create 1 chain using those 2 modifier groups
// mgLayer.modifier_group_bulk_edit(1, 2); // 1 chain, using 2 created modifier groups

// // Create 2 chains, reusing the 2 modifier groups
// mgLayer.modifier_group_bulk_edit(2, 2); // 2 chains, reusing 2 modifier groups
// // Chain 1: uses MG[0] and MG[1]
// // Chain 2: reuses MG[0] and MG[1] (cycles back)