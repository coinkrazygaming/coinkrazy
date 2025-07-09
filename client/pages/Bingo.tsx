import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CasinoHeader from "@/components/CasinoHeader";
import {
  Star,
  Users,
  Trophy,
  Clock,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Gift,
  Crown,
  Timer,
  Zap,
} from "lucide-react";

export default function Bingo() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [bingoCard, setBingoCard] = useState<number[][]>([]);
  const [calledNumbers, setCalledNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [timeToNext, setTimeToNext] = useState(120);

  // Mock bingo rooms data - Half SC (Sweeps Coins) and Half GC (Gold Coins)
  const bingoRooms = [
    {
      id: "golden-hall",
      name: "🌟 Golden Hall",
      emoji: "✨",
      players: 47,
      maxPlayers: 100,
      jackpot: 125.5,
      ticketPrice: 2,
      currency: "SC",
      gameType: "75-Ball",
      status: "active",
      nextDraw: "2024-12-20 15:30",
      pattern: "Full House",
      timeRemaining: 8,
      caller: "Sarah",
    },
    {
      id: "diamond-room",
      name: "💎 Diamond Room",
      emoji: "💎",
      players: 32,
      maxPlayers: 75,
      jackpot: 1789.75,
      ticketPrice: 20,
      currency: "GC",
      gameType: "90-Ball",
      status: "waiting",
      nextDraw: "2024-12-20 16:00",
      pattern: "Line",
      timeRemaining: 15,
      caller: "Mike",
    },
    {
      id: "ruby-lounge",
      name: "💍 Ruby Lounge",
      emoji: "❤️",
      players: 23,
      maxPlayers: 50,
      jackpot: 67.25,
      ticketPrice: 1.5,
      currency: "SC",
      gameType: "75-Ball",
      status: "waiting",
      nextDraw: "2024-12-20 15:45",
      pattern: "Four Corners",
      timeRemaining: 5,
      caller: "Emma",
    },
    {
      id: "emerald-palace",
      name: "💚 Emerald Palace",
      emoji: "💚",
      players: 56,
      maxPlayers: 150,
      jackpot: 4680.8,
      ticketPrice: 100,
      currency: "GC",
      gameType: "90-Ball",
      status: "active",
      nextDraw: "2024-12-20 15:35",
      pattern: "Full House",
      timeRemaining: 12,
      caller: "James",
    },
    {
      id: "sapphire-suite",
      name: "💙 Sapphire Suite",
      emoji: "💙",
      players: 18,
      maxPlayers: 30,
      jackpot: 45.6,
      ticketPrice: 0.5,
      currency: "SC",
      gameType: "75-Ball",
      status: "waiting",
      nextDraw: "2024-12-20 16:15",
      pattern: "Blackout",
      timeRemaining: 25,
      caller: "Anna",
    },
    {
      id: "platinum-hall",
      name: "🤍 Platinum Hall",
      emoji: "⚪",
      players: 89,
      maxPlayers: 200,
      jackpot: 9137.9,
      ticketPrice: 200,
      currency: "GC",
      gameType: "90-Ball",
      status: "active",
      nextDraw: "2024-12-20 15:25",
      pattern: "Two Lines",
      timeRemaining: 3,
      caller: "Victoria",
    },
  ];

  // Generate random bingo card
  const generateBingoCard = () => {
    const card: number[][] = [];
    for (let col = 0; col < 5; col++) {
      const column: number[] = [];
      const min = col * 15 + 1;
      const max = col * 15 + 15;
      const numbers = Array.from({ length: 15 }, (_, i) => min + i);

      // Shuffle and pick 5 numbers
      for (let i = 0; i < 5; i++) {
        if (col === 2 && i === 2) {
          column.push(0); // Free space
        } else {
          const randomIndex = Math.floor(Math.random() * numbers.length);
          column.push(numbers.splice(randomIndex, 1)[0]);
        }
      }
      card.push(column);
    }

    // Transpose to get row-major order
    const transposed: number[][] = [];
    for (let row = 0; row < 5; row++) {
      transposed.push(card.map((col) => col[row]));
    }

    return transposed;
  };

  const generateRandomNumber = () => {
    const letters = ["B", "I", "N", "G", "O"];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    let min, max;

    switch (letter) {
      case "B":
        min = 1;
        max = 15;
        break;
      case "I":
        min = 16;
        max = 30;
        break;
      case "N":
        min = 31;
        max = 45;
        break;
      case "G":
        min = 46;
        max = 60;
        break;
      case "O":
        min = 61;
        max = 75;
        break;
      default:
        min = 1;
        max = 75;
    }

    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${letter}-${number}`;
  };

  const joinRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    setBingoCard(generateBingoCard());
    setCalledNumbers([]);
    setCurrentNumber(null);
  };

  const startGame = () => {
    setGameInProgress(true);
    const interval = setInterval(() => {
      const newNumber = generateRandomNumber();
      setCurrentNumber(newNumber);
      setCalledNumbers((prev) => [...prev, newNumber]);

      if (Math.random() > 0.8) {
        // 20% chance to end game
        setGameInProgress(false);
        clearInterval(interval);
      }
    }, 3000);
  };

  useEffect(() => {
    // Countdown timer for next game
    const interval = setInterval(() => {
      setTimeToNext((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedRoomData = bingoRooms.find((room) => room.id === selectedRoom);

  if (selectedRoom && selectedRoomData) {
    return (
      <div className="min-h-screen bg-background">
        <CasinoHeader />

        <div className="container mx-auto px-4 py-8">
          {/* Game Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button variant="outline" onClick={() => setSelectedRoom(null)}>
                ← Back to Lobby
              </Button>
              <h1 className="text-3xl font-bold text-primary">
                {selectedRoomData.name}
              </h1>
              <Badge
                className={`${
                  selectedRoomData.status === "active"
                    ? "bg-destructive text-white animate-pulse"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {selectedRoomData.status === "active"
                  ? "🔴 LIVE"
                  : "⏳ WAITING"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Caller: {selectedRoomData.caller} • Pattern:{" "}
              {selectedRoomData.pattern} • Jackpot: ${selectedRoomData.jackpot}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Bingo Card */}
            <div className="lg:col-span-2">
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center text-primary">
                    🎯 Your Bingo Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {["B", "I", "N", "G", "O"].map((letter, index) => (
                        <div
                          key={letter}
                          className="bg-primary text-primary-foreground text-center py-2 font-bold text-lg rounded"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {bingoCard.map((row, rowIndex) =>
                        row.map((number, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square flex items-center justify-center text-lg font-bold rounded border-2 cursor-pointer transition-all ${
                              number === 0
                                ? "bg-accent text-accent-foreground border-accent"
                                : calledNumbers.some((called) =>
                                      called.includes(number.toString()),
                                    )
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-secondary border-border hover:bg-secondary/80"
                            }`}
                          >
                            {number === 0 ? "FREE" : number}
                          </div>
                        )),
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <Button className="bg-primary hover:bg-primary/90 mr-4">
                      🏆 Call BINGO!
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Game Info */}
            <div className="space-y-6">
              {/* Current Number */}
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center text-accent">
                    🎤 Current Number
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {currentNumber ? (
                      <div className="text-6xl font-bold text-primary mb-4 casino-pulse">
                        {currentNumber}
                      </div>
                    ) : (
                      <div className="text-4xl text-muted-foreground mb-4">
                        Waiting...
                      </div>
                    )}
                    <p className="text-muted-foreground">
                      Numbers Called: {calledNumbers.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Called Numbers */}
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center">
                    📋 Called Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-1">
                      {calledNumbers.map((number, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-center py-1 rounded text-sm"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                    {calledNumbers.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No numbers called yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Game Controls */}
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center">
                    🎮 Game Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={startGame}
                    disabled={gameInProgress}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {gameInProgress ? "Game In Progress..." : "Start Demo"}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Volume2 className="w-4 h-4 mr-1" />
                      Audio
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Next Game: {formatTime(timeToNext)}
                  </div>
                </CardContent>
              </Card>

              {/* Jackpot Info */}
              <Card className="casino-glow">
                <CardHeader>
                  <CardTitle className="text-center text-primary">
                    💰 Jackpot Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      ${selectedRoomData.jackpot}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pattern: {selectedRoomData.pattern}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRoomData.players} players competing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CasinoHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Bingo Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Star className="w-10 h-10 mr-3 text-primary" />
            🏆 Bingo Hall
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Live callers • Real prizes • Community fun! 🎊
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-destructive text-white px-4 py-2 animate-pulse">
              <Timer className="w-4 h-4 mr-2" />
              🔴 3 ROOMS LIVE
            </Badge>
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              265 Players Online
            </Badge>
            <Badge className="bg-accent text-accent-foreground px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              $1,020 in Prizes
            </Badge>
          </div>
        </div>

        {/* Next Game Timer */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary casino-glow">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  🎯 Next Game Starting Soon!
                </h2>
                <div className="text-4xl font-bold text-accent mb-2">
                  {formatTime(timeToNext)}
                </div>
                <p className="text-muted-foreground">
                  🎪 Join a room now to secure your spot!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bingo Rooms */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {bingoRooms.map((room) => (
            <Card
              key={room.id}
              className="casino-glow hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => joinRoom(room.id)}
            >
              <CardHeader className="text-center">
                <div className="text-5xl mb-2 animate-float">{room.emoji}</div>
                <CardTitle className="text-xl text-primary">
                  {room.name}
                </CardTitle>
                <div className="flex items-center justify-center space-x-2">
                  <Badge
                    className={`${
                      room.status === "active"
                        ? "bg-destructive text-white animate-pulse"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {room.status === "active" ? "🔴 LIVE" : "⏳ WAITING"}
                  </Badge>
                  <Badge className="bg-accent text-accent-foreground">
                    👩‍💼 {room.caller}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Players:</span>
                    <span className="font-bold">
                      {room.players}/{room.maxPlayers}
                    </span>
                  </div>
                  <Progress
                    value={(room.players / room.maxPlayers) * 100}
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Jackpot:</span>
                      <div
                        className={`font-bold ${room.currency === "SC" ? "text-green-500" : "text-accent"}`}
                      >
                        {room.currency === "SC"
                          ? `${room.jackpot} SC`
                          : `${room.jackpot.toLocaleString()} GC`}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ticket:</span>
                      <div
                        className={`font-bold ${room.currency === "SC" ? "text-green-500" : "text-accent"}`}
                      >
                        {room.currency === "SC"
                          ? `${room.ticketPrice} SC`
                          : `${room.ticketPrice} GC`}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-bold">{room.gameType}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pattern:</span>
                      <div className="font-bold">{room.pattern}</div>
                    </div>
                  </div>
                  {room.status === "active" ? (
                    <div className="text-center text-sm">
                      <Clock className="w-4 h-4 inline mr-1" />
                      <span className="text-destructive font-bold">
                        {room.timeRemaining} min remaining
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-sm">
                      <Timer className="w-4 h-4 inline mr-1" />
                      <span className="text-muted-foreground">
                        Next game: {room.timeRemaining} min
                      </span>
                    </div>
                  )}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 casino-pulse"
                    onClick={() => joinRoom(room.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    🎯 Join Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Play */}
        <div className="mb-8">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-primary">
                <Star className="w-6 h-6 mr-2" />
                📋 How to Play Bingo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎫</div>
                  <h3 className="font-semibold mb-2">Buy Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    Purchase bingo cards with Gold Coins for each game
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎤</div>
                  <h3 className="font-semibold mb-2">Listen to Caller</h3>
                  <p className="text-sm text-muted-foreground">
                    Numbers are called by our live professional callers
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2">Mark Your Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Click numbers on your card as they're called
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-semibold mb-2">Win Prizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete patterns to win Sweepstakes Cash prizes!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bingo Patterns */}
        <div className="mb-8">
          <Card className="casino-glow">
            <CardHeader>
              <CardTitle className="text-center text-accent">
                🎨 Winning Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">📏</div>
                  <h4 className="font-semibold">Line</h4>
                  <p className="text-xs text-muted-foreground">
                    Any horizontal line
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔲</div>
                  <h4 className="font-semibold">Four Corners</h4>
                  <p className="text-xs text-muted-foreground">
                    All four corners
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">❌</div>
                  <h4 className="font-semibold">X Pattern</h4>
                  <p className="text-xs text-muted-foreground">
                    Both diagonals
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⬛</div>
                  <h4 className="font-semibold">Blackout</h4>
                  <p className="text-xs text-muted-foreground">Entire card</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🏠</div>
                  <h4 className="font-semibold">Full House</h4>
                  <p className="text-xs text-muted-foreground">All numbers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Gaming */}
        <div className="text-center">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              🎲 Play responsibly • 🔞 18+ Only • 🏆 Fair play certified • 🎊
              Community fun for everyone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
