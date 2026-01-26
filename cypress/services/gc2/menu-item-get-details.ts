export class MenuItemGetDetailsService {

    private static readonly RECIPES_SUMMARY_URL = "https://internal-api.staging.grubtech.io/gc-bff/recipes/new/summary/byPartner/{partnerId}";

    // Get recipes summary for a partner
    static getRecipesSummary(partnerId: string, page: number = 0, size: number = 50) {
        const url = this.RECIPES_SUMMARY_URL
            .replace('{partnerId}', partnerId) + `?page=${page}&size=${size}`;

        return cy.request({
            method: 'GET',
            url: url,
            headers: {
                'authorization': `${Cypress.env('authToken')}`,
                'accept': 'application/json, text/plain, */*'
            },
            timeout: 30000 // 30 seconds timeout for recipe fetching
        }).then((response) => {
            expect(response.status).to.eq(200);
            return cy.wrap(response.body);
        });
    }

    // Find recipe by name and get its ID
    static findRecipeByName(partnerId: string, recipeName: string) {
        return this.getRecipesSummary(partnerId, 0, 100).then((body: any) => {
            const recipes = body.recipes || [];
            // Recipe name is stored in recipe.recipe.name.text
            const recipe = recipes.find((r: any) => r.recipe?.name?.text === recipeName);
            
            if (recipe && recipe.recipe) {
                const recipeId = recipe.recipe.id;
                // Save recipe ID as RECIPE_ID
                Cypress.env('RECIPE_ID', recipeId);
                cy.log(`Found recipe: ${recipeName} with ID: ${recipeId}`);
                cy.log(`RECIPE_ID set to: ${recipeId}`);
                return cy.wrap(true); // Recipe found
            } else {
                cy.log(`Recipe with name "${recipeName}" not found - nothing to clean up`);
                return cy.wrap(false); // Recipe not found
            }
        });
    }
}

