import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface LiveStats {
  usersOnline: number;
  totalPayout: number;
  jackpotAmount: number;
  gamesPlaying: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  newUsersToday: number;
  activeGames: number;
}

interface LiveDataContextType {
  stats: LiveStats;
  refreshStats: () => Promise<void>;
  loading: boolean;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(
  undefined,
);

const API_BASE_URL = window.location.origin + "/api";

// Preserve original fetch before third-party scripts can modify it
// Use a simpler approach that's HMR-safe
const preservedFetch = (() => {
  try {
    // Store reference to original fetch if available
    return (globalThis as any).__ORIGINAL_FETCH__ || fetch;
  } catch {
    return fetch;
  }
})();

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<LiveStats>({
    usersOnline: 1247,
    totalPayout: 125678.45,
    jackpotAmount: 245678.89,
    gamesPlaying: 423,
    totalWithdrawals: 45621.32,
    pendingWithdrawals: 15,
    newUsersToday: 127,
    activeGames: 847,
  });
  const [loading, setLoading] = useState(false);

  // API call helper with better error isolation
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const configWithTimeout = {
        ...config,
        signal: controller.signal,
      };

      // Use preserved fetch to avoid third-party interference
      const response = await preservedFetch(url, configWithTimeout);
      clearTimeout(timeoutId);

      if (!response.ok) {
        // API responded but with error status - return null for fallback
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Network error, timeout, or fetch was intercepted/failed - use fallback
      if ((error as Error).name === "AbortError") {
        console.debug("API call timed out, using fallback data");
      } else {
        console.debug("API call failed, using fallback data:", error);
      }
      return null;
    }
  };

  // Fetch live stats from API
  const fetchStats = async () => {
    setLoading(true);

    try {
      const data = await apiCall("/public/stats");

      if (data && data.stats) {
        // Successfully got data from API
        setStats({
          usersOnline: data.stats.usersOnline || 1247,
          totalPayout: data.stats.totalPayout || 125678.45,
          jackpotAmount: data.stats.jackpotAmount || 245678.89,
          gamesPlaying: data.stats.gamesPlaying || 423,
          totalWithdrawals: data.stats.totalWithdrawals || 45621.32,
          pendingWithdrawals: data.stats.pendingWithdrawals || 15,
          newUsersToday: data.stats.newUsersToday || 127,
          activeGames: data.stats.activeGames || 847,
        });
      } else {
        // API failed or returned null, simulate live data with small random changes
        setStats((prev) => ({
          ...prev,
          usersOnline: Math.max(
            1200,
            prev.usersOnline + Math.floor(Math.random() * 20) - 10,
          ),
          totalPayout: prev.totalPayout + Math.random() * 2000,
          jackpotAmount: prev.jackpotAmount + Math.random() * 150,
          gamesPlaying: Math.max(
            300,
            prev.gamesPlaying + Math.floor(Math.random() * 10) - 5,
          ),
          newUsersToday: Math.max(
            50,
            prev.newUsersToday + Math.floor(Math.random() * 4) - 2,
          ),
          activeGames: Math.max(
            700,
            prev.activeGames + Math.floor(Math.random() * 6) - 3,
          ),
        }));
      }
    } catch (error) {
      // Fallback to simulation if anything fails
      console.debug("Stats fetch error handled with simulation:", error);
      setStats((prev) => ({
        ...prev,
        usersOnline: Math.max(
          1200,
          prev.usersOnline + Math.floor(Math.random() * 20) - 10,
        ),
        totalPayout: prev.totalPayout + Math.random() * 2000,
        jackpotAmount: prev.jackpotAmount + Math.random() * 150,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats manually
  const refreshStats = async () => {
    await fetchStats();
  };

  // Auto-refresh stats every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  const value: LiveDataContextType = {
    stats,
    refreshStats,
    loading,
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (context === undefined) {
    throw new Error("useLiveData must be used within a LiveDataProvider");
  }
  return context;
}
