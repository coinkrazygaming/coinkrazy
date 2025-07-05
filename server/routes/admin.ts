import express from "express";
import jwt from "jsonwebtoken";
import { executeQuery } from "../config/database.js";
import { z } from "zod";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "coinkriazy_jwt_secret_2024";

// Middleware to verify JWT token and admin access
function verifyAdminToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Dashboard stats
router.get("/dashboard", verifyAdminToken, async (req: any, res) => {
  try {
    // User statistics
    const userStats = await executeQuery(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN DATE(registration_date) = CURDATE() THEN 1 END) as new_today,
        COUNT(CASE WHEN DATE(last_login) = CURDATE() THEN 1 END) as active_today,
        COUNT(CASE WHEN kyc_status = 'verified' THEN 1 END) as verified_users,
        COUNT(CASE WHEN kyc_status = 'pending' THEN 1 END) as pending_kyc
      FROM users 
      WHERE is_active = TRUE`,
    );

    // Financial statistics
    const financialStats = await executeQuery(
      `SELECT 
        SUM(CASE WHEN transaction_type = 'purchase' AND status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN transaction_type = 'withdrawal' AND status = 'completed' THEN -amount ELSE 0 END) as total_withdrawals,
        COUNT(CASE WHEN transaction_type = 'purchase' AND DATE(created_at) = CURDATE() THEN 1 END) as purchases_today,
        COUNT(CASE WHEN transaction_type = 'withdrawal' AND status = 'pending' THEN 1 END) as pending_withdrawals
      FROM transactions`,
    );

    // Game statistics
    const gameStats = await executeQuery(
      `SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_games,
        COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_games,
        SUM(play_count) as total_plays
      FROM games`,
    );

    // Recent activity
    const recentUsers = await executeQuery(
      `SELECT id, username, email, registration_date, kyc_status
      FROM users 
      ORDER BY registration_date DESC 
      LIMIT 5`,
    );

    const recentWithdrawals = await executeQuery(
      `SELECT 
        t.id, t.amount, t.status, t.created_at,
        u.username, u.email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.transaction_type = 'withdrawal'
      ORDER BY t.created_at DESC 
      LIMIT 5`,
    );

    // Top games by revenue
    const topGames = await executeQuery(
      `SELECT 
        g.name, g.slug,
        COUNT(gr.id) as total_plays,
        SUM(gr.bet_amount) as total_wagered,
        SUM(gr.win_amount) as total_paid,
        (SUM(gr.bet_amount) - SUM(gr.win_amount)) as house_edge
      FROM games g
      LEFT JOIN game_results gr ON g.id = gr.game_id
      WHERE g.is_active = TRUE
      GROUP BY g.id, g.name, g.slug
      ORDER BY total_wagered DESC
      LIMIT 10`,
    );

    res.json({
      userStats: userStats[0],
      financialStats: financialStats[0],
      gameStats: gameStats[0],
      recentUsers,
      recentWithdrawals,
      topGames,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User management
router.get("/users", verifyAdminToken, async (req: any, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      kycStatus,
      isActive,
      sortBy = "registration_date",
      order = "DESC",
    } = req.query;

    let whereConditions = [];
    let queryParams: any[] = [];

    if (search) {
      whereConditions.push(
        "(username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)",
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (kycStatus) {
      whereConditions.push("kyc_status = ?");
      queryParams.push(kycStatus);
    }

    if (isActive !== undefined) {
      whereConditions.push("is_active = ?");
      queryParams.push(isActive === "true");
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const users = await executeQuery(
      `SELECT 
        id, username, email, first_name, last_name, country,
        gold_coins, sweeps_coins, level, kyc_status, is_active,
        registration_date, last_login
      FROM users 
      ${whereClause}
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), offset],
    );

    const totalResult = await executeQuery(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams,
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalResult[0].total,
        pages: Math.ceil(totalResult[0].total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user details
router.get("/users/:id", verifyAdminToken, async (req: any, res) => {
  try {
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [
      req.params.id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user transaction summary
    const transactions = await executeQuery(
      `SELECT 
        transaction_type,
        coin_type,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM transactions 
      WHERE user_id = ? 
      GROUP BY transaction_type, coin_type`,
      [req.params.id],
    );

    // Get recent activity
    const recentActivity = await executeQuery(
      `SELECT 
        transaction_type, coin_type, amount, description, created_at
      FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10`,
      [req.params.id],
    );

    res.json({
      user: user[0],
      transactionSummary: transactions,
      recentActivity,
    });
  } catch (error) {
    console.error("User details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user
router.put("/users/:id", verifyAdminToken, async (req: any, res) => {
  try {
    const updateSchema = z.object({
      kycStatus: z.enum(["pending", "verified", "rejected"]).optional(),
      isActive: z.boolean().optional(),
      goldCoins: z.number().min(0).optional(),
      sweepsCoins: z.number().min(0).optional(),
      level: z.number().min(1).max(100).optional(),
      notes: z.string().optional(),
    });

    const validatedData = updateSchema.parse(req.body);

    const updateFields = [];
    const updateValues = [];

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        updateFields.push(`${dbField} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updateValues.push(req.params.id);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      updateValues,
    );

    // Log the admin action
    await executeQuery(
      `INSERT INTO audit_logs (
        user_id, action, table_name, record_id, new_values, ip_address
      ) VALUES (?, 'update_user', 'users', ?, ?, ?)`,
      [req.user.id, req.params.id, JSON.stringify(validatedData), req.ip],
    );

    res.json({ message: "User updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("User update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Withdrawal management
router.get("/withdrawals", verifyAdminToken, async (req: any, res) => {
  try {
    const { page = 1, limit = 20, status = "pending" } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const withdrawals = await executeQuery(
      `SELECT 
        t.id, t.amount, t.status, t.created_at, t.metadata,
        u.id as user_id, u.username, u.email, u.kyc_status
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.transaction_type = 'withdrawal' 
      ${status !== "all" ? "AND t.status = ?" : ""}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      status !== "all"
        ? [status, parseInt(limit as string), offset]
        : [parseInt(limit as string), offset],
    );

    // Parse metadata for withdrawal details
    const withdrawalsWithDetails = withdrawals.map((w: any) => ({
      ...w,
      withdrawalDetails: w.metadata ? JSON.parse(w.metadata) : null,
    }));

    res.json({ withdrawals: withdrawalsWithDetails });
  } catch (error) {
    console.error("Withdrawals fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Process withdrawal
router.put("/withdrawals/:id", verifyAdminToken, async (req: any, res) => {
  try {
    const statusSchema = z.object({
      status: z.enum(["completed", "rejected"]),
      notes: z.string().optional(),
    });

    const { status, notes } = statusSchema.parse(req.body);

    const withdrawal = await executeQuery(
      `SELECT t.*, u.sweeps_coins 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ? AND t.transaction_type = 'withdrawal'`,
      [req.params.id],
    );

    if (withdrawal.length === 0) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    const w = withdrawal[0];

    if (status === "rejected") {
      // Refund the coins
      const newBalance = w.sweeps_coins + Math.abs(w.amount);
      await executeQuery("UPDATE users SET sweeps_coins = ? WHERE id = ?", [
        newBalance,
        w.user_id,
      ]);

      // Create refund transaction
      await executeQuery(
        `INSERT INTO transactions (
          user_id, transaction_type, coin_type, amount, 
          previous_balance, new_balance, description, status, reference_id
        ) VALUES (?, 'refund', 'sweeps', ?, ?, ?, ?, 'completed', ?)`,
        [
          w.user_id,
          Math.abs(w.amount),
          w.sweeps_coins,
          newBalance,
          `Withdrawal refund - ${notes || "Rejected by admin"}`,
          w.id,
        ],
      );
    }

    // Update withdrawal status
    await executeQuery(
      `UPDATE transactions SET 
        status = ?, 
        processed_at = NOW(),
        description = CONCAT(description, ' - ', ?)
      WHERE id = ?`,
      [status, notes || `${status} by admin`, req.params.id],
    );

    // Log admin action
    await executeQuery(
      `INSERT INTO audit_logs (
        user_id, action, table_name, record_id, new_values, ip_address
      ) VALUES (?, 'process_withdrawal', 'transactions', ?, ?, ?)`,
      [req.user.id, req.params.id, JSON.stringify({ status, notes }), req.ip],
    );

    res.json({ message: `Withdrawal ${status} successfully` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Withdrawal processing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Game management
router.get("/games", verifyAdminToken, async (req: any, res) => {
  try {
    const games = await executeQuery(
      `SELECT 
        g.*, gc.name as category_name, gp.name as provider_name
      FROM games g
      JOIN game_categories gc ON g.category_id = gc.id
      JOIN game_providers gp ON g.provider_id = gp.id
      ORDER BY g.play_count DESC`,
    );

    res.json({ games });
  } catch (error) {
    console.error("Games fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update game RTP
router.put("/games/:id/rtp", verifyAdminToken, async (req: any, res) => {
  try {
    const rtpSchema = z.object({
      rtp: z.number().min(85).max(99),
    });

    const { rtp } = rtpSchema.parse(req.body);

    await executeQuery("UPDATE games SET rtp = ? WHERE id = ?", [
      rtp,
      req.params.id,
    ]);

    // Log admin action
    await executeQuery(
      `INSERT INTO audit_logs (
        user_id, action, table_name, record_id, new_values, ip_address
      ) VALUES (?, 'update_game_rtp', 'games', ?, ?, ?)`,
      [req.user.id, req.params.id, JSON.stringify({ rtp }), req.ip],
    );

    res.json({ message: "Game RTP updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("RTP update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// System settings
router.get("/settings", verifyAdminToken, async (req: any, res) => {
  try {
    const settings = await executeQuery(
      "SELECT setting_key, setting_value, setting_type, description FROM system_settings ORDER BY setting_key",
    );

    const settingsMap = settings.reduce((acc: any, setting: any) => {
      let value = setting.setting_value;
      if (setting.setting_type === "number") {
        value = parseFloat(value);
      } else if (setting.setting_type === "boolean") {
        value = value === "true";
      } else if (setting.setting_type === "json") {
        value = JSON.parse(value);
      }
      acc[setting.setting_key] = {
        value,
        type: setting.setting_type,
        description: setting.description,
      };
      return acc;
    }, {});

    res.json({ settings: settingsMap });
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update system setting
router.put("/settings/:key", verifyAdminToken, async (req: any, res) => {
  try {
    const settingSchema = z.object({
      value: z.any(),
    });

    const { value } = settingSchema.parse(req.body);

    let stringValue = value;
    if (typeof value === "object") {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = value.toString();
    }

    await executeQuery(
      `UPDATE system_settings SET 
        setting_value = ?, 
        updated_by = ?, 
        updated_at = NOW() 
      WHERE setting_key = ?`,
      [stringValue, req.user.id, req.params.key],
    );

    // Log admin action
    await executeQuery(
      `INSERT INTO audit_logs (
        user_id, action, table_name, record_id, new_values, ip_address
      ) VALUES (?, 'update_setting', 'system_settings', ?, ?, ?)`,
      [
        req.user.id,
        req.params.key,
        JSON.stringify({ setting_key: req.params.key, value }),
        req.ip,
      ],
    );

    res.json({ message: "Setting updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Setting update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Audit logs
router.get("/audit", verifyAdminToken, async (req: any, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions = [];
    let queryParams: any[] = [];

    if (action) {
      whereConditions.push("action = ?");
      queryParams.push(action);
    }

    if (userId) {
      whereConditions.push("user_id = ?");
      queryParams.push(userId);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const logs = await executeQuery(
      `SELECT 
        al.*, u.username
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), offset],
    );

    res.json({ logs });
  } catch (error) {
    console.error("Audit logs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
