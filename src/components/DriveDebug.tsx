import { useDrive } from '@/contexts/DriveContext';

export const DriveDebug = () => {
  const driveContext = useDrive();
  
  return (
    <div className="p-4 bg-gray-100 border rounded-lg">
      <h3 className="font-bold mb-2">🔍 Drive Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Authenticated:</strong> {driveContext.isAuthenticated.toString()}</div>
        <div><strong>Files count:</strong> {driveContext.files.length}</div>
        <div><strong>Loading:</strong> {driveContext.isLoading.toString()}</div>
        <div><strong>Error:</strong> {driveContext.error || 'None'}</div>
        <div><strong>API Initialized:</strong> {driveContext.apiInitialized.toString()}</div>
        <div><strong>Selected File:</strong> {driveContext.selectedFile?.name || 'None'}</div>
      </div>
      <button 
        onClick={() => driveContext.refreshFiles()} 
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Refresh Files
      </button>
    </div>
  );
};

export default DriveDebug;
