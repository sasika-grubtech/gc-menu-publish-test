/**
 * Toast Message Component
 * Handles all toast/notification message interactions and verifications
 * Can be used across all pages for consistent toast message handling
 */
export class ToastMessage {

    // ==================== SELECTORS ====================
    
    private lbl_toast_title = '[data-cy="title"]';
    private lbl_toast_description = '[data-cy="description"]';
    private btn_toast_close = '[data-cy="close-button"]';
    private toast_container = '[data-testid="toast"]';

    // ==================== VERIFICATION METHODS ====================

    /**
     * Verify toast message is visible
     */
    public verify_toast_visible() {
        cy.get(this.lbl_toast_title, { timeout: 10000 }).should('be.visible');
        return this;
    }

    /**
     * Verify toast title contains specific text
     * @param title - Expected text in toast title
     */
    public verify_toast_title(title: string) {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', title);
        cy.log(`✅ Toast title verified: "${title}"`);
        return this;
    }

    /**
     * Verify toast title has exact text
     * @param title - Exact expected toast title
     */
    public verify_toast_title_exact(title: string) {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('have.text', title);
        cy.log(`✅ Toast title exact match: "${title}"`);
        return this;
    }

    /**
     * Verify toast description contains specific text
     * @param description - Expected text in toast description
     */
    public verify_toast_description(description: string) {
        cy.get(this.lbl_toast_description, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', description);
        cy.log(`✅ Toast description verified: "${description}"`);
        return this;
    }

    /**
     * Verify toast description has exact text
     * @param description - Exact expected toast description
     */
    public verify_toast_description_exact(description: string) {
        cy.get(this.lbl_toast_description, { timeout: 10000 })
            .should('be.visible')
            .and('have.text', description);
        cy.log(`✅ Toast description exact match: "${description}"`);
        return this;
    }

    /**
     * Verify success toast message
     * @param message - Expected success message
     */
    public verify_success_toast(message: string) {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', message);
        cy.log(`✅ Success toast verified: "${message}"`);
        return this;
    }

    /**
     * Verify error toast message
     * @param message - Expected error message
     */
    public verify_error_toast(message: string) {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', message);
        cy.log(`⚠️ Error toast verified: "${message}"`);
        return this;
    }

    /**
     * Verify warning toast message
     * @param message - Expected warning message
     */
    public verify_warning_toast(message: string) {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', message);
        cy.log(`⚠️ Warning toast verified: "${message}"`);
        return this;
    }

    /**
     * Verify both title and description of toast
     * @param title - Expected toast title
     * @param description - Expected toast description
     */
    public verify_toast_message(title: string, description: string) {
        this.verify_toast_title(title);
        this.verify_toast_description(description);
        return this;
    }

    /**
     * Verify product created successfully toast
     * @param productName - Name of the product that was created
     */
    public verify_product_created_toast(productName: string) {
        this.verify_toast_title('Product created successfully');
        this.verify_toast_description(productName);
        cy.log(`✅ Product "${productName}" created successfully`);
        return this;
    }

    /**
     * Verify product updated successfully toast
     * @param productName - Name of the product that was updated
     */
    public verify_product_updated_toast(productName: string) {
        this.verify_toast_title('Product updated successfully');
        this.verify_toast_description(productName);
        cy.log(`✅ Product "${productName}" updated successfully`);
        return this;
    }

    /**
     * Verify product deleted successfully toast
     */
    public verify_product_deleted_toast() {
        this.verify_toast_title('Product deleted successfully');
        cy.log(`✅ Product deleted successfully`);
        return this;
    }

    /**
     * Verify duplicate product error toast
     */
    public verify_duplicate_product_toast() {
        cy.get(this.lbl_toast_title, { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', 'already exists');
        cy.log('⚠️ Duplicate product toast verified');
        return this;
    }

    /**
     * Verify menu created successfully toast
     * @param menuName - Name of the menu that was created
     */
    public verify_menu_created_toast(menuName: string) {
        this.verify_toast_title('Menu created successfully');
        this.verify_toast_description(menuName);
        cy.log(`✅ Menu "${menuName}" created successfully`);
        return this;
    }

    /**
     * Verify category created successfully toast
     * @param categoryName - Name of the category that was created
     */
    public verify_category_created_toast(categoryName: string) {
        this.verify_toast_title('Category created successfully');
        this.verify_toast_description(categoryName);
        cy.log(`✅ Category "${categoryName}" created successfully`);
        return this;
    }

    // ==================== ACTION METHODS ====================

    /**
     * Close the toast message
     */
    public close_toast() {
        cy.get(this.btn_toast_close).click({ force: true });
        cy.log('🗙 Toast message closed');
        return this;
    }

    /**
     * Wait for toast to disappear automatically
     * @param timeout - Timeout in milliseconds (default 10000)
     */
    public wait_for_toast_to_disappear(timeout: number = 10000) {
        cy.get(this.lbl_toast_title, { timeout }).should('not.exist');
        cy.log('✅ Toast message disappeared');
        return this;
    }

    /**
     * Verify toast is not visible
     */
    public verify_toast_not_visible() {
        cy.get(this.lbl_toast_title).should('not.exist');
        cy.log('✅ No toast message displayed');
        return this;
    }

    // ==================== CUSTOM VERIFICATION METHODS ====================

    /**
     * Verify toast contains specific keywords
     * @param keywords - Array of keywords to check for
     */
    public verify_toast_contains_keywords(keywords: string[]) {
        keywords.forEach(keyword => {
            cy.get(this.lbl_toast_title, { timeout: 10000 })
                .should('contain.text', keyword);
        });
        cy.log(`✅ Toast contains keywords: ${keywords.join(', ')}`);
        return this;
    }

    /**
     * Get toast title text
     * @returns Chainable with toast title text
     */
    public get_toast_title_text() {
        return cy.get(this.lbl_toast_title, { timeout: 10000 }).invoke('text');
    }

    /**
     * Get toast description text
     * @returns Chainable with toast description text
     */
    public get_toast_description_text() {
        return cy.get(this.lbl_toast_description, { timeout: 10000 }).invoke('text');
    }
}
