import { Page } from "@playwright/test";
import { EmployeeListElements } from "../elements/EmployeeListElements";
import { AddEmployeePage } from "./AddEmployeePage";
import { BasePage } from "./BasePage";
import { PersonalDetailsPage } from "./PersonalDetailsPage";

export class EmployeeListPage extends BasePage {
  private readonly employeeListElements: EmployeeListElements;

  constructor(page: Page) {
    super(page);
    this.employeeListElements = new EmployeeListElements();
  }

  async waitForEmployeeList(): Promise<this> {
    await this.waitForVisible(
      this.employeeListElements.getEmployeeInformationHeader(),
    );
    return this;
  }

  async searchEmployee(searchTerm: string): Promise<this> {
    await this.type(
      this.employeeListElements.getEmployeeNameSearchInput(),
      searchTerm,
    );
    return this;
  }

  async searchEmployeeById(employeeId: string): Promise<this> {
    await this.type(
      this.employeeListElements.getEmployeeIdSearchInput(),
      employeeId,
    );
    return this;
  }

  async clickSearchButton(): Promise<this> {
    await this.click(this.employeeListElements.getSearchButton());
    return this;
  }

  async clickResetButton(): Promise<this> {
    await this.click(this.employeeListElements.getResetButton());
    return this;
  }

  async clickAddEmployee(): Promise<AddEmployeePage> {
    await this.waitForVisible(this.employeeListElements.getAddEmployeeButton());
    await this.click(this.employeeListElements.getAddEmployeeButton());
    return new AddEmployeePage(this.page);
  }

  async validateRecordVisible(recordValue: string): Promise<this> {
    await this.assertVisible(`text=${recordValue}`);
    return this;
  }

  async clickEditEmployee(recordName: string): Promise<PersonalDetailsPage> {
    const row = this.page
      .locator(this.employeeListElements.getTableRows())
      .filter({ hasText: recordName })
      .first();

    await row.locator(this.employeeListElements.getEditButton()).click();
    return new PersonalDetailsPage(this.page);
  }

  async clickDeleteEmployee(recordName: string): Promise<this> {
    const row = this.page
      .locator(this.employeeListElements.getTableRows())
      .filter({ hasText: recordName })
      .first();

    await row.locator(this.employeeListElements.getDeleteButton()).click();
    return this;
  }
}
