import { faker } from '@faker-js/faker';
import { ModifierGroupHomePage } from './modifier-group-home-page';

export class TextModifierGroupPage {

    //------------Create Tab Selectors------------
    private btn_create_button = '[data-cy="create-button"]';
    private lbl_create_title = '[data-cy="create-button-button-label"]';

    //------------Overview Tab Selectors------------

    private lbl_overview_title = '[data-cy="overview-title"]';
    private txt_overview_name = '[data-cy="overview-name-input"]';
    private txt_overview_display_name = '[data-cy="overview-display-name-input"]';
    private txt_overview_description = '[data-cy="overview-description-input"]';
    private txt_overview_external_id = '[data-cy="overview-external-id-input"]';
    private chk_overview_status = '[data-cy="overview-status-switch"]';


    // Category Fields - Multiple selector options for reliability
    private btn_category_select_by_placeholder = '[placeholder="Select product categories"]';
    private btn_add_new_category = '[data-cy="add-category-label"]';
    private txt_add_new_category = '[data-cy="add-category-input-input"]';
    private btn_add_category_save = '[data-cy="add-category-save"]';


    //-------------Tags Tab Selectors------------
    private lbl_tags_title = '[data-cy="tags"] > :nth-child(1) > [data-cy="tags-title"]'
    private txt_tags_select = '[data-cy="modifier-group-tags-search-input"]'
    private add_tag_label = '[data-cy="add-tag-label"]'
    private txt_add_tag_input = '[data-cy="add-tag-input-input"]'
    private btn_add_tag_cancel = '[data-cy="add-tag-cancel"]'
    private btn_add_tag_save = '[data-cy="add-tag-save"]'

    //----------------Custom Fields Tab Selectors----------------

    private tab_custom_fields_title = '[data-tab-id="custom-fields"]';
    private lbl_custom_fields_title = '[data-cy="custom-fields-title"]';
    private lbl_custom_fields_list = '[data-cy="list-title"]';
    private btn_custom_fields_add = '[data-cy="add-button"]';

    private lbl_custom_field_modal_title = '[data-cy="custom-field-modal-title"]';
    private lbl_custom_field_modal_description = '[data-cy="custom-field-modal-description"]';
    private txt_custom_field_modal_name = '[data-cy="field-name-input"]';
    private txt_custom_field_modal_usage = '[data-cy="field-usage-trigger"]';
    private txt_custom_field_modal_type = '[data-cy="field-type-trigger"]';

    //=======================Text Modifiers Tab Selectors=======================

    private tab_text_modifiers_title = '[data-tab-id="modifiers"]';
    private btn_create_modifier_button = '[data-cy="create-modifier-button"]';

    private lbl_text_modifiers_title = '.justify-between > .flex-col > .text-md';
    private lbl_text_modifiers_description = '.justify-between > .flex-col > .text-sm';

    private txt_modifier_name_translation = '[data-cy="undefined-modifier-name-translation-input"]';
    private txt_modifier_external_id = '[data-cy="undefined-external-id-input"]';
    private txt_modifier_nutrition_input_field = '[data-cy="input-field-input"]';
    private btn_modifier_cancel_button = '[data-cy="undefined-cancel-button-button-label"]';
    private btn_modifier_save_button = '[data-cy="undefined-save-button-button-label"]';


    private modifier_search_field = '[data-cy="-input"]';

    private btn_translation = '[data-cy="translation-button"]';
    // =============================================================================
    // TRANSLATION TAB SELECTORS
    // =============================================================================

    private lbl_modifier_group_manage_language_dialog_title = '[data-cy="modifier-group-manage-language-dialog-title-text"]';
    private lbl_modifier_group_manage_language_dialog_description = '[data-cy="modifier-group-manage-language-dialog-description"]';
    private txt_modifier_group_manage_language_dialog_search = '[data-cy="modifier-group-manage-language-dialog-search"]';
    private btn_modifier_group_manage_language_dialog_save = '[data-cy="modifier-group-manage-language-dialog-save"]';
    private btn_modifier_group_manage_language_dialog_cancel = '[data-cy="modifier-group-manage-language-dialog-cancel"]';

    private btn_modifier_group_overview_name_trailing_button = '[data-cy="overview-name-trailing-button"]';
    private btn_modifier_group_overview_display_name_trailing_button = '[data-cy="overview-display-name-trailing-button"]';
    //------------Overview Tab Methods------------
    public verify_overview_title_visible() {
        cy.get(this.lbl_overview_title).should('be.visible');
        cy.get(this.lbl_overview_title).should('contain.text', 'Modifier Group Overview');
        return this;
    }

