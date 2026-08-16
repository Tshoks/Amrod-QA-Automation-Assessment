import { Page } from "@playwright/test";
import { SideMenuElements } from "../elements/SideMenuElements";
import { AdminUserManagementPage } from "./AdminUserManagementPage";
import { BasePage } from "./BasePage";
import { EmployeeListPage } from "./EmployeeListPage";
import { PersonalDetailsPage } from "./PersonalDetailsPage";

export class SideMenuPage extends BasePage {
  private readonly sideMenuElements: SideMenuElements;

  constructor(page: Page) {
    super(page);
    this.sideMenuElements = new SideMenuElements();
  }

  async search(searchTerm: string): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getSearch());
    await this.type(this.sideMenuElements.getSearch(), searchTerm);
    return this;
  }

  async clickAdmin(): Promise<AdminUserManagementPage> {
    await this.waitForVisible(this.sideMenuElements.getAdmin());
    await this.click(this.sideMenuElements.getAdmin());
    return new AdminUserManagementPage(this.page);
  }

  async clickPIM(): Promise<EmployeeListPage> {
    await this.waitForVisible(this.sideMenuElements.getPIM());
    await this.click(this.sideMenuElements.getPIM());
    return new EmployeeListPage(this.page);
  }

  async clickLeave(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getLeave());
    await this.click(this.sideMenuElements.getLeave());
    return this;
  }

  async clickTime(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getTime());
    await this.click(this.sideMenuElements.getTime());
    return this;
  }

  async clickRecruitment(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getRecruitment());
    await this.click(this.sideMenuElements.getRecruitment());
    return this;
  }

  async clickMyInfo(): Promise<PersonalDetailsPage> {
    await this.waitForVisible(this.sideMenuElements.getMyInfo());
    await this.click(this.sideMenuElements.getMyInfo());
    return new PersonalDetailsPage(this.page);
  }

  async clickPerformance(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getPerformance());
    await this.click(this.sideMenuElements.getPerformance());
    return this;
  }

  async clickDashboard(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getDashboard());
    await this.click(this.sideMenuElements.getDashboard());
    return this;
  }

  async clickDirectory(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getDirectory());
    await this.click(this.sideMenuElements.getDirectory());
    return this;
  }

  async clickMaintenance(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getMaintenance());
    await this.click(this.sideMenuElements.getMaintenance());
    return this;
  }

  async clickClaim(): Promise<this> {
    await this.waitForVisible(this.sideMenuElements.getClaim());
    await this.click(this.sideMenuElements.getClaim());
    return this;
  }
}
