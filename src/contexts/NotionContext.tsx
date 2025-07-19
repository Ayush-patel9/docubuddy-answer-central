import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchNotionPages, 
  addNotionPage, 
  fetchNotionPageContent,
  NotionDocument 
} from '@/services/notionService';

interface NotionContextType {
  documents: NotionDocument[];
  isLoading: boolean;
  selectedDocument: NotionDocument | null;
  error: string | null;
  refreshDocuments: () => Promise<void>;
  addDocument: (pageUrl: string) => Promise<boolean>;
  selectDocument: (documentId: string) => Promise<void>;
}

const NotionContext = createContext<NotionContextType | undefined>(undefined);

export const NotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<NotionDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<NotionDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents on initial load
  useEffect(() => {
    const fetchInitialDocuments = async () => {
      await refreshDocuments();
    };

    fetchInitialDocuments();
  }, []);

  const refreshDocuments = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching Notion documents...');
      const notionDocs = await fetchNotionPages();
      console.log('Fetched documents:', notionDocs);
      setDocuments(notionDocs);
    } catch (err) {
      setError('Failed to load Notion documents');
      console.error('Error fetching Notion documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addDocument = async (pageUrl: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newDoc = await addNotionPage(pageUrl);
      
      if (!newDoc) {
        throw new Error('Failed to add document');
      }
      
      setDocuments(prev => [...prev, newDoc]);
      return true;
    } catch (err) {
      setError('Failed to add Notion document');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const selectDocument = async (documentId: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const doc = documents.find(d => d.id === documentId);
      
      if (!doc) {
        throw new Error('Document not found');
      }
      
      // Only fetch content if it doesn't exist yet
      if (!doc.content) {
        const content = await fetchNotionPageContent(documentId);
        const updatedDoc = { ...doc, content };
        
        // Update document in the list
        setDocuments(docs => 
          docs.map(d => d.id === documentId ? updatedDoc : d)
        );
        
        setSelectedDocument(updatedDoc);
      } else {
        setSelectedDocument(doc);
      }
    } catch (err) {
      setError('Failed to load document content');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    documents,
    isLoading,
    selectedDocument,
    error,
    refreshDocuments,
    addDocument,
    selectDocument
  };

  return (
    <NotionContext.Provider value={value}>
      {children}
    </NotionContext.Provider>
  );
};

export const useNotion = (): NotionContextType => {
  const context = useContext(NotionContext);
  if (context === undefined) {
    throw new Error('useNotion must be used within a NotionProvider');
  }
  return context;
};
