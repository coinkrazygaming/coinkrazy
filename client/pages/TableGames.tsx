import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CasinoHeader from "@/components/CasinoHeader";
import GameCard from "@/components/GameCard";
import {
  Users,
  Video,
  Star,
  Crown,
  Trophy,
  Zap,
  Play,
  Eye,
  Clock,
  TrendingUp,
  Coins,
} from "lucide-react";

export default function TableGames() {
  const [livePlayersCount, setLivePlayersCount] = useState(1247);
  const [liveDealersOnline, setLiveDealersOnline] = useState(24);

  // Mock table games data
  const tableGames = [
    {
      id: "blackjack-classic",
      title: "Blackjack Classic",
      provider: "Evolution Gaming",
      category: "blackjack",
      emoji: "🃏",
      dealerName: "Sarah",
      minBet: 1,
      maxBet: 500,
      players: 6,
      maxPlayers: 7,
      rtp: "99.4%",
      isLive: true,
      description: "Classic blackjack with professional dealers",
    },
    {
      id: "blackjack-vip",
      title: "VIP Blackjack",
      provider: "Evolution Gaming",
      category: "blackjack",
      emoji: "👑",
      dealerName: "Michael",
      minBet: 25,
      maxBet: 2500,
      players: 4,
      maxPlayers: 7,
      rtp: "99.5%",
      isLive: true,
      description: "High-stakes blackjack for VIP players",
    },
    {
      id: "european-roulette",
      title: "European Roulette",
      provider: "Evolution Gaming",
      category: "roulette",
      emoji: "🎡",
      dealerName: "Emma",
      minBet: 0.5,
      maxBet: 1000,
      players: 12,
      maxPlayers: 999,
      rtp: "97.3%",
      isLive: true,
      description: "Single zero roulette with best odds",
    },
    {
      id: "american-roulette",
      title: "American Roulette",
      provider: "Playtech",
      category: "roulette",
      emoji: "🇺🇸",
      dealerName: "James",
      minBet: 1,
      maxBet: 750,
      players: 8,
      maxPlayers: 999,
      rtp: "94.7%",
      isLive: true,
      description: "Double zero roulette with exciting action",
    },
    {
      id: "baccarat-classic",
      title: "Baccarat Classic",
      provider: "Evolution Gaming",
      category: "baccarat",
      emoji: "🎭",
      dealerName: "Isabella",
      minBet: 1,
      maxBet: 1000,
      players: 15,
      maxPlayers: 999,
      rtp: "98.9%",
      isLive: true,
      description: "Traditional punto banco baccarat",
    },
    {
      id: "baccarat-vip",
      title: "VIP Baccarat",
      provider: "Evolution Gaming",
      category: "baccarat",
      emoji: "💎",
      dealerName: "Victoria",
      minBet: 50,
      maxBet: 5000,
      players: 3,
      maxPlayers: 999,
      rtp: "99.1%",
      isLive: true,
      description: "High-limit baccarat with premium service",
    },
    {
      id: "texas-holdem-gc",
      title: "Texas Hold'em (Gold Coins)",
      provider: "PokerStars",
      category: "poker",
      emoji: "♠️",
      dealerName: "Alex",
      minBet: 2,
      maxBet: 200,
      players: 5,
      maxPlayers: 9,
      rtp: "98.2%",
      isLive: true,
      currencyType: "GC",
      description:
        "Tournament-style Texas Hold'em poker - Gold Coins only • CoinKrazy.com branded chips & cards",
    },
    {
      id: "texas-holdem-sc",
      title: "Texas Hold'em (Sweeps Coins)",
      provider: "PokerStars",
      category: "poker",
      emoji: "♠️",
      dealerName: "Morgan",
      minBet: 1,
      maxBet: 50,
      players: 3,
      maxPlayers: 9,
      rtp: "98.2%",
      isLive: true,
      currencyType: "SC",
      description: "Tournament-style Texas Hold'em poker - Sweeps Coins only",
    },
    {
      id: "three-card-poker-gc",
      title: "Three Card Poker (Gold Coins)",
      provider: "Evolution Gaming",
      category: "poker",
      emoji: "🎲",
      dealerName: "David",
      minBet: 1,
      maxBet: 300,
      players: 4,
      maxPlayers: 7,
      rtp: "97.8%",
      isLive: true,
      currencyType: "GC",
      description: "Fast-paced poker variant - Gold Coins only",
    },
    {
      id: "three-card-poker-sc",
      title: "Three Card Poker (Sweeps Coins)",
      provider: "Evolution Gaming",
      category: "poker",
      emoji: "🎲",
      dealerName: "Rachel",
      minBet: 0.5,
      maxBet: 75,
      players: 2,
      maxPlayers: 7,
      rtp: "97.8%",
      isLive: true,
      currencyType: "SC",
      description: "Fast-paced poker variant - Sweeps Coins only",
    },
    {
      id: "casino-holdem-gc",
      title: "Casino Hold'em (Gold Coins)",
      provider: "Evolution Gaming",
      category: "poker",
      emoji: "🃟",
      dealerName: "Lisa",
      minBet: 1,
      maxBet: 400,
      players: 6,
      maxPlayers: 999,
      rtp: "97.8%",
      isLive: true,
      currencyType: "GC",
      description: "Play Texas Hold'em against the house - Gold Coins only",
    },
    {
      id: "casino-holdem-sc",
      title: "Casino Hold'em (Sweeps Coins)",
      provider: "Evolution Gaming",
      category: "poker",
      emoji: "🃟",
      dealerName: "Sophie",
      minBet: 0.5,
      maxBet: 100,
      players: 4,
      maxPlayers: 999,
      rtp: "97.8%",
      isLive: true,
      currencyType: "SC",
      description: "Play Texas Hold'em against the house - Sweeps Coins only",
    },
    {
      id: "dragon-tiger",
      title: "Dragon Tiger",
      provider: "Evolution Gaming",
      category: "specialty",
      emoji: "🐉",
      dealerName: "Anna",
      minBet: 0.5,
      maxBet: 500,
      players: 22,
      maxPlayers: 999,
      rtp: "96.7%",
      isLive: true,
      description: "Simple and exciting Asian favorite",
    },
    {
      id: "sic-bo",
      title: "Sic Bo",
      provider: "Evolution Gaming",
      category: "specialty",
      emoji: "🎲",
      dealerName: "Chen",
      minBet: 1,
      maxBet: 1000,
      players: 9,
      maxPlayers: 999,
      rtp: "97.2%",
      isLive: true,
      description: "Ancient Chinese dice game",
    },
    {
      id: "craps",
      title: "Craps",
      provider: "Playtech",
      category: "specialty",
      emoji: "🎯",
      dealerName: "Tommy",
      minBet: 1,
      maxBet: 250,
      players: 7,
      maxPlayers: 16,
      rtp: "98.6%",
      isLive: true,
      description: "Classic American dice game",
    },
  ];

  const categories = [
    { id: "all", name: "All Tables", icon: "🎲" },
    { id: "blackjack", name: "Blackjack", icon: "🃏" },
    { id: "roulette", name: "Roulette", icon: "🎡" },
    { id: "baccarat", name: "Baccarat", icon: "🎭" },
    { id: "poker", name: "Poker", icon: "♠️" },
    { id: "specialty", name: "Specialty", icon: "🎯" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setLivePlayersCount((prev) => prev + Math.floor(Math.random() * 10) - 5);
      setLiveDealersOnline((prev) =>
        Math.max(20, prev + Math.floor(Math.random() * 6) - 3),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredGames = tableGames.filter(
    (game) => selectedCategory === "all" || game.category === selectedCategory,
  );

  const handleJoinTable = (gameId: string) => {
    console.log(`Joining table: ${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Table Games Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Crown className="w-10 h-10 mr-3 text-primary" />
            🎲 Live Table Games
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Professional dealers • Real-time action • Premium tables 🎯
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-destructive text-white px-4 py-2 animate-pulse">
              <Video className="w-4 h-4 mr-2" />
              🔴 LIVE NOW
            </Badge>
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {livePlayersCount} Playing
            </Badge>
            <Badge className="bg-accent text-accent-foreground px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              {liveDealersOnline} Dealers Online
            </Badge>
          </div>
        </div>

        {/* Live Stats Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary casino-glow">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    🕐 Always Open
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">
                    {liveDealersOnline}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    👩‍💼 Live Dealers
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {livePlayersCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    🎮 Active Players
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">99.4%</div>
                  <div className="text-sm text-muted-foreground">
                    📈 Best RTP
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.icon} {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            {/* Featured Tables */}
            {selectedCategory === "all" && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-primary" />
                  🏆 Featured Tables
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.slice(0, 3).map((game) => (
                    <Card
                      key={game.id}
                      className="casino-glow hover:scale-105 transition-all duration-300"
                    >
                      <CardHeader className="text-center">
                        <div className="text-5xl mb-2 animate-float">
                          {game.emoji}
                        </div>
                        <CardTitle className="text-xl text-primary">
                          {game.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {game.provider}
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                          <Badge className="bg-destructive text-white animate-pulse">
                            🔴 LIVE
                          </Badge>
                          <Badge className="bg-accent text-accent-foreground">
                            👩‍💼 {game.dealerName}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Players:</span>
                            <span className="font-bold">
                              {game.players}/{game.maxPlayers}
                            </span>
                          </div>
                          <Progress
                            value={(game.players / game.maxPlayers) * 100}
                            className="h-2"
                          />
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Min Bet:
                              </span>
                              <div className="font-bold">
                                {game.minBet} {game.currencyType || "GC"}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Max Bet:
                              </span>
                              <div className="font-bold">
                                {game.maxBet} {game.currencyType || "GC"}
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-sm text-muted-foreground">
                              RTP:{" "}
                            </span>
                            <span className="font-bold text-green-500">
                              {game.rtp}
                            </span>
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 casino-pulse"
                            onClick={() => handleJoinTable(game.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            🎯 Join Table
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Tables Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedCategory === "all"
                    ? `All Live Tables (${filteredGames.length})`
                    : `${categories.find((c) => c.id === selectedCategory)?.name} Tables (${filteredGames.length})`}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Sort by RTP
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Sort by Players
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <Card
                    key={game.id}
                    className="casino-glow hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{game.emoji}</div>
                        <div className="text-right">
                          <Badge className="bg-destructive text-white animate-pulse text-xs">
                            🔴 LIVE
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {game.provider}
                          </p>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-primary">
                        {game.title}
                      </CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Badge className="bg-accent text-accent-foreground text-xs">
                            👩‍💼 {game.dealerName}
                          </Badge>
                          {game.currencyType && (
                            <Badge
                              className={`text-xs ${
                                game.currencyType === "SC"
                                  ? "bg-green-500 text-white"
                                  : "bg-yellow-500 text-black"
                              }`}
                            >
                              {game.currencyType === "SC" ? "💎 SC" : "🪙 GC"}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-green-500 font-bold">
                          {game.rtp}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Players:
                          </span>
                          <span className="font-bold">
                            {game.players}/{game.maxPlayers}
                          </span>
                        </div>
                        <Progress
                          value={(game.players / game.maxPlayers) * 100}
                          className="h-1"
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Bet Range:
                          </span>
                          <span className="font-bold">
                            {game.minBet}-{game.maxBet}{" "}
                            {game.currencyType || "GC"}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => handleJoinTable(game.id)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Game Rules & Info */}
        <div className="mt-12">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-primary">
                <Star className="w-6 h-6 mr-2" />
                📚 How to Play Table Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🃏</div>
                  <h3 className="font-semibold mb-2">Blackjack</h3>
                  <p className="text-sm text-muted-foreground">
                    Get as close to 21 as possible without going over. Beat the
                    dealer's hand to win!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎡</div>
                  <h3 className="font-semibold mb-2">Roulette</h3>
                  <p className="text-sm text-muted-foreground">
                    Bet on where the ball will land. Red/Black, Odd/Even, or
                    specific numbers!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎭</div>
                  <h3 className="font-semibold mb-2">Baccarat</h3>
                  <p className="text-sm text-muted-foreground">
                    Bet on Player, Banker, or Tie. Closest to 9 wins in this
                    elegant game!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">♠️</div>
                  <h3 className="font-semibold mb-2">Poker</h3>
                  <p className="text-sm text-muted-foreground">
                    Various poker games available. Make the best hand to win
                    against others!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Dealers Showcase */}
        <div className="mt-8">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-accent">
                <Video className="w-6 h-6 mr-2" />
                👩‍💼 Professional Live Dealers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  🎯 Trained professionals • 🎪 Interactive gameplay • 💬 Live
                  chat • 🏆 Fair play guaranteed
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>24/7 Availability</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>HD Video Streams</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>Award-Winning Service</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Gaming */}
        <div className="mt-8 text-center">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              🎲 Play responsibly • 🔞 18+ Only • 🏆 Fair play certified • 💰
              Set limits and enjoy the game
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
