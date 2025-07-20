import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Image, Video, Music, Archive, File, Search, ExternalLink, FolderOpen } from 'lucide-react';
import { useDrive } from '@/contexts/DriveContext';
import { formatFileSize } from '@/lib/googleDriveService';

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('image/')) return <Image className="w-5 h-5 text-blue-500" />;
  if (mimeType.includes('video/')) return <Video className="w-5 h-5 text-purple-500" />;
  if (mimeType.includes('audio/')) return <Music className="w-5 h-5 text-green-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-5 h-5 text-orange-500" />;
  if (mimeType.includes('text/') || mimeType.includes('document')) return <FileText className="w-5 h-5 text-gray-600" />;
  return <File className="w-5 h-5 text-gray-500" />;
};

const getFileTypeColor = (mimeType: string) => {
  if (mimeType.includes('image/')) return 'bg-blue-100 text-blue-800';
  if (mimeType.includes('video/')) return 'bg-purple-100 text-purple-800';
  if (mimeType.includes('audio/')) return 'bg-green-100 text-green-800';
  if (mimeType.includes('application/pdf')) return 'bg-red-100 text-red-800';
  if (mimeType.includes('document') || mimeType.includes('text/')) return 'bg-blue-100 text-blue-800';
  if (mimeType.includes('spreadsheet')) return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

export const GoogleDriveFiles = () => {
  const { files, isLoading, error, refreshFiles, searchFiles } = useDrive();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Direct link to the Google Drive folder
  const driveFolderLink = 'https://drive.google.com/drive/folders/1zXkSacSoBdfbg0hm5ndXSkjyZO5tsqG6';

  // Sort files by modification date
  const sortedFiles = useMemo(() => {
    if (!files.length) return [];
    
    return [...files].sort((a, b) => {
      const dateA = new Date(a.modifiedTime).getTime();
      const dateB = new Date(b.modifiedTime).getTime();
      
      return sortDirection === 'asc' 
        ? dateA - dateB  // oldest first
        : dateB - dateA; // newest first
    });
  }, [files, sortDirection]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchFiles(searchQuery);
    } else {
      await refreshFiles();
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading Google Drive files...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">
            <p>Error: {error}</p>
            <Button onClick={refreshFiles} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            📁 Google Drive Files ({files.length})
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(driveFolderLink, '_blank')}
              title="Open Google Drive folder"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={toggleSortDirection} variant="outline" size="sm" title={`Sort by date (${sortDirection === 'asc' ? 'oldest first' : 'newest first'})`}>
              {sortDirection === 'asc' ? '↑ Date' : '↓ Date'}
            </Button>
            <Button onClick={refreshFiles} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No files found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFiles.map((file) => (
              <div
                key={file.id || `file-${file.name}-${file.modifiedTime}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.mimeType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge className={`text-xs ${getFileTypeColor(file.mimeType)}`}>
                        {file.mimeType.split('/').pop()?.toUpperCase() || 'FILE'}
                      </Badge>
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      <span>Modified: {formatDate(file.modifiedTime)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.webViewLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.webViewLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleDriveFiles;
