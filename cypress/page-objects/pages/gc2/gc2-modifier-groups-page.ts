export class GC2ModifierGroupsPage {
    // Search field (same pattern as menu items)
    private search_container = '#search-summary';
    private search_input = '#search-summary input[placeholder="Search"]';

    //==============PAGE VERIFICATION==============
    public verify_page_loaded() {
        cy.url().should('include', '/menu-management/modifier-groups');
        cy.wait(2000);
        return this;
    }

    //==============SEARCH==============
    public step_search_modifier_group(searchTerm: string) {
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
    public verify_modifier_group_exists(modifierGroupName: string) {
        cy.contains(modifierGroupName).should('be.visible');
        return this;
    }

    public verify_modifier_group_not_exists(modifierGroupName: string) {
        cy.contains(modifierGroupName).should('not.exist');
        return this;
    }

    //==============COMBINED ACTIONS==============
    public search_and_verify_modifier_group(modifierGroupName: string) {
        this.step_search_modifier_group(modifierGroupName);
        this.verify_modifier_group_exists(modifierGroupName);
        return this;
    }
}
