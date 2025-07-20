import { ExcelDataService } from './excelDataService';
import { listFiles, getFileContent } from '@/lib/googleDriveService';

export interface ChartRequest {
  type: 'pie' | 'bar' | 'doughnut' | 'line';
  column: string;
  fileName?: string;
  prompt: string;
}

export interface ChartResponse {
  success: boolean;
  chartData?: {
    type: string;
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
      }[];
    };
    title: string;
    summary: string;
  };
  error?: string;
  availableFiles?: string[];
  availableColumns?: string[];
}

export class AIExcelService {
  private static driveFiles: any[] = [];
  private static excelCache: Map<string, any> = new Map();

  /**
   * Initialize by loading available Excel files from Google Drive
   */
  static async initialize(): Promise<void> {
    try {
      const response = await listFiles();
      if (response.success) {
        this.driveFiles = response.data.files.filter(file => 
          file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
        );
        console.log(`AIExcelService: Found ${this.driveFiles.length} Excel files`);
      }
    } catch (error) {
      console.error('AIExcelService: Failed to initialize', error);
    }
  }

  /**
   * Process natural language request for chart generation
   */
  static async processChartRequest(prompt: string): Promise<ChartResponse> {
    try {
      // Parse the prompt to extract intent
      const parsedRequest = this.parsePrompt(prompt);
      
      if (!parsedRequest.fileName && !parsedRequest.column) {
        return {
          success: false,
          error: 'Please specify which Excel file and column you want to visualize. Available files: ' + 
                 this.driveFiles.map(f => f.name).join(', ')
        };
      }

      // Find the Excel file
      const targetFile = this.findExcelFile(parsedRequest.fileName);
      if (!targetFile) {
        return {
          success: false,
          error: `Excel file not found. Available files: ${this.driveFiles.map(f => f.name).join(', ')}`
        };
      }

      // Load and parse Excel data
      const excelData = await this.loadExcelData(targetFile.id, targetFile.name);
      if (!excelData) {
        return {
          success: false,
          error: 'Failed to load Excel file. Please ensure it\'s a valid Excel file.'
        };
      }

      // Find the target column
      const columnData = this.findColumn(excelData, parsedRequest.column);
      if (!columnData) {
        const availableColumns = excelData.headers.join(', ');
        return {
          success: false,
          error: `Column '${parsedRequest.column}' not found. Available columns: ${availableColumns}`
        };
      }

      // Generate chart data
      const chartData = this.generateChartData(columnData, parsedRequest.type, targetFile.name);
      
      return {
        success: true,
        chartData: {
          type: parsedRequest.type,
          data: chartData,
          title: `${columnData.column} Analysis from ${targetFile.name}`,
          summary: this.generateSummary(columnData, parsedRequest.type)
        }
      };

    } catch (error) {
      console.error('AIExcelService: Error processing chart request', error);
      return {
        success: false,
        error: 'Failed to process chart request. Please try again.'
      };
    }
  }

  /**
   * Parse natural language prompt to extract chart request details
   */
  private static parsePrompt(prompt: string): ChartRequest {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract chart type
    let type: 'pie' | 'bar' | 'doughnut' | 'line' = 'pie';
    if (lowerPrompt.includes('bar') || lowerPrompt.includes('column')) {
      type = 'bar';
    } else if (lowerPrompt.includes('pie')) {
      type = 'pie';
    } else if (lowerPrompt.includes('doughnut') || lowerPrompt.includes('donut')) {
      type = 'doughnut';
    } else if (lowerPrompt.includes('line')) {
      type = 'line';
    }

    // Extract file name
    let fileName = '';
    this.driveFiles.forEach(file => {
      const name = file.name.toLowerCase();
      if (lowerPrompt.includes(name.replace('.xlsx', '').replace('.xls', ''))) {
        fileName = file.name;
      }
    });

    // If no specific file mentioned, try common patterns
    if (!fileName) {
      if (lowerPrompt.includes('train') || lowerPrompt.includes('data')) {
        const trainFile = this.driveFiles.find(f => 
          f.name.toLowerCase().includes('train') || 
          f.name.toLowerCase().includes('data')
        );
        if (trainFile) fileName = trainFile.name;
      }
    }

    // Extract column name
    let column = '';
    const columnKeywords = ['fare', 'price', 'cost', 'amount', 'salary', 'age', 'quantity', 'count'];
    
    for (const keyword of columnKeywords) {
      if (lowerPrompt.includes(keyword)) {
        column = keyword;
        break;
      }
    }

    // Try to extract quoted column names
    const quotedMatch = prompt.match(/["']([^"']+)["']/);
    if (quotedMatch) {
      column = quotedMatch[1];
    }

    return {
      type,
      column,
      fileName,
      prompt
    };
  }

