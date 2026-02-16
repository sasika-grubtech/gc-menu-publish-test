import { ProductToasterMessage } from "cypress/page-objects/panel/toaster/product_toaster_message";
import { ProductHomePage } from "./product_home_page";
import { faker } from '@faker-js/faker';

export class ProductCreatePage {

    // =============================================================================
    // PAGE HEADER SELECTORS
    // =============================================================================
    private lbl_create_new_product_title = '[data-cy="undefined-title"]';
    private lbl_product_header_description = '[data-cy="undefined-description"]';

    // =============================================================================
    // ACTION BUTTON SELECTORS
    // =============================================================================
    private btn_translation = '[data-cy="translation-button"]';
    private btn_create_product = '[data-cy="create-product-button"]';
    private btn_cancel = '[data-cy="cancel-button"]';
    

    // =============================================================================
    // OVERVIEW TAB SELECTORS
    // =============================================================================
    private lbl_overview_title = '[data-cy="product-overview-title"]';
    private lbl_overview_description = '[data-cy="product-overview-description"]';

    // =============================================================================
    // External Id Fields
    private txt_external_id = '[data-cy="product-overview-external-id"]';


    // Product Name Fields
    private lbl_product_name = '[data-cy="product-overview-name-label"]';
    private txt_product_name = '[data-cy="product-overview-name"]';

    // Product Display Name Fields
    private lbl_product_display_name = '[data-cy="product-overview-display-name-label"]';
    private txt_product_display_name = '[data-cy="product-overview-display-name"]';

    // Product Description Fields
    private lbl_product_description = '[data-cy="product-overview-description-label"]';
    private txt_product_description = '[data-cy="product-overview-description-input"]';

    // Category Fields
    private btn_category_select = '[data-cy="multiselect-autocomplete-input"]';
    private btn_add_new_category = '[data-cy="add-category-label"]';
    private txt_add_new_category = '[data-cy="add-category-input-input"]';
    private btn_add_category_save = '[data-cy="add-category-save"]';
    private txt_category_select = '[data-cy="product-overview-category-input"]';
    private chk_category_select = '[data-cy="category-checkbox-688a0c5438bda63a31385a78"]';


    // Status Fields
    private chk_status = '[data-cy="product-overview-status"]';


    // =============================================================================
    // RANGING TAB SELECTORS
    // =============================================================================

    private lbl_ranging_title = '#ranging > :nth-child(1) > .gap-xs > [data-cy="product-overview-title"]';
    private lbl_ranging_description = '#ranging > :nth-child(1) > .gap-xs > [data-cy="product--description"]';
    private lbl_default_banner = '[data-cy="ranging-section"] > :nth-child(2) > [data-testid="alert"]';
    private btn_brand_select = '[data-cy="command-dropdown-trigger-brand"]';
    private btn_location_select = '[data-cy="command-dropdown-trigger-location"]';
    private btn_platform_select = '[data-cy="command-dropdown-trigger-platform"]';
    private btn_service_mode_select = '[data-cy="command-dropdown-trigger-servicemode-button-label"]';

    private txt_brand_select = '[data-cy="autocomplete-brand-input"]';
    private txt_location_select = '[data-cy="autocomplete-location-input"]';
    private txt_platform_select = '[data-cy="autocomplete-platform-input"]';
    private txt_service_mode_select = '[data-cy="autocomplete-servicemode-input"]';

    private chk_brand_select = '[data-cy="brand-62de66386d3f307b8ace1364"]';
    private chk_location_select = '[data-cy="location-61fb95a03e21545b1a78bd4b"]';
    private chk_platform_select = '[data-cy="platform-bolt-food-aggregator"]';
    private chk_service_mode_select = '[data-cy="servicemode-DINE_IN"]';

    // =============================================================================
    // PRICE AND TAXES TAB SELECTORS
    // =============================================================================

    private tab_price_taxes = '[data-tab-id="price-taxes"]';

    private lbl_price_and_taxes_title = '[data-cy="product-price-taxes-title"]';
    private lbl_price_and_taxes_description = '[data-cy="product-price-taxes-description"]';
    private btn_currency_select = '[data-cy="price-manager-list-button"]';
    private txt_enter_price_input = '[data-cy="enter-price-input"]';
    private btn_price_manager_collapse_button = '[data-cy="price-manager-collapse-button"]';

    private chk_price_inclusive_tax = '[data-cy="horizontal-radio"] > :nth-child(1) > label';
    private chk_price_exclusive_tax = '[data-cy="horizontal-radio"] > :nth-child(2) > label';
    private chk_price_manager_custom_tax_checkbox = '[data-cy="price-manager-custom-tax-checkbox"]';

    private txt_basic_auto_complete_input = '[data-cy="basic-auto-complete"]';
    private btn_price_manager_tax_remove_button = '[data-cy="price-manager-tax-remove-button"]';

    private btn_price_manager_new_tax_add_button = ':nth-child(1) > .gc3ui-popover-item-content';
    private txt_price_manager_new_tax_name_input = '[data-cy="enter-tax-name-input"]';
    private txt_price_manager_new_tax_value_input = '[data-cy="enter-tax-value-input"]';
    private btn_price_manager_tax_add_button = '[data-cy="price-manager-tax-add-button"]';

    private btn_price_manager_collapse_button_label = '[data-cy="price-manager-collapse-button-button-label"]';

    //add second tax line
    private btn_price_manager_add_second_tax_line = ':nth-child(2) > .gap-xl > div.w-full > .flex-col > [data-cy="basic-auto-complete"]';
    private btn_price_manager_second_tax_add_button = ':nth-child(2) > .gc3ui-popover-item-content';
    // =============================================================================
    // MODIFIER GROUPS TAB SELECTORS
    // =============================================================================
    private lbl_modifier_groups_title = '#modifier-groups > .gap-xs > [data-cy="product-overview-title"]';
    private lbl_modifier_groups_description = '#modifier-groups > .gap-xs > [data-cy="product-overview-description"]';
    private lbl_modifier_groups_default_banner = '.px-3xl > [data-testid="alert"]';
    private btn_modifier_group_select = '[data-cy="create-product-modifier-group-button"]';

    private btn_cancel_add_mg_modal_button = '[data-cy="cancel-add-mg-modal-button"]';
    private btn_save_add_mg_modal_button = '[data-cy="add-modifiers-button"]';


    private txt_modifier_name_translation = '[data-cy="modifier-name-translation"]';
    private txt_modifier_external_id = '[data-cy="external-id-input"]';
    private txt_modifier_nutrition_input_field = '[data-cy="input-field-input"]';
    private btn_modifier_cancel_button = '.pt-3xl > [data-cy="cancel-button"]';
    private btn_modifier_save_button = '[data-cy="save-button-button-label"]';

    // =============================================================================
    // NUTRITIONAL INFO TAB SELECTORS
    // =============================================================================
    private lbl_nutritional_info_title = '#nutrition > .relative > .gap-xs.flex-col > [data-cy="product-nutritional-info-title"]';
    private lbl_nutritional_info_description = '#nutrition > .relative > .gap-xs.flex-col > [data-cy="product-nutritional-info-description"]';
    private lbl_calories_label = '[data-cy="input-label"]';
    private lbl_classification_label = '[data-cy="search-classifications"]';
    private lbl_allergen_label = '[data-cy="search-allergens"]';


    private txt_nutritional_info = '[data-cy="input-field-input"]';
    private txt_nutritional_info_conversion = '[data-cy="input-conversion"]';
    private txt_classification = '[data-cy="product-nutritional-classifications-search-input"]';
    private txt_allergen = '[data-cy="product-nutritional-allergens-search-input"]';

    private tab_nutrition = '[data-tab-id="nutrition"]';

    private chk_classification = '[data-cy="checkbox-672dd750a3d3ee7d8696b598"]';
    private chk_allergen = '[data-cy="checkbox-65ba3c50a74f606040849f0e"]';
    // =============================================================================
    // TAGS TAB SELECTORS
    // =============================================================================
    private lbl_tags_title = '[data-cy="tags"] > :nth-child(1) > [data-cy="tags-title"]'
    private lbl_tags_description = '[data-cy="tags-description"]'
    private txt_tags_select = '[data-cy="modifier-group-tags-search-input"]'
    private add_tag_label = '[data-cy="add-tag-label"]'
    private txt_add_tag = '[data-cy="add-tag-title"]'
    private txt_add_tag_description = '[data-cy="add-tag-desc"]'
    private txt_add_tag_input = '[data-cy="add-tag-input-input"]'
    private btn_add_tag_cancel = '[data-cy="add-tag-cancel"]'
    private btn_add_tag_save = '[data-cy="add-tag-save"]'


