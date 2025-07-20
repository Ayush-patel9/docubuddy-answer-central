const express = require('express');
const cors = require('cors');
const axios = require('axios');
const googleDriveService = require('./googleDriveService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Get Notion API key from environment variable or use the hardcoded one
// In production, always use environment variables for sensitive data
const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';
const NOTION_API_VERSION = '2022-06-28';

// Create axios instance for Notion API
const notionAPI = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_API_VERSION,
    'Content-Type': 'application/json',
  }
});

// Route for searching Notion pages
app.post('/api/search', async (req, res) => {
  try {
    console.log('Proxy server: Received search request');
    const response = await notionAPI.post('/search', req.body);
    console.log('Proxy server: Successfully retrieved search results');
    res.json(response.data);
  } catch (error) {
    console.error('Proxy server error on /api/search:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to search Notion',
      details: error.response?.data || error.message
    });
  }
});

// Route for fetching page content
app.get('/api/blocks/:pageId/children', async (req, res) => {
  try {
    console.log(`Proxy server: Fetching block children for page ${req.params.pageId}`);
    const response = await notionAPI.get(`/blocks/${req.params.pageId}/children`);
    console.log('Proxy server: Successfully retrieved block children');
    res.json(response.data);
  } catch (error) {
    console.error(`Proxy server error on /api/blocks/${req.params.pageId}/children:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch block children',
      details: error.response?.data || error.message
    });
  }
});

// Route for fetching a specific page
app.get('/api/pages/:pageId', async (req, res) => {
  try {
    console.log(`Proxy server: Fetching page ${req.params.pageId}`);
    const response = await notionAPI.get(`/pages/${req.params.pageId}`);
    console.log('Proxy server: Successfully retrieved page');
    res.json(response.data);
  } catch (error) {
    console.error(`Proxy server error on /api/pages/${req.params.pageId}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch page',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Google Drive API Routes
app.get('/api/drive/files', async (req, res) => {
  try {
    console.log('Fetching Google Drive files...');
    const { page, query, pageSize = 20 } = req.query;
    
    const options = {
      pageSize: parseInt(pageSize),
      ...(query && { query }),
      ...(page && { pageToken: page })
    };

    const result = await googleDriveService.listFiles(options);
    
    res.json({
      success: true,
      data: result,
      apiInitialized: googleDriveService.isInitialized()
    });
  } catch (error) {
    console.error('Error fetching Google Drive files:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Google Drive files',
      details: error.message,
      apiInitialized: googleDriveService.isInitialized()
    });
  }
});

app.get('/api/drive/files/:fileId/content', async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log(`Fetching content for file: ${fileId}`);
    
    const result = await googleDriveService.getFileContent(fileId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`Error fetching file content for ${req.params.fileId}:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file content',
      details: error.message
    });
  }
});

app.get('/api/drive/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    console.log(`Searching Google Drive files for: ${q}`);
    const result = await googleDriveService.searchFiles(q);
    
    res.json({
      success: true,
      data: result,
      query: q
    });
  } catch (error) {
    console.error('Error searching Google Drive files:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search Google Drive files',
      details: error.message
    });
  }
});

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Get recently accessed files from Google Drive (latest 3)
app.get('/api/drive/recent', async (req, res) => {
  try {
    console.log('Fetching recent Google Drive files from specific folder...');
    
    // Your specific Google Drive folder ID
    const FOLDER_ID = '1zXkSacSoBdfbg0hm5ndXSkjyZO5tsqG6';
    
    const result = await googleDriveService.listFiles({
      pageSize: 50, // Get more files to sort properly
      query: `'${FOLDER_ID}' in parents and trashed=false`,
      orderBy: 'createdTime' // Sort by creation time, oldest first
    });

    console.log('Google Drive API result:', result);

    if (result && result.files && result.files.length > 0) {
      // Sort files by creation date (oldest to newest) and take top 3
      const sortedFiles = result.files
        .filter(file => file.createdTime || file.modifiedTime) // Only files with timestamps
        .sort((a, b) => new Date(a.createdTime || a.modifiedTime) - new Date(b.createdTime || b.modifiedTime))
        .slice(0, 3)
        .map(file => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink: file.webViewLink,
          iconLink: file.iconLink,
          createdTime: file.createdTime || file.modifiedTime,
          modifiedTime: file.modifiedTime,
          timeAgo: getTimeAgo(file.createdTime || file.modifiedTime),
          size: file.size
        }));

      console.log(`Found and sorted ${sortedFiles.length} files from your Drive folder`);
      res.json({
        success: true,
        files: sortedFiles,
        totalFound: result.files.length
      });
    } else {
      console.log('No files found in the folder, using fallback data');
      throw new Error('No files found in Google Drive folder');
    }
  } catch (error) {
    console.error('Error fetching recent Google Drive files:', error.message);
    
    // Return mock data as fallback
    const mockRecentFiles = [
      {
        id: 'fallback-1',
        name: 'Employee Handbook.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        webViewLink: 'https://docs.google.com/document/d/fallback-1/view',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdTime: new Date('2024-01-15').toISOString(),
        timeAgo: 'Jan 15, 2024'
      },
      {
        id: 'fallback-2',
        name: 'Marketing Strategy.pdf',
        mimeType: 'application/pdf',
        webViewLink: 'https://docs.google.com/document/d/fallback-2/view',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
        createdTime: new Date('2024-02-01').toISOString(),
        timeAgo: 'Feb 1, 2024'
      },
      {
        id: 'fallback-3',
        name: 'API Documentation.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        webViewLink: 'https://docs.google.com/document/d/fallback-3/view',
        iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdTime: new Date('2024-03-10').toISOString(),
        timeAgo: 'Mar 10, 2024'
      }
    ];
    
    res.json({
      success: true,
      files: mockRecentFiles,
      fallback: true,
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Using Notion API Key: ${NOTION_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
  console.log(`Google Drive API: ${googleDriveService.isInitialized() ? 'Initialized ✓' : 'Using Mock Data ⚠️'}`);
});
