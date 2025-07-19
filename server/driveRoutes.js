const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Load Google Drive credentials
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !CLIENT_ID) {
  console.error('Error: Google Drive credentials are not defined in your .env file.');
  process.exit(1);
}

// Initialize the Google Drive API client
const initDriveClient = () => {
  try {
    // For development/testing, we'll use a simpler auth approach
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    return google.drive({
      version: 'v3',
      auth
    });
  } catch (error) {
    console.error('Failed to initialize Google Drive client:', error);
    // Return a mock client for development
    return {
      files: {
        list: async () => ({ 
          data: { 
            files: [
              { 
                id: 'mock-id-1', 
                name: 'Sample Document.docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                webViewLink: 'https://docs.google.com/document/d/mock-id-1/view',
                iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                modifiedTime: new Date().toISOString()
              },
              { 
                id: 'mock-id-2', 
                name: 'Project Plan.xlsx',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                webViewLink: 'https://docs.google.com/spreadsheets/d/mock-id-2/view',
                iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                modifiedTime: new Date().toISOString()
              },
              { 
                id: 'mock-id-3', 
                name: 'Presentation.pptx',
                mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                webViewLink: 'https://docs.google.com/presentation/d/mock-id-3/view',
                iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.presentationml.presentation',
                modifiedTime: new Date().toISOString()
              }
            ] 
          } 
        }),
        get: async () => ({ 
          data: { 
            mimeType: 'text/plain',
            name: 'Mock File'
          }
        })
      }
    };
  }
};

const driveClient = initDriveClient();

// Google Drive API endpoints
module.exports = (app) => {
  // List files in Google Drive
  app.get('/api/drive/files', async (req, res) => {
    try {
      const response = await driveClient.files.list({
        pageSize: 50,
        fields: 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime)'
      });

      res.json({ files: response.data.files });
    } catch (error) {
      console.error('Error listing Drive files:', error);
      res.status(500).json({ error: 'Failed to list Drive files' });
    }
  });

  // Get file content (for text-based files)
  app.get('/api/drive/files/:id/content', async (req, res) => {
    try {
      // Get the file metadata first to check its type
      const fileMetadata = await driveClient.files.get({
        fileId: req.params.id,
        fields: 'mimeType,name'
      });

      const mimeType = fileMetadata.data.mimeType;

      // For mock/development data
      if (req.params.id.startsWith('mock-id')) {
        let mockContent;
        switch (req.params.id) {
          case 'mock-id-1':
            mockContent = "This is a sample Word document content.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquet tincidunt, nisl nunc tincidunt nunc, id tincidunt nisl nunc id aliquet.";
            break;
          case 'mock-id-2':
            mockContent = "Sample spreadsheet data:\n\nProject,Status,Deadline\nWebsite Redesign,In Progress,2025-08-15\nAPI Integration,Completed,2025-07-01\nMobile App,Planning,2025-09-30";
            break;
          case 'mock-id-3':
            mockContent = "Presentation Outline:\n\n1. Introduction\n2. Project Overview\n3. Timeline\n4. Budget\n5. Team Members\n6. Q&A";
            break;
          default:
            mockContent = "Sample content for mock file";
        }
        return res.json({ content: mockContent });
      }

      // Handle text-based files only for real data
      if (mimeType.startsWith('text/') || 
          mimeType === 'application/json' ||
          mimeType === 'application/xml' ||
          mimeType === 'application/javascript') {
        
        const response = await driveClient.files.get({
          fileId: req.params.id,
          alt: 'media'
        }, {
          responseType: 'text'
        });
        
        res.json({ content: response.data });
      } else {
        res.json({ content: `File preview not available for ${mimeType} files. Please open the file in Google Drive.` });
      }
    } catch (error) {
      console.error(`Error fetching Drive file content for ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch file content' });
    }
  });

  // Search files in Google Drive
  app.get('/api/drive/search', async (req, res) => {
    try {
      const query = req.query.q || '';
      
      const response = await driveClient.files.list({
        q: `name contains '${query}'`,
        pageSize: 20,
        fields: 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime)'
      });

      res.json({ files: response.data.files });
    } catch (error) {
      console.error('Error searching Drive files:', error);
      res.status(500).json({ error: 'Failed to search Drive files' });
    }
  });
};
