#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createLeaderboardTables() {
  try {
    const dbPath = path.join(__dirname, "../database/coinkriazy.db");

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("🔄 Creating leaderboard tables...");

    // Create weekly leaderboard table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS weekly_leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        total_winnings REAL DEFAULT 0.00,
        total_wagered REAL DEFAULT 0.00,
        games_played INTEGER DEFAULT 0,
        biggest_win REAL DEFAULT 0.00,
        win_streak INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        rank_position INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, week_start)
      )
    `);

    // Create leaderboard prizes table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard_prizes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        rank_position INTEGER NOT NULL,
        prize_type TEXT NOT NULL,
        prize_amount REAL NOT NULL,
        is_claimed BOOLEAN DEFAULT FALSE,
        claimed_by INTEGER,
        claimed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (claimed_by) REFERENCES users(id)
      )
    `);

    // Create leaderboard achievements table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS leaderboard_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_type TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        description TEXT,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        week_start DATE,
        metadata TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("✅ Leaderboard tables created successfully");

    // Insert sample weekly leaderboard data
    console.log("🔄 Adding sample leaderboard data...");

    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date) => date.toISOString().split("T")[0];

    // Sample leaderboard entries for this week
    const sampleEntries = [
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

    for (let i = 0; i < sampleEntries.length; i++) {
      const entry = sampleEntries[i];
      await db.run(
        `
        INSERT OR REPLACE INTO weekly_leaderboard (
          user_id, week_start, week_end, total_winnings, total_wagered, 
          games_played, biggest_win, win_streak, points_earned, rank_position
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
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

    // Add weekly prizes
    const weeklyPrizes = [
      { rank: 1, type: "sweeps", amount: 100.0 },
      { rank: 2, type: "sweeps", amount: 50.0 },
      { rank: 3, type: "sweeps", amount: 25.0 },
      { rank: 4, type: "gold", amount: 10000.0 },
      { rank: 5, type: "gold", amount: 7500.0 },
      { rank: 6, type: "gold", amount: 5000.0 },
      { rank: 7, type: "gold", amount: 2500.0 },
      { rank: 8, type: "gold", amount: 2500.0 },
      { rank: 9, type: "gold", amount: 1000.0 },
      { rank: 10, type: "gold", amount: 1000.0 },
    ];

    for (const prize of weeklyPrizes) {
      await db.run(
        `
        INSERT OR REPLACE INTO leaderboard_prizes (
          week_start, week_end, rank_position, prize_type, prize_amount
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [
          formatDate(weekStart),
          formatDate(weekEnd),
          prize.rank,
          prize.type,
          prize.amount,
        ],
      );
    }

    // Add sample achievements
    const achievements = [
      {
        user_id: 1,
        type: "weekly_champion",
        name: "Weekly Champion",
        description: "Finished #1 on the weekly leaderboard",
      },
      {
        user_id: 1,
        type: "high_roller",
        name: "High Roller",
        description: "Wagered over $40,000 in a single week",
      },
      {
        user_id: 2,
        type: "consistent_player",
        name: "Consistent Player",
        description: "Played games every day this week",
      },
      {
        user_id: 3,
        type: "big_winner",
        name: "Big Winner",
        description: "Hit a single win over $1,500",
      },
    ];

    for (const achievement of achievements) {
      await db.run(
        `
        INSERT INTO leaderboard_achievements (
          user_id, achievement_type, achievement_name, description, week_start
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [
          achievement.user_id,
          achievement.type,
          achievement.name,
          achievement.description,
          formatDate(weekStart),
        ],
      );
    }

    // Verify the data
    const leaderboardCount = await db.get(
      "SELECT COUNT(*) as count FROM weekly_leaderboard",
    );
    const prizeCount = await db.get(
      "SELECT COUNT(*) as count FROM leaderboard_prizes",
    );
    const achievementCount = await db.get(
      "SELECT COUNT(*) as count FROM leaderboard_achievements",
    );

    console.log("✅ Sample data added successfully");
    console.log(`📊 Leaderboard entries: ${leaderboardCount.count}`);
    console.log(`🏆 Prize entries: ${prizeCount.count}`);
    console.log(`🎖️ Achievements: ${achievementCount.count}`);

    await db.close();
    console.log("🎉 Leaderboard database setup completed!");
  } catch (error) {
    console.error("❌ Leaderboard setup failed:", error);
  }
}

createLeaderboardTables();
