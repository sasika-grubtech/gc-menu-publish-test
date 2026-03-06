export class GC2ModifierGroupsPage {
    // Search field (same pattern as menu items)
    private search_container = '#search-summary';
    private search_input = '#search-summary input[placeholder="Search"]';

    //==============PAGE VERIFICATION==============
    public verify_page_loaded() {
        cy.url().should('include', '/menu-management/modifier-groups');
        cy.wait(2000);
        // Ensure write permission: set mode=gc2WriteAdmin on current URL so GC2 components display
        cy.url().then((url) => {
            const hasMode = url.includes('mode=gc2WriteAdmin');
            const urlWithMode = hasMode ? url : (url.includes('?') ? `${url}&mode=gc2WriteAdmin` : `${url}?mode=gc2WriteAdmin`);
            cy.visit(urlWithMode);
        });
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

    //==============COMPREHENSIVE VERIFICATION METHODS==============

    /**
     * Get total modifier group count from the table
     */
    public get_total_modifier_group_count() {
        return cy.get('[role="row"]').then(($rows) => {
            const count = $rows.length - 1; // Subtract header row
            cy.log(`📊 Total modifier groups found: ${count}`);
            return cy.wrap(count);
        });
    }

    /**
     * Verify exact count of modifier groups
     */
    public verify_modifier_group_count_exact(expectedCount: number) {
        return this.get_total_modifier_group_count().then((actualCount) => {
            expect(actualCount).to.equal(expectedCount, `Modifier group count should be exactly ${expectedCount}`);
            cy.log(`✅ Modifier group count matches: ${expectedCount}`);
        });
    }

    /**
     * Extract all modifier group names from the table
     */
    public extract_all_modifier_group_names() {
        return cy.get('[role="row"]').then(($rows) => {
            const names: string[] = [];
            $rows.each((index, row) => {
                if (index > 0) { // Skip header row
                    const name = Cypress.$(row).find('td').first().text().trim();
                    if (name) names.push(name);
                }
            });
            cy.log(`📋 Found ${names.length} modifier groups: ${names.join(', ')}`);
            return cy.wrap(names);
        });
    }

    /**
     * Verify modifier group exists with exact name match
     */
    public verify_modifier_group_exact_name(modifierGroupName: string) {
        return this.extract_all_modifier_group_names().then((names) => {
            const found = names.includes(modifierGroupName);
            expect(found).to.be.true;
            cy.log(`✅ Modifier group found: ${modifierGroupName}`);
        });
    }

    /**
     * Compare modifier groups with expected GC3 data
     */
    public compare_modifier_groups_with_gc3_data(gc3ModifierGroups: string[]) {
        return this.extract_all_modifier_group_names().then((gc2Names) => {
            cy.log('═══════════════════════════════════════════════════════════════');
            cy.log('🔍 GC3 vs GC2 Modifier Groups Comparison');
            cy.log('═══════════════════════════════════════════════════════════════');
            
            const differences: string[] = [];
            
            // Check each GC3 modifier group exists in GC2
            gc3ModifierGroups.forEach((gc3Name) => {
                const found = gc2Names.some(gc2Name => gc2Name.includes(gc3Name));
                if (!found) {
                    differences.push(`Missing in GC2: ${gc3Name}`);
                    cy.log(`❌ Missing: ${gc3Name}`);
                } else {
                    cy.log(`✅ Found: ${gc3Name}`);
                }
            });
            
            cy.log('═══════════════════════════════════════════════════════════════');
            
            if (differences.length > 0) {
                cy.log(`⚠️ Found ${differences.length} missing modifier group(s)`);
            } else {
                cy.log('✅ All modifier groups match!');
            }
            
            return cy.wrap({ match: differences.length === 0, differences });
        });
    }
}
