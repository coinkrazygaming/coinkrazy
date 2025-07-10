import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  User,
  Menu,
  X,
  Gift,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveData } from "@/contexts/LiveDataContext";

export default function CasinoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { stats } = useLiveData();

  return (
    <header className="bg-card border-b border-border casino-glow sticky top-0 z-50">
      {/* Top Row - Logo and User Info */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center casino-pulse p-1">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcbaa5477f6b142f38d01e67993167a9f%2F7884809e513c4e87b5cca659ca86cf77?format=webp&width=800"
                  alt="CoinKrazy Logo"
                  className="w-10 h-10 object-contain"
                />
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

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {user.gold_coins.toLocaleString()} GC
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-accent/20 px-3 py-1 rounded-full">
                  <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-accent">
                    {user.sweeps_coins.toFixed(2)} SC
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    -- GC
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-accent/20 px-3 py-1 rounded-full">
                  <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-accent">-- SC</span>
                </div>
              </div>
            )}

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

              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">
                        {user.username}
                      </span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Login</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
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
      </div>

      {/* Second Row - Navigation Menus */}
      <div className="bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Main Casino Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
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

            {/* Gamers Dashboard Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Dashboard:</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent"
                asChild
              >
                <Link to="/dashboard">👤 Profile</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent"
                asChild
              >
                <Link to="/dashboard">💰 Transactions</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent"
                asChild
              >
                <Link to="/dashboard">🎮 Game History</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent"
                asChild
              >
                <Link to="/dashboard">🛡️ KYC</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent"
                asChild
              >
                <Link to="/dashboard">🎁 Bonuses</Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Casino Games */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Casino Games
              </h3>
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
              </div>
            </div>

            {/* Dashboard Menu */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Dashboard
              </h3>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-accent"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/dashboard">👤 Profile</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-accent"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/dashboard">💰 Transactions</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-accent"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/dashboard">🎮 Game History</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-accent"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/dashboard">🛡️ KYC</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-foreground hover:text-accent"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/dashboard">🎁 Bonuses</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Balance */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
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
    </header>
  );
}
