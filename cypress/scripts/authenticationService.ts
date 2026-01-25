export class AuthenticationService {

    private static readonly COGNITO_URL = "https://cognito-idp.eu-west-2.amazonaws.com/";

    // Authentication methods
    static authenticate() {
        const authBody = {
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: Cypress.env('AUTH_USERNAME') || "newpizza49@gmail.com",
                PASSWORD: Cypress.env('AUTH_PASSWORD') || "Zone@123"
            },
            ClientId: Cypress.env('COGNITO_CLIENT_ID') || "2f71mdgg2d72e9g9tb6uu1j32b",
            UserPoolId: Cypress.env('COGNITO_USER_POOL_ID') || "eu-west-2_kd9oYEIWi"
        };

        return cy.request({
            method: 'POST',
            url: this.COGNITO_URL,
            body: authBody,
            headers: {
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
                "Content-Type": "application/x-amz-json-1.1",
            },
            timeout: 60000 // 60 seconds timeout for authentication
        }).then((response) => {
            expect(response.status).to.eq(200);
            const token = response.body.AuthenticationResult.IdToken;
            const accessToken = response.body.AuthenticationResult.AccessToken;
            const refreshToken = response.body.AuthenticationResult.RefreshToken;
            
            // Set auth token for API calls
            Cypress.env("authToken", `Bearer ${token}`);
            
            // Set localStorage in browser context
            return cy.window().then((win) => {
                const clientId = Cypress.env('COGNITO_CLIENT_ID');
                const username = Cypress.env('AUTH_USERNAME');
                
                // Set all required Cognito tokens in localStorage
                win.localStorage.setItem(`CognitoIdentityServiceProvider.${clientId}.${username}.idToken`, token);
                win.localStorage.setItem(`CognitoIdentityServiceProvider.${clientId}.${username}.accessToken`, accessToken);
                win.localStorage.setItem(`CognitoIdentityServiceProvider.${clientId}.${username}.refreshToken`, refreshToken);
                win.localStorage.setItem(`CognitoIdentityServiceProvider.${clientId}.LastAuthUser`, username);
                
                // Set additional auth data
                win.localStorage.setItem('authToken', token);
                win.localStorage.setItem('accessToken', accessToken);
                win.localStorage.setItem('refreshToken', refreshToken);
                
                cy.log('✅ Authentication successful');
                cy.log(`🔑 Token: ${token.substring(0, 20)}...`);
            });
        });
    }
}
