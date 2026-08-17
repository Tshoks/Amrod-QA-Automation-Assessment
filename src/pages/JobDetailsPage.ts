import { Page } from "@playwright/test";
import { JobDetailsElements } from "../elements/JobDetailsElements";
import { BasePage } from "./BasePage";
import { EmployeeListPage } from "./EmployeeListPage";

export class JobDetailsPage extends BasePage {
  private readonly jobDetailsElements: JobDetailsElements;

  constructor(page: Page) {
    super(page);
    this.jobDetailsElements = new JobDetailsElements();
  }

  async waitForJobDetails(): Promise<this> {
    await this.waitForVisible(this.jobDetailsElements.getJobHeader());
    return this;
  }

  async setJoinedDate(date: string): Promise<this> {
    await this.type(this.jobDetailsElements.getJoinedDateInput(), date);
    return this;
  }

  async selectJobTitle(optionText: string): Promise<this> {
    await this.selectDropdownOption(
      this.jobDetailsElements.getJobTitleDropdown(),
      optionText,
    );
    return this;
  }

  async selectJobCategory(optionText: string): Promise<this> {
    await this.selectDropdownOption(
      this.jobDetailsElements.getJobCategoryDropdown(),
      optionText,
    );
    return this;
  }

  async selectSubUnit(optionText: string): Promise<this> {
    await this.selectDropdownOption(
      this.jobDetailsElements.getSubUnitDropdown(),
      optionText,
    );
    return this;
  }

  async selectLocation(optionText: string): Promise<this> {
    await this.selectDropdownOption(
      this.jobDetailsElements.getLocationDropdown(),
      optionText,
    );
    return this;
  }

  async selectEmploymentStatus(optionText: string): Promise<this> {
    await this.selectDropdownOption(
      this.jobDetailsElements.getEmploymentStatusDropdown(),
      optionText,
    );
    return this;
  }

  async getSelectedJobTitle(): Promise<string> {
    return this.getSelectedDropdownText(
      this.jobDetailsElements.getJobTitleDropdown(),
    );
  }

  async getSelectedLocation(): Promise<string> {
    return this.getSelectedDropdownText(
      this.jobDetailsElements.getLocationDropdown(),
    );
  }

  async saveJobDetails(): Promise<this> {
    await this.click(this.jobDetailsElements.getSaveButton());
    return this;
  }

  async clickBackToEmployeeList(): Promise<EmployeeListPage> {
    await this.page.goto(
      `${process.env.BASE_URL ?? ""}/web/index.php/pim/viewEmployeeList`,
    );
    return new EmployeeListPage(this.page);
  }

  private async selectDropdownOption(
    dropdownLocator: string,
    optionText: string,
  ): Promise<void> {
    await this.click(dropdownLocator);

    const exactOption = this.page
      .locator('[role="option"]')
      .filter({ hasText: optionText })
      .first();

    if ((await exactOption.count()) > 0) {
      await exactOption.click();
      return;
    }

    const fallbackOption = this.page
      .locator('[role="option"]')
      .filter({ hasNotText: "-- Select --" })
      .first();

    await fallbackOption.click();
  }

  private async getSelectedDropdownText(
    dropdownLocator: string,
  ): Promise<string> {
    const selectedText = await this.page
      .locator(
        `${dropdownLocator}//div[contains(@class,"oxd-select-text-input")]`,
      )
      .innerText();

    return selectedText.trim();
  }
}
