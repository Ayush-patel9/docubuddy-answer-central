import React, { useState, useEffect } from 'react';
import { Chart, GoogleChartWrapperChartType } from 'react-google-charts';
import { GoogleChartsService, GoogleChartResponse } from '../services/googleChartsService';

interface GoogleChartVisualizationProps {
  prompt: string;
  onComplete?: (success: boolean, error?: string) => void;
}

export const GoogleChartVisualization: React.FC<GoogleChartVisualizationProps> = ({
  prompt,
  onComplete
}) => {
  const [chartData, setChartData] = useState<GoogleChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateChart();
  }, [prompt]);

  const generateChart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎯 GoogleChartVisualization: Generating chart for prompt:', prompt);
      
      const result = await GoogleChartsService.generateChartFromPrompt({
        prompt
      });

      if (result.success && result.chartConfig) {
        setChartData(result);
        onComplete?.(true);
      } else {
        setError(result.error || 'Failed to generate chart');
        onComplete?.(false, result.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      onComplete?.(false, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 text-sm animate-pulse">
          📊 Analyzing Excel data and generating chart...
        </p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-red-400 text-xl">❌</div>
          <div className="flex-1">
            <h3 className="text-red-300 font-semibold mb-2">Chart Generation Failed</h3>
            <p className="text-red-200 mb-4">{error}</p>
            
            {chartData?.suggestions && chartData.suggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-yellow-300 font-medium mb-2">💡 Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-100 text-sm">
                  {chartData.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button
              onClick={generateChart}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData?.chartConfig) {
    return (
      <div className="text-gray-400 text-center p-4">
        No chart data available
      </div>
    );
  }

  const { chartConfig } = chartData;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto">
      {/* Chart Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center">
          📊 {chartConfig.title}
        </h3>
        <p className="text-gray-300 text-sm mb-2">
          {chartConfig.summary}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>📁 Source: {chartConfig.sourceFile}</span>
          <span>📋 Column: {chartConfig.columnAnalyzed}</span>
          <span>📈 Type: {chartConfig.chartType}</span>
        </div>
      </div>

      {/* Google Chart */}
      <div className="bg-gray-800/30 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <Chart
          chartType={chartConfig.chartType as GoogleChartWrapperChartType}
          data={chartConfig.data}
          options={{
            ...chartConfig.options,
            backgroundColor: 'transparent',
            width: '100%',
            height: 400
          }}
          width="100%"
          height="400px"
        />
      </div>

      {/* Chart Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const dataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(chartConfig.data, null, 2)
              )}`;
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = `chart-data-${Date.now()}.json`;
              link.click();
            }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center space-x-1"
          >
            <span>💾</span>
            <span>Export Data</span>
          </button>
          
          <button
            onClick={generateChart}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center space-x-1"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-500">
          Generated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Chart Type Info */}
      <div className="mt-4 p-3 bg-gray-800/20 rounded-lg border border-gray-700/50">
        <h4 className="text-sm font-medium text-gray-300 mb-2">📝 Chart Details</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <span className="font-medium">Data Points:</span> {chartConfig.data.length - 1}
          </div>
          <div>
            <span className="font-medium">Chart Engine:</span> Google Charts
          </div>
          <div>
            <span className="font-medium">Visualization:</span> {chartConfig.chartType.replace('Chart', '')}
          </div>
          <div>
            <span className="font-medium">Interactive:</span> Yes
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleChartVisualization;
