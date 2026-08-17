export class AddEmployeeElements {
  private readonly addEmployeeHeader: string =
    '//h6[normalize-space()="Add Employee"]';
  private readonly firstNameInput: string = 'input[name="firstName"]';
  private readonly middleNameInput: string = 'input[name="middleName"]';
  private readonly lastNameInput: string = 'input[name="lastName"]';
  private readonly employeeIdInput: string =
    '//label[normalize-space()="Employee Id"]/ancestor::div[contains(@class,"oxd-input-group")]//input';
  private readonly saveButton: string = '//button[normalize-space()="Save"]';
  private readonly toastNotification: string = ".oxd-toast";
  private readonly requiredFieldError: string =
    ".oxd-input-field-error-message";

  public getAddEmployeeHeader(): string {
    return this.addEmployeeHeader;
  }

  public getFirstNameInput(): string {
    return this.firstNameInput;
  }

  public getMiddleNameInput(): string {
    return this.middleNameInput;
  }

  public getLastNameInput(): string {
    return this.lastNameInput;
  }

  public getEmployeeIdInput(): string {
    return this.employeeIdInput;
  }

  public getSaveButton(): string {
    return this.saveButton;
  }

  public getToastNotification(): string {
    return this.toastNotification;
  }

  public getRequiredFieldError(): string {
    return this.requiredFieldError;
  }
}
