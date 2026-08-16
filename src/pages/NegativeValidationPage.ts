import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NegativeValidationPage extends BasePage {
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

  async validateErrorMessage(locator: string, expected: string): Promise<void> {
    await this.validateWithStep(
      `Validate error message '${expected}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(this.page.locator(locator)).toHaveText(expected);
      },
      `Failed to validate error message '${expected}' at locator '${locator}'.`,
    );
  }

  async validateRequiredField(locator: string): Promise<void> {
    await this.validateWithStep(
      `Validate required field '${locator}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(this.page.locator(locator)).toContainText(/required/i);
      },
      `Failed to validate the required field message at locator '${locator}'.`,
    );
  }

  async validateInvalidInput(locator: string, expected: string): Promise<void> {
    await this.validateWithStep(
      `Validate invalid input '${expected}'`,
      async () => {
        await this.assertVisible(locator);
        await expect(this.page.locator(locator)).toHaveValue(expected);
      },
      `Failed to validate invalid input '${expected}' at locator '${locator}'.`,
    );
  }
}
