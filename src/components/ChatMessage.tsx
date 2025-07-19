import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Bot, FileText } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  source?: string;
  timestamp?: string;
}

export const ChatMessage = ({ message, isUser, source, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`p-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-card border'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
          
          {source && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <Badge variant="secondary" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Source: {source}
              </Badge>
            </div>
          )}
        </Card>
        
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1 px-1">
            {timestamp}
          </p>
        )}
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 bg-secondary">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};