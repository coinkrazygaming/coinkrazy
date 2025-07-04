import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MiniGames from "./pages/MiniGames";
import AdminPanel from "./pages/AdminPanel";
import StaffPanel from "./pages/StaffPanel";
import GoldStore from "./pages/GoldStore";
import Slots from "./pages/Slots";

const queryClient = new QueryClient();

// Placeholder pages for future development

const TableGamesPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">🎲 Table Games</h1>
      <p className="text-muted-foreground">
        Blackjack, Roulette, Baccarat and more!
      </p>
    </div>
  </div>
);

const SportsPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">🏈 Sportsbook</h1>
      <p className="text-muted-foreground">
        Bet on virtual sports and live events!
      </p>
    </div>
  </div>
);

const MiniGamesPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">🎯 Mini Games</h1>
      <p className="text-muted-foreground">
        Play daily for FREE Sweepstakes Cash!
      </p>
    </div>
  </div>
);

const BingoPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">🏆 Bingo Hall</h1>
      <p className="text-muted-foreground">
        Live bingo games with real prizes!
      </p>
    </div>
  </div>
);

const DashboardPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        ��� Player Dashboard
      </h1>
      <p className="text-muted-foreground">
        Manage your account, view history, and more!
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mini-games" element={<MiniGames />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/staff" element={<StaffPanel />} />
          <Route path="/store" element={<GoldStore />} />
          <Route path="/gold-store" element={<GoldStore />} />
          <Route path="/slots" element={<Slots />} />
          <Route path="/table-games" element={<TableGamesPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/bingo" element={<BingoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
