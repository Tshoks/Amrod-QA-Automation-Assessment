import { expect, Page } from "@playwright/test";
import { LoginElements } from "../elements/LoginElements";
import { BasePage } from "./BasePage";
import { DashboardPage } from "./DashboardPage";

export class LoginPage extends BasePage {
  private readonly loginElements: LoginElements;

  constructor(page: Page) {
    super(page);
    this.loginElements = new LoginElements();
  }

  async navigateToLogin(url: string): Promise<this> {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.page
      .locator(this.loginElements.getUsernameInput())
      .waitFor({ state: "visible" });
    return this;
  }

  async enterUsername(username: string): Promise<this> {
    await this.type(this.loginElements.getUsernameInput(), username);
    return this;
  }

  async enterPassword(password: string): Promise<this> {
    await this.fillMasked(this.loginElements.getPasswordInput(), password);
    return this;
  }

  async clickLoginButton(): Promise<this> {
    await this.click(this.loginElements.getLoginButton());
    await this.page.waitForTimeout(1500);
    return this;
  }

  async validateInvalidCredentials(message: string): Promise<this> {
    await this.assertVisible(`text=${message}`);
    return this;
  }

  async validateRequiredFieldErrors(message: string): Promise<this> {
    await expect(this.page.getByText(message, { exact: true })).toHaveCount(2);
    return this;
  }

  async completeLogin(
    username: string,
    password: string,
  ): Promise<DashboardPage> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    return new DashboardPage(this.page);
  }
}
