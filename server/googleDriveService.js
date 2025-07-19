const { google } = require('googleapis');

class GoogleDriveService {
  constructor() {
    this.auth = null;
    this.drive = null;
    this.initializeAuth();
  }

  initializeAuth() {
    try {
      // Validate environment variables
      const {
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        GOOGLE_PRIVATE_KEY,
        GOOGLE_CLIENT_ID
      } = process.env;

      if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_ID) {
        throw new Error('Missing Google Drive credentials in environment variables');
      }

      // Clean up the private key (handle escaped newlines)
      const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

      // Create JWT auth
      this.auth = new google.auth.JWT({
        email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive'
        ]
      });

      // Initialize Drive API client
      this.drive = google.drive({
        version: 'v3',
        auth: this.auth
      });

      console.log('✓ Google Drive API initialized successfully');
    } catch (error) {
      console.error('✗ Failed to initialize Google Drive API:', error.message);
      this.auth = null;
      this.drive = null;
    }
  }

  async listFiles(options = {}) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const {
        pageSize = 30,
        query = '',
        orderBy = 'modifiedTime desc',
        pageToken = null
      } = options;

      const params = {
        pageSize,
        orderBy,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink, parents, createdTime, lastModifyingUser)',
        ...query && { q: query },
        ...pageToken && { pageToken }
      };

      const response = await this.drive.files.list(params);
      
      console.log(`✓ Retrieved ${response.data.files?.length || 0} files from Google Drive`);
      
      return {
        files: response.data.files || [],
        nextPageToken: response.data.nextPageToken || null,
        totalFiles: response.data.files?.length || 0
      };
    } catch (error) {
      console.error('✗ Error listing Google Drive files:', error.message);
      
      // Return mock data for development if API fails
      return this.getMockFiles();
    }
  }

  async getFileContent(fileId) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      // Get file metadata first
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size'
      });

      const { name, mimeType } = fileMetadata.data;

      // For Google Docs, Sheets, Slides - export as appropriate format
      if (mimeType === 'application/vnd.google-apps.document') {
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/plain'
        });
        return {
          content: response.data,
          fileName: name,
          mimeType: 'text/plain'
        };
      } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/csv'
        });
        return {
          content: response.data,
          fileName: name,
          mimeType: 'text/csv'
        };
      } else if (mimeType === 'application/vnd.google-apps.presentation') {
        const response = await this.drive.files.export({
          fileId,
          mimeType: 'text/plain'
        });
        return {
          content: response.data,
          fileName: name,
          mimeType: 'text/plain'
        };
      } else {
        // For other file types, get the raw content
        const response = await this.drive.files.get({
          fileId,
          alt: 'media'
        });
        return {
          content: response.data,
          fileName: name,
          mimeType
        };
      }
    } catch (error) {
      console.error(`✗ Error getting file content for ${fileId}:`, error.message);
      throw new Error(`Failed to retrieve file content: ${error.message}`);
    }
  }

  async searchFiles(query) {
    try {
      const searchQuery = `name contains '${query}' or fullText contains '${query}'`;
      return await this.listFiles({ query: searchQuery });
    } catch (error) {
      console.error('✗ Error searching Google Drive files:', error.message);
      return this.getMockFiles();
    }
  }

  getMockFiles() {
    return {
      files: [
        {
          id: 'mock-doc-1',
          name: 'Project Documentation.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '1024000',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://docs.google.com/document/d/mock-doc-1/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        {
          id: 'mock-sheet-1',
          name: 'Budget Analysis.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: '512000',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://docs.google.com/spreadsheets/d/mock-sheet-1/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        {
          id: 'mock-pdf-1',
          name: 'Report Summary.pdf',
          mimeType: 'application/pdf',
          size: '2048000',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://drive.google.com/file/d/mock-pdf-1/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf'
        }
      ],
      nextPageToken: null,
      totalFiles: 3
    };
  }

  isInitialized() {
    return this.auth !== null && this.drive !== null;
  }
}

module.exports = new GoogleDriveService();
