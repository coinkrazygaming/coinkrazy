#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setupNeonDatabase() {
  try {
    console.log("🔄 Setting up Neon PostgreSQL database...");

    if (!process.env.NEON_DATABASE_URL) {
      console.error("❌ NEON_DATABASE_URL environment variable is required");
      console.log("📝 Please add your Neon connection string to .env file:");
      console.log(
        "   NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/coinkriazy_casino?sslmode=require",
      );
      process.exit(1);
    }

    // Create connection pool
    const pool = new pg.Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    console.log("✅ Connected to Neon database");

    // Read and execute schema
    const schemaPath = path.join(__dirname, "../database/neon-schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await pool.query(schema);
      console.log("✅ Database schema created successfully");
    }

    // Check if data already exists
    const existingUsers = await pool.query(
      "SELECT COUNT(*) as count FROM users",
    );
    const userCount = parseInt(existingUsers.rows[0].count);

    if (userCount === 0) {
      console.log("🔄 Seeding database with initial data...");

      // Create admin user
      const adminPassword = await bcrypt.hash("Woot6969!", 12);
      await pool.query(
        `INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
          true,
          true,
          true,
          new Date().toISOString(),
        ],
      );

      // Create staff user
      const staffPassword = await bcrypt.hash("Woot6969!", 12);
      await pool.query(
        `INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
          true,
          true,
          false,
          new Date().toISOString(),
        ],
      );

      // Create demo user
      const demoPassword = await bcrypt.hash("Woot6969!", 12);
      await pool.query(
        `INSERT INTO users (
          username, email, password_hash, first_name, last_name,
          date_of_birth, country, gold_coins, sweeps_coins,
          is_active, is_staff, is_admin, email_verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
          true,
          false,
          false,
          new Date().toISOString(),
        ],
      );

      // Add sample games
      const sampleGames = [
        {
          name: "Mega Jackpot Slots",
          slug: "mega-jackpot-slots",
          description:
            "Hit the mega jackpot in this exciting slot game with cascading reels and free spins!",
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
        await pool.query(
          `INSERT INTO games (
            name, slug, description, thumbnail, min_bet, max_bet, 
            max_win, rtp, volatility, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            game.name,
            game.slug,
            game.description,
            game.thumbnail,
            game.min_bet,
            game.max_bet,
            game.max_win,
            game.rtp,
            game.volatility,
            true,
          ],
        );
      }

      // Add welcome transactions
      await pool.query(
        `INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          1,
          "bonus",
          "gold",
          100000.0,
          0.0,
          100000.0,
          "Admin Welcome Bonus - Gold Coins",
          "completed",
        ],
      );

      await pool.query(
        `INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          1,
          "bonus",
          "sweeps",
          100.0,
          0.0,
          100.0,
          "Admin Welcome Bonus - Sweep Coins",
          "completed",
        ],
      );

      await pool.query(
        `INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          3,
          "bonus",
          "gold",
          25000.0,
          0.0,
          25000.0,
          "Welcome Bonus - Gold Coins",
          "completed",
        ],
      );

      await pool.query(
        `INSERT INTO transactions (user_id, transaction_type, coin_type, amount, previous_balance, new_balance, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          3,
          "bonus",
          "sweeps",
          25.0,
          0.0,
          25.0,
          "Welcome Bonus - Sweep Coins",
          "completed",
        ],
      );

      // Add sample leaderboard data
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const formatDate = (date) => date.toISOString().split("T")[0];

      const leaderboardEntries = [
        {
          user_id: 1,
          total_winnings: 15670.5,
          total_wagered: 45000.0,
          games_played: 125,
          biggest_win: 2450.0,
          win_streak: 8,
          points_earned: 1567,
        },
        {
          user_id: 2,
          total_winnings: 12340.25,
          total_wagered: 38000.0,
          games_played: 98,
          biggest_win: 1890.0,
          win_streak: 6,
          points_earned: 1234,
        },
        {
          user_id: 3,
          total_winnings: 9875.75,
          total_wagered: 32000.0,
          games_played: 87,
          biggest_win: 1675.0,
          win_streak: 5,
          points_earned: 988,
        },
      ];

      for (let i = 0; i < leaderboardEntries.length; i++) {
        const entry = leaderboardEntries[i];
        await pool.query(
          `INSERT INTO weekly_leaderboard (
            user_id, week_start, week_end, total_winnings, total_wagered, 
            games_played, biggest_win, win_streak, points_earned, rank_position
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            entry.user_id,
            formatDate(weekStart),
            formatDate(weekEnd),
            entry.total_winnings,
            entry.total_wagered,
            entry.games_played,
            entry.biggest_win,
            entry.win_streak,
            entry.points_earned,
            i + 1,
          ],
        );
      }

      console.log("✅ Sample data seeded successfully");
    } else {
      console.log(
        `✅ Database already contains ${userCount} users - skipping seed data`,
      );
    }

    // Verify setup
    const finalUserCount = await pool.query(
      "SELECT COUNT(*) as count FROM users",
    );
    const gameCount = await pool.query("SELECT COUNT(*) as count FROM games");
    const transactionCount = await pool.query(
      "SELECT COUNT(*) as count FROM transactions",
    );

    console.log("🎉 Neon database setup completed successfully!");
    console.log(`📊 Database Stats:`);
    console.log(`   - Users: ${finalUserCount.rows[0].count}`);
    console.log(`   - Games: ${gameCount.rows[0].count}`);
    console.log(`   - Transactions: ${transactionCount.rows[0].count}`);

    console.log(`\n🔑 Login Credentials:`);
    console.log(`   👑 Admin: coinkrazy00@gmail.com / Woot6969!`);
    console.log(`   👨‍💼 Staff: staff@coinkriazy.com / Woot6969!`);
    console.log(`   👤 Demo: demo1@coinkriazy.com / Woot6969!`);

    console.log(`\n📋 Next Steps:`);
    console.log(`   1. Update your .env file: DB_TYPE=neon`);
    console.log(`   2. Restart your application`);
    console.log(`   3. Your CoinKrazy casino is now running on Neon!`);

    await pool.end();
  } catch (error) {
    console.error("❌ Neon database setup failed:", error);
    process.exit(1);
  }
}

setupNeonDatabase();
