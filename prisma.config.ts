import path from "path";
import { config } from "dotenv";

// Load .env from project root so Prisma CLI gets DATABASE_URL / DIRECT_URL
config({ path: path.resolve(process.cwd(), ".env") });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
