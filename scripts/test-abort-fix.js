#!/usr/bin/env node

// Simple test to verify AbortError handling is working
async function testAbortErrorHandling() {
  console.log("🔄 Testing AbortError handling...");

  try {
    // Simulate an AbortController scenario
    const controller = new AbortController();

    // Abort immediately
    controller.abort();

    // Try to fetch with an already aborted signal
    try {
      await fetch("http://localhost:8082/api/public/stats", {
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("✅ AbortError caught and handled properly");
      } else {
        console.log("❌ Unexpected error:", error.message);
      }
    }

    // Test timeout scenario
    const timeoutController = new AbortController();
    setTimeout(() => timeoutController.abort(), 100);

    try {
      await fetch("http://localhost:8082/api/public/stats", {
        signal: timeoutController.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("✅ Timeout AbortError caught and handled properly");
      }
    }

    console.log("🎉 AbortError handling test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testAbortErrorHandling();
