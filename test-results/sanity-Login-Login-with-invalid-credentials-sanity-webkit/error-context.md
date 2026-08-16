# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sanity\Login.test.ts >> Login with invalid credentials @sanity
- Location: src\tests\sanity\Login.test.ts:45:9

# Error details

```
Error: Assert visible failed for locator 'text=Invalid credentials'. expect(locator).toBeVisible() failed

Locator:  locator('text=Invalid credentials')
Expected: visible
Received: undefined
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Invalid credentials')
    - waiting for "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate" navigation to finish...

```

# Test source

```ts
  1   | import { expect, Page, test } from '@playwright/test';
  2   | 
  3   | export class BasePage {
  4   |   protected readonly page: Page;
  5   | 
  6   |   constructor(page: Page) {
  7   |     this.page = page;
  8   |   }
  9   | 
  10  |   private sanitizeScreenshotName(name: string): string {
  11  |     return name.replace(/[^a-z0-9-_]+/gi, '_').replace(/^_+|_+$/g, '') || 'screenshot';
  12  |   }
  13  | 
  14  |   private isPasswordLocator(locator: string): boolean {
  15  |     return /password/i.test(locator);
  16  |   }
  17  | 
  18  |   private async captureFailureScreenshot(name: string): Promise<void> {
  19  |     const screenshotName = `${this.sanitizeScreenshotName(name)}-${Date.now()}.png`;
  20  |     await this.page.screenshot({ path: `./${screenshotName}`, fullPage: true });
  21  |   }
  22  | 
  23  |   private formatError(action: string, locator: string, error: unknown): string {
  24  |     const message = error instanceof Error ? error.message : String(error);
  25  | 
  26  |     return `${action} failed for locator '${locator}'. ${message}`;
  27  |   }
  28  | 
  29  |   async click(locator: string): Promise<void> {
  30  |     await test.step(`Click ${locator}`, async () => {
  31  |       try {
  32  |         await this.page.locator(locator).click();
  33  |       } catch (error) {
  34  |         await this.captureFailureScreenshot(`click-${locator}`);
  35  |         throw new Error(this.formatError('Click', locator, error));
  36  |       }
  37  |     });
  38  |   }
  39  | 
  40  |   async type(locator: string, value: string): Promise<void> {
  41  | 
  42  |     await test.step(`Type ${value} into ${locator}`, async () => {
  43  |       try {
  44  |         await this.page.locator(locator).fill(value);
  45  |       } catch (error) {
  46  |         await this.captureFailureScreenshot(`type-${locator}`);
  47  |         throw new Error(this.formatError('Type', locator, error));
  48  |       }
  49  |     });
  50  |   }
  51  | 
  52  |   async fillMasked(locator: string, value: string): Promise<void> {
  53  |     await test.step(`Fill "********" locator('${locator}')`, async () => {
  54  |       try {
  55  |         await this.page.locator(locator).evaluate((element, text) => {
  56  |           const input = element as any;
  57  |           input.focus();
  58  |           input.value = text;
  59  |           input.setAttribute('value', text);
  60  |           input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  61  |           input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  62  |           input.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true }));
  63  |         }, value);
  64  |       } catch (error) {
  65  |         await this.captureFailureScreenshot(`fill-masked-${locator}`);
  66  |         throw new Error(this.formatError('Fill masked', locator, error));
  67  |       }
  68  |     });
  69  |   }
  70  | 
  71  |   async waitForVisible(locator: string): Promise<void> {
  72  |     await test.step(`Wait for visible ${locator}`, async () => {
  73  |       try {
  74  |         await this.page.locator(locator).waitFor({ state: 'visible' });
  75  |       } catch (error) {
  76  |         await this.captureFailureScreenshot(`wait-visible-${locator}`);
  77  |         throw new Error(this.formatError('Wait for visible', locator, error));
  78  |       }
  79  |     });
  80  |   }
  81  | 
  82  |   async assertVisible(locator: string): Promise<void> {
  83  |     await test.step(`Assert visible ${locator}`, async () => {
  84  |       try {
  85  |         await expect(this.page.locator(locator)).toBeVisible();
  86  |       } catch (error) {
  87  |         await this.captureFailureScreenshot(`assert-visible-${locator}`);
> 88  |         throw new Error(this.formatError('Assert visible', locator, error));
      |               ^ Error: Assert visible failed for locator 'text=Invalid credentials'. expect(locator).toBeVisible() failed
  89  |       }
  90  |     });
  91  |   }
  92  | 
  93  |   async takeScreenshot(name?: string): Promise<void> {
  94  |     const screenshotName = this.sanitizeScreenshotName(name ?? 'screenshot');
  95  | 
  96  |     await test.step(`Take screenshot ${screenshotName}`, async () => {
  97  |       try {
  98  |         await this.page.screenshot({ path: `./${screenshotName}-${Date.now()}.png`, fullPage: true });
  99  |       } catch (error) {
  100 |         const message = error instanceof Error ? error.message : String(error);
  101 |         throw new Error(`Failed to capture screenshot '${screenshotName}'. ${message}`);
  102 |       }
  103 |     });
  104 |   }
  105 | }
  106 | 
```