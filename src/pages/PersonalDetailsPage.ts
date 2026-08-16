import { Page } from "@playwright/test";
import { PersonalDetailsElements } from "../elements/PersonalDetailsElements";
import { BasePage } from "./BasePage";

export class PersonalDetailsPage extends BasePage {
  public readonly elements: PersonalDetailsElements;

  constructor(page: Page) {
    super(page);
    this.elements = new PersonalDetailsElements();
  }
}
