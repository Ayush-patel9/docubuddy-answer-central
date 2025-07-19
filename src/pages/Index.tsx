import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Bot, FileSearch, Users, Zap } from "lucide-react";
import { QuickActions } from "@/components/QuickActions";
import { NotionDocuments } from "@/components/NotionDocuments";
import { NotionProvider } from "@/contexts/NotionContext";
import Chat from "@/Chat"; // ✅ Your merged component

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
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
                  <Zap className="w-4 h-4" />
                  <span>Instant Answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Team Resources</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Online
              </Badge>
                  {/* Login/Sign Up Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="px-4 py-2 bg-secondary text-primary rounded-md border border-primary hover:bg-secondary/80"
                    >
                      Sign Up
                    </button>
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
            <QuickActions onQuestionSelect={(q) => {}} />
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
};

export default Index;
