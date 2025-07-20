import { googleAuth } from '@/lib/googleAuth';
import { ExcelDataService, type ExcelData } from './excelDataService';

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const GOOGLE_DRIVE_FOLDER_ID = '1zXkSacSoBdfbg0hm5ndXSkjyZO5tsqG6'; // Your folder ID

export interface RealExcelFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink: string;
  downloadUrl: string;
}

export interface ChartGenerationRequest {
  prompt: string;
  fileId?: string;
  fileName?: string;
  column?: string;
  chartType?: 'pie' | 'bar' | 'doughnut' | 'line';
}

export interface ChartGenerationResponse {
  success: boolean;
  chartData?: {
    type: string;
    data: any;
    title: string;
    summary: string;
    sourceFile: string;
    columnAnalyzed: string;
  };
  error?: string;
  availableFiles?: RealExcelFile[];
  availableColumns?: string[];
}

export class RealTimeExcelService {
  private static excelFilesCache: RealExcelFile[] = [];
  private static parsedDataCache: Map<string, ExcelData> = new Map();
  private static lastFetch: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get access token for Google Drive API
   */
  private static async getAccessToken(): Promise<string> {
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available. Please sign in to Google Drive.');
    }
    return accessToken;
  }

  /**
   * Fetch Excel files from the specific Google Drive folder
   */
  static async fetchExcelFiles(): Promise<RealExcelFile[]> {
    const now = Date.now();
    
    // Return cached data if recent
    if (this.excelFilesCache.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log('📊 RealTimeExcelService: Using cached Excel files');
      return this.excelFilesCache;
    }

    try {
      console.log('📊 RealTimeExcelService: Fetching Excel files from Google Drive...');
      const accessToken = await this.getAccessToken();
      
      // Query for Excel files in the specific folder
      const query = `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and (mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel')`;
      
      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files?` + new URLSearchParams({
          q: query,
          fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink)',
          pageSize: '50'
        }),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const excelFiles: RealExcelFile[] = data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size || 'Unknown',
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        downloadUrl: `${GOOGLE_DRIVE_API_BASE}/files/${file.id}?alt=media`
      }));

      this.excelFilesCache = excelFiles;
      this.lastFetch = now;
      
      console.log(`📊 RealTimeExcelService: Found ${excelFiles.length} Excel files`);
      return excelFiles;
      
    } catch (error) {
      console.error('📊 RealTimeExcelService: Error fetching Excel files:', error);
      throw error;
    }
  }

  /**
   * Download and parse an Excel file
   */
  static async downloadAndParseExcel(fileId: string): Promise<ExcelData> {
    // Check cache first
    if (this.parsedDataCache.has(fileId)) {
      console.log(`📊 RealTimeExcelService: Using cached data for file ${fileId}`);
      return this.parsedDataCache.get(fileId)!;
    }

    try {
      console.log(`📊 RealTimeExcelService: Downloading and parsing Excel file ${fileId}...`);
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${GOOGLE_DRIVE_API_BASE}/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const excelData = ExcelDataService.parseExcelFile(arrayBuffer);
      
      // Cache the parsed data
      this.parsedDataCache.set(fileId, excelData);
      
      console.log(`📊 RealTimeExcelService: Successfully parsed Excel file with ${excelData.headers.length} columns and ${excelData.data.length} rows`);
      return excelData;
      
    } catch (error) {
      console.error(`📊 RealTimeExcelService: Error downloading/parsing Excel file ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Process natural language chart request using Gemini AI
   */
  static async processChartRequest(request: ChartGenerationRequest): Promise<ChartGenerationResponse> {
    try {
      console.log('📊 RealTimeExcelService: Processing chart request:', request.prompt);
      
      // Step 1: Get available Excel files
      const excelFiles = await this.fetchExcelFiles();
      
      if (excelFiles.length === 0) {
        return {
          success: false,
          error: 'No Excel files found in your Google Drive folder. Please upload some Excel files to analyze.'
        };
      }

      // Step 2: Parse the request to find target file and column
      const parseResult = await this.parseChartRequest(request.prompt, excelFiles);
      
      if (!parseResult.success) {
        return {
          success: false,
          error: parseResult.error,
          availableFiles: excelFiles
        };
      }

      // Step 3: Download and parse the target Excel file
      const excelData = await this.downloadAndParseExcel(parseResult.fileId!);
      
      // Step 4: Extract column data
      const columnData = ExcelDataService.extractColumnData(excelData, parseResult.column!);
      
      if (!columnData) {
        return {
          success: false,
          error: `Column '${parseResult.column}' not found. Available columns: ${excelData.headers.join(', ')}`,
          availableColumns: excelData.headers
        };
      }

      // Step 5: Generate chart data
      const chartDataType = columnData.type === 'number' ? 'distribution' : 'frequency';
      const generatedData = ExcelDataService.generateChartData(columnData, chartDataType);
      
      const chartData = {
        labels: generatedData.labels,
        datasets: [{
          label: `${columnData.column} Analysis`,
          data: generatedData.data,
          backgroundColor: generatedData.backgroundColor,
          borderColor: generatedData.backgroundColor.map((color: string) => color + '80'),
          borderWidth: 2,
        }]
      };

      // Step 6: Generate summary
      const summary = this.generateSummary(columnData, parseResult.chartType!, parseResult.fileName!);

      return {
        success: true,
        chartData: {
          type: parseResult.chartType!,
          data: chartData,
          title: `${columnData.column} Analysis from ${parseResult.fileName}`,
          summary,
          sourceFile: parseResult.fileName!,
          columnAnalyzed: columnData.column
        }
      };

    } catch (error) {
      console.error('📊 RealTimeExcelService: Error processing chart request:', error);
      return {
        success: false,
        error: `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse natural language request to extract file, column, and chart type
   */
  private static async parseChartRequest(prompt: string, availableFiles: RealExcelFile[]): Promise<{
    success: boolean;
    fileId?: string;
    fileName?: string;
    column?: string;
    chartType?: 'pie' | 'bar' | 'doughnut' | 'line';
    error?: string;
  }> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract chart type
    let chartType: 'pie' | 'bar' | 'doughnut' | 'line' = 'pie';
    if (lowerPrompt.includes('bar') || lowerPrompt.includes('column')) {
      chartType = 'bar';
    } else if (lowerPrompt.includes('doughnut') || lowerPrompt.includes('donut')) {
      chartType = 'doughnut';
    } else if (lowerPrompt.includes('line')) {
      chartType = 'line';
    }

    // Find target file
    let targetFile: RealExcelFile | null = null;
    
    // Look for specific file mentions
    for (const file of availableFiles) {
      const fileName = file.name.toLowerCase().replace(/\.(xlsx|xls)$/, '');
      if (lowerPrompt.includes(fileName) || lowerPrompt.includes(file.name.toLowerCase())) {
        targetFile = file;
        break;
      }
    }

    // If no specific file mentioned, use first Excel file
    if (!targetFile && availableFiles.length > 0) {
      targetFile = availableFiles[0];
    }

    if (!targetFile) {
      return {
        success: false,
        error: `No Excel file found. Available files: ${availableFiles.map(f => f.name).join(', ')}`
      };
    }

    // Extract column name - look for common column keywords
    let column = '';
    const commonColumns = [
      'fare', 'price', 'cost', 'amount', 'salary', 'income',
      'age', 'years', 'date', 'time',
      'name', 'title', 'category', 'type', 'class', 'grade',
      'quantity', 'count', 'number', 'total',
      'gender', 'sex', 'status', 'state',
      'survived', 'success', 'result'
    ];

    for (const col of commonColumns) {
      if (lowerPrompt.includes(col)) {
        column = col;
        break;
      }
    }

    // Try to extract quoted column names
    const quotedMatch = prompt.match(/["']([^"']+)["']/);
    if (quotedMatch) {
      column = quotedMatch[1];
    }

    if (!column) {
      return {
        success: false,
        error: `Please specify which column to visualize. Try mentioning column names like 'fare', 'age', 'class', etc., or use quotes like "column name"`
      };
    }

    return {
      success: true,
      fileId: targetFile.id,
      fileName: targetFile.name,
      column,
      chartType
    };
  }

  /**
   * Generate summary text for the chart
   */
  private static generateSummary(columnData: any, chartType: string, fileName: string): string {
    const totalValues = columnData.values.length;
    const dataType = columnData.type;
    
    if (dataType === 'number') {
      const numbers = columnData.values.map((v: any) => Number(v)).filter((v: number) => !isNaN(v));
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const avg = numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length;
      
      return `📊 Analyzed ${totalValues} data points from "${columnData.column}" column in ${fileName}. Values range from ${min.toFixed(2)} to ${max.toFixed(2)} with an average of ${avg.toFixed(2)}. Displayed as ${chartType} chart.`;
    } else {
      const uniqueValues = new Set(columnData.values).size;
      return `📊 Analyzed ${totalValues} data points from "${columnData.column}" column in ${fileName}. Found ${uniqueValues} unique categories. Displayed as ${chartType} chart showing frequency distribution.`;
    }
  }

  /**
   * Get list of available Excel files
   */
  static async getAvailableFiles(): Promise<RealExcelFile[]> {
    return await this.fetchExcelFiles();
  }

  /**
   * Clear caches (useful for testing)
   */
  static clearCache(): void {
    this.excelFilesCache = [];
    this.parsedDataCache.clear();
    this.lastFetch = 0;
    console.log('📊 RealTimeExcelService: Cache cleared');
  }
}
