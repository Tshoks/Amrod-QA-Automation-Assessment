import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminUserManagementPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
