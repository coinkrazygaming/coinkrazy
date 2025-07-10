import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LiveDataProvider } from "./contexts/LiveDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MiniGames from "./pages/MiniGames";
import AdminPanel from "./pages/AdminPanel";
import StaffPanel from "./pages/StaffPanel";
import GoldStore from "./pages/GoldStore";
import Slots from "./pages/Slots";
import TableGames from "./pages/TableGames";
import Sports from "./pages/Sports";
import Bingo from "./pages/Bingo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LiveDataProvider>
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
              <Route path="/table-games" element={<TableGames />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/bingo" element={<Bingo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LiveDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
