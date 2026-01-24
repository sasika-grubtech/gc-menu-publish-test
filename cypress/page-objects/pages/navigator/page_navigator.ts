import { AuthenticationService } from "cypress/scripts/authenticationService";
import { SidePanel } from "cypress/page-objects/panel/sidePanel";

const sidePanel = new SidePanel();

export class PageNavigator {



    public navigate_to_product_page() {

        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc3_menu_management_button()
                    .click_side_panel_products_button();
                cy.wait(2000);
            });
        });
    }

    public navigate_to_modifier_group_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc3_menu_management_button()
                    .click_side_panel_modifier_group_button();
                cy.wait(2000);
            });
        });
    }

    public navigate_to_menu_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc3_menu_management_button()
                    .click_side_panel_menu_button();
                cy.wait(2000);
            });
        });
    }

    public navigate_to_publish_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc3_menu_management_button()
                    .click_side_panel_publish_button();
                cy.wait(2000);
            });
        });
    }

    // ============== GC2 MENU MANAGEMENT (Backward Compatibility) ==============
    public navigate_to_gc2_menu_items_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc2_menu_management_button()
                    .click_side_panel_gc2_menu_items_button();
                cy.wait(2000);
            });
        });
    }

    public navigate_to_gc2_modifier_groups_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc2_menu_management_button()
                    .click_side_panel_gc2_modifier_groups_button();
                cy.wait(2000);
            });
        });
    }

    public navigate_to_gc2_menus_page() {
        AuthenticationService.authenticate().then(() => {
            cy.visit("/login", { failOnStatusCode: false, timeout: 60000 }).then(() => {
                cy.url().should('include', 'grubcenter.staging.grubtech.io');
                sidePanel.click_side_panel_gc2_menu_management_button()
                    .click_side_panel_gc2_menus_button();
                cy.wait(2000);
            });
        });
    }
}