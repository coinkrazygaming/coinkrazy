import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  RotateCcw,
  Home,
  Trophy,
  Star,
  Zap,
  Crown,
  Gift,
  Coins,
} from "lucide-react";

interface Prize {
  id: number;
  label: string;
  value: number;
  type: "sc" | "gc" | "multiplier" | "bonus";
  color: string;
  probability: number;
}

interface GameState {
  isSpinning: boolean;
  gameStarted: boolean;
  hasSpunToday: boolean;
  currentRotation: number;
  finalRotation: number;
  selectedPrize: Prize | null;
  totalSpins: number;
  totalEarnings: number;
}

const PRIZES: Prize[] = [
  {
    id: 1,
    label: "0.05 SC",
    value: 0.05,
    type: "sc",
    color: "#FFD700",
    probability: 0.25,
  },
  {
    id: 2,
    label: "50 GC",
    value: 50,
    type: "gc",
    color: "#87CEEB",
    probability: 0.2,
  },
  {
    id: 3,
    label: "0.10 SC",
    value: 0.1,
    type: "sc",
    color: "#FF6B35",
    probability: 0.15,
  },
  {
    id: 4,
    label: "100 GC",
    value: 100,
    type: "gc",
    color: "#4ECDC4",
    probability: 0.15,
  },
  {
    id: 5,
    label: "0.15 SC",
    value: 0.15,
    type: "sc",
    color: "#45B7D1",
    probability: 0.1,
  },
  {
    id: 6,
    label: "Better Luck",
    value: 0,
    type: "bonus",
    color: "#DDD",
    probability: 0.08,
  },
  {
    id: 7,
    label: "0.30 SC",
    value: 0.3,
    type: "sc",
    color: "#FF1744",
    probability: 0.05,
  },
  {
    id: 8,
    label: "JACKPOT!",
    value: 0.5,
    type: "sc",
    color: "#7B68EE",
    probability: 0.02,
  },
];

