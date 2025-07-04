import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import CasinoHeader from "@/components/CasinoHeader";
import {
  Clock,
  Users,
  MessageCircle,
  Shield,
  UserCheck,
  FileText,
  Eye,
  Plus,
  Send,
  Pin,
  GameController2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Headphones,
} from "lucide-react";

export default function StaffPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStart] = useState(new Date("2024-12-19T08:00:00"));
  const [activeChatUsers, setActiveChatUsers] = useState([
    {
      id: "user1",
      username: "Player123",
      message: "Hi, I need help with my withdrawal",
      timestamp: "14:30",
      priority: "high",
    },
    {
      id: "user2",
      username: "LuckyGamer",
      message: "Can't access mini games",
      timestamp: "14:25",
      priority: "medium",
    },
  ]);

  // Mock data
  const onlineUsers = [
    {
      id: "USR001",
      username: "Player123",
      level: 12,
      gcBalance: 25650,
      scBalance: 127.5,
      currentGame: "Gold Rush Deluxe",
      location: "Slots",
      loginTime: "2024-12-19 13:30",
      kycStatus: "verified",
      notes: [],
    },
    {
      id: "USR002",
      username: "LuckyGamer",
      level: 8,
      gcBalance: 12340,
      scBalance: 89.2,
      currentGame: "Colin Shots",
      location: "Mini Games",
      loginTime: "2024-12-19 14:00",
      kycStatus: "pending",
      notes: [
        {
          text: "Player requested bonus help",
          author: "staff_mike",
          timestamp: "2024-12-19 13:45",
        },
      ],
    },
  ];

  const pendingKYC = [
    {
      id: "KYC001",
      username: "NewPlayer99",
      submittedDate: "2024-12-19 12:00",
      documents: ["ID", "Proof of Address"],
      status: "pending",
    },
    {
      id: "KYC002",
      username: "CasinoFan88",
      submittedDate: "2024-12-19 11:30",
      documents: ["ID", "Bank Statement"],
      status: "pending",
    },
  ];

  const bingoSessions = [
    {
      id: "BINGO001",
      roomName: "🌟 Golden Hall",
      players: 47,
      status: "active",
      currentNumber: "B-7",
      numbersDrawn: 23,
      jackpot: "125.50 SC",
    },
    {
      id: "BINGO002",
      roomName: "💎 Diamond Room",
      players: 32,
      status: "waiting",
      currentNumber: null,
      numbersDrawn: 0,
      jackpot: "89.75 SC",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatShiftTime = (start: Date, current: Date) => {
    const diff = current.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleChatSend = (userId: string, message: string) => {
    // Implementation for sending chat message
    console.log(`Sending message to ${userId}: ${message}`);
  };

  const addPlayerNote = (userId: string, note: string) => {
    // Implementation for adding player note
    console.log(`Adding note to ${userId}: ${note}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Staff Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Headphones className="w-8 h-8 mr-3 text-accent" />
                👮 Staff Control Panel
              </h1>
              <p className="text-muted-foreground">
                Level 1 Staff Access • CoinKrazy Support Team 🎧
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-accent text-accent-foreground mb-2">
                🟢 ON DUTY
              </Badge>
              <p className="text-sm text-muted-foreground">
                Shift Time: {formatShiftTime(shiftStart, currentTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {onlineUsers.length}
              </p>
              <p className="text-sm text-muted-foreground">🟢 Users Online</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-accent">
                {activeChatUsers.length}
              </p>
              <p className="text-sm text-muted-foreground">💬 Active Chats</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">
                {pendingKYC.length}
              </p>
              <p className="text-sm text-muted-foreground">📋 KYC Pending</p>
            </CardContent>
          </Card>
          <Card className="casino-glow">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-accent">
                {formatShiftTime(shiftStart, currentTime)}
              </p>
              <p className="text-sm text-muted-foreground">⏰ Shift Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="chat">💬 Live Chat</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="kyc">🛡️ KYC</TabsTrigger>
            <TabsTrigger value="bingo">🏆 Bingo</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                    Priority Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-destructive">
                          High Priority Chat
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Player123 - Withdrawal issue
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Respond
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-yellow-600">
                          KYC Review
                        </p>
                        <p className="text-sm text-muted-foreground">
                          2 documents awaiting review
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-accent">
                          Mini Game Issue
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Colin Shots needs restart
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Fix
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    Time Clock & Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {currentTime.toLocaleTimeString()}
                      </div>
                      <p className="text-muted-foreground">
                        Current Time • {currentTime.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Today's Shift</span>
                        <span className="font-bold">
                          {formatShiftTime(shiftStart, currentTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Hourly Rate</span>
                        <span className="font-bold text-primary">$18.50</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600">
                        Clock In
                      </Button>
                      <Button className="flex-1" variant="outline">
                        Break
                      </Button>
                      <Button className="flex-1 bg-destructive hover:bg-destructive/90">
                        Clock Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="chat">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="casino-glow lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-accent" />
                    Active Chats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeChatUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{user.username}</h3>
                          <Badge
                            className={`text-xs ${
                              user.priority === "high"
                                ? "bg-destructive text-white"
                                : user.priority === "medium"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-green-500 text-white"
                            }`}
                          >
                            {user.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="casino-glow lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-accent" />
                      Chat with Player123
                    </div>
                    <Badge className="bg-green-500 text-white">🟢 Online</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-64 bg-secondary p-4 rounded-lg overflow-y-auto">
                      <div className="space-y-3">
                        <div className="text-right">
                          <div className="inline-block bg-primary text-primary-foreground p-2 rounded-lg max-w-xs">
                            Hi! I'm staff_mike from CoinKrazy support. How can I
                            help you today? 😊
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            14:25
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="inline-block bg-accent text-accent-foreground p-2 rounded-lg max-w-xs">
                            Hi, I need help with my withdrawal. It's been
                            pending for 2 days
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            14:30
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quick Responses */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        Check KYC Status
                      </Button>
                      <Button size="sm" variant="outline">
                        Withdrawal Help
                      </Button>
                      <Button size="sm" variant="outline">
                        Bonus Questions
                      </Button>
                      <Button size="sm" variant="outline">
                        Technical Issues
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
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Online Users Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            Playing: {user.currentGame} ({user.location})
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
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Level {user.level}
                            </Badge>
                            {user.notes.length > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                📝 {user.notes.length} Notes
                              </Badge>
                            )}
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
                          Online since: {user.loginTime}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Pin className="w-3 h-3 mr-1" />
                            Note
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
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
                  KYC Document Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingKYC.map((kyc) => (
                    <div
                      key={kyc.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{kyc.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {kyc.submittedDate}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {kyc.documents.map((doc, index) => (
                            <Badge
                              key={index}
                              className="bg-accent text-accent-foreground text-xs"
                            >
                              📄 {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bingo Tab */}
          <TabsContent value="bingo">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Bingo Caller System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bingoSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {session.roomName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.players} players • Jackpot:{" "}
                            {session.jackpot}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            session.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {session.status === "active"
                            ? "🟢 LIVE"
                            : "⏳ WAITING"}
                        </Badge>
                      </div>

                      {session.status === "active" && (
                        <div className="bg-primary/10 p-4 rounded-lg mb-4">
                          <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-primary mb-2">
                              {session.currentNumber}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Numbers drawn: {session.numbersDrawn}/75
                            </p>
                          </div>
                          <Progress
                            value={(session.numbersDrawn / 75) * 100}
                            className="mb-4"
                          />
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {session.status === "waiting" ? (
                          <Button className="bg-green-500 hover:bg-green-600">
                            Start Game
                          </Button>
                        ) : (
                          <>
                            <Button>Call Next Number</Button>
                            <Button variant="outline">Pause Game</Button>
                          </>
                        )}
                        <Button variant="outline">View Players</Button>
                        <Button variant="outline">Settings</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
