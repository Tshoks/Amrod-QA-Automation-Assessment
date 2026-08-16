import dotenv from "dotenv";
import { assertDbReadiness } from "./db-readiness";

dotenv.config();

async function main(): Promise<void> {
  try {
    const target = await assertDbReadiness();
    console.log(`DB readiness check passed: connected to ${target}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

void main();
