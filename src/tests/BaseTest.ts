import { Page, test, TestInfo } from '@playwright/test';

export class BaseTest {
	protected static async step(
		page: Page,
		testInfo: TestInfo,
		name: string,
		action: () => Promise<void>,
	): Promise<void> {
		await test.step(name, async () => {
			await action();

			if (page.isClosed()) return;

			try {
				const image = await page.screenshot({ fullPage: true });
				await testInfo.attach(`${name} Screenshot`, {
					body: image,
					contentType: 'image/png',
				});
			} catch {
				// Best-effort screenshot capture; ignore if the page/context is already closed.
			}
		});
	}
}
