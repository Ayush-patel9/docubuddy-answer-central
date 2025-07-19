import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { listFiles, getFileContent, DriveFile, formatFileSize, getFileType } from '@/lib/googleDriveService';
import { googleAuth } from '@/lib/googleAuth';

interface DriveContextType {
  files: DriveFile[];
  isLoading: boolean;
  selectedFile: DriveFile | null;
  fileContent: string | null;
  error: string | null;
  apiInitialized: boolean;
  isAuthenticated: boolean;
  refreshFiles: () => Promise<void>;
  selectFile: (fileId: string) => Promise<void>;
  searchFiles: (query: string) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiInitialized, setApiInitialized] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    setIsAuthenticated(googleAuth.isAuthenticated());
  }, []);

  // Fetch documents on initial load only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshFiles();
    }
  }, [isAuthenticated]);

  const refreshFiles = async (): Promise<void> => {
    console.log('🚀 DriveContext: Starting refreshFiles...');
    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 DriveContext: Calling listFiles API...');
      const response = await listFiles({ pageSize: 50 });
      console.log('📡 DriveContext: API Response:', response);
      
      if (response.success) {
        console.log('✅ DriveContext: Successfully fetched files:', response.data.files.length, 'files');
        setFiles(response.data.files);
        setApiInitialized(response.apiInitialized);
      } else {
        throw new Error(response.error || 'Failed to fetch files');
      }
    } catch (err: any) {
      console.error('❌ DriveContext: Error in refreshFiles:', err);
      setError('Failed to load Google Drive files: ' + (err.message || 'Unknown error'));
      setApiInitialized(false);
    } finally {
      console.log('🏁 DriveContext: refreshFiles completed');
      setIsLoading(false);
    }
  };

  const selectFile = async (fileId: string): Promise<void> => {
    setIsLoading(true);
    setFileContent(null);
    
    try {
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      setSelectedFile(file);
      
      const response = await getFileContent(fileId);
      
      if (response.success) {
        setFileContent(response.data.content);
      } else {
        throw new Error(response.error || 'Failed to fetch file content');
      }
    } catch (err: any) {
      setError('Failed to fetch file content: ' + (err.message || 'Unknown error'));
      console.error('Error fetching file content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchFiles = async (query: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Searching Google Drive files for: ${query}`);
      const response = await listFiles({ query, pageSize: 20 });
      
      if (response.success) {
        console.log('Search results:', response.data.files);
        setFiles(response.data.files);
        setApiInitialized(response.apiInitialized);
      } else {
        throw new Error(response.error || 'Failed to search files');
      }
    } catch (err: any) {
      setError('Failed to search Google Drive files: ' + (err.message || 'Unknown error'));
      console.error('Error searching Google Drive files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DriveContext.Provider 
      value={{
        files,
        isLoading,
        selectedFile,
        fileContent,
        error,
        apiInitialized,
        isAuthenticated,
        refreshFiles,
        selectFile,
        searchFiles
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = (): DriveContextType => {
  const context = useContext(DriveContext);
  
  if (context === undefined) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  
  return context;
};
