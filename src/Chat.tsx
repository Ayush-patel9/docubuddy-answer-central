import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMsg = { sender: "You", text: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: trimmedInput,
      });

      const botMsg = { sender: "Bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { sender: "Error", text: "⚠️ Failed to get response." };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-gray-50 flex flex-col">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">AI Chat</h1>

      <div className="flex-1 overflow-y-auto bg-white border rounded-xl shadow-lg p-4 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
              msg.sender === "You"
                ? "ml-auto bg-blue-500 text-white text-right"
                : msg.sender === "Bot"
                ? "mr-auto bg-green-100 text-gray-800"
                : "mr-auto bg-red-100 text-red-700"
            }`}
          >
            <div className="text-sm font-semibold">{msg.sender}</div>
            <div className="text-base">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
