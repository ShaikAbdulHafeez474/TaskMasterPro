import pkg from 'pg';
const { Pool } = pkg;

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from "dotenv";

dotenv.config({ path: './server/.env' });

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your database?",
  );
}

// Create a connection pool for PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false, 
});

// Initialize Drizzle ORM with Pool and schema
export const db = drizzle(pool, { schema });