    // =============================================================================
    // CUSTOM FIELDS TAB SELECTORS
    // =============================================================================
    private tab_custom_fields_title = '[data-tab-id="custom-fields"]';
    private lbl_custom_fields_title = '[data-cy="custom-fields-title"]';
    private lbl_custom_fields_description = '[data-cy="custom-fields-description"]';
    private lbl_custom_fields_list = '[data-cy="custom-field-list-title"]';
    private lbl_custom_fields_default_banner = '[data-cy="custom-fields-with-manage"] > [data-testid="alert"]';
    private btn_custom_fields_add = '[data-cy="custom-field-create-btn"]';


    private lbl_custom_field_modal_title = '[data-cy="custom-field-modal-title"]';
    private lbl_custom_field_modal_description = '[data-cy="custom-field-modal-description"]';
    private txt_custom_field_modal_name = '[data-cy="field-name-input"]';
    private txt_custom_field_modal_usage = '[data-cy="field-usage-trigger"]';
    private txt_custom_field_modal_type = '[data-cy="field-type-trigger"]';

    private chk_custom_field_modal_type_text = '[data-cy="field-type-option-TEXT"]';


    // =============================================================================
    // TRANSLATION TAB SELECTORS
    // =============================================================================

    private lbl_product_manage_language_dialog_title = '[data-cy="product-manage-language-dialog-title-text"]';
    private lbl_product_manage_language_dialog_description = '[data-cy="product-manage-language-dialog-description"]';
    private txt_product_manage_language_dialog_search = '[data-cy="product-manage-language-dialog-search"]';
    private btn_product_manage_language_dialog_save = '[data-cy="product-manage-language-dialog-save"]';
    private btn_product_manage_language_dialog_cancel = '[data-cy="product-manage-language-dialog-cancel"]';



    private btn_product_overview_name_trailing_button = '[data-cy="product-overview-name-trailing-button"]';
    private btn_product_overview_display_name_trailing_button = '[data-cy="product-overview-display-name-trailing-button"]';


    // =============================================================================
    // REVERT BUTTON SELECTORS
    // =============================================================================
    // Revert button at the top of product edit view - if this selector doesn't work, try:
    // '[data-cy="revert-product-button"]' or '[data-cy="revert-button-button-label"]'
    private btn_revert = '[data-cy="revert-button"]';
    
    // Revert popup/modal selectors
    // Select All modifier groups option in the revert popup
    private btn_select_all_modifier_groups = 'div.cursor-pointer.flex.flex-row:contains("Select All")';
    private btn_revert_selected = '[data-cy="revert-selected-button"]';
    private btn_revert_confirm = '[data-cy="confirmation-dialog-confirm-button"]';
    private btn_revert_cancel = '[data-cy="confirmation-dialog-cancel-button"]';



    // =============================================================================
    // PAGE HEADER VERIFICATION METHODS
    // =============================================================================
    public verify_create_new_product_page_header_text() {
        cy.get(this.lbl_create_new_product_title).should('have.text', 'Create New Product');
        return this;
    }

    public verify_product_header_description(text: string) {
        cy.get(this.lbl_product_header_description).should('have.text', text);
        return this;
    }

    // =============================================================================
    // ACTION BUTTON VERIFICATION METHODS
    // =============================================================================
    public verify_translation_button_visible() {
        cy.get(this.btn_translation).should('be.visible');
        cy.get(this.btn_translation).should('have.text', 'Translation');
        return this;
    }

    public verify_create_product_button_visible() {
        cy.get(this.btn_create_product).should('be.visible');
        cy.get(this.btn_create_product).should('have.text', 'Create Product');
        return this;
    }

    public verify_cancel_button_visible() {
        cy.get(this.btn_cancel).should('be.visible');
        cy.get(this.btn_cancel).should('have.text', 'Cancel');
        return this;
    }

    // =============================================================================
    // ACTION BUTTON INTERACTION METHODS
    // =============================================================================
    public product_create_button_click() {
        cy.get(this.btn_create_product).should('be.enabled');
        cy.get(this.btn_create_product).click({ force: true });
        return new ProductToasterMessage();
    }

    public step_click_create_product_button_disabled() {
        cy.get(this.btn_create_product).should('be.disabled');
        return this;
    }

    public step_click_cancel_button() {
        cy.get(this.btn_cancel).click({ force: true });
        return this;
    }

    // =============================================================================
    // TAB VERIFICATION METHODS
    // =============================================================================
    public verify_tab_list_visible(tab: string) {
        cy.get(`[data-tab-id="${tab}"]`).should('be.visible');
        return this;
    }

    public verify_all_product_tabs_visible() {
        const tabs = ['ranging', 'price-taxes', 'modifier-groups', 'nutrition', 'tags', 'custom-fields'];

        tabs.forEach(tab => {
            this.verify_tab_list_visible(tab);
        });

        return this;
    }

    public step_click_tab(tab: string) {
        cy.get(`[data-tab-id="${tab}"]`).click({ force: true });
        return this;
    }

    // =============================================================================
    // OVERVIEW TAB VERIFICATION METHODS
    // =============================================================================
    public verify_overview_title_visible() {
        cy.get(this.lbl_overview_title).should('be.visible');
        cy.get(this.lbl_overview_title).should('contain.text', 'Product Overview');
        return this;
    }

    public verify_overview_description_visible() {
        cy.get(this.lbl_overview_description).should('be.visible');
        cy.get(this.lbl_overview_description).should('contain.text', 'All the basic product information, status and category.');
        return this;
    }

    // =============================================================================
    // PRODUCT NAME METHODS
    // =============================================================================
    public verify_product_name_label_visible() {
        cy.get(this.lbl_product_name).should('be.visible');
        cy.get(this.lbl_product_name).should('have.text', 'Product Name');
        return this;
    }

    public verify_product_name_input_visible() {
        cy.get(this.txt_product_name).should('be.visible');
        cy.get(this.txt_product_name).find('input').should('have.attr', 'placeholder', 'Enter product name..');
        return this;
    }

    public step_enter_product_name(name: string) {
        cy.get(this.txt_product_name).find('input').type(name);
        cy.wait(2000);
        return this;
    }

    // =============================================================================
    // PRODUCT DISPLAY NAME METHODS
    // =============================================================================
    public verify_product_display_name_label_visible() {
        cy.get(this.lbl_product_display_name).should('be.visible');
        cy.get(this.lbl_product_display_name).should('have.text', 'Product Display Name');
        return this;
    }

    public verify_product_display_name_input_visible() {
        cy.get(this.txt_product_display_name).should('be.visible');
        cy.get(this.txt_product_display_name).find('input').should('have.attr', 'placeholder', 'Enter product display name..');
        return this;
    }

    public step_enter_product_display_name(name: string) {
        cy.wait(2000);
        cy.get(this.txt_product_display_name).find('input').clear().type(name);
        return this;
    }

    // =============================================================================
    // PRODUCT DESCRIPTION METHODS
    // =============================================================================
    public verify_product_description_label_visible() {
        cy.get(this.lbl_product_description).should('be.visible');
        cy.get(this.lbl_product_description).should('have.text', 'Product Description');
        return this;
    }

    public verify_product_description_input_visible() {
        cy.get(this.txt_product_description).should('be.visible');
        cy.get(this.txt_product_description).should('have.attr', 'placeholder', 'Enter product description..');
        return this;
    }

    public step_enter_product_description(description: string) {
        cy.wait(2000);
        cy.get(this.txt_product_description).clear().type(description);
        return this;
    }

    public step_enter_external_id(external_id: string) {
        cy.get(this.txt_external_id).clear().type(external_id);
        return this;
    }

    // =============================================================================
    // CATEGORY SELECT METHODS
    // =============================================================================
    public step_click_category_select_button() {
        cy.get(this.btn_category_select).click({ force: true });
        return this;
    }

    public step_click_add_new_category_button() {
        cy.get(this.btn_add_new_category).click({ force: true });
        return this;
    }

    public step_enter_new_category(category?: string) {
        // Generate random category name if none provided
        const categoryName = category || faker.commerce.productName();

        // Debug logging
        cy.log(`Generated category name: ${categoryName}`);

        cy.get(this.txt_add_new_category).type(categoryName);
        return this;
    }

    public step_click_add_category_save_button() {
        cy.get(this.btn_add_category_save).click({ force: true });
        cy.wait(1000);
        return this;
    }

    public step_select_category_in_dropdown() {
        cy.get(this.chk_category_select).click({ force: true });
        return this;
    }



    // =============================================================================
    // STATUS SELECT METHODS
    // =============================================================================
    public step_change_status() {
        cy.get(this.chk_status).click({ force: true });
        return this;
    }

    // =============================================================================
    // RANGING TAB VERIFICATION METHODS
    // =============================================================================

    public verify_ranging_title_visible() {
        cy.get(this.lbl_ranging_title).should('be.visible');
        cy.get(this.lbl_ranging_title).should('contain.text', 'Ranging');
        return this;
    }

    public verify_ranging_description_visible() {
        cy.get(this.lbl_ranging_description).should('be.visible');
        cy.get(this.lbl_ranging_description).should('contain.text', 'Specify the brands, locations, platforms, and service modes where this product can be offered.');
        return this;
    }

