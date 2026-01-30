export class MenuPage {
    private lbl_menu_title = '[data-cy="undefined-title"]';

    //==============OVERVIEW TAB SELECTORS==============
    private lbl_overview_title = '[data-cy="overview-title"]';
    private txt_overview_name = '[data-cy="menu-overview-name-input"]';
    private btn_overview_brand_select = '.gap-xl > :nth-child(2) > [data-cy="hover-select"]';
    private txt_overview_description = '[data-cy="menu-overview-description-input-input"]';
    private txt_overview_external_id = '[data-cy="menu-overview-external-id"]';

    //==============TAX MANAGER SELECTORS==============
    private chk_tax_manager_custom_tax = '[data-cy="tax-manager-custom-tax-checkbox-label"]';
    private chk_tax_manager_custom_tax_checkbox = '[data-cy="tax-manager-custom-tax-checkbox"]';
    private txt_basic_auto_complete_input = '[data-cy="basic-auto-complete"]';
    private btn_tax_manager_add_button = '[data-cy="tax-manager-add-button-button-label"]';

    //==============CATEGORY TAB SELECTORS==============
    private tab_category_products = '[data-tab-id="category-products"]';
    private lbl_category_products_title = '[data-cy="categories-title"]';

    //==============PUBLISH TAB SELECTORS==============
    private tab_publish = '[data-tab-id="publish"]';
    // Button to add new category (initial state - card button)
    private btn_category_products_add_initial = '[data-cy="category-products-category-handler-create-category-card-button"]';
    // Button to add new category (after categories exist - header button)
    private btn_category_products_add_header = '[data-cy="category-products-category-handler-create-category-button"]';
    private txt_category_products_name = '[data-cy="category-name"]';
    private btn_category_saving_hours_modal = '[data-cy="category-products-category-handler-manage-category-modal-serving-hours-label"]';
    private btn_category_save = '[data-cy="undefined-save-button"]';

    //==============BULK ADD CATEGORY SELECTORS==============
    // Initial bulk add button (when no categories exist - card view)
    private btn_bulk_add_category_initial = '[data-cy="category-products-category-handler-bulk-add-category-card-button"]';
    // Bulk add button after categories exist (in header area)
    private btn_bulk_add_category_header = '[data-cy="category-products-category-handler-bulk-add-category-button"]';
    private txt_bulk_category_search = '[data-cy="enter-search-category-name-input"]';
    private btn_add_categories_save = '[data-cy="add-categories-button"]';

    //==============PRODUCT SELECTION IN CATEGORY==============
    // Search product input uses placeholder-based selector since data-cy is empty
    // Use partial match to handle variations like "Enter product name" vs "Enter product name.."
    private txt_search_product_input = 'input[placeholder*="product name"]';

    public verify_menu_title() {
        cy.get(this.lbl_menu_title).should('have.text', 'Create New Menu');
        return this;
    }

    public verify_overview_title() {
        cy.get(this.lbl_overview_title).should('have.text', 'Menu Overview');
        return this;
    }

    public step_enter_overview_name(name: string) {
        cy.get(this.txt_overview_name).type(name);
        return this;
    }

    public step_click_overview_brand_select() {
        cy.get(this.btn_overview_brand_select).click();
        return this;
    }

    public step_click_overview_brand_select_option(option: string) {
        cy.contains(option).click();
        return this;
    }

    public step_enter_overview_description(description: string) {
        cy.get(this.txt_overview_description).type(description);
        return this;
    }

    public step_enter_overview_external_id(external_id: string) {
        cy.get(this.txt_overview_external_id).type(external_id);
        return this;
    }

    public step_select_currency_dropdown() {
        cy.get(':nth-child(1) > [data-cy="hover-select"]').click();
        return this;
    }

    public step_select_currency_dropdown_option(option: string) {
        cy.contains(option).click();
        return this;
    }

    //==============TAX MANAGER FUNCTIONS==============
    public verify_tax_manager_text() {
        cy.get(this.chk_tax_manager_custom_tax).should('have.text', 'Apply menu level tax');
        return this;
    }

    public step_click_tax_manager_custom_tax_checkbox() {
        cy.get(this.chk_tax_manager_custom_tax_checkbox).click({ force: true });
        return this;
    }

    public step_click_tax_manager_custom_tax_input() {
        cy.get(this.txt_basic_auto_complete_input).click({ force: true });
        return this;
    }

    public step_click_tax_manager_new_tax_add_button() {
        cy.contains('.gc3ui-popover-item-content', 'Add New Tax').click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_enter_tax_name(taxName: string) {
        cy.get('[data-cy="enter-tax-name-input-input"]')
            .should('be.visible')
            .clear()
            .type(taxName);
        return this;
    }

    public step_enter_tax_value(taxValue: string) {
        cy.get('[data-cy="enter-tax-value-input-input"]')
            .should('be.visible')
            .clear()
            .type(taxValue);
        return this;
    }

    public step_click_tax_confirm_button() {
        cy.get('[data-cy="tax-manager-tax-add-button"]').click({ force: true });
        cy.wait(1000);
        return this;
    }

    // Combined method to create a new tax
    public step_create_new_tax(taxName: string, taxValue: string) {
        this.step_click_tax_manager_new_tax_add_button();
        this.step_enter_tax_name(taxName);
        this.step_enter_tax_value(taxValue);
        this.step_click_tax_confirm_button();
        return this;
    }

    public step_click_tax_manager_add_button() {
        cy.get(this.btn_tax_manager_add_button).should('be.visible');
        cy.get(this.btn_tax_manager_add_button).click();
        return this;
    }

    //==============CATEGORY FUNCTIONS==============
    public step_click_category_products_tab() {
        cy.get(this.tab_category_products).should('be.visible');
        cy.get(this.tab_category_products).click();
        return this;
    }

    //==============PUBLISH TAB FUNCTIONS==============
    public step_click_publish_tab() {
        cy.get(this.tab_publish).should('be.visible');
        cy.get(this.tab_publish).click();
        cy.wait(2000);
        return this;
    }

    public verify_category_products_title() {
        cy.get(this.lbl_category_products_title).should('have.text', 'Categories & Products');
        return this;
    }

    // Click "Create New" category button - initial state (when no categories exist)
    public step_click_create_category_initial() {
        cy.wait(2000);
        cy.get(this.btn_category_products_add_initial).click({ force: true });
        cy.wait(1000);
        return this;
    }

    // Click "Create New" category button - header state (when categories exist)
    public step_click_create_category_header() {
        cy.wait(2000);
        cy.get(this.btn_category_products_add_header).click({ force: true });
        cy.wait(1000);
        return this;
    }

    // Smart create category - tries header first, falls back to initial
    public step_click_create_category() {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            if ($body.find(this.btn_category_products_add_header).length > 0) {
                cy.get(this.btn_category_products_add_header).click({ force: true });
            } else {
                cy.get(this.btn_category_products_add_initial).click({ force: true });
            }
        });
        cy.wait(1000);
        return this;
    }

    public step_enter_category_products_name(name: string) {
        cy.get(this.txt_category_products_name).type(name);
        cy.wait(1000);
        return this;
    }

    public step_click_category_saving_hours_modal() {
        cy.get(this.btn_category_saving_hours_modal).click();
        return this;
    }

    public step_click_category_save() {
        cy.get(this.btn_category_save).click();
        cy.wait(3000);
        return this;
    }

    //==============BULK ADD EXISTING CATEGORIES==============
    // Initial bulk add (when no categories exist yet)
    public step_click_bulk_add_category_initial() {
        cy.wait(2000);
        cy.get(this.btn_bulk_add_category_initial).click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Bulk add after categories exist (button in header)
    public step_click_bulk_add_category_header() {
        cy.wait(2000);
        cy.get(this.btn_bulk_add_category_header).click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Smart bulk add - tries header button first, falls back to initial
    public step_click_bulk_add_category() {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            // Check if header button exists (categories already added)
            if ($body.find(this.btn_bulk_add_category_header).length > 0) {
                cy.get(this.btn_bulk_add_category_header).click({ force: true });
            } else {
                // Fall back to initial button
                cy.get(this.btn_bulk_add_category_initial).click({ force: true });
            }
        });
        cy.wait(2000);
        return this;
    }

    public step_search_and_select_existing_category(categoryName: string) {
        cy.get(this.txt_bulk_category_search).clear().type(categoryName);
        cy.wait(2000);
        // Select the matching category from search results
        cy.get('[data-cy^="hierarchical-table-select-"]')
            .filter(':visible')
            .first()
            .click({ force: true });
        return this;
    }

    public step_click_add_categories_save() {
        cy.get(this.btn_add_categories_save).click();
        cy.wait(3000);
        return this;
    }

    //==============ADD PRODUCTS TO CATEGORY==============
    // Expand the category section (it's collapsed by default)
    public step_expand_category_section() {
        cy.wait(1000);
        // Click the collapsible trigger to expand (data-state="closed" -> "open")
        cy.get('[data-slot="collapsible-trigger"][data-state="closed"]')
            .last()
            .click({ force: true });
        cy.wait(1000);
        return this;
    }

    // Click "+ Add Products" button - smart detection of which button to use
    public step_click_add_products_to_category() {
        cy.wait(2000);
        
        // Scroll down to make sure buttons are visible
        cy.scrollTo('bottom', { ensureScrollable: false });
        cy.wait(1000);
        
        cy.get('body').then(($body) => {
            // Try data-cy="add-modifier-button-" first (used after products added to category)
            const addModifierBtn = $body.find('[data-cy="add-modifier-button-"]').filter(':visible');
            if (addModifierBtn.length > 0) {
                cy.get('[data-cy="add-modifier-button-"]').filter(':visible').last().scrollIntoView().click({ force: true });
            }
            // Try data-cy="create-modifier-button" (used for category 2+ initial state)
            else if ($body.find('[data-cy="create-modifier-button"]').filter(':visible').length > 0) {
                cy.get('[data-cy="create-modifier-button"]').filter(':visible').last().scrollIntoView().click({ force: true });
            } 
            // Fallback to text-based selector for category 1 initial state
            else {
                cy.contains('button', 'Add Products').last().scrollIntoView().click({ force: true });
            }
        });
        cy.wait(2000);
        return this;
    }

    // Click "+ Add Products" button for first category (index 0)
    public step_click_add_products_to_category_initial() {
        cy.wait(2000);
        // First category uses text-based selector
        cy.contains('button', 'Add Products').last().click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Click "+ Add Products" button for subsequent categories (index > 0)
    public step_click_add_products_to_category_header() {
        cy.wait(2000);
        // Subsequent categories use data-cy="create-modifier-button"
        cy.get('[data-cy="create-modifier-button"]').filter(':visible').last().click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Click Add Products for a specific category by finding it within that category section
    public step_click_add_products_for_category(categoryName: string) {
        cy.wait(2000);
        
        // Find the category section by name
        cy.contains(categoryName)
            .closest('[data-slot="collapsible"]')
            .then(($categorySection) => {
                // Scroll category into view
                cy.wrap($categorySection).scrollIntoView();
                cy.wait(500);
                
                // Within this category section, find the Add Products button
                // Try different selectors based on state
                const addModifierBtn = $categorySection.find('[data-cy="add-modifier-button-"]');
                const createModifierBtn = $categorySection.find('[data-cy="create-modifier-button"]');
                const textBtn = $categorySection.find('button:contains("Add Products")');
                
                if (addModifierBtn.length > 0) {
                    cy.wrap(addModifierBtn).first().click({ force: true });
                } else if (createModifierBtn.length > 0) {
                    cy.wrap(createModifierBtn).first().click({ force: true });
                } else if (textBtn.length > 0) {
                    cy.wrap(textBtn).first().click({ force: true });
                }
            });
        
        cy.wait(2000);
        return this;
    }

    public step_search_and_select_product(productName: string, displayName?: string) {
        // Wait for modal to be ready
        cy.wait(1000);
        
        // Get the last character of the product name
        const lastChar = productName.slice(-1);
        
        // Find the search input - focus it first by clicking directly
        cy.get('input[placeholder*="product name"]')
            .should('be.visible')
            .focus()  // Explicitly focus the input
            .clear()
            .should('have.value', '')  // Verify it's cleared
            .type(productName, { delay: 100 })  // Type with delay
            .type('{backspace}')  // Remove last letter
            .wait(500)
            .type(lastChar, { delay: 100 });  // Add it back to trigger search
        
        // Wait for search results to filter
        cy.wait(3000);
        
        // Verify the search has filtered results - use displayName if provided
        if (displayName) {
            cy.contains(displayName).should('be.visible');
        }
        
        // Select the product by finding its row and clicking the checkbox
        // Note: UI displays "display name" but search uses "product name"
        // Exclude the "Select All" checkbox in header by using :not([data-cy*="all"])
        cy.get('[data-cy^="product-table-select-"]:not([data-cy*="all"])')
            // .filter(':visible')
            // .first()
            // .should('be.visible')
            .click({ force: true });
        
        // Wait for selection to register
        cy.wait(1000);
        return this;
    }

    public step_click_add_products_save() {
        // Use data-cy="-button-label" to find the button label, then click parent button
        cy.get('[data-cy="-button-label"]').contains('Add Products').last().parent('button').click({ force: true });
        // Wait for modal to close
        cy.wait(3000);
        return this;
    }

    //==============CREATE/SAVE MENU==============
    public step_click_create_button() {
        cy.wait(2000);
        cy.get('[data-cy="create-button"]').click();
        return this;
    }

    public verify_menu_toast_message(message: string) {
        cy.get('[data-cy="title"]').should('have.text', message);
        return this;
    }

    public verify_menu_toast_message_text(name: string) {
        cy.get('[data-cy="description"]').should('contain.text', name);
        return this;
    }
}
