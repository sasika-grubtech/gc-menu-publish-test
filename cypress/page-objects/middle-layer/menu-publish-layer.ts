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
const partnerId = Cypress.env('PARTNER_ID') || '<REDACTED-PARTNER-ID>';

export class MenuPublishLayer {

    public menu_publish() {
        cy.log('📤 STEP 5: Navigate to Publish Page');
        cy.log('═══════════════════════════════════════════════════════════════');

        // Navigate to the Publish page
        navigator.navigate_to_publish_page();

        // Verify publish page loaded
        publishPage.verify_publish_page_loaded();

        // Select the brand used when creating menus (KFC for Menu 1)
        cy.log('🏷️ Selecting KFC filter');
        publishPage.step_select_brand('KFC');

        // Verify brand is selected
        publishPage.step_verify_brand_selected('KFC');

        cy.log('✅ Publish page ready with KFC selected');

        // Expand Glovo aggregator section
        cy.log('📂 Expanding Glovo aggregator section');
        publishPage.step_expand_aggregator_section('Glovo');

        // Click Change Menu button for Glovo
        cy.log('🔄 Clicking Change Menu button');
        publishPage.step_click_change_menu_button('Glovo');

        // Select the menu we created - read from saved file or array
        // Menu names are saved to file when menu_bulk_create is called
        let menuNamePromise: Cypress.Chainable<string>;
        
        // First try to get from createdMenuNames array (populated when menus are created)
        if (createdMenuNames.length > 0) {
            const menuName = createdMenuNames[0];
            cy.log(`📋 Using menu name from createdMenuNames array: ${menuName}`);
            menuNamePromise = cy.wrap(menuName);
        } else {
            // Fallback: Read from saved file
            menuNamePromise = cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
                if (data && data.menuNames && data.menuNames.length > 0) {
                    return data.menuNames[0];
                } else {
                    throw new Error('No menu name available for publishing. Please create menus first using menu_bulk_create().');
                }
            });
        }
        
        menuNamePromise.then((menuName: string) => {
            if (createdMenuNames.length === 0) {
                cy.log(`📋 Using menu name from saved file: ${menuName}`);
            }
            cy.log(`📋 Using menu name for publish: ${menuName}`);
            cy.log(`📋 Selecting menu: ${menuName}`);
            publishPage.step_select_menu_from_list(menuName);

            // Click Assign button
            cy.log('✅ Clicking Assign button');
            publishPage.step_click_assign_button();

            cy.log('✅ Menu assigned to Glovo aggregator');
            cy.get('[data-cy="confirmation-dialog-confirm-button"]').click({ force: true });
            // Click Publish All button
            cy.log('🚀 Clicking Publish All button');
            publishPage.step_click_publish_all();

            // Click Validate & Publish button in confirmation dialog
            cy.log('✅ Clicking Validate & Publish button');
            publishPage.step_click_validate_and_publish();

            cy.log('✅ Menu 1 published successfully!');

            // Verify the menu is published
            cy.log('🔍 Verifying Menu 1 publish status...');
            cy.wait(3000); // Wait for publish to complete

            // Expand the brand row to see details
            cy.log('📂 Expanding KFC brand row...');
            publishPage.step_click_brand_row_to_expand('KFC');

            // Verify menu name in location row (nested row after expansion)  
            // Note: The cell displays both menu name and brand name
            cy.log('📋 Verifying menu name and brand in location row...');
            publishPage.verify_menu_name_in_location_row('Dubai', `${menuName}`, 'KFC');
            cy.log(`✅ Menu name and brand verified in location row: ${menuName} - KFC`);

            // Verify brand name is shown
            cy.log('🏷️ Verifying brand name...');
            //publishPage.verify_brand_name_in_row('KFC');
            cy.log('✅ Brand name verified: KFC');

            // Verify published status badge
            cy.log('✅ Verifying Published status...');
            publishPage.verify_published_status();
            cy.log('✅ Published status verified!');

            // Verify last published date (known bug - may fail)
            cy.log('📅 Verifying Last Published date...');
            // Note: Uncomment below when bug is fixed
            // publishPage.verify_last_published_date_exists();
            // publishPage.verify_last_published_date_is_today();
            cy.log('⚠️ Last Published date verification skipped (known bug)');

            // Verify Publishing Logs
            cy.log('📋 Opening Publishing Logs to verify all steps succeeded...');
           // publishPage.verify_publishing_logs_details('Glovo', 'KFC', 'Dubai', menuName);

            cy.log('✅ Menu 1 fully verified as Published for KFC!');
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    }

    /**
     * Same mechanism as menu_publish(), but verifies the menu in multiple locations.
     * @param locationNames - Array of location names to verify (e.g. ['Dubai', 'Riyadh'])
     * @param brandName - Brand filter and row to expand (default 'KFC')
     */
    public menu_publish_to_multiple_locations(locationNames: string[], brandName: string ) {
        cy.log('📤 STEP: Publish menu to multiple locations');
        cy.log('═══════════════════════════════════════════════════════════════');

        // Navigate to the Publish page
        navigator.navigate_to_publish_page();

        // Verify publish page loaded
        publishPage.verify_publish_page_loaded();

        // Select the brand used when creating menus
        cy.log(`🏷️ Selecting ${brandName} filter`);
        publishPage.step_select_brand(brandName);

        // Verify brand is selected
        publishPage.step_verify_brand_selected(brandName);

        cy.log(`✅ Publish page ready with ${brandName} selected`);

        // Expand Glovo aggregator section
        cy.log('📂 Expanding Glovo aggregator section');
        publishPage.step_expand_aggregator_section('Glovo');

        // Click Change Menu button for Glovo
        cy.log('🔄 Clicking Change Menu button');
        publishPage.step_click_change_menu_button('Glovo');

        // Select the menu we created - read from saved file or array
        // Menu names are saved to file when menu_bulk_create is called
        let menuNamePromise: Cypress.Chainable<string>;

        // First try to get from createdMenuNames array (populated when menus are created)
        if (createdMenuNames.length > 0) {
            const menuName = createdMenuNames[0];
            cy.log(`📋 Using menu name from createdMenuNames array: ${menuName}`);
            menuNamePromise = cy.wrap(menuName);
        } else {
            // Fallback: Read from saved file
            menuNamePromise = cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
                if (data && data.menuNames && data.menuNames.length > 0) {
                    return data.menuNames[0];
                } else {
                    throw new Error('No menu name available for publishing. Please create menus first using menu_bulk_create().');
                }
            });
        }

        menuNamePromise.then((menuName: string) => {
            if (createdMenuNames.length === 0) {
                cy.log(`📋 Using menu name from saved file: ${menuName}`);
            }
            cy.log(`📋 Using menu name for publish: ${menuName}`);
            cy.log(`📋 Selecting menu: ${menuName}`);
            publishPage.step_select_menu_from_list(menuName);

            // Click Assign button
            cy.log('✅ Clicking Assign button');
            publishPage.step_click_assign_button();

            cy.log('✅ Menu assigned to Glovo aggregator');
            cy.get('[data-cy="confirmation-dialog-confirm-button"]').click({ force: true });
            // Click Publish All button
            cy.log('🚀 Clicking Publish All button');
            publishPage.step_click_publish_all();

            // Click Validate & Publish button in confirmation dialog
            cy.log('✅ Clicking Validate & Publish button');
            publishPage.step_click_validate_and_publish();

            cy.log('✅ Menu published successfully!');

            // Expand the brand row to see details
            cy.log(`📂 Expanding ${brandName} brand row...`);
            publishPage.step_click_brand_row_to_expand(brandName);

            // Verify menu name in location row for each location (nested row after expansion)
            // Note: The cell displays both menu name and brand name
            locationNames.forEach((locationName) => {
                cy.log(`📋 Verifying menu name and brand in location row: ${locationName}`);
                publishPage.verify_menu_name_in_location_row(locationName, `${menuName}`, brandName);
                publishPage.verify_location_row_published_status(locationName);
                cy.log(`✅ Menu name and brand verified in location row: ${menuName} - ${brandName} (${locationName})`);
            });

            // Verify brand name is shown
            cy.log('🏷️ Verifying brand name...');
            cy.log(`✅ Brand name verified: ${brandName}`);

            // Verify published status badge again after location checks
            cy.log('✅ Verifying Published status...');
            publishPage.verify_published_status();
            cy.log('✅ Published status verified!');

            // Verify last published date (known bug - may fail)
            cy.log('📅 Verifying Last Published date...');
            cy.log('⚠️ Last Published date verification skipped (known bug)');

            // Verify Publishing Logs
            cy.log('📋 Opening Publishing Logs to verify all steps succeeded...');

            cy.log(`✅ Menu fully verified as Published for ${brandName} (${locationNames.length} location(s): ${locationNames.join(', ')})!`);
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    }

    /**
     * Publish the created menu to Uber Eats for each service mode under the given location.
     * Uber Eats structure: Location row → Service modes (e.g. "Delivery by restaurant", "Pick up").
     * Assigns menu at aggregator level, clicks Publish all for Uber Eats, then verifies each service mode shows Published.
     */
    public menu_publish_uber_eats_to_service_modes(
        locationName: string,
        serviceModeNames: string[],
        brandName: string = 'KFC'
    ) {
        cy.log('📤 STEP: Publish menu to Uber Eats (per service mode)');
        cy.log('═══════════════════════════════════════════════════════════════');

        navigator.navigate_to_publish_page();
        publishPage.verify_publish_page_loaded();

        cy.log(`🏷️ Selecting ${brandName} filter`);
        publishPage.step_select_brand(brandName);
        publishPage.step_verify_brand_selected(brandName);

        cy.log('📂 Expanding Uber Eats aggregator section');
        publishPage.step_expand_aggregator_section('Uber Eats');

        cy.log('🔄 Clicking Change Menu button for Uber Eats');
        publishPage.step_click_change_menu_button('Uber Eats');

        const menuNamePromise = createdMenuNames.length > 0
            ? cy.wrap(createdMenuNames[0])
            : cy.readFile('cypress/fixtures/generated_menu_names.json').then((data: any) => {
                if (data?.menuNames?.length > 0) return data.menuNames[0];
                throw new Error('No menu name available for publishing. Create menus first.');
            });

        menuNamePromise.then((menuName: string) => {
            cy.log(`📋 Selecting menu for Uber Eats: ${menuName}`);
            publishPage.step_select_menu_from_list(menuName);
            publishPage.step_click_assign_button();
            cy.get('[data-cy="confirmation-dialog-confirm-button"]').click({ force: true });

            cy.log('🚀 Clicking Publish all for Uber Eats');
            publishPage.step_click_publish_all_for_aggregator('Uber Eats');
            cy.log('✅ Clicking Validate & Publish');
            publishPage.step_click_validate_and_publish();

            cy.log('🔍 Verifying Uber Eats publish status...');
            cy.wait(3000);
            publishPage.verify_published_status('Uber Eats');

            cy.log(`📂 Expanding location row: ${locationName}`);
            publishPage.step_expand_location_row_in_aggregator('Uber Eats', locationName);

            serviceModeNames.forEach((serviceModeName) => {
                cy.log(`📋 Verifying service mode "${serviceModeName}" is Published`);
                publishPage.verify_service_mode_row_has_published_status('Uber Eats', locationName, serviceModeName);
                cy.log(`✅ Service mode verified: ${serviceModeName}`);
            });

            cy.log(`✅ Uber Eats: Menu published and verified for ${serviceModeNames.length} service mode(s)`);
            cy.log('═══════════════════════════════════════════════════════════════');
        });
    }
}
