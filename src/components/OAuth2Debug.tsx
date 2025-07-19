import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const OAuth2Debug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const showDebugInfo = () => {
    const origin = window.location.origin;
    const redirectUri = `${origin}/oauth2callback`;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    const info = {
      currentOrigin: origin,
      redirectUri: redirectUri,
      clientId: clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET',
      currentUrl: window.location.href,
      port: window.location.port,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
    };
    
    setDebugInfo(info);
    console.log('🔍 OAuth2 Debug Info:', info);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader>
        <CardTitle>🔍 OAuth2 Debug Information</CardTitle>
        <CardDescription>
          Use this to verify your Google Cloud Console settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={showDebugInfo} variant="outline">
          Show Debug Info
        </Button>
        
        {debugInfo && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm font-mono">
            <div><strong>Current Origin:</strong> {debugInfo.currentOrigin}</div>
            <div><strong>Redirect URI:</strong> {debugInfo.redirectUri}</div>
            <div><strong>Client ID:</strong> {debugInfo.clientId}</div>
            <div><strong>Current URL:</strong> {debugInfo.currentUrl}</div>
            <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
            <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
            <div><strong>Port:</strong> {debugInfo.port}</div>
          </div>
        )}
        
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Google Cloud Console Settings:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Authorized JavaScript origins:</strong></div>
              <div className="bg-white p-2 rounded border font-mono text-xs">{debugInfo.currentOrigin}</div>
              
              <div className="mt-2"><strong>Authorized redirect URIs:</strong></div>
              <div className="bg-white p-2 rounded border font-mono text-xs">{debugInfo.redirectUri}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OAuth2Debug;
