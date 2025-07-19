import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { googleAuth } from '@/lib/googleAuth';

interface GoogleDriveAuthProps {
  onAuthSuccess: () => void;
}

export const GoogleDriveAuth = ({ onAuthSuccess }: GoogleDriveAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    setIsAuthenticated(googleAuth.isAuthenticated());
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await googleAuth.signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start authentication');
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    googleAuth.signOut();
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Google Drive Connected
          </CardTitle>
          <CardDescription>
            You are successfully connected to Google Drive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Connect to Google Drive
        </CardTitle>
        <CardDescription>
          Sign in with your Google account to access your Drive files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <Button 
          onClick={handleSignIn} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Sign in with Google
            </>
          )}
        </Button>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>This will redirect you to Google to grant access to your Drive files.</p>
          <p>We only request read-only access to your files.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDriveAuth;
