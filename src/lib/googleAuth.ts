// Google Drive Authentication Service
// This handles the OAuth 2.0 flow for Google Drive API access

interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

class GoogleAuthService {
  private config: GoogleAuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/oauth2callback`,
      scope: 'https://www.googleapis.com/auth/drive.readonly'
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    
    const expiry = localStorage.getItem('google_token_expiry');
    if (!expiry) return false;
    
    return Date.now() < parseInt(expiry);
  }

  // Get stored access token
  getStoredToken(): string | null {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }
    
    const storedToken = localStorage.getItem('google_access_token');
    const expiry = localStorage.getItem('google_token_expiry');
    
    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      this.accessToken = storedToken;
      this.tokenExpiry = parseInt(expiry);
      return storedToken;
    }
    
    return null;
  }

  // Start OAuth flow - redirect to Google
  async signIn(): Promise<void> {
    if (!this.config.clientId) {
      throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.');
    }

    console.log('🔐 GoogleAuth: Using redirect URI:', this.config.redirectUri);
    console.log('🔐 GoogleAuth: Current origin:', window.location.origin);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.config.clientId);
    authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.config.scope);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    console.log('🔐 GoogleAuth: Full auth URL:', authUrl.toString());
    console.log('🔐 GoogleAuth: Redirecting to Google OAuth...');
    window.location.href = authUrl.toString();
  }

  // Handle OAuth callback
  async handleCallback(code: string): Promise<boolean> {
    try {
      console.log('🔐 GoogleAuth: Handling callback with code:', code.substring(0, 10) + '...');
      
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('🔐 GoogleAuth: Token exchange failed:', error);
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokens: GoogleAuthResponse = await tokenResponse.json();
      console.log('🔐 GoogleAuth: Received tokens successfully');

      // Store tokens
      this.accessToken = tokens.access_token;
      this.tokenExpiry = Date.now() + (tokens.expires_in * 1000);

      localStorage.setItem('google_access_token', tokens.access_token);
      localStorage.setItem('google_token_expiry', this.tokenExpiry.toString());
      
      if (tokens.refresh_token) {
        localStorage.setItem('google_refresh_token', tokens.refresh_token);
      }

      return true;
    } catch (error) {
      console.error('🔐 GoogleAuth: Error in handleCallback:', error);
      return false;
    }
  }

  // Sign out
  signOut(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_token_expiry');
    localStorage.removeItem('google_refresh_token');
    
    console.log('🔐 GoogleAuth: User signed out');
  }

  // Get current access token (for API calls)
  async getAccessToken(): Promise<string | null> {
    const token = this.getStoredToken();
    if (token) {
      return token;
    }

    // Try to refresh token if we have a refresh token
    const refreshToken = localStorage.getItem('google_refresh_token');
    if (refreshToken) {
      return await this.refreshAccessToken(refreshToken);
    }

    return null;
  }

  // Refresh access token using refresh token
  private async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      console.log('🔐 GoogleAuth: Refreshing access token...');
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        console.error('🔐 GoogleAuth: Token refresh failed');
        return null;
      }

      const tokens: GoogleAuthResponse = await response.json();
      
      this.accessToken = tokens.access_token;
      this.tokenExpiry = Date.now() + (tokens.expires_in * 1000);

      localStorage.setItem('google_access_token', tokens.access_token);
      localStorage.setItem('google_token_expiry', this.tokenExpiry.toString());

      console.log('🔐 GoogleAuth: Token refreshed successfully');
      return tokens.access_token;
    } catch (error) {
      console.error('🔐 GoogleAuth: Error refreshing token:', error);
      return null;
    }
  }
}

export const googleAuth = new GoogleAuthService();
export default googleAuth;
