// src/components/NotionDocuments.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotion } from '@/contexts/NotionContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import './NotionDocuments.css';

interface NotionDocumentsProps {
  maxPerColumn?: number;
}

export const NotionDocuments: React.FC<NotionDocumentsProps> = ({
  maxPerColumn = Infinity
}) => {
  const {
    documents,
    isLoading,
    selectedDocument,
    error,
    addDocument,
    selectDocument
  } = useNotion();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPageUrl, setNewPageUrl] = useState('');
  const [addingPage, setAddingPage] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);

  // Show up to maxPerColumn of ALL documents
  const toShow = documents.slice(0, maxPerColumn);

  useEffect(() => {
    if (!isLoading && documents.length === 0) {
      console.warn('No documents found. Ensure Notion API is configured.');
    }
  }, [documents, isLoading]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="icon" />;
      case 'processing':
        return <Upload className="icon processing" />;
      case 'error':
        return <AlertCircle className="icon error" />;
      default:
        return <FileText className="icon" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="badge active">Active</Badge>;
      case 'processing':
        return <Badge className="badge processing">Processing</Badge>;
      case 'error':
        return <Badge className="badge error">Error</Badge>;
      default:
        return <Badge className="badge unknown">Unknown</Badge>;
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

  const handleDocumentClick = async (id: string) => {
    await selectDocument(id);
    setShowDocumentDialog(true);
  };

  return (
    <>
      <Card className="notion-card">
        <div className="header">
          <Button size="sm" variant="outline" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" /> Add Documents
          </Button>
        </div>

        <div className="notion-list">
          {isLoading && !documents.length ? (
            <div className="loading">Loading documents...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : toShow.length === 0 ? (
            <div className="empty">No documents to display.</div>
          ) : (
            toShow.map(doc => (
              <div
                key={doc.id}
                className={`notion-item ${doc.status}`}
                onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="info">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p>{doc.title}</p>
                    <p className="subtext">
                      Updated {doc.lastEditedTime || 'Recently'}
                    </p>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            ))
          )}
        </div>

        <div className="notion-footer">
          <strong>
            {documents.filter(d => d.status === 'active').length}
          </strong>{' '}
          active •{' '}
          <strong>
            {documents.filter(d => d.status === 'processing').length}
          </strong>{' '}
          processing
        </div>
      </Card>

      {/* Add Document Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notion Document</DialogTitle>
            <DialogDescription>
              Enter the URL of a Notion page to add to your knowledge base.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="https://www.notion.so/your-page"
            value={newPageUrl}
            onChange={e => setNewPageUrl(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={addingPage || !newPageUrl}>
              {addingPage ? 'Adding...' : 'Add Document'}
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
              <a
                href={selectedDocument.url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                View in Notion <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </DialogHeader>
          <ScrollArea className="scroll-area">
            {isLoading ? (
              <div className="loading">Loading content...</div>
            ) : selectedDocument?.content ? (
              <div className="content">
                {selectedDocument.content.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <div className="empty">No content available.</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
