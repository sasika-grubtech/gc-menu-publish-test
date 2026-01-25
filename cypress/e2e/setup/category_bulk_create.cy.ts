import { AuthenticationService } from "cypress/scripts/authenticationService";

/**
 * Category Bulk Create Test (API-based)
 * 
 * This test creates categories directly via API - no temporary products needed!
 * Much faster and cleaner than the UI-based approach.
 * 
 * Run this test when setting up a new user/partner to create required categories.
 * 
 * After running this test, the fixture file will be updated with new category IDs.
 */

// API endpoint for category creation
const CATEGORY_CREATE_API = 'https://internal-api.staging.grubtech.io/gc3-bff/api/categories/create';

// Categories to create
const categoriesToCreate = [
    "Pizza",
    "Burgers", 
    "Salads",
    "Pasta",
    "Desserts",
    "Seafood",
    "Appetizers",
    "Beverages",
    "Pizza Category",
    "Main Dishes"
];

// Store created categories with their IDs
const createdCategories: { id: string; name: string }[] = [];

describe.skip('Setup: Create Categories via API', () => {

    before(() => {
        cy.log('🚀 Starting Category Creation Setup (API-based)');
        cy.log(`📁 Categories to create: ${categoriesToCreate.length}`);
    });

    it('Should create all categories via API', () => {
        // First authenticate to get the token
        AuthenticationService.authenticate().then(() => {
            const partnerId = Cypress.env('PARTNER_ID');
            const authToken = Cypress.env('authToken');
            
            cy.log(`🔑 Partner ID: ${partnerId}`);
            cy.log(`🔐 Auth Token received`);

            // Create each category sequentially
            const createCategoriesSequentially = (index: number): void => {
                if (index >= categoriesToCreate.length) {
                    return;
                }

                const categoryName = categoriesToCreate[index];
                cy.log(`➕ Creating category ${index + 1}/${categoriesToCreate.length}: ${categoryName}`);

                cy.request({
                    method: 'POST',
                    url: CATEGORY_CREATE_API,
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: {
                        partnerId: partnerId,
                        categoryName: categoryName
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        const categoryId = response.body.id || response.body._id || response.body.categoryId;
                        if (categoryId) {
                            createdCategories.push({ id: categoryId, name: categoryName });
                            cy.log(`✅ Category created: ${categoryName} (ID: ${categoryId})`);
                        } else {
                            cy.log(`⚠️ Category created but ID not found in response: ${JSON.stringify(response.body)}`);
                            // Still add with placeholder ID
                            createdCategories.push({ id: 'unknown', name: categoryName });
                        }
                    } else if (response.status === 409 || response.body?.message?.includes('already exists')) {
                        cy.log(`⚠️ Category already exists: ${categoryName}`);
                        // Try to get the existing ID from error response
                        const existingId = response.body?.existingId || response.body?.id || 'existing';
                        createdCategories.push({ id: existingId, name: categoryName });
                    } else {
                        cy.log(`❌ Failed to create category: ${categoryName}`);
                        cy.log(`   Status: ${response.status}`);
                        cy.log(`   Response: ${JSON.stringify(response.body)}`);
                    }

                    // Continue with next category
                    createCategoriesSequentially(index + 1);
                });
            };

            // Start creating categories
            createCategoriesSequentially(0);
        });
    });

    after(() => {
        cy.log('═══════════════════════════════════════════════════════════════');
        cy.log('✅ Category creation completed!');
        cy.log(`📋 Categories created: ${createdCategories.length}/${categoriesToCreate.length}`);
        
        // Log all created categories
        createdCategories.forEach((cat, i) => {
            cy.log(`   ${i + 1}. ${cat.name} (ID: ${cat.id})`);
        });
        
        // Update the fixture file with new category IDs
        if (createdCategories.length > 0) {
            const fixtureData = {
                categories: createdCategories
            };
            
            cy.writeFile('cypress/fixtures/shared/category.json', JSON.stringify(fixtureData, null, 2));
            cy.log('📁 Fixture file updated: cypress/fixtures/shared/category.json');
        }
        
        cy.log('═══════════════════════════════════════════════════════════════');
    });
});
