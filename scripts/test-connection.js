#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDatabaseConnection() {
  try {
    const dbPath = path.join(__dirname, "../database/coinkriazy.db");

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("✅ Database connection successful");

    // Test admin user
    const adminUser = await db.get(
      "SELECT email, username, is_admin, gold_coins, sweeps_coins FROM users WHERE email = ?",
      ["coinkrazy00@gmail.com"],
    );

    if (adminUser) {
      console.log("👑 Admin user found:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Gold Coins: ${adminUser.gold_coins}`);
      console.log(`   Sweep Coins: ${adminUser.sweeps_coins}`);
      console.log(`   Is Admin: ${adminUser.is_admin ? "Yes" : "No"}`);
    } else {
      console.log("❌ Admin user not found");
    }

    // Test games
    const gameCount = await db.get("SELECT COUNT(*) as count FROM games");
    console.log(`🎮 Games in database: ${gameCount.count}`);

    // Test transactions
    const transactionCount = await db.get(
      "SELECT COUNT(*) as count FROM transactions",
    );
    console.log(`💰 Transactions in database: ${transactionCount.count}`);

    await db.close();
    console.log("🎉 Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }
}

testDatabaseConnection();
