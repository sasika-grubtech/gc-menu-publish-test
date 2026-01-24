export class ModifierGroupDeleteService {

    private static MODIFIER_GROUP_DELETE_URL = "https://internal-api.staging.grubtech.io/gc3-bff/api/modifier-groups/delete/byPartnerId/{partnerId}/byId/{modifierGroupId}";

    static deleteModifierGroup(partnerId: string, modifierGroupId: string) {
        return cy.request({
            method: 'DELETE',
            url: this.MODIFIER_GROUP_DELETE_URL
                .replace('{partnerId}', partnerId)
                .replace('{modifierGroupId}', modifierGroupId),
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
            },
            timeout: 30000 // 30 seconds timeout for modifier group deletion
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    }

}
