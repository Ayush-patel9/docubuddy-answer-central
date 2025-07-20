// Demo data service for Excel chart generation
export const DEMO_EXCEL_DATA = {
  'traindata.xlsx': {
    headers: ['Fare', 'Age', 'Class', 'Gender', 'Survived'],
    data: [
      [7.25, 22, '3rd', 'Male', 0],
      [71.28, 38, '1st', 'Female', 1],
      [7.92, 26, '3rd', 'Female', 1],
      [53.10, 35, '1st', 'Female', 1],
      [8.05, 35, '3rd', 'Male', 0],
      [8.46, 54, '3rd', 'Male', 0],
      [51.86, 2, '1st', 'Male', 0],
      [21.07, 27, '3rd', 'Female', 1],
      [11.13, 14, '3rd', 'Female', 1],
      [30.07, 4, '2nd', 'Female', 1],
      [16.70, 58, '3rd', 'Female', 1],
      [26.55, 20, '2nd', 'Male', 0],
      [13.00, 39, '3rd', 'Female', 1],
      [30.07, 14, '2nd', 'Female', 1],
      [7.05, 55, '3rd', 'Female', 1],
      [24.15, 2, '3rd', 'Male', 0],
      [13.78, 31, '3rd', 'Female', 1],
      [7.75, 35, '3rd', 'Male', 0],
      [21.00, 34, '3rd', 'Male', 0],
      [7.25, 15, '3rd', 'Female', 1]
    ]
  }
};

export class DemoExcelService {
  static getDemoData(fileName: string, columnName: string) {
    const data = DEMO_EXCEL_DATA[fileName];
    if (!data) return null;

    const columnIndex = data.headers.findIndex(h => 
      h.toLowerCase().includes(columnName.toLowerCase())
    );
    
    if (columnIndex === -1) return null;

    const values = data.data.map(row => row[columnIndex]);
    const columnHeader = data.headers[columnIndex];
    
    // Generate frequency data for charts
    const frequency: { [key: string]: number } = {};
    values.forEach(value => {
      const key = String(value);
      frequency[key] = (frequency[key] || 0) + 1;
    });

    const entries = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    const labels = entries.slice(0, 10).map(([key]) => key); // Top 10
    const counts = entries.slice(0, 10).map(([, count]) => count);

    // Generate colors
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
      '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16'
    ];

    return {
      labels,
      datasets: [{
        label: `${columnHeader} Distribution`,
        data: counts,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(c => c + '80'),
        borderWidth: 2,
      }]
    };
  }

  static getAvailableFiles(): string[] {
    return Object.keys(DEMO_EXCEL_DATA);
  }

  static getAvailableColumns(fileName: string): string[] {
    const data = DEMO_EXCEL_DATA[fileName];
    return data ? data.headers : [];
  }

  static generateSummary(fileName: string, columnName: string): string {
    const data = DEMO_EXCEL_DATA[fileName];
    if (!data) return 'Data not found.';

    const columnIndex = data.headers.findIndex(h => 
      h.toLowerCase().includes(columnName.toLowerCase())
    );
    
    if (columnIndex === -1) return 'Column not found.';

    const values = data.data.map(row => row[columnIndex]);
    const uniqueValues = new Set(values).size;
    
    return `Analysis of ${data.headers[columnIndex]} from ${fileName}: ${values.length} data points with ${uniqueValues} unique values. Showing frequency distribution of the most common values.`;
  }
}
