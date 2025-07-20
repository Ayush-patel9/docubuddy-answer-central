import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChatChartProps {
  type: 'bar' | 'pie' | 'doughnut' | 'line';
  data: any;
  title: string;
  summary: string;
  darkMode?: boolean;
}

const ChatChart: React.FC<ChatChartProps> = ({ 
  type, 
  data, 
  title, 
  summary,
  darkMode = true 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
        color: darkMode ? '#ffffff' : '#111827',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20
        }
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
        },
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)',
        },
      },
    } : undefined,
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <div className={`rounded-xl border p-4 my-4 ${
      darkMode 
        ? 'bg-gray-900/50 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Chart Container */}
      <div className="h-80 mb-4">
        {renderChart()}
      </div>
      
      {/* Summary */}
      <div className={`text-sm p-3 rounded-lg border-l-4 ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-400 text-blue-200' 
          : 'bg-blue-50 border-blue-400 text-blue-800'
      }`}>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default ChatChart;
