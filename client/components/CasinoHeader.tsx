import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Crown,
  Coins,
  User,
  Menu,
  X,
  Wallet,
  Gift,
  Trophy,
  MessageCircle,
} from "lucide-react";

export default function CasinoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock user data - replace with real user context
  const user = {
    name: "Player123",
    goldCoins: 25650,
    sweepstakes: 127.5,
    level: 12,
  };

  return (
    <header className="bg-card border-b border-border casino-glow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center casino-pulse">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CoinKrazy
              </h1>
              <p className="text-xs text-muted-foreground">.com</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link to="/slots">🎰 Slots</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link to="/table-games">🎲 Table Games</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link to="/sports">🏈 Sports</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link to="/mini-games">🎯 Mini Games</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link to="/bingo">🏆 Bingo</Link>
            </Button>
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {user.goldCoins.toLocaleString()} GC
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-accent/20 px-3 py-1 rounded-full">
                <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium text-accent">
                  {user.sweepstakes.toFixed(2)} SC
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground casino-pulse hidden sm:flex"
                asChild
              >
                <Link to="/store">
                  <Gift className="w-4 h-4 mr-1" />
                  🎁 Get Coins
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="relative">
                <MessageCircle className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center">
                  <span className="text-destructive-foreground text-[10px]">
                    3
                  </span>
                </div>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">{user.name}</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start text-foreground hover:text-primary"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/slots">🎰 Slots</Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-foreground hover:text-primary"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/table-games">🎲 Table Games</Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-foreground hover:text-primary"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/sports">🏈 Sports</Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-foreground hover:text-primary"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/mini-games">🎯 Mini Games</Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-foreground hover:text-primary"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/bingo">🏆 Bingo</Link>
              </Button>

              {/* Mobile Balance */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {user.goldCoins.toLocaleString()} GC
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-accent/20 px-3 py-1 rounded-full">
                  <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-accent">
                    {user.sweepstakes.toFixed(2)} SC
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
