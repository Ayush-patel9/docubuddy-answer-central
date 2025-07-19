import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, Upload, CheckCircle, AlertCircle, Plus, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotion } from '@/contexts/NotionContext';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NotionDocuments = () => {
  const { documents, isLoading, selectedDocument, error, addDocument, selectDocument } = useNotion();
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [newPageUrl, setNewPageUrl] = useState<string>('');
  const [addingPage, setAddingPage] = useState<boolean>(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState<boolean>(false);

  useEffect(() => {
    console.log('Documents state updated:', documents);
    if (documents.length === 0 && !isLoading) {
      console.log('No documents found. Ensure Notion API is configured correctly.');
    }
  }, [documents, isLoading]);

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

  const handleAddDocument = async () => {
    if (!newPageUrl) return;
    
    setAddingPage(true);
    const success = await addDocument(newPageUrl);
    
    if (success) {
      setNewPageUrl('');
      setShowAddDialog(false);
    }
    
    setAddingPage(false);
  };

  const handleDocumentClick = async (documentId: string) => {
    await selectDocument(documentId);
    setShowDocumentDialog(true);
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Notion Files</h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Documents
          </Button>
        </div>
        
        <div className="space-y-3">
          {isLoading && !documents.length ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading documents...
            </div>
          ) : error ? (
            <div className="p-4 text-destructive text-sm bg-destructive/10 rounded-lg">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No Notion documents added yet. Click "Add Documents" to get started.
            </div>
          ) : (
            documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(doc.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">Notion • Updated {doc.lastEditedTime || 'Recently'}</p>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>{documents.filter(d => d.status === "active").length}</strong> documents active • 
            <strong> {documents.filter(d => d.status === "processing").length}</strong> processing
          </p>
        </div>
      </Card>

      {/* Add Document Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notion Document</DialogTitle>
            <DialogDescription>
              Enter the URL of a Notion page to add it to your knowledge base
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input 
              placeholder="https://www.notion.so/your-page-name-123456789"
              value={newPageUrl}
              onChange={(e) => setNewPageUrl(e.target.value)}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddDocument} disabled={addingPage || !newPageUrl}>
              {addingPage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : "Add Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Content Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title || 'Document'}</DialogTitle>
            {selectedDocument?.url && (
              <div className="flex items-center gap-2">
                <a 
                  href={selectedDocument.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  View in Notion <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading document content...
              </div>
            ) : selectedDocument?.content ? (
              <div className="p-4 prose prose-sm max-w-none max-h-[300px] overflow-y-auto">
              {selectedDocument.content.split('\n').map((paragraph, idx) => (
                paragraph ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No content available for this document.
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
