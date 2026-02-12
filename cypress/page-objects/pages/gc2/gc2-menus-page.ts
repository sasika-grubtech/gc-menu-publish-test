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
        // Ensure write permission: set mode=gc2WriteAdmin on current URL before save
        cy.url().then((url) => {
            const hasMode = url.includes('mode=gc2WriteAdmin');
            const urlWithMode = hasMode ? url : (url.includes('?') ? `${url}&mode=gc2WriteAdmin` : `${url}?mode=gc2WriteAdmin`);
            cy.visit(urlWithMode);
        });
        cy.wait(2000);
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

    /**
     * Verify the menu appears at least expectedCount times in the table (e.g. one row per location).
     * Use when the same menu is published to multiple locations and GC2 shows one menu row per location.
     */
    public verify_menu_count_at_least(menuName: string, expectedCount: number) {
        this.step_search_menu(menuName);
        cy.get('.gt-tr').then(($rows) => {
            const $ = $rows.constructor as JQueryStatic;
            const matching = $rows.filter(function () { return $(this).text().includes(menuName); });
            expect(matching.length, `Menu "${menuName}" should appear at least ${expectedCount} time(s) (one per location)`).to.be.at.least(expectedCount);
        });
        return this;
    }

    /**
     * Verify that a row exists with the given menu name, brand, and location (same row contains all three).
     * Call after searching for the menu so the table shows the relevant rows.
     */
    public verify_menu_row_has_brand_and_location(menuName: string, brandName: string, locationName: string) {
        cy.get('.gt-tr').then(($rows) => {
            const $ = $rows.constructor as JQueryStatic;
            const matching = $rows.filter(function () {
                const t = $(this).text();
                return t.includes(menuName) && t.includes(brandName) && t.includes(locationName);
            });
            expect(matching.length, `Row with menu "${menuName}", brand "${brandName}", location "${locationName}"`).to.be.at.least(1);
        });
        return this;
    }

    /**
     * Click View for the menu row that has the given location (when same menu appears in multiple rows per location).
     */
    public step_click_view_button_for_menu_row_with_location(menuName: string, locationName: string) {
        cy.get('.gt-tr').then(($rows) => {
            const $ = $rows.constructor as JQueryStatic;
            const row = $rows.filter(function () {
                const t = $(this).text();
                return t.includes(menuName) && t.includes(locationName);
            }).first();
            if (row.length === 0) {
                throw new Error(`No row found with menu "${menuName}" and location "${locationName}"`);
            }
            cy.wrap(row).trigger('mouseenter').trigger('mouseover');
            cy.wait(300);
            cy.wrap(row).find('.view-menu').invoke('css', 'display', 'block').find('a').click({ force: true });
        });
        cy.wait(2000);
        return this;
    }
}
