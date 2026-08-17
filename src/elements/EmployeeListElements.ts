export class EmployeeListElements {
  private readonly employeeInformationHeader: string =
    '//h5[normalize-space()="Employee Information"]';
  private readonly employeeNameSearchInput: string =
    '//label[normalize-space()="Employee Name"]/ancestor::div[contains(@class,"oxd-input-group")]//input';
  private readonly employeeIdSearchInput: string =
    '//label[normalize-space()="Employee Id"]/ancestor::div[contains(@class,"oxd-input-group")]//input';
  private readonly searchButton: string =
    '//button[normalize-space()="Search"]';
  private readonly resetButton: string = '//button[normalize-space()="Reset"]';
  private readonly addEmployeeButton: string =
    '//button[normalize-space()="Add"]';
  private readonly tableRows: string = ".oxd-table-card .oxd-table-row";
  private readonly editButton: string = 'button[title="Edit"]';
  private readonly deleteButton: string = 'button[title="Delete"]';
  private readonly toastNotification: string = ".oxd-toast";

  public getEmployeeInformationHeader(): string {
    return this.employeeInformationHeader;
  }

  public getEmployeeNameSearchInput(): string {
    return this.employeeNameSearchInput;
  }

  public getEmployeeIdSearchInput(): string {
    return this.employeeIdSearchInput;
  }

  public getSearchButton(): string {
    return this.searchButton;
  }

  public getResetButton(): string {
    return this.resetButton;
  }

  public getAddEmployeeButton(): string {
    return this.addEmployeeButton;
  }

  public getTableRows(): string {
    return this.tableRows;
  }

  public getEditButton(): string {
    return this.editButton;
  }

  public getDeleteButton(): string {
    return this.deleteButton;
  }

  public getToastNotification(): string {
    return this.toastNotification;
  }
}
