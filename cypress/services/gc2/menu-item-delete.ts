export class MenuItemDeleteService {

    private static RECIPE_DELETE_URL = "https://internal-api.staging.grubtech.io/menu-mgt/v1.0/recipes/deletion/{recipeId}";

    static deleteRecipe(recipeId: string, version?: number) {
        const headers: any = {
            'authorization': `${Cypress.env('authToken')}`,
            'accept': 'application/json, text/plain, */*'
        };

        // Use version from parameter, env, or default to 1
        const ifMatch = version || Cypress.env('RECIPE_VERSION') || 1;
        headers['if-match'] = ifMatch.toString();

        return cy.request({
            method: 'DELETE',
            url: this.RECIPE_DELETE_URL.replace('{recipeId}', recipeId),
            headers: headers,
            timeout: 30000, // 30 seconds timeout for recipe deletion
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200 || response.status === 204) {
                cy.log(`✅ Successfully deleted menu item (recipe): ${recipeId}`);
                return cy.wrap(response);
            } else {
                cy.log(`⚠️ Unexpected status code when deleting recipe: ${response.status}`);
                cy.log(`Response body: ${JSON.stringify(response.body)}`);
                return cy.wrap(response);
            }
        });
    }

}

