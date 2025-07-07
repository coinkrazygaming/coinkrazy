import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "coinkriazy_user",
  password: process.env.DB_PASSWORD || "CoinKriazy2024!",
  database: process.env.DB_NAME || "coinkriazy_casino",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Execute query helper
export async function executeQuery(
  query: string,
  params: any[] = [],
): Promise<any> {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Initialize database
export async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
    const tempPool = mysql.createPool({
      ...dbConfig,
      database: undefined,
    });

    await tempPool.execute(createDbQuery);
    console.log(`✅ Database ${dbConfig.database} created/verified`);

    // Test connection with the actual database
    await testConnection();

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
