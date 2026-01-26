export class MenuGetDetailsService {

    private static readonly MENU_FILTER_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/menus/filter";

    // Filter menus and find by name
    static filterMenusByName(partnerId: string, menuName: string) {
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
            url: this.MENU_FILTER_URL,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
                'content-type': 'application/json'
            },
            body: requestBody,
            timeout: 30000 // 30 seconds timeout for menu filtering
        }).then((response) => {
            const menus = response.body.data.items;
            const menu = menus.find((m: any) => m.name === menuName);
            
            if (menu) {
                // Save menu ID as MENU_ID
                Cypress.env('MENU_ID', menu.id);
                cy.log(`Found menu: ${menu.name} with ID: ${menu.id}`);
                cy.log(`MENU_ID set to: ${menu.id}`);
                return cy.wrap(true); // Menu found
            } else {
                cy.log(`Menu with name "${menuName}" not found - nothing to clean up`);
                return cy.wrap(false); // Menu not found
            }
        });
    }
}

