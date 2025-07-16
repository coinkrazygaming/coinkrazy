# 🚀 Neon Database Integration Guide

Your CoinKrazy casino is now ready to connect to **Neon PostgreSQL**! This guide will walk you through the complete setup process.

## 🎯 What is Neon?

Neon is a serverless PostgreSQL database that offers:

- **Instant scaling** from zero to high performance
- **Automatic backups** and point-in-time recovery
- **Branch-based development** like Git for databases
- **Global edge deployment** for low latency
- **Generous free tier** perfect for development

## 📋 Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Database Created**: Create a new database project in Neon
3. **Connection String**: Get your PostgreSQL connection string

## 🔧 Step-by-Step Setup

### Step 1: Get Your Neon Connection String

1. Go to your [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **"Connection Details"**
4. Copy the **PostgreSQL connection string**

It should look like:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/coinkriazy_casino?sslmode=require
```

### Step 2: Update Environment Variables

Edit your `.env` file and add:

```bash
# Switch to Neon database
DB_TYPE=neon

# Add your Neon connection string
NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/coinkriazy_casino?sslmode=require
```

### Step 3: Set Up Database Schema

Run the database setup script:

```bash
node scripts/setup-neon-database.js
```

This will:

- ✅ Create all required tables
- ✅ Set up indexes and triggers
- ✅ Add sample data and user accounts
- ✅ Configure the leaderboard system

### Step 4: Test Connection

Verify everything works:

```bash
node scripts/test-neon-connection.js
```

### Step 5: Restart Your Application

```bash
npm run dev
```

## 🎮 What's Included

### **Complete Database Schema**

- **Users**: Account management with roles and balances
- **Games**: Casino game catalog with metadata
- **Transactions**: Financial tracking and history
- **Leaderboard**: Weekly competition system
- **Chat**: Live messaging system
- **Notifications**: User notification system

### **Sample Data**

- **3 User accounts** (Admin, Staff, Demo player)
- **6 Sample games** with realistic data
- **Leaderboard entries** for current week
- **Transaction history** and welcome bonuses

### **User Accounts Created**

| Role  | Email                 | Password  | Gold Coins | Sweep Coins |
| ----- | --------------------- | --------- | ---------- | ----------- |
| Admin | coinkrazy00@gmail.com | Woot6969! | 100,000    | 100         |
| Staff | staff@coinkriazy.com  | Woot6969! | 50,000     | 50          |
| Demo  | demo1@coinkriazy.com  | Woot6969! | 25,000     | 25          |

## 🔍 Verification Checklist

After setup, verify these features work:

- [ ] **Login** with admin credentials
- [ ] **Dashboard** shows correct balances
- [ ] **Leaderboard** displays weekly rankings
- [ ] **Games** load from database
- [ ] **Chat** messages save to database
- [ ] **Transactions** create properly

## 🚀 Production Deployment

### **Environment Variables for Production**

```bash
# Production settings
NODE_ENV=production
DB_TYPE=neon
NEON_DATABASE_URL=postgresql://your_prod_connection_string

# Security
JWT_SECRET=your_production_jwt_secret_here

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### **Neon Production Tips**

1. **Use Connection Pooling**: Already configured in the code
2. **Enable SSL**: Required for production (automatically enabled)
3. **Monitor Performance**: Use Neon's dashboard
4. **Set up Backups**: Configure automatic backups in Neon
5. **Branch for Testing**: Use Neon's branching for staging

## 🛠️ Troubleshooting

### **Connection Issues**

```bash
# Test your connection string
node scripts/test-neon-connection.js
```

**Common Problems:**

- ❌ **Invalid connection string**: Check format and credentials
- ❌ **SSL errors**: Ensure `?sslmode=require` is in the URL
- ❌ **Network timeouts**: Check firewall/network settings
- ❌ **Database not found**: Verify database name in Neon console

### **Schema Issues**

```bash
# Recreate schema if needed
node scripts/setup-neon-database.js
```

### **Environment Variable Issues**

```bash
# Check current database type
echo $DB_TYPE

# Verify environment is loaded
node -e "console.log(process.env.DB_TYPE, process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET')"
```

## 📊 Database Management

### **Viewing Data**

Connect to your Neon database using:

- **Neon Console**: Built-in SQL editor
- **pgAdmin**: PostgreSQL administration tool
- **TablePlus**: Modern database client
- **DBeaver**: Universal database tool

### **Backup Strategy**

Neon automatically handles:

- **Daily backups** with 7-day retention (free tier)
- **Point-in-time recovery** up to 1 day (free tier)
- **Branch-based backups** for development

### **Monitoring**

Monitor your database through:

- **Neon Console**: Built-in metrics and logs
- **Application logs**: Server console output
- **Performance metrics**: Connection pooling stats

## 🔄 Migration from SQLite

If you're migrating from SQLite, the setup script handles this automatically. Your existing data structure will be recreated in PostgreSQL format with:

- **Improved performance** for concurrent users
- **Better data types** (JSONB, proper timestamps)
- **Advanced indexing** for faster queries
- **Scalability** for production loads

## 🎉 You're Ready!

Once setup is complete, your CoinKrazy casino will be running on:

- ✅ **Neon PostgreSQL** for production-grade performance
- ✅ **Automatic scaling** based on usage
- ✅ **Global availability** with edge deployment
- ✅ **Enterprise-grade** security and backups

**Your casino is now powered by Neon!** 🎰✨

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check the logs**: Look for error messages in console
2. **Verify credentials**: Ensure your connection string is correct
3. **Test connection**: Run the test script to diagnose issues
4. **Check Neon status**: Visit [Neon Status Page](https://neonstatus.com)
5. **Review documentation**: [Neon Docs](https://neon.tech/docs)

**Happy gaming!** 🎲
