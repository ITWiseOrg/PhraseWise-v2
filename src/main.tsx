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
    return <div>Loading...</div>;
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