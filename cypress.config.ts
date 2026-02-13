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
      LOGIN_USERNAME: "<REDACTED-EMAIL>",
      LOGIN_PASSWORD: "<REDACTED>",
      AUTH_USERNAME: "<REDACTED-EMAIL>",
      AUTH_PASSWORD: "<REDACTED>",
      COGNITO_CLIENT_ID: "<REDACTED-COGNITO-CLIENT-ID>",
      COGNITO_USER_POOL_ID: "<REDACTED-USER-POOL-ID>",
      PARTNER_ID: "<REDACTED-PARTNER-ID>",
      MENU_MANAGMENT_SERVICE_API_BASE_URL: "https://internal-api.staging.grubtech.io/gc3-menu-mgt",

    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
