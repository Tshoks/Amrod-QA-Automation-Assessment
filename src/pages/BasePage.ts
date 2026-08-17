import { expect, Page, test } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private sanitizeScreenshotName(name: string): string {
    return (
      name.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "") ||
      "screenshot"
    );
  }

  private async captureFailureScreenshot(name: string): Promise<void> {
    if (this.page.isClosed()) return;

    const screenshotName = `${this.sanitizeScreenshotName(name)}-${Date.now()}.png`;

    try {
      await this.page.screenshot({
        path: `./${screenshotName}`,
        fullPage: true,
      });
    } catch {
      // Best-effort screenshot capture; ignore if the page/context is already closed.
    }
  }

  private formatError(action: string, locator: string, error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);

    return `${action} failed for locator '${locator}'. ${message}`;
  }

  async click(locator: string): Promise<void> {
    await test.step(`Click ${locator}`, async () => {
      try {
        await this.page.locator(locator).click({ timeout: 30000 });
        await this.page.waitForTimeout(500);
      } catch (error) {
        await this.captureFailureScreenshot(`click-${locator}`);
        throw new Error(this.formatError("Click", locator, error));
      }
    });
  }

  async type(locator: string, value: string): Promise<void> {
    await test.step(`Type ${value} into ${locator}`, async () => {
      try {
        await this.page.locator(locator).fill(value);
      } catch (error) {
        await this.captureFailureScreenshot(`type-${locator}`);
        throw new Error(this.formatError("Type", locator, error));
      }
    });
  }

  async fillMasked(locator: string, value: string): Promise<void> {
    await test.step(`Fill "********" locator('${locator}')`, async () => {
      try {
        await this.page.locator(locator).evaluate((element, text) => {
          const input = element as any;
          input.focus();
          input.value = text;
          input.setAttribute("value", text);
          input.dispatchEvent(
            new Event("input", { bubbles: true, cancelable: true }),
          );
          input.dispatchEvent(
            new Event("change", { bubbles: true, cancelable: true }),
          );
          input.dispatchEvent(
            new Event("keyup", { bubbles: true, cancelable: true }),
          );
        }, value);
      } catch (error) {
        await this.captureFailureScreenshot(`fill-masked-${locator}`);
        throw new Error(this.formatError("Fill masked", locator, error));
      }
    });
  }

  async waitForVisible(locator: string): Promise<void> {
    await test.step(`Wait for visible ${locator}`, async () => {
      try {
        await this.page.locator(locator).waitFor({
          state: "visible",
          timeout: 60000,
        });
      } catch (error) {
        await this.captureFailureScreenshot(`wait-visible-${locator}`);
        throw new Error(this.formatError("Wait for visible", locator, error));
      }
    });
  }

  async assertVisible(locator: string): Promise<void> {
    await test.step(`Assert visible ${locator}`, async () => {
      try {
        await expect(this.page.locator(locator)).toBeVisible();
      } catch (error) {
        await this.captureFailureScreenshot(`assert-visible-${locator}`);
        throw new Error(this.formatError("Assert visible", locator, error));
      }
    });
  }

  async takeScreenshot(name?: string): Promise<void> {
    const screenshotName = this.sanitizeScreenshotName(name ?? "screenshot");

    await test.step(`Take screenshot ${screenshotName}`, async () => {
      try {
        await this.page.screenshot({
          path: `./${screenshotName}-${Date.now()}.png`,
          fullPage: true,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to capture screenshot '${screenshotName}'. ${message}`,
        );
      }
    });
  }
}
