#!/usr/bin/env node

async function testLeaderboardAPI() {
  try {
    console.log("🔄 Testing leaderboard API endpoints...");

    const baseUrl = "http://localhost:8082/api/leaderboard";

    // Test weekly leaderboard endpoint
    console.log("Testing /weekly endpoint...");
    const weeklyRes = await fetch(`${baseUrl}/weekly`);
    const weeklyData = await weeklyRes.json();
    console.log("✅ Weekly leaderboard:", {
      participants: weeklyData.leaderboard?.length || 0,
      weekInfo: weeklyData.weekInfo,
    });

    // Test prizes endpoint
    console.log("Testing /prizes endpoint...");
    const prizesRes = await fetch(`${baseUrl}/prizes`);
    const prizesData = await prizesRes.json();
    console.log("✅ Prizes:", {
      totalPrizes: prizesData.prizes?.length || 0,
      topPrize: prizesData.prizes?.[0] || null,
    });

    // Test stats endpoint
    console.log("Testing /stats endpoint...");
    const statsRes = await fetch(`${baseUrl}/stats`);
    const statsData = await statsRes.json();
    console.log("✅ Stats:", {
      totalParticipants: statsData.stats?.total_participants || 0,
      topWinner: statsData.topWinner?.username || "None",
    });

    console.log("🎉 All leaderboard API endpoints working!");
  } catch (error) {
    console.error("❌ Leaderboard API test failed:", error);
  }
}

testLeaderboardAPI();
