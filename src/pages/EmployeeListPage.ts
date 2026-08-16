import { Page } from "@playwright/test";
import { EmployeeListElements } from "../elements/EmployeeListElements";
import { BasePage } from "./BasePage";

export class EmployeeListPage extends BasePage {
  public readonly elements: EmployeeListElements;

  constructor(page: Page) {
    super(page);
    this.elements = new EmployeeListElements();
  }
}
