import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CasinoHeader from "@/components/CasinoHeader";
import GameCard from "@/components/GameCard";
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Gift,
  Trophy,
  Coins,
  Play,
  Volume2,
} from "lucide-react";

export default function Slots() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jackpotAmount, setJackpotAmount] = useState(245678.89);

  // Mock slot games data
  const slotGames = [
    {
      id: "gold-rush",
      title: "Gold Rush Deluxe",
      provider: "Pragmatic Play",
      category: "popular",
      emoji: "💰",
      rtp: "96.5%",
      volatility: "High",
      paylines: 25,
      minBet: 0.25,
      maxBet: 125,
      jackpot: "$12,456",
      isNew: false,
      isPopular: true,
      description: "Strike gold in this exciting mining adventure!",
    },
    {
      id: "diamond-dreams",
      title: "Diamond Dreams",
      provider: "NetEnt",
      category: "new",
      emoji: "💎",
      rtp: "97.2%",
      volatility: "Medium",
      paylines: 20,
      minBet: 0.2,
      maxBet: 100,
      jackpot: null,
      isNew: true,
      isPopular: false,
      description: "Sparkling gems await in this dazzling slot!",
    },
    {
      id: "lucky-777",
      title: "Lucky 777",
      provider: "Play'n GO",
      category: "classic",
      emoji: "🍀",
      rtp: "95.8%",
      volatility: "Low",
      paylines: 5,
      minBet: 0.1,
      maxBet: 50,
      jackpot: null,
      isNew: false,
      isPopular: true,
      description: "Classic fruit machine with modern features!",
    },
    {
      id: "wild-safari",
      title: "Wild Safari",
      provider: "Microgaming",
      category: "adventure",
      emoji: "🦁",
      rtp: "96.1%",
      volatility: "Medium",
      paylines: 243,
      minBet: 0.3,
      maxBet: 150,
      jackpot: null,
      isNew: false,
      isPopular: false,
      description: "Journey into the African wilderness!",
    },
    {
      id: "ocean-treasure",
      title: "Ocean Treasure",
      provider: "Pragmatic Play",
      category: "adventure",
      emoji: "🌊",
      rtp: "96.8%",
      volatility: "High",
      paylines: 50,
      minBet: 0.5,
      maxBet: 200,
      jackpot: "$8,923",
      isNew: false,
      isPopular: true,
      description: "Dive deep for underwater riches!",
    },
    {
      id: "space-adventure",
      title: "Space Adventure",
      provider: "NetEnt",
      category: "scifi",
      emoji: "🚀",
      rtp: "97.5%",
      volatility: "Medium",
      paylines: 40,
      minBet: 0.4,
      maxBet: 180,
      jackpot: null,
      isNew: true,
      isPopular: false,
      description: "Explore the cosmos for stellar wins!",
    },
    {
      id: "mystic-fortune",
      title: "Mystic Fortune",
      provider: "Red Tiger",
      category: "magic",
      emoji: "🔮",
      rtp: "96.3%",
      volatility: "High",
      paylines: 30,
      minBet: 0.3,
      maxBet: 120,
      jackpot: "$15,234",
      isNew: false,
      isPopular: true,
      description: "Magical powers lead to mystical wins!",
    },
    {
      id: "fruit-blast",
      title: "Fruit Blast",
      provider: "Yggdrasil",
      category: "classic",
      emoji: "🍎",
      rtp: "95.5%",
      volatility: "Low",
      paylines: 10,
      minBet: 0.1,
      maxBet: 25,
      jackpot: null,
      isNew: false,
      isPopular: false,
      description: "Fresh fruit action with explosive wins!",
    },
    {
      id: "pirates-gold",
      title: "Pirate's Gold",
      provider: "Pragmatic Play",
      category: "adventure",
      emoji: "🏴‍☠️",
      rtp: "96.7%",
      volatility: "High",
      paylines: 25,
      minBet: 0.25,
      maxBet: 125,
      jackpot: "$9,876",
      isNew: false,
      isPopular: true,
      description: "Sail the seven seas for pirate treasure!",
    },
    {
      id: "mega-millions",
      title: "Mega Millions",
      provider: "Evolution",
      category: "jackpot",
      emoji: "💰",
      rtp: "94.2%",
      volatility: "Very High",
      paylines: 1024,
      minBet: 1.0,
      maxBet: 500,
      jackpot: "$245,678",
      isNew: false,
      isPopular: true,
      description: "Progressive jackpot slot with life-changing wins!",
    },
    {
      id: "egyptian-secrets",
      title: "Egyptian Secrets",
      provider: "Play'n GO",
      category: "ancient",
      emoji: "🏺",
      rtp: "96.4%",
      volatility: "Medium",
      paylines: 20,
      minBet: 0.2,
      maxBet: 100,
      jackpot: null,
      isNew: false,
      isPopular: false,
      description: "Uncover ancient treasures of the pharaohs!",
    },
    {
      id: "candy-crush-saga",
      title: "Sweet Bonanza",
      provider: "Pragmatic Play",
      category: "sweet",
      emoji: "🍭",
      rtp: "96.9%",
      volatility: "High",
      paylines: "Cluster Pay",
      minBet: 0.2,
      maxBet: 125,
      jackpot: null,
      isNew: true,
      isPopular: true,
      description: "Sweet treats and multiplier treats!",
    },
  ];

  const categories = [
    { id: "all", name: "All Games", count: slotGames.length },
    {
      id: "popular",
      name: "🔥 Popular",
      count: slotGames.filter((g) => g.isPopular).length,
    },
    {
      id: "new",
      name: "🆕 New",
      count: slotGames.filter((g) => g.isNew).length,
    },
    {
      id: "jackpot",
      name: "💰 Jackpots",
      count: slotGames.filter((g) => g.jackpot).length,
    },
    {
      id: "classic",
      name: "🎰 Classic",
      count: slotGames.filter((g) => g.category === "classic").length,
    },
    {
      id: "adventure",
      name: "🗺️ Adventure",
      count: slotGames.filter((g) => g.category === "adventure").length,
    },
  ];

  const providers = [
    "All Providers",
    "Pragmatic Play",
    "NetEnt",
    "Play'n GO",
    "Microgaming",
    "Red Tiger",
    "Yggdrasil",
    "Evolution",
  ];

  useEffect(() => {
    // Simulate progressive jackpot updates
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Math.random() * 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredGames = slotGames.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "popular" && game.isPopular) ||
      (selectedCategory === "new" && game.isNew) ||
      (selectedCategory === "jackpot" && game.jackpot) ||
      game.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePlayGame = (gameId: string) => {
    // Implementation for launching slot game
    console.log(`Launching slot game: ${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Slots Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Crown className="w-10 h-10 mr-3 text-primary" />
            🎰 Slot Games
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Over 700+ premium slot games from top providers! 🎮
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Premium Games
            </Badge>
            <Badge className="bg-accent text-accent-foreground px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Instant Play
            </Badge>
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              FREE with GC
            </Badge>
          </div>
        </div>

        {/* Progressive Jackpot Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary casino-glow">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  💰 Progressive Jackpot
                </h2>
                <div className="text-4xl font-bold text-accent mb-2 casino-pulse">
                  $
                  {jackpotAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-muted-foreground mb-4">
                  🎯 Next jackpot winner could be YOU! Play Mega Millions now!
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 casino-pulse"
                  onClick={() => handlePlayGame("mega-millions")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  🚀 Play for Jackpot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search slot games... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Provider
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                RTP
              </Button>
              <Button variant="outline" size="sm">
                <Coins className="w-4 h-4 mr-2" />
                Bet Range
              </Button>
            </div>
          </div>
        </div>

        {/* Game Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            {/* Featured Games for Popular Tab */}
            {selectedCategory === "popular" && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-primary" />
                  🔥 Most Popular This Week
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {slotGames
                    .filter((game) => game.isPopular)
                    .slice(0, 4)
                    .map((game) => (
                      <Card
                        key={game.id}
                        className="casino-glow hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={() => handlePlayGame(game.id)}
                      >
                        <CardHeader className="text-center pb-2">
                          <div className="text-4xl mb-2 animate-float">
                            {game.emoji}
                          </div>
                          <CardTitle className="text-lg text-primary">
                            {game.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {game.provider}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>RTP:</span>
                              <span className="font-bold text-green-500">
                                {game.rtp}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volatility:</span>
                              <span className="font-bold">
                                {game.volatility}
                              </span>
                            </div>
                            {game.jackpot && (
                              <div className="flex justify-between">
                                <span>Jackpot:</span>
                                <span className="font-bold text-accent">
                                  {game.jackpot}
                                </span>
                              </div>
                            )}
                          </div>
                          <Button
                            className="w-full mt-4 bg-primary hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayGame(game.id);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            🎰 Play Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* All Games Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedCategory === "all"
                    ? `All Slot Games (${filteredGames.length})`
                    : `${
                        categories.find((c) => c.id === selectedCategory)?.name
                      } (${filteredGames.length})`}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>Sound on for full experience</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    provider={game.provider}
                    image=""
                    category="Slots"
                    emoji={game.emoji}
                    isPopular={game.isPopular}
                    isNew={game.isNew}
                    jackpot={game.jackpot}
                    onClick={() => handlePlayGame(game.id)}
                  />
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No games found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or category filters
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Provider Showcase */}
        <div className="mt-12">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-primary">
                <Trophy className="w-6 h-6 mr-2" />
                🏆 Premium Game Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4">
                  <div className="text-3xl mb-2">🎮</div>
                  <h3 className="font-semibold">Pragmatic Play</h3>
                  <p className="text-sm text-muted-foreground">
                    Industry leaders in slots
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold">NetEnt</h3>
                  <p className="text-sm text-muted-foreground">
                    Innovative game mechanics
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">🎪</div>
                  <h3 className="font-semibold">Play'n GO</h3>
                  <p className="text-sm text-muted-foreground">
                    Mobile-first designs
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold">Microgaming</h3>
                  <p className="text-sm text-muted-foreground">
                    Progressive jackpots
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="mt-8 text-center">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              🎮 Play responsibly • 🔞 18+ Only • 🎰 Slots are games of chance •
              💰 Set limits and play within your means
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
