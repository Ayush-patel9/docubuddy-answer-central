// Frontend Google Drive Service - directly communicates with Google Drive API
import { googleAuth } from './googleAuth';

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
  parents?: string[];
  createdTime?: string;
}

export interface DriveApiResponse {
  success: boolean;
  data: {
    files: DriveFile[];
    nextPageToken?: string;
    totalFiles: number;
  };
  apiInitialized: boolean;
  error?: string;
  details?: string;
}

export interface FileContentResponse {
  success: boolean;
  data: {
    content: string;
    fileName: string;
    mimeType: string;
  };
  error?: string;
  details?: string;
}

export const listFiles = async (options: {
  pageSize?: number;
  query?: string;
  pageToken?: string;
} = {}): Promise<DriveApiResponse> => {
  try {
    console.log('🌐 GoogleDriveService: Starting listFiles with options:', options);
    
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available. Please sign in to Google Drive.');
    }

    const { pageSize = 20, query, pageToken } = options;
    
    const params = new URLSearchParams();
    params.append('pageSize', pageSize.toString());
    params.append('fields', 'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,parents,createdTime)');
    
    if (query) {
      params.append('q', `name contains '${query}' and trashed=false`);
    } else {
      params.append('q', 'trashed=false');
    }
    
    if (pageToken) params.append('pageToken', pageToken);

    const url = `${GOOGLE_DRIVE_API_BASE}/files?${params}`;
    console.log('🌐 GoogleDriveService: Making request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🌐 GoogleDriveService: Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, sign out and require re-authentication
        googleAuth.signOut();
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🌐 GoogleDriveService: Response data:', data);
    
    const driveResponse: DriveApiResponse = {
      success: true,
      data: {
        files: data.files || [],
        nextPageToken: data.nextPageToken,
        totalFiles: data.files?.length || 0,
      },
      apiInitialized: true,
    };
    
    console.log('✅ GoogleDriveService: Successfully fetched Google Drive files');
    return driveResponse;
  } catch (error) {
    console.error('❌ GoogleDriveService: Error fetching Google Drive files:', error);
    
    return {
      success: false,
      data: {
        files: [],
        totalFiles: 0,
      },
      apiInitialized: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getFileContent = async (fileId: string): Promise<FileContentResponse> => {
  try {
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available. Please sign in to Google Drive.');
    }

    const response = await fetch(`${GOOGLE_DRIVE_API_BASE}/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        googleAuth.signOut();
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    const contentType = response.headers.get('Content-Type') || 'text/plain';
    
    console.log(`✓ Successfully fetched content for file: ${fileId}`);
    return {
      success: true,
      data: {
        content,
        fileName: fileId,
        mimeType: contentType,
      },
    };
  } catch (error) {
    console.error(`✗ Error fetching file content for ${fileId}:`, error);
    return {
      success: false,
      data: {
        content: '',
        fileName: '',
        mimeType: '',
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const searchFiles = async (query: string): Promise<DriveApiResponse> => {
  try {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available. Please sign in to Google Drive.');
    }

    const params = new URLSearchParams();
    params.append('q', `name contains '${query}' and trashed=false`);
    params.append('fields', 'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,parents,createdTime)');

    const response = await fetch(`${GOOGLE_DRIVE_API_BASE}/files?${params}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        googleAuth.signOut();
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✓ Successfully searched Google Drive files for: ${query}`);
    
    return {
      success: true,
      data: {
        files: data.files || [],
        nextPageToken: data.nextPageToken,
        totalFiles: data.files?.length || 0,
      },
      apiInitialized: true,
    };
  } catch (error) {
    console.error(`✗ Error searching Google Drive files:`, error);
    return {
      success: false,
      data: {
        files: [],
        totalFiles: 0,
      },
      apiInitialized: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Helper function to format file size
export const formatFileSize = (bytes: string | number): string => {
  if (!bytes) return 'Unknown';
  
  const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let fileSize = size;
  
  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }
  
  return `${fileSize.toFixed(1)} ${units[index]}`;
};

// Helper function to get file type from mimeType
export const getFileType = (mimeType: string): string => {
  const typeMap: { [key: string]: string } = {
    'application/vnd.google-apps.document': 'Google Doc',
    'application/vnd.google-apps.spreadsheet': 'Google Sheet',
    'application/vnd.google-apps.presentation': 'Google Slides',
    'application/pdf': 'PDF',
    'text/plain': 'Text File',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image'
  };
  
  return typeMap[mimeType] || 'Unknown File Type';
};