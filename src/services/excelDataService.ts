import * as XLSX from 'xlsx';

export interface ExcelData {
  headers: string[];
  data: any[][];
  sheetNames: string[];
}

export interface ParsedData {
  column: string;
  values: any[];
  type: 'number' | 'string' | 'date' | 'mixed';
}

export class ExcelDataService {
  /**
   * Parse Excel file from buffer
   */
  static parseExcelFile(buffer: ArrayBuffer): ExcelData {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]]; // Use first sheet by default
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = jsonData[0] as string[];
    const data = jsonData.slice(1) as any[][];
    
    return {
      headers,
      data,
      sheetNames
    };
  }

  /**
   * Extract data for a specific column
   */
  static extractColumnData(excelData: ExcelData, columnName: string): ParsedData | null {
    const columnIndex = excelData.headers.findIndex(
      header => header.toLowerCase().includes(columnName.toLowerCase())
    );
    
    if (columnIndex === -1) {
      return null;
    }
    
    const values = excelData.data
      .map(row => row[columnIndex])
      .filter(value => value !== undefined && value !== null && value !== '');
    
    const type = this.detectDataType(values);
    
    return {
      column: excelData.headers[columnIndex],
      values,
      type
    };
  }

  /**
   * Detect the data type of column values
   */
  private static detectDataType(values: any[]): 'number' | 'string' | 'date' | 'mixed' {
    if (values.length === 0) return 'mixed';
    
    const numberCount = values.filter(v => typeof v === 'number' || !isNaN(Number(v))).length;
    const stringCount = values.filter(v => typeof v === 'string' && isNaN(Number(v))).length;
    const dateCount = values.filter(v => !isNaN(Date.parse(v))).length;
    
    const total = values.length;
    
    if (numberCount / total > 0.8) return 'number';
    if (stringCount / total > 0.8) return 'string';
    if (dateCount / total > 0.8) return 'date';
    
    return 'mixed';
  }

  /**
   * Generate chart data for numerical columns
   */
  static generateChartData(
    parsedData: ParsedData,
    chartType: 'distribution' | 'frequency' | 'range'
  ): { labels: string[]; data: number[]; backgroundColor: string[] } {
    if (parsedData.type !== 'number') {
      // For non-numeric data, create frequency chart
      return this.createFrequencyChart(parsedData);
    }

    const numericValues = parsedData.values.map(v => Number(v)).filter(v => !isNaN(v));
    
    switch (chartType) {
      case 'distribution':
        return this.createDistributionChart(numericValues);
      case 'frequency':
        return this.createFrequencyChart(parsedData);
      case 'range':
        return this.createRangeChart(numericValues);
      default:
        return this.createFrequencyChart(parsedData);
    }
  }

  /**
   * Create frequency chart for categorical or repeated values
   */
  private static createFrequencyChart(parsedData: ParsedData): {
    labels: string[];
    data: number[];
    backgroundColor: string[];
  } {
    const frequency: { [key: string]: number } = {};
    
    parsedData.values.forEach(value => {
      const key = String(value);
      frequency[key] = (frequency[key] || 0) + 1;
    });
    
    const entries = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(([key]) => key);
    const data = entries.map(([, count]) => count);
    
    // Generate vibrant colors for each segment
    const backgroundColor = this.generateColors(labels.length);
    
    return { labels, data, backgroundColor };
  }

  /**
   * Create distribution chart for numeric ranges
   */
  private static createDistributionChart(values: number[]): {
    labels: string[];
    data: number[];
    backgroundColor: string[];
  } {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bucketCount = Math.min(10, Math.ceil(Math.sqrt(values.length))); // Optimal bucket count
    const bucketSize = (max - min) / bucketCount;
    
    const buckets: number[] = new Array(bucketCount).fill(0);
    const labels: string[] = [];
    
    // Create bucket labels
    for (let i = 0; i < bucketCount; i++) {
      const start = min + i * bucketSize;
      const end = min + (i + 1) * bucketSize;
      labels.push(`${start.toFixed(1)} - ${end.toFixed(1)}`);
    }
    
    // Fill buckets
    values.forEach(value => {
      const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), bucketCount - 1);
      buckets[bucketIndex]++;
    });
    
    const backgroundColor = this.generateColors(bucketCount);
    
    return { labels, data: buckets, backgroundColor };
  }

  /**
   * Create range chart for numeric data
   */
  private static createRangeChart(values: number[]): {
    labels: string[];
    data: number[];
    backgroundColor: string[];
  } {
    const sortedValues = [...values].sort((a, b) => a - b);
    const quartile1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
    const median = sortedValues[Math.floor(sortedValues.length * 0.5)];
    const quartile3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const labels = ['Min', 'Q1', 'Median', 'Q3', 'Max'];
    const data = [min, quartile1, median, quartile3, max];
    const backgroundColor = [
      '#ef4444', // red for min
      '#f97316', // orange for Q1
      '#eab308', // yellow for median
      '#22c55e', // green for Q3
      '#3b82f6'  // blue for max
    ];
    
    return { labels, data, backgroundColor };
  }

  /**
   * Generate vibrant colors for chart segments
   */
  private static generateColors(count: number): string[] {
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
      '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
      '#06b6d4', '#8b5cf6', '#f97316', '#10b981', '#6366f1'
    ];
    
    if (count <= colors.length) {
      return colors.slice(0, count);
    }
    
    // Generate additional colors if needed
    const additionalColors = [];
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation for good color distribution
      additionalColors.push(`hsl(${hue}, 70%, 50%)`);
    }
    
    return [...colors, ...additionalColors];
  }

  /**
   * Get available columns for chart generation
   */
  static getAvailableColumns(excelData: ExcelData): {
    name: string;
    type: 'number' | 'string' | 'date' | 'mixed';
    sampleValues: any[];
  }[] {
    return excelData.headers.map((header, index) => {
      const columnValues = excelData.data
        .map(row => row[index])
        .filter(value => value !== undefined && value !== null && value !== '')
        .slice(0, 5); // Get first 5 non-empty values as samples
      
      const type = this.detectDataType(columnValues);
      
      return {
        name: header,
        type,
        sampleValues: columnValues
      };
    });
  }
}
