import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import GoogleChartVisualization from "@/components/GoogleChartVisualization";
import GoogleDriveAuth from "@/components/GoogleDriveAuth";
import { RealTimeExcelService } from "@/services/realTimeExcelService";
import { googleAuth } from "@/lib/googleAuth";
import "./Chat.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{
    sender: string;
    text: string;
    chartPrompt?: string;
    isChart?: boolean;
  }[]>([
    {
      sender: "Bot",
      text:
        "👋 Hi! I can help you with documents and create charts from Excel files in your Google Drive. First, please connect to Google Drive to access your files.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = googleAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) loadAvailableFiles();
    };
    checkAuth();
  }, []);

  const loadAvailableFiles = async () => {
    try {
      const files = await RealTimeExcelService.getAvailableFiles();
      if (files.length > 0) {
        const fileList = files.map((f) => `• ${f.name}`).join("\n");
        setMessages((prev) => [
          ...prev,
          {
            sender: "Bot",
            text: `📁 Found ${files.length} Excel file(s) in your Google Drive:\n${fileList}\n\nYou can ask me to create charts from any of these files!`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Bot",
            text:
              "📁 No Excel files found in your Google Drive folder. Please upload some .xlsx or .xls files to create charts.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading Excel files:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Bot",
          text:
            "⚠️ Could not access Google Drive. Please make sure you're signed in.",
        },
      ]);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "Bot",
        text:
          "✅ Successfully connected to Google Drive! Loading your Excel files...",
      },
    ]);
    setTimeout(loadAvailableFiles, 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "Bot",
          text:
            "🔐 Please connect to Google Drive first to access your Excel files and create charts.",
        },
      ]);
      return;
    }

    const userMsg = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const chartKeywords = [
        "chart",
        "graph",
        "visualize",
        "plot",
        "show me",
        "create",
        "generate",
      ];
      const isChartRequest = chartKeywords.some((keyword) =>
        userInput.toLowerCase().includes(keyword)
      );

      if (isChartRequest) {
        const chartMsg = {
          sender: "Bot",
          text: "📊 Generating chart from your Excel data...",
          chartPrompt: userInput,
          isChart: true,
        };
        setMessages((prev) => [...prev, chartMsg]);
      } else {
        const res = await axios.post("http://localhost:8000/chat", {
          message: userInput,
        });
        const botMsg = { sender: "Bot", text: res.data.reply };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = {
        sender: "Error",
        text: `Failed to get response: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      };
      setMessages((prev) => [...prev, errMsg]);
    }

    setIsTyping(false);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Header */}

      {/* Auth Prompt */}
      {!isAuthenticated && (
        <div className="auth-frame">
          <GoogleDriveAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      )}

      {/* Chat Log Frame */}
      <div className="chat-frame" ref={chatRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`message ${
                msg.sender === "You" ? "you" : "bot"
              }`}
            >
              <div className="avatar">
                {msg.sender === "You" ? "🧑‍💻" : "🤖"}
              </div>
              <div className="bubble">
                <strong>{msg.sender}:</strong> {msg.text}
                {msg.isChart && msg.chartPrompt && (
                  <GoogleChartVisualization
                    prompt={msg.chartPrompt}
                    onComplete={(success, error) => {
                      if (!success && error) {
                        setMessages((prev) =>
                          prev.map((m, i) =>
                            i === prev.length - 1
                              ? {
                                  ...m,
                                  text: `❌ Chart generation failed: ${error}`,
                                }
                              : m
                          )
                        );
                      }
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="message bot"
            >
              <div className="avatar">🤖</div>
              <div className="bubble typing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Frame */}
      <div className="input-frame">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            isAuthenticated
              ? "Try: 'Show me a pie chart of sales data'"
              : "🔐 Connect to Google Drive first"
          }
          disabled={!isAuthenticated}
          className={!isAuthenticated ? "disabled-input" : ""}
        />
        <button
          onClick={handleSend}
          disabled={!isAuthenticated}
          className={!isAuthenticated ? "disabled-btn" : ""}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
