import { ProductHomePage } from "cypress/page-objects/pages/product/product_home_page";
import { ModifierGroupHomePage } from "cypress/page-objects/pages/modifier-group/modifier-group-home-page";

export class SidePanel {
    private side_panel_expand_button = "#side-menu-toggle-button";

    public step_click_side_panel_button() {
        cy.wait(2000);
        cy.get(this.side_panel_expand_button).click({ force: true });
        return this;
    }

    public click_side_panel_gc3_menu_management_button() {
        cy.wait(2000);
        cy.contains('.gc-submenu-header', 'Menu Management GC3').click();
        return this;
    }

    public click_side_panel_products_button() {
        cy.wait(2000);
        cy.contains('.menu-item-text', 'Products').click();
        return new ProductHomePage();
    }

    public click_side_panel_menu_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management-gc3/menus"]').click();
        return this;
    }

    public click_side_panel_modifier_group_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management-gc3/modifier-groups"]').click({ force: true });
        return new ModifierGroupHomePage();
    }

    public click_side_panel_publish_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management-gc3/publishing"]').click({ force: true });
        return this;
    }

    // ============== GC2 MENU MANAGEMENT (Backward Compatibility) ==============
    public click_side_panel_gc2_menu_management_button() {
        cy.wait(2000);
        // Click on "Menu Management" header (GC2 version - not GC3)
        cy.contains('.gc-submenu-header', 'Menu Management').not(':contains("GC3")').click();
        return this;
    }

    public click_side_panel_gc2_menu_items_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management/menu-items"]').click({ force: true });
        return this;
    }

    public click_side_panel_gc2_modifier_groups_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management/modifier-groups"]').click({ force: true });
        return this;
    }

    public click_side_panel_gc2_menus_button() {
        cy.wait(2000);
        cy.get('a[href="/menu-management/menus"]').click({ force: true });
        return this;
    }
}