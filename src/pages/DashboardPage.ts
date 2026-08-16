import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private readonly dashboardHeader: string =
    '//h6[normalize-space()="Dashboard"]';

  constructor(page: Page) {
    super(page);
  }

  async validateSuccessfulLogin(): Promise<this> {
    await expect(this.page.locator(this.dashboardHeader)).toBeVisible();
    return this;
  }
}
