import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CasinoHeader from "@/components/CasinoHeader";
import {
  Settings,
  Users,
  User,
  Coins,
  TrendingUp,
  UserCheck,
  FileText,
  Shield,
  CreditCard,
  Gamepad2,
  Eye,
  Plus,
  Minus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  BarChart,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Upload,
  Ban,
  Mail,
  MessageSquare,
  Database,
  Server,
  Activity,
} from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [realTimeStats, setRealTimeStats] = useState({
    usersOnline: 1247,
    gamesPlaying: 423,
    totalProfit: 12567.89,
    chipsOut: 456789,
    chipsIn: 523890,
    rtpAverage: 94.2,
    totalUsers: 15642,
    newSignups: 127,
    withdrawalsPending: 8,
    kycPending: 23,
  });

  // Mock data - replace with real API calls
  const [pendingWithdrawals, setPendingWithdrawals] = useState([
    {
      id: "WD001",
      username: "Player123",
      amount: 150.0,
      method: "Bank Transfer",
      submitted: "2024-12-19 14:30",
      kycStatus: "verified",
      staffApproval: null,
      adminApproval: null,
      priority: "high",
    },
    {
      id: "WD002",
      username: "LuckyGamer",
      amount: 75.5,
      method: "Cash App",
      submitted: "2024-12-19 13:15",
      kycStatus: "verified",
      staffApproval: "approved",
      adminApproval: null,
      priority: "medium",
    },
    {
      id: "WD003",
      username: "BigWinner99",
      amount: 250.0,
      method: "PayPal",
      submitted: "2024-12-19 12:45",
      kycStatus: "verified",
      staffApproval: "approved",
      adminApproval: null,
      priority: "high",
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: "USR001",
      username: "Player123",
      email: "player123@example.com",
      level: 12,
      gcBalance: 25650,
      scBalance: 127.5,
      kycStatus: "verified",
      vipTier: "Gold",
      lastActive: "2024-12-19 15:30",
      totalDeposited: 149.97,
      totalWithdrawn: 75.0,
      registrationDate: "2024-01-15",
      status: "active",
      flags: [],
    },
    {
      id: "USR002",
      username: "LuckyGamer",
      email: "lucky@example.com",
      level: 8,
      gcBalance: 12340,
      scBalance: 89.2,
      kycStatus: "pending",
      vipTier: "Silver",
      lastActive: "2024-12-19 14:45",
      totalDeposited: 49.98,
      totalWithdrawn: 25.0,
      registrationDate: "2024-02-01",
      status: "active",
      flags: ["high_activity"],
    },
    {
      id: "USR003",
      username: "VIPPlayer",
      email: "vip@example.com",
      level: 25,
      gcBalance: 156000,
      scBalance: 450.75,
      kycStatus: "verified",
      vipTier: "Diamond",
      lastActive: "2024-12-19 15:45",
      totalDeposited: 2499.99,
      totalWithdrawn: 1200.0,
      registrationDate: "2023-12-01",
      status: "active",
      flags: ["vip", "high_roller"],
    },
  ]);

  const [storePackages, setStorePackages] = useState([
    {
      id: "GC001",
      name: "Starter Pack",
      goldCoins: 5000,
      price: 4.99,
      bonusSC: 5,
      popular: false,
      active: true,
      sales: 1247,
    },
    {
      id: "GC002",
      name: "Popular Pack",
      goldCoins: 15000,
      price: 9.99,
      bonusSC: 15,
      popular: true,
      active: true,
      sales: 3456,
    },
    {
      id: "GC003",
      name: "VIP Pack",
      goldCoins: 50000,
      price: 24.99,
      bonusSC: 50,
      popular: false,
      active: true,
      sales: 892,
    },
    {
      id: "GC004",
      name: "Mega Pack",
      goldCoins: 100000,
      price: 49.99,
      bonusSC: 100,
      popular: false,
      active: true,
      sales: 234,
    },
  ]);

  const [staffMembers, setStaffMembers] = useState([
    {
      id: "STF001",
      username: "staff_mike",
      email: "mike@coinkriazy.com",
      role: "Level 1 Staff",
      lastLogin: "2024-12-19 15:00",
      permissions: ["kyc_review", "live_chat", "mini_games"],
      active: true,
      salary: 18.5,
      hoursWorked: 32.5,
    },
    {
      id: "STF002",
      username: "admin_sarah",
      email: "sarah@coinkriazy.com",
      role: "Level 1 Admin",
      lastLogin: "2024-12-19 14:30",
      permissions: ["all_access"],
      active: true,
      salary: 25.0,
      hoursWorked: 40.0,
    },
  ]);

  const [gameSettings, setGameSettings] = useState({
    globalRTP: 94.2,
    slotsEnabled: true,
    miniGamesEnabled: true,
    bingoEnabled: true,
    sportsEnabled: true,
    maintenanceMode: false,
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.is_admin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      window.location.href = "/dashboard";
    }
  }, [user]);

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        ...prev,
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10) - 5,
        gamesPlaying: prev.gamesPlaying + Math.floor(Math.random() * 6) - 3,
        totalProfit: prev.totalProfit + Math.random() * 50,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleWithdrawalAction = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    try {
      const response = await fetch(`/api/admin/withdrawals/${id}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPendingWithdrawals((prev) =>
          prev.map((w) =>
            w.id === id
              ? {
                  ...w,
                  adminApproval: action === "approve" ? "approved" : "rejected",
                }
              : w,
          ),
        );
        toast({
          title: "Withdrawal Updated",
          description: `Withdrawal ${action === "approve" ? "approved" : "rejected"} successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update withdrawal.",
        variant: "destructive",
      });
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "User Updated",
          description: `User ${action} action completed successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const adjustUserBalance = async (
    userId: string,
    type: "GC" | "SC",
    amount: number,
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, amount }),
      });

      if (response.ok) {
        toast({
          title: "Balance Updated",
          description: `User balance adjusted by ${amount} ${type}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust balance.",
        variant: "destructive",
      });
    }
  };

  const updateGlobalRTP = async (newRTP: number) => {
    try {
      const response = await fetch("/api/admin/settings/rtp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rtp: newRTP }),
      });

      if (response.ok) {
        setGameSettings((prev) => ({ ...prev, globalRTP: newRTP }));
        toast({
          title: "RTP Updated",
          description: `Global RTP updated to ${newRTP}%.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RTP.",
        variant: "destructive",
      });
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need administrator privileges to access this panel.
            </p>
            <Button onClick={() => (window.location.href = "/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary" />
                🔧 Admin Control Panel
              </h1>
              <p className="text-muted-foreground">
                Full platform management and oversight • Logged in as:{" "}
                {user.username}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                🔴 LIVE ADMIN SESSION
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {realTimeStats.usersOnline.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">🟢 Users Online</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-accent">
                {realTimeStats.gamesPlaying}
              </p>
              <p className="text-sm text-muted-foreground">🎮 Playing Now</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-500">
                ${realTimeStats.totalProfit.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">💰 Profit Today</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {realTimeStats.chipsIn.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">📈 Chips In</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-accent">
                {realTimeStats.chipsOut.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">📉 Chips Out</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <BarChart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {realTimeStats.rtpAverage.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">🎯 Avg RTP</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full mb-6">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="withdrawals">💸 Withdrawals</TabsTrigger>
            <TabsTrigger value="store">🛒 Store</TabsTrigger>
            <TabsTrigger value="staff">👮 Staff</TabsTrigger>
            <TabsTrigger value="games">🎮 Games</TabsTrigger>
            <TabsTrigger value="system">⚙️ System</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-primary" />
                    Live Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Casino RTP</span>
                        <span className="text-sm font-bold">
                          {realTimeStats.rtpAverage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={realTimeStats.rtpAverage} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Slots Active</span>
                        <span className="text-sm font-bold">234 players</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Mini Games</span>
                        <span className="text-sm font-bold">89 players</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Bingo Rooms</span>
                        <span className="text-sm font-bold">67 players</span>
                      </div>
                      <Progress value={30} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                    Priority Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-destructive">
                          {realTimeStats.withdrawalsPending} Withdrawals Pending
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requires admin approval
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("withdrawals")}
                      >
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-yellow-600">
                          {realTimeStats.kycPending} KYC Documents
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Awaiting verification
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-accent">
                          System Performance
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All systems operational
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">✅ OK</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>New user registration</span>
                      <span className="text-muted-foreground">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Large withdrawal request</span>
                      <span className="text-muted-foreground">5m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Staff login: staff_mike</span>
                      <span className="text-muted-foreground">12m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RTP adjustment applied</span>
                      <span className="text-muted-foreground">15m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>System backup completed</span>
                      <span className="text-muted-foreground">1h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    User Management ({users.length.toLocaleString()} total)
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter(
                      (user) =>
                        user.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{user.username}</h3>
                              {user.flags.includes("vip") && (
                                <Badge className="bg-accent text-white">
                                  👑 VIP
                                </Badge>
                              )}
                              {user.flags.includes("high_roller") && (
                                <Badge className="bg-primary text-white">
                                  💎 High Roller
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                className={`text-xs ${
                                  user.kycStatus === "verified"
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }`}
                              >
                                {user.kycStatus === "verified" ? "✅" : "⏳"}{" "}
                                KYC
                              </Badge>
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {user.vipTier}
                              </Badge>
                              <Badge className="bg-secondary text-secondary-foreground text-xs">
                                Level {user.level}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {user.gcBalance.toLocaleString()} GC
                            </span>{" "}
                            |{" "}
                            <span className="font-semibold text-accent">
                              {user.scBalance} SC
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Deposited: ${user.totalDeposited} | Withdrawn: $
                            {user.totalWithdrawn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registered: {user.registrationDate}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, "view")}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Coins className="w-3 h-3 mr-1" />
                              Balance
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Ban className="w-3 h-3 mr-1" />
                              Ban
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary" />
                    Withdrawal Management ({pendingWithdrawals.length} pending)
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter by Status
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingWithdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            withdrawal.priority === "high"
                              ? "bg-red-500"
                              : withdrawal.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div>
                          <h3 className="font-semibold">
                            {withdrawal.username} - ${withdrawal.amount}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {withdrawal.method} • {withdrawal.submitted}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              className={`text-xs ${
                                withdrawal.kycStatus === "verified"
                                  ? "bg-green-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              KYC: {withdrawal.kycStatus}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                withdrawal.staffApproval === "approved"
                                  ? "bg-green-500 text-white"
                                  : withdrawal.staffApproval === "rejected"
                                    ? "bg-destructive text-white"
                                    : "bg-yellow-500 text-white"
                              }`}
                            >
                              Staff: {withdrawal.staffApproval || "pending"}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                withdrawal.adminApproval === "approved"
                                  ? "bg-green-500 text-white"
                                  : withdrawal.adminApproval === "rejected"
                                    ? "bg-destructive text-white"
                                    : "bg-yellow-500 text-white"
                              }`}
                            >
                              Admin: {withdrawal.adminApproval || "pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() =>
                            handleWithdrawalAction(withdrawal.id, "approve")
                          }
                          disabled={withdrawal.adminApproval !== null}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleWithdrawalAction(withdrawal.id, "reject")
                          }
                          disabled={withdrawal.adminApproval !== null}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-primary" />
                    Gold Coin Store Management
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {storePackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`casino-glow ${
                        pkg.popular ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <CardHeader className="text-center">
                        {pkg.popular && (
                          <Badge className="bg-primary text-primary-foreground mb-2">
                            ⭐ POPULAR
                          </Badge>
                        )}
                        <CardTitle className="text-xl text-primary">
                          {pkg.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          ${pkg.price}
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            💰 {pkg.goldCoins.toLocaleString()} Gold Coins
                          </p>
                          <p className="text-sm text-accent">
                            ✨ +{pkg.bonusSC} SC Bonus
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sales: {pkg.sales.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 mb-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={pkg.active ? "destructive" : "default"}
                            className="flex-1"
                          >
                            {pkg.active ? (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                        </div>
                        <Badge
                          className={`w-full ${pkg.active ? "bg-green-500" : "bg-gray-500"} text-white`}
                        >
                          {pkg.active ? "✅ Active" : "❌ Disabled"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-primary" />
                    Staff Management
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{staff.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            {staff.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={`text-xs ${
                                staff.role === "Level 1 Admin"
                                  ? "bg-destructive text-white"
                                  : "bg-accent text-white"
                              }`}
                            >
                              {staff.role}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                staff.active
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {staff.active ? "🟢 Active" : "🔴 Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last login: {staff.lastLogin}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          ${staff.salary}/hour
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Hours this week: {staff.hoursWorked}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3 mr-1" />
                            Permissions
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-primary" />
                    Game Control Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <h3 className="font-semibold mb-2">🎰 Slots</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge
                            className={
                              gameSettings.slotsEnabled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {gameSettings.slotsEnabled
                              ? "✅ Enabled"
                              : "❌ Disabled"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          variant="outline"
                        >
                          {gameSettings.slotsEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>

                      <div className="p-3 bg-secondary rounded-lg">
                        <h3 className="font-semibold mb-2">🎮 Mini Games</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge
                            className={
                              gameSettings.miniGamesEnabled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {gameSettings.miniGamesEnabled
                              ? "✅ Enabled"
                              : "❌ Disabled"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          variant="outline"
                        >
                          {gameSettings.miniGamesEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>

                      <div className="p-3 bg-secondary rounded-lg">
                        <h3 className="font-semibold mb-2">🏆 Bingo</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge
                            className={
                              gameSettings.bingoEnabled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {gameSettings.bingoEnabled
                              ? "✅ Enabled"
                              : "❌ Disabled"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          variant="outline"
                        >
                          {gameSettings.bingoEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>

                      <div className="p-3 bg-secondary rounded-lg">
                        <h3 className="font-semibold mb-2">⚽ Sports</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge
                            className={
                              gameSettings.sportsEnabled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {gameSettings.sportsEnabled
                              ? "✅ Enabled"
                              : "❌ Disabled"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          variant="outline"
                        >
                          {gameSettings.sportsEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">🔧 Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Activity className="w-3 h-3 mr-1" />
                          Restart Games
                        </Button>
                        <Button variant="outline" size="sm">
                          <Database className="w-3 h-3 mr-1" />
                          Clear Cache
                        </Button>
                        <Button variant="outline" size="sm">
                          <Server className="w-3 h-3 mr-1" />
                          Server Status
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            gameSettings.maintenanceMode
                              ? "bg-red-500 text-white"
                              : ""
                          }
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          {gameSettings.maintenanceMode ? "Exit" : "Enter"}{" "}
                          Maintenance
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-primary" />
                    RTP & Payout Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Global RTP Setting
                      </Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="number"
                          min="50"
                          max="99"
                          value={gameSettings.globalRTP}
                          onChange={(e) =>
                            setGameSettings((prev) => ({
                              ...prev,
                              globalRTP: parseFloat(e.target.value),
                            }))
                          }
                          className="w-20"
                        />
                        <span className="text-sm">%</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateGlobalRTP(gameSettings.globalRTP)
                          }
                        >
                          Apply
                        </Button>
                      </div>
                      <Progress
                        value={gameSettings.globalRTP}
                        className="mt-2"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium">
                        Individual Player RTP Adjustments
                      </Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-sm p-2 bg-secondary rounded">
                          <span>Player123</span>
                          <span className="font-mono">96.5%</span>
                          <Button size="sm" variant="outline">
                            Adjust
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-secondary rounded">
                          <span>LuckyGamer</span>
                          <span className="font-mono">92.1%</span>
                          <Button size="sm" variant="outline">
                            Adjust
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-secondary rounded">
                          <span>VIPPlayer</span>
                          <span className="font-mono">98.2%</span>
                          <Button size="sm" variant="outline">
                            Adjust
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">💰 Payout Reports</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Daily Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Weekly Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Monthly Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2 text-primary" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">Database</p>
                        <p className="text-sm text-muted-foreground">
                          MySQL 8.0
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        ✅ Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">Web Server</p>
                        <p className="text-sm text-muted-foreground">Node.js</p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        ✅ Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">Game Servers</p>
                        <p className="text-sm text-muted-foreground">
                          PragmaticPlay API
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        ✅ Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">Payment Gateway</p>
                        <p className="text-sm text-muted-foreground">
                          Stripe/PayPal
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        ✅ Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    System Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore Database
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      Clear All Caches
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Server className="w-4 h-4 mr-2" />
                      Restart Services
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant={
                        gameSettings.maintenanceMode ? "destructive" : "outline"
                      }
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {gameSettings.maintenanceMode
                        ? "Exit Maintenance Mode"
                        : "Enter Maintenance Mode"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
