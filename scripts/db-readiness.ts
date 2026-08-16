import { Client } from "pg";

export const getConnectionString = (): string | undefined => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.NEON_CONNECTION_STRING) {
    return process.env.NEON_CONNECTION_STRING;
  }

  if (process.env.DEFAULT_NEON_CONNECTION_STRING) {
    return process.env.DEFAULT_NEON_CONNECTION_STRING;
  }

  return undefined;
};

export const describeConnection = (connectionString: string): string => {
  try {
    const parsed = new URL(connectionString);
    const database = parsed.pathname.replace(/^\//, "") || "(default-db)";
    return `${parsed.hostname}/${database}`;
  } catch {
    return "configured connection string";
  }
};

export const isLocalhostConnectionString = (
  connectionString: string,
): boolean => {
  try {
    const parsed = new URL(connectionString);
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
};

export async function assertDbReadiness(): Promise<string> {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error(
      "DB readiness check failed: missing DATABASE_URL (or NEON_CONNECTION_STRING / DEFAULT_NEON_CONNECTION_STRING).",
    );
  }

  if (isLocalhostConnectionString(connectionString)) {
    throw new Error(
      "DB readiness check failed: DATABASE_URL points to localhost, but this project is configured for cloud PostgreSQL only. Set DATABASE_URL to your cloud host.",
    );
  }

  const client = new Client({
    connectionString,
    ssl:
      connectionString.includes("sslmode=require") ||
      process.env.PGSSLMODE === "require"
        ? { rejectUnauthorized: false }
        : undefined,
    connectionTimeoutMillis: 5000,
  });

  const target = describeConnection(connectionString);

  try {
    await client.connect();
    await client.query("SELECT 1");
    return target;
  } finally {
    await client.end().catch(() => undefined);
  }
}
