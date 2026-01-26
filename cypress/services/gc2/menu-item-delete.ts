export class MenuItemDeleteService {

    private static RECIPE_DELETE_URL = "https://internal-api.staging.grubtech.io/menu-mgt/v1.0/recipes/deletion/{recipeId}";

    static deleteRecipe(recipeId: string) {
        return cy.request({
            method: 'DELETE',
            url: this.RECIPE_DELETE_URL.replace('{recipeId}', recipeId),
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
                'accept': 'application/json, text/plain, */*',
                'if-match': '1'
            },
            timeout: 30000 // 30 seconds timeout for recipe deletion
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    }

}

