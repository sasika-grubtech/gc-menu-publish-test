import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { ProductHomePage } from "cypress/page-objects/pages/product/product_home_page";

export class ProductToasterMessage {

    public product_created_toaster_message(productName: string) {
        const homePage = new ProductHomePage();
        homePage.verify_toast_message("Product created successfully")
            .verify_toast_message_text(`New product, "${productName}" has been successfully created`);
        return this;
    }

    public product_duplicate_toaster_message() {
        const homePage = new ProductHomePage();
        homePage.verify_toast_message("Error creating product")
            .verify_toast_message_text(`Name already in use. Try something unique.`);
        return this;
    }

    public product_duplicate_tag_toaster_message() {
        const homePage = new ProductHomePage();
        homePage.verify_toast_message("Error creating tag")
            .verify_toast_message_text(`Tag already exists`)
        return new ProductCreatePage();
    }

    public product_updated_toaster_message(productName: string) {
        const homePage = new ProductHomePage();
        homePage.verify_toast_message("Product updated successfully")
            .verify_toast_message_text(`Product, "Api${productName}" has been successfully updated`);
        return this;
    }
}