export class JobDetailsElements {
  private readonly jobHeader: string = '//h6[normalize-space()="Job Details"]';
  private readonly joinedDateInput: string =
    '//label[normalize-space()="Joined Date"]/ancestor::div[contains(@class,"oxd-input-group")]//input';
  private readonly jobTitleDropdown: string =
    '//label[normalize-space()="Job Title"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly jobCategoryDropdown: string =
    '//label[normalize-space()="Job Category"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly subUnitDropdown: string =
    '//label[normalize-space()="Sub Unit"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly locationDropdown: string =
    '//label[normalize-space()="Location"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly employmentStatusDropdown: string =
    '//label[normalize-space()="Employment Status"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]';
  private readonly saveButton: string = '//button[normalize-space()="Save"]';
  private readonly toastNotification: string = ".oxd-toast";

  public getJobHeader(): string {
    return this.jobHeader;
  }

  public getJoinedDateInput(): string {
    return this.joinedDateInput;
  }

  public getJobTitleDropdown(): string {
    return this.jobTitleDropdown;
  }

  public getJobCategoryDropdown(): string {
    return this.jobCategoryDropdown;
  }

  public getSubUnitDropdown(): string {
    return this.subUnitDropdown;
  }

  public getLocationDropdown(): string {
    return this.locationDropdown;
  }

  public getEmploymentStatusDropdown(): string {
    return this.employmentStatusDropdown;
  }

  public getSaveButton(): string {
    return this.saveButton;
  }

  public getToastNotification(): string {
    return this.toastNotification;
  }
}
