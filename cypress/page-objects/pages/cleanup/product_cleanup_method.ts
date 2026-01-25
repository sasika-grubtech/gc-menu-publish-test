import { ProductDeleteService } from "cypress/services/product/product-delete";
import { ProductGetDetailsService } from "cypress/services/product/product-get-details";



export class CleanupMethods {

    public cleanup_product(productName: string) {
        cy.then(() => {

            const partnerId = Cypress.env('PARTNER_ID') || '60ad435d39f1600f7cce8f37';

            // Find product by name and delete it only if found
            ProductGetDetailsService.filterProductsByName(partnerId, productName)
                .then((productFound) => {
                    if (productFound) {
                        // Delete the product only if it was found
                        ProductDeleteService.deleteProduct(partnerId, Cypress.env('PRODUCT_ID'))
                            .then(() => {
                                cy.log(`Cleanup: Successfully deleted product with ID: ${Cypress.env('PRODUCT_ID')}`);
                            });
                    } else {
                        cy.log(`Cleanup: No product found to delete - skipping cleanup`);
                    }
                });
        });
    }
}