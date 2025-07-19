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

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Using Notion API Key: ${NOTION_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
  console.log(`Google Drive API: ${googleDriveService.isInitialized() ? 'Initialized ✓' : 'Using Mock Data ⚠️'}`);
});
