import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/components/ChatMessage";
import { QuickActions } from "@/components/QuickActions";
import { ChatInput } from "@/components/ChatInput";
import { NotionDocuments } from "@/components/NotionDocuments";
import { NotionProvider } from "@/contexts/NotionContext";
import { Bot, FileSearch, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  source?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm DocuBuddy, your internal AI assistant. I can help you find information about company policies, processes, and resources. What would you like to know?",
      isUser: false,
      timestamp: "Just now"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: { content: string; source?: string } } = {
        "refund": {
          content: "Our refund policy allows customers to request full refunds within 30 days of purchase for digital products, and 60 days for physical products. Refunds are processed within 5-7 business days. For subscription services, refunds are prorated based on unused time.",
          source: "Notion Documents - Policies"
        },
        "leave": {
          content: "To apply for leave: 1) Submit a request through the HR portal at least 2 weeks in advance, 2) Get approval from your direct manager, 3) For extended leave (>5 days), HR approval is also required. You can access the HR portal through the company intranet.",
          source: "Notion Documents - HR Procedures"
        },
        "design": {
          content: "Design requests follow this approval chain: 1) Initial review by Design Team Lead, 2) Brand consistency check by Marketing Manager, 3) Final approval by Creative Director. For client-facing materials, additional approval from Account Manager is required.",
          source: "Notion Documents - Design Guidelines"
        },
        "branding": {
          content: "All brand assets are stored in our shared drive under 'Brand Assets > Current'. This includes logos, color palettes, fonts, and templates. You can also access them through the Brand Portal at brand.company.com using your company credentials.",
          source: "Notion Documents - Brand Assets"
        },
        "working": {
          content: "Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday. Flexible working arrangements are available with manager approval. Core collaboration hours when all team members should be available are 10:00 AM to 4:00 PM.",
          source: "Notion Documents - Company Handbook"
        },
        "support": {
          content: "For IT support: 1) Check the self-service IT portal first, 2) Submit a ticket through the help desk system, 3) For urgent issues, call the IT hotline at ext. 1234, 4) Emergency after-hours support is available at +1-555-0199.",
          source: "Notion Documents - IT Procedures"
        },
        "notion": {
          content: "Notion integration has been added successfully. You can now view, upload, and manage Notion documents directly from the sidebar. Click on 'Add Documents' to add new Notion pages using their URL.",
          source: "Notion Documents - Integration Guide"
        }
      };

      const lowerContent = content.toLowerCase();
      let response: { content: string; source?: string } = { 
        content: "I couldn't find specific information about that in the current documents. Could you try rephrasing your question or check if it relates to our available topics?"
      };

      // Simple keyword matching for demo
      for (const [key, value] of Object.entries(responses)) {
        if (lowerContent.includes(key)) {
          response = value;
          break;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: "Just now",
        source: response.source
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionSelect = (question: string) => {
    handleSendMessage(question);
  };

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
                <h1 className="text-xl font-bold text-foreground">DocuBuddy</h1>
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <QuickActions onQuestionSelect={handleQuestionSelect} />
            <NotionProvider>
              <NotionDocuments />
            </NotionProvider>
            {/* Notion Button */}
            <button
              onClick={() => navigate("/notion")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
            >
              View All Notion Files
            </button>
            {/* Google Drive Button */}
            <button
              onClick={() => navigate("/drive")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
            >
              View Google Drive Files
            </button>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-foreground">Ask DocuBuddy</h2>
                    <p className="text-sm text-muted-foreground">Get instant answers from your company documents</p>
                  </div>
                  <Badge variant="outline">
                    {messages.length - 1} questions asked
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    source={message.source}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <Card className="p-3 bg-muted animate-pulse">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm text-muted-foreground ml-2">DocuBuddy is thinking...</span>
                      </div>
                    </Card>
                  </div>
                )}
              </ScrollArea>

              <Separator />

              {/* Input */}
              <div className="p-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
