import express from "express";
import jwt from "jsonwebtoken";
import { executeQuery } from "../config/database.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "coinkriazy_jwt_secret_2024";

// Middleware to verify JWT token (optional for public leaderboard)
function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
    } catch (error) {
      // Token invalid, but continue for public endpoints
    }
  }
  next();
}

// Get current weekly leaderboard
router.get("/weekly", verifyToken, async (req: any, res) => {
  try {
    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Get leaderboard with user details
    const leaderboard = await executeQuery(
      `SELECT 
        wl.rank_position,
        wl.total_winnings,
        wl.total_wagered,
        wl.games_played,
        wl.biggest_win,
        wl.win_streak,
        wl.points_earned,
        u.username,
        u.level,
        u.country,
        CASE WHEN u.id = ? THEN 1 ELSE 0 END as is_current_user
      FROM weekly_leaderboard wl
      JOIN users u ON wl.user_id = u.id
      WHERE wl.week_start = ? AND wl.week_end = ?
      ORDER BY wl.rank_position ASC
      LIMIT 50`,
      [req.user?.id || 0, formatDate(weekStart), formatDate(weekEnd)],
    );

    // Get current user's position if logged in
    let currentUserStats = null;
    if (req.user) {
      const userStats = await executeQuery(
        `SELECT 
          wl.rank_position,
          wl.total_winnings,
          wl.total_wagered,
          wl.games_played,
          wl.biggest_win,
          wl.win_streak,
          wl.points_earned
        FROM weekly_leaderboard wl
        WHERE wl.user_id = ? AND wl.week_start = ? AND wl.week_end = ?`,
        [req.user.id, formatDate(weekStart), formatDate(weekEnd)],
      );

      if (userStats.length > 0) {
        currentUserStats = userStats[0];
      }
    }

    // Get week info
    const weekInfo = {
      start: formatDate(weekStart),
      end: formatDate(weekEnd),
      daysRemaining: Math.ceil(
        (weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      ),
      isActive: now >= weekStart && now <= weekEnd,
    };

    res.json({
      leaderboard,
      currentUserStats,
      weekInfo,
      totalPlayers: leaderboard.length,
    });
  } catch (error) {
    console.error("Weekly leaderboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get leaderboard prizes for current week
router.get("/prizes", async (req, res) => {
  try {
    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const prizes = await executeQuery(
      `SELECT 
        rank_position,
        prize_type,
        prize_amount,
        is_claimed,
        claimed_by
      FROM leaderboard_prizes
      WHERE week_start = ? AND week_end = ?
      ORDER BY rank_position ASC`,
      [formatDate(weekStart), formatDate(weekEnd)],
    );

    res.json({ prizes });
  } catch (error) {
    console.error("Leaderboard prizes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user achievements
router.get("/achievements/:userId?", verifyToken, async (req: any, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID required" });
    }

    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const achievements = await executeQuery(
      `SELECT 
        achievement_type,
        achievement_name,
        description,
        earned_at,
        metadata
      FROM leaderboard_achievements
      WHERE user_id = ? AND week_start = ?
      ORDER BY earned_at DESC`,
      [userId, formatDate(weekStart)],
    );

    res.json({ achievements });
  } catch (error) {
    console.error("User achievements error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get leaderboard statistics
router.get("/stats", async (req, res) => {
  try {
    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Get overall stats
    const stats = await executeQuery(
      `SELECT 
        COUNT(*) as total_participants,
        SUM(total_winnings) as total_winnings_pool,
        SUM(total_wagered) as total_wagered_pool,
        MAX(biggest_win) as biggest_win_this_week,
        AVG(games_played) as avg_games_played
      FROM weekly_leaderboard
      WHERE week_start = ? AND week_end = ?`,
      [formatDate(weekStart), formatDate(weekEnd)],
    );

    // Get top performers
    const topWinner = await executeQuery(
      `SELECT u.username, wl.total_winnings
      FROM weekly_leaderboard wl
      JOIN users u ON wl.user_id = u.id
      WHERE wl.week_start = ? AND wl.week_end = ? AND wl.rank_position = 1`,
      [formatDate(weekStart), formatDate(weekEnd)],
    );

    const topWagerer = await executeQuery(
      `SELECT u.username, wl.total_wagered
      FROM weekly_leaderboard wl
      JOIN users u ON wl.user_id = u.id
      WHERE wl.week_start = ? AND wl.week_end = ?
      ORDER BY wl.total_wagered DESC
      LIMIT 1`,
      [formatDate(weekStart), formatDate(weekEnd)],
    );

    res.json({
      stats: stats[0] || {},
      topWinner: topWinner[0] || null,
      topWagerer: topWagerer[0] || null,
      weekInfo: {
        start: formatDate(weekStart),
        end: formatDate(weekEnd),
        daysRemaining: Math.ceil(
          (weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        ),
      },
    });
  } catch (error) {
    console.error("Leaderboard stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update leaderboard (usually called after game completion)
router.post("/update", verifyToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { winnings, wagered, gameType, winAmount } = req.body;

    // Get current week dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Calculate points (simplified scoring system)
    const points = Math.floor(
      (winnings || 0) * 0.1 + (wagered || 0) * 0.01 + (winAmount || 0) * 0.05,
    );

    // Update or insert leaderboard entry
    await executeQuery(
      `INSERT OR REPLACE INTO weekly_leaderboard (
        user_id, week_start, week_end, total_winnings, total_wagered, 
        games_played, biggest_win, points_earned, updated_at
      ) VALUES (
        ?, ?, ?, 
        COALESCE((SELECT total_winnings FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?), 0) + ?,
        COALESCE((SELECT total_wagered FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?), 0) + ?,
        COALESCE((SELECT games_played FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?), 0) + 1,
        MAX(COALESCE((SELECT biggest_win FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?), 0), ?),
        COALESCE((SELECT points_earned FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?), 0) + ?,
        CURRENT_TIMESTAMP
      )`,
      [
        req.user.id,
        formatDate(weekStart),
        formatDate(weekEnd),
        req.user.id,
        formatDate(weekStart),
        winnings || 0,
        req.user.id,
        formatDate(weekStart),
        wagered || 0,
        req.user.id,
        formatDate(weekStart),
        req.user.id,
        formatDate(weekStart),
        winAmount || 0,
        req.user.id,
        formatDate(weekStart),
        points,
      ],
    );

    res.json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Leaderboard update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
