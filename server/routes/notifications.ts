import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { executeQuery } from "../config/database.js";
import { z } from "zod";

const router = express.Router();

// Get user's notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const [notifications] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get recent notifications since a timestamp
router.get("/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const since = req.query.since as string;

    let query = `SELECT * FROM notifications WHERE user_id = ?`;
    let params: any[] = [userId];

    if (since) {
      query += ` AND created_at > ?`;
      params.push(since);
    }

    query += ` ORDER BY created_at DESC LIMIT 10`;

    const [notifications] = await pool.execute<RowDataPacket[]>(query, params);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    res.status(500).json({ error: "Failed to fetch recent notifications" });
  }
});

// Create a new notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      message,
      amount,
      currency,
      priority = "medium",
      action_url,
      icon,
    } = req.body;

    // Only admins can create notifications for other users
    if (user_id && user_id !== req.user!.id) {
      const [adminCheck] = await pool.execute<RowDataPacket[]>(
        "SELECT is_admin FROM users WHERE id = ?",
        [req.user!.id],
      );

      if (!adminCheck[0]?.is_admin) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
    }

    const targetUserId = user_id || req.user!.id;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO notifications
       (user_id, type, title, message, amount, currency, priority, action_url, icon, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        targetUserId,
        type,
        title,
        message,
        amount || null,
        currency || null,
        priority,
        action_url || null,
        icon || null,
      ],
    );

    // Get the created notification
    const [notification] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM notifications WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json(notification[0]);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// Mark notification as read
router.put("/:id/read", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.execute(
      "UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Mark all notifications as read
router.put("/mark-all-read", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    await pool.execute(
      "UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false",
      [userId],
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

// Delete a notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.execute(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// Clear all notifications
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    await pool.execute("DELETE FROM notifications WHERE user_id = ?", [userId]);

    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

// Get notification stats
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    const [stats] = await pool.execute<RowDataPacket[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN type = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN type = 'bonus' THEN 1 ELSE 0 END) as bonuses,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
       FROM notifications
       WHERE user_id = ?`,
      [userId],
    );

    res.json(stats[0]);
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(500).json({ error: "Failed to fetch notification stats" });
  }
});

// Auto-create notifications for game events
export const createGameNotification = async (
  userId: number,
  type: "win" | "bonus" | "achievement",
  title: string,
  message: string,
  amount?: number,
  currency?: string,
) => {
  try {
    await pool.execute(
      `INSERT INTO notifications
       (user_id, type, title, message, amount, currency, priority, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'high', NOW())`,
      [userId, type, title, message, amount || null, currency || null],
    );
  } catch (error) {
    console.error("Error creating game notification:", error);
  }
};

// Auto-create system notifications
export const createSystemNotification = async (
  userId: number | null, // null for all users
  title: string,
  message: string,
  priority: "low" | "medium" | "high" = "medium",
) => {
  try {
    if (userId) {
      // Send to specific user
      await pool.execute(
        `INSERT INTO notifications
         (user_id, type, title, message, priority, created_at)
         VALUES (?, 'system', ?, ?, ?, NOW())`,
        [userId, title, message, priority],
      );
    } else {
      // Send to all users (broadcast)
      const [users] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE is_active = true",
      );

      for (const user of users) {
        await pool.execute(
          `INSERT INTO notifications
           (user_id, type, title, message, priority, created_at)
           VALUES (?, 'system', ?, ?, ?, NOW())`,
          [user.id, title, message, priority],
        );
      }
    }
  } catch (error) {
    console.error("Error creating system notification:", error);
  }
};

export default router;
