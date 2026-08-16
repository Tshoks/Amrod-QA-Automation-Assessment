import { Pool, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_NEON_CONNECTION_STRING =
  process.env.DEFAULT_NEON_CONNECTION_STRING;
export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(300),
    employee_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS personal_details (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    nationality VARCHAR(100),
    marital_status VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS job_details (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    joined_date DATE,
    job_title VARCHAR(100),
    job_category VARCHAR(100),
    sub_unit VARCHAR(100),
    location VARCHAR(100),
    employment_status VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS test_data_positive (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE,
    value TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS test_data_negative (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE,
    value TEXT,
    expected_error TEXT,
    description TEXT
  );
`;
export const SCHEMA_BOOTSTRAP_LOCK_ID = 3_481_215_407;
export const SCHEMA_BOOTSTRAP_LOCK_SQL = "SELECT pg_advisory_xact_lock($1)";
const BACKFILL_EMPLOYEE_FULL_NAMES_SQL = `UPDATE employees
     SET full_name = NULLIF(
       TRIM(
         CONCAT(
           first_name,
           CASE
             WHEN middle_name IS NOT NULL AND BTRIM(middle_name) <> '' THEN ' ' || middle_name
             ELSE ''
           END,
           ' ',
           last_name
         )
       ),
       ''
     )
     WHERE full_name IS NULL`;

interface LoginTestData {
  url: string;
  username: string;
  password: string;
}

interface LoginNegativeTestData {
  url: string;
  invalidUsername: string;
  invalidPassword: string;
  invalidCredentialsMessage: string;
  requiredFieldMessage: string;
}

interface DbConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
}

const describeDbTarget = (config: DbConfig): string => {
  if (config.connectionString) {
    return "the configured connection string";
  }

  const host = config.host ?? "localhost";
  const port = config.port ?? 5432;

  return `${host}:${port}`;
};

const formatDbConnectionError = (error: unknown): Error => {
  const target = describeDbTarget(dbConfig);

  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: string }).code === "ECONNREFUSED"
  ) {
    return new Error(
      `Unable to connect to PostgreSQL at ${target}. Start a local PostgreSQL instance on port 5432 or set DATABASE_URL / NEON_CONNECTION_STRING to a reachable database before running db:create-schema or Playwright tests.`,
      { cause: error },
    );
  }

  return error instanceof Error
    ? new Error(`Unable to connect to PostgreSQL at ${target}.`, {
        cause: error,
      })
    : new Error(`Unable to connect to PostgreSQL at ${target}.`);
};

const getDbConfig = (): DbConfig => {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  if (process.env.NEON_CONNECTION_STRING) {
    return { connectionString: process.env.NEON_CONNECTION_STRING };
  }

  if (DEFAULT_NEON_CONNECTION_STRING) {
    return { connectionString: DEFAULT_NEON_CONNECTION_STRING };
  }

  return {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "orangehrm",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
  };
};

const dbConfig = getDbConfig();

let pool: Pool | null = null;
let schemaBootstrapped = false;
let schemaBootstrapPromise: Promise<void> | null = null;

export function buildEmployeeFullName(
  firstName?: unknown,
  middleName?: unknown,
  lastName?: unknown,
): string | null {
  const parts = [firstName, middleName, lastName]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : null;
}

const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      ...dbConfig,
      ssl:
        dbConfig.connectionString?.includes("sslmode=require") ||
        process.env.PGSSLMODE === "require"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }

  return pool;
};

async function runSchemaBootstrap(): Promise<void> {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    await client.query(SCHEMA_BOOTSTRAP_LOCK_SQL, [SCHEMA_BOOTSTRAP_LOCK_ID]);
    await client.query(CREATE_TABLES_SQL);
    await client.query(BACKFILL_EMPLOYEE_FULL_NAMES_SQL);
    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Ignore rollback errors and preserve the original failure.
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function createDatabaseTables(): Promise<void> {
  if (schemaBootstrapped) {
    return;
  }

  if (!schemaBootstrapPromise) {
    schemaBootstrapPromise = runSchemaBootstrap().then(() => {
      schemaBootstrapped = true;
    });
  }

  try {
    await schemaBootstrapPromise;
  } finally {
    schemaBootstrapPromise = null;
  }
}

async function upsertPositiveTestData(
  key: string,
  value: string,
  description: string,
): Promise<void> {
  await getPool().query(
    `INSERT INTO test_data_positive (key, value, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description`,
    [key, value, description],
  );
}

async function upsertNegativeTestData(
  key: string,
  value: string,
  expectedError: string,
  description: string,
): Promise<void> {
  await getPool().query(
    `INSERT INTO test_data_negative (key, value, expected_error, description)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, expected_error = EXCLUDED.expected_error, description = EXCLUDED.description`,
    [key, value, expectedError, description],
  );
}

export async function ensureDefaultLoginTestData(): Promise<void> {
  await createDatabaseTables();

  await upsertPositiveTestData(
    "login.url",
    process.env.BASE_URL ?? "https://opensource-demo.orangehrmlive.com",
    "OrangeHRM login page URL",
  );
  await upsertPositiveTestData(
    "login.username",
    "Admin",
    "Valid OrangeHRM username",
  );
  await upsertPositiveTestData(
    "login.password",
    "admin123",
    "Valid OrangeHRM password",
  );
}

export async function ensureDefaultLoginNegativeTestData(): Promise<void> {
  await createDatabaseTables();

  await upsertNegativeTestData(
    "login.invalid.username",
    "InvalidAdmin",
    "Invalid credentials",
    "Invalid OrangeHRM username for negative login test",
  );
  await upsertNegativeTestData(
    "login.invalid.password",
    "InvalidPassword123",
    "Invalid credentials",
    "Invalid OrangeHRM password for negative login test",
  );
  await upsertNegativeTestData(
    "login.invalid.credentials.message",
    "Invalid credentials",
    "Invalid credentials",
    "Expected login error message for invalid credentials",
  );
  await upsertNegativeTestData(
    "login.required.message",
    "Required",
    "Required",
    "Expected validation error message for required username and password fields",
  );
}

export async function getPositiveTestDataValue(key: string): Promise<string> {
  await createDatabaseTables();

  const result = await getPool().query<QueryResultRow>(
    "SELECT value FROM test_data_positive WHERE key = $1",
    [key],
  );

  const value = result.rows[0]?.value;

  if (!value) {
    throw new Error(`Missing required positive test data for key: ${key}`);
  }

  return String(value);
}

export async function getNegativeTestDataValue(key: string): Promise<string> {
  await createDatabaseTables();

  const result = await getPool().query<QueryResultRow>(
    "SELECT value FROM test_data_negative WHERE key = $1",
    [key],
  );

  const value = result.rows[0]?.value;

  if (value === undefined || value === null) {
    throw new Error(`Missing required negative test data for key: ${key}`);
  }

  return String(value);
}

export async function getLoginTestData(): Promise<LoginTestData> {
  await ensureDefaultLoginTestData();

  const [url, username, password] = await Promise.all([
    getPositiveTestDataValue("login.url"),
    getPositiveTestDataValue("login.username"),
    getPositiveTestDataValue("login.password"),
  ]);

  return { url, username, password };
}

export async function getLoginNegativeTestData(): Promise<LoginNegativeTestData> {
  await ensureDefaultLoginNegativeTestData();

  const [
    url,
    invalidUsername,
    invalidPassword,
    invalidCredentialsMessage,
    requiredFieldMessage,
  ] = await Promise.all([
    getPositiveTestDataValue("login.url"),
    getNegativeTestDataValue("login.invalid.username"),
    getNegativeTestDataValue("login.invalid.password"),
    getNegativeTestDataValue("login.invalid.credentials.message"),
    getNegativeTestDataValue("login.required.message"),
  ]);

  return {
    url,
    invalidUsername,
    invalidPassword,
    invalidCredentialsMessage,
    requiredFieldMessage,
  };
}

export async function connectDb(): Promise<void> {
  try {
    await getPool().query("SELECT 1");
  } catch (error) {
    throw formatDbConnectionError(error);
  }
}

export async function readEmployeeData(
  employeeId?: string,
): Promise<Record<string, unknown> | null> {
  const resolvedId = employeeId ?? process.env.CURRENT_EMPLOYEE_ID ?? null;

  if (!resolvedId) {
    return null;
  }

  const result = await getPool().query<QueryResultRow>(
    "SELECT * FROM employees WHERE employee_id = $1",
    [resolvedId],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    ...row,
    full_name:
      row.full_name ??
      buildEmployeeFullName(row.first_name, row.middle_name, row.last_name),
  };
}

const ALLOWED_EMPLOYEE_COLUMNS = new Set([
  "first_name",
  "middle_name",
  "last_name",
  "employee_code",
]);

export async function writeEmployeeData(
  employeeId: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (!employeeId) {
    throw new Error("Employee ID is required to write employee data.");
  }

  const keys = Object.keys(payload);

  if (keys.length === 0) {
    return { employee_id: employeeId };
  }

  const invalidKeys = keys.filter((key) => !ALLOWED_EMPLOYEE_COLUMNS.has(key));
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid employee column(s): ${invalidKeys.join(", ")}`);
  }

  const columns = keys.map((key) => `"${key}"`).join(", ");
  const insertValues = keys.map((_, index) => `$${index + 2}`).join(", ");
  const updateSet = keys
    .map((key, index) => `"${key}" = $${index + 2}`)
    .join(", ");
  const existingEmployee = await readEmployeeData(employeeId);
  const fullName = buildEmployeeFullName(
    payload.first_name ?? existingEmployee?.first_name,
    payload.middle_name ?? existingEmployee?.middle_name,
    payload.last_name ?? existingEmployee?.last_name,
  );

  const params = [employeeId, ...keys.map((key) => payload[key]), fullName];

  await getPool().query(
    `INSERT INTO employees (employee_id, ${columns}, full_name) VALUES ($1, ${insertValues}, $${keys.length + 2}) ON CONFLICT (employee_id) DO UPDATE SET ${updateSet}, full_name = $${keys.length + 2}`,
    params,
  );

  return {
    employee_id: employeeId,
    ...payload,
    full_name: fullName,
  };
}

export function setEmployeeId(employeeId: string): void {
  process.env.CURRENT_EMPLOYEE_ID = employeeId;
}

export function getEmployeeId(): string | undefined {
  return process.env.CURRENT_EMPLOYEE_ID || undefined;
}

export async function closeDb(): Promise<void> {
  if (!pool) {
    return;
  }

  const activePool = pool;
  pool = null;
  schemaBootstrapped = false;
  schemaBootstrapPromise = null;
  await activePool.end();
}

async function bootstrapSchema(): Promise<void> {
  try {
    await connectDb();
    await createDatabaseTables();
    console.log("Database schema created successfully.");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error.";
    console.error("Failed to create database schema.", message);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

if (require.main === module && process.argv.includes("--init")) {
  void bootstrapSchema();
}
