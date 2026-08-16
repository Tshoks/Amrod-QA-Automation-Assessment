import { Page, test } from '@playwright/test';

export class BaseTest {
	protected static async step(
		page: Page,
		testInfo: {
			attach: (name: string, options: { body: Buffer; contentType: string }) => Promise<void>;
		},
		name: string,
		action: () => Promise<void>,
	): Promise<void> {
		await test.step(name, async () => {
			await action();
			const image = await page.screenshot({ fullPage: true });
			await testInfo.attach(`${name} Screenshot`, {
				body: image,
				contentType: 'image/png',
			});
		});
	}
}
