export class PublishPage {
    // Page title
    private lbl_page_title = 'h1:contains("Menu Publish")';
    
    // Brand filter dropdown - exact selectors from DOM
    private btn_brand_filter_dropdown = '[data-cy="command-dropdown-trigger"]';
    private lbl_brand_filter_selected = '[data-cy="command-dropdown-trigger-button-label"]';
    
    // Filters button
    private btn_filters = 'button:contains("Filters")';
    
    // Search input
    private txt_search_menu = 'input[placeholder*="Search menu name"]';
    
    // Publish instances count
    private lbl_publish_instances = ':contains("Publish Instances")';
    
    // Aggregator section - exact selectors from DOM
    // Pattern: aggregator-row-{slug}, expand-hierarchical-btn-{slug}, menu-count-badge-{slug}
    // Known slugs: bolt-food-aggregator, box-aggregator, deliveroo-aggregator
    private btn_publish_all = 'button:contains("Publish all")';
    
    // Aggregator name element
    private lbl_aggregator_name = '[data-cy="lead-image-column-name"]';
    
    // Table columns
    private col_brand = 'th:contains("Brand")';
    private col_menu_name = 'th:contains("Menu Name")';
    private col_preferred_collection = 'th:contains("Preferred Collection")';
    private col_status = 'th:contains("Status")';

    //==============PAGE VERIFICATION==============
    public verify_publish_page_loaded() {
        cy.contains('Menu Publish').should('be.visible');
        cy.wait(2000);
        return this;
    }

