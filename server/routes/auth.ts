import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { executeQuery } from "../config/database.js";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string(),
  country: z.string().min(1).max(100),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "coinkriazy_jwt_secret_2024";

// Helper function to generate JWT
function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
      isStaff: user.is_staff,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await executeQuery(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [validatedData.email, validatedData.username],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Insert new user with welcome bonus
    const result = await executeQuery(
      `INSERT INTO users (
        username, email, password_hash, first_name, last_name, 
        date_of_birth, country, state, zip_code, phone,
        gold_coins, sweeps_coins, registration_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10000.00, 10.00, ?)`,
      [
        validatedData.username,
        validatedData.email,
        hashedPassword,
        validatedData.firstName,
        validatedData.lastName,
        validatedData.dateOfBirth,
        validatedData.country,
        validatedData.state || null,
        validatedData.zipCode || null,
        validatedData.phone || null,
        req.ip,
      ],
    );

    // Get the created user
    const user = await executeQuery(
      "SELECT id, username, email, first_name, last_name, gold_coins, sweeps_coins, level, is_admin, is_staff FROM users WHERE id = ?",
      [result.insertId],
    );

    // Create welcome bonus transaction
    await executeQuery(
      `INSERT INTO transactions (
        user_id, transaction_type, coin_type, amount, 
        previous_balance, new_balance, description, status
      ) VALUES 
      (?, 'bonus', 'gold', 10000.00, 0.00, 10000.00, 'Welcome Bonus - Gold Coins', 'completed'),
      (?, 'bonus', 'sweeps', 10.00, 0.00, 10.00, 'Welcome Bonus - Sweeps Coins', 'completed')`,
      [result.insertId, result.insertId],
    );

    const token = generateToken(user[0]);

    res.status(201).json({
      message: "Registration successful",
      user: user[0],
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const users = await executeQuery(
      "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    await executeQuery("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    // Generate token
    const token = generateToken(user);

    // Return user data (excluding password)
    const { password_hash, ...userData } = user;

    res.json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify token endpoint
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const users = await executeQuery(
      "SELECT id, username, email, first_name, last_name, gold_coins, sweeps_coins, level, experience_points, kyc_status, is_admin, is_staff FROM users WHERE id = ? AND is_active = TRUE",
      [decoded.id],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout endpoint (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

export default router;
