import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload, CheckCircle, AlertCircle, Plus } from "lucide-react";

interface Document {
  id: string;
  name: string;
  source: string;
  status: "active" | "processing" | "error";
  lastUpdated: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Employee Handbook",
    source: "Notion",
    status: "active",
    lastUpdated: "2 hours ago"
  },
  {
    id: "2", 
    name: "Leave Policies",
    source: "Google Docs",
    status: "active",
    lastUpdated: "1 day ago"
  },
  {
    id: "3",
    name: "Design Guidelines",
    source: "Confluence",
    status: "processing",
    lastUpdated: "5 min ago"
  },
  {
    id: "4",
    name: "IT Support Process",
    source: "Notion",
    status: "active", 
    lastUpdated: "3 days ago"
  }
];

export const DocumentStatus = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "processing":
        return <Upload className="w-4 h-4 text-warning animate-pulse" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Processing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Knowledge Base</h3>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Documents
        </Button>
      </div>
      
      <div className="space-y-3">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              {getStatusIcon(doc.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.source} • Updated {doc.lastUpdated}</p>
              </div>
            </div>
            {getStatusBadge(doc.status)}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>{mockDocuments.filter(d => d.status === "active").length}</strong> documents active • 
          <strong> {mockDocuments.filter(d => d.status === "processing").length}</strong> processing
        </p>
      </div>
    </Card>
  );
};