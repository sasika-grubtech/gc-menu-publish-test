export class HierarchyClearanceService {

    private static readonly HIERARCHY_CLEARANCE_URL = "https://api-gc3-backward-compatibility-mgt.staging.grubtech.io/api/v1/mapping/hierarchy/clearance/{partnerId}";

    static clearHierarchyMapping(partnerId: string) {
        return cy.request({
            method: 'POST',
            url: this.HIERARCHY_CLEARANCE_URL.replace('{partnerId}', partnerId),
            headers: {
                authorization: Cypress.env('authToken'),
            },
            timeout: 30000,
            failOnStatusCode: false,
        });
    }

}
