import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CasinoHeader from "@/components/CasinoHeader";
import {
  User,
  Coins,
  History,
  FileText,
  Shield,
  Wallet,
  Trophy,
  Star,
  TrendingUp,
  Download,
  Upload,
  CreditCard,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data
  const user = {
    username: "Player123",
    email: "player123@example.com",
    level: 12,
    xp: 8750,
    xpToNext: 10000,
    joinDate: "2024-01-15",
    goldCoins: 25650,
    sweepstakes: 127.5,
    totalWagered: 156780,
    totalWon: 89450,
    gamesPlayed: 2547,
    kycStatus: "verified",
    vipTier: "Gold",
  };

  const transactionHistory = [
    {
      id: "TXN001",
      type: "deposit",
      amount: 5000,
      currency: "GC",
      method: "Google Pay",
      status: "completed",
      date: "2024-12-19 14:30",
      bonus: 500,
    },
    {
      id: "TXN002",
      type: "win",
      amount: 25.5,
      currency: "SC",
      method: "Slot Game",
      status: "completed",
      date: "2024-12-19 13:15",
    },
    {
      id: "TXN003",
      type: "withdraw",
      amount: 50.0,
      currency: "SC",
      method: "Bank Transfer",
      status: "pending",
      date: "2024-12-19 12:00",
    },
    {
      id: "TXN004",
      type: "mini_game",
      amount: 2.5,
      currency: "SC",
      method: "Josey's Quack Attack",
      status: "completed",
      date: "2024-12-19 11:30",
    },
  ];

  const gameHistory = [
    {
      game: "Gold Rush Deluxe",
      type: "Slot",
      played: "2024-12-19 14:45",
      wagered: 50,
      won: 125,
      profit: 75,
      duration: "15:30",
    },
    {
      game: "Colin Shots",
      type: "Mini Game",
      played: "2024-12-19 11:30",
      wagered: 0,
      won: 2.5,
      profit: 2.5,
      duration: "01:00",
    },
    {
      game: "Blackjack Classic",
      type: "Table Game",
      played: "2024-12-19 10:15",
      wagered: 25,
      won: 0,
      profit: -25,
      duration: "08:45",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <User className="w-8 h-8 mr-3 text-primary" />
                Player Dashboard 🎮
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.username}! 👋
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-primary text-primary-foreground mb-2">
                {user.vipTier} VIP 👑
              </Badge>
              <p className="text-sm text-muted-foreground">
                Level {user.level} • {user.xp.toLocaleString()} XP
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level Progress</span>
              <span className="text-sm text-muted-foreground">
                {user.xp} / {user.xpToNext} XP
              </span>
            </div>
            <Progress value={(user.xp / user.xpToNext) * 100} className="h-2" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {user.goldCoins.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Gold Coins</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-accent">
                {user.sweepstakes.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Sweepstakes Cash</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-500">
                ${user.totalWon.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Won</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {user.gamesPlayed.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Games Played</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6">
            <TabsTrigger value="profile">👤 Profile</TabsTrigger>
            <TabsTrigger value="transactions">💰 Transactions</TabsTrigger>
            <TabsTrigger value="games">🎮 Game History</TabsTrigger>
            <TabsTrigger value="kyc">🛡️ KYC</TabsTrigger>
            <TabsTrigger value="bonuses">🎁 Bonuses</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Member Since</Label>
                      <Input
                        id="joinDate"
                        value={new Date(user.joinDate).toLocaleDateString()}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-secondary p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">
                        Account Status 📊
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>KYC Status:</span>
                          <Badge className="bg-green-500 text-white">
                            ✅ Verified
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>VIP Tier:</span>
                          <Badge className="bg-primary text-primary-foreground">
                            👑 {user.vipTier}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Level:</span>
                          <span className="font-medium">{user.level}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Update Profile Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-primary" />
                    Transaction History
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {tx.type === "deposit" && (
                            <Upload className="w-5 h-5 text-primary" />
                          )}
                          {tx.type === "withdraw" && (
                            <Download className="w-5 h-5 text-accent" />
                          )}
                          {tx.type === "win" && (
                            <Trophy className="w-5 h-5 text-green-500" />
                          )}
                          {tx.type === "mini_game" && (
                            <Gift className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === "deposit" && "💰 Deposit"}
                            {tx.type === "withdraw" && "💸 Withdrawal"}
                            {tx.type === "win" && "🎉 Game Win"}
                            {tx.type === "mini_game" && "🎯 Mini Game Win"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.method} • {tx.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </p>
                        {tx.bonus && (
                          <p className="text-sm text-green-500">
                            +{tx.bonus} {tx.currency} bonus
                          </p>
                        )}
                        <div className="flex items-center justify-end mt-1">
                          {tx.status === "completed" ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Game History Tab */}
          <TabsContent value="games">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  Recent Game Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameHistory.map((game, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{game.game}</h3>
                        <p className="text-sm text-muted-foreground">
                          {game.type} • {game.played}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {game.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Wagered: {game.wagered} GC</p>
                        <p className="text-sm">
                          Won: {game.won}{" "}
                          {game.type === "Mini Game" ? "SC" : "GC"}
                        </p>
                        <p
                          className={`font-bold ${
                            game.profit > 0
                              ? "text-green-500"
                              : game.profit < 0
                                ? "text-destructive"
                                : "text-muted-foreground"
                          }`}
                        >
                          {game.profit > 0 ? "+" : ""}
                          {game.profit}{" "}
                          {game.type === "Mini Game" ? "SC" : "GC"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Know Your Customer (KYC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2 text-green-500">
                    ✅ KYC Verification Complete!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your identity has been verified. You can now withdraw
                    Sweepstakes Cash prizes! 🎉
                  </p>
                  <div className="bg-secondary p-4 rounded-lg inline-block">
                    <p className="text-sm">
                      <strong>Verified Documents:</strong>
                    </p>
                    <ul className="text-sm text-left mt-2 space-y-1">
                      <li>✅ Government ID</li>
                      <li>✅ Proof of Address</li>
                      <li>✅ Bank Account Information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bonuses Tab */}
          <TabsContent value="bonuses">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-primary" />
                  Active Bonuses & Promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-primary mb-2">
                      🎁 Daily Login Bonus
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You've logged in for 5 consecutive days!
                    </p>
                    <Button size="sm" className="w-full">
                      Claim Today's Bonus (500 GC)
                    </Button>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <h3 className="font-semibold text-accent mb-2">
                      ⚡ VIP Gold Benefits
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enjoy exclusive perks as a Gold VIP member!
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• 20% bonus on all deposits</li>
                      <li>• Priority customer support</li>
                      <li>• Exclusive VIP tournaments</li>
                    </ul>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-500 mb-2">
                      🏆 Weekly Challenge
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Play 50 games this week for extra rewards!
                    </p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>32/50 games</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    <p className="text-xs text-green-500">
                      Reward: 1,000 GC + 5 SC
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-600 mb-2">
                      🎯 Mini Game Master
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete all 5 mini games today!
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Josey's Quack Attack</span>
                        <span className="text-green-500">✅ Complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Colin Shots</span>
                        <span className="text-green-500">✅ Complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flickin' My Bean</span>
                        <span className="text-yellow-600">⏳ Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Haylie's Coins</span>
                        <span className="text-muted-foreground">🔒 Locked</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beth's Darts</span>
                        <span className="text-muted-foreground">🔒 Locked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
