import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ValidationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private async validateWithStep(
    stepName: string,
    action: () => Promise<void>,
    errorMessage: string,
  ): Promise<void> {
    await test.step(stepName, async () => {
      try {
        await action();
      } catch (error) {
        await this.takeScreenshot(stepName);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${errorMessage} ${message}`.trim());
      }
    });
  }

  async validateText(locator: string, expected: string): Promise<void> {
    await this.validateWithStep(
      `Validate text '${expected}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(this.page.locator(locator)).toHaveText(expected);
      },
      `Failed to validate text '${expected}' at locator '${locator}'.`,
    );
  }

  async validateToastMessage(expected: string): Promise<void> {
    const locator = `text=${expected}`;

    await this.validateWithStep(
      `Validate toast message '${expected}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(
          this.page.getByText(expected, { exact: true }),
        ).toBeVisible();
      },
      `Failed to validate toast message '${expected}'.`,
    );
  }

  async validatePageHeader(expected: string): Promise<void> {
    const locator = `text=${expected}`;

    await this.validateWithStep(
      `Validate page header '${expected}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(
          this.page.getByRole("heading", { name: expected }),
        ).toBeVisible();
      },
      `Failed to validate page header '${expected}'.`,
    );
  }
}
