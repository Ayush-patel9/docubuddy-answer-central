import { useState } from "react";
import { ChatMessage } from "@/components/ui/ChatMessage";
import { ChatInput } from "@/components/ui/ChatInput";

interface Message {
  message: string;
  isUser: boolean;
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (msg: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { message: msg, isUser }]);

    if (isUser) {
      setIsLoading(true);
    }

    if (!isUser) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.message} isUser={msg.isUser} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