export default function LuckyWheelSpin({ onClose }: { onClose: () => void }) {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>({
    isSpinning: false,
    gameStarted: false,
    hasSpunToday: false,
    currentRotation: 0,
    finalRotation: 0,
    selectedPrize: null,
    totalSpins: 0,
    totalEarnings: 0,
  });

  const [spinPower, setSpinPower] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    drawWheel();
  }, [gameState.currentRotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const segments = PRIZES.length;
    const anglePerSegment = (2 * Math.PI) / segments;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments
    PRIZES.forEach((prize, index) => {
      const startAngle =
        index * anglePerSegment + (gameState.currentRotation * Math.PI) / 180;
      const endAngle = startAngle + anglePerSegment;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      const textAngle = startAngle + anglePerSegment / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(prize.label, 0, 0);
      ctx.restore();

      // Draw prize icons
      const iconX = centerX + Math.cos(textAngle) * (radius * 0.4);
      const iconY = centerY + Math.sin(textAngle) * (radius * 0.4);
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";

      if (prize.type === "sc") {
        ctx.fillText("💎", iconX, iconY);
      } else if (prize.type === "gc") {
        ctx.fillText("🪙", iconX, iconY);
      } else if (prize.label === "JACKPOT!") {
        ctx.fillText("🎊", iconX, iconY);
      } else {
        ctx.fillText("🍀", iconX, iconY);
      }
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw CoinKrazy logo in center
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("COIN", centerX, centerY - 8);
    ctx.fillText("KRAZY", centerX, centerY + 8);

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX - 15, 60);
    ctx.lineTo(centerX + 15, 60);
    ctx.closePath();
    ctx.fillStyle = "#FF1744";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const selectRandomPrize = (): Prize => {
    const random = Math.random();
    let accumulator = 0;

    for (const prize of PRIZES) {
      accumulator += prize.probability;
      if (random <= accumulator) {
        return prize;
      }
    }

    return PRIZES[PRIZES.length - 1]; // Fallback
  };

  const spinWheel = async () => {
    if (gameState.isSpinning || gameState.hasSpunToday) return;

    setLoading(true);
    setGameState((prev) => ({ ...prev, isSpinning: true }));

    // Select winning prize
    const winningPrize = selectRandomPrize();
    const winningIndex = PRIZES.findIndex((p) => p.id === winningPrize.id);

    // Calculate final rotation
    const segmentAngle = 360 / PRIZES.length;
    const winningAngle = winningIndex * segmentAngle + segmentAngle / 2;
    const baseRotations = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = baseRotations * 360 + (360 - winningAngle);

    setGameState((prev) => ({
      ...prev,
      finalRotation,
      selectedPrize: winningPrize,
    }));

    // Animate wheel spin
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = gameState.currentRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation =
        startRotation + (finalRotation - startRotation) * easeOut;

      setGameState((prev) => ({
        ...prev,
        currentRotation: currentRotation % 360,
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spin complete
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            isSpinning: false,
            hasSpunToday: true,
            totalSpins: prev.totalSpins + 1,
            totalEarnings: prev.totalEarnings + winningPrize.value,
          }));

          showPrizeResult(winningPrize);
          setLoading(false);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  const awardPrize = async (prize: Prize) => {
    if (prize.value === 0) return; // No prize to award

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/transactions/mini-game-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: "lucky-wheel",
          prizeType: prize.type,
          amount: prize.value,
          description: `Lucky Wheel Win - ${prize.label}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update user balance in context
        if (user && updateBalance) {
          updateBalance(data.newGoldBalance, data.newSweepsBalance);
        }
      }
    } catch (error) {
      console.error("Failed to award prize:", error);
    }
  };

  const showPrizeResult = async (prize: Prize) => {
    // Award the prize first
    await awardPrize(prize);

    if (prize.value > 0) {
      if (prize.type === "sc") {
        toast({
          title: "🎉 Congratulations!",
          description: `You won ${prize.value} Sweep Coins! The prize has been added to your balance.`,
        });
      } else if (prize.type === "gc") {
        toast({
          title: "🎉 Nice spin!",
          description: `You won ${prize.value} Gold Coins! Keep spinning for more prizes.`,
        });
      }
    } else {
      toast({
        title: "🍀 Better luck next time!",
        description:
          "Don't worry, you can spin again in 24 hours for another chance!",
      });
    }
  };

  const startGame = () => {
    setGameState((prev) => ({ ...prev, gameStarted: true }));
  };

  const resetGame = () => {
    setGameState({
      isSpinning: false,
      gameStarted: false,
      hasSpunToday: false,
      currentRotation: 0,
      finalRotation: 0,
      selectedPrize: null,
      totalSpins: 0,
      totalEarnings: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Lucky Wheel Spin 🎡
                </h1>
                <p className="text-muted-foreground">
                  Spin the wheel for your chance at SC prizes! • CoinKrazy.com
                  Exclusive
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              <Home className="w-4 h-4 mr-2" />
              Return to Lobby
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="p-6 bg-secondary/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {gameState.totalSpins}
                </p>
                <p className="text-sm text-muted-foreground">Total Spins</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Crown className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold text-accent">
                  {gameState.totalEarnings.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">SC Earned</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Gift className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-500">
                  {gameState.selectedPrize?.label || "---"}
                </p>
                <p className="text-sm text-muted-foreground">Last Prize</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {gameState.hasSpunToday ? "USED" : "FREE"}
                </p>
                <p className="text-sm text-muted-foreground">Daily Spin</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          {!gameState.gameStarted ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Lucky Wheel of Fortune!
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Spin the wheel once daily for your chance to win Sweep Coins and
                Gold Coins! Each spin is completely free and offers exciting
                prizes based on where the wheel stops.
              </p>
              <div className="bg-primary/10 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold mb-4 text-lg">
                  🎯 Prize Breakdown:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>💎 0.05 SC</span>
                    <span className="text-muted-foreground">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🪙 50 GC</span>
                    <span className="text-muted-foreground">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💎 0.10 SC</span>
                    <span className="text-muted-foreground">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🪙 100 GC</span>
                    <span className="text-muted-foreground">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💎 0.15 SC</span>
                    <span className="text-muted-foreground">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍀 Try Again</span>
                    <span className="text-muted-foreground">8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💎 0.30 SC</span>
                    <span className="text-muted-foreground">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🎊 JACKPOT!</span>
                    <span className="text-muted-foreground">2%</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                disabled={loading}
              >
                {loading ? "Loading..." : "Start Spinning 🎡"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wheel Canvas */}
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="border-4 border-primary rounded-full casino-glow"
                  />

                  {/* Wheel glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse -z-10" />
                </div>
              </div>

              {/* Spin Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={spinWheel}
                  disabled={gameState.isSpinning || gameState.hasSpunToday}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 casino-pulse"
                >
                  {gameState.isSpinning ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Spinning...
                    </>
                  ) : gameState.hasSpunToday ? (
                    "Daily Spin Used ✓"
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      🎡 SPIN THE WHEEL!
                    </>
                  )}
                </Button>

                <Button onClick={resetGame} variant="outline" size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Demo
                </Button>
              </div>

              {/* Prize Result */}
              {gameState.selectedPrize && !gameState.isSpinning && (
                <div className="text-center">
                  <Card className="casino-glow max-w-md mx-auto">
                    <CardContent className="p-6">
                      <div className="text-6xl mb-4">
                        {gameState.selectedPrize.type === "sc"
                          ? "💎"
                          : gameState.selectedPrize.type === "gc"
                            ? "🪙"
                            : gameState.selectedPrize.label === "JACKPOT!"
                              ? "🎊"
                              : "🍀"}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {gameState.selectedPrize.value > 0
                          ? "🎉 Congratulations!"
                          : "🍀 Better Luck Next Time!"}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        You won:{" "}
                        <span className="font-bold text-primary">
                          {gameState.selectedPrize.label}
                        </span>
                      </p>
                      {gameState.selectedPrize.value === 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Come back in 24 hours for another free spin!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-secondary/30 text-center">
          <p className="text-sm text-muted-foreground">
            🎡 Lucky Wheel Spin - Exclusive CoinKrazy.com Mini Game • Spin daily
            for free prizes! 🎁
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Game resets every 24 hours • Responsible gaming • 18+ only
          </p>
        </div>
      </div>
    </div>
  );
}
