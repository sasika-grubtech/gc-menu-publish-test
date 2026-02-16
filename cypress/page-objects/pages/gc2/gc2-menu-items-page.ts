export class GC2MenuItemsPage {
    // Search field (input may have placeholder "Search" or "Search..."; prefer placeholder match, fallback to any input in container)
    private search_container = '#search-summary';
    private search_input = '#search-summary input[placeholder="Search"]';
    
    // View button (appears on hover)
    private view_button = '.view-menu a';

    //==============PAGE VERIFICATION==============
    public verify_page_loaded() {
        cy.url().should('include', '/menu-management/menu-items');
        cy.wait(2000);
        return this;
    }

    //==============SEARCH==============
    public step_search_menu_item(searchTerm: string) {
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
    public verify_menu_item_exists(menuItemName: string) {
        cy.contains(menuItemName).should('be.visible');
        return this;
    }

    public verify_menu_item_not_exists(menuItemName: string) {
        cy.contains(menuItemName).should('not.exist');
        return this;
    }

    //==============VIEW/EDIT ACTIONS==============
    public step_click_view_button_for_menu_item(menuItemName: string) {
        // Find the row containing the menu item and hover to reveal View button
        cy.contains(menuItemName)
            .closest('[role="row"]')
            .trigger('mouseover')
            .find(this.view_button)
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    public step_click_first_view_button() {
        // Click the first View button in the list (useful after search)
        cy.get(this.view_button).first().click({ force: true });
        cy.wait(2000);
        return this;
    }

    //==============EDIT PAGE LOCATORS==============
    private txt_recipe_name = 'input[e2e="recipe-name"]';
    private lbl_brand = '#brand.gc-routing-label-widget';
    private txt_external_id = 'input[e2e="external-id"]';
    private drp_currency = '.search-input__single-value';
    private txt_price = 'input.gt-currency-input';
    private tag_item = '.gt-tag';

    //==============VERIFY EDIT PAGE==============
    public verify_edit_page_loaded() {
        cy.url().should('match', /\/menu-management\/menu-items\/[a-f0-9]+/);
        cy.wait(2000);
        return this;
    }

    public verify_menu_item_name_on_edit_page(expectedName: string) {
        cy.get(this.txt_recipe_name).should('have.value', expectedName);
        return this;
    }

    public verify_brand_on_edit_page(expectedBrand: string) {
        cy.get(this.lbl_brand).should('contain.text', expectedBrand);
        return this;
    }

    public verify_external_id_on_edit_page(expectedExternalId: string) {
        cy.get(this.txt_external_id).should('have.value', expectedExternalId);
        return this;
    }

    public verify_currency_on_edit_page(expectedCurrency: string) {
        cy.get(this.drp_currency).should('contain.text', expectedCurrency);
        return this;
    }

    public verify_price_on_edit_page(expectedPrice: string) {
        cy.get(this.txt_price).first().should('have.value', expectedPrice);
        return this;
    }

    public verify_tag_exists_on_edit_page(tagName: string) {
        cy.get(`${this.tag_item}[e2e="${tagName}"]`).should('be.visible').and('contain.text', tagName);
        return this;
    }

    public verify_menu_item_details(expectedName: string, expectedBrand: string) {
        this.verify_menu_item_name_on_edit_page(expectedName);
        this.verify_brand_on_edit_page(expectedBrand);
        return this;
    }

    public verify_full_menu_item_details(
        expectedName: string,
        expectedBrand: string,
        expectedExternalId: string,
        expectedCurrency: string,
        expectedPrice: string,
        expectedTags: string[]
    ) {
        this.verify_menu_item_name_on_edit_page(expectedName);
        this.verify_brand_on_edit_page(expectedBrand);
        this.verify_external_id_on_edit_page(expectedExternalId);
        this.verify_currency_on_edit_page(expectedCurrency);
        this.verify_price_on_edit_page(expectedPrice);
        expectedTags.forEach(tag => {
            this.verify_tag_exists_on_edit_page(tag);
        });
        return this;
    }

    /**
     * After searching, verify the number of table rows that contain the menu item name.
     * Use for scenarios where same product name can appear multiple times (e.g. different prices).
     */
    public verify_menu_item_row_count_after_search(menuItemName: string, expectedCount: number) {
        cy.get('[role="row"]').then(($rows) => {
            const $ = $rows.constructor as JQueryStatic;
            const matching = $rows.filter(function () {
                return $(this).text().includes(menuItemName);
            });
            expect(matching.length, `Menu items with name "${menuItemName}"`).to.eq(expectedCount);
        });
        return this;
    }

    /**
     * Click View on the nth row (0-based) that contains the given name. Use after search when multiple rows match.
     */
    public step_click_view_button_for_row_index(menuItemName: string, rowIndex: number) {
        cy.get('[role="row"]').then(($rows) => {
            const $ = $rows.constructor as JQueryStatic;
            const matching = $rows.filter(function () {
                return $(this).text().includes(menuItemName);
            });
            expect(matching.length).to.be.at.least(rowIndex + 1);
            cy.wrap(matching.eq(rowIndex)).trigger('mouseover');
            cy.wrap(matching.eq(rowIndex)).find(this.view_button).click({ force: true });
        });
        cy.wait(2000);
        return this;
    }

    //==============COMBINED ACTIONS==============
    public search_and_verify_menu_item(menuItemName: string) {
        this.step_search_menu_item(menuItemName);
        this.verify_menu_item_exists(menuItemName);
        return this;
    }

    public search_and_open_menu_item(menuItemName: string) {
        this.step_search_menu_item(menuItemName);
        this.verify_menu_item_exists(menuItemName);
        this.step_click_first_view_button();
        this.verify_edit_page_loaded();
        return this;
    }
}
