#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateAdminPermissions() {
  try {
    const dbPath = path.join(__dirname, "../database/coinkriazy.db");

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("🔄 Updating CoinKrazyAdmin permissions...");

    // Update CoinKrazyAdmin to have both admin and staff privileges
    const result = await db.run(
      "UPDATE users SET is_admin = 1, is_staff = 1 WHERE email = ?",
      ["coinkrazy00@gmail.com"],
    );

    if (result.changes > 0) {
      console.log("✅ Successfully updated CoinKrazyAdmin permissions");

      // Verify the update
      const user = await db.get(
        "SELECT username, email, is_admin, is_staff FROM users WHERE email = ?",
        ["coinkrazy00@gmail.com"],
      );

      console.log("👑 Updated user details:");
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Is Admin: ${user.is_admin ? "Yes" : "No"}`);
      console.log(`   Is Staff: ${user.is_staff ? "Yes" : "No"}`);
    } else {
      console.log("❌ No user found with email coinkrazy00@gmail.com");
    }

    await db.close();
    console.log("🎉 Permission update completed!");
  } catch (error) {
    console.error("❌ Permission update failed:", error);
  }
}

updateAdminPermissions();
