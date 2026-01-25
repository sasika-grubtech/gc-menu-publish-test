export class ProductGetDetailsService {

    private static readonly PRODUCT_FILTER_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/products/filter";

    // Filter products and find by name
    static filterProductsByName(partnerId: string, productName: string) {
        const requestBody = {
            partnerId: partnerId,
            pagination: {
                pageNumber: 0,
                pageSize: 100, // Increase page size to get more results
                availableElements: 0,
                totalElements: 0,
                totalPages: 0
            },
            filters: []
        };

        return cy.request({
            method: 'POST',
            url: this.PRODUCT_FILTER_URL,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
            },
            body: requestBody,
            timeout: 30000 // 30 seconds timeout for product filtering
        }).then((response) => {
            const products = response.body.data.items;
            const product = products.find((p: any) => p.name === productName);
            
            if (product) {
                // Save product ID as PRODUCT_ID
                Cypress.env('PRODUCT_ID', product.id);
                cy.log(`Found product: ${product.name} with ID: ${product.id}`);
                cy.log(`PRODUCT_ID set to: ${product.id}`);
                return cy.wrap(true); // Product found
            } else {
                cy.log(`Product with name "${productName}" not found - nothing to clean up`);
                return cy.wrap(false); // Product not found
            }
        });
    }
}