    public verify_overview_name_placeholder_visible() {
        cy.get(this.txt_overview_name).should('be.visible');
        cy.get(this.txt_overview_name).should('have.attr', 'placeholder', 'Enter modifier group name..');
        return this;
    }

    public step_enter_overview_name(name: string) {
        cy.get(this.txt_overview_name).clear().type(name);
        return this;
    }

    public step_enter_overview_display_name(name: string) {
        cy.get(this.txt_overview_display_name).should('be.visible').clear().type(name);
        return this;
    }

    public step_enter_overview_description(description: string) {
        cy.get(this.txt_overview_description).should('be.visible').clear().type(description);
        return this;
    }

    public step_enter_overview_external_id(externalId: string) {
        cy.get(this.txt_overview_external_id).should('be.visible').clear().type(externalId);
        return this;
    }

    public step_change_overview_status() {
        cy.get(this.chk_overview_status).should('be.visible').click();
        cy.wait(2000);
        return this;
    }

    //------------Create Tab Methods------------
    public verify_create_title_visible() {
        cy.get(this.lbl_create_title).should('be.visible');
        cy.get(this.lbl_create_title).should('contain.text', 'Create Modifier Group');
        return this;
    }

    public step_click_create_modifier_group_button() {
        cy.get(this.btn_create_button).should('be.visible').should('be.enabled').click();
        cy.wait(1000); // Wait for the update request to process
        return new ModifierGroupHomePage();
    }

    // =============================================================================
    // CATEGORY SELECT METHODS
    // =============================================================================
    public step_click_category_select_textbox() {
        cy.get(this.btn_category_select_by_placeholder).click();
        return this;
    }

    public step_click_add_new_category_button() {
        cy.get(this.btn_add_new_category).click();
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
        cy.get(this.btn_add_category_save).click();
        cy.wait(1000);
        return this;
    }


    // =============================================================================
    // TAGS SELECT METHODS
    // =============================================================================
    public verify_tags_title_visible() {
        cy.get('[data-tab-id="tags"]').click();
        cy.get(this.lbl_tags_title).should('be.visible');
        cy.get(this.lbl_tags_title).should('contain.text', 'Tags');
        return this;
    }

    public step_enter_tags_select(tags: string) {
        cy.get(this.txt_tags_select).clear().type(tags);
        return this;
    }

    public step_click_add_tag_label() {
        cy.get(this.add_tag_label).click();
        return this;
    }

    public step_enter_add_tag_input(input: string) {
        cy.get(this.txt_add_tag_input).type(input);
        return this;
    }

    public step_click_add_tag_save() {
        cy.get(this.btn_add_tag_save).click();
        return this;
    }

    public step_select_tag_badge(tag: string) {
        cy.get(`[data-cy*="selected-badge-"][data-cy*="-label"]`).contains(tag).should('be.visible');
        return this;
    }

    public step_select_tag_checkbox(tag: string) {
        cy.get(`[data-cy="tag-checkbox-${tag}"]`).click({ force: true });
        cy.wait(2000);
        return this;
    }

    public step_click_add_tag_cancel() {
        cy.get(this.btn_add_tag_cancel).click();
        return this;
    }

    //=======================Custom Fields Tab Selectors=======================

    public step_click_custom_fields_tab() {
        cy.get(this.tab_custom_fields_title).should('be.visible');
        cy.get(this.tab_custom_fields_title).click();
        return this;
    }

    public verify_custom_fields_title_visible() {
        cy.get(this.lbl_custom_fields_title).should('be.visible');
        cy.get(this.lbl_custom_fields_title).should('contain.text', 'Custom Fields');
        return this;
    }

    public verify_custom_fields_list_visible() {
        cy.get(this.lbl_custom_fields_list).should('be.visible');
        return this;
    }

    public verify_custom_fields_add_button_visible() {
        cy.get(this.btn_custom_fields_add).should('be.visible');
        cy.get(this.btn_custom_fields_add).should('contain.text', 'Create Custom Field');
        return this;
    }

    public step_click_custom_fields_create() {
        cy.get(this.btn_custom_fields_add).click();
        return this;
    }

    public verify_custom_field_modal_title_visible() {
        cy.get(this.lbl_custom_field_modal_title).should('be.visible');
        cy.get(this.lbl_custom_field_modal_title).should('contain.text', 'Modifier Group Custom Field');
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
        cy.get(this.txt_custom_field_modal_usage).should('contain.text', 'Modifier Groups');
        return this;
    }

    public step_click_custom_field_modal_type() {
        cy.get(this.txt_custom_field_modal_type).click();
        return this;
    }

