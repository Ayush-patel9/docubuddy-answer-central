import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import NotionPage from "./pages/NotionPage";
import DrivePage from "./pages/DrivePage";
import OAuth2Callback from "./pages/OAuth2Callback";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Chat from "./Chat"; // ✅ corrected path if Chat.tsx is in pages folder

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/oauth2callback" element={<OAuth2Callback />} />
            <Route path="/notion" element={<NotionPage />} />
            <Route path="/drive" element={<DrivePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
