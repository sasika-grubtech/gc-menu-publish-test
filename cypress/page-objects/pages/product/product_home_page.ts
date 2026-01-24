// Pure Cypress Page Object for Product Home Page

import { ProductCreatePage } from "./product_create_page";
import { ProductRangingPage } from "./product_ranging";

export class ProductHomePage {

    // ==================== SELECTORS ====================

    // Header Elements
    private lbl_products = '[data-cy="undefined-title"]';
    private lbl_all_products = '.border-brand-600';

    // Action Buttons
    private btn_create_new = "[data-cy='create-new-button']";
    private lbl_export = '[data-cy="export-button-button-label"]';
    private lbl_help = "[data-cy='help-button']";

    // Filter Controls
    private btn_filters = ".pt-xl > .justify-between > :nth-child(1) > :nth-child(1)";
    private btn_ranging = ".pt-xl > .justify-between > :nth-child(1) > :nth-child(2)";

    // Search Elements
    private search_input = "[data-cy='search-input']";

    // Toast Message
    private lbl_toast_message = '[data-cy="1-title"]';
    private lbl_toast_message_text = '[data-cy="1-description"]';

    // Table Actions
    private btn_more_actions = '//button[@data-slot="dropdown-menu-trigger" and contains(@data-cy, "product-table-dropdown")]';
    private btn_delete_product = '.gc3ui-popover-item-content';
    private btn_confirm_remove = '[data-cy="confirmation-dialog-confirm-button"]';
    private btn_edit_product = '[data-cy="view-details-button"]';

    private btn_view_details = '[data-cy="view-details-button"]';

    //--------------------Table Columns--------------------
    private btn_cost_column = '[data-cy="cost-column"]';


    //side view columns
    private btn_save_product = ':nth-child(2) > [data-cy="save-product-button-button-label"]';

    //select all products
    private btn_select_all_products = '[data-cy="product-table-select-all"]';

    // Pagination
    private btn_next_page = '[data-cy="next-page"]';

    // Table row selectors for individual product selection

    // Table row selectors for individual product selection
    private tbl_row_by_index = (index: number) => `[data-slot="table-row"][data-index="${index}"]`;
    private tbl_row_by_product_name = (productName: string) => `//p[@id="lead-image-column-name" and contains(text(), "${productName}")]`;


    // ==================== HEADER VERIFICATION METHODS ====================

    public verify_products_header_text() {
        cy.get(this.lbl_products).should('have.text', 'Products');
        return this;
    }

    public verify_all_products_button_visible() {
        cy.get(this.lbl_all_products).should('be.visible');
        return this;
    }

    // ==================== ACTION BUTTON VERIFICATION METHODS ====================

    public verify_create_new_button_visible() {
        cy.get(this.btn_create_new).should('be.visible');
        cy.get(this.btn_create_new).should('have.text', 'Create New');
        cy.get(this.btn_create_new).should('be.enabled');
        return this;
    }

    public verify_export_button_visible() {
        cy.get(this.lbl_export).should('be.visible');
        return this;
    }

    public verify_help_button_visible() {
        cy.get(this.lbl_help).should('be.visible');
        return this;
    }

    public verify_view_details_button_visible() {
        cy.get(this.btn_view_details).click();
        return this;
    }

    // ==================== FILTER VERIFICATION METHODS ====================

    public verify_filters_button_visible() {
        cy.get(this.btn_filters).should('be.visible');
        return this;
    }

    public step_click_filters_button() {
        cy.get(this.btn_filters).click();
        return this;
    }

    public verify_ranging_button_visible() {
        cy.get(this.btn_ranging).should('be.visible');
        return this;
    }

    public step_click_ranging_button() {
        cy.get(this.btn_ranging)
            .should('be.visible')
            .should('not.be.disabled')
            .scrollIntoView()
            .wait(500) // Small wait to handle any animations
            .click({ force: true });
        return new ProductRangingPage();
    }

    // ==================== SEARCH FUNCTIONALITY METHODS ====================

    public step_search_products(searchText: string) {
        cy.wait(5000);
        cy.get(this.search_input).type(searchText);
        cy.wait(5000)
        return this;
    }

    public step_clear_search() {
        // Clear the search input by clearing the text and pressing escape
        cy.get(this.search_input).find('input').clear();
        cy.wait(2000); // Wait for search results to refresh
        return this;
    }

    public verify_search_placeholder() {
        cy.get(this.search_input).find('input').should('have.attr', 'placeholder', 'Search products');
        return this;
    }

    // ==================== CREATE NEW PRODUCT BUTTON ====================

    public step_click_create_new_product_button() {
        cy.get(this.btn_create_new).click({ force: true });
        cy.wait(2000);
        return new ProductCreatePage();
    }

    public verify_toast_message(message: string) {
        cy.get(`[data-cy="title"]`).should('be.visible');
        cy.get(`[data-cy="title"]`).should('contain.text', message);
        return this;
    }

    public verify_toast_message_text(message: string) {
        cy.get(`[data-cy="description"]`).should('be.visible');
        cy.get(`[data-cy="description"]`).should('contain.text', message);
        return this;
    }

    // ==================== TABLE ACTIONS METHODS ====================

    public step_click_more_actions_menu() {
        cy.wait(5000);
        cy.xpath(this.btn_more_actions).click();
        return this;
    }

    public step_click_edit_product() {
        cy.get(this.btn_edit_product).last().click();
        return new ProductCreatePage();
    }

    public step_click_delete_product() {
        cy.get(this.btn_delete_product).last().click();
        return this;
    }

    public step_click_confirm_remove() {
        cy.get(this.btn_confirm_remove).click();
        return this;
    }

    public step_open_side_by_side_view() {
        cy.get(this.btn_cost_column).click();
        return this;
    }

    public step_click_save_product() {
        cy.get(this.btn_save_product).click();
        cy.wait(2000);
        return this;
    }

    public step_click_select_all_products() {
        cy.get(this.btn_select_all_products).click();
        return this;
    }

    public step_click_bulk_edit() {
        cy.get('[data-cy="bulk-edit-button"]').click();
        return this;
    }

    /**
     * Click on a table row by index to open side-by-side view
     * @param index - The 0-based index of the table row
     */
    public step_click_table_row_by_index(index: number) {
        cy.get(this.tbl_row_by_index(index))
            .last()
            .should('be.visible')
            .click({ force: true });
        cy.wait(1000); // Wait for side panel to open
        return this;
    }

    /**
     * Click on a table row by product name to open side-by-side view
     * @param productName - The product name to search for (partial match)
     */
    public step_click_table_row_by_product_name(productName: string) {
        cy.xpath(this.tbl_row_by_product_name(productName))
            .should('be.visible')
            .parents('[data-slot="table-row"]')
            .first()
            .find('[data-cy="cost-column"]')
            .click({ force: true });
        cy.wait(1000); // Wait for side panel to open
        return this;
    }

    /**
     * Close the side-by-side view panel
     */
    public step_close_side_panel() {
        cy.get('.lucide-x').click({ force: true }); // Close button
        cy.wait(500);
        return this;
    }

    public step_click_next_page() {
        cy.get(this.btn_next_page).click();
        cy.wait(2000);
        return this;
    }
}