    public step_click_custom_field_value_modal(type: string) {
        cy.get(`[data-cy="field-type-option-${type}"]`).click();
        if (type === 'TEXT') {
            cy.get('[data-cy="default-text-value-input"]').click().type('Test');
        } if (type === 'NUMERICAL') {
            cy.get('[data-cy="default-number-value-input"]').click().type('10');
        } if (type === 'BOOLEAN') {
            cy.get('[data-cy="default-true"]').click();
        } if (type === 'SELECTION_LIST') {
            cy.log('Selection List');
        }
        return this;
    }


    public step_click_custom_field_modal_save() {
        cy.get('[data-cy="save-button"]').click();
        return this;
    }

    public step_click_selection_list_type_single() {
        cy.get('[data-cy="type-single"]').click();
        return this;
    }

    public step_click_selection_list_type_multi() {
        cy.get('[data-cy="type-multi"]').click();
        return this;
    }

    public step_click_add_option_button() {
        cy.get('[data-cy="add-option-button"]').click();
        cy.get('[data-cy="selection-option-0-input"]').type('option text');
        cy.get('[data-cy="bookmark-option-0"]').click();
        cy.get('[data-cy="add-option-button"]').click();
        cy.get('[data-cy="selection-option-1-input"]').type('option text1');
        return this;
    }

    public step_click_custom_field_create_button() {
        cy.get('[data-cy="custom-field-create-btn"]').click();
        return this;
    }

    //=======================Text Modifiers Tab Selectors=======================

    public step_click_text_modifiers_tab() {
        cy.get(this.tab_text_modifiers_title).click();
        return this;
    }

    public step_click_create_modifier_button() {
        cy.get(this.btn_create_modifier_button).click();
        return this;
    }

    public verify_text_modifiers_title_visible() {
        cy.get(this.lbl_text_modifiers_title).should('be.visible');
        cy.get(this.lbl_text_modifiers_title).should('contain.text', 'Add text modifier');
        return this;
    }

    public verify_text_modifiers_description_visible() {
        cy.get(this.lbl_text_modifiers_description).should('be.visible');
        cy.get(this.lbl_text_modifiers_description).should('contain.text', 'Add text modifier details');
        return this;
    }


    public step_enter_modifier_name_translation(name: string) {
        cy.get(this.txt_modifier_name_translation).clear().type(name);
        return this;
    }

    public step_update_modifier_name_translation(name: string) {
        cy.get('[data-cy*="-modifier-name-translation-input"]').clear().type(name);
        return this;
    }

    public step_enter_modifier_external_id(externalId: string) {
        cy.get(this.txt_modifier_external_id).clear().type(externalId);
        return this;
    }

    public step_update_modifier_external_id(externalId: string) {
        cy.get('[data-cy*="-external-id-input"]').clear().type(externalId);
        return this;
    }

    public step_enter_modifier_nutrition_input_field(nutrition: string) {
        cy.get(this.txt_modifier_nutrition_input_field).clear().type(nutrition);
        return this;
    }

    public step_click_modifier_cancel_button() {
        cy.get(this.btn_modifier_cancel_button).click();
        return this;
    }

    public step_click_modifier_save_button() {
        cy.get(this.btn_modifier_save_button).click();
        return this;
    }

    public step_click_modifier_update_save_button() {
        cy.get('[data-cy*="-save-button"]').first().click();
        return this;
    }

    public step_verify_text_modifier_name(name: string) {
        cy.get('[data-cy*="-display-name"]').should('be.visible');
        cy.get('[data-cy*="-display-name"]').contains(name)
        return this;
    }

    public step_verify_text_modifier_external_id(externalId: string) {
        cy.get('[data-cy*="-external-id"]').should('be.visible');
        cy.get('[data-cy*="-external-id"]').contains(externalId);
        return this;
    }

    public step_click_more_options_button() {
        cy.get('[data-cy*="-popover"]').click();
        return this;
    }

    public step_click_edit_modifier_button() {
        cy.get('[data-cy*="edit-details-"][data-cy*="-text"]').click();
        return this;
    }

    public step_click_remove_modifier_button() {
        cy.get('[data-cy*="remove-"][data-cy*="-text"]').click();
        return this;
    }



    //=======================Product Modifiers Tab Selectors=======================

    public step_enter_modifier_search_field(search: string) {
        cy.get(this.modifier_search_field).type(search);
        cy.wait(3000);
        return this;
    }

    public step_click_modifier_select_checkbox(modifier_id: string) {
        cy.get(`[data-cy="product-table-select-${modifier_id}"]`).click();
        return this;
    }

    public step_click_product_modifier_save_button() {
        cy.get('.bg-button-primary-bg > [data-cy="-button-label"]').click();
        return this;
    }

