export class ModifierGroupDeleteService {

    private static MODIFIER_GROUP_DELETE_URL = "https://internal-api.staging.grubtech.io/menu-mgt/v1.0/modifier-group-templates/deletion/{modifierGroupTemplateId}";

    // Delete a GC2 modifier group template
    static deleteModifierGroup(modifierGroupTemplateId: string, version?: number) {
        const url = this.MODIFIER_GROUP_DELETE_URL.replace('{modifierGroupTemplateId}', modifierGroupTemplateId);

        const headers: any = {
            'authorization': `${Cypress.env('authToken')}`,
            'accept': 'application/json, text/plain, */*',
            'cache-control': 'max-age=0'
        };

        // Add if-match header if version is provided
        if (version !== undefined) {
            headers['if-match'] = version.toString();
        }

        return cy.request({
            method: 'DELETE',
            url: url,
            headers: headers,
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200 || response.status === 204) {
                cy.log(`✅ Successfully deleted GC2 modifier group template: ${modifierGroupTemplateId}`);
                return cy.wrap(response);
            } else {
                cy.log(`⚠️ Unexpected status code when deleting modifier group: ${response.status}`);
                cy.log(`Response body: ${JSON.stringify(response.body)}`);
                return cy.wrap(response);
            }
        });
    }
}

