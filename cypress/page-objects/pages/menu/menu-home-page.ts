import { MenuPage } from "./menu-page";

export class MenuHomePage {

    // Header Elements
    private lbl_menus = '[data-cy="undefined-title"]';
    private btn_create_new = '[data-cy="create-new-button"]';

    // Search Elements
    private txt_search_menu = '[data-cy="search-input"]';

    // Table Elements
    private btn_edit_menu = '[data-cy="view-details-button"]';

    public verify_menus_header_text() {
        cy.get(this.lbl_menus).should('have.text', 'Menus');
        return this;
    }

    public step_search_menu(menuName: string) {
        cy.wait(3000);
        cy.get(this.txt_search_menu).click({ force: true }).type(menuName);
        cy.wait(2000);
        return this;
    }

    public step_clear_search() {
        cy.get(this.txt_search_menu).find('input').clear();
        cy.wait(2000);
        return this;
    }

    public step_click_create_new_menu_button() {
        cy.wait(3000);
        cy.get(this.btn_create_new).click({ force: true });
        cy.wait(2000);
        return new MenuPage();
    }

    public step_click_edit_menu() {
        cy.get(this.btn_edit_menu).last().click({ force: true });
        return new MenuPage();
    }

    public verify_toast_message(message: string) {
        cy.get('[data-cy="title"]', { timeout: 10000 }).should('be.visible').and('contain.text', message);
        return this;
    }

    public verify_toast_message_text(message: string) {
        cy.get('[data-cy="description"]', { timeout: 10000 }).should('be.visible').and('contain.text', message);
        return this;
    }
}
