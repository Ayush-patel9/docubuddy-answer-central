import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileSpreadsheet, BarChart3, PieChart, Download } from 'lucide-react';
import ChartVisualization from './ChartVisualization';
import { ExcelDataService, type ExcelData, type ParsedData } from '@/services/excelDataService';
import { listFiles, getFileContent } from '@/lib/googleDriveService';

interface ExcelChartGeneratorProps {
  darkMode?: boolean;
}

const ExcelChartGenerator: React.FC<ExcelChartGeneratorProps> = ({ darkMode = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'doughnut' | 'line'>('pie');
  const [chartData, setChartData] = useState<any>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<any[]>([]);

  // Load available Excel files from Google Drive
  useEffect(() => {
    loadExcelFiles();
  }, []);

  const loadExcelFiles = async () => {
    try {
      setIsLoading(true);
      const response = await listFiles();
      if (response.success) {
        const excelFiles = response.data.files.filter(file => 
          file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
        );
        setAvailableFiles(excelFiles);
      } else {
        setError('Failed to load files from Google Drive');
      }
    } catch (err) {
      setError('Failed to load Excel files from Google Drive');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBinaryFile = async (fileId: string): Promise<ArrayBuffer> => {
    const accessToken = await (window as any).gapi?.auth2?.getAuthInstance()?.currentUser?.get()?.getAuthResponse()?.access_token;
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.arrayBuffer();
  };

  const loadExcelFile = async (fileId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Download binary file content from Google Drive
      const arrayBuffer = await downloadBinaryFile(fileId);
      
      // Parse Excel file
      const parsedData = ExcelDataService.parseExcelFile(arrayBuffer);
      setExcelData(parsedData);
      
      // Get available columns with type information
      const columns = ExcelDataService.getAvailableColumns(parsedData);
      setAvailableColumns(columns);
      
      setSelectedColumn('');
      setChartData(null);
    } catch (err) {
      setError('Failed to load Excel file. Please ensure it\'s a valid Excel file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChart = async () => {
    if (!excelData || !selectedColumn) {
      setError('Please select a file and column first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Extract column data
      const columnData = ExcelDataService.extractColumnData(excelData, selectedColumn);
      if (!columnData) {
        setError('Column not found in the Excel file');
        return;
      }

      // Generate chart data based on column type
      let chartDataType: 'distribution' | 'frequency' | 'range' = 'frequency';
      if (columnData.type === 'number') {
        chartDataType = 'distribution';
      }

      const generatedData = ExcelDataService.generateChartData(columnData, chartDataType);
      
      // Format for Chart.js
      const formattedChartData = {
        labels: generatedData.labels,
        datasets: [{
          label: `${columnData.column} Analysis`,
          data: generatedData.data,
          backgroundColor: generatedData.backgroundColor,
          borderColor: generatedData.backgroundColor.map(color => color + '80'),
          borderWidth: 2,
        }]
      };

      setChartData(formattedChartData);
    } catch (err) {
      setError('Failed to generate chart from the selected column');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for chart generation');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Simple AI prompt processing (you can enhance this with actual Gemini API)
      const prompt = aiPrompt.toLowerCase();
      
      // Extract column name from prompt
      let detectedColumn = '';
      let detectedChartType: 'bar' | 'pie' | 'doughnut' | 'line' = 'pie';
      
      // Look for column names in the prompt
      availableColumns.forEach(col => {
        if (prompt.includes(col.name.toLowerCase())) {
          detectedColumn = col.name;
        }
      });

      // Detect chart type from prompt
      if (prompt.includes('bar') || prompt.includes('column')) {
        detectedChartType = 'bar';
      } else if (prompt.includes('pie')) {
        detectedChartType = 'pie';
      } else if (prompt.includes('doughnut') || prompt.includes('donut')) {
        detectedChartType = 'doughnut';
      } else if (prompt.includes('line')) {
        detectedChartType = 'line';
      }

      // If no specific file mentioned, try to find traindata.xlsx
      if (!selectedFile) {
        const traindataFile = availableFiles.find(file => 
          file.name.toLowerCase().includes('traindata')
        );
        if (traindataFile) {
          setSelectedFile(traindataFile.id);
          await loadExcelFile(traindataFile.id);
        }
      }

      // If fare column detected (common request)
      if (prompt.includes('fare') || prompt.includes('price') || prompt.includes('cost')) {
        const fareColumn = availableColumns.find(col => 
          col.name.toLowerCase().includes('fare') || 
          col.name.toLowerCase().includes('price') ||
          col.name.toLowerCase().includes('cost')
        );
        if (fareColumn) {
          detectedColumn = fareColumn.name;
        }
      }

      if (detectedColumn) {
        setSelectedColumn(detectedColumn);
        setChartType(detectedChartType);
        
        // Auto-generate chart
        setTimeout(() => {
          generateChart();
        }, 500);
      } else {
        setError('Could not detect a valid column name from your prompt. Please specify a column name.');
      }

    } catch (err) {
      setError('Failed to process AI prompt');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${darkMode ? 'bg-dark-glass border-dark-border' : 'bg-light-glass border-light-border'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileSpreadsheet className="w-5 h-5" />
            Excel Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Prompt Input */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ask AI to generate a chart:
            </label>
            <div className="flex gap-2">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Create a pie chart for fare column from traindata.xlsx'"
                className={`flex-1 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                onKeyPress={(e) => e.key === 'Enter' && handleAIPrompt()}
              />
              <Button
                onClick={handleAIPrompt}
                disabled={isLoading || !aiPrompt.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Excel File:
              </label>
              <Select value={selectedFile} onValueChange={(value) => {
                setSelectedFile(value);
                loadExcelFile(value);
              }}>
                <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
                  <SelectValue placeholder="Choose Excel file" />
                </SelectTrigger>
                <SelectContent>
                  {availableFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Column:
              </label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
                  <SelectValue placeholder="Choose column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Chart Type:
              </label>
              <Select value={chartType} onValueChange={(value: 'bar' | 'pie' | 'doughnut' | 'line') => setChartType(value)}>
                <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateChart}
            disabled={isLoading || !selectedFile || !selectedColumn}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Chart
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Chart Display */}
      {chartData && (
        <Card className={`${darkMode ? 'bg-dark-glass border-dark-border' : 'bg-light-glass border-light-border'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {selectedColumn} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Add download functionality here
                  console.log('Download chart functionality to be implemented');
                }}
                className={darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300'}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartVisualization
              type={chartType}
              data={chartData}
              title={`${selectedColumn} Analysis`}
              darkMode={darkMode}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {excelData && (
        <Card className={`${darkMode ? 'bg-dark-glass border-dark-border' : 'bg-light-glass border-light-border'}`}>
          <CardHeader>
            <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {excelData.headers.slice(0, 6).map((header, index) => (
                      <th key={index} className="text-left p-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.data.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      {row.slice(0, 6).map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-2">
                          {String(cell).slice(0, 50)}
                          {String(cell).length > 50 && '...'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Showing first 5 rows and 6 columns. Total: {excelData.data.length} rows, {excelData.headers.length} columns
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExcelChartGenerator;
