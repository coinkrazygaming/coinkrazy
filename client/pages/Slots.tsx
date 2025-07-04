import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CasinoHeader from "@/components/CasinoHeader";
import GameCard from "@/components/GameCard";
import SlotGameCard from "@/components/SlotGameCard";
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

  // Mock slot games data with real thumbnails
  const slotGames = [
    {
      id: "gold-rush",
      title: "Gold Rush Deluxe",
      provider: "Pragmatic Play",
      category: "popular",
      thumbnail:
        "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d0598c?w=400&h=600&fit=crop&crop=center",
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
      thumbnail:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=600&fit=crop&crop=center",
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

  const handlePlayWithGold = (gameId: string) => {
    // Implementation for playing with Gold Coins
    console.log(`Playing ${gameId} with Gold Coins`);
  };

  const handlePlayWithSweeps = (gameId: string) => {
    // Implementation for playing with Sweeps Coins
    console.log(`Playing ${gameId} with Sweeps Coins`);
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
                      <SlotGameCard
                        key={game.id}
                        title={game.title}
                        provider={game.provider}
                        thumbnail={game.thumbnail}
                        category="Slots"
                        rtp={game.rtp}
                        volatility={game.volatility}
                        isPopular={game.isPopular}
                        isNew={game.isNew}
                        jackpot={game.jackpot}
                        onPlayGold={() => handlePlayWithGold(game.id)}
                        onPlaySweeps={() => handlePlayWithSweeps(game.id)}
                      />
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
                  <SlotGameCard
                    key={game.id}
                    title={game.title}
                    provider={game.provider}
                    thumbnail={game.thumbnail}
                    category="Slots"
                    rtp={game.rtp}
                    volatility={game.volatility}
                    isPopular={game.isPopular}
                    isNew={game.isNew}
                    jackpot={game.jackpot}
                    onPlayGold={() => handlePlayWithGold(game.id)}
                    onPlaySweeps={() => handlePlayWithSweeps(game.id)}
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
