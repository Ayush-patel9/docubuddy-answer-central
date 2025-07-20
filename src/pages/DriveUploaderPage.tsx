import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DriveFilePicker from '../components/DriveFilePicker';

const DriveUploaderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Chat</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">DB</span>
              </div>
              <span className="font-semibold text-gray-900">DocuBuddy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <DriveFilePicker />
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Browse your Google Drive files above</li>
            <li>Click "Upload to Gemini" on any supported file (PDF, TXT, DOCX)</li>
            <li>Wait for the file to be processed and added to Gemini's knowledge base</li>
            <li>Go back to chat and ask Gemini questions about your uploaded files</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Currently supported file types are PDF, TXT, and DOCX. Other file types will show an error message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveUploaderPage;
