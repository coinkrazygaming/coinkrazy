import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CasinoHeader from "@/components/CasinoHeader";
import MiniGameCard from "@/components/MiniGameCard";
import {
  Play,
  Trophy,
  Clock,
  Target,
  Coins,
  Star,
  Home,
  RotateCcw,
} from "lucide-react";

// Duck Hunt game interfaces
interface Duck {
  id: string;
  x: number;
  y: number;
  direction: "left" | "right" | "up" | "diagonal";
  speed: number;
  alive: boolean;
  hit: boolean;
}

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [ducksShot, setDucksShot] = useState(0);
  const [bullets, setBullets] = useState(3);
  const [round, setRound] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const duckSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const duckMoveRef = useRef<NodeJS.Timeout | null>(null);

  const miniGames = [
    {
      id: "quack-attack",
      title: "Josey's Quack Attack",
      emoji: "🦆",
      description: "Shoot flying duck targets for 60 seconds!",
      instructions:
        "Click on the flying ducks to shoot them. Each duck is worth 0.00-0.10 SC!",
      cooldown: null, // Available to play
      lastPlayed: null,
      maxEarning: "0.10 SC per duck",
      difficulty: "Easy",
    },
    {
      id: "colin-shots",
      title: "Colin Shots",
      emoji: "🏀",
      description: "Make basketball shots for 60 seconds!",
      instructions:
        "Click to shoot basketballs into the hoop. Each successful shot earns 0.00-0.10 SC!",
      cooldown: "18:24:15", // On cooldown
      lastPlayed: "2024-12-19 06:35:45",
      maxEarning: "0.10 SC per shot",
      difficulty: "Medium",
    },
    {
      id: "flickin-bean",
      title: "Flickin' My Bean",
      emoji: "🎯",
      description: "Throw bean bags at the cornhole board!",
      instructions:
        "Aim and throw bean bags into the holes. Different holes have different values!",
      cooldown: "12:45:30", // On cooldown
      lastPlayed: "2024-12-19 11:14:30",
      maxEarning: "0.10 SC per bag",
      difficulty: "Medium",
    },
    {
      id: "haylie-coins",
      title: "Haylie's Coins",
      emoji: "🪙",
      description: "Drop coins in the coin pusher!",
      instructions:
        "Time your coin drops to push coins off the edge and earn SC!",
      cooldown: null, // Available to play
      lastPlayed: null,
      maxEarning: "0.10 SC per coin",
      difficulty: "Easy",
    },
    {
      id: "beth-darts",
      title: "Beth's Darts",
      emoji: "🎪",
      description: "Pop balloons with darts!",
      instructions:
        "Throw darts at balloons. Each balloon has a different SC value!",
      cooldown: "23:15:42", // On cooldown
      lastPlayed: "2024-12-19 00:44:18",
      maxEarning: "0.10 SC per balloon",
      difficulty: "Hard",
    },
  ];

  const startGame = (gameId: string) => {
    const game = miniGames.find((g) => g.id === gameId);
    if (!game || game.cooldown) return;

    setActiveGame(gameId);
    setGameScore(0);
    setTotalEarned(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameEnded(false);

    // Start the countdown timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setGameStarted(false);
    setGameEnded(true);

    // Calculate final earnings
    const finalEarnings = (gameScore * (Math.random() * 0.1)).toFixed(2);
    setTotalEarned(parseFloat(finalEarnings));
  };

  const resetGame = () => {
    setActiveGame(null);
    setGameScore(0);
    setTotalEarned(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameEnded(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleGameAction = () => {
    if (!gameStarted || timeLeft <= 0) return;

    // Simulate successful action (hit/shot/throw)
    const success = Math.random() > 0.3; // 70% success rate
    if (success) {
      setGameScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (activeGame) {
    const game = miniGames.find((g) => g.id === activeGame);
    if (!game) return null;

    return (
      <div className="min-h-screen bg-background">
        <CasinoHeader />

        <div className="container mx-auto px-4 py-8">
          {/* Game Header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-float">{game.emoji}</div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {game.title}
            </h1>
            <p className="text-muted-foreground mb-4">{game.description}</p>
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              CoinKrazy.com Exclusive ��️
            </Badge>
          </div>

          {!gameStarted && !gameEnded && (
            <div className="max-w-2xl mx-auto">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center">
                    🎮 Game Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    {game.instructions}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary p-3 rounded-lg">
                      <h3 className="font-semibold text-primary">
                        ⏰ Duration
                      </h3>
                      <p className="text-2xl font-bold">60 seconds</p>
                    </div>
                    <div className="bg-secondary p-3 rounded-lg">
                      <h3 className="font-semibold text-accent">💰 Max Earn</h3>
                      <p className="text-2xl font-bold">{game.maxEarning}</p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 casino-pulse text-lg px-8 py-3"
                    onClick={() => startGame(game.id)}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    🚀 Start Game!
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameStarted && (
            <div className="max-w-4xl mx-auto">
              {/* Game Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Card className="casino-glow">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-destructive" />
                    <p className="text-3xl font-bold text-destructive">
                      {timeLeft}s
                    </p>
                    <p className="text-sm text-muted-foreground">Time Left</p>
                  </CardContent>
                </Card>
                <Card className="casino-glow">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-3xl font-bold text-primary">
                      {gameScore}
                    </p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </CardContent>
                </Card>
                <Card className="casino-glow">
                  <CardContent className="p-4 text-center">
                    <Coins className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <p className="text-3xl font-bold text-accent">
                      {(gameScore * 0.05).toFixed(2)} SC
                    </p>
                    <p className="text-sm text-muted-foreground">Estimated</p>
                  </CardContent>
                </Card>
              </div>

              {/* Game Area */}
              <Card className="casino-glow mb-4">
                <CardContent className="p-8">
                  <div
                    className="aspect-video bg-gradient-to-br from-casino-blue-900 to-casino-blue-700 rounded-lg relative overflow-hidden cursor-crosshair"
                    onClick={handleGameAction}
                  >
                    {/* Game-specific UI */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4 animate-bounce">
                          {game.emoji}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          🎮 Click to Play!
                        </h3>
                        <p className="text-lg">
                          Click anywhere in this area to{" "}
                          {game.id === "quack-attack" && "shoot ducks"}
                          {game.id === "colin-shots" && "shoot basketballs"}
                          {game.id === "flickin-bean" && "throw bean bags"}
                          {game.id === "haylie-coins" && "drop coins"}
                          {game.id === "beth-darts" && "throw darts"}
                        </p>
                      </div>
                    </div>

                    {/* CoinKrazy Branding */}
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                      <span className="text-primary font-bold text-sm">
                        CoinKrazy.com
                      </span>
                    </div>

                    {/* Score Popup Effects */}
                    {gameScore > 0 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="text-gold-400 text-4xl font-bold animate-ping">
                          +1
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="outline" onClick={resetGame} className="mr-4">
                  <Home className="w-4 h-4 mr-2" />
                  Exit Game
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  🎯 Keep clicking to score points! Each successful action earns
                  SC!
                </p>
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="max-w-2xl mx-auto">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center text-primary">
                    🎉 Game Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl mb-4">{game.emoji}</div>
                  <h2 className="text-2xl font-bold mb-4">
                    Congratulations on your {totalEarned.toFixed(2)} SC WIN! 🏆
                  </h2>
                  <div className="bg-secondary p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Final Score
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {gameScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          SC Earned
                        </p>
                        <p className="text-3xl font-bold text-accent">
                          {totalEarned.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    🎊 You have been credited already, see you again in 24 HOURS
                    for another chance! ⏰
                  </p>
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={resetGame}
                    >
                      <Home className="w-5 h-5 mr-2" />
                      🏠 Back to Mini Games
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      🔄 Next play available: Tomorrow at the same time
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 mr-3 text-primary" />
            🎯 Daily Mini Games
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Play once every 24 hours to win FREE Sweepstakes Cash! 🆓
          </p>
          <Badge className="bg-destructive text-destructive-foreground text-lg px-4 py-2 animate-pulse">
            🔥 Exclusive to CoinKrazy.com!
          </Badge>
        </div>

        {/* Stats Banner */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8 casino-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">🎮 Mini Games</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">24h</div>
              <div className="text-sm text-muted-foreground">⏰ Cooldown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">0.10</div>
              <div className="text-sm text-muted-foreground">
                💰 Max SC/Game
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">FREE</div>
              <div className="text-sm text-muted-foreground">🎁 To Play</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {miniGames.map((game) => (
            <MiniGameCard
              key={game.id}
              id={game.id}
              title={game.title}
              description={game.description}
              maxEarning={game.maxEarning}
              difficulty={game.difficulty}
              cooldown={game.cooldown}
              lastPlayed={game.lastPlayed}
              onClick={() => startGame(game.id)}
            />
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-12">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-primary">
                <Star className="w-6 h-6 mr-2" />
                📋 How Mini Games Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="font-semibold mb-2">Choose a Game</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick any available mini game and click "Play Now"
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">⏱️</div>
                  <h3 className="font-semibold mb-2">60 Seconds</h3>
                  <p className="text-sm text-muted-foreground">
                    You have exactly 60 seconds to score as many points as
                    possible
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-semibold mb-2">Win SC</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn Sweepstakes Cash based on your performance!
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Badge className="bg-accent text-accent-foreground">
                  💡 Pro Tip: Each game has different strategies to maximize
                  your SC earnings!
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
