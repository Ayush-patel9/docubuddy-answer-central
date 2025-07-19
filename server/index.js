const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Using Notion API Key: ${NOTION_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});
