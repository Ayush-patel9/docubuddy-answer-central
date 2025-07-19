// Google Drive API Types
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  status: 'active' | 'processing' | 'error';
}

const API_BASE_URL = '/api/drive';

export const fetchDriveFiles = async (): Promise<DriveFile[]> => {
  try {
    console.log('Fetching Google Drive files...');
    const response = await fetch(`${API_BASE_URL}/files`);
    const data = await response.json();
    
    // Transform the response data to match our application's format
    const files = data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      webViewLink: file.webViewLink,
      iconLink: file.iconLink,
      modifiedTime: file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : undefined,
      status: 'active'
    }));
    
    return files;
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    // Return mock files for development if API fails
    return [
      { 
        id: 'mock-id-1', 
        name: 'Sample Document.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        webViewLink: 'https://docs.google.com/document/d/mock-id-1/view',
        status: 'active',
        modifiedTime: new Date().toLocaleString()
      },
      { 
        id: 'mock-id-2', 
        name: 'Project Plan.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webViewLink: 'https://docs.google.com/spreadsheets/d/mock-id-2/view',
        status: 'active',
        modifiedTime: new Date().toLocaleString()
      },
      { 
        id: 'mock-id-3', 
        name: 'Presentation.pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        webViewLink: 'https://docs.google.com/presentation/d/mock-id-3/view',
        status: 'active',
        modifiedTime: new Date().toLocaleString()
      }
    ];
  }
};

export const fetchFileContent = async (fileId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/content`);
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(`Error fetching content for file ${fileId}:`, error);
    
    // Return mock content for development
    if (fileId === 'mock-id-1') {
      return "This is a sample Word document content.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.";
    } else if (fileId === 'mock-id-2') {
      return "Sample spreadsheet data:\n\nProject,Status,Deadline\nWebsite Redesign,In Progress,2025-08-15\nAPI Integration,Completed,2025-07-01\nMobile App,Planning,2025-09-30";
    } else if (fileId === 'mock-id-3') {
      return "Presentation Outline:\n\n1. Introduction\n2. Project Overview\n3. Timeline\n4. Budget\n5. Team Members\n6. Q&A";
    }
    
    return "Unable to fetch content for this file. Please try again or open in Google Drive.";
  }
};

export const searchDriveFiles = async (query: string): Promise<DriveFile[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    // Transform the response data to match our application's format
    const files = data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      webViewLink: file.webViewLink,
      iconLink: file.iconLink,
      modifiedTime: file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : undefined,
      status: 'active'
    }));
    
    return files;
  } catch (error) {
    console.error('Error searching Drive files:', error);
    throw new Error('Failed to search Drive files');
  }
};
