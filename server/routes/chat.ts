import express from "express";
import { authenticateToken } from "../middleware/auth";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = express.Router();

// Get chat messages for a room
router.get("/messages/:room", authenticateToken, async (req, res) => {
  try {
    const { room } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const [messages] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        cm.*,
        u.username,
        u.level,
        u.is_admin,
        u.is_staff,
        CASE WHEN u.level >= 15 THEN true ELSE false END as is_vip
       FROM chat_messages cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.room = ?
       ORDER BY cm.created_at DESC
       LIMIT ? OFFSET ?`,
      [room, limit, offset],
    );

    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a chat message
router.post("/messages", authenticateToken, async (req, res) => {
  try {
    const { message, room } = req.body;
    const userId = req.user!.id;

    if (!message || !room) {
      return res.status(400).json({ error: "Message and room are required" });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: "Message too long" });
    }

    // Check if user is muted
    const [mutedCheck] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM chat_mutes WHERE user_id = ? AND expires_at > NOW()",
      [userId],
    );

    if (mutedCheck.length > 0) {
      return res.status(403).json({ error: "You are muted from chat" });
    }

    // Insert message
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO chat_messages (user_id, room, message, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [userId, room, message.trim()],
    );

    // Get the complete message with user data
    const [newMessage] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        cm.*,
        u.username,
        u.level,
        u.is_admin,
        u.is_staff,
        CASE WHEN u.level >= 15 THEN true ELSE false END as is_vip
       FROM chat_messages cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.id = ?`,
      [result.insertId],
    );

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get chat rooms
router.get("/rooms", authenticateToken, async (req, res) => {
  try {
    const rooms = [
      {
        id: "general",
        name: "🎰 General Chat",
        description: "General discussion for all players",
        user_count: 0,
        vip_only: false,
      },
      {
        id: "vip",
        name: "👑 VIP Lounge",
        description: "Exclusive chat for VIP members",
        user_count: 0,
        vip_only: true,
      },
      {
        id: "slots",
        name: "🎲 Slots Talk",
        description: "Discuss slot games and strategies",
        user_count: 0,
        vip_only: false,
        game_specific: "slots",
      },
      {
        id: "bingo",
        name: "🎯 Bingo Room",
        description: "Chat during bingo games",
        user_count: 0,
        vip_only: false,
        game_specific: "bingo",
      },
      {
        id: "mini-games",
        name: "🎮 Mini Games",
        description: "Mini game discussions and challenges",
        user_count: 0,
        vip_only: false,
        game_specific: "mini-games",
      },
    ];

    // Get active user counts for each room (simplified)
    for (const room of rooms) {
      const [count] = await pool.execute<RowDataPacket[]>(
        `SELECT COUNT(DISTINCT user_id) as count 
         FROM chat_messages 
         WHERE room = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
        [room.id],
      );
      room.user_count = count[0]?.count || 0;
    }

    res.json(rooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Mute a user (admin/staff only)
router.post("/mute", authenticateToken, async (req, res) => {
  try {
    const { user_id, duration_hours = 24 } = req.body;
    const adminId = req.user!.id;

    // Check if requesting user is admin or staff
    const [adminCheck] = await pool.execute<RowDataPacket[]>(
      "SELECT is_admin, is_staff FROM users WHERE id = ?",
      [adminId],
    );

    if (!adminCheck[0]?.is_admin && !adminCheck[0]?.is_staff) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Add mute record
    await pool.execute(
      `INSERT INTO chat_mutes (user_id, muted_by, expires_at, created_at) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR), NOW())
       ON DUPLICATE KEY UPDATE 
       expires_at = DATE_ADD(NOW(), INTERVAL ? HOUR),
       muted_by = ?`,
      [user_id, adminId, duration_hours, duration_hours, adminId],
    );

    res.json({ message: "User muted successfully" });
  } catch (error) {
    console.error("Error muting user:", error);
    res.status(500).json({ error: "Failed to mute user" });
  }
});

// Report a message
router.post("/report", authenticateToken, async (req, res) => {
  try {
    const { message_id, reason = "inappropriate" } = req.body;
    const reporterId = req.user!.id;

    // Insert report
    await pool.execute(
      `INSERT INTO chat_reports (message_id, reported_by, reason, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [message_id, reporterId, reason],
    );

    res.json({ message: "Message reported successfully" });
  } catch (error) {
    console.error("Error reporting message:", error);
    res.status(500).json({ error: "Failed to report message" });
  }
});

// Get user's mute status
router.get("/mute-status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    const [muteStatus] = await pool.execute<RowDataPacket[]>(
      `SELECT expires_at, reason 
       FROM chat_mutes 
       WHERE user_id = ? AND expires_at > NOW()`,
      [userId],
    );

    if (muteStatus.length > 0) {
      res.json({
        is_muted: true,
        expires_at: muteStatus[0].expires_at,
        reason: muteStatus[0].reason,
      });
    } else {
      res.json({ is_muted: false });
    }
  } catch (error) {
    console.error("Error checking mute status:", error);
    res.status(500).json({ error: "Failed to check mute status" });
  }
});

// Delete a message (admin/staff only)
router.delete("/messages/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user!.id;

    // Check if requesting user is admin or staff
    const [adminCheck] = await pool.execute<RowDataPacket[]>(
      "SELECT is_admin, is_staff FROM users WHERE id = ?",
      [adminId],
    );

    if (!adminCheck[0]?.is_admin && !adminCheck[0]?.is_staff) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    await pool.execute("DELETE FROM chat_messages WHERE id = ?", [id]);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
