import { expect, test } from "@playwright/test";
import { buildEmployeeFullName, CREATE_TABLES_SQL } from "../../../db";

test("employees schema keeps full_name as a plain column @smoke", () => {
  expect(CREATE_TABLES_SQL).toContain("full_name VARCHAR(300)");
  expect(CREATE_TABLES_SQL).not.toContain("GENERATED ALWAYS AS");
});

test("full_name is composed in application code @smoke", () => {
  expect(buildEmployeeFullName("Jane", undefined, "Doe")).toBe("Jane Doe");
  expect(buildEmployeeFullName("Jane", " ", "Doe")).toBe("Jane Doe");
  expect(buildEmployeeFullName("Jane", "Ann", "Doe")).toBe("Jane Ann Doe");
});
