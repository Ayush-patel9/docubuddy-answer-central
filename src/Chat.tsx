import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Chat.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      const botMsg = { sender: "Bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { sender: "Error", text: "Failed to get response." };
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
      <div className="chat-box" ref={chatRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`message ${msg.sender === "You" ? "you" : "bot"}`}
            >
              <div className="avatar">{msg.sender === "You" ? "🧑‍💻" : "🤖"}</div>
              <div className="bubble">
                <strong>{msg.sender}:</strong> {msg.text}
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

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
