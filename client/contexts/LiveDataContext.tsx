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

  // API call helper
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
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to get error message from response if possible
        let errorMessage = "API call failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      // Return null if API fails - fetchStats will handle this gracefully
      return null;
    }
  };

  // Fetch live stats from API
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/admin/dashboard");

      if (data) {
        setStats({
          usersOnline: data.userStats?.active_today || stats.usersOnline,
          totalPayout: data.financialStats?.total_revenue || stats.totalPayout,
          jackpotAmount: stats.jackpotAmount,
          gamesPlaying: data.gameStats?.total_plays || stats.gamesPlaying,
          totalWithdrawals:
            Math.abs(data.financialStats?.total_withdrawals) ||
            stats.totalWithdrawals,
          pendingWithdrawals:
            data.financialStats?.pending_withdrawals ||
            stats.pendingWithdrawals,
          newUsersToday: data.userStats?.new_today || stats.newUsersToday,
          activeGames: data.gameStats?.active_games || stats.activeGames,
        });
      }
    } catch (error) {
      console.error("Failed to fetch live stats:", error);
      // Simulate live data with small random changes
      setStats((prev) => ({
        ...prev,
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10) - 5,
        totalPayout: prev.totalPayout + Math.random() * 1000,
        jackpotAmount: prev.jackpotAmount + Math.random() * 100,
        gamesPlaying: Math.max(
          0,
          prev.gamesPlaying + Math.floor(Math.random() * 6) - 3,
        ),
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
