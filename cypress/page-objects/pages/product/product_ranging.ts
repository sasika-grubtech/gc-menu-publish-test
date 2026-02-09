export class ProductRangingPage {

    private lbl_ranging_header = '[data-cy="filter-drawer-title-left"]';
    private lbl_ranging_header_description = '[data-cy="filter-drawer-title-left-description"]';

    private lbl_brand_ranging = '[data-cy="BRANDS-label"]'
    private lbl_location_ranging = '[data-cy="LOCATIONS-label"]'
    private lbl_platform_ranging = '[data-cy="PLATFORMS-label"]'
    private lbl_service_model_ranging = '[data-cy="SERVICE_MODES-label"]'


    private lbl_side_drawer_title = '[data-cy="filter-drawer-title-right"]';
    private lbl_side_drawer_title_description = '[data-cy="filter-drawer-title-right-description"]';

    private btn_apply_filters = '[data-cy="apply-filters-button-label"]';

    public verify_ranging_header_text() {
        cy.get(this.lbl_ranging_header).should('be.visible');
        cy.get(this.lbl_ranging_header).should('have.text', 'Ranging');
        return this;
    }

    public verify_ranging_header_description_text() {
        cy.get(this.lbl_ranging_header_description).should('be.visible');
        cy.get(this.lbl_ranging_header_description).should('have.text', 'Ranging applied to the items.');
        return this;
    }

    public step_click_brand_ranging_text() {
        cy.get('[data-cy="6152b5e017f264649a52f7c3"]').click({ force: true });
        return this;
    }

    public verify_location_ranging_text() {
        cy.wait(2000);
        cy.get(':nth-child(3) > .border-primary > .justify-between > [data-cy="basic-radio"] > .flex').click({ force: true });
        cy.get('[data-cy="61fb95a03e21545b1a78bd4b"]').click({ force: true });
        cy.wait(2000);
        return this;
    }

    public verify_platform_ranging_text() {
        cy.wait(2000);
        cy.get(':nth-child(4) > .border-primary > .justify-between > [data-cy="basic-radio"] > .flex > [data-cy="filter-selection"]').click({ force: true });
        cy.wait(2000);
        //cy.get(this.lbl_platform_ranging).should('have.text', 'Platforms');
        return this;
    }

    public verify_service_model_ranging_text() {
        cy.wait(2000);
        cy.get(':nth-child(5) > .border-primary > .justify-between > [data-cy="basic-radio"] > .flex > [data-cy="filter-selection"]').click({ force: true });
        cy.get('[data-cy="DELIVERY_BY_FOOD_AGGREGATOR"]')
        cy.wait(2000);
        return this;
    }


    public verify_side_drawer_title_text(text: string) {
        //cy.wait(3000);
        cy.get(this.lbl_side_drawer_title).should('be.visible');
        cy.get(this.lbl_side_drawer_title).should('have.text', text);
        return this;
    }

    public verify_side_drawer_title_description_text(text: string) {
        cy.get(this.lbl_side_drawer_title_description).should('be.visible');
        cy.get(this.lbl_side_drawer_title_description).should('have.text', text);
        return this;
    }

    public step_click_location_ranging_button() {
        cy.get(this.lbl_location_ranging)
            .should('be.visible')
            .should('not.be.disabled')
            .scrollIntoView()
            .wait(500) // Small wait to handle any animations
            .click({ force: true });
        return this;
    }

    public step_click_platform_ranging_button() {
        cy.get(this.lbl_platform_ranging)
            .should('be.visible')
            .should('not.be.disabled')
            .scrollIntoView()
            .wait(500) // Small wait to handle any animations
            .click({ force: true });
        return this;
    }

    public step_click_service_model_ranging_button() {
        cy.get(this.lbl_service_model_ranging)
            .should('be.visible')
            .should('not.be.disabled')
            .scrollIntoView()
            .wait(500) // Small wait to handle any animations
            .click({ force: true });
        return this;
    }

    public step_apply_filters() {
        cy.get(this.btn_apply_filters).should('be.visible').click({ force: true });
        cy.wait(2000); // Wait for filtering to complete
        return this;
    }
}