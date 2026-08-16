import { test } from '@playwright/test';
import { BaseTest } from '../BaseTest';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { closeDb, getLoginNegativeTestData, getLoginTestData } from '../../../db';

let loginData: { url: string; username: string; password: string };
let loginNegativeData: {
  url: string;
  invalidUsername: string;
  invalidPassword: string;
  invalidCredentialsMessage: string;
  requiredFieldMessage: string;
};

test.beforeAll(async () => {
  [loginData, loginNegativeData] = await Promise.all([getLoginTestData(), getLoginNegativeTestData()]);
});

test.afterAll(async () => {
  await closeDb();
});

export class LoginTest extends BaseTest {
  public static loginWithValidCredentials(): void {
    test('Login with valid credentials @sanity', async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await this.step(page, testInfo, 'Step 1: Navigate to login page', async () => {
        await loginPage.navigateToLogin(loginData.url);
      });

      await this.step(page, testInfo, 'Step 2: Enter valid username and password', async () => {
        await loginPage.enterUsername(loginData.username);
        await loginPage.enterPassword(loginData.password);
      });

      await this.step(page, testInfo, 'Step 3: Submit login and validate successful login', async () => {
        await loginPage.clickLoginButton();
        await dashboardPage.validateSuccessfulLogin();
      });
    });
  }

  public static loginWithInvalidCredentials(): void {
    test('Login with invalid credentials @sanity', async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);

      await this.step(page, testInfo, 'Step 1: Navigate to login page', async () => {
        await loginPage.navigateToLogin(loginNegativeData.url);
      });

      await this.step(page, testInfo, 'Step 2: Enter invalid username and password', async () => {
        await loginPage.enterUsername(loginNegativeData.invalidUsername);
        await loginPage.enterPassword(loginNegativeData.invalidPassword);
      });

      await this.step(page, testInfo, 'Step 3: Submit login and validate invalid credentials error', async () => {
        await loginPage.clickLoginButton();
        await loginPage.validateInvalidCredentials(loginNegativeData.invalidCredentialsMessage);
      });
    });
  }

  public static loginValidationForRequiredFields(): void {
    test('Login required field validation @sanity', async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);

      await this.step(page, testInfo, 'Step 1: Navigate to login page', async () => {
        await loginPage.navigateToLogin(loginNegativeData.url);
      });

      await this.step(page, testInfo, 'Step 2: Submit empty login form', async () => {
        await loginPage.clickLoginButton();
      });

      await this.step(page, testInfo, 'Step 3: Validate required field errors', async () => {
        await loginPage.validateRequiredFieldErrors(loginNegativeData.requiredFieldMessage);
      });
    });
  }
}

LoginTest.loginWithValidCredentials();
LoginTest.loginWithInvalidCredentials();
LoginTest.loginValidationForRequiredFields();