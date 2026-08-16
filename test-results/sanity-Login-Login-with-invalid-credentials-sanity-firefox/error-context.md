# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sanity\Login.test.ts >> Login with invalid credentials @sanity
- Location: src\tests\sanity\Login.test.ts:45:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.screenshot: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { Page, test } from '@playwright/test';
  2  | 
  3  | export class BaseTest {
  4  | 	protected static async step(
  5  | 		page: Page,
  6  | 		testInfo: {
  7  | 			attach: (name: string, options: { body: Buffer; contentType: string }) => Promise<void>;
  8  | 		},
  9  | 		name: string,
  10 | 		action: () => Promise<void>,
  11 | 	): Promise<void> {
  12 | 		await test.step(name, async () => {
  13 | 			await action();
> 14 | 			const image = await page.screenshot({ fullPage: true });
     |                             ^ Error: page.screenshot: Target page, context or browser has been closed
  15 | 			await testInfo.attach(`${name} Screenshot`, {
  16 | 				body: image,
  17 | 				contentType: 'image/png',
  18 | 			});
  19 | 		});
  20 | 	}
  21 | }
  22 | 
```