    public step_verify_modifier_group_name(modifier_id: string, name: string) {
        cy.get(`[data-cy="${modifier_id}-display-name"]`).should('be.visible');
        cy.get(`[data-cy="${modifier_id}-display-name"]`).contains(name);
        return this;
    }

    public step_click_expand_modifiers_details(modifier_id: string) {
        cy.get(`[data-cy="${modifier_id}-collapsible-icon"]`).click();
        cy.wait(5000);
        return this;
    }

    public step_click_more_options_modifiers_details(modifier_id: string) {
        cy.get(`[data-cy="${modifier_id}-popover"]`).click();
        return this;
    }

    public step_click_remove_modifiers_details(modifier_id: string) {
        cy.get(`[data-cy="remove-${modifier_id}-text"]`).click();
        return this;
    }

    public step_click_edit_modifiers_details(modifier_id: string) {
        cy.get(`[data-cy="edit-details-${modifier_id}-text"]`).click();
        return this;
    }

    public step_enter_modifier_display_name_details(modifier_id: string, name: string) {
        cy.get(`[data-cy="${modifier_id}-modifier-display-name-translation-input"]`).clear().type(name);
        return this;
    }

    public step_click_modifier_update_save_button_details(modifier_id: string) {
        cy.get(`[data-cy="${modifier_id}-save-button"]`).click();
        return this;
    }

    public step_click_add_more_modifiers_button() {
        cy.get('[data-cy="add-modifier-button-"]').click();
        return this;
    }

    public step_click_add_product_modifier_group_button(modifier_id: string) {
        cy.get(`[data-cy="add-modifier-group-button-${modifier_id}"]`).click();
        return this;
    }

    public step_search__modifier_group(modifier_name: string) {
        cy.get('[data-cy="enter-search-modifier-group-name-input"]').type(modifier_name);
        cy.wait(2000);
        return this;
    }

    public step_click_modifier_group_select_checkbox(modifier_id: string) {
        cy.get(`[data-cy="modifier-group-table-select-${modifier_id}"]`).click();
        return this;
    }

    public step_click_modifier_group_save_button() {
        cy.get('[data-cy="add-modifiers-button"]').click();
        return this;
    }

    public step_click_add_modifier_button_with_id(modifier_id: string) {
        cy.get(`[data-cy="add-modifier-button-${modifier_id}"]`).click();
        cy.wait(2000);
        return this;
    }



    // =============================================================================
    // TRANSLATION TAB VERIFICATION METHODS
    // =============================================================================
    public step_update_translation() {
        cy.get('[data-cy="language-selector-trigger"]').click()
        cy.get('[data-cy="language-selector-manage-languages-text"]').click()
        return this;
    }
    public step_click_translation_button() {
        cy.get(this.btn_translation).click();
        return this;
    }

    public verify_modifier_group_manage_language_dialog_title_visible() {
        cy.get(this.lbl_modifier_group_manage_language_dialog_title).should('be.visible');
        cy.get(this.lbl_modifier_group_manage_language_dialog_title).should('contain.text', 'Manage Languages');
        return this;
    }

    public verify_modifier_group_manage_language_dialog_description_visible() {
        cy.get(this.lbl_modifier_group_manage_language_dialog_description).should('be.visible');
        cy.get(this.lbl_modifier_group_manage_language_dialog_description).should('contain.text', 'Configure what languages you would like to use for this modifier group.');
        return this;
    }

    public step_enter_modifier_group_manage_language_dialog_search(search: string) {
        cy.get(this.txt_modifier_group_manage_language_dialog_search).clear().type(search);
        return this;
    }

    public step_check_language(language_id: string) {
        cy.get(`[data-cy="modifier-group-manage-language-dialog-checkbox-${language_id}"]`).click();
        return this;
    }

    public step_click_modifier_group_manage_language_dialog_save() {
        cy.get(this.btn_modifier_group_manage_language_dialog_save).click();
        return this;
    }

    public step_click_modifier_group_manage_language_dialog_cancel() {
        cy.get(this.btn_modifier_group_manage_language_dialog_cancel).click();
        return this;
    }

    public step_click_modifier_group_overview_name_trailing_button() {
        cy.get(this.btn_modifier_group_overview_name_trailing_button).click();
        return this;
    }

    public step_click_modifier_group_overview_display_name_trailing_button() {
        cy.get(this.btn_modifier_group_overview_display_name_trailing_button).click();
        return this;
    }

    public step_enter_modifier_group_translation(field: string, language_id: string, translation: string) {
        cy.get(`[data-cy="${field}-input-${language_id}-input"]`).type(translation);
        return this;
    }

    public step_click_modifier_group_overview_description_trailing_button() {
        cy.get('[data-cy="overview-description-trailing-button"]').click();
        return this;
    }

}
