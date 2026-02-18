export class HierarchyClearanceService {

    private static readonly DEFAULT_HIERARCHY_CLEARANCE_URL = "https://api-gc3-backward-compatibility-mgt.staging.grubtech.io/api/v1/mapping/hierarchy/clearance/{partnerId}";

    static clearHierarchyMapping(partnerId: string) {
        const baseUrl = Cypress.env('HIERARCHY_CLEARANCE_API_BASE_URL') || this.DEFAULT_HIERARCHY_CLEARANCE_URL;
        const url = baseUrl.replace('{partnerId}', partnerId);
        return cy.request({
            method: 'POST',
            url,
            headers: {
                authorization: Cypress.env('authToken'),
            },
            timeout: 30000,
            failOnStatusCode: false,
        });
    }

}
