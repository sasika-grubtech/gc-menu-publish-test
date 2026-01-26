export class MenuGetDetailsService {

    private static readonly MENUS_SUMMARY_URL = "https://internal-api.staging.grubtech.io/gc-bff/menus/new/summary/byPartner/{partnerId}";

    // Get menus summary for a partner
    static getMenusSummary(partnerId: string, page: number = 0, size: number = 25) {
        const url = this.MENUS_SUMMARY_URL
            .replace('{partnerId}', partnerId) + `?&page=${page}&size=${size}`;

        return cy.request({
            method: 'GET',
            url: url,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
                'accept': 'application/json, text/plain, */*'
            },
            timeout: 30000 // 30 seconds timeout for menu fetching
        }).then((response) => {
            expect(response.status).to.eq(200);
            return cy.wrap(response.body);
        });
    }

    // Find menu by name and get its ID
    static findMenuByName(partnerId: string, menuName: string) {
        return this.getMenusSummary(partnerId, 0, 100).then((body: any) => {
            // Menus is an array according to actual API response
            const menusArray = Array.isArray(body.menus) ? body.menus : [];
            
            cy.log(`Searching for menu: "${menuName}" in ${menusArray.length} menus`);

            // Find menu by name - check various possible name structures
            const menu = menusArray.find((m: any) => {
                // Try different name field structures
                let name: string | undefined;
                
                // Check if name is directly on the menu object
                if (typeof m.name === 'string') {
                    name = m.name;
                } else if (m.name && typeof m.name === 'object') {
                    // Name might be an object with text property
                    name = m.name.text || m.name.value || m.name.name;
                }
                
                // Log for debugging
                if (name) {
                    cy.log(`Comparing menu name: "${name}" with search: "${menuName}"`);
                }
                
                return name === menuName;
            });
            
            if (menu && menu.id) {
                const menuId = menu.id;
                // Save menu ID as GC2_MENU_ID
                Cypress.env('GC2_MENU_ID', menuId);
                
                // Also save version for if-match header if available
                const version = menu.version;
                if (version) {
                    Cypress.env('GC2_MENU_VERSION', version);
                }
                
                cy.log(`✅ Found GC2 menu: ${menuName} with ID: ${menuId}`);
                cy.log(`GC2_MENU_ID set to: ${menuId}`);
                if (version) {
                    cy.log(`GC2_MENU_VERSION set to: ${version}`);
                }
                return cy.wrap(true); // Menu found
            }
            
            // Log available menu names for debugging
            const availableNames = menusArray.map((m: any) => {
                if (typeof m.name === 'string') return m.name;
                if (m.name?.text) return m.name.text;
                if (m.name?.value) return m.name.value;
                return 'unknown';
            });
            cy.log(`⚠️ GC2 menu with name "${menuName}" not found`);
            cy.log(`Available menu names: ${availableNames.join(', ')}`);
            return cy.wrap(false); // Menu not found
        });
    }
}

