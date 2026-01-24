import { ProductHomePage } from "./product_home_page";
import { ProductCreatePage } from "./product_create_page";

const homePage = new ProductHomePage();

export class ProductEditPage {
    public editProduct(productData: any) {
        homePage.step_search_products("Api" + productData.product.name)
            //.step_click_more_actions_menu()
            .step_click_edit_product()
            .step_enter_product_display_name("Updated " + productData.product.displayName)
            .step_enter_product_description("Updated " + productData.product.description)
            .step_enter_external_id("Updated " + productData.product.externalId)
            .step_change_status()

        return new ProductCreatePage()
    }
}