    public verify_ranging_banner_visible(text: string) {
        cy.get(this.lbl_default_banner).should('be.visible');
        cy.get(this.lbl_default_banner).should('contain.text', text);
        return this;
    }

    public verify_brand_select_visible() {
        cy.get(this.btn_brand_select).should('be.visible');
        cy.get(this.btn_brand_select).contains('Brands');
        return this;
    }

    public step_select_brand_in_dropdown(brand: string) {
        cy.get(this.txt_brand_select).type(brand);
        cy.get(this.chk_brand_select).click({ force: true });
        return this;
    }

    //location select

    public verify_location_select_visible() {
        cy.get(this.btn_location_select).should('be.visible');
        cy.get(this.btn_location_select).contains('Locations');
        return this;
    }

    public verify_platform_select_visible() {
        cy.get(this.btn_platform_select).should('be.visible');
        cy.get(this.btn_platform_select).contains('Platforms');
        return this;
    }

    public verify_service_mode_select_visible() {
        cy.get(this.btn_service_mode_select).should('be.visible');
        cy.get(this.btn_service_mode_select).contains('Service Modes');
        return this;
    }

    public step_click_brand_select() {
        cy.get(this.btn_brand_select).click({ force: true });
        return this;
    }

    public verify_brand_select_options_visible() {
        cy.get(this.btn_brand_select).should('be.visible');
        cy.get(this.btn_brand_select).contains('Brands');
        return this;
    }

    public step_click_location_select() {
        cy.get(this.btn_location_select).click({ force: true });
        return this;
    }

    public step_select_location_in_dropdown(location: string) {
        cy.get(this.txt_location_select).type(location);
        cy.get(this.chk_location_select).click({ force: true });
        return this;
    }

    public step_click_platform_select() {
        cy.get(this.btn_platform_select).click({ force: true });
        return this;
    }

    public step_select_platform_in_dropdown(platform: string) {
        cy.get(this.txt_platform_select).type(platform);
        cy.get(this.chk_platform_select).click({ force: true });
        return this;
    }

    public step_click_service_mode_select() {
        cy.get(this.btn_service_mode_select).click({ force: true });
        return this;
    }

    public step_select_service_mode_in_dropdown(service_mode: string) {
        cy.get(this.txt_service_mode_select).type(service_mode);
        cy.get(this.chk_service_mode_select).click({ force: true });
        return this;
    }

    // =============================================================================
    // PRICE AND TAXES TAB VERIFICATION METHODS
    // =============================================================================

    public verify_price_and_taxes_title_visible() {
        cy.get(this.tab_price_taxes).click({ force: true });
        cy.get(this.lbl_price_and_taxes_title).should('be.visible');
        cy.get(this.lbl_price_and_taxes_title).should('contain.text', 'Price, Currency & Taxes');
        return this;
    }

    public verify_price_and_taxes_description_visible() {
        cy.get(this.lbl_price_and_taxes_description).should('be.visible');
        cy.get(this.lbl_price_and_taxes_description).should('contain.text', 'List pricing and currency for each region offering the product, ensuring the currency matches the region.');
        return this;
    }

    public verify_currency_select_visible() {
        cy.get(this.btn_currency_select).should('be.visible');
        cy.get(this.btn_currency_select).contains('Add New Currency');
        return this;
    }

    public step_click_currency_select() {
        cy.wait(2000);
        cy.get(this.btn_currency_select).click({ force: true });
        return this;
    }

    public step_enter_price_input(price: string) {
        cy.get(this.txt_enter_price_input).type(price);
        cy.wait(2000);
        return this;
    }

    public step_enter_second_price_input(price: string) {
        cy.wait(2000);
        cy.get(this.txt_enter_price_input).last().type(price);
        cy.wait(2000);
        return this;
    }

    public step_click_price_manager_collapse_button() {
        cy.get(this.btn_price_manager_collapse_button).scrollIntoView();
        cy.get(this.btn_price_manager_collapse_button).should('be.visible').click({ force: true });
        cy.wait(1500); // Wait for the section to expand
        return this;
    }

    public step_click_price_inclusive_tax() {
        cy.get(this.chk_price_inclusive_tax).should('be.visible');
        cy.get(this.chk_price_inclusive_tax).should('have.text', 'Price Includes Tax');
        cy.get(this.chk_price_inclusive_tax).click({ force: true });
        return this;
    }

    public step_click_price_exclusive_tax() {
        // First ensure the parent horizontal-radio container is visible
        cy.get('[data-cy="horizontal-radio"]', { timeout: 10000 }).should('be.visible');
        cy.wait(500); // Wait for animation
        cy.get(this.chk_price_exclusive_tax).scrollIntoView();
        cy.get(this.chk_price_exclusive_tax).should('be.visible');
        cy.get(this.chk_price_exclusive_tax).should('have.text', 'Price Excludes Tax');
        cy.get(this.chk_price_exclusive_tax).click({ force: true });
        return this;
    }

    public step_click_price_manager_custom_tax_checkbox() {
        cy.get(this.chk_price_manager_custom_tax_checkbox).click({ force: true });
        return this;
    }

    public step_click_basic_auto_complete_input(tax: string) {
        cy.get(this.txt_basic_auto_complete_input).click({ force: true }).type(tax);
        return this;
    }

    public step_click_price_manager_new_tax_add_button() {
        cy.get(this.btn_price_manager_new_tax_add_button).click({ force: true });
        return this;
    }

    public step_enter_price_manager_new_tax_name_input(name: string, value: string) {
        cy.get(this.txt_price_manager_new_tax_name_input).type(name);
        cy.get(this.txt_price_manager_new_tax_value_input).type(value);
        return this;
    }

    public step_click_price_manager_tax_save_button() {
        cy.get(this.btn_price_manager_tax_add_button).click({ force: true });
        return this;
    }

    public step_click_price_manager_add_new_tax_line() {
        cy.get(this.btn_price_manager_collapse_button_label).click({ force: true });
        return this;
    }

    public step_click_price_manager_tax_remove_button() {
        cy.get(this.btn_price_manager_tax_remove_button).last().click({ force: true });
        cy.wait(3000);
        return this;
    }

    public step_click_price_manager_add_second_tax_line() {
        cy.get(this.btn_price_manager_add_second_tax_line).type("10");
        return this;
    }

    public step_click_price_manager_second_tax_add_button() {
        cy.get(this.btn_price_manager_second_tax_add_button).click({ force: true });
        cy.wait(3000);
        return this;
    }

    // =============================================================================
    // MODIFIER GROUPS TAB VERIFICATION METHODS
    // =============================================================================
    public verify_modifier_groups_title_visible() {
        cy.get(this.lbl_modifier_groups_title).should('be.visible');
        cy.get(this.lbl_modifier_groups_title).should('contain.text', 'Modifier Groups');
        return this;
    }

    public verify_modifier_groups_description_visible() {
        cy.get(this.lbl_modifier_groups_description).should('be.visible');
        cy.get(this.lbl_modifier_groups_description).should('contain.text', 'Configure modifier groups in the product to offer required addons.');
        return this;
    }

    public verify_modifier_groups_default_banner_visible() {
        cy.get(this.lbl_modifier_groups_default_banner).should('be.visible');
        cy.get(this.lbl_modifier_groups_default_banner).should('contain.text', 'No modifiers groups added');
        return this;
    }

    public verify_modifier_group_select_visible() {
        cy.get(this.btn_modifier_group_select).should('be.visible');
        cy.get(this.btn_modifier_group_select).contains('Modifier Groups');
        return this;
    }

    public step_click_modifier_group_select() {
        // Wait for page to stabilize before clicking
        cy.wait(2000);
        cy.get(this.btn_modifier_group_select).should('be.visible').and('not.be.disabled');
        cy.get(this.btn_modifier_group_select).click({ force: true });
        cy.wait(1000); // Wait for modal to open
        return this;
    }

    public step_select_modifier_group_in_dropdown(modifier_group_id: string) {
        cy.get(`[data-cy="modifier-group-table-select-${modifier_group_id}"]`).click({ force: true });
        return this;
    }

    public step_click_cancel_add_mg_modal_button() {
        cy.get(this.btn_cancel_add_mg_modal_button).click({ force: true });
        return this;
    }

    public step_click_save_add_mg_modal_button() {
        cy.get(this.btn_save_add_mg_modal_button).click({ force: true });
        return this;
    }

    public verify_modifier_group_added_visible(modifier_group_id: string, modifier_group_name: string) {
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('be.visible');
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('contain.text', modifier_group_name);
        return this;
    }

    public step_click_more_options_modifier_group(modifier_group_id: string) {
        cy.get(`[data-cy="${modifier_group_id}-popover"]`).click({ force: true });
        return this;
    }

    public step_click_edit_modifier_group(modifier_group_id: string) {
        cy.get(`[data-cy="edit-details-${modifier_group_id}-text"]`).click({ force: true });
        return this;
    }

    public step_click_remove_modifier_group(modifier_group_id: string) {
        cy.get(`[data-cy="remove-${modifier_group_id}-text"]`).click({ force: true });
        return this;
    }

    /**
     * Remove a modifier group from the product by its display name (e.g. "Premium Burger Add-ons").
     * Finds the modifier group in #modifier-groups, opens more options, clicks remove, and handles confirmation if present.
     */
    public step_remove_modifier_group_by_display_name(displayName: string) {
        cy.get('#modifier-groups')
            .find('[data-cy$="-display-name"]')
            .contains(displayName)
            .closest('[data-cy$="-display-name"]')
            .invoke('attr', 'data-cy')
            .then((dataCy) => {
                const id = (dataCy || '').replace('-display-name', '');
                this.step_click_more_options_modifier_group(id).step_click_remove_modifier_group(id);
            });
        cy.get('body').then(($body) => {
            if ($body.find(this.btn_revert_confirm).length > 0) {
                cy.get(this.btn_revert_confirm).click({ force: true });
                cy.wait(1000);
            }
        });
        return this;
    }

    /**
     * Add a modifier group to the product by searching by name in the add-modifier-group modal (e.g. "Burger Additions_PMG001").
     */
    public step_add_modifier_group_by_search_name(modifierGroupName: string) {
        this.step_click_modifier_group_select();
        cy.get('[data-cy="enter-search-modifier-group-name-input"]').clear().type(modifierGroupName);
        cy.wait(2000);
        cy.get('[data-cy^="modifier-group-table-select-"]').first().click({ force: true });
        this.step_click_save_add_mg_modal_button();
        cy.wait(2000);
        return this;
    }

    public step_click_revert_modifier_group(modifier_group_id: string) {
        // Click on "Revert Modifier Group" option from the 3-dot menu
        cy.get(`[data-cy="revert-modifier-${modifier_group_id}-text"]`).click({ force: true });
        cy.wait(1000); // Wait for confirmation dialog or revert to complete
        return this;
    }
    
    public step_enter_modifier_display_name_translation(name: string) {
        cy.get(`[data-cy*="modifier-display-name-translation-input"]`).clear().type(name);
        return this;
    }

    public step_enter_modifier_name_translation(name: string) {
        cy.get(this.txt_modifier_name_translation).clear().type(name);
        return this;
    }

    public step_enter_modifier_external_id(modifier_group_id: string, externalId: string) {
        cy.get(`[data-cy="${modifier_group_id}-external-id-input"]`).clear({ force: true }).type(externalId);
        return this;
    }

    public step_click_modifier_save_button(modifier_group_id: string) {
        cy.get(`[data-cy="${modifier_group_id}-save-button-button-label"]`).click({ force: true });
        return this;
    }


    public step_click_expand_button(modifier_group_id: string) {
        cy.get(`[data-cy="${modifier_group_id}-collapsible-icon"]`).click({ force: true });
        cy.wait(2000);
        return this;
    }

    public step_add_modifier_first_level_override(modifier_group_id: string) {
        cy.get(`[data-cy="add-modifier-button-${modifier_group_id}"]`).click({ force: true });
        return this;
    }

    public step_search_and_select_modifier_second_level_override(name: string, modifier_id: string) {
        cy.get('[data-cy="-input"]').type(name);
        cy.get(`[data-cy="product-table-select-${modifier_id}"]`).click({ force: true });
        return this;
    }

    public step_click_save_first_level_override_modal_button() {
        cy.get('.bg-button-primary-bg > [data-cy="-button-label"]').click({ force: true });
        return this;
    }

    public step_add_text_modifier_name(text_modifier: string) {
        cy.get('[data-cy="undefined-modifier-name-translation-input"]').type(text_modifier);
        return this;
    }
    public step_add_text_modifier_external_id(externalId: string) {
        cy.get('[data-cy="undefined-external-id-input"]').type(externalId);
        return this;
    }

    public step_click_text_modifier_save_button(modifier_group_id: string) {
        cy.get('[data-cy="undefined-save-button-button-label"]').click({ force: true });
        return this;
    }


    // =============================================================================
    // NUTRITIONAL INFO TAB VERIFICATION METHODS
    // =============================================================================
    public verify_nutritional_info_title_visible() {
        cy.get(this.lbl_nutritional_info_title).should('be.visible');
        cy.get(this.lbl_nutritional_info_title).should('contain.text', 'Nutritional Information');
        return this;
    }

    public verify_nutritional_info_description_visible() {
        cy.get(this.lbl_nutritional_info_description).should('be.visible');
        cy.get(this.lbl_nutritional_info_description).should('contain.text', 'Enter details on calories, allergens, and food classifications.');
        return this;
    }

    public verify_calories_label_visible() {
        cy.get(this.lbl_calories_label).should('be.visible');
        cy.get(this.lbl_calories_label).should('contain.text', 'Calories');
        return this;
    }

    public step_enter_nutritional_info(info: string) {
        cy.wait(2000);
        cy.get(this.txt_nutritional_info).clear().type(info);
        return this;
    }

    public verify_nutritional_info_conversion_visible(value: string) {
        cy.get(this.txt_nutritional_info_conversion).should('be.visible');
        cy.get(this.txt_nutritional_info_conversion).should('contain.text', value);
        return this;
    }

    public step_click_nutritional_info_tab() {
        cy.wait(2000);
        cy.get(this.tab_nutrition).click({ force: true });
        return this;
    }

    public verify_classification_label_visible() {
        cy.get(this.lbl_classification_label).should('be.visible');
        cy.get(this.lbl_classification_label).should('contain.text', 'Search Classifications');
        return this;
    }

    public verify_classification_input_visible() {
        cy.get(this.txt_classification).should('be.visible');
        cy.get(this.txt_classification).should('have.attr', 'placeholder', 'Select classifications');
        return this;
    }

    public step_enter_classification(classification: string) {
        cy.wait(2000);
        cy.get(this.txt_classification).type(classification);
        return this;
    }

    public step_select_classification_in_dropdown(classificationId: string) {
        cy.wait(2000);
        cy.get(`[data-cy="checkbox-${classificationId}"]`).click({ force: true });
        return this;
    }

    public verify_selected_classification_visible(classificationId: string) {
        cy.get(`[data-cy="selected-badge-${classificationId}"]`).should('be.visible');
        return this;
    }

    public verify_allergen_label_visible() {
        cy.get(this.lbl_allergen_label).should('be.visible');
        cy.get(this.lbl_allergen_label).should('contain.text', 'Search Allergens');
        return this;
    }

    public verify_allergen_input_visible() {
        cy.get(this.txt_allergen).should('be.visible');
        cy.get(this.txt_allergen).should('have.attr', 'placeholder', 'Select allergens');
        return this;
    }

    public step_enter_allergen(allergen: string) {
        cy.wait(2000);
        cy.get(this.txt_allergen).type(allergen);
        return this;
    }

    public step_select_allergen_in_dropdown(allergenId: string) {
        cy.get(`[data-cy="checkbox-${allergenId}"]`).click({ force: true });
        return this;
    }

    public verify_selected_allergen_visible(allergenId: string) {
        cy.get(`[data-cy="selected-badge-${allergenId}"]`).should('be.visible');
        return this;
    }

    // =============================================================================
    // TAGS TAB VERIFICATION METHODS
    // =============================================================================

    public verify_selected_tag_visible(tagId: string) {
        cy.get(`[data-cy="selected-badge-${tagId}"]`).should('be.visible');
        return this;
    }

    public step_click_custom_fields_tab() {
        cy.get(this.tab_custom_fields_title).should('be.visible');
        cy.get(this.tab_custom_fields_title).click({ force: true });
        cy.wait(1000);
        cy.get('[data-cy="custom-fields-title"]').scrollIntoView();
        return this;
    }

    public verify_tags_title_visible() {
        cy.get('[data-tab-id="tags"]').click({ force: true });
        cy.get(this.lbl_tags_title).should('be.visible');
        cy.get(this.lbl_tags_title).should('contain.text', 'Tags');
        return this;
    }

    public verify_sideview_tags_title_visible() {
        cy.get('[data-tab-id="tags"]').click({ force: true });
        cy.get('#tags-title').should('be.visible');
        cy.get('#tags-title').should('contain.text', 'Tags');
        return this;
    }

    public verify_tags_description_visible() {
        cy.get(this.lbl_tags_description).should('be.visible');
        cy.get(this.lbl_tags_description).should('contain.text', 'Enhance this product by adding relevant tags');
        return this;
    }

    public verify_tags_input_visible() {
        cy.get(this.txt_tags_select).should('be.visible');
        // Debug: Log the HTML structure to understand the element
        cy.get(this.txt_tags_select).then(($el) => {
            cy.log('Element HTML:', $el.html());
        });
        // Try different selectors for the input
        cy.get(this.txt_tags_select).should('have.attr', 'placeholder', 'Select tags');
        return this;
    }

