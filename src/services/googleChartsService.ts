import { RealTimeExcelService } from './realTimeExcelService';

export interface GoogleChartRequest {
  prompt: string;
  fileId?: string;
  fileName?: string;
}

export interface GoogleChartResponse {
  success: boolean;
  chartConfig?: {
    chartType: string;
    data: any[][];
    options: any;
    title: string;
    summary: string;
    sourceFile: string;
    columnAnalyzed: string;
  };
  error?: string;
  suggestions?: string[];
}

export class GoogleChartsService {
  
  /**
   * Process natural language prompt and generate Google Charts configuration
   */
  static async generateChartFromPrompt(request: GoogleChartRequest): Promise<GoogleChartResponse> {
    try {
      console.log('🎯 GoogleChartsService: Processing prompt:', request.prompt);
      
      // Step 1: Parse the prompt to understand what user wants
      const parseResult = await this.parseChartPrompt(request.prompt);
      
      if (!parseResult.success) {
        return {
          success: false,
          error: parseResult.error,
          suggestions: parseResult.suggestions
        };
      }

      // Step 2: Get Excel files and find the target
      const excelFiles = await RealTimeExcelService.fetchExcelFiles();
      
      if (excelFiles.length === 0) {
        return {
          success: false,
          error: 'No Excel files found in your Google Drive folder.',
          suggestions: ['Upload Excel files to your Google Drive folder first']
        };
      }

      // Step 3: Find target file
      let targetFile = excelFiles.find(f => 
        f.name.toLowerCase().includes(parseResult.fileName?.toLowerCase() || '') ||
        parseResult.fileName?.toLowerCase().includes(f.name.toLowerCase().replace(/\.(xlsx|xls)$/, '') || '')
      );

      if (!targetFile) {
        targetFile = excelFiles[0]; // Use first Excel file if none specified
      }

      // Step 4: Download and parse Excel data
      const excelData = await RealTimeExcelService.downloadAndParseExcel(targetFile.id);
      
      // Step 5: Find target column
      const columnIndex = excelData.headers.findIndex(header =>
        header.toLowerCase().includes(parseResult.column?.toLowerCase() || '')
      );

      if (columnIndex === -1) {
        return {
          success: false,
          error: `Column '${parseResult.column}' not found in ${targetFile.name}`,
          suggestions: [`Available columns: ${excelData.headers.join(', ')}`]
        };
      }

      // Step 6: Process data for Google Charts
      const chartConfig = this.createGoogleChartConfig(
        excelData,
        columnIndex,
        parseResult.chartType!,
        parseResult.column!,
        targetFile.name
      );

      return {
        success: true,
        chartConfig
      };

    } catch (error) {
      console.error('🎯 GoogleChartsService: Error:', error);
      return {
        success: false,
        error: `Failed to generate chart: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse natural language prompt to extract chart requirements
   */
  private static async parseChartPrompt(prompt: string): Promise<{
    success: boolean;
    chartType?: string;
    column?: string;
    fileName?: string;
    error?: string;
    suggestions?: string[];
  }> {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect chart type from prompt
    let chartType = 'PieChart'; // Default
    
    if (lowerPrompt.includes('pie')) {
      chartType = 'PieChart';
    } else if (lowerPrompt.includes('bar') || lowerPrompt.includes('column')) {
      chartType = 'ColumnChart';
    } else if (lowerPrompt.includes('line')) {
      chartType = 'LineChart';
    } else if (lowerPrompt.includes('area')) {
      chartType = 'AreaChart';
    } else if (lowerPrompt.includes('scatter')) {
      chartType = 'ScatterChart';
    } else if (lowerPrompt.includes('histogram')) {
      chartType = 'Histogram';
    } else if (lowerPrompt.includes('donut') || lowerPrompt.includes('doughnut')) {
      chartType = 'PieChart'; // Will add donut hole in options
    }

    // Extract column name from prompt
    let column = '';
    const commonColumns = [
      'fare', 'price', 'cost', 'amount', 'revenue', 'sales', 'profit',
      'age', 'years', 'date', 'time', 'month', 'year',
      'name', 'title', 'category', 'type', 'class', 'grade', 'level',
      'quantity', 'count', 'number', 'total', 'sum',
      'gender', 'sex', 'status', 'state', 'region', 'country',
      'rating', 'score', 'points', 'percentage',
      'survived', 'success', 'result', 'outcome'
    ];

    // Look for column keywords in prompt
    for (const col of commonColumns) {
      if (lowerPrompt.includes(col)) {
        column = col;
        break;
      }
    }

    // Try to extract quoted column names
    const quotedMatch = prompt.match(/["']([^"']+)["']/);
    if (quotedMatch && !column) {
      column = quotedMatch[1];
    }

    // Extract file name
    let fileName = '';
    if (lowerPrompt.includes('train')) fileName = 'train';
    if (lowerPrompt.includes('data')) fileName = 'data';
    if (lowerPrompt.includes('sales')) fileName = 'sales';
    if (lowerPrompt.includes('customer')) fileName = 'customer';

    if (!column) {
      return {
        success: false,
        error: 'Please specify which column to visualize',
        suggestions: [
          'Try: "Show me a pie chart of sales data"',
          'Or: "Create a bar chart for age column"',
          'Or: "Visualize revenue distribution"'
        ]
      };
    }

    return {
      success: true,
      chartType,
      column,
      fileName
    };
  }

  /**
   * Create Google Charts configuration from Excel data
   */
  private static createGoogleChartConfig(
    excelData: any,
    columnIndex: number,
    chartType: string,
    columnName: string,
    fileName: string
  ): any {
    const columnHeader = excelData.headers[columnIndex];
    const rawValues = excelData.data.map((row: any[]) => row[columnIndex]).filter(v => v !== undefined && v !== null && v !== '');
    
    // Determine if data is numeric or categorical
    const isNumeric = rawValues.every((v: any) => !isNaN(Number(v)) && v !== '');
    
    let chartData: any[][];
    let options: any;
    let summary: string;

    if (isNumeric) {
      // Numeric data - create distribution or histogram
      const numbers = rawValues.map((v: any) => Number(v));
      
      if (chartType === 'Histogram') {
        // For histogram, Google Charts expects raw data
        chartData = [['Value'], ...numbers.map(n => [n])];
        options = {
          title: `${columnHeader} Distribution`,
          hAxis: { title: columnHeader },
          vAxis: { title: 'Frequency' },
          legend: { position: 'none' },
          colors: ['#4285f4']
        };
      } else if (chartType === 'LineChart' || chartType === 'AreaChart') {
        // For line/area charts, create trend data
        const sortedData = numbers.map((value, index) => [index + 1, value]);
        chartData = [['Index', columnHeader], ...sortedData];
        options = {
          title: `${columnHeader} Trend`,
          hAxis: { title: 'Data Point' },
          vAxis: { title: columnHeader },
          curveType: 'function',
          colors: ['#34a853']
        };
      } else {
        // For other charts, create range buckets
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const bucketCount = Math.min(10, Math.ceil(Math.sqrt(numbers.length)));
        const bucketSize = (max - min) / bucketCount;
        
        const buckets: { [key: string]: number } = {};
        
        numbers.forEach(value => {
          const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), bucketCount - 1);
          const rangeStart = min + bucketIndex * bucketSize;
          const rangeEnd = min + (bucketIndex + 1) * bucketSize;
          const label = `${rangeStart.toFixed(1)}-${rangeEnd.toFixed(1)}`;
          buckets[label] = (buckets[label] || 0) + 1;
        });
        
        chartData = [['Range', 'Count'], ...Object.entries(buckets)];
        options = this.getChartOptions(chartType, `${columnHeader} Distribution`, columnHeader);
      }
      
      summary = `📊 Analyzed ${numbers.length} numeric values. Range: ${Math.min(...numbers).toFixed(2)} to ${Math.max(...numbers).toFixed(2)}, Average: ${(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2)}`;
      
    } else {
      // Categorical data - create frequency distribution
      const frequency: { [key: string]: number } = {};
      rawValues.forEach((value: any) => {
        const key = String(value);
        frequency[key] = (frequency[key] || 0) + 1;
      });
      
      const entries = Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 15); // Top 15 categories
      chartData = [['Category', 'Count'], ...entries];
      options = this.getChartOptions(chartType, `${columnHeader} Distribution`, columnHeader);
      
      summary = `📊 Analyzed ${rawValues.length} items across ${Object.keys(frequency).length} categories. Top category: ${entries[0]?.[0]} (${entries[0]?.[1]} occurrences)`;
    }

    return {
      chartType,
      data: chartData,
      options,
      title: `${columnHeader} Analysis from ${fileName}`,
      summary,
      sourceFile: fileName,
      columnAnalyzed: columnHeader
    };
  }

  /**
   * Get chart-specific options for Google Charts
   */
  private static getChartOptions(chartType: string, title: string, columnName: string): any {
    const baseOptions = {
      title,
      is3D: false,
      backgroundColor: 'transparent',
      titleTextStyle: {
        color: '#ffffff',
        fontSize: 16,
        bold: true
      },
      legendTextStyle: {
        color: '#e5e7eb'
      }
    };

    switch (chartType) {
      case 'PieChart':
        return {
          ...baseOptions,
          pieHole: 0, // Set to 0.4 for donut chart
          colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
          chartArea: { width: '90%', height: '80%' }
        };
        
      case 'ColumnChart':
        return {
          ...baseOptions,
          hAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          vAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          colors: ['#3b82f6'],
          chartArea: { width: '80%', height: '70%' }
        };
        
      case 'LineChart':
        return {
          ...baseOptions,
          hAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          vAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          colors: ['#34a853'],
          curveType: 'function',
          chartArea: { width: '80%', height: '70%' }
        };
        
      case 'AreaChart':
        return {
          ...baseOptions,
          hAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          vAxis: {
            textStyle: { color: '#9ca3af' },
            titleTextStyle: { color: '#e5e7eb' }
          },
          colors: ['#8b5cf6'],
          areaOpacity: 0.4,
          chartArea: { width: '80%', height: '70%' }
        };
        
      default:
        return baseOptions;
    }
  }

  /**
   * Get available chart types
   */
  static getAvailableChartTypes(): string[] {
    return [
      'PieChart', 'ColumnChart', 'LineChart', 'AreaChart', 
      'ScatterChart', 'Histogram'
    ];
  }

  /**
   * Get chart type suggestions based on data type
   */
  static getChartSuggestions(dataType: 'numeric' | 'categorical'): string[] {
    if (dataType === 'numeric') {
      return [
        'Try: "Show me a histogram of sales data"',
        'Or: "Create a line chart for revenue trend"',
        'Or: "Make an area chart of monthly profits"'
      ];
    } else {
      return [
        'Try: "Show me a pie chart of categories"',
        'Or: "Create a bar chart for status distribution"',
        'Or: "Visualize region breakdown"'
      ];
    }
  }
}
