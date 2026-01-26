export class MenuDeleteService {

    private static MENU_DELETE_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/menus/delete/byPartnerId/{partnerId}/byId/{menuId}";

    static deleteMenu(partnerId: string, menuId: string) {
        return cy.request({
            method: 'DELETE',
            url: this.MENU_DELETE_URL
                .replace('{partnerId}', partnerId)
                .replace('{menuId}', menuId),
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
            },
            timeout: 30000 // 30 seconds timeout for menu deletion
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    }

}

