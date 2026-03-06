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

    //==============COMPREHENSIVE VERIFICATION METHODS==============

    /**
     * Extract all menu data from the current menu page
     */
    public extract_menu_data() {
        const menuData: any = {};
        
        cy.log('🔍 Extracting menu data from GC2...');
        
        // Extract menu name (from URL or page title)
        return cy.url().then((url) => {
            menuData.url = url;
            return cy.get('input[e2e="menu-name"]').invoke('val');
        }).then((name) => {
            menuData.name = name;
            cy.log(`📋 Menu name: ${name}`);
            
            // Extract brand
            return cy.get('#brand.gc-routing-label-widget').invoke('text');
        }).then((brand) => {
            menuData.brand = brand?.trim();
            cy.log(`🏢 Brand: ${brand}`);
            
            // Extract currency
            return cy.get('.search-input__single-value').first().invoke('text');
        }).then((currency) => {
            menuData.currency = currency?.trim();
            cy.log(`💰 Currency: ${currency}`);
            
            // Extract categories count
            return cy.get('[data-test="category-row"]').then(($cats) => {
                menuData.categoriesCount = $cats.length;
                cy.log(`📁 Categories: ${$cats.length}`);
                return cy.wrap(menuData);
            });
        });
    }

    /**
     * Compare menu details with expected GC3 data
     */
    public compare_menu_with_gc3_data(gc3MenuData: any) {
        return this.extract_menu_data().then((gc2Data) => {
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log('🔍 GC3 vs GC2 Menu Comparison');
            cy.log('═══════════════════════════════════════════════════════════════');
            
            const differences: string[] = [];
            
            // Compare menu name
            if (gc2Data.name !== gc3MenuData.name) {
                differences.push(`Menu Name: GC3="${gc3MenuData.name}" vs GC2="${gc2Data.name}"`);
                cy.log(`❌ Menu name mismatch`);
            } else {
                cy.log(`✅ Menu name matches: ${gc2Data.name}`);
            }
            
            // Compare brand
            if (gc2Data.brand && gc3MenuData.brandName && !gc2Data.brand.includes(gc3MenuData.brandName)) {
                differences.push(`Brand: GC3="${gc3MenuData.brandName}" not in GC2="${gc2Data.brand}"`);
                cy.log(`❌ Brand mismatch`);
            } else {
                cy.log(`✅ Brand matches`);
            }
            
            // Compare categories count
            if (gc3MenuData.categoriesCount && gc2Data.categoriesCount !== gc3MenuData.categoriesCount) {
                differences.push(`Categories: GC3="${gc3MenuData.categoriesCount}" vs GC2="${gc2Data.categoriesCount}"`);
                cy.log(`❌ Categories count mismatch`);
            } else {
                cy.log(`✅ Categories count matches`);
            }
            
            cy.log('═══════════════════════════════════════════════════════════════');
            
            if (differences.length > 0) {
                cy.log(`⚠️ Found ${differences.length} difference(s)`);
                differences.forEach(diff => cy.log(`  - ${diff}`));
            } else {
                cy.log('✅ All menu fields match perfectly!');
            }
            
            return cy.wrap({ match: differences.length === 0, differences });
        });
    }

    /**
     * Verify menu details exactly match expected values
     */
    public verify_menu_details_exact_match(expectedData: {
        name: string;
        brand: string;
        currency: string;
        categoriesCount?: number;
    }) {
        cy.log('🔍 Verifying menu details match exactly...');
        
        // Verify menu name
        cy.get('input[e2e="menu-name"]').should('have.value', expectedData.name);
        cy.log(`✅ Menu name matches: ${expectedData.name}`);
        
        // Verify brand
        cy.get('#brand.gc-routing-label-widget').should('contain.text', expectedData.brand);
        cy.log(`✅ Brand matches: ${expectedData.brand}`);
        
        // Verify currency
        cy.get('.search-input__single-value').first().should('contain.text', expectedData.currency);
        cy.log(`✅ Currency matches: ${expectedData.currency}`);
        
        // Verify categories count if provided
        if (expectedData.categoriesCount) {
            cy.get('[data-test="category-row"]').should('have.length', expectedData.categoriesCount);
            cy.log(`✅ Categories count matches: ${expectedData.categoriesCount}`);
        }
        
        cy.log('✅ All menu details verified!');
        return this;
    }

    /**
     * Get total menu count from the table
     */
    public get_total_menu_count() {
        return cy.get('.gt-tr').then(($rows) => {
            const count = $rows.length - 1; // Subtract header row
            cy.log(`📊 Total menus found: ${count}`);
            return cy.wrap(count);
        });
    }
}
