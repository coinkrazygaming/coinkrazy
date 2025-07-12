import express from "express";
import { executeQuery, initializeDatabase } from "../config/database.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database with schema and seed data
router.post("/init-database", async (req, res) => {
  try {
    console.log("Starting database initialization...");

    // Initialize database connection
    await initializeDatabase();

    // Read and execute SQLite schema
    const schemaPath = path.join(__dirname, "../../database/sqlite-schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    // Split schema into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`Executing ${statements.length} schema statements...`);

    for (const statement of statements) {
      try {
        await executeQuery(statement);
      } catch (error) {
        // Ignore table already exists errors
        if (!error.message.includes("already exists")) {
          console.warn("Schema statement warning:", error.message);
        }
      }
    }

    // Read and execute SQLite seed data
    const seedPath = path.join(__dirname, "../../database/sqlite-seed.sql");
    const seedData = readFileSync(seedPath, "utf8");

    // Split seed data into individual statements
    const seedStatements = seedData
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`Executing ${seedStatements.length} seed statements...`);

    for (const statement of seedStatements) {
      try {
        await executeQuery(statement);
      } catch (error) {
        // Ignore duplicate key errors for seed data
        if (
          !error.message.includes("UNIQUE constraint failed") &&
          !error.message.includes("already exists")
        ) {
          console.warn("Seed statement warning:", error.message);
        }
      }
    }

    // Verify database by checking a few key tables
    const userCount = await executeQuery("SELECT COUNT(*) as count FROM users");
    const gameCount = await executeQuery("SELECT COUNT(*) as count FROM games");
    const categoryCount = await executeQuery(
      "SELECT COUNT(*) as count FROM game_categories",
    );

    console.log("Database initialization completed successfully!");

    res.json({
      success: true,
      message: "Database initialized successfully",
      stats: {
        users: userCount[0]?.count || 0,
        games: gameCount[0]?.count || 0,
        categories: categoryCount[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({
      success: false,
      message: "Database initialization failed",
      error: error.message,
    });
  }
});

// Test database connection
router.get("/test-database", async (req, res) => {
  try {
    const result = await executeQuery("SELECT 1 as test");
    res.json({
      success: true,
      message: "Database connection successful",
      result: result[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

export default router;
