const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_BASE_URL = 'https://api.notion.com/v1';

if (!NOTION_API_KEY) {
  console.error('Error: NOTION_API_KEY is not defined in your .env file.');
  process.exit(1);
}

const notion = axios.create({
  baseURL: NOTION_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  },
});

app.post('/api/search', async (req, res) => {
  try {
    const response = await notion.post('/search', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching Notion:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to search Notion' });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const response = await notion.get(`/pages/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching Notion page ${req.params.id}:`, error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch Notion page' });
  }
});

app.get('/api/blocks/:id/children', async (req, res) => {
  try {
    const response = await notion.get(`/blocks/${req.params.id}/children`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching Notion block children for ${req.params.id}:`, error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch Notion block children' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
