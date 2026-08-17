import { Page } from "@playwright/test";
import { AddEmployeeElements } from "../elements/AddEmployeeElements";
import { BasePage } from "./BasePage";
import { PersonalDetailsPage } from "./PersonalDetailsPage";

export class AddEmployeePage extends BasePage {
  private readonly addEmployeeElements: AddEmployeeElements;

  constructor(page: Page) {
    super(page);
    this.addEmployeeElements = new AddEmployeeElements();
  }

  async waitForAddEmployeeForm(): Promise<this> {
    await this.waitForVisible(this.addEmployeeElements.getAddEmployeeHeader());
    return this;
  }

  async enterFirstName(firstName: string): Promise<this> {
    await this.type(this.addEmployeeElements.getFirstNameInput(), firstName);
    return this;
  }

  async enterMiddleName(middleName: string): Promise<this> {
    await this.type(this.addEmployeeElements.getMiddleNameInput(), middleName);
    return this;
  }

  async enterLastName(lastName: string): Promise<this> {
    await this.type(this.addEmployeeElements.getLastNameInput(), lastName);
    return this;
  }

  async getEmployeeId(): Promise<string> {
    return await this.page
      .locator(this.addEmployeeElements.getEmployeeIdInput())
      .inputValue();
  }

  async clickSave(): Promise<PersonalDetailsPage> {
    await this.click(this.addEmployeeElements.getSaveButton());
    return new PersonalDetailsPage(this.page);
  }
}