    public step_enter_tags_select(tags: string) {
        cy.wait(2000);
        cy.get(this.txt_tags_select).clear().type(tags);
        return this;
    }

    public verify_add_tag_label_visible() {
        cy.get(this.add_tag_label).should('be.visible');
        cy.get(this.add_tag_label).should('contain.text', 'Add new tag');
        return this;
    }

    public step_click_add_tag_label() {
        cy.get(this.add_tag_label).click({ force: true });
        return this;
    }

    public verify_add_tag_title_visible() {
        cy.get(this.txt_add_tag).should('be.visible');
        cy.get(this.txt_add_tag).should('contain.text', 'Add Tag');
        return this;
    }

    public verify_add_tag_description_visible() {
        cy.get(this.txt_add_tag_description).should('be.visible');
        cy.get(this.txt_add_tag_description).should('contain.text', 'Create a new tag by adding the name below.');
        return this;
    }

    public step_enter_add_tag_input(input: string) {
        cy.get(this.txt_add_tag_input).type(input);
        return this;
    }

    public step_click_add_tag_cancel() {
        cy.get(this.btn_add_tag_cancel).click({ force: true });
        return this;
    }

    public step_click_add_tag_save() {
        cy.get(this.btn_add_tag_save).click({ force: true });
        return this;
    }

    public step_select_tag_checkbox(tag: string) {
        cy.get(`[data-cy="tag-checkbox-${tag}"]`).click({ force: true });
        return this;
    }

    public step_select_tag_badge(tag: string) {
        cy.get(`[data-cy*="selected-badge-"][data-cy*="-label"]`).contains(tag).should('be.visible');
        return this;
    }

    // =============================================================================
    // CUSTOM FIELDS TAB VERIFICATION METHODS
    // =============================================================================
    public verify_custom_fields_title_visible() {
        cy.get(this.lbl_custom_fields_title).should('be.visible');
        cy.get(this.lbl_custom_fields_title).should('contain.text', 'Custom Fields');
        return this;
    }

    public verify_custom_fields_description_visible() {
        cy.get(this.lbl_custom_fields_description).should('be.visible');
        cy.get(this.lbl_custom_fields_description).should('contain.text', 'Enhance your products by incorporating tailored data for any platform application.');
        return this;
    }

    public verify_custom_fields_list_visible() {
        cy.get(this.lbl_custom_fields_list).should('be.visible');
        return this;
    }

    public verify_custom_fields_default_banner_visible() {
        cy.get(this.lbl_custom_fields_default_banner).should('be.visible');
        return this;
    }

    public verify_custom_fields_add_button_visible() {
        cy.get(this.btn_custom_fields_add).should('be.visible');
        cy.get(this.btn_custom_fields_add).should('contain.text', 'Create');
        return this;
    }

    public step_click_custom_fields_create() {
        cy.get(this.btn_custom_fields_add).click({ force: true });
        return this;
    }

    public verify_custom_field_modal_title_visible() {
        cy.get(this.lbl_custom_field_modal_title).should('be.visible');
        cy.get(this.lbl_custom_field_modal_title).should('contain.text', 'Create Custom Field');
        return this;
    }

    public verify_custom_field_modal_description_visible() {
        cy.get(this.lbl_custom_field_modal_description).should('be.visible');
        cy.get(this.lbl_custom_field_modal_description).should('contain.text', 'Create a new custom field to use.');
        return this;
    }

    public step_enter_custom_field_modal_name(name: string) {
        cy.get(this.txt_custom_field_modal_name).type(name);
        return this;
    }

    public step_enter_custom_field_modal_usage() {
        cy.get(this.txt_custom_field_modal_usage).should('contain.text', 'Products');
        return this;
    }

    public step_enter_custom_field_modal_usage_menu() {
        cy.get(this.txt_custom_field_modal_usage).should('contain.text', 'Menus');
        return this;
    }

    public step_click_custom_field_modal_type() {
        cy.get(this.txt_custom_field_modal_type).click({ force: true });
        return this;
    }

    public step_click_custom_field_value_modal(type: string) {
        cy.get(`[data-cy="field-type-option-${type}"]`).click({ force: true });
        if (type === 'TEXT') {
            cy.get('[data-cy="default-text-value-input"]').click({ force: true }).type('Test');
        } if (type === 'NUMERICAL') {
            cy.get('[data-cy="default-number-value-input"]').click({ force: true }).type('10');
        } if (type === 'BOOLEAN') {
            cy.get('[data-cy="default-true"]').click({ force: true });
        } if (type === 'SELECTION_LIST') {
            cy.log('Selection List');
        }
        return this;
    }

    public step_click_custom_field_value_modal_selection_list() {
        cy.get('[data-cy="category-products-category-handler-create-category-button"]').click({ force: true });
        return this;
    }

    public step_click_custom_field_modal_save() {
        cy.get('[data-cy="save-button"]').click({ force: true });
        return this;
    }

    public step_click_edit_custom_fields_create_button() {
        cy.wait(2000);
        cy.get('[data-cy="custom-field-create-btn"]').click({ force: true });
        return this;
    }

    public verify_selection_list_title_visible() {
        cy.get('[data-cy="selection-list-title"]').should('be.visible');
        cy.get('[data-cy="selection-list-title"]').should('contain.text', 'Selection List Configuration');
        return this;
    }

    public step_click_selection_list_type_single() {
        cy.get('[data-cy="type-single"]').click({ force: true });
        return this;
    }

    public step_click_selection_list_type_multi() {
        cy.get('[data-cy="type-multi"]').click({ force: true });
        return this;
    }

    public step_click_add_option_button() {
        cy.get('[data-cy="add-option-button"]').click({ force: true });
        cy.get('[data-cy="selection-option-0-input"]').type('option text');
        cy.get('[data-cy="bookmark-option-0"]').click({ force: true });
        cy.get('[data-cy="add-option-button"]').click({ force: true });
        cy.get('[data-cy="selection-option-1-input"]').type('option text1');
        return this;
    }


    // =============================================================================
    // TRANSLATION TAB VERIFICATION METHODS
    // =============================================================================
    public step_update_translation() {
        cy.get('[data-cy="language-selector-trigger"]').click({ force: true })
        cy.get('[data-cy="language-selector-manage-languages-text"]').click({ force: true })
        return this;
    }
    public step_click_translation_button() {
        cy.get(this.btn_translation).click({ force: true });
        return this;
    }

    public verify_product_manage_language_dialog_title_visible() {
        cy.get(this.lbl_product_manage_language_dialog_title).should('be.visible');
        cy.get(this.lbl_product_manage_language_dialog_title).should('contain.text', 'Manage Languages');
        return this;
    }

    public verify_product_manage_language_dialog_description_visible() {
        cy.get(this.lbl_product_manage_language_dialog_description).should('be.visible');
        cy.get(this.lbl_product_manage_language_dialog_description).should('contain.text', 'Configure what languages you would like to use.');
        return this;
    }

    public step_enter_product_manage_language_dialog_search(search: string) {
        cy.get(this.txt_product_manage_language_dialog_search).clear().type(search);
        return this;
    }

    public step_check_language(language_id: string) {
        cy.get(`[data-cy="product-manage-language-dialog-checkbox-${language_id}"]`).click({ force: true });
        return this;
    }

    public step_click_product_manage_language_dialog_save() {
        cy.get(this.btn_product_manage_language_dialog_save).click({ force: true });
        return this;
    }

    public step_click_product_manage_language_dialog_cancel() {
        cy.get(this.btn_product_manage_language_dialog_cancel).click({ force: true });
        return this;
    }

    public step_click_product_overview_name_trailing_button() {
        cy.get(this.btn_product_overview_name_trailing_button).click({ force: true });
        return this;
    }

    public step_click_product_overview_display_name_trailing_button() {
        cy.get(this.btn_product_overview_display_name_trailing_button).click({ force: true });
        return this;
    }

    public step_enter_product_translation(field: string, language_id: string, translation: string) {
        cy.get(`[data-cy="${field}-input-${language_id}-input"]`).type(translation);
        return this;
    }

    public step_click_product_overview_description_trailing_button() {
        cy.get('[data-cy="product-overview-description-input-trailing-button"]').click({ force: true });
        return this;
    }

    // =============================================================================
    // GROUPING PRODUCT ADD METHODS
    // =============================================================================


    public product_create_with_mandatory_fields(productData: any) {
        const homePage = new ProductHomePage();
        homePage.step_click_create_new_product_button()
            .step_enter_product_name(productData.product.name)
            .step_enter_product_display_name(productData.product.displayName)
            .verify_price_and_taxes_title_visible()
            .verify_price_and_taxes_description_visible()
            .step_click_currency_select()
            .step_enter_price_input(productData.product.price.price)
        return new ProductCreatePage();
    }
    public product_add_category(categoryName: any) {
        this.step_click_category_select_button()
            .step_click_add_new_category_button()
            .step_enter_new_category(categoryName.categories[0].name)
            .step_click_add_category_save_button();
        return this;
    }

    public product_add_nutritional_info(nutritionalInfo: any) {
        this.step_enter_nutritional_info(nutritionalInfo.product.nutritionalInfo)
            .verify_nutritional_info_conversion_visible(nutritionalInfo.product.nutritionalInfoConversion)
        return this;
    }

    public product_add_same_tag_multiple_times(tags: any) {
        this.verify_tags_title_visible()
            .verify_tags_description_visible()
            .verify_tags_input_visible()
            .step_enter_tags_select(tags.tags[0].name)
            .verify_add_tag_label_visible()
            .step_click_add_tag_label()
            .verify_add_tag_title_visible()
            .verify_add_tag_description_visible()
            .step_enter_add_tag_input(tags.tags[0].name)
            .step_click_add_tag_cancel()
            .step_enter_tags_select(tags.tags[0].name)
            .step_click_add_tag_label()
            .step_enter_add_tag_input(tags.tags[0].name)
            .step_click_add_tag_save()
        return new ProductToasterMessage();
    }

    public product_add_tag(tags: any) {
        this.step_enter_tags_select(tags.tags[0].name)
            .step_select_tag_checkbox(tags.tags[0].id)
        cy.wait(8000);
        return this;
    }

    public product_add_new_tag(tagsData: any, newTag: any) {
        this.verify_tags_title_visible()
            .step_enter_tags_select(tagsData.tags[0].name)
            .step_click_add_tag_label()
            .step_enter_add_tag_input(newTag)
            .step_click_add_tag_save()
            .step_select_tag_badge(newTag)
        return this;
    }

