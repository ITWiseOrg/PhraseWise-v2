import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

const domain = 'dev-1tigc5o0f8exc4gi.us.auth0.com';
const clientId = '5WJKWFjlpkmeSHqvfk5ZbpHKVtSORdH9';

const SilentAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        try {
          await loginWithRedirect({
            prompt: 'none', // Silent authentication
          });
        } catch (error) {
          console.error('Silent authentication failed:', error);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Validating token...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <SilentAuthWrapper>
        <App />
      </SilentAuthWrapper>
    </Auth0Provider>
  </StrictMode>
);