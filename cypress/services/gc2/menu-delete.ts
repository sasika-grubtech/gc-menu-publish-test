export class MenuDeleteService {

    private static MENU_DELETE_URL = "https://internal-api.staging.grubtech.io/menu-mgt/v1.0/menus/{menuId}";

    static deleteMenu(menuId: string, version?: number) {
        const headers: any = {
            'authorization': `${Cypress.env('authToken')}`,
            'accept': 'application/json, text/plain, */*',
            'cache-control': 'max-age=0'
        };

        // Use version from env or parameter, default to 1 if not provided
        const ifMatch = version || Cypress.env('GC2_MENU_VERSION') || 1;
        headers['if-match'] = ifMatch.toString();

        return cy.request({
            method: 'DELETE',
            url: this.MENU_DELETE_URL.replace('{menuId}', menuId),
            headers: headers,
            timeout: 30000 // 30 seconds timeout for menu deletion
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    }

}

