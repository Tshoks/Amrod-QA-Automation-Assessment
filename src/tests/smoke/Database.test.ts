import { expect, test } from "@playwright/test";
import {
  buildEmployeeFullName,
  CREATE_TABLES_SQL,
  SCHEMA_BOOTSTRAP_LOCK_ID,
  SCHEMA_BOOTSTRAP_LOCK_SQL,
} from "../../../db";

test("employees schema keeps full_name as a plain column @smoke", () => {
  expect(CREATE_TABLES_SQL).toContain("full_name VARCHAR(300)");
  expect(CREATE_TABLES_SQL).not.toContain("GENERATED ALWAYS AS");
});

test("full_name is composed in application code @smoke", () => {
  expect(buildEmployeeFullName("Jane", undefined, "Doe")).toBe("Jane Doe");
  expect(buildEmployeeFullName("Jane", " ", "Doe")).toBe("Jane Doe");
  expect(buildEmployeeFullName("Jane", "Ann", "Doe")).toBe("Jane Ann Doe");
});

test("schema bootstrap uses a transaction-scoped advisory lock @smoke", () => {
  expect(SCHEMA_BOOTSTRAP_LOCK_SQL).toContain("pg_advisory_xact_lock");
  expect(SCHEMA_BOOTSTRAP_LOCK_ID).toBeGreaterThan(0);
});