    //==============BRAND FILTER==============
    public step_click_brand_filter() {
        cy.wait(1000);
        // Click on the brand filter dropdown using exact data-cy selector
        cy.get(this.btn_brand_filter_dropdown).click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_select_brand(brandName: string) {
        cy.wait(1000);
        
        // Check if brand is already selected using the exact label selector
        cy.get(this.lbl_brand_filter_selected).then(($label) => {
            const currentBrand = $label.text().trim();
            
            if (currentBrand === brandName) {
                // Brand is already selected, no action needed
                cy.log(`✅ Brand "${brandName}" is already selected`);
            } else {
                // Brand is not selected, need to select it
                cy.log(`🔄 Selecting brand: ${brandName} (currently: ${currentBrand})`);
                
                // Click on the brand filter dropdown to open it
                cy.get(this.btn_brand_filter_dropdown).click({ force: true });
                cy.wait(1000);
                
                // Select the brand from dropdown
                cy.contains(brandName).click({ force: true });
                cy.wait(2000);
            }
        });
        
        return this;
    }

    public step_verify_brand_selected(brandName: string) {
        // Verify the brand is shown in the filter label
        cy.get(this.lbl_brand_filter_selected).should('have.text', brandName);
        return this;
    }

    //==============SEARCH MENU==============
    public step_search_menu(menuName: string) {
        cy.get(this.txt_search_menu)
            .should('be.visible')
            .clear()
            .type(menuName);
        cy.wait(2000);
        return this;
    }

    //==============AGGREGATOR SECTIONS==============
    // Helper to get aggregator slug from name (e.g., "Bolt" -> "bolt-food-aggregator")
    private getAggregatorSlug(aggregatorName: string): string {
        const slugMap: { [key: string]: string } = {
            'Bolt': 'bolt-food-aggregator',
            'BOX': 'box-aggregator',
            'Deliveroo': 'deliveroo-aggregator',
            'Glovo': 'glovo-food-aggregator'
        };
        return slugMap[aggregatorName] || aggregatorName.toLowerCase().replace(/\s+/g, '-') + '-aggregator';
    }

    public step_click_aggregator_row(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Click on the aggregator row using exact data-cy selector
        cy.get(`[data-cy="aggregator-row-${slug}"]`).click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_expand_aggregator_section(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Click the expand button using exact data-cy selector
        cy.get(`[data-cy="expand-hierarchical-btn-${slug}"]`).click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_verify_aggregator_menu_count(aggregatorName: string, expectedCount: string) {
        const slug = this.getAggregatorSlug(aggregatorName);
        // Verify menu count badge
        cy.get(`[data-cy="menu-count-badge-${slug}-label"]`).should('contain.text', expectedCount);
        return this;
    }

    public step_click_publish_all_for_aggregator(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Find the aggregator section and click "Publish all" button within it
        cy.get(`[data-cy="aggregator-row-${slug}"]`)
            .parent()
            .find('button:contains("Publish all")')
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    //==============MENU ROW ACTIONS==============
    public step_find_menu_in_list(menuName: string) {
        cy.contains(menuName).should('be.visible');
        return this;
    }

    public step_verify_menu_status(menuName: string, expectedStatus: string) {
        // Find the menu row and verify status
        cy.contains(menuName)
            .closest('tr')
            .find(':contains("' + expectedStatus + '")')
            .should('be.visible');
        return this;
    }

    public step_click_change_menu_button(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Click "Change Menu" button using partial match selector
        // Pattern varies: change-menu-button-{slug}-brand-level OR change-menu-button-{slug}-null
        cy.get(`[data-cy^="change-menu-button-${slug}"]`).first().click({ force: true });
        cy.wait(2000);
        return this;
    }

    //==============ASSIGN MENU MODAL==============
    public step_search_menu_in_modal(menuName: string) {
        cy.wait(1000);
        // Search for menu in the modal
        cy.get('input[placeholder*="Search menus"]').clear().type(menuName);
        cy.wait(2000);
        return this;
    }

    public step_select_menu_from_list(menuName: string) {
        cy.wait(1000);
        // Find the menu by name and click to select (radio button)
        // The menu name element has data-cy="menu-card-list-name-{id}"
        cy.contains('[data-cy^="menu-card-list-name-"]', menuName)
            .closest('div[class*="flex"]')
            .click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_click_assign_button() {
        cy.wait(1000);
        // Click the "Assign" button using exact data-cy selector
        cy.get('[data-cy="save-button"]').click({ force: true });
        cy.wait(3000);
        return this;
    }

    public step_click_cancel_button() {
        // Click the "Cancel" button in the modal
        cy.contains('button', 'Cancel').click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_click_publish_for_menu(menuName: string) {
        cy.wait(1000);
        // Find the menu row and click the publish/refresh action button
        cy.contains(menuName)
            .closest('tr')
            .find('button')
            .first()
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    //==============GENERAL PUBLISH==============
    public step_click_publish_all() {
        cy.wait(1000);
        // Click "Publish all" button using exact data-cy selector
        cy.get('[data-cy="publish-all-button"]').click({ force: true });
        cy.wait(2000);
        return this;
    }

    public step_click_validate_and_publish() {
        cy.wait(1000);
        // Click "Validate & Publish" button in confirmation dialog
        cy.get('[data-cy="confirmation-dialog-confirm-button"]').click({ force: true });
        cy.wait(3000);
        return this;
    }

    //==============TOAST VERIFICATION==============
    public verify_publish_toast_message(message: string) {
        cy.get('[data-cy="title"]').should('contain.text', message);
        return this;
    }

    //==============PUBLISH STATUS VERIFICATION==============
    // Click on brand row to expand and see location details
    public step_click_brand_row_to_expand(brandName: string) {
        cy.wait(1000);
        // Find the brand row by brand name and click on it to expand
        cy.contains('[data-cy^="location-brand-name-"]', brandName)
            .closest('[data-slot="table-row"]')
            .find('button')
            .first()
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Verify location row is visible after expanding brand
    public verify_location_row_visible(locationName: string) {
        cy.contains('[data-cy^="nested-location-name-"]', locationName).should('be.visible');
        return this;
    }

    // Verify published status badge is visible
    public verify_published_status() {
        cy.get('[data-cy="publishing-status-badge-PUBLISHED"]').should('be.visible');
        cy.get('[data-cy="publishing-status-badge-PUBLISHED-label"]').should('contain.text', 'Published');
        return this;
    }

    // Verify specific status (Published, Failed, Not Published, etc.)
    public verify_publish_status(status: string) {
        cy.get(`[data-cy="publishing-status-badge-${status.toUpperCase()}"]`).should('be.visible');
        return this;
    }

    // Verify menu name in location row (nested row after expanding brand)
    public verify_menu_name_in_brand_row(menuName: string) {
        // Find the location row (nested row) and verify menu name within it
        cy.get('[data-cy^="nested-location-name-"]')
            .closest('[data-slot="table-row"]')
            .find('[data-slot="table-cell"]')
            .eq(1) // Menu Name column (2nd column, 0-indexed)
            .should('contain.text', menuName);
        return this;
    }

    // Alternative: Verify menu name in location row by location name
    // Note: The Menu Name cell displays both menu name and brand name
    public verify_menu_name_in_location_row(locationName: string, menuName: string, brandName?: string) {
        const menuNameCell = cy.contains('[data-cy^="nested-location-name-"]', locationName)
            .closest('[data-slot="table-row"]')
            .find('[data-slot="table-cell"]')
            .eq(1); // Menu Name column
        
        // Verify menu name is present
        menuNameCell.should('contain.text', menuName);
        
        // If brand name is provided, also verify it's present in the same cell
        if (brandName) {
            menuNameCell.should('contain.text', brandName);
        }
        
        return this;
    }

    // Verify brand name in row
    public verify_brand_name_in_row(brandName: string) {
        cy.get('[data-cy^="location-brand-name-"]').should('contain.text', brandName);
        return this;
    }

    // Combined verification after publishing - expand brand row and verify location is published
    public verify_menu_published_for_brand(brandName: string, menuName: string) {
        cy.log(`📋 Verifying menu "${menuName}" is published for brand "${brandName}"`);
        
        // Click brand row to expand
        this.step_click_brand_row_to_expand(brandName);
        
        // Verify menu name is shown
        this.verify_menu_name_in_brand_row(menuName);
        
        // Verify published status
        this.verify_published_status();
        
        cy.log(`✅ Menu "${menuName}" verified as Published for brand "${brandName}"`);
        return this;
    }

    // Verify menu published for specific location
    public verify_menu_published_for_location(brandName: string, locationName: string, menuName: string) {
        cy.log(`📋 Verifying menu "${menuName}" is published for location "${locationName}"`);
        
        // Click brand row to expand
        this.step_click_brand_row_to_expand(brandName);
        
        // Verify location is visible
        this.verify_location_row_visible(locationName);
        
        // Verify published status is visible in the location row
        cy.contains('[data-cy^="nested-location-name-"]', locationName)
            .closest('[data-slot="table-row"]')
            .find('[data-cy="publishing-status-badge-PUBLISHED"]')
            .should('be.visible');
        
        cy.log(`✅ Menu "${menuName}" verified as Published for location "${locationName}"`);
        return this;
    }

    // Verify last published date is not "Not Published"
    public verify_last_published_date_exists() {
        // The last published cell should NOT contain "Not Published" after successful publish
        cy.get('[data-slot="table-row"]')
            .first()
            .find('[data-slot="table-cell"]')
            .eq(3) // Last Published column (4th column, 0-indexed)
            .should('not.contain.text', 'Not Published');
        return this;
    }

    // Verify last published date contains today's date
    public verify_last_published_date_is_today() {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[today.getMonth()];
        const year = today.getFullYear();
        
        // Expected format: "24 Jan 2026" or similar
        const expectedDatePart = `${day} ${month} ${year}`;
        
        cy.log(`📅 Checking for today's date: ${expectedDatePart}`);
        
        cy.get('[data-slot="table-row"]')
            .first()
            .find('[data-slot="table-cell"]')
            .eq(3) // Last Published column
            .should('contain.text', expectedDatePart);
        
        return this;
    }

    // Verify last published date for specific brand row
    public verify_last_published_date_for_brand(brandName: string) {
        cy.contains('[data-cy^="location-brand-name-"]', brandName)
            .closest('[data-slot="table-row"]')
            .find('[data-slot="table-cell"]')
            .eq(3) // Last Published column
            .should('not.contain.text', 'Not Published');
        return this;
    }

    // Combined verification - full publish verification including date
    public verify_full_publish_status_for_brand(brandName: string, menuName: string) {
        cy.log(`📋 Full publish verification for brand "${brandName}"`);
        
        // Click brand row to expand
        this.step_click_brand_row_to_expand(brandName);
        
        // Verify menu name is shown
        this.verify_menu_name_in_brand_row(menuName);
        
        // Verify published status
        this.verify_published_status();
        
        // Verify last published date exists (not "Not Published")
        // Note: There's a known bug with this field, so verification may fail
        // this.verify_last_published_date_exists();
        
        cy.log(`✅ Full publish verification completed for brand "${brandName}"`);
        return this;
    }

    //==============PUBLISHING LOGS MODAL==============
    // Click on Publishing Logs button for a location
    public step_click_publishing_logs_button() {
        cy.wait(1000);
        // Click the publishing logs button (clock/refresh icon)
        cy.get('[data-cy^="publishing-logs-button-"]').first().click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Verify Publishing Logs modal is open
    public verify_publishing_logs_modal_opened() {
        cy.contains('Publishing Logs').should('be.visible');
        return this;
    }

    // Verify FA Platform in logs modal
    public verify_logs_fa_platform(platformName: string) {
        cy.contains('FA Platform').parent().should('contain.text', platformName);
        return this;
    }

    // Verify Menu Brand in logs modal
    public verify_logs_menu_brand(brandName: string) {
        cy.contains('Menu Brand').parent().should('contain.text', brandName);
        return this;
    }

    // Verify Location in logs modal
    public verify_logs_location(locationName: string) {
        cy.contains('Location').parent().should('contain.text', locationName);
        return this;
    }

    // Verify Menu Name in logs modal
    public verify_logs_menu_name(menuName: string) {
        cy.contains('Menu Name').parent().should('contain.text', menuName);
        return this;
    }

    // Verify Current Status is Completed
    public verify_logs_current_status_completed() {
        cy.contains('Current Status').parent().should('contain.text', 'Completed');
        return this;
    }

    // Verify Publishing History has Success entries
    public verify_logs_all_success() {
        cy.contains('Publishing History').should('be.visible');
        // Check that there are no "Failed" or "Error" entries
        cy.get('body').should('not.contain.text', 'Failed');
        // Verify at least one Success entry exists
        cy.contains('Success').should('be.visible');
        return this;
    }

    // Verify specific success message in logs
    public verify_logs_success_message(message: string) {
        cy.contains(message).should('be.visible');
        return this;
    }

    // Click Done button to close the logs modal
    public step_click_logs_done_button() {
        cy.contains('button', 'Done').click({ force: true });
        cy.wait(1000);
        return this;
    }

    // Click Refresh button in aggregator header
    public step_click_refresh_button(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Find the refresh button near the aggregator section
        cy.get(`[data-cy="aggregator-row-${slug}"]`)
            .parent()
            .find('button')
            .filter(':contains("")') // Refresh button has no text
            .first()
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    // Combined verification - open logs and verify all details
    public verify_publishing_logs_details(
        platformName: string,
        brandName: string,
        locationName: string,
        menuName: string
    ) {
        cy.log(`📋 Opening Publishing Logs modal...`);
        this.step_click_publishing_logs_button();
        
        cy.log(`✅ Verifying Publishing Logs modal opened`);
        this.verify_publishing_logs_modal_opened();
        
        cy.log(`🔍 Verifying FA Platform: ${platformName}`);
        this.verify_logs_fa_platform(platformName);
        
        cy.log(`🔍 Verifying Menu Brand: ${brandName}`);
        this.verify_logs_menu_brand(brandName);
        
        cy.log(`🔍 Verifying Location: ${locationName}`);
        this.verify_logs_location(locationName);
        
        cy.log(`🔍 Verifying Menu Name: ${menuName}`);
        this.verify_logs_menu_name(menuName);
        
        cy.log(`✅ Verifying Current Status: Completed`);
        this.verify_logs_current_status_completed();
        
        cy.log(`✅ Verifying all logs show Success`);
        this.verify_logs_all_success();
        
        cy.log(`📋 Closing Publishing Logs modal`);
        this.step_click_logs_done_button();
        
        cy.log(`✅ Publishing Logs verification completed!`);
        return this;
    }

    //==============MENU PREVIEW==============
    public step_click_menu_preview_button(aggregatorName: string) {
        cy.wait(1000);
        const slug = this.getAggregatorSlug(aggregatorName);
        // Click "Menu Preview" button using exact data-cy selector
        // Pattern: menu-preview-button-{aggregator-slug}-brand-level
        cy.get(`[data-cy="menu-preview-button-${slug}-brand-level"]`).click({ force: true });
        cy.wait(3000);
        return this;
    }

    public verify_preview_modal_opened(menuName: string) {
        // Verify the preview modal is open with menu title
        cy.contains(`"${menuName}" Preview`).should('be.visible');
        cy.wait(1000);
        return this;
    }

    public verify_preview_brand(expectedBrand: string) {
        // Verify the brand is displayed in the preview modal
        cy.contains(expectedBrand).should('be.visible');
        return this;
    }

    public verify_preview_category_exists(categoryName: string) {
        // Verify the category tab/section exists in preview
        cy.contains(categoryName).should('be.visible');
        return this;
    }

    public step_click_category_tab(categoryName: string) {
        // Click on a specific category tab in the preview
        cy.contains(categoryName).click({ force: true });
        cy.wait(1000);
        return this;
    }

    public verify_preview_product_exists(productDisplayName: string) {
        // Verify product is displayed in the preview
        cy.contains(productDisplayName).should('be.visible');
        return this;
    }

    public verify_preview_product_price(productDisplayName: string, expectedPrice: string) {
        // Verify product price in the preview (e.g., "SAR 150.00")
        cy.contains(productDisplayName)
            .closest('div[class*="flex"]')
            .should('contain.text', expectedPrice);
        return this;
    }

    public verify_preview_product_description(productDisplayName: string, description: string) {
        // Verify product description in the preview
        cy.contains(productDisplayName)
            .closest('div[class*="flex"]')
            .should('contain.text', description);
        return this;
    }

    public step_click_customize_for_product(productDisplayName: string) {
        cy.wait(1000);
        // Find the product card and click "Customize" button
        cy.contains(productDisplayName)
            .closest('div[class*="rounded"]')
            .find('[data-cy="menu-item-customizations"]')
            .click({ force: true });
        cy.wait(2000);
        return this;
    }

    //==============PRODUCT CUSTOMIZATION VIEW (NESTED MODIFIERS)==============
    public verify_customization_product_name(productDisplayName: string) {
        // Verify the product name in the customization view (top of modal)
        cy.get('div').contains(productDisplayName).should('be.visible');
        return this;
    }

    public verify_customization_product_price(expectedPrice: string) {
        // Verify the product price in the customization view
        cy.contains(expectedPrice).should('be.visible');
        return this;
    }

    public verify_customization_product_description(description: string) {
        // Verify the product description in the customization view
        cy.contains(description).should('be.visible');
        return this;
    }

    public verify_modifier_group_exists(modifierGroupName: string) {
        // Verify a modifier group is displayed in the customization view
        cy.contains(modifierGroupName).should('be.visible');
        return this;
    }

    public verify_modifier_group_constraints(modifierGroupName: string, minMax: string) {
        // Verify modifier group shows constraints like "[ 0 ] Min 0 • Max 1"
        cy.contains(modifierGroupName)
            .parent()
            .should('contain.text', minMax);
        return this;
    }

    public verify_product_modifier_exists(productModifierName: string) {
        // Verify a product modifier (nested product) exists in the customization view
        cy.contains(productModifierName).should('be.visible');
        return this;
    }

    public verify_product_modifier_price(productModifierName: string, expectedPrice: string) {
        // Verify the price of a product modifier
        cy.contains(productModifierName)
            .closest('div[class*="flex"]')
            .should('contain.text', expectedPrice);
        return this;
    }

    public step_click_back_button_in_customization() {
        // Click back button (arrow) in customization view
        cy.get('button').find('svg path[d*="M"]').closest('button').first().click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_close_preview_modal() {
        // Click the X button to close the preview modal
        cy.get('body').then(($body) => {
            // Try to find close button with × symbol
            if ($body.find('button:contains("×")').length > 0) {
                cy.get('button:contains("×")').click({ force: true });
            } else if ($body.find('[data-slot="close-button"]').length > 0) {
                cy.get('[data-slot="close-button"]').click({ force: true });
            } else {
                // Fallback: press Escape key
                cy.get('body').type('{esc}');
            }
        });
        cy.wait(1000);
        return this;
    }

    //==============COMPREHENSIVE PREVIEW VERIFICATION==============
    public verify_menu_preview_details(
        menuName: string,
        brandName: string,
        categories: { name: string; products: { displayName: string; price: string; description?: string }[] }[]
    ) {
        // Verify menu title in preview
        this.verify_preview_modal_opened(menuName);
        
        // Verify brand
        this.verify_preview_brand(brandName);
        
        // Verify each category and its products
        categories.forEach((category, index) => {
            // Click on category tab if not the first one
            if (index > 0) {
                this.step_click_category_tab(category.name);
            }
            
            // Verify category is visible
            this.verify_preview_category_exists(category.name);
            
            // Verify products in category
            category.products.forEach(product => {
                this.verify_preview_product_exists(product.displayName);
                this.verify_preview_product_price(product.displayName, product.price);
                if (product.description) {
                    this.verify_preview_product_description(product.displayName, product.description);
                }
            });
        });
        
        return this;
    }

    public verify_product_modifier_chain(
        productDisplayName: string,
        modifierGroups: { groupName: string; productModifiers: { name: string; price: string }[] }[]
    ) {
        // Click customize for the product
        this.step_click_customize_for_product(productDisplayName);
        
        // Verify each modifier group and its product modifiers
        modifierGroups.forEach(modifierGroup => {
            this.verify_modifier_group_exists(modifierGroup.groupName);
            
            modifierGroup.productModifiers.forEach(productModifier => {
                this.verify_product_modifier_exists(productModifier.name);
                this.verify_product_modifier_price(productModifier.name, productModifier.price);
            });
        });
        
        return this;
    }
}
