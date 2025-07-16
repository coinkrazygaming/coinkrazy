#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeEnhancedDatabase() {
  const dbPath = path.join(__dirname, "../database/coinkriazy.db");

  try {
    console.log("🔄 Initializing CoinKrazy database...");

    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Remove existing database
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log("🗑️  Removed existing database");
    }

    // Open database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log(`✅ SQLite database created: ${dbPath}`);

    // Enable foreign keys
    await db.exec("PRAGMA foreign_keys = ON;");

    // Create schema
    console.log("🔄 Creating database schema...");

    // Users table
    await db.exec(`
      CREATE TABLE users (
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
        kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
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

    // Transactions table
    await db.exec(`
      CREATE TABLE transactions (
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

    // Games table
    await db.exec(`
      CREATE TABLE games (
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

    // Game sessions table
    await db.exec(`
      CREATE TABLE game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_end DATETIME,
        status TEXT DEFAULT 'active',
        total_bet REAL DEFAULT 0.00,
        total_win REAL DEFAULT 0.00,
        spin_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (game_id) REFERENCES games(id)
      )
    `);

    // Game results table
    await db.exec(`
      CREATE TABLE game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        session_id INTEGER,
        bet_amount REAL NOT NULL,
        win_amount REAL DEFAULT 0.00,
        multiplier REAL DEFAULT 0.00,
        result_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (session_id) REFERENCES game_sessions(id)
      )
    `);

    // Chat messages table
    await db.exec(`
      CREATE TABLE chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        room TEXT DEFAULT 'general',
        is_system BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Notifications table
    await db.exec(`
      CREATE TABLE notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("✅ Database schema created");

    // Create admin user
    console.log("🔄 Creating admin user...");
    const adminPassword = await bcrypt.hash("Woot6969!", 12);

    await db.run(
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
        adminPassword,
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

    // Create staff user
    console.log("🔄 Creating staff user...");
    const staffPassword = await bcrypt.hash("Woot6969!", 12);

    await db.run(
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
        staffPassword,
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

    // Create demo user
    console.log("🔄 Creating demo user...");
    const demoPassword = await bcrypt.hash("Woot6969!", 12);

    await db.run(
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
        demoPassword,
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

    // Add sample games
    console.log("🔄 Adding sample games...");

    const sampleGames = [
      {
        name: "Mega Jackpot Slots",
        slug: "mega-jackpot-slots",
        description:
          "Hit the mega jackpot in this exciting slot game with cascading reels and free spins!",
        provider: "CoinKrazy Studios",
        category: "Slots",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F94851f32130e47a4b85ad96fa19ed4ec?format=webp&width=800",
        min_bet: 1.0,
        max_bet: 100.0,
        max_win: 50000.0,
        rtp: 96.5,
        volatility: "high",
      },
      {
        name: "Gold Rush Poker",
        slug: "gold-rush-poker",
        description:
          "Strike it rich with video poker! Multiple variations available.",
        provider: "CoinKrazy Studios",
        category: "Table Games",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F72c742a5911d473691d607381841c43f?format=webp&width=800",
        min_bet: 5.0,
        max_bet: 500.0,
        max_win: 25000.0,
        rtp: 98.0,
        volatility: "low",
      },
      {
        name: "Lucky Blackjack",
        slug: "lucky-blackjack",
        description:
          "Beat the dealer in classic blackjack with perfect strategy guides!",
        provider: "CoinKrazy Studios",
        category: "Table Games",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F158ad80714ee4ada8f8c644f5204f766?format=webp&width=800",
        min_bet: 1.0,
        max_bet: 200.0,
        max_win: 10000.0,
        rtp: 99.5,
        volatility: "low",
      },
      {
        name: "Diamond Roulette",
        slug: "diamond-roulette",
        description:
          "European roulette with stunning graphics and smooth gameplay!",
        provider: "CoinKrazy Studios",
        category: "Table Games",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F94851f32130e47a4b85ad96fa19ed4ec?format=webp&width=800",
        min_bet: 1.0,
        max_bet: 1000.0,
        max_win: 35000.0,
        rtp: 97.3,
        volatility: "medium",
      },
      {
        name: "Crystal Fortune Slots",
        slug: "crystal-fortune-slots",
        description:
          "Mystical slot game with expanding wilds and bonus rounds!",
        provider: "CoinKrazy Studios",
        category: "Slots",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F72c742a5911d473691d607381841c43f?format=webp&width=800",
        min_bet: 0.5,
        max_bet: 50.0,
        max_win: 20000.0,
        rtp: 95.8,
        volatility: "medium",
      },
      {
        name: "Treasure Hunt Slots",
        slug: "treasure-hunt-slots",
        description: "Adventure-themed slot with interactive bonus features!",
        provider: "CoinKrazy Studios",
        category: "Slots",
        thumbnail:
          "https://cdn.builder.io/api/v1/image/assets%2F7c34c31495aa42ffab5801e2d12a9790%2F158ad80714ee4ada8f8c644f5204f766?format=webp&width=800",
        min_bet: 1.0,
        max_bet: 75.0,
        max_win: 30000.0,
        rtp: 96.2,
        volatility: "medium",
      },
    ];

    for (const game of sampleGames) {
      await db.run(
        `
        INSERT INTO games (
          name, slug, description, provider, category, thumbnail,
          min_bet, max_bet, max_win, rtp, volatility, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          game.volatility,
          1,
        ],
      );
    }

    // Add welcome notifications for users
    console.log("🔄 Adding welcome notifications...");

    // Admin welcome notification
    await db.run(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (1, 'Welcome to CoinKrazy Admin!', 'Welcome to your CoinKrazy casino admin panel. You have full access to manage the platform.', 'info')
    `);

    // Staff welcome notification
    await db.run(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (2, 'Welcome CoinKrazy Staff!', 'Welcome to your CoinKrazy staff dashboard. You can assist players and manage operations.', 'info')
    `);

    // Demo welcome notification
    await db.run(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (3, 'Welcome to CoinKrazy!', 'Welcome to CoinKrazy.com! You have been credited with 25,000 Gold Coins and 25 Sweep Coins to get started. Have fun!', 'success')
    `);

    // Add some sample transactions for demo
    console.log("🔄 Adding sample transactions...");

    // Welcome bonus transactions
    await db.run(`
      INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
      VALUES (1, 'bonus', 'gold', 100000.0, 0.0, 100000.0, 'Admin Welcome Bonus - Gold Coins', 'completed')
    `);

    await db.run(`
      INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
      VALUES (1, 'bonus', 'sweeps', 100.0, 0.0, 100.0, 'Admin Welcome Bonus - Sweep Coins', 'completed')
    `);

    await db.run(`
      INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
      VALUES (3, 'bonus', 'gold', 25000.0, 0.0, 25000.0, 'Welcome Bonus - Gold Coins', 'completed')
    `);

    await db.run(`
      INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
      VALUES (3, 'bonus', 'sweeps', 25.0, 0.0, 25.0, 'Welcome Bonus - Sweep Coins', 'completed')
    `);

    // Verify setup
    const userCount = await db.get("SELECT COUNT(*) as count FROM users");
    const gameCount = await db.get("SELECT COUNT(*) as count FROM games");
    const transactionCount = await db.get(
      "SELECT COUNT(*) as count FROM transactions",
    );
    const notificationCount = await db.get(
      "SELECT COUNT(*) as count FROM notifications",
    );

    await db.close();

    console.log("🎉 Database initialization completed successfully!");
    console.log(`📊 Database Stats:`);
    console.log(`   - Users: ${userCount.count}`);
    console.log(`   - Games: ${gameCount.count}`);
    console.log(`   - Transactions: ${transactionCount.count}`);
    console.log(`   - Notifications: ${notificationCount.count}`);

    console.log(`\n🔑 Login Credentials:`);
    console.log(`   👑 Admin: coinkrazy00@gmail.com / Woot6969!`);
    console.log(`   👨‍💼 Staff: staff@coinkriazy.com / Woot6969!`);
    console.log(`   👤 Demo: demo1@coinkriazy.com / Woot6969!`);

    console.log(`\n💰 Starting Balances:`);
    console.log(`   👑 Admin: 100,000 GC + 100 SC`);
    console.log(`   👨‍💼 Staff: 50,000 GC + 50 SC`);
    console.log(`   👤 Demo: 25,000 GC + 25 SC`);

    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    return false;
  }
}

// Run initialization
initializeEnhancedDatabase()
  .then((success) => {
    if (success) {
      console.log("\n📋 Next steps:");
      console.log("1. Start the server: npm run dev");
      console.log("2. Visit the application in your browser");
      console.log("3. Login with any of the provided credentials");
      console.log("4. Enjoy your CoinKrazy casino!");
    }
    process.exit(success ? 0 : 1);
  })
  .catch(console.error);
