import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Clock, Users, FileText, CreditCard, Calendar } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  question: string;
  icon: React.ReactNode;
  category: string;
}

const quickActions: QuickAction[] = [
  {
    id: "refund",
    label: "Refund Policy",
    question: "What's our refund policy?",
    icon: <CreditCard className="w-4 h-4" />,
    category: "Policies"
  },
  {
    id: "leave",
    label: "Leave Application", 
    question: "How do I apply for leave?",
    icon: <Calendar className="w-4 h-4" />,
    category: "HR"
  },
  {
    id: "design-approval",
    label: "Design Approvals",
    question: "Who approves design requests?",
    icon: <Users className="w-4 h-4" />,
    category: "Process"
  },
  {
    id: "branding",
    label: "Brand Assets",
    question: "Where do I find our branding assets?",
    icon: <FileText className="w-4 h-4" />,
    category: "Resources"
  },
  {
    id: "working-hours",
    label: "Working Hours",
    question: "What are our standard working hours?",
    icon: <Clock className="w-4 h-4" />,
    category: "Policies"
  },
  {
    id: "help",
    label: "IT Support",
    question: "How do I contact IT support?",
    icon: <HelpCircle className="w-4 h-4" />,
    category: "Support"
  }
];

interface QuickActionsProps {
  onQuestionSelect: (question: string) => void;
}

export const QuickActions = ({ onQuestionSelect }: QuickActionsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Questions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="h-auto p-3 flex flex-col items-center gap-2 text-center hover:bg-muted"
            onClick={() => onQuestionSelect(action.question)}
          >
            {action.icon}
            <div>
              <div className="text-xs font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.category}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};