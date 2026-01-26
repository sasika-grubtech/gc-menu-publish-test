export class ModifierGroupGetDetailsService {

    private static readonly MODIFIER_GROUPS_SUMMARY_URL = "https://internal-api.staging.grubtech.io/gc-bff/modifier-group-templates/new/summary/byPartner/{partnerId}";

    // Get modifier groups summary for a partner
    static getModifierGroupsSummary(partnerId: string, page: number = 0, size: number = 50) {
        const url = this.MODIFIER_GROUPS_SUMMARY_URL
            .replace('{partnerId}', partnerId) + `?&page=${page}&size=${size}`;

        return cy.request({
            method: 'GET',
            url: url,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
                'accept': 'application/json, text/plain, */*'
            },
            timeout: 30000
        }).then((response) => {
            expect(response.status).to.eq(200);
            return cy.wrap(response.body);
        });
    }

    // Find modifier group by name and get its ID
    static findModifierGroupByName(partnerId: string, modifierGroupName: string) {
        return this.getModifierGroupsSummary(partnerId, 0, 100).then((body: any) => {
            // modifierGroupTemplates is an array
            const modifierGroupsArray = Array.isArray(body.modifierGroupTemplates) ? body.modifierGroupTemplates : [];
            
            cy.log(`Searching for modifier group: "${modifierGroupName}" in ${modifierGroupsArray.length} modifier groups`);

            // Find modifier group by name - check name.text structure
            const modifierGroup = modifierGroupsArray.find((mg: any) => {
                const mgTemplate = mg.modifierGroupTemplate;
                if (!mgTemplate) return false;
                
                // Name is at modifierGroupTemplate.name.text
                let name: string | undefined;
                if (typeof mgTemplate.name === 'string') {
                    name = mgTemplate.name;
                } else if (mgTemplate.name && typeof mgTemplate.name === 'object') {
                    name = mgTemplate.name.text || mgTemplate.name.value || mgTemplate.name.name;
                }
                
                // Log for debugging
                if (name) {
                    cy.log(`Comparing modifier group name: "${name}" with search: "${modifierGroupName}"`);
                }
                
                return name === modifierGroupName;
            });
            
            if (modifierGroup && modifierGroup.modifierGroupTemplate && modifierGroup.modifierGroupTemplate.id) {
                const mgId = modifierGroup.modifierGroupTemplate.id;
                const version = modifierGroup.modifierGroupTemplate.version;
                
                // Save modifier group ID and version
                Cypress.env('GC2_MODIFIER_GROUP_ID', mgId);
                if (version) {
                    Cypress.env('GC2_MODIFIER_GROUP_VERSION', version);
                }
                
                cy.log(`✅ Found GC2 modifier group: ${modifierGroupName} with ID: ${mgId}`);
                cy.log(`GC2_MODIFIER_GROUP_ID set to: ${mgId}`);
                if (version) {
                    cy.log(`GC2_MODIFIER_GROUP_VERSION set to: ${version}`);
                }
                return cy.wrap(true); // Modifier group found
            }
            
            // Log available modifier group names for debugging
            const availableNames = modifierGroupsArray.map((mg: any) => {
                const mgTemplate = mg.modifierGroupTemplate;
                if (!mgTemplate) return 'unknown';
                if (typeof mgTemplate.name === 'string') return mgTemplate.name;
                if (mgTemplate.name?.text) return mgTemplate.name.text;
                if (mgTemplate.name?.value) return mgTemplate.name.value;
                return 'unknown';
            });
            cy.log(`⚠️ GC2 modifier group with name "${modifierGroupName}" not found`);
            cy.log(`Available modifier group names: ${availableNames.join(', ')}`);
            return cy.wrap(false); // Modifier group not found
        });
    }
}

