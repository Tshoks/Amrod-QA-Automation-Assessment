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

      await this.step(page, testInfo, 'Step 2: Complete login with valid credentials', async () => {
        await loginPage.completeLogin(loginData.username, loginData.password);
      });

      await this.step(page, testInfo, 'Step 3: Validate successful login', async () => {
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

      await this.step(page, testInfo, 'Step 2: Attempt login with invalid credentials', async () => {
        await loginPage.completeLogin(loginNegativeData.invalidUsername, loginNegativeData.invalidPassword);
      });

      await this.step(page, testInfo, 'Step 3: Validate invalid credentials error', async () => {
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