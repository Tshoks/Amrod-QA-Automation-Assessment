import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private readonly dashboardHeader: string =
    '//h6[normalize-space()="Dashboard"]';

  constructor(page: Page) {
    super(page);
  }

  async dismissPasswordChangePopup(): Promise<this> {
    const okButton = this.page.getByRole("button", { name: /^OK$/i });

    try {
      await okButton.waitFor({ state: "visible", timeout: 3000 });
      await okButton.click();
      await this.page.waitForTimeout(500);
    } catch {
      // Ignore if the popup is not present.
    }

    return this;
  }

  async validateSuccessfulLogin(): Promise<this> {
    await this.dismissPasswordChangePopup();
    await expect(this.page.locator(this.dashboardHeader)).toBeVisible();
    return this;
  }
}
