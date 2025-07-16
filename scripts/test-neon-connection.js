#!/usr/bin/env node

import {
  testConnection,
  executeQuery,
  getDatabaseType,
  initializeDatabase,
} from "../server/config/database.js";

async function testNeonConnection() {
  try {
    console.log(
      `🎯 Testing ${getDatabaseType().toUpperCase()} database connection...`,
    );

    if (getDatabaseType() !== "neon") {
      console.log(
        "⚠️  Database type is not set to 'neon'. Current type:",
        getDatabaseType(),
      );
      console.log("💡 To use Neon, update your .env file:");
      console.log("   DB_TYPE=neon");
      console.log("   NEON_DATABASE_URL=your_neon_connection_string_here");
      return;
    }

    if (!process.env.NEON_DATABASE_URL) {
      console.log("❌ NEON_DATABASE_URL environment variable not set");
      console.log("📝 Please add your Neon connection string to .env file:");
      console.log(
        "   NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/coinkriazy_casino?sslmode=require",
      );
      return;
    }

    // Initialize database connection
    await initializeDatabase();

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Database connection failed");
    }

    // Test a simple query
    try {
      const users = await executeQuery("SELECT COUNT(*) as count FROM users");
      console.log(`✅ Found ${users[0]?.count || 0} users in database`);
    } catch (error) {
      console.log("⚠️  Users table not found - database may need to be set up");
      console.log("💡 Run: node scripts/setup-neon-database.js");
    }

    // Test games table
    try {
      const games = await executeQuery("SELECT COUNT(*) as count FROM games");
      console.log(`✅ Found ${games[0]?.count || 0} games in database`);
    } catch (error) {
      console.log("⚠️  Games table not found - database may need to be set up");
    }

    // Test leaderboard table
    try {
      const leaderboard = await executeQuery(
        "SELECT COUNT(*) as count FROM weekly_leaderboard",
      );
      console.log(`✅ Found ${leaderboard[0]?.count || 0} leaderboard entries`);
    } catch (error) {
      console.log(
        "⚠️  Leaderboard table not found - database may need to be set up",
      );
    }

    console.log("🎉 Neon database connection test completed successfully!");
    console.log("🚀 Your CoinKrazy casino is ready to use Neon database!");
  } catch (error) {
    console.error("❌ Neon connection test failed:", error.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Check your NEON_DATABASE_URL is correct");
    console.log("2. Ensure your Neon database is running");
    console.log("3. Verify your network connection");
    console.log("4. Run the setup script: node scripts/setup-neon-database.js");
  }
}

testNeonConnection();
