export class GC2MenusPage {
    // Search field (same pattern as menu items)
    private search_container = '#search-summary';
    private search_input = '#search-summary input[placeholder="Search"]';

    //==============PAGE VERIFICATION==============
    public verify_page_loaded() {
        cy.url().should('include', '/menu-management/menus');
        cy.wait(2000);
        return this;
    }

    //==============SEARCH==============
    public step_search_menu(searchTerm: string) {
        cy.get(this.search_input)
            .should('be.visible')
            .clear()
            .type(searchTerm);
        cy.wait(2000); // Wait for search results
        return this;
    }

    public step_clear_search() {
        cy.get(this.search_input).clear();
        cy.wait(1000);
        return this;
    }

    //==============VERIFICATION==============
    public verify_menu_exists(menuName: string) {
        cy.contains(menuName).should('be.visible');
        return this;
    }

    public verify_menu_not_exists(menuName: string) {
        cy.contains(menuName).should('not.exist');
        return this;
    }

    //==============COMBINED ACTIONS==============
    public search_and_verify_menu(menuName: string) {
        this.step_search_menu(menuName);
        this.verify_menu_exists(menuName);
        return this;
    }
}
