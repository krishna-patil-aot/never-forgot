'use client';

import { useCallback, useEffect } from 'react';
import { useGoogleAuthStore } from '@/stores/useGoogleAuthStore';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  IGoogleCredentialResponse,
  IGoogleDecodedToken,
  IGoogleOAuthTokenResponse,
  IGoogleOAuthError,
  IGooglePromptMomentNotification,
  IGoogleUserInfo,
} from '@/types/googleAuth.types';
import { IAuthApiResponse } from '@/types/auth.types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: IGoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (
            momentListener?: (notification: IGooglePromptMomentNotification) => void
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string }
          ) => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (res: IGoogleOAuthTokenResponse) => void;
            error_callback?: (err: IGoogleOAuthError) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

function parseJwt(token: string): IGoogleDecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as IGoogleDecodedToken;
  } catch {
    return null;
  }
}

export function useGoogleAuth() {
  const isLoading = useGoogleAuthStore((state) => state.isLoading);
  const authError = useGoogleAuthStore((state) => state.authError);
  const setLoading = useGoogleAuthStore((state) => state.setLoading);
  const setAuthError = useGoogleAuthStore((state) => state.setAuthError);
  const resetState = useGoogleAuthStore((state) => state.resetState);

  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthModalOpen = useAuthStore((state) => state.setIsAuthModalOpen);
  const user = useAuthStore((state) => state.user);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Process authenticated Google payload against the server
  const handleAuthPayload = useCallback(
    async (payload: {
      email: string;
      fullName: string;
      avatarUrl?: string;
      credential?: string;
    }): Promise<boolean> => {
      setLoading(true);
      setAuthError(null);
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as IAuthApiResponse;
        if (res.ok && data.success && data.user) {
          setUser(data.user);
          setIsAuthModalOpen(false);
          resetState();
          return true;
        }

        setAuthError(data.message || 'Google authentication failed');
        return false;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Google authentication request failed';
        setAuthError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setIsAuthModalOpen, setLoading, setAuthError, resetState]
  );

  // Callback from native Google One Tap / Credential response
  const handleCredentialResponse = useCallback(
    async (response: IGoogleCredentialResponse) => {
      if (!response.credential) return;

      const decoded = parseJwt(response.credential);
      if (decoded && decoded.email) {
        await handleAuthPayload({
          email: decoded.email,
          fullName: decoded.name || decoded.email.split('@')[0],
          avatarUrl: decoded.picture,
          credential: response.credential,
        });
      }
    },
    [handleAuthPayload]
  );

  // Initialize native Google Identity Services SDK script
  useEffect(() => {
    if (!googleClientId || user || typeof window === 'undefined') return;

    const existingScript = document.getElementById('google-gsi-client');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
          });

          // Prompt native Google One Tap
          window.google.accounts.id.prompt();
        }
      };
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
      });
    }
  }, [googleClientId, user, handleCredentialResponse]);

  // Trigger genuine Google OAuth Sign-In flow
  const triggerGoogleSignIn = useCallback(() => {
    if (!googleClientId) {
      setAuthError('Google Client ID is missing. Please check your configuration.');
      return;
    }

    setAuthError(null);

    // Use Google Identity Services OAuth2 token client for account selection popup
    if (window.google?.accounts?.oauth2) {
      setLoading(true);

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: IGoogleOAuthTokenResponse) => {
          if (tokenResponse.error) {
            setAuthError(
              tokenResponse.error_description ||
                tokenResponse.error ||
                'Google sign-in was not authorized.'
            );
            setLoading(false);
            return;
          }

          if (tokenResponse.access_token) {
            try {
              const profileRes = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                }
              );

              if (profileRes.ok) {
                const profile = (await profileRes.json()) as IGoogleUserInfo;
                await handleAuthPayload({
                  email: profile.email,
                  fullName: profile.name || profile.email.split('@')[0],
                  avatarUrl: profile.picture,
                });
              } else {
                setAuthError('Unable to retrieve Google user profile.');
                setLoading(false);
              }
            } catch {
              setAuthError('Network error while retrieving Google profile.');
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        },
        error_callback: (err: IGoogleOAuthError) => {
          setLoading(false);
          if (err.type === 'popup_closed') {
            return;
          }
          if (err.type === 'popup_failed_to_open') {
            setAuthError('Sign-in popup was blocked by your browser. Please allow popups.');
            return;
          }
          setAuthError(`Google Sign-In: ${err.message || err.type}`);
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      setAuthError('Google Sign-In services are still loading. Please try again in a moment.');
    }
  }, [googleClientId, setAuthError, setLoading, handleAuthPayload]);

  const clearGoogleError = useCallback(() => {
    setAuthError(null);
  }, [setAuthError]);

  return {
    isLoading,
    authError,
    triggerGoogleSignIn,
    clearGoogleError,
  };
}
