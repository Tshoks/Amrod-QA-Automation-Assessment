import dotenv from "dotenv";
import { assertDbReadiness } from "../../scripts/db-readiness";

dotenv.config();

async function globalSetup(): Promise<void> {
  const target = await assertDbReadiness();
  console.log(`Playwright global setup: database ready at ${target}.`);
}

export default globalSetup;
