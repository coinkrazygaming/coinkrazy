import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "win" | "bonus" | "system" | "chat" | "achievement" | "warning";
  title: string;
  message: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  action_url?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  toggleNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const lastNotificationCheck = useRef<Date>(new Date());

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !token) return;

    const connectWebSocket = () => {
      try {
        const wsUrl = `ws://localhost:3001/notifications?token=${token}`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log("Notifications WebSocket connected");
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "notification") {
              const notification: Notification = {
                ...data.notification,
                id: data.notification.id || Date.now().toString(),
                timestamp:
                  data.notification.timestamp || new Date().toISOString(),
                read: false,
              };

              addNotification(notification);

              // Show toast for high priority notifications
              if (notification.priority === "high") {
                toast({
                  title: notification.title,
                  description: notification.message,
                  duration: 5000,
                });
              }
            }
          } catch (error) {
            console.error("Error parsing notification:", error);
          }
        };

        wsRef.current.onclose = () => {
          console.log(
            "Notifications WebSocket disconnected, using HTTP polling fallback",
          );
          // Don't attempt to reconnect, just use HTTP polling
        };

        wsRef.current.onerror = (error) => {
          console.log(
            "Notifications WebSocket unavailable, using HTTP polling fallback",
          );
        };
      } catch (error) {
        console.error("Failed to connect to notifications:", error);
        // Fallback to polling
        setupPolling();
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, token]);

  // Fallback polling mechanism
  const setupPolling = () => {
    const pollInterval = setInterval(async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(
          `/api/notifications/recent?since=${lastNotificationCheck.current.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const newNotifications = await response.json();
          if (newNotifications.length > 0) {
            setNotifications((prev) => [
              ...newNotifications.reverse(),
              ...prev,
            ]);
            lastNotificationCheck.current = new Date();
          }
        }
      } catch (error) {
        console.error("Failed to poll notifications:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  };

  // Load initial notifications
  useEffect(() => {
    if (!user || !token) return;

    const loadNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, [user, token]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const addNotification = (
    notificationData:
      | Omit<Notification, "id" | "timestamp" | "read">
      | Notification,
  ) => {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 49)]); // Keep max 50 notifications
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const clearAll = async () => {
    setNotifications([]);

    try {
      await fetch("/api/notifications/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  // Auto-generate sample notifications for demo
  useEffect(() => {
    if (!user) return;

    const generateSampleNotifications = () => {
      const samples: Omit<Notification, "id" | "timestamp" | "read">[] = [
        {
          type: "win",
          title: "🎉 Big Win!",
          message: "You won 250 GC playing Gold Rush Deluxe!",
          amount: 250,
          currency: "GC",
          priority: "high",
          icon: "🎰",
        },
        {
          type: "bonus",
          title: "🎁 Daily Bonus Ready",
          message: "Your daily login bonus is waiting for you!",
          priority: "medium",
          action_url: "/dashboard",
          icon: "🎁",
        },
        {
          type: "achievement",
          title: "🏆 Level Up!",
          message: "Congratulations! You've reached level 13!",
          priority: "medium",
          icon: "🏆",
        },
        {
          type: "system",
          title: "🔄 Maintenance Notice",
          message: "Scheduled maintenance tonight from 2-4 AM EST.",
          priority: "low",
          icon: "⚙️",
        },
      ];

      // Add one sample notification every 30 seconds (for demo)
      let index = 0;
      const interval = setInterval(() => {
        if (index < samples.length) {
          addNotification(samples[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30000);

      return () => clearInterval(interval);
    };

    // Only add samples if no notifications exist
    if (notifications.length === 0) {
      setTimeout(generateSampleNotifications, 2000);
    }
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isOpen,
    toggleNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
