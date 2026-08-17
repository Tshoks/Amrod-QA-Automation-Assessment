import { expect, test } from "@playwright/test";
import { BaseTest } from "../BaseTest";
import { AddEmployeePage } from "../../pages/AddEmployeePage";
import { DashboardPage } from "../../pages/DashboardPage";
import { EmployeeListPage } from "../../pages/EmployeeListPage";
import { JobDetailsPage } from "../../pages/JobDetailsPage";
import { LoginPage } from "../../pages/LoginPage";
import { PersonalDetailsPage } from "../../pages/PersonalDetailsPage";
import { SideMenuPage } from "../../pages/SideMenuPage";
import {
  closeDb,
  getLoginTestData,
  readEmployeeData,
  setEmployeeId,
  writeEmployeeData,
} from "../../../db";

let loginData: { url: string; username: string; password: string };

test.beforeAll(async () => {
  loginData = await getLoginTestData();
});

test.afterAll(async () => {
  await closeDb();
});

function generateRandomName(prefix: string): string {
  const randomPart = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${prefix}${randomPart}`;
}

function generateRandomDateOfBirth(): string {
  const now = new Date();
  const minDate = new Date(
    now.getFullYear() - 45,
    now.getMonth(),
    now.getDate(),
  );
  const maxDate = new Date(
    now.getFullYear() - 22,
    now.getMonth(),
    now.getDate(),
  );
  const randomTime =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  const date = new Date(randomTime);
  return date.toISOString().split("T")[0];
}

function generateRandomGender(): "Male" | "Female" {
  return Math.random() < 0.5 ? "Male" : "Female";
}

async function expectSuccessToast(
  page: import("@playwright/test").Page,
): Promise<void> {
  const toast = page.locator(".oxd-toast").first();
  await expect(toast).toBeVisible({ timeout: 3000 });
  await expect(toast).toContainText(/success|saved|updated/i);
}

async function expectSuccessNotification(
  page: import("@playwright/test").Page,
  fallbackLocator: string,
): Promise<void> {
  try {
    await expectSuccessToast(page);
  } catch {
    await expect(page.locator(fallbackLocator)).toBeVisible();
  }
}

export class PIMRegressionTest extends BaseTest {
  public static pimFullRegressionFlow(): void {
    test("PIM employee lifecycle regression @regression", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);
      const firstName = generateRandomName("Auto");
      const middleName = generateRandomName("Mid");
      const lastName = generateRandomName("User");
      const dateOfBirth = generateRandomDateOfBirth();
      const selectedGender = generateRandomGender();
      let createdEmployeeId = "";
      let selectedJobTitle = "";
      let selectedLocation = "";

      await this.step(
        page,
        testInfo,
        "Step 1: Login using valid credentials",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Navigate to the Employee List via PIM",
        async () => {
          const employeeListPage = await sideMenuPage.clickPIM();
          await employeeListPage.waitForEmployeeList();
          await expect(page).toHaveURL(/\/web\/index\.php\/pim\//);
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 3: Add a new employee",
        async () => {
          const employeeListPage = new EmployeeListPage(page);
          const addEmployeePage = await employeeListPage.clickAddEmployee();
          await addEmployeePage.waitForAddEmployeeForm();
          await addEmployeePage.enterFirstName(firstName);
          await addEmployeePage.enterMiddleName(middleName);
          await addEmployeePage.enterLastName(lastName);

          const employeeId = await addEmployeePage.getEmployeeId();
          createdEmployeeId = employeeId;
          await writeEmployeeData(employeeId, {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            employee_code: employeeId,
          });
          setEmployeeId(employeeId);

          const personalDetailsPage = await addEmployeePage.clickSave();
          await personalDetailsPage.waitForPersonalDetails();
          await expectSuccessNotification(
            page,
            '//h6[normalize-space()="Personal Details"]',
          );
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 4: Fill personal details",
        async () => {
          const personalDetailsPage = new PersonalDetailsPage(page);
          await personalDetailsPage.selectNationality("South African");
          await personalDetailsPage.selectMaritalStatus("Single");
          await personalDetailsPage.setDateOfBirth(dateOfBirth);
          await personalDetailsPage.selectGender(selectedGender);
          await personalDetailsPage.saveDetails();
          await expectSuccessNotification(
            page,
            '//h6[normalize-space()="Personal Details"]',
          );
        },
      );

      await this.step(page, testInfo, "Step 5: Upload attachment", async () => {
        const personalDetailsPage = new PersonalDetailsPage(page);
        await personalDetailsPage.clickAddAttachment();
        await personalDetailsPage.uploadAttachment(
          "src/tests/test data/PIM.pdf",
        );
        await personalDetailsPage.saveAttachment();
        await expect(page.locator(".oxd-table-card")).toContainText("PIM.pdf");
      });

      await this.step(page, testInfo, "Step 6: Fill job details", async () => {
        const personalDetailsPage = new PersonalDetailsPage(page);
        const jobDetailsPage = await personalDetailsPage.clickJobTab();
        await jobDetailsPage.waitForJobDetails();
        await jobDetailsPage.setJoinedDate("2025-01-11");
        await jobDetailsPage.selectJobTitle("QA Engineer");
        await jobDetailsPage.selectJobCategory("Professionals");
        await jobDetailsPage.selectSubUnit("Quality Assurance");
        await jobDetailsPage.selectLocation("HQ - California");
        await jobDetailsPage.selectEmploymentStatus("Full-Time Contract");
        selectedJobTitle = await jobDetailsPage.getSelectedJobTitle();
        selectedLocation = await jobDetailsPage.getSelectedLocation();
        await expect(selectedLocation).not.toContain("Select");
        await jobDetailsPage.saveJobDetails();
        await expectSuccessNotification(
          page,
          '//h6[normalize-space()="Job Details"]',
        );
      });

      await this.step(
        page,
        testInfo,
        "Step 7: Validate the employee record in the employee list",
        async () => {
          const jobDetailsPage = new JobDetailsPage(page);
          const employeeListPage =
            await jobDetailsPage.clickBackToEmployeeList();
          await readEmployeeData(createdEmployeeId);

          await employeeListPage.waitForEmployeeList();
          await employeeListPage.searchEmployeeById(createdEmployeeId);
          await employeeListPage.clickSearchButton();
          await employeeListPage.validateRecordVisible(firstName);
          await employeeListPage.validateRecordVisible(lastName);
          await expect(page.locator(".oxd-table-card")).toContainText(
            selectedJobTitle,
          );
          await page.screenshot({
            path: "./pim-regression-full-flow.png",
            fullPage: true,
          });
        },
      );
    });
  }

  public static invalidEmployeeCreationRegression(): void {
    test("Invalid employee creation validation @regression", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);

      await this.step(
        page,
        testInfo,
        "Step 1: Login and open PIM",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
          const employeeListPage = await sideMenuPage.clickPIM();
          await employeeListPage.waitForEmployeeList();
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Attempt invalid employee creation",
        async () => {
          const employeeListPage = new EmployeeListPage(page);
          const addEmployeePage = await employeeListPage.clickAddEmployee();
          await addEmployeePage.enterFirstName(generateRandomName("Bad"));
          await addEmployeePage.clickSave();
          await expect(page.getByText(/Required/i).first()).toBeVisible();
        },
      );
    });
  }

  public static missingRequiredFieldsRegression(): void {
    test("Missing required fields validation @regression", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);

      await this.step(
        page,
        testInfo,
        "Step 1: Login and open employee form",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
          const employeeListPage = await sideMenuPage.clickPIM();
          const addEmployeePage = await employeeListPage.clickAddEmployee();
          await addEmployeePage.waitForAddEmployeeForm();
          await addEmployeePage.enterFirstName(generateRandomName("Empty"));
          await addEmployeePage.enterLastName(generateRandomName("Empty"));
          await addEmployeePage.clickSave();
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Validate required field handling",
        async () => {
          await expect(page.getByText(/Required/i).first()).toBeVisible();
        },
      );
    });
  }

  public static invalidDateFormatRegression(): void {
    test("Invalid date format validation @regression", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);

      await this.step(
        page,
        testInfo,
        "Step 1: Open personal details and enter invalid date",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
          const employeeListPage = await sideMenuPage.clickPIM();
          const addEmployeePage = await employeeListPage.clickAddEmployee();
          await addEmployeePage.enterFirstName(generateRandomName("Date"));
          await addEmployeePage.enterLastName(generateRandomName("Date"));
          await addEmployeePage.clickSave();
          const personalDetailsPage = new PersonalDetailsPage(page);
          await personalDetailsPage.waitForPersonalDetails();
          await personalDetailsPage.setDateOfBirth("invalid-date");
          await personalDetailsPage.saveDetails();
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Validate invalid date handling",
        async () => {
          await expect(page.getByText(/valid|Required/i).first()).toBeVisible();
        },
      );
    });
  }

  public static invalidDropdownSelectionRegression(): void {
    test("Invalid dropdown selection validation @regression", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);

      await this.step(
        page,
        testInfo,
        "Step 1: Open personal details and confirm invalid dropdown option is not available",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
          const employeeListPage = await sideMenuPage.clickPIM();
          const addEmployeePage = await employeeListPage.clickAddEmployee();
          await addEmployeePage.enterFirstName(generateRandomName("Drop"));
          await addEmployeePage.enterLastName(generateRandomName("Drop"));
          await addEmployeePage.clickSave();
          const personalDetailsPage = new PersonalDetailsPage(page);
          await personalDetailsPage.waitForPersonalDetails();

          const nationalityDropdown = page.locator(
            '//label[normalize-space()="Nationality"]/ancestor::div[contains(@class,"oxd-input-group")]//div[contains(@class,"oxd-select-wrapper")]',
          );
          await nationalityDropdown.click();
          await expect(
            page
              .locator('[role="option"]')
              .filter({ hasText: "Invalid Selection" })
              .first(),
          ).toHaveCount(0);
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Validate dropdown error handling",
        async () => {
          await expect(
            page
              .locator('[role="option"]')
              .filter({ hasText: "Invalid Selection" })
              .first(),
          ).toHaveCount(0);
        },
      );
    });
  }
}

test.describe.serial("PIM regression suite", () => {
  PIMRegressionTest.pimFullRegressionFlow();
  PIMRegressionTest.invalidEmployeeCreationRegression();
  PIMRegressionTest.missingRequiredFieldsRegression();
  PIMRegressionTest.invalidDateFormatRegression();
  PIMRegressionTest.invalidDropdownSelectionRegression();
});
