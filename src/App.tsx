import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import ReportIssue from "./pages/ReportIssue";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import IssueDetails from "./pages/IssueDetails";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/issue/:id" element={<IssueDetails />} />
              <Route path="/profile/:username?" element={<Profile />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
