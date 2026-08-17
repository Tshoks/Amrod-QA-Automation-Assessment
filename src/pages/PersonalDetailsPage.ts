import { Page } from "@playwright/test";
import { PersonalDetailsElements } from "../elements/PersonalDetailsElements";
import { BasePage } from "./BasePage";
import { JobDetailsPage } from "./JobDetailsPage";

export class PersonalDetailsPage extends BasePage {
  private readonly personalDetailsElements: PersonalDetailsElements;

  constructor(page: Page) {
    super(page);
    this.personalDetailsElements = new PersonalDetailsElements();
  }

  async waitForPersonalDetails(): Promise<this> {
    await this.waitForVisible(
      this.personalDetailsElements.getPersonalDetailsHeader(),
    );
    return this;
  }

  async selectNationality(nationality: string): Promise<this> {
    await this.selectDropdownOption(
      this.personalDetailsElements.getNationalityDropdown(),
      nationality,
    );
    return this;
  }

  async selectMaritalStatus(status: string): Promise<this> {
    await this.selectDropdownOption(
      this.personalDetailsElements.getMaritalStatusDropdown(),
      status,
    );
    return this;
  }

  async setDateOfBirth(dateOfBirth: string): Promise<this> {
    await this.type(
      this.personalDetailsElements.getDateOfBirthInput(),
      dateOfBirth,
    );
    return this;
  }

  async selectGender(gender: "Male" | "Female"): Promise<this> {
    const locator =
      gender === "Male"
        ? this.personalDetailsElements.getGenderMaleRadio()
        : this.personalDetailsElements.getGenderFemaleRadio();

    await this.click(locator);
    return this;
  }

  async saveDetails(): Promise<this> {
    await this.click(this.personalDetailsElements.getSaveButton());
    return this;
  }

  async clickAddAttachment(): Promise<this> {
    await this.click(this.personalDetailsElements.getAddAttachmentButton());
    return this;
  }

  async uploadAttachment(filePath: string): Promise<this> {
    await this.page.setInputFiles(
      this.personalDetailsElements.getBrowseInput(),
      filePath,
    );
    return this;
  }

  async saveAttachment(): Promise<this> {
    await this.click(this.personalDetailsElements.getSaveAttachmentButton());
    return this;
  }

  async validateAttachmentVisible(fileName: string): Promise<this> {
    await this.assertVisible(`text=${fileName}`);
    return this;
  }

  async clickJobTab(): Promise<JobDetailsPage> {
    await this.page.getByRole("tab", { name: /Job/i }).click();
    return new JobDetailsPage(this.page);
  }

  private async selectDropdownOption(
    dropdownLocator: string,
    optionText: string,
  ): Promise<void> {
    await this.click(dropdownLocator);
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: optionText })
      .first()
      .click();
  }
}