  /**
   * Find Excel file by name or pattern
   */
  private static findExcelFile(fileName: string): any | null {
    if (!fileName) {
      // Return first Excel file if no specific file mentioned
      return this.driveFiles[0] || null;
    }

    // Exact match
    let file = this.driveFiles.find(f => 
      f.name.toLowerCase() === fileName.toLowerCase()
    );

    if (!file) {
      // Partial match
      file = this.driveFiles.find(f => 
        f.name.toLowerCase().includes(fileName.toLowerCase()) ||
        fileName.toLowerCase().includes(f.name.toLowerCase().replace('.xlsx', '').replace('.xls', ''))
      );
    }

    return file || null;
  }

  /**
   * Load and cache Excel data
   */
  private static async loadExcelData(fileId: string, fileName: string): Promise<any> {
    // Check cache first
    if (this.excelCache.has(fileId)) {
      return this.excelCache.get(fileId);
    }

    try {
      // Download binary file for Excel parsing
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const excelData = ExcelDataService.parseExcelFile(arrayBuffer);
      
      // Cache the data
      this.excelCache.set(fileId, excelData);
      
      return excelData;
    } catch (error) {
      console.error('Failed to load Excel data:', error);
      return null;
    }
  }

  /**
   * Find column in Excel data
   */
  private static findColumn(excelData: any, columnName: string): any | null {
    if (!columnName) return null;
    
    return ExcelDataService.extractColumnData(excelData, columnName);
  }

  /**
   * Generate chart data for visualization
   */
  private static generateChartData(columnData: any, chartType: string, fileName: string): any {
    const chartDataType = columnData.type === 'number' ? 'distribution' : 'frequency';
    const generatedData = ExcelDataService.generateChartData(columnData, chartDataType);
    
    return {
      labels: generatedData.labels,
      datasets: [{
        label: `${columnData.column} from ${fileName}`,
        data: generatedData.data,
        backgroundColor: generatedData.backgroundColor,
        borderColor: generatedData.backgroundColor.map((color: string) => color + '80'),
        borderWidth: 2,
      }]
    };
  }

  /**
   * Generate summary text for the chart
   */
  private static generateSummary(columnData: any, chartType: string): string {
    const totalValues = columnData.values.length;
    const dataType = columnData.type;
    
    if (dataType === 'number') {
      const numbers = columnData.values.map((v: any) => Number(v)).filter((v: number) => !isNaN(v));
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const avg = numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length;
      
      return `Analysis of ${columnData.column}: ${totalValues} data points ranging from ${min.toFixed(2)} to ${max.toFixed(2)} with an average of ${avg.toFixed(2)}. Displayed as ${chartType} chart.`;
    } else {
      const uniqueValues = new Set(columnData.values).size;
      return `Analysis of ${columnData.column}: ${totalValues} data points with ${uniqueValues} unique values. Displayed as ${chartType} chart showing frequency distribution.`;
    }
  }

  /**
   * Get access token for Google Drive API
   */
  private static async getAccessToken(): Promise<string> {
    // This should use your existing auth system
    const authInstance = (window as any).gapi?.auth2?.getAuthInstance();
    if (authInstance) {
      const user = authInstance.currentUser.get();
      return user.getAuthResponse().access_token;
    }
    throw new Error('No access token available');
  }

  /**
   * Get list of available Excel files
   */
  static getAvailableFiles(): string[] {
    return this.driveFiles.map(f => f.name);
  }

  /**
   * Get list of available columns for a specific file
   */
  static async getAvailableColumns(fileName: string): Promise<string[]> {
    const file = this.findExcelFile(fileName);
    if (!file) return [];

    const excelData = await this.loadExcelData(file.id, file.name);
    return excelData ? excelData.headers : [];
  }
}
