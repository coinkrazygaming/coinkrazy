#!/usr/bin/env node

import {
  testConnection,
  executeQuery,
  getDatabaseType,
  initializeDatabase,
} from "../server/config/database.js";
import bcrypt from "bcryptjs";

async function checkAndFixDatabase() {
  try {
    console.log("🔍 Checking database status...");
    console.log(`📋 Database type: ${getDatabaseType().toUpperCase()}`);

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.log("❌ Database connection failed, attempting to initialize...");
      await initializeDatabase();
    }

    // Check if tables exist
    let tablesExist = false;
    try {
      const users = await executeQuery("SELECT COUNT(*) as count FROM users");
      console.log(`✅ Found ${users[0]?.count || 0} users in database`);
      tablesExist = true;
    } catch (error) {
      console.log("⚠️  Users table not found - need to create schema");
    }

    // If tables don't exist, create them
    if (!tablesExist) {
      console.log("🔄 Creating database schema...");

      // Create users table
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          date_of_birth DATE NOT NULL,
          phone TEXT,
          country TEXT NOT NULL,
          state TEXT,
          zip_code TEXT,
          gold_coins REAL DEFAULT 0.00,
          sweeps_coins REAL DEFAULT 0.00,
          level INTEGER DEFAULT 1,
          experience_points INTEGER DEFAULT 0,
          kyc_status TEXT DEFAULT 'pending',
          kyc_documents TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          is_staff BOOLEAN DEFAULT FALSE,
          is_admin BOOLEAN DEFAULT FALSE,
          email_verified_at DATETIME,
          email_verification_token TEXT,
          email_verification_expires DATETIME,
          last_login DATETIME,
          registration_ip TEXT,
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create other essential tables
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          transaction_type TEXT NOT NULL,
          coin_type TEXT NOT NULL,
          amount REAL NOT NULL,
          previous_balance REAL DEFAULT 0.00,
          new_balance REAL DEFAULT 0.00,
          description TEXT,
          reference_id TEXT,
          status TEXT DEFAULT 'completed',
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          processed_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      await executeQuery(`
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          provider TEXT,
          category TEXT,
          thumbnail TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          min_bet REAL DEFAULT 1.00,
          max_bet REAL DEFAULT 1000.00,
          max_win REAL DEFAULT 10000.00,
          rtp REAL DEFAULT 95.00,
          volatility TEXT DEFAULT 'medium',
          play_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("✅ Essential tables created");
    }

    // Check for admin user
    const adminUser = await executeQuery(
      "SELECT * FROM users WHERE email = ? AND is_admin = 1",
      ["coinkrazy00@gmail.com"],
    );

    if (adminUser.length === 0) {
      console.log("🔄 Creating admin user: coinkrazy00@gmail.com");

      const hashedPassword = await bcrypt.hash("Woot6969!", 12);

      await executeQuery(
        `
        INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "CoinKrazyAdmin",
          "coinkrazy00@gmail.com",
          hashedPassword,
          "CoinKrazy",
          "Admin",
          "1990-01-01",
          "US",
          100000.0,
          100.0,
          1,
          1,
          1,
          new Date().toISOString(),
        ],
      );

      console.log("✅ Admin user created successfully");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Check for staff user
    const staffUser = await executeQuery(
      "SELECT * FROM users WHERE email = ? AND is_staff = 1",
      ["staff@coinkriazy.com"],
    );

    if (staffUser.length === 0) {
      console.log("🔄 Creating staff user: staff@coinkriazy.com");

      const hashedPassword = await bcrypt.hash("Woot6969!", 12);

      await executeQuery(
        `
        INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "CoinKrazyStaff",
          "staff@coinkriazy.com",
          hashedPassword,
          "CoinKrazy",
          "Staff",
          "1990-01-01",
          "US",
          50000.0,
          50.0,
          1,
          1,
          0,
          new Date().toISOString(),
        ],
      );

      console.log("✅ Staff user created successfully");
    } else {
      console.log("✅ Staff user already exists");
    }

    // Check for demo user
    const demoUser = await executeQuery("SELECT * FROM users WHERE email = ?", [
      "demo1@coinkriazy.com",
    ]);

    if (demoUser.length === 0) {
      console.log("🔄 Creating demo user: demo1@coinkriazy.com");

      const hashedPassword = await bcrypt.hash("Woot6969!", 12);

      await executeQuery(
        `
        INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "DemoPlayer1",
          "demo1@coinkriazy.com",
          hashedPassword,
          "Demo",
          "Player",
          "1995-01-01",
          "US",
          25000.0,
          25.0,
          1,
          0,
          0,
          new Date().toISOString(),
        ],
      );

      console.log("✅ Demo user created successfully");
    } else {
      console.log("✅ Demo user already exists");
    }

    // Add some sample games if none exist
    const gameCount = await executeQuery("SELECT COUNT(*) as count FROM games");
    if (gameCount[0].count === 0) {
      console.log("🔄 Adding sample games...");

      const sampleGames = [
        {
          name: "Mega Jackpot Slots",
          slug: "mega-jackpot-slots",
          description: "Hit the mega jackpot in this exciting slot game!",
          provider: "CoinKrazy Studios",
          category: "Slots",
          thumbnail:
            "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F94851f32130e47a4b85ad96fa19ed4ec?format=webp&width=800",
          min_bet: 1.0,
          max_bet: 100.0,
          max_win: 50000.0,
          rtp: 96.5,
        },
        {
          name: "Gold Rush Poker",
          slug: "gold-rush-poker",
          description: "Strike it rich with video poker!",
          provider: "CoinKrazy Studios",
          category: "Table Games",
          thumbnail:
            "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F72c742a5911d473691d607381841c43f?format=webp&width=800",
          min_bet: 5.0,
          max_bet: 500.0,
          max_win: 25000.0,
          rtp: 98.0,
        },
        {
          name: "Lucky Blackjack",
          slug: "lucky-blackjack",
          description: "Beat the dealer in classic blackjack!",
          provider: "CoinKrazy Studios",
          category: "Table Games",
          thumbnail:
            "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F158ad80714ee4ada8f8c644f5204f766?format=webp&width=800",
          min_bet: 1.0,
          max_bet: 200.0,
          max_win: 10000.0,
          rtp: 99.5,
        },
      ];

      for (const game of sampleGames) {
        await executeQuery(
          `
          INSERT INTO games (
            name, slug, description, provider, category, thumbnail,
            min_bet, max_bet, max_win, rtp, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            game.name,
            game.slug,
            game.description,
            game.provider,
            game.category,
            game.thumbnail,
            game.min_bet,
            game.max_bet,
            game.max_win,
            game.rtp,
            1,
          ],
        );
      }

      console.log("✅ Sample games added");
    }

    // Final verification
    const finalUserCount = await executeQuery(
      "SELECT COUNT(*) as count FROM users",
    );
    const finalGameCount = await executeQuery(
      "SELECT COUNT(*) as count FROM games",
    );
    const adminCount = await executeQuery(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = 1",
    );

    console.log("\n🎉 Database setup completed successfully!");
    console.log(`📊 Final Stats:`);
    console.log(`   - Total Users: ${finalUserCount[0].count}`);
    console.log(`   - Total Games: ${finalGameCount[0].count}`);
    console.log(`   - Admin Users: ${adminCount[0].count}`);

    console.log(`\n🔑 Login Credentials:`);
    console.log(`   👑 Admin: coinkrazy00@gmail.com / Woot6969!`);
    console.log(`   👨‍💼 Staff: staff@coinkriazy.com / Woot6969!`);
    console.log(`   👤 Demo: demo1@coinkriazy.com / Woot6969!`);

    return true;
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    return false;
  }
}

// Run the database checker and fixer
checkAndFixDatabase()
  .then((success) => {
    console.log(
      success ? "\n✅ Ready to start the application!" : "\n❌ Setup failed",
    );
    process.exit(success ? 0 : 1);
  })
  .catch(console.error);
