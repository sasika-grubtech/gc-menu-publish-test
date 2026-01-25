import { ModifierGroupHomePage } from "cypress/page-objects/pages/modifier-group/modifier-group-home-page";
import { TextModifierGroupPage } from "cypress/page-objects/pages/modifier-group/text-modifier-group-page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ModifierGroupGetDetailsService } from "cypress/services/modifier-group/modifier-group-get-details";
import { ModifierGroupDeleteService } from "cypress/services/modifier-group/modifier-group-delete";

const navigator = new PageNavigator();
const homePage = new ModifierGroupHomePage();
const createPage = new TextModifierGroupPage();

// Store created product modifier group names for cleanup
const createdProductModifierGroupNames: string[] = [];

describe('Create 9 Product Modifier Groups from JSON with Toast Validation', () => {

    before(() => {
        // Navigate once before all tests
        navigator.navigate_to_modifier_group_page();
    });

    it('Should create all 9 product modifier groups from bulk_product_modifier_groups.json and validate toast messages', function () {
        // Load all required fixtures
        cy.fixture('bulk_product_modifier_groups').then((bulkData) => {
            cy.fixture('shared/tags').then((tagsData) => {
                cy.fixture('shared/category').then((categoryData) => {
                    const productModifierGroups = bulkData.productModifierGroups;
                    
                    cy.log(`📦 Creating ${productModifierGroups.length} product modifier groups with ALL fields from JSON file`);
                    cy.log('═══════════════════════════════════════════════════════════════');

                    productModifierGroups.forEach((productModifierGroup: any, index: number) => {
                        cy.log(`🔹 Creating product modifier group ${index + 1} of ${productModifierGroups.length}: ${productModifierGroup.name}`);

                        // Store product modifier group name for cleanup
                        createdProductModifierGroupNames.push(productModifierGroup.name);

                        // ====== OVERVIEW TAB: Basic Info ======
                        homePage
                            .step_click_create_new_modifier_group_button()
                            .step_click_modifier_type_product_button()
                            .step_enter_overview_name(productModifierGroup.name)
                            .step_enter_overview_display_name(productModifierGroup.displayName)
                            .step_enter_overview_description(productModifierGroup.description)
                            .step_enter_overview_external_id(productModifierGroup.externalId);

                        // Select existing category (cycling through available categories)
                        const categoryIndex = index % categoryData.categories.length;
                        const category = categoryData.categories[categoryIndex];
                        createPage.step_click_category_select_textbox();
                        cy.get(`[data-cy="category-checkbox-${category.id}"]`).click();

                        // Toggle Status to Active
                        createPage.step_change_overview_status();

                        // ====== TAGS TAB: Add Tags ======
                        createPage.verify_tags_title_visible();
                        createPage.step_enter_tags_select(tagsData.tags[0].name);
                        createPage.step_select_tag_checkbox(tagsData.tags[0].id);

                        // ====== CREATE MODIFIER GROUP ======
                        createPage.step_click_create_modifier_group_button();

                        // Validate toast message (this waits for toast to appear)
                        homePage
                            .verify_toast_message("Modifier group created successfully")
                            .verify_toast_message_text(`New modifier group, "${productModifierGroup.name}" has been successfully created`);

                        cy.log(`✅ Product modifier group ${index + 1} created with ALL fields: ${productModifierGroup.name}`);

                        // Wait for toast to dismiss and page to stabilize before next creation
                        cy.wait(2000);
                    });

                    cy.log('═══════════════════════════════════════════════════════════════');
                    cy.log(`✅ Successfully created and validated ${productModifierGroups.length} product modifier groups with ALL fields`);
                });
            });
        });
    });


    // ============================================================================
    // CLEANUP: DELETE ALL CREATED PRODUCT MODIFIER GROUPS
    // ============================================================================
    after('Cleanup all created product modifier groups', () => {
        const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';
        
        cy.log(`🧹 Starting cleanup of ${createdProductModifierGroupNames.length} product modifier groups...`);

        // Use cy.then() to ensure sequential execution of cleanup
        createdProductModifierGroupNames.forEach((productModifierGroupName, index) => {
            cy.then(() => {
                return ModifierGroupGetDetailsService.filterModifierGroupsByName(partnerId, productModifierGroupName, 'product')
                    .then((found) => {
                        if (found) {
                            const productModifierGroupId = Cypress.env('PRODUCT_MODIFIER_GROUP_ID');
                            cy.log(`🗑️ Deleting ${index + 1}/${createdProductModifierGroupNames.length}: ${productModifierGroupName}`);
                            return ModifierGroupDeleteService.deleteModifierGroup(partnerId, productModifierGroupId);
                        } else {
                            cy.log(`⚠️ Product modifier group not found: ${productModifierGroupName}`);
                        }
                    });
            });
        });

        cy.then(() => {
            cy.log('✅ Cleanup complete');
        });
    });
});
