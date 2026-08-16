import { expect, test } from "@playwright/test";
import { BaseTest } from "../BaseTest";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { closeDb, getLoginTestData } from "../../../db";

let loginData: { url: string; username: string; password: string };

test.beforeAll(async () => {
  loginData = await getLoginTestData();
});

test.afterAll(async () => {
  await closeDb();
});

export class SideMenuTest extends BaseTest {
  public static sideMenuNavigationSmoke(): void {
    test("Side menu smoke navigation from login @smoke", async ({
      page,
    }, testInfo) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const sideMenuPage = new SideMenuPage(page);

      await this.step(
        page,
        testInfo,
        "Step 1: Navigate to login page",
        async () => {
          await loginPage.navigateToLogin(loginData.url);
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 2: Login with valid credentials",
        async () => {
          await loginPage.enterUsername(loginData.username);
          await loginPage.enterPassword(loginData.password);
          await loginPage.clickLoginButton();
          await dashboardPage.validateSuccessfulLogin();
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 3: Use side menu search",
        async () => {
          await sideMenuPage.search("Admin");
        },
      );

      await this.step(
        page,
        testInfo,
        "Step 3.1: Clear side menu search",
        async () => {
          await sideMenuPage.search("");
        },
      );

      await this.step(page, testInfo, "Step 4: Click Admin", async () => {
        await sideMenuPage.clickAdmin();
        await expect(page).toHaveURL(/\/web\/index\.php\/admin\//);
      });

      await this.step(page, testInfo, "Step 5: Click PIM", async () => {
        const employeeListPage = await sideMenuPage.clickPIM();
        expect(employeeListPage).toBeTruthy();
        await expect(page).toHaveURL(/\/web\/index\.php\/pim\//);
      });

      await this.step(page, testInfo, "Step 6: Click Leave", async () => {
        await sideMenuPage.clickLeave();
        await expect(page).toHaveURL(/\/web\/index\.php\/leave\//);
      });

      await this.step(page, testInfo, "Step 7: Click Time", async () => {
        await sideMenuPage.clickTime();
        await expect(page).toHaveURL(/\/web\/index\.php\/time\//);
      });

      await this.step(page, testInfo, "Step 8: Click Recruitment", async () => {
        await sideMenuPage.clickRecruitment();
        await expect(page).toHaveURL(/\/web\/index\.php\/recruitment\//);
      });

      await this.step(page, testInfo, "Step 9: Click My Info", async () => {
        const personalDetailsPage = await sideMenuPage.clickMyInfo();
        expect(personalDetailsPage).toBeTruthy();
        await expect(page).toHaveURL(
          /\/web\/index\.php\/pim\/viewPersonalDetails/,
        );
      });

      await this.step(
        page,
        testInfo,
        "Step 10: Click Performance",
        async () => {
          await sideMenuPage.clickPerformance();
          await expect(page).toHaveURL(/\/web\/index\.php\/performance\//);
        },
      );

      await this.step(page, testInfo, "Step 11: Click Dashboard", async () => {
        await sideMenuPage.clickDashboard();
        await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\//);
      });

      await this.step(page, testInfo, "Step 12: Click Directory", async () => {
        await sideMenuPage.clickDirectory();
        await expect(page).toHaveURL(/\/web\/index\.php\/directory\//);
      });

      await this.step(page, testInfo, "Step 13: Click Claim", async () => {
        await sideMenuPage.clickClaim();
        await expect(page).toHaveURL(/\/web\/index\.php\/claim\//);
      });

      await this.step(
        page,
        testInfo,
        "Step 14: Click Maintenance",
        async () => {
          await sideMenuPage.clickMaintenance();
          await expect(
            page.getByRole("heading", { name: "Administrator Access" }),
          ).toBeVisible();
          await page.getByRole("button", { name: "Cancel" }).click();
        },
      );
    });
  }
}

SideMenuTest.sideMenuNavigationSmoke();
