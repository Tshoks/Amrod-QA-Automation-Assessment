export class PersonalDetailsElements {
  private readonly personalDetailsHeader: string =
    '//h6[normalize-space()="Personal Details"]';
  private readonly nationalityDropdown: string =
    '//label[normalize-space()="Nationality"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly maritalStatusDropdown: string =
    '//label[normalize-space()="Marital Status"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly dateOfBirthInput: string =
    '//label[normalize-space()="Date of Birth"]/ancestor::div[contains(@class,"oxd-input-group")]//input';
  private readonly genderMaleRadio: string =
    '//label[normalize-space()="Male"]';
  private readonly genderFemaleRadio: string =
    '//label[normalize-space()="Female"]';
  private readonly addAttachmentButton: string =
    '//h6[normalize-space()="Attachments"]/ancestor::div[contains(@class,"orangehrm-card-container")]//button[normalize-space()="Add"]';
  private readonly browseInput: string = 'input[type="file"]';
  private readonly saveAttachmentButton: string =
    '//input[@type="file"]/ancestor::form//button[normalize-space()="Save"]';
  private readonly saveButton: string =
    '//label[normalize-space()="Nationality"]/ancestor::form//button[normalize-space()="Save"]';
  private readonly toastNotification: string = ".oxd-toast";
  private readonly attachmentTable: string = ".oxd-table-card";

  public getPersonalDetailsHeader(): string {
    return this.personalDetailsHeader;
  }

  public getNationalityDropdown(): string {
    return this.nationalityDropdown;
  }

  public getMaritalStatusDropdown(): string {
    return this.maritalStatusDropdown;
  }

  public getDateOfBirthInput(): string {
    return this.dateOfBirthInput;
  }

  public getGenderMaleRadio(): string {
    return this.genderMaleRadio;
  }

  public getGenderFemaleRadio(): string {
    return this.genderFemaleRadio;
  }

  public getAddAttachmentButton(): string {
    return this.addAttachmentButton;
  }

  public getBrowseInput(): string {
    return this.browseInput;
  }

  public getSaveAttachmentButton(): string {
    return this.saveAttachmentButton;
  }

  public getSaveButton(): string {
    return this.saveButton;
  }

  public getToastNotification(): string {
    return this.toastNotification;
  }

  public getAttachmentTable(): string {
    return this.attachmentTable;
  }
}
