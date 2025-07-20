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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface ChartVisualizationProps {
  type: 'bar' | 'pie' | 'doughnut' | 'line';
  data: ChartData;
  title: string;
  darkMode?: boolean;
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ 
  type, 
  data, 
  title, 
  darkMode = true 
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: title,
        color: darkMode ? '#ffffff' : '#111827',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
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
    <div className={`p-6 rounded-xl border ${
      darkMode 
        ? 'bg-dark-glass border-dark-border' 
        : 'bg-light-glass border-light-border'
    }`}>
      {renderChart()}
    </div>
  );
};

export default ChartVisualization;
