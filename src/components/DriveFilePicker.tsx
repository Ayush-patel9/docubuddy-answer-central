import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Upload, Download, Eye, Clock, Loader2 } from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
}

const DriveFilePicker: React.FC = () => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>({});

  // Load Google Drive files
  const loadDriveFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/drive/files');
      setFiles(response.data.files || []);
    } catch (error) {
      console.error('Failed to load Drive files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Upload specific file to Gemini
  const uploadToGemini = async (file: DriveFile) => {
    setUploading(file.id);
    setUploadStatus({ ...uploadStatus, [file.id]: 'Uploading to Gemini...' });
    
    try {
      const response = await axios.post('/api/drive/gemini/upload-file', {
        fileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType
      });
      
      setUploadStatus({ 
        ...uploadStatus, 
        [file.id]: response.data.gemini?.message || 'Successfully uploaded to Gemini!' 
      });
    } catch (error) {
      console.error('Failed to upload to Gemini:', error);
      setUploadStatus({ 
        ...uploadStatus, 
        [file.id]: 'Failed to upload to Gemini' 
      });
    } finally {
      setUploading(null);
    }
  };

  // Get file type icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    return '📁';
  };

  // Format file size (mock for now)
  const formatFileSize = (size: number = 0) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load files on component mount
  useEffect(() => {
    loadDriveFiles();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Google Drive Files</h2>
                <p className="text-gray-600">Select files to upload to Gemini for AI analysis</p>
              </div>
            </div>
            <button
              onClick={loadDriveFiles}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Refresh Files
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading your Drive files...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p>Connect your Google Drive or add some files to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                >
                  {/* File Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{getFileIcon(file.mimeType)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {file.mimeType.split('/').pop()?.toUpperCase() || 'FILE'}
                      </p>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Modified: {formatDate(file.modifiedTime)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* View File Button */}
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View File
                      </a>
                    )}

                    {/* Upload to Gemini Button */}
                    <button
                      onClick={() => uploadToGemini(file)}
                      disabled={uploading === file.id}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {uploading === file.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploading === file.id ? 'Uploading...' : 'Upload to Gemini'}
                    </button>

                    {/* Status Message */}
                    {uploadStatus[file.id] && (
                      <div className={`text-xs p-2 rounded ${
                        uploadStatus[file.id].includes('Failed') || uploadStatus[file.id].includes('Error')
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : uploadStatus[file.id].includes('Successfully') || uploadStatus[file.id].includes('success')
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {uploadStatus[file.id]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveFilePicker;
