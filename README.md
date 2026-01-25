# GrubCenter Menu Publish Test Automation

Cypress test automation suite for GrubCenter 3.0, focusing on product creation and menu publishing features.

## 📋 Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Architecture](#test-architecture)
- [Available Test Suites](#available-test-suites)
- [Writing New Tests](#writing-new-tests)

## 🏗️ Project Structure

```
gc-menu-publish-test/
├── cypress/
│   ├── e2e/
│   │   └── product/
│   │       └── product_create_feature.cy.ts
│   ├── fixtures/
│   │   ├── product.json
│   │   └── shared/
│   │       ├── tags.json
│   │       ├── allergens.json
│   │       ├── classifications.json
│   │       ├── brands.json
│   │       ├── languages.json
│   │       └── category.json
│   ├── page-objects/
│   │   └── pages/
│   │       ├── product/
│   │       │   ├── product_home_page.ts
│   │       │   └── product_create_page.ts
│   │       ├── navigator/
│   │       │   └── page_navigator.ts
│   │       └── cleanup/
│   │           ├── product_cleanup_method.ts
│   │           └── category_cleanup_method.ts
│   ├── services/
│   │   └── product/
│   │       ├── product-get-details.ts
│   │       └── product-delete.ts
│   ├── scripts/
│   │   └── authenticationService.ts
│   └── support/
│       ├── commands.ts
│       └── e2e.ts
├── cypress.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ✅ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Access**: Valid credentials for GrubCenter staging environment

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/sasika-grubtech/gc-menu-publish-test.git
cd gc-menu-publish-test
```

2. Install dependencies:
```bash
npm install
```

## ⚙️ Configuration

### Environment Variables

The project uses the following environment variables configured in `cypress.config.ts`:

```typescript
env: {
  LOGIN_USERNAME: "newpizza49@gmail.com",
  LOGIN_PASSWORD: "Zone@123",
  AUTH_USERNAME: "newpizza49@gmail.com",
  AUTH_PASSWORD: "Zone@123",
  COGNITO_CLIENT_ID: "2f71mdgg2d72e9g9tb6uu1j32b",
  COGNITO_USER_POOL_ID: "eu-west-2_kd9oYEIWi",
  PARTNER_ID: "60ad435d39f1600f7cce8f37",
  MENU_MANAGEMENT_SERVICE_API_BASE_URL: "https://internal-api.staging.grubtech.io/gc3-menu-mgt",
}
```

### Base URL
- **Staging**: `https://grubcenter.staging.grubtech.io/`

## 🧪 Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cy:open
```

### Run Tests Headlessly (CI/CD Mode)
```bash
npm run cy:run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/product/product_create_feature.cy.ts"
```

### Run with Specific Browser
```bash
npm run cy:run -- --browser chrome
npm run cy:run -- --browser firefox
npm run cy:run -- --browser edge
```

## 🏛️ Test Architecture

This project follows industry-standard design patterns:

### 1. **Page Object Model (POM)**
- Separates page structure from test logic
- Improves maintainability and reusability
- Example: `ProductHomePage`, `ProductCreatePage`

### 2. **Service Layer**
- Handles API calls for setup, verification, and cleanup
- Keeps tests clean and focused
- Example: `ProductGetDetailsService`, `ProductDeleteService`

### 3. **Fixture-Based Test Data**
- Centralized test data management
- Easy to update and maintain
- Auto-loaded via `support/e2e.ts`

### 4. **Method Chaining (Fluent Interface)**
All page object methods return `this` or a new page object, enabling clean, readable test code:

```typescript
productHomePage
    .verify_products_header_text()
    .verify_create_new_button_visible()
    .step_click_create_new_product_button();

productCreatePage
    .product_create_with_mandatory_fields(this.productData)
    .product_add_category(this.categoryData)
    .product_create_button_click()
    .product_created_toaster_message(this.productData.product.name);
```

## 📦 Available Test Suites

### Product Creation Tests (`product_create_feature.cy.ts`)

| Test Case | Description |
|-----------|-------------|
| Product creation with mandatory fields | Creates a product with only required fields |
| Product creation with description | Creates a product with description |
| Product creation with external ID | Creates a product with external ID |
| Product creation with category | Creates a product and assigns it to a category |
| Product with nutritional info | Creates a product with nutritional information |
| Product with tags - existing tag | Creates a product and assigns existing tags |
| Product with tags - new tag | Creates a product and creates a new tag |
| Product with allergens and classifications | Creates a product with allergens and dietary classifications |
| Product with pricing | Creates a product with pricing information |
| Product creation with all fields | Creates a product with all available fields |
| Verify duplicate product error | Validates duplicate product error handling |

## ✍️ Writing New Tests

### 1. Create a New Test File

```typescript
import { ProductCreatePage } from "cypress/page-objects/pages/product/product_create_page";
import { AuthenticationService } from "cypress/scripts/authenticationService";

describe('My New Feature', () => {
    
    beforeEach(() => {
        // Authenticate and navigate
        AuthenticationService.authenticate().then(() => {
            cy.visit("/products");
        });
    });

    it('should do something', function() {
        // Your test logic here
    });
});
```

### 2. Add New Page Objects

Create a new page object in `cypress/page-objects/pages/`:

```typescript
export class MyNewPage {
    
    // Selectors
    private btn_submit = '[data-cy="submit-button"]';
    
    // Methods
    public clickSubmit() {
        cy.get(this.btn_submit).click();
        return this;
    }
}
```

### 3. Add New Fixtures

Create a new fixture in `cypress/fixtures/`:

```json
{
  "myData": {
    "name": "Test Name",
    "value": "Test Value"
  }
}
```

Load it in `cypress/support/e2e.ts`:

```typescript
beforeEach(() => {
  cy.fixture('myData').as('myData');
});
```

## 🔧 Key Features

### Authentication
- **Cognito-based authentication** handled automatically
- Tokens stored in localStorage
- Reusable `AuthenticationService` class

### Automatic Cleanup
- Products created during tests are automatically deleted in `afterEach` hooks
- Prevents test data pollution
- Uses API services for efficient cleanup

### Error Handling
- Network errors and timeouts are caught and logged
- Tests don't fail due to transient network issues
- Configured in `cypress/support/e2e.ts`

### Dynamic Test Data
- Uses `@faker-js/faker` for generating unique test data
- Prevents duplicate data issues
- Ensures test isolation

## 📊 Best Practices

1. **Use `function()` syntax** in test blocks to access fixtures via `this`:
   ```typescript
   it('should work', function() {
       // Can access this.productData
   });
   ```

2. **Always clean up** test data in `afterEach` hooks

3. **Use descriptive test names** that explain what's being tested

4. **Follow the AAA pattern**:
   - **Arrange**: Set up test data
   - **Act**: Perform actions
   - **Assert**: Verify results

5. **Keep tests independent**: Each test should run successfully in isolation

## 🐛 Troubleshooting

### Tests fail with authentication errors
- Verify credentials in `cypress.config.ts`
- Check if Cognito credentials are valid
- Ensure network access to staging environment

### Tests fail with timeout errors
- Increase timeouts in `cypress.config.ts`
- Check if staging environment is accessible
- Verify network stability

### Cleanup fails
- Verify `PARTNER_ID` in environment variables
- Check API service URLs
- Ensure auth token is valid

## 📝 Notes

- **Test Data**: All test data uses dynamic generation with Faker.js to ensure uniqueness
- **Authentication**: Automatic authentication before each test
- **Cleanup**: Automatic cleanup after each test to maintain clean test environment
- **Fixtures**: Common fixtures are loaded globally in `support/e2e.ts`

## 🤝 Contributing

When adding new tests or features:
1. Follow the existing code structure
2. Use Page Object Model pattern
3. Add appropriate cleanup in `afterEach` hooks
4. Update this README with new test descriptions
5. Ensure tests pass independently

## 📧 Support

For issues or questions, please contact the QA automation team.

---

**Happy Testing! 🚀**
