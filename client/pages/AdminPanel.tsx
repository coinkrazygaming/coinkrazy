import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [realTimeStats, setRealTimeStats] = useState({
    usersOnline: 1247,
    gamesPlaying: 423,
    totalProfit: 12567.89,
    chipsOut: 456789,
    chipsIn: 523890,
    rtpAverage: 94.2,
  });

  // Mock data
  const pendingWithdrawals = [
    {
      id: "WD001",
      username: "Player123",
      amount: 150.0,
      method: "Bank Transfer",
      submitted: "2024-12-19 14:30",
      kycStatus: "verified",
      staffApproval: null,
      adminApproval: null,
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
    },
  ];

  const goldCoinPackages = [
    {
      id: "GC001",
      name: "Starter Pack",
      goldCoins: 5000,
      price: 4.99,
      bonusSC: 5,
      popular: false,
    },
    {
      id: "GC002",
      name: "Popular Pack",
      goldCoins: 15000,
      price: 9.99,
      bonusSC: 15,
      popular: true,
    },
    {
      id: "GC003",
      name: "VIP Pack",
      goldCoins: 50000,
      price: 24.99,
      bonusSC: 50,
      popular: false,
    },
  ];

  const recentUsers = [
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
    },
  ];

  const staffMembers = [
    {
      id: "STF001",
      username: "staff_mike",
      email: "mike@coinkrazy.com",
      role: "Level 1 Staff",
      lastLogin: "2024-12-19 15:00",
      permissions: ["kyc_review", "live_chat", "mini_games"],
      active: true,
    },
    {
      id: "STF002",
      username: "admin_sarah",
      email: "sarah@coinkrazy.com",
      role: "Level 1 Admin",
      lastLogin: "2024-12-19 14:30",
      permissions: ["all_access"],
      active: true,
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        ...prev,
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10) - 5,
        gamesPlaying: prev.gamesPlaying + Math.floor(Math.random() * 6) - 3,
        totalProfit: prev.totalProfit + Math.random() * 50,
        chipsOut: prev.chipsOut + Math.floor(Math.random() * 1000),
        chipsIn: prev.chipsIn + Math.floor(Math.random() * 1200),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
                Full platform management and oversight 👨‍💻
              </p>
            </div>
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              🔴 LIVE ADMIN SESSION
            </Badge>
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {realTimeStats.usersOnline}
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
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="withdrawals">💸 Withdrawals</TabsTrigger>
            <TabsTrigger value="store">🛒 Gold Store</TabsTrigger>
            <TabsTrigger value="staff">👮 Staff</TabsTrigger>
            <TabsTrigger value="games">🎮 Games</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid lg:grid-cols-2 gap-6">
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
                        <span className="text-sm">Sports Betting</span>
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
                    Alerts & Actions Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-destructive">
                          2 Withdrawals Pending
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requires admin approval
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-yellow-600">
                          5 KYC Documents
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
                          RTP Adjustment Request
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Staff requesting 52% RTP
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
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
                    User Management
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.username}</h3>
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
                              {user.kycStatus === "verified" ? "✅" : "⏳"} KYC
                            </Badge>
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {user.vipTier}
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
                            <Coins className="w-3 h-3 mr-1" />
                            Adjust
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
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Withdrawal Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingWithdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
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
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gold Coin Store Tab */}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goldCoinPackages.map((pkg) => (
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
                        </div>
                        <div className="flex space-x-2">
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
                            variant="destructive"
                            className="flex-1"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
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
                    Add Staff
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
                      <div className="flex space-x-2">
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
                    Mini Games Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Josey's Quack Attack",
                      "Colin Shots",
                      "Flickin' My Bean",
                      "Haylie's Coins",
                      "Beth's Darts",
                    ].map((game, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{game}</h3>
                          <p className="text-sm text-muted-foreground">
                            Players today: {Math.floor(Math.random() * 50) + 10}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Enable
                          </Button>
                          <Button size="sm" variant="outline">
                            Disable
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-primary" />
                    RTP Controls
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
                          defaultValue="94.2"
                          className="w-20"
                        />
                        <span className="text-sm">%</span>
                        <Button size="sm">Apply</Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Individual Player RTP
                      </Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Player123</span>
                          <span>96.5%</span>
                          <Button size="sm" variant="outline">
                            Adjust
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>LuckyGamer</span>
                          <span>92.1%</span>
                          <Button size="sm" variant="outline">
                            Adjust
                          </Button>
                        </div>
                      </div>
                    </div>
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
