import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "1g4u9o",
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
  },
  retries: {
    runMode: 0, // Retry failed tests 1 times in headless mode
    openMode: 0, // Retry failed tests 1 time in interactive mode
  },


  e2e: {
    baseUrl: "https://grubcenter.staging.grubtech.io/",
    viewportWidth: 1920,  // Default width
    viewportHeight: 2080, // Default height
    // Only run test files from e2e/scenarios folder
    specPattern: "cypress/e2e/scenarios/**/*.cy.{js,jsx,ts,tsx}",
    // Prevent tests from being skipped when one fails
    experimentalRunAllSpecs: true,
    // Increase default command timeout for network operations
    defaultCommandTimeout: 15000,
    // Increase request timeout
    requestTimeout: 15000,
    // Increase response timeout
    responseTimeout: 30000,
    // Increase page load timeout
    pageLoadTimeout: 60000,
    env: {
      // GC2 backward compatibility: load this URL before GC2 validation so GC2 components display (permissions)
      GC2_ENTRY_URL: "/menu-management/menu-items?mode=gc2WriteAdmin",
      // Authentication credentials
      LOGIN_USERNAME: "kakinof852@mustaer.com",
      LOGIN_PASSWORD: "Test@123",
      AUTH_USERNAME: "kakinof852@mustaer.com",
      AUTH_PASSWORD: "Test@123",
      COGNITO_CLIENT_ID: "2f71mdgg2d72e9g9tb6uu1j32b",
      COGNITO_USER_POOL_ID: "eu-west-2_kd9oYEIWi",
      PARTNER_ID: "69732ea3cf208476bf388e8b",
      MENU_MANAGMENT_SERVICE_API_BASE_URL: "https://internal-api.staging.grubtech.io/gc3-menu-mgt",

    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
