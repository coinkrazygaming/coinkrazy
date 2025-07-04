import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CasinoHeader from "@/components/CasinoHeader";
import GameCard from "@/components/GameCard";
import {
  Gift,
  TrendingUp,
  Users,
  Zap,
  Star,
  Crown,
  Gamepad2,
  Trophy,
  Timer,
} from "lucide-react";

export default function Index() {
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [todaysPayout, setTodaysPayout] = useState(125678.45);

  // Mock data for games
  const miniGames = [
    {
      title: "Josey's Quack Attack",
      emoji: "🦆",
      category: "Mini Game",
      cooldown: "18:24:15",
      provider: "CoinKrazy",
    },
    {
      title: "Colin Shots",
      emoji: "🏀",
      category: "Mini Game",
      cooldown: null,
      provider: "CoinKrazy",
    },
    {
      title: "Flickin' My Bean",
      emoji: "🎯",
      category: "Mini Game",
      cooldown: "12:45:30",
      provider: "CoinKrazy",
    },
    {
      title: "Haylie's Coins",
      emoji: "🪙",
      category: "Mini Game",
      cooldown: null,
      provider: "CoinKrazy",
    },
    {
      title: "Beth's Darts",
      emoji: "🎪",
      category: "Mini Game",
      cooldown: "23:15:42",
      provider: "CoinKrazy",
    },
  ];

  const slotGames = [
    {
      title: "Gold Rush Deluxe",
      emoji: "💰",
      category: "Slots",
      isPopular: true,
      jackpot: "$12,456",
      provider: "Pragmatic Play",
      image:
        "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Diamond Dreams",
      emoji: "💎",
      category: "Slots",
      isNew: true,
      provider: "NetEnt",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Lucky 777",
      emoji: "🍀",
      category: "Slots",
      isPopular: true,
      provider: "Play'n GO",
      image:
        "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Wild Safari",
      emoji: "🦁",
      category: "Slots",
      provider: "Microgaming",
      image:
        "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Ocean Treasure",
      emoji: "🌊",
      category: "Slots",
      jackpot: "$8,923",
      provider: "Pragmatic Play",
      image:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Space Adventure",
      emoji: "🚀",
      category: "Slots",
      isNew: true,
      provider: "NetEnt",
      image:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center",
    },
  ];

  const tableGames = [
    {
      title: "Blackjack Classic",
      emoji: "🃏",
      category: "Table Game",
      isPopular: true,
      provider: "Evolution",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "European Roulette",
      emoji: "🎡",
      category: "Table Game",
      provider: "Evolution",
      image:
        "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Baccarat Deluxe",
      emoji: "🎭",
      category: "Table Game",
      provider: "Playtech",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center",
    },
    {
      title: "Texas Hold'em",
      emoji: "♠️",
      category: "Poker",
      isPopular: true,
      provider: "PokerStars",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center",
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setTodaysPayout((prev) => prev + Math.random() * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      {/* Hero Banner */}
      <section className="relative py-12 casino-gradient">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 mb-4 bg-black/20 px-4 py-2 rounded-full">
              <Crown className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-semibold">
                Welcome to CoinKrazy.com! 🎊
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🎰 Social Casino Fun! 🎲
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Play for FREE • Win Real Prizes • Join the Fun! 🎉
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 casino-pulse"
                asChild
              >
                <Link to="/auth">
                  <Gift className="w-5 h-5 mr-2" />
                  🎁 Claim FREE 10,000 GC + 10 SC
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-background"
                asChild
              >
                <Link to="/mini-games">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  🎮 Play Mini Games
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary">
                <Users className="w-4 h-4" />
                <span className="text-2xl font-bold">
                  {onlineUsers.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">🟢 Players Online</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-accent">
                <TrendingUp className="w-4 h-4" />
                <span className="text-2xl font-bold">
                  ${todaysPayout.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                💰 Today's Payouts
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-2xl font-bold">700+</span>
              </div>
              <p className="text-sm text-muted-foreground">
                🎮 Games Available
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-accent">
                <Zap className="w-4 h-4" />
                <span className="text-2xl font-bold">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">⚡ Live Support</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Daily Mini Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <Timer className="w-6 h-6 mr-2 text-accent" />
                🎯 Daily Mini Games
              </h2>
              <p className="text-muted-foreground">
                Play once every 24 hours for FREE SC! 🆓
              </p>
            </div>
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              🔥 Exclusive to CoinKrazy!
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {miniGames.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                provider={game.provider}
                image={game.image}
                category={game.category}
                emoji={game.emoji}
                cooldown={game.cooldown}
                onClick={() => console.log(`Playing ${game.title}`)}
              />
            ))}
          </div>
        </section>

        {/* Popular Slots */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <Star className="w-6 h-6 mr-2 text-primary" />
                🎰 Popular Slots
              </h2>
              <p className="text-muted-foreground">
                Top player favorites with big wins! 💎
              </p>
            </div>
            <Button variant="outline">View All Slots →</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {slotGames.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                provider={game.provider}
                image={game.image}
                category={game.category}
                emoji={game.emoji}
                isPopular={game.isPopular}
                isNew={game.isNew}
                jackpot={game.jackpot}
                onClick={() => console.log(`Playing ${game.title}`)}
              />
            ))}
          </div>
        </section>

        {/* Table Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <Crown className="w-6 h-6 mr-2 text-accent" />
                🎲 Table Games
              </h2>
              <p className="text-muted-foreground">
                Classic casino favorites! 🃏
              </p>
            </div>
            <Button variant="outline">View All Tables →</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tableGames.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                provider={game.provider}
                image={game.image}
                category={game.category}
                emoji={game.emoji}
                isPopular={game.isPopular}
                onClick={() => console.log(`Playing ${game.title}`)}
              />
            ))}
          </div>
        </section>

        {/* Promotions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Gift className="w-6 h-6 mr-2 text-primary" />
            🎁 Active Promotions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  🎊 Welcome Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  New players get 10,000 GC + 10 SC FREE! 🎁
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Claim Now! 🚀
                </Button>
              </CardContent>
            </Card>

            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  ⚡ Daily Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Login daily for increasing rewards! 📈
                </p>
                <Button
                  variant="outline"
                  className="w-full border-accent text-accent"
                >
                  Check In ✅
                </Button>
              </CardContent>
            </Card>

            <Card className="casino-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  🏆 Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Compete for the top prizes! 🥇
                </p>
                <Button variant="outline" className="w-full">
                  View Rankings 📊
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CoinKrazy.com
            </span>
          </div>
          <p className="text-muted-foreground mb-4">
            🎰 Social Casino • 🎁 Free to Play • 🏆 Real Prizes
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Responsible Gaming
            </a>
            <a href="#" className="hover:text-primary">
              Support 💬
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            © 2024 CoinKrazy.com • 18+ Only • Play Responsibly 🎲
          </p>
        </div>
      </footer>
    </div>
  );
}
