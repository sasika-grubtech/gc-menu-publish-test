import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { faker } from "@faker-js/faker";
import { PageNavigator } from "cypress/page-objects/pages/navigator/page_navigator";
import { CleanupMethods } from "cypress/page-objects/pages/cleanup/product_cleanup_method";
import { CategoryCleanupMethod } from "cypress/page-objects/pages/cleanup/category_cleanup_method";
import { ProductEditPage } from "cypress/page-objects/pages/product/product_edit_page";


const cleanupMethods = new CleanupMethods();
const categoryCleanupMethods = new CategoryCleanupMethod();
const navigator = new PageNavigator();
const productCreate = new ProductCreatePage();


describe('Product create feature', () => {

    beforeEach(() => {
        navigator.navigate_to_product_page();
    })

    afterEach("cleanup product", function () {
        cleanupMethods.cleanup_product(this.productData.product.name);
    })

    after('Should delete categories by name filter', function () {
        categoryCleanupMethods.cleanup_category(this.categoryData.categories[0].name);
    });

    it('Product creation with mandatory fields', function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    });

    it('Product creation with unique name', function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        cy.wait(8000);
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_create_button_click()
            .product_duplicate_toaster_message();
    });

    it("product create with category", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_category(this.categoryData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    });

    it("Product with nutritional info", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_nutritional_info(this.productData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with tags with existing tag", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_same_tag_multiple_times(this.tagsData)
            .product_duplicate_tag_toaster_message()
            .product_add_tag(this.tagsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with tags with new tag", function () {
        const newTag = faker.commerce.productName();
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_new_tag(this.tagsData, newTag)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with custom fields with text custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_custom_field_with_text(customField)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with custom fields with numerical custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_custom_field_with_numerical(customField)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with custom fields with Boolean custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_custom_field_with_boolean(customField)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with custom fields with single custom field", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_custom_field_with_single(customField)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with all custom fields", function () {
        const customField = `${faker.commerce.productName()}_${faker.number.int({ min: 0, max: 9999 })}`;
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_custom_field_with_boolean(customField)
            .product_add_custom_field_with_numerical(customField)
            .product_add_custom_field_with_text(customField)
            .product_add_custom_field_with_single(customField)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with externalId, allergens and classifications", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .step_enter_external_id(this.productData.product.externalId)
            .product_add_allergen(this.allergensData)
            .product_add_classification(this.classificationsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);

    })

    it("Create product with two languages translation - with description", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .step_enter_product_description(this.productData.product.description)
            .product_enable_translation(this.languagesData)
            .product_add_translations_for_name(this.languagesData)
            .product_add_translations_for_display_name(this.languagesData)
            .product_add_translations_for_description(this.languagesData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Create product with two languages translation - no description", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_enable_translation(this.languagesData)
            .product_add_translations_for_name(this.languagesData)
            .product_add_translations_for_display_name(this.languagesData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with Pricing with price inclusive tax", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product with Pricing with price exclusive tax", function () {
        const newTax = faker.word.noun();
        productCreate.product_create_with_mandatory_fields(this.productData)
            .step_click_price_exclusive_tax()
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);

    })

    it("Product with Pricing with price with custom tax", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .step_click_price_exclusive_tax()
            .product_add_new_tax(this.productData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Prduct create with product modifier group with text modifier group", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_modifier_group_with_text_modifier_group(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Prduct create with product modifier group", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_modifier_group(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Prduct create with text modifier group", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_text_modifier_group(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product create with multiple modifier groups - add, edit, and save workflow", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_mogifier_group_and_text_modifier_group_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product create with multiple modifier groups - remove workflow", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_remove_modifier_group(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product create with multiple modifier groups - product 2nd level override workflow", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_modifier_group_and_2nd_level_override(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);

    })

    it("Product create with multiple modifier groups - product and text modifier 2nd level override workflow", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_text_modifier_group_and_3nd_level_override(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Product create with multiple modifier groups product and text modifier all level override workflow", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_text_modifier_group_and_4nd_level_override(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
    })

    it("Prduct 1st level revert the all modifier groups with revert all button in parent level", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_mogifier_group_and_text_modifier_group_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        productCreate.product_search_and_click_edit_button_for_revert(this.productData)
            .verify_revert_button_visible()
            .product_revert_with_all_nested_modifier_groups()
            .verify_reverted_modifier_groups_values(this.modifierGroupsData);
    })

    it("Prduct 1st level revert only the first modifier group in list with revert all button in parent level", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_mogifier_group_and_text_modifier_group_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        productCreate.product_search_and_click_edit_button_for_revert(this.productData)
            .verify_revert_button_visible()
            .product_revert_with_nested_modifier_groups_with_nested_modifier_group_button(this.modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            .verify_reverted_modifier_groups_values(this.modifierGroupsData);
    })

    it("Prduct 1st level revert with Revert Modifier Group button in nested modifier group level", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_product_mogifier_group_and_text_modifier_group_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        productCreate.product_search_and_click_edit_button_for_revert(this.productData)
            .verify_revert_button_visible()
            .product_revert_single_modifier_group_from_parent_button(this.modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            // Verify only the reverted modifier group, not all modifier groups
            .verify_single_modifier_group_reverted(
                this.modifierGroupsData.productModifierGroup.modifierGroups[0].id,
                this.modifierGroupsData.productModifierGroup.modifierGroups[0].name
            );
    })

    it("Prduct 2nd level revert the all modifier groups with revert all button in parent level", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_modifier_group_and_2nd_level_override_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        productCreate.product_search_and_click_edit_button_for_revert(this.productData)
            .verify_revert_button_visible()
            .product_revert_with_all_nested_modifier_groups()
            // Verify both parent and nested modifier groups are reverted
            .verify_reverted_modifier_groups_with_nested_values(this.modifierGroupsData);
    })

    it("Prduct 2nd level revert with Revert Modifier Group button in nested modifier group level", function () {
        productCreate.product_create_with_mandatory_fields(this.productData)
            .product_add_modifier_group_and_2nd_level_override_and_edit(this.modifierGroupsData)
            .product_create_button_click()
            .product_created_toaster_message(this.productData.product.name);
        productCreate.product_search_and_click_edit_button_for_revert(this.productData)
            .verify_revert_button_visible()
            .product_revert_with_nested_modifier_groups_with_nested_modifier_group_button(this.modifierGroupsData.productModifierGroup.modifierGroups[0].id)
            // Verify both parent and nested modifier groups are reverted
            .verify_reverted_modifier_groups_with_nested_values(this.modifierGroupsData);
    })

})