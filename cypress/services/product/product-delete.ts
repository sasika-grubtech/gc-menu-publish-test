export class ProductDeleteService {

    private static PRODUCT_DELETE_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/products/delete/byPartnerId/{partnerId}/byId/{productId}";

    static deleteProduct(partnerId: string, productId: string) {
        return cy.request({
            method: 'DELETE',
            url: this.PRODUCT_DELETE_URL
                .replace('{partnerId}', partnerId)
                .replace('{productId}', productId),
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
            },
            timeout: 30000 // 30 seconds timeout for product deletion
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    }

}
