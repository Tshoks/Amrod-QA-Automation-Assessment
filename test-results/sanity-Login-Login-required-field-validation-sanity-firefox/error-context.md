# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sanity\Login.test.ts >> Login required field validation @sanity
- Location: src\tests\sanity\Login.test.ts:63:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
TimeoutError: page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "https://opensource-demo.orangehrmlive.com/", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { expect, Page } from '@playwright/test';
  2  | import { LoginElements } from '../elements/LoginElements';
  3  | import { BasePage } from './BasePage';
  4  | import { DashboardPage } from './DashboardPage';
  5  | 
  6  | export class LoginPage extends BasePage {
  7  |   private readonly loginElements: LoginElements;
  8  | 
  9  |   constructor(page: Page) {
  10 |     super(page);
  11 |     this.loginElements = new LoginElements();
  12 |   }
  13 | 
  14 |   async navigateToLogin(url: string): Promise<this> {
> 15 |     await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
     |                     ^ TimeoutError: page.goto: Timeout 60000ms exceeded.
  16 |     await this.page.locator(this.loginElements.getUsernameInput()).waitFor({ state: 'visible' });
  17 |     return this;
  18 |   }
  19 | 
  20 |   async enterUsername(username: string): Promise<this> {
  21 |     await this.type(this.loginElements.getUsernameInput(), username);
  22 |     return this;
  23 |   }
  24 | 
  25 |   async enterPassword(password: string): Promise<this> {
  26 |     await this.fillMasked(this.loginElements.getPasswordInput(), password);
  27 |     return this;
  28 |   }
  29 | 
  30 |   async clickLoginButton(): Promise<this> {
  31 |     await this.click(this.loginElements.getLoginButton());
  32 |     return this;
  33 |   }
  34 |   
  35 | 
  36 |   async validateInvalidCredentials(message: string): Promise<this> {
  37 |     await this.assertVisible(`text=${message}`);
  38 |     return this;
  39 |   }
  40 | 
  41 |   async validateRequiredFieldErrors(message: string): Promise<this> {
  42 |     await expect(this.page.getByText(message, { exact: true })).toHaveCount(2);
  43 |     return this;
  44 |   }
  45 | 
  46 |   async completeLogin(username: string, password: string): Promise<DashboardPage> {
  47 |     await this.enterUsername(username);
  48 |     await this.enterPassword(password);
  49 |     await this.clickLoginButton();
  50 |     return new DashboardPage(this.page);
  51 |   }
  52 | }
  53 | 
```