    public product_add_custom_field_with_text(customField: any) {
        this.step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .verify_custom_field_modal_title_visible()
            .verify_custom_field_modal_description_visible()
            .step_enter_custom_field_modal_name("Text " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('TEXT')
            .step_click_custom_field_modal_save()
        return this;
    }

    public product_add_custom_field_with_numerical(customField: any) {

        this.step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .step_enter_custom_field_modal_name("Numerical " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('NUMERICAL')
            .step_click_custom_field_modal_save()
        return this;
    }

    public product_add_custom_field_with_boolean(customField: any) {
        this.step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .step_enter_custom_field_modal_name("Boolean " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('BOOLEAN')
            .step_click_custom_field_modal_save()
        return this;
    }

    public product_add_custom_field_with_single(customField: any) {
        this.step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .step_enter_custom_field_modal_name("Selection single list " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('SELECTION_LIST')
            .step_click_selection_list_type_single()
            .step_click_add_option_button()
            .step_click_custom_field_modal_save()
        return this;
    }

    public product_add_allergen(allergen: any) {
        this.step_click_nutritional_info_tab()
            .verify_allergen_label_visible()
            .verify_allergen_input_visible()
            .step_enter_allergen(allergen.allergens[0].name)
            .step_select_allergen_in_dropdown(allergen.allergens[0].id)
            .verify_selected_allergen_visible(allergen.allergens[0].id)
        return this;
    }

    public product_add_classification(classification: any) {
        this.verify_classification_label_visible()
            .verify_classification_input_visible()
            .step_enter_classification(classification.classifications[0].name)
            .step_select_classification_in_dropdown(classification.classifications[0].id)
            .verify_selected_classification_visible(classification.classifications[0].id)
        return this;
    }

    public product_enable_translation(languagesData: any) {
        this.step_click_translation_button()
            .verify_product_manage_language_dialog_title_visible()
            .verify_product_manage_language_dialog_description_visible()
            .step_enter_product_manage_language_dialog_search(languagesData.languages[0].name)
            .step_check_language(languagesData.languages[0].id)
            .step_enter_product_manage_language_dialog_search(languagesData.languages[1].name)
            .step_check_language(languagesData.languages[1].id)
            .step_click_product_manage_language_dialog_save()
        return this;
    }

    public product_add_translations_for_name(languagesData: any) {
        this.step_click_product_overview_name_trailing_button()
            .step_enter_product_translation("product-overview-name", languagesData.languages[0].id, "arabic translation")
            .step_enter_product_translation("product-overview-name", languagesData.languages[1].id, "test translation")
            .step_click_product_overview_name_trailing_button()
        return this;
    }

    public product_add_translations_for_display_name(languagesData: any) {
        this.step_click_product_overview_display_name_trailing_button()
            .step_enter_product_translation("product-overview-display-name", languagesData.languages[0].id, "arabic translation")
            .step_enter_product_translation("product-overview-display-name", languagesData.languages[1].id, "test translation")
            .step_click_product_overview_display_name_trailing_button()
        return this;
    }

    public product_add_translations_for_description(languagesData: any) {
        this.step_click_product_overview_description_trailing_button()
            .step_enter_product_translation("product-overview-description-input", languagesData.languages[0].id, "arabic translation")
            .step_enter_product_translation("product-overview-description-input", languagesData.languages[1].id, "test translation")
            .step_click_product_overview_description_trailing_button()
        return this;
    }

    public product_add_new_tax(taxData: any) {
        const newTax = faker.word.noun();
        this.step_click_price_manager_custom_tax_checkbox()
            .step_click_basic_auto_complete_input(taxData.product.price.tax)
            .step_click_price_manager_new_tax_add_button()
            .step_enter_price_manager_new_tax_name_input(newTax, taxData.product.price.newTaxValue)
            .step_click_price_manager_tax_save_button()
        return this;
    }

    public product_add_product_modifier_group_with_text_modifier_group(modifierGroupData: any) {
        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_cancel_add_mg_modal_button()
            .step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
        return this;
    }

    public product_add_product_modifier_group(modifierGroupData: any) {
        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_cancel_add_mg_modal_button()
            .step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
        return this;
    }

    public product_add_text_modifier_group(modifierGroupData: any) {
        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
        return this;
    }

    public product_add_product_mogifier_group_and_text_modifier_group_and_edit(modifierGroupsData: any) {
        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .step_click_cancel_add_mg_modal_button()
            .step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupsData.productModifierGroup.modifierGroups[0].id, modifierGroupsData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupsData.textModifierGroup.modifierGroups[0].id, modifierGroupsData.textModifierGroup.modifierGroups[0].name)

            .step_click_more_options_modifier_group(modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .step_click_edit_modifier_group(modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .step_enter_modifier_display_name_translation("update display name")
            .step_enter_modifier_external_id(modifierGroupsData.productModifierGroup.modifierGroups[0].id, "update external id")
            .step_click_modifier_save_button(modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .verify_modifier_group_added_visible(modifierGroupsData.productModifierGroup.modifierGroups[0].id, "update display name")

            .step_click_more_options_modifier_group(modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_click_edit_modifier_group(modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_enter_modifier_display_name_translation("update display name")
            .step_enter_modifier_external_id(modifierGroupsData.textModifierGroup.modifierGroups[0].id, "update external id")
            .step_click_modifier_save_button(modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .verify_modifier_group_added_visible(modifierGroupsData.textModifierGroup.modifierGroups[0].id, "update display name")
        return this;
    }

    public product_remove_modifier_group(modifierGroupData: any) {

        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_remove_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
        return this;
    }

    public product_add_modifier_group_and_2nd_level_override(modifierGroupData: any) {

        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_search_and_select_modifier_second_level_override(modifierGroupData.productModifierGroup.modifierGroups[1].name, modifierGroupData.productModifierGroup.modifierGroups[1].id)
            .step_click_save_first_level_override_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[1].id, modifierGroupData.productModifierGroup.modifierGroups[1].name)
        return this;
    }

    /**
     * Adds modifier groups with 2nd level override and then edits both existing linked modifier and newly added override modifier
     * This is used to test revert functionality with nested modifiers
     * - Edits existing linked modifier values (should be reverted to original)
     * - Adds new modifier as override and edits it (should be removed after revert)
     * @param modifierGroupData - The modifier groups data
     */
    public product_add_modifier_group_and_2nd_level_override_and_edit(modifierGroupData: any) {
        // Hierarchy: Product > Modifier Group (1st level) > Modifiers inside it (2nd level)
        // modifierGroups[0] = Modifier group (parent)
        // modifierGroups[1] = Newly added modifier (override - will be removed after revert)
        // modifierGroups[2] = Existing modifier inside modifier group (already linked - will be reverted after revert)
        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
            
            // Edit the existing linked modifier group (first level) - this should be reverted to original
            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_enter_modifier_display_name_translation("update display name")
            .step_enter_modifier_external_id(modifierGroupData.productModifierGroup.modifierGroups[0].id, "update external id")
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, "update display name")
            
            // Add new modifier as override (second level) - this should be removed after revert
            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_search_and_select_modifier_second_level_override(modifierGroupData.productModifierGroup.modifierGroups[1].name, modifierGroupData.productModifierGroup.modifierGroups[1].id)
            .step_click_save_first_level_override_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[1].id, modifierGroupData.productModifierGroup.modifierGroups[1].name)
            
            // Edit the existing modifier that's already inside the modifier group (2nd level override)
            // This existing modifier comes with the modifier group when linked
            // modifierGroups[2] = existing modifier that's already linked inside modifierGroups[0]
            // After expanding the modifier group, we can see the modifiers inside it
            // We need to edit one of those existing modifiers (not the group itself, not the newly added one)
            // This existing modifier should be reverted to original after revert
            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .step_enter_modifier_display_name_translation("update existing modifier display name")
            .step_enter_modifier_external_id(modifierGroupData.productModifierGroup.modifierGroups[2].id, "update existing modifier external id")
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[2].id, "update existing modifier display name");
        return this;
    }

    public product_add_text_modifier_group_and_3nd_level_override(modifierGroupData: any) {

        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_search_and_select_modifier_second_level_override(modifierGroupData.productModifierGroup.modifierGroups[1].name, modifierGroupData.productModifierGroup.modifierGroups[1].id)
            .step_click_save_first_level_override_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[1].id, modifierGroupData.productModifierGroup.modifierGroups[1].name)

            .step_click_expand_button(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_add_text_modifier_name("bbq")
            .step_add_text_modifier_external_id("externalId")
            .step_click_text_modifier_save_button(modifierGroupData.textModifierGroup.modifierGroups[0].id)
        return this;
    }

    public product_add_text_modifier_group_and_4nd_level_override(modifierGroupData: any) {

        this.step_click_modifier_group_select()
            .step_select_modifier_group_in_dropdown(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_select_modifier_group_in_dropdown(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_click_save_add_mg_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .verify_modifier_group_added_visible(modifierGroupData.textModifierGroup.modifierGroups[0].id, modifierGroupData.textModifierGroup.modifierGroups[0].name)
            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_search_and_select_modifier_second_level_override(modifierGroupData.productModifierGroup.modifierGroups[1].name, modifierGroupData.productModifierGroup.modifierGroups[1].id)
            .step_click_save_first_level_override_modal_button()
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[1].id, modifierGroupData.productModifierGroup.modifierGroups[1].name)

            .step_click_expand_button(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_add_modifier_first_level_override(modifierGroupData.textModifierGroup.modifierGroups[0].id)
            .step_add_text_modifier_name("bbq")
            .step_add_text_modifier_external_id("externalId")
            .step_click_text_modifier_save_button(modifierGroupData.textModifierGroup.modifierGroups[0].id)

            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .step_enter_modifier_display_name_translation("update display " + modifierGroupData.productModifierGroup.modifierGroups[0].name)
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[0].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[0].id, "update display " + modifierGroupData.productModifierGroup.modifierGroups[0].name)


            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .step_enter_modifier_display_name_translation("update display " + modifierGroupData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[2].id, "update display " + modifierGroupData.productModifierGroup.modifierGroups[2].name)

            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[2].id)
            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[3].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[3].id)
            .step_enter_modifier_display_name_translation("update display " + modifierGroupData.productModifierGroup.modifierGroups[3].name)
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[3].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[3].id, "update display " + modifierGroupData.productModifierGroup.modifierGroups[3].name)

            .step_click_expand_button(modifierGroupData.productModifierGroup.modifierGroups[3].id)
            .step_click_more_options_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[4].id)
            .step_click_edit_modifier_group(modifierGroupData.productModifierGroup.modifierGroups[4].id)
            .step_enter_modifier_display_name_translation("update display " + modifierGroupData.productModifierGroup.modifierGroups[4].name)
            .step_click_modifier_save_button(modifierGroupData.productModifierGroup.modifierGroups[4].id)
            .verify_modifier_group_added_visible(modifierGroupData.productModifierGroup.modifierGroups[4].id, "update display " + modifierGroupData.productModifierGroup.modifierGroups[4].name)
        return this;
    }

    // =============================================================================
    // GROUPING PRODUCT EDIT METHODS
    // =============================================================================


    public product_search_and_click_edit_button(productData: any) {
        const homePage = new ProductHomePage();
        homePage.step_search_products("Api" + productData.product.name)
            .step_click_edit_product()
        return this;
    }

    public product_search_and_click_side_view_button(productData: any) {
        const homePage = new ProductHomePage();
        homePage.step_search_products("Api" + productData.product.name)
            .step_open_side_by_side_view()
        return this;
    }



    public product_update_displayName_description_externalId_status_details(productData: any) {
        this.step_enter_product_display_name("Updated " + productData.product.displayName)
            .step_enter_product_description("Updated " + productData.product.description)
            .step_enter_external_id("Updated " + productData.product.externalId)
            .step_change_status()

        return this;
    }

    public product_update_nutritional_info() {
        this.step_click_nutritional_info_tab()
            .step_enter_nutritional_info("10")
            .verify_nutritional_info_conversion_visible("41.84 kJ")
        return this;
    }

    public product_update_pricing(productData: any) {
        this.step_click_currency_select()
            .step_enter_second_price_input(productData.product.price.price)
        return this;
    }

    public product_update_classification_tag(classificationsData: any) {
        this.step_click_nutritional_info_tab()
            .step_enter_classification(classificationsData.classifications[0].name)
            .step_select_classification_in_dropdown(classificationsData.classifications[0].id)
            .verify_selected_classification_visible(classificationsData.classifications[0].id)

        return this;
    }

    public product_update_allergen(allergensData: any) {
        this.step_enter_allergen(allergensData.allergens[0].name)
            .step_select_allergen_in_dropdown(allergensData.allergens[0].id)
            .verify_selected_allergen_visible(allergensData.allergens[0].id)

        return this;
    }

    public product_update_tags(tagsData: any) {
        this.verify_tags_title_visible()
            .step_enter_tags_select(tagsData.tags[0].name)
            .step_select_tag_checkbox(tagsData.tags[0].id)
            .verify_selected_tag_visible(tagsData.tags[0].id)

        return this;
    }

    public product_update_translation(languagesData: any) {
        this.step_click_translation_button()
            .verify_product_manage_language_dialog_title_visible()
            .verify_product_manage_language_dialog_description_visible()
            .step_enter_product_manage_language_dialog_search(languagesData.languages[0].name)
            .step_check_language(languagesData.languages[0].id)
            .step_click_product_manage_language_dialog_save()
            .step_click_product_overview_name_trailing_button()
            .step_enter_product_translation("product-overview-name", languagesData.languages[0].id, "arabic translation")
            .step_click_product_overview_name_trailing_button()
            .step_click_product_overview_display_name_trailing_button()
            .step_enter_product_translation("product-overview-display-name", languagesData.languages[0].id, "arabic translation")
            .step_click_product_overview_display_name_trailing_button()

            .step_click_product_overview_description_trailing_button()
            .step_enter_product_translation("product-overview-description-input", languagesData.languages[0].id, "arabic description")
            .step_click_product_overview_description_trailing_button()

        return this;
    }

    public product_update_translation_side_view(productData: any, languagesData: any) {

        this.step_enter_product_display_name("side view " + productData.product.displayName)

            .step_update_translation()
            .verify_product_manage_language_dialog_title_visible()
            .verify_product_manage_language_dialog_description_visible()
            .step_enter_product_manage_language_dialog_search(languagesData.languages[1].name)
            .step_check_language(languagesData.languages[1].id)
            .step_click_product_manage_language_dialog_save()
            .step_click_product_overview_name_trailing_button()
            .step_enter_product_translation("product-overview-name", languagesData.languages[1].id, "update translation")
            .step_click_product_overview_name_trailing_button()
            .step_click_product_overview_display_name_trailing_button()
            .step_enter_product_translation("product-overview-display-name", languagesData.languages[1].id, "update translation")
            .step_click_product_overview_display_name_trailing_button()

            .step_click_product_overview_description_trailing_button()
            .step_enter_product_translation("product-overview-description-input", languagesData.languages[1].id, "update description")
            .step_click_product_overview_description_trailing_button()

        return this;
    }
    
    // =============================================================================
    // REVERT BUTTON INTERACTION METHODS
    // =============================================================================
    public step_click_parent_revert_button() {
        cy.get(this.btn_revert).should('be.visible');
        cy.get(this.btn_revert).click({ force: true });
        cy.wait(1000); // Wait for popup to appear
        return this;
    }

    public step_select_all_modifier_groups_in_popup() {
        // Click on "Select All modifier groups" option in the revert popup
        // The element is a div with cursor-pointer class that contains "modifier groups" text
        cy.get('div.cursor-pointer').contains('modifier groups').should('be.visible').click({ force: true });
        cy.wait(500); // Wait for selection to complete
        return this;
    }

    public step_select_single_modifier_group_in_popup(modifier_group_id: string) {
        // Select a single modifier group from the revert popup using checkbox
        // The selector pattern is: modifiers-table-select-{modifier_group_id}_{other_id}
        // We use starts-with selector to match the modifier group ID
        cy.get(`[data-cy^="modifiers-table-select-${modifier_group_id}"]`).should('be.visible').click({ force: true });
        cy.wait(500); // Wait for selection to complete
        return this;
    }

    public step_click_revert_selected_button() {
        // Click the "Revert Selected" button after selecting all modifier groups
        cy.get(this.btn_revert_selected).should('be.visible');
        cy.get(this.btn_revert_selected).click({ force: true });
        cy.wait(1000); // Wait for confirmation dialog to appear
        return this;
    }

    public step_confirm_revert_in_popup() {
        // Click confirm button to complete the revert operation
        cy.get(this.btn_revert_confirm).should('be.visible');
        cy.get(this.btn_revert_confirm).click({ force: true });
        cy.wait(2000); // Wait for revert operation to complete
        return this;
    }

    // =============================================================================
    // REVERT PRODUCT WITH NESTED MODIFIER GROUPS
    // =============================================================================
    /**
     * Reverts the product and all nested modifier groups using the parent-level revert button
     * located at the top of the product edit view. This method clicks the revert button
     * which automatically reverts both the product changes and any nested modifier group changes.
     *
     */

    public product_search_and_click_edit_button_for_revert(productData: any) {
        const homePage = new ProductHomePage();
        homePage.step_search_products(productData.product.name)
            .step_click_edit_product()
        return this;
    }

    public product_revert_with_all_nested_modifier_groups() {
        // Click the revert button at the parent level (top of product edit view)
        // This opens a popup where we need to select all modifier groups
        this.step_click_parent_revert_button()
            // Select all modifier groups in the popup
            .step_select_all_modifier_groups_in_popup()
            // Click "Revert Selected" button
            .step_click_revert_selected_button()
            // Confirm the revert operation
            .step_confirm_revert_in_popup();
        return this;
    }

    /**
     * Reverts a single modifier group using the parent-level revert button
     * This opens a popup, selects a specific modifier group, and reverts it
     * @param modifier_group_id - The ID of the modifier group to revert
     */
    public product_revert_single_modifier_group_from_parent_button(modifier_group_id: string) {
        // Click the revert button at the parent level (top of product edit view)
        // This opens a popup where we can select modifier groups
        this.step_click_parent_revert_button()
            // Select a single modifier group from the popup using checkbox
            .step_select_single_modifier_group_in_popup(modifier_group_id)
            // Click "Revert Selected" button
            .step_click_revert_selected_button()
            // Confirm the revert operation
            .step_confirm_revert_in_popup();
        return this;
    }

    public product_revert_with_nested_modifier_groups_with_nested_modifier_group_button(modifier_group_id: string) {
        // Click the revert button at the parent level (top of product edit view)
        // This opens a popup where we need to select all modifier groups
        this.step_click_more_options_modifier_group(modifier_group_id)
            .step_click_revert_modifier_group(modifier_group_id);
            cy.get('body').then(($body) => {
                if ($body.find(this.btn_revert_confirm).length > 0) {
                    cy.get(this.btn_revert_confirm).click({ force: true });
                    cy.wait(1000); // Wait for revert to complete
                }
            });
        return this;
    }

    /**
     * Verifies that a specific modifier group has been reverted to its original values
     * @param modifier_group_id - The ID of the modifier group
     * @param original_display_name - The original display name that should be restored
     */
    public verify_specific_modifier_group_reverted(modifier_group_id: string, original_display_name: string) {
        // Verify display name reverted to original
        this.verify_modifier_group_display_name_reverted(modifier_group_id, original_display_name);
        
        // Verify external ID reverted
        this.verify_modifier_group_external_id_reverted(modifier_group_id);
        
        return this;
    }

    /**
     * Verifies that the revert button is visible and enabled in the product edit view
     */
    public verify_revert_button_visible() {
        cy.get(this.btn_revert).should('be.visible');
        cy.get(this.btn_revert).should('be.enabled');
        return this;
    }

    /**
     * Verifies that the modifier group display name has been reverted to the original value
     * @param modifier_group_id - The ID of the modifier group
     * @param original_display_name - The original display name that should be restored
     */
    public verify_modifier_group_display_name_reverted(modifier_group_id: string, original_display_name: string) {
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('be.visible');
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('contain.text', original_display_name);
        // Verify it's not the updated value
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('not.contain.text', 'update display name');
        return this;
    }

    /**
     * Verifies that the modifier group external ID has been reverted (not containing the updated value)
     * @param modifier_group_id - The ID of the modifier group
     */
    public verify_modifier_group_external_id_reverted(modifier_group_id: string) {
        // Open edit mode to check external ID
        this.step_click_more_options_modifier_group(modifier_group_id)
            .step_click_edit_modifier_group(modifier_group_id);
        
        // Verify external ID field doesn't contain "update external id"
        cy.get(`[data-cy="${modifier_group_id}-external-id-input"]`).should('be.visible');
        cy.get(`[data-cy="${modifier_group_id}-external-id-input"]`).should('not.have.value', 'update external id');
        
        // Close the edit modal by clicking cancel button (using dynamic selector based on modifier group ID)
        cy.get(`[data-cy="${modifier_group_id}-cancel-button"]`).click({ force: true });
        cy.wait(500);
        return this;
    }

    /**
     * Verifies that all edited values from product_add_product_mogifier_group_and_text_modifier_group_and_edit
     * have been reverted to their original values
     * @param modifierGroupsData - The modifier groups data containing original values
     */
    public verify_reverted_modifier_groups_values(modifierGroupsData: any) {
        // Verify product modifier group display name reverted to original
        this.verify_modifier_group_display_name_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[0].id,
            modifierGroupsData.productModifierGroup.modifierGroups[0].name
        );
        
        // Verify product modifier group external ID reverted
        this.verify_modifier_group_external_id_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[0].id
        );
        
        // Verify text modifier group display name reverted to original
        this.verify_modifier_group_display_name_reverted(
            modifierGroupsData.textModifierGroup.modifierGroups[0].id,
            modifierGroupsData.textModifierGroup.modifierGroups[0].name
        );
        
        // Verify text modifier group external ID reverted
        this.verify_modifier_group_external_id_reverted(
            modifierGroupsData.textModifierGroup.modifierGroups[0].id
        );
        
        return this;
    }

    /**
     * Verifies that a single modifier group has been reverted to its original values
     * This method only checks the specified modifier group, not all modifier groups
     * @param modifier_group_id - The ID of the modifier group that was reverted
     * @param original_display_name - The original display name that should be restored
     */
    public verify_single_modifier_group_reverted(modifier_group_id: string, original_display_name: string) {
        // Verify display name reverted to original
        this.verify_modifier_group_display_name_reverted(modifier_group_id, original_display_name);
        
        // Verify external ID reverted
        this.verify_modifier_group_external_id_reverted(modifier_group_id);
        
        return this;
    }

    /**
     * Verifies that a modifier group (override) has been removed after revert
     * This is used to verify that newly added modifiers at product level are removed
     * @param modifier_group_id - The ID of the modifier group that should be removed
     */
    public verify_modifier_group_removed(modifier_group_id: string) {
        // Verify the modifier group is not visible (removed)
        cy.get(`[data-cy="${modifier_group_id}-display-name"]`).should('not.exist');
        return this;
    }

    /**
     * Verifies that modifier groups with nested modifiers have been reverted correctly:
     * 1. Modifier group (1st level) values are reverted to original
     * 2. Existing modifier inside modifier group (2nd level) values are reverted to original
     * 3. Newly added override modifier (2nd level) is removed
     * 
     * Hierarchy: Product > Modifier Group (1st level) > Modifiers inside it (2nd level)
     * 
     * @param modifierGroupsData - The modifier groups data containing original values
     */
    public verify_reverted_modifier_groups_with_nested_values(modifierGroupsData: any) {
        // Verify modifier group (1st level - modifierGroups[0]) display name reverted to original
        this.verify_modifier_group_display_name_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[0].id,
            modifierGroupsData.productModifierGroup.modifierGroups[0].name
        );
        
        // Verify modifier group external ID reverted
        this.verify_modifier_group_external_id_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[0].id
        );
        
        // Expand modifier group to access modifiers inside it (2nd level)
        this.step_click_expand_button(modifierGroupsData.productModifierGroup.modifierGroups[0].id);
        
        // Verify newly added override modifier (2nd level - modifierGroups[1]) has been removed
        // This modifier was added as an override and should be removed after revert
        this.verify_modifier_group_removed(
            modifierGroupsData.productModifierGroup.modifierGroups[1].id
        );
        
        // Verify existing modifier inside modifier group (2nd level - modifierGroups[2]) values are reverted to original
        // This modifier was already linked inside the modifier group and its edited values should be reverted
        this.verify_modifier_group_display_name_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[2].id,
            modifierGroupsData.productModifierGroup.modifierGroups[2].name
        );
        
        // Verify existing modifier external ID reverted
        this.verify_modifier_group_external_id_reverted(
            modifierGroupsData.productModifierGroup.modifierGroups[2].id
        );
        
        return this;
    }
}