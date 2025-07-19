import { useNavigate } from "react-router-dom";
import DarkVeil from "./DarkVeil";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, FileSearch, Users, Zap, LogOut } from "lucide-react";
import { NotionDocuments } from "@/components/NotionDocuments";
import { NotionProvider } from "@/contexts/NotionContext";
import { useAuth } from "@/contexts/AuthContext";
import Chat from "@/Chat"; // ✅ Your merged component

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-muted flex flex-col justify-between">
      {/* Animated Live Wallpaper Background */}
      {darkMode ? (
        <div className="absolute inset-0 -z-10 w-full h-full">
          <DarkVeil />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/30 rounded-full animate-bounce-soft"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent/30 rounded-full animate-wiggle"></div>
        </div>
      )}
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Fetchly</h1>
                <p className="text-sm text-muted-foreground">Your Internal AI Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4" />
                  <span>Smart Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Team Resources</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Online
              </Badge>
              {/* Dark Theme Toggle */}
              <div className="flex items-center gap-2 ml-4">
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <span className="text-xs text-muted-foreground">Dark</span>
              </div>
              
              {/* Authentication Buttons */}
              <div className="flex gap-2 ml-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <button
                      className="text-sm text-muted-foreground underline hover:text-primary"
                      onClick={() => navigate('/profile')}
                      title="View Profile"
                    >
                      {user.email}
                    </button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate('/signin')}
                      variant="outline"
                      size="sm"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate('/signup')}
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* NotionDocuments removed from sidebar. Now only accessible via button/tab. */}
            <button
              onClick={() => navigate("/notion")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
            >
              View All Notion Files
            </button>
            <button
              onClick={() => navigate("/drive")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
            >
              View Google Drive Files
            </button>
          </div>

          {/* Main Chat */}
          <div className="lg:col-span-3">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
