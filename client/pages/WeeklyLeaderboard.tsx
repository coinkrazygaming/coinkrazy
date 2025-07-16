import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CasinoHeader from "@/components/CasinoHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Coins,
  ArrowLeft,
  RefreshCw,
  Gift,
  Zap,
  Timer,
  Gamepad2,
} from "lucide-react";

interface LeaderboardEntry {
  rank_position: number;
  username: string;
  total_winnings: number;
  total_wagered: number;
  games_played: number;
  biggest_win: number;
  win_streak: number;
  points_earned: number;
  level: number;
  country: string;
  is_current_user: boolean;
}

interface Prize {
  rank_position: number;
  prize_type: string;
  prize_amount: number;
  is_claimed: boolean;
}

interface Achievement {
  achievement_type: string;
  achievement_name: string;
  description: string;
  earned_at: string;
}

interface WeekInfo {
  start: string;
  end: string;
  daysRemaining: number;
  isActive: boolean;
}

export default function WeeklyLeaderboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentUserStats, setCurrentUserStats] = useState<any>(null);
  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboardData = async () => {
    try {
      setRefreshing(true);

      // Fetch leaderboard
      const leaderboardRes = await fetch("/api/leaderboard/weekly", {
        headers: user
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {},
      });

      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData.leaderboard || []);
        setCurrentUserStats(leaderboardData.currentUserStats);
        setWeekInfo(leaderboardData.weekInfo);
      }

      // Fetch prizes
      const prizesRes = await fetch("/api/leaderboard/prizes");
      if (prizesRes.ok) {
        const prizesData = await prizesRes.json();
        setPrizes(prizesData.prizes || []);
      }

      // Fetch achievements if user is logged in
      if (user) {
        const achievementsRes = await fetch("/api/leaderboard/achievements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json();
          setAchievements(achievementsData.achievements || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
      toast({
        title: "Error loading leaderboard",
        description: "Failed to load leaderboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-amber-900";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPrizeIcon = (prizeType: string) => {
    return prizeType === "sweeps" ? "💎" : "���";
  };

  const formatCurrency = (amount: number, type: string = "currency") => {
    if (type === "sweeps") {
      return `${amount.toFixed(2)} SC`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "weekly_champion":
        return "👑";
      case "high_roller":
        return "💰";
      case "consistent_player":
        return "🎯";
      case "big_winner":
        return "🎊";
      default:
        return "🏆";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CasinoHeader />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading Weekly Leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-foreground flex items-center">
                  <Trophy className="w-10 h-10 mr-4 text-primary" />
                  🏆 Weekly Leaderboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Compete for amazing prizes every week! • Top performers win SC
                  and GC
                </p>
              </div>
            </div>
            <Button
              onClick={fetchLeaderboardData}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Week Info Card */}
          {weekInfo && (
            <Card className="casino-glow mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Week Period</p>
                    <p className="font-bold">
                      {new Date(weekInfo.start).toLocaleDateString()} -{" "}
                      {new Date(weekInfo.end).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <Timer className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <p className="text-sm text-muted-foreground">
                      Days Remaining
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {weekInfo.daysRemaining}
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">
                      Participants
                    </p>
                    <p className="text-2xl font-bold text-green-500">
                      {leaderboard.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <Gift className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-lg font-bold text-primary">
                      {prizes.reduce((sum, p) => sum + p.prize_amount, 0) > 1000
                        ? `$${Math.floor(prizes.reduce((sum, p) => sum + p.prize_amount, 0) / 1000)}K+`
                        : formatCurrency(
                            prizes.reduce((sum, p) => sum + p.prize_amount, 0),
                          )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current User Stats */}
        {user && currentUserStats && (
          <Card className="casino-glow mb-8 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Star className="w-5 h-5 mr-2" />
                Your Performance This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold text-primary">
                    #{currentUserStats.rank_position || "Unranked"}
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    Total Winnings
                  </p>
                  <p className="text-lg font-bold text-green-500">
                    {formatCurrency(currentUserStats.total_winnings)}
                  </p>
                </div>
                <div className="text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-lg font-bold text-accent">
                    {currentUserStats.games_played}
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-lg font-bold text-primary">
                    {currentUserStats.points_earned.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
            <TabsTrigger value="prizes">🎁 Prizes</TabsTrigger>
            <TabsTrigger value="achievements">🎖️ Achievements</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle>Top Performers This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border
                        ${
                          entry.is_current_user
                            ? "bg-primary/10 border-primary"
                            : "bg-card hover:bg-muted/50"
                        }
                        transition-colors
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(entry.rank_position)}
                          <Badge
                            className={getRankBadgeColor(entry.rank_position)}
                          >
                            #{entry.rank_position}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-lg">
                              {entry.username}
                              {entry.is_current_user && (
                                <span className="text-primary ml-2">(You)</span>
                              )}
                            </p>
                            <Badge variant="outline">Level {entry.level}</Badge>
                            <span className="text-2xl">
                              {entry.country === "US" ? "🇺🇸" : "🌍"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              💰 {formatCurrency(entry.total_winnings)}
                            </span>
                            <span>🎮 {entry.games_played} games</span>
                            <span>🎯 {entry.points_earned} pts</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col space-y-1">
                          <Badge className="bg-green-500 text-white">
                            🔥 {entry.win_streak} streak
                          </Badge>
                          <Badge variant="outline">
                            💎 {formatCurrency(entry.biggest_win)} biggest
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {leaderboard.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">
                        No leaderboard data yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Start playing games to appear on the leaderboard!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prizes Tab */}
          <TabsContent value="prizes">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle>Weekly Prize Pool</CardTitle>
                <p className="text-muted-foreground">
                  Finish in the top positions to win these amazing prizes!
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prizes.map((prize, index) => (
                    <Card
                      key={index}
                      className={`
                        ${prize.rank_position <= 3 ? "casino-pulse border-primary" : ""}
                        hover:scale-105 transition-transform
                      `}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="mb-3">
                          {getRankIcon(prize.rank_position)}
                        </div>
                        <Badge
                          className={getRankBadgeColor(prize.rank_position)}
                          variant="outline"
                        >
                          #{prize.rank_position} Place
                        </Badge>
                        <div className="my-4">
                          <div className="text-3xl mb-2">
                            {getPrizeIcon(prize.prize_type)}
                          </div>
                          <p className="text-xl font-bold text-primary">
                            {prize.prize_type === "sweeps"
                              ? `${prize.prize_amount} SC`
                              : `${prize.prize_amount.toLocaleString()} GC`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {prize.prize_type === "sweeps"
                              ? "Sweep Coins"
                              : "Gold Coins"}
                          </p>
                        </div>
                        {prize.is_claimed && (
                          <Badge className="bg-green-500 text-white">
                            ✓ Claimed
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle>Your Weekly Achievements</CardTitle>
                <p className="text-muted-foreground">
                  {user
                    ? "Special accomplishments you've earned this week"
                    : "Login to see your achievements"}
                </p>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-card rounded-lg border"
                      >
                        <div className="text-4xl">
                          {getAchievementIcon(achievement.achievement_type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-primary">
                            {achievement.achievement_name}
                          </h3>
                          <p className="text-muted-foreground">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned on{" "}
                            {new Date(
                              achievement.earned_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">
                          🎖️ Achievement
                        </Badge>
                      </div>
                    ))}

                    {achievements.length === 0 && (
                      <div className="text-center py-8">
                        <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">
                          No achievements yet this week
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Keep playing to unlock special achievements!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground mb-4">
                      Login to see your achievements
                    </p>
                    <Button asChild>
                      <Link to="/auth">Login / Register</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="casino-glow mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Climb the Leaderboard?
            </h3>
            <p className="text-muted-foreground mb-6">
              Play your favorite casino games and compete for amazing weekly
              prizes!
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg" className="casino-pulse">
                <Link to="/slots">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play Slots
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/mini-games">
                  <Target className="w-5 h-5 mr-2" />
                  Mini Games
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
