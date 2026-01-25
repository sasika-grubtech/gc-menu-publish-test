export class ModifierGroupGetDetailsService {

    private static readonly MODIFIER_GROUP_FILTER_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/modifier-groups/filter";

    // Filter products and find by name
    static filterModifierGroupsByName(partnerId: string, modifierGroupName: string, type: 'product' | 'text' = 'text') {
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
            url: this.MODIFIER_GROUP_FILTER_URL,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
            },
            body: requestBody,
            timeout: 30000 // 30 seconds timeout for modifier group filtering
        }).then((response) => {
            // expect(response.status).to.eq(200);
            const modifierGroups = response.body.data.items;
            const modifierGroup = modifierGroups.find((p: any) => p.name === modifierGroupName);
            
            if (modifierGroup) {
                // Assign environment variable based on type
                if (type === 'product') {
                    Cypress.env('PRODUCT_MODIFIER_GROUP_ID', modifierGroup.id);
                    cy.log(`Found product modifier group: ${modifierGroup.name} with ID: ${modifierGroup.id}`);
                    cy.log(`PRODUCT_MODIFIER_GROUP_ID set to: ${modifierGroup.id}`);
                } else {
                    Cypress.env('TEXT_MODIFIER_GROUP_ID', modifierGroup.id);
                    cy.log(`Found text modifier group: ${modifierGroup.name} with ID: ${modifierGroup.id}`);
                    cy.log(`TEXT_MODIFIER_GROUP_ID set to: ${modifierGroup.id}`);
                }
                return cy.wrap(true); // Modifier group found
            } else {
                cy.log(`Modifier group with name "${modifierGroupName}" not found - nothing to clean up`);
                return cy.wrap(false); // Modifier group not found
            }
        });
    }
}
