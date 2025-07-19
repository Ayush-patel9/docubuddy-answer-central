// Notion API Service for DocuBuddy

// Use our proxy server to avoid CORS issues
const PROXY_API_URL = 'http://localhost:3001/api';

/**
 * Notion document interface
 */
export interface NotionDocument {
  id: string;
  title: string;
  lastEditedTime?: string;
  url?: string;
  icon?: string;
  content?: string;
  status: 'active' | 'processing' | 'error';
}

/**
 * Fetch Notion pages (documents) from a database
 */
export const fetchNotionPages = async (databaseId?: string): Promise<NotionDocument[]> => {
  try {
    console.log('Sending request to Notion API via proxy...');
    let endpoint = `${PROXY_API_URL}/search`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          value: 'page',
          property: 'object'
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time'
        }
      })
    });

    console.log('Received response from Notion API:', response);

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Parsed response data:', data);

    return data.results.map((page: any) => {
      console.log('Mapping page data:', page);
      return {
        id: page.id,
        title: page.properties?.title?.title?.[0]?.plain_text || 
               page.properties?.Name?.title?.[0]?.plain_text || 
               "Untitled",
        lastEditedTime: new Date(page.last_edited_time).toLocaleString(),
        url: page.url,
        status: 'active',
      };
    });
  } catch (error) {
    console.error('Error fetching Notion pages:', error);
    return [];
  }
};

/**
 * Fetch the content of a specific Notion page
 */
export const fetchNotionPageContent = async (pageId: string): Promise<string> => {
  try {
    console.log(`Fetching content for page ${pageId} via proxy...`);
    const response = await fetch(`${PROXY_API_URL}/blocks/${pageId}/children`);

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse blocks to extract text content
    let content = '';
    data.results.forEach((block: any) => {
      if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
        block.paragraph.rich_text.forEach((text: any) => {
          content += text.plain_text;
        });
        content += '\n\n';
      } else if (block.type === 'heading_1' && block.heading_1.rich_text.length > 0) {
        content += '# ';
        block.heading_1.rich_text.forEach((text: any) => {
          content += text.plain_text;
        });
        content += '\n\n';
      } else if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
        content += '## ';
        block.heading_2.rich_text.forEach((text: any) => {
          content += text.plain_text;
        });
        content += '\n\n';
      } else if (block.type === 'heading_3' && block.heading_3.rich_text.length > 0) {
        content += '### ';
        block.heading_3.rich_text.forEach((text: any) => {
          content += text.plain_text;
        });
        content += '\n\n';
      }
    });

    return content;
  } catch (error) {
    console.error('Error fetching Notion page content:', error);
    return 'Failed to load content from Notion';
  }
};

/**
 * Add a new Notion page URL to the system
 */
export const addNotionPage = async (pageUrl: string): Promise<NotionDocument | null> => {
  try {
    // Extract page ID from URL
    const pageIdMatch = pageUrl.match(/([a-zA-Z0-9]+)(?:\?|$)/);
    if (!pageIdMatch) {
      throw new Error('Invalid Notion URL');
    }
    
    const pageId = pageIdMatch[1];
    
    // Fetch page info to validate
    console.log(`Fetching page info for ${pageId} via proxy...`);
    const response = await fetch(`${PROXY_API_URL}/pages/${pageId}`);

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const pageData = await response.json();
    
    return {
      id: pageData.id,
      title: pageData.properties?.title?.title?.[0]?.plain_text || 
             pageData.properties?.Name?.title?.[0]?.plain_text || 
             "Untitled",
      lastEditedTime: new Date(pageData.last_edited_time).toLocaleString(),
      url: pageData.url,
      status: 'active',
    };
  } catch (error) {
    console.error('Error adding Notion page:', error);
    return null;
  }
};
