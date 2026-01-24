// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Import cypress-xpath plugin
import 'cypress-xpath'

// ============================================================
// Global Fixture Loading
// ============================================================
// Load common fixtures before each test to avoid duplication
// These will be available as this.productData, this.tagsData, etc.
// in all test files that use function() syntax
beforeEach(() => {
  cy.fixture('product').as('productData');
  cy.fixture('shared/tags').as('tagsData');
  cy.fixture('shared/allergens').as('allergensData');
  cy.fixture('shared/classifications').as('classificationsData');
  cy.fixture('shared/brands').as('brandsData');
  cy.fixture('shared/languages').as('languagesData');
  cy.fixture('shared/category').as('categoryData');
  cy.fixture('modifier-groups').as('modifierGroupsData');
});

// Handle uncaught exceptions to prevent test failures from network errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Check if the error is a network error or timeout error
  if (err.message.includes('Network Error') || 
      err.message.includes('fetch') ||
      err.message.includes('XMLHttpRequest') ||
      err.message.includes('Failed to fetch') ||
      err.message.includes('timeout') ||
      err.message.includes('AxiosError') ||
      err.name === 'AxiosError') {
    // Log the error but don't fail the test
    console.log('Caught network/timeout error:', err.message);
    return false; // Prevent Cypress from failing the test
  }
  
  // For other errors, let Cypress handle them normally
  return true;
});