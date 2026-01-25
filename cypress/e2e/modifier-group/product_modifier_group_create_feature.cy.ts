import { ModifierGroupHomePage } from "cypress/page-objects/pages/modifier-group/modifier-group-home-page";
import { TextModifierGroupPage } from "cypress/page-objects/pages/modifier-group/text-modifier-group-page";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { ModifierGroupGetDetailsService } from "cypress/services/modifier-group/modifier-group-get-details";
import { ModifierGroupDeleteService } from "cypress/services/modifier-group/modifier-group-delete";
import { faker } from "@faker-js/faker";

const navigator = new PageNavigator();
const homePage = new ModifierGroupHomePage();
const createPage = new TextModifierGroupPage();

describe('Product modifier group create feature', () => {

    beforeEach(() => {
        navigator.navigate_to_modifier_group_page();
    });

    afterEach('Cleanup', function () {
        // Ensure cleanup always runs, even if test fails
        cy.then(() => {
            const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

            // Find modifier group by name and delete it only if found
            ModifierGroupGetDetailsService.filterModifierGroupsByName(partnerId, this.modifierGroupsData.productModifierGroup.name, 'product')
                .then((modifierGroupFound) => {
                    if (modifierGroupFound) {
                        // Delete the modifier group only if it was found
                        ModifierGroupDeleteService.deleteModifierGroup(partnerId, Cypress.env('PRODUCT_MODIFIER_GROUP_ID'))
                            .then(() => {
                                cy.log(`Cleanup: Successfully deleted modifier group with ID: ${Cypress.env('PRODUCT_MODIFIER_GROUP_ID')}`);
                            });
                    } else {
                        cy.log(`Cleanup: No modifier group found to delete - skipping cleanup`);
                    }
                });
        });
    });

    it("Product modifier group creation with mandatory fields", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .verify_create_title_visible()
            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with unique name", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .verify_create_title_visible()
            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
        cy.wait(8000);
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .verify_create_title_visible()
            .step_click_create_modifier_group_button()
            .verify_toast_message("Error creating modifier group")
            .verify_toast_message_text(`Name already in use. Try something unique.`);
    });

    it("Product modifier group create with category", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_enter_overview_description(this.modifierGroupsData.productModifierGroup.description)
            .step_click_category_select_textbox()
            .step_click_add_new_category_button()
            .step_enter_new_category()
            .step_click_add_category_save_button()
            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group with tags with existing tag", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .verify_tags_title_visible()
            .step_enter_tags_select(this.tagsData.tags[0].name)

            .step_click_add_tag_label()
            .step_enter_add_tag_input(this.tagsData.tags[0].name)
            .step_click_add_tag_cancel()
            .step_enter_tags_select(this.tagsData.tags[0].name)
            .step_click_add_tag_label()
            .step_enter_add_tag_input(this.tagsData.tags[0].name)
            .step_click_add_tag_save();
        homePage.verify_toast_message("Error creating tag")
            .verify_toast_message_text(`Tag already exists`);
        createPage.step_enter_tags_select(this.tagsData.tags[0].name)
            .step_select_tag_checkbox(this.tagsData.tags[0].id)
            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group with tags with new tag", function () {
        const newTag = faker.commerce.productName();
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .verify_tags_title_visible()
            .step_enter_tags_select(this.tagsData.tags[0].name)
            .step_click_add_tag_label()
            .step_enter_add_tag_input(newTag)
            .step_click_add_tag_save()
            .step_select_tag_badge(newTag)
            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group with custom fields with text custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .verify_custom_field_modal_title_visible()
            .verify_custom_field_modal_description_visible()
            .step_enter_custom_field_modal_name("Product " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('TEXT')
            .step_click_custom_field_modal_save();
    });

    it("Product modifier group with custom fields with numerical custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .step_enter_custom_field_modal_name("Numerical " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('NUMERICAL')
            .step_click_custom_field_modal_save();
    });

    it("Product modifier group with custom fields with Boolean custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .step_enter_custom_field_modal_name("Boolean " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('BOOLEAN')
            .step_click_custom_field_modal_save();
    });

    it("Product modifier group with custom fields with single custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_click_custom_fields_tab()
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
            .step_click_custom_field_modal_save();
    });

    it("Product modifier group with all custom fields", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_click_custom_fields_tab()
            .verify_custom_fields_title_visible()
            .verify_custom_fields_list_visible()
            .verify_custom_fields_add_button_visible()

            .step_click_custom_fields_create()
            .verify_custom_field_modal_title_visible()
            .verify_custom_field_modal_description_visible()
            .step_enter_custom_field_modal_name("Product " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('TEXT')
            .step_click_custom_field_modal_save()

            .step_click_custom_field_create_button()
            .step_enter_custom_field_modal_name("Numerical " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('NUMERICAL')
            .step_click_custom_field_modal_save()

            .step_click_custom_field_create_button()
            .step_enter_custom_field_modal_name("Boolean " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('BOOLEAN')
            .step_click_custom_field_modal_save()

            .step_click_custom_field_create_button()
            .step_enter_custom_field_modal_name("Selection single list " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('SELECTION_LIST')
            .step_click_selection_list_type_single()
            .step_click_add_option_button()
            .step_click_custom_field_modal_save()

            .step_click_custom_field_create_button()
            .step_enter_custom_field_modal_name("Selection multi list " + customField)
            .step_enter_custom_field_modal_usage()
            .step_click_custom_field_modal_type()
            .step_click_custom_field_value_modal('SELECTION_LIST')
            .step_click_selection_list_type_multi()
            .step_click_add_option_button()
            .step_click_custom_field_modal_save()

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with product modifiers", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_text_modifiers_tab()
            .step_click_create_modifier_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with 2 product modifiers and remove one and save", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_text_modifiers_tab()
            .step_click_create_modifier_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_add_more_modifiers_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id, this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_more_options_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_remove_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with 2 product modifiers and edit one and save", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_text_modifiers_tab()
            .step_click_create_modifier_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_add_more_modifiers_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id, this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_more_options_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_edit_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_enter_modifier_display_name_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_update_save_button_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with 2 product modifiers and add another modifier group as override in first level", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_text_modifiers_tab()
            .step_click_create_modifier_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_add_more_modifiers_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id, this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_more_options_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_edit_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_enter_modifier_display_name_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_update_save_button_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_expand_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_add_product_modifier_group_button(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_search__modifier_group(this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)
            .step_click_modifier_group_select_checkbox(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id)

            .step_click_modifier_group_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id, this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group creation with 2 product modifiers and add another modifier group and edit in same time as override in first level", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .verify_overview_title_visible()
            .verify_overview_name_placeholder_visible()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_text_modifiers_tab()
            .step_click_create_modifier_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_add_more_modifiers_button()
            .step_enter_modifier_search_field(this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_modifier_select_checkbox(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id)
            .step_click_product_modifier_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[1].id, this.modifierGroupsData.productModifierGroup.modifierGroups[1].name)
            .step_click_more_options_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_edit_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_enter_modifier_display_name_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)
            .step_click_modifier_update_save_button_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_verify_modifier_group_name(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id, "Updated " + this.modifierGroupsData.productModifierGroup.modifierGroups[2].name)

            .step_click_expand_modifiers_details(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_click_add_product_modifier_group_button(this.modifierGroupsData.productModifierGroup.modifierGroups[2].id)
            .step_search__modifier_group(this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)
            .step_click_modifier_group_select_checkbox(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id)

            .step_click_modifier_group_save_button()
            .step_verify_modifier_group_name(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id, this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)

            .step_click_more_options_modifiers_details(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_click_edit_modifiers_details(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_enter_modifier_display_name_details(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id, "Updated " + this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)
            .step_click_modifier_update_save_button_details(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id)
            .step_verify_modifier_group_name(this.modifierGroupsData.textModifierGroup.modifierGroups[0].id, "Updated " + this.modifierGroupsData.textModifierGroup.modifierGroups[0].name)

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group with text modifiers with translation - no description", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)

            .step_click_translation_button()
            .verify_modifier_group_manage_language_dialog_title_visible()
            .verify_modifier_group_manage_language_dialog_description_visible()
            .step_enter_modifier_group_manage_language_dialog_search(this.languagesData.languages[0].name)
            .step_check_language(this.languagesData.languages[0].id)
            .step_enter_modifier_group_manage_language_dialog_search(this.languagesData.languages[1].name)
            .step_check_language(this.languagesData.languages[1].id)
            .step_click_modifier_group_manage_language_dialog_save()
            .step_click_modifier_group_overview_name_trailing_button()
            .step_enter_modifier_group_translation("overview-name", this.languagesData.languages[0].id, "arabic translation")
            .step_enter_modifier_group_translation("overview-name", this.languagesData.languages[1].id, "test translation")
            .step_click_modifier_group_overview_name_trailing_button()

            .step_click_modifier_group_overview_display_name_trailing_button()
            .step_enter_modifier_group_translation("overview-display-name", this.languagesData.languages[0].id, "arabic translation")
            .step_enter_modifier_group_translation("overview-display-name", this.languagesData.languages[1].id, "test translation")
            .step_click_modifier_group_overview_display_name_trailing_button()

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });

    it("Product modifier group with text modifiers with translation - with description", function () {
        homePage.step_click_create_new_modifier_group_button()
            .step_click_modifier_type_product_button()
            .step_enter_overview_name(this.modifierGroupsData.productModifierGroup.name)
            .step_enter_overview_display_name(this.modifierGroupsData.productModifierGroup.displayName)
            .step_enter_overview_description(this.modifierGroupsData.productModifierGroup.description)

            .step_click_translation_button()
            .verify_modifier_group_manage_language_dialog_title_visible()
            .verify_modifier_group_manage_language_dialog_description_visible()
            .step_enter_modifier_group_manage_language_dialog_search(this.languagesData.languages[0].name)
            .step_check_language(this.languagesData.languages[0].id)
            .step_enter_modifier_group_manage_language_dialog_search(this.languagesData.languages[1].name)
            .step_check_language(this.languagesData.languages[1].id)
            .step_click_modifier_group_manage_language_dialog_save()

            .step_click_modifier_group_overview_name_trailing_button()
            .step_enter_modifier_group_translation("overview-name", this.languagesData.languages[0].id, "arabic translation")
            .step_enter_modifier_group_translation("overview-name", this.languagesData.languages[1].id, "test translation")
            .step_click_modifier_group_overview_name_trailing_button()

            .step_click_modifier_group_overview_display_name_trailing_button()
            .step_enter_modifier_group_translation("overview-display-name", this.languagesData.languages[0].id, "arabic translation")
            .step_enter_modifier_group_translation("overview-display-name", this.languagesData.languages[1].id, "test translation")
            .step_click_modifier_group_overview_display_name_trailing_button()

            .step_click_modifier_group_overview_description_trailing_button()
            .step_enter_modifier_group_translation("overview-description", this.languagesData.languages[0].id, "arabic description")
            .step_enter_modifier_group_translation("overview-description", this.languagesData.languages[1].id, "test description")
            .step_click_modifier_group_overview_description_trailing_button()

            .step_click_create_modifier_group_button()
            .verify_toast_message("Modifier group created successfully")
            .verify_toast_message_text(`New modifier group, "${this.modifierGroupsData.productModifierGroup.name}" has been successfully created`);
    });
});
