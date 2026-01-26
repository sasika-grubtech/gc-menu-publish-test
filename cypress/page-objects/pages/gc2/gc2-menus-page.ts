export class GC2MenusPage {
    // Search field (same pattern as menu items)
    private search_container = '#search-summary';
    private search_input = '#search-summary input[placeholder="Search"]';
    
    // View button (appears on hover)
    private view_button = '.view-menu a';

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

    //==============VIEW/EDIT ACTIONS==============
    public step_click_view_button_for_menu(menuName: string) {
        // Find the row containing the menu
        cy.contains(menuName)
            .closest('.gt-tr')
            .as('menuRow');
        
        // Trigger hover events to reveal the button
        cy.get('@menuRow').trigger('mouseenter');
        cy.get('@menuRow').trigger('mouseover');
        cy.wait(300); // Wait for CSS transition/animation
        
        // Force the parent .view-menu div to be visible, then click the button
        cy.get('@menuRow')
            .find('.view-menu')
            .invoke('css', 'display', 'block')
            .find('a')
            .click({ force: true });
        
        cy.wait(2000);
        return this;
    }

    public step_click_save_button_for_menu() {
        cy.get('#submit').click({ force: true });
        cy.wait(2000);
        cy.get('.Toastify__toast-body').should('be.visible').and('contain', 'Successfully updated the menu');
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
