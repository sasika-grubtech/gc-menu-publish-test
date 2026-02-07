import { TextModifierGroupPage } from "./text-modifier-group-page";

export class ModifierGroupHomePage {

    private btn_create_new = '[data-cy="create-new-button"]';
    private btn_modifier_type_text = '[data-cy="modifier-type-text"]';
    private btn_modifier_type_product = '[data-cy="modifier-type-product"]';
    private btn_edit_modifier_group = '[data-cy="view-details-button"]';

    private btn_select_all_products = '[data-cy="product-table-select-all"]';
    // Search Elements
    private search_input = "[data-cy='search-input']";
    private tbl_row_by_index = (index: number) => `//div[@data-slot="table-row"][@data-index="${index}"]`;

    public step_click_create_new_modifier_group_button() {
        cy.wait(2000);
        cy.get(this.btn_create_new).click({ force: true });
        return this;
    }

    public step_click_modifier_type_text_button() {
        cy.get(this.btn_modifier_type_text).click({ force: true });
        cy.wait(2000);
        return new TextModifierGroupPage();
    }

    public step_click_modifier_type_product_button() {
        cy.get(this.btn_modifier_type_product).click({ force: true });
        cy.wait(2000);
        return new TextModifierGroupPage();
    }

    public verify_toast_message(message: string) {
        cy.get(`[data-cy="title"]`, { timeout: 10000 }).should('be.visible').and('contain.text', message);
        return this;
    }

    public verify_toast_message_text(message: string) {
        cy.get(`[data-cy="description"]`, { timeout: 10000 }).should('be.visible').and('contain.text', message);
        return this;
    }

    public step_search_products(searchText: string) {
        cy.wait(5000);
        cy.get(this.search_input).type(searchText);
        cy.wait(5000)
        return this;
    }

    public step_click_edit_modifier_group() {
        cy.wait(2000);
        cy.get(this.btn_edit_modifier_group).last().click({ force: true });
        return new TextModifierGroupPage();
    }

    public step_click_select_all_products() {
        cy.get(this.btn_select_all_products).click({ force: true });
        return this;
    }


    public step_click_bulk_edit() {
        cy.get('[data-cy="bulk-edit-button"]').click({ force: true });
        return this;
    }

    public step_click_table_row_by_index(index: number) {
        cy.xpath(this.tbl_row_by_index(index))
            .last()
            .should('be.visible')
            .click({ force: true });
        cy.wait(1000); // Wait for side panel to open
        return this;
    }

}
