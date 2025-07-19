import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '@/lib/googleAuth';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError(`OAuth error: ${error}`);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        console.log('🔐 OAuth2Callback: Processing authorization code...');
        
        // Exchange code for tokens
        const success = await googleAuth.handleCallback(code);
        
        if (success) {
          console.log('🔐 OAuth2Callback: Authentication successful');
          setStatus('success');
          
          // Redirect back to the drive page after a short delay
          setTimeout(() => {
            navigate('/drive');
          }, 2000);
        } else {
          setError('Failed to authenticate with Google');
          setStatus('error');
        }
      } catch (err) {
        console.error('🔐 OAuth2Callback: Error processing callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold">Authenticating with Google Drive...</h2>
          <p className="text-gray-600">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-green-600">Authentication Successful!</h2>
          <p className="text-gray-600">You have successfully connected to Google Drive.</p>
          <p className="text-sm text-gray-500">Redirecting you back to the Drive page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/drive')} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default OAuth2Callback;
