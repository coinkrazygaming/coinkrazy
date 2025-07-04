import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CasinoHeader from "@/components/CasinoHeader";
import {
  Trophy,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Trash2,
  Timer,
  Users,
  Target,
  Zap,
  Calendar,
} from "lucide-react";

export default function Sports() {
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [totalStake, setTotalStake] = useState(0);
  const [liveEventsCount, setLiveEventsCount] = useState(47);

  // Mock sports events data
  const sportsEvents = [
    {
      id: "nfl-chiefs-bills",
      sport: "NFL",
      emoji: "🏈",
      homeTeam: "Kansas City Chiefs",
      awayTeam: "Buffalo Bills",
      startTime: "2024-12-22 20:00",
      status: "upcoming",
      homeOdds: 1.85,
      awayOdds: 1.95,
      category: "featured",
      totalBets: 15420,
      description: "AFC Championship Game",
    },
    {
      id: "nba-lakers-warriors",
      sport: "NBA",
      emoji: "🏀",
      homeTeam: "Los Angeles Lakers",
      awayTeam: "Golden State Warriors",
      startTime: "2024-12-20 22:00",
      status: "live",
      homeOdds: 2.1,
      awayOdds: 1.75,
      category: "live",
      totalBets: 8930,
      liveScore: "Lakers 89 - Warriors 94",
      timeRemaining: "Q3 8:32",
    },
    {
      id: "soccer-real-barca",
      sport: "Soccer",
      emoji: "⚽",
      homeTeam: "Real Madrid",
      awayTeam: "FC Barcelona",
      startTime: "2024-12-21 21:00",
      status: "upcoming",
      homeOdds: 2.3,
      awayOdds: 2.8,
      category: "featured",
      totalBets: 25670,
      description: "El Clasico",
    },
    {
      id: "mma-jones-miocic",
      sport: "MMA",
      emoji: "🥊",
      homeTeam: "Jon Jones",
      awayTeam: "Stipe Miocic",
      startTime: "2024-12-23 22:00",
      status: "upcoming",
      homeOdds: 1.65,
      awayOdds: 2.25,
      category: "featured",
      totalBets: 12450,
      description: "Heavyweight Championship",
    },
    {
      id: "tennis-djokovic-nadal",
      sport: "Tennis",
      emoji: "🎾",
      homeTeam: "Novak Djokovic",
      awayTeam: "Rafael Nadal",
      startTime: "2024-12-20 15:00",
      status: "live",
      homeOdds: 1.9,
      awayOdds: 1.9,
      category: "live",
      totalBets: 7820,
      liveScore: "Djokovic 6-4, 3-2",
      timeRemaining: "Set 2",
    },
    {
      id: "hockey-rangers-bruins",
      sport: "NHL",
      emoji: "🏒",
      homeTeam: "New York Rangers",
      awayTeam: "Boston Bruins",
      startTime: "2024-12-21 19:00",
      status: "upcoming",
      homeOdds: 2.05,
      awayOdds: 1.8,
      category: "upcoming",
      totalBets: 4560,
      description: "Eastern Conference Rivalry",
    },
    {
      id: "baseball-yankees-redsox",
      sport: "MLB",
      emoji: "⚾",
      homeTeam: "New York Yankees",
      awayTeam: "Boston Red Sox",
      startTime: "2024-12-22 19:30",
      status: "upcoming",
      homeOdds: 1.75,
      awayOdds: 2.1,
      category: "upcoming",
      totalBets: 6780,
      description: "AL East Rivalry",
    },
    {
      id: "boxing-fury-usyk",
      sport: "Boxing",
      emoji: "🥊",
      homeTeam: "Tyson Fury",
      awayTeam: "Oleksandr Usyk",
      startTime: "2024-12-24 22:00",
      status: "upcoming",
      homeOdds: 2.4,
      awayOdds: 1.6,
      category: "featured",
      totalBets: 18920,
      description: "Undisputed Heavyweight Title",
    },
  ];

  const categories = [
    { id: "all", name: "All Sports", icon: "🏆" },
    { id: "live", name: "Live Now", icon: "🔴" },
    { id: "featured", name: "Featured", icon: "⭐" },
    { id: "upcoming", name: "Upcoming", icon: "📅" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setLiveEventsCount((prev) =>
        Math.max(30, prev + Math.floor(Math.random() * 6) - 3),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = sportsEvents.filter((event) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "live") return event.status === "live";
    if (selectedCategory === "featured") return event.category === "featured";
    if (selectedCategory === "upcoming") return event.status === "upcoming";
    return event.category === selectedCategory;
  });

  const addToBetSlip = (event: any, side: "home" | "away") => {
    const bet = {
      id: `${event.id}-${side}`,
      eventId: event.id,
      team: side === "home" ? event.homeTeam : event.awayTeam,
      opponent: side === "home" ? event.awayTeam : event.homeTeam,
      odds: side === "home" ? event.homeOdds : event.awayOdds,
      sport: event.sport,
      stake: 10,
    };

    setBetSlip((prev) => {
      const existing = prev.find((b) => b.id === bet.id);
      if (existing) return prev;
      return [...prev, bet];
    });
  };

  const removeFromBetSlip = (betId: string) => {
    setBetSlip((prev) => prev.filter((bet) => bet.id !== betId));
  };

  const updateBetStake = (betId: string, stake: number) => {
    setBetSlip((prev) =>
      prev.map((bet) => (bet.id === betId ? { ...bet, stake } : bet)),
    );
  };

  const getTotalOdds = () => {
    return betSlip.reduce((total, bet) => total * bet.odds, 1);
  };

  const getTotalStake = () => {
    return betSlip.reduce((total, bet) => total + bet.stake, 0);
  };

  const getPotentialWin = () => {
    return getTotalStake() * getTotalOdds();
  };

  const placeBets = () => {
    if (betSlip.length === 0) return;
    console.log("Placing bets:", betSlip);
    setBetSlip([]);
    alert("Bets placed successfully! 🎉");
  };

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Sports Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 mr-3 text-primary" />
            🏈 Sports Betting
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Live odds • Virtual events • Real excitement! 🎯
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-destructive text-white px-4 py-2 animate-pulse">
              <Timer className="w-4 h-4 mr-2" />
              🔴 {liveEventsCount} LIVE
            </Badge>
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              89,432 Bets Today
            </Badge>
            <Badge className="bg-accent text-accent-foreground px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Best Odds
            </Badge>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary casino-glow">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">$2.4M</div>
                  <div className="text-sm text-muted-foreground">
                    💰 Daily Payouts
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">
                    {liveEventsCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    🔴 Live Events
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">
                    🏆 Daily Events
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">98.2%</div>
                  <div className="text-sm text-muted-foreground">
                    📈 Best Odds
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sports Events */}
          <div className="lg:col-span-3">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4 w-full mb-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory}>
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="casino-glow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{event.emoji}</div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {event.homeTeam} vs {event.awayTeam}
                                </h3>
                                {event.status === "live" && (
                                  <Badge className="bg-destructive text-white animate-pulse">
                                    🔴 LIVE
                                  </Badge>
                                )}
                                {event.category === "featured" && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    ⭐ FEATURED
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {event.sport} • {event.description}
                              </p>
                              {event.status === "live" ? (
                                <div className="text-sm">
                                  <span className="font-bold text-primary">
                                    {event.liveScore}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    {event.timeRemaining}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {new Date(event.startTime).toLocaleString()}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                👥 {event.totalBets.toLocaleString()} bets
                                placed
                              </p>
                            </div>
                          </div>

                          {/* Betting Odds */}
                          <div className="flex space-x-2">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">
                                {event.homeTeam}
                              </p>
                              <Button
                                className="bg-primary hover:bg-primary/90 min-w-[80px]"
                                onClick={() => addToBetSlip(event, "home")}
                              >
                                {event.homeOdds.toFixed(2)}
                              </Button>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">
                                {event.awayTeam}
                              </p>
                              <Button
                                className="bg-accent hover:bg-accent/90 min-w-[80px]"
                                onClick={() => addToBetSlip(event, "away")}
                              >
                                {event.awayOdds.toFixed(2)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <Card className="casino-glow sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="w-5 h-5 mr-2" />
                  🎯 Bet Slip ({betSlip.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {betSlip.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-muted-foreground">
                      Click on odds to add bets to your slip!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {betSlip.map((bet) => (
                      <div key={bet.id} className="bg-secondary p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{bet.team}</p>
                            <p className="text-xs text-muted-foreground">
                              vs {bet.opponent} • {bet.sport}
                            </p>
                            <p className="text-xs font-bold text-primary">
                              Odds: {bet.odds.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromBetSlip(bet.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Stake (GC):
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={bet.stake}
                            onChange={(e) =>
                              updateBetStake(
                                bet.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Bet Summary */}
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Stake:</span>
                          <span className="font-bold">
                            {getTotalStake()} GC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Odds:</span>
                          <span className="font-bold">
                            {getTotalOdds().toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Potential Win:</span>
                          <span className="font-bold text-accent">
                            {getPotentialWin().toFixed(2)} GC
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 casino-pulse"
                      onClick={placeBets}
                      disabled={getTotalStake() === 0}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      🚀 Place Bets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sports Information */}
        <div className="mt-12">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-primary">
                <Star className="w-6 h-6 mr-2" />
                🏆 Sports Betting Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-semibold mb-2">Understanding Odds</h3>
                  <p className="text-sm text-muted-foreground">
                    Higher odds = Higher payout but lower chance of winning
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔴</div>
                  <h3 className="font-semibold mb-2">Live Betting</h3>
                  <p className="text-sm text-muted-foreground">
                    Bet on games in progress with constantly updating odds
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-semibold mb-2">Bet Slip</h3>
                  <p className="text-sm text-muted-foreground">
                    Add multiple bets for single or parlay betting
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-semibold mb-2">Payouts</h3>
                  <p className="text-sm text-muted-foreground">
                    Win Sweepstakes Cash based on your bet results!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Betting */}
        <div className="mt-8 text-center">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              🎯 Bet responsibly • 🔞 18+ Only • 🏆 Virtual events for
              entertainment • 💰 Set limits and have fun
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
