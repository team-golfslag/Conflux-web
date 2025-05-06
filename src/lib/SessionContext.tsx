/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { UserSession } from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { useContext } from "react";
import {
  SESSION_STORAGE_KEY,
  SessionContext,
  SessionContextType,
} from "@/hooks/SessionContext";
import config from "@/config";

// Session expiration time in milliseconds (30 minutes)
const SESSION_EXPIRATION_TIME = 30 * 60 * 1000;

// Type for the stored session with timestamp
interface StoredSession {
  userData: UserSession;
  timestamp: number;
}

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const apiClient = useContext(ApiClientContext);

  // Load session from storage on initial render
  useEffect(() => {
    const loadStoredSession = () => {
      const storedSessionJSON = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSessionJSON) return null;

      try {
        const storedSession = JSON.parse(storedSessionJSON) as StoredSession;

        // Check if session is expired
        const now = new Date().getTime();
        if (now - storedSession.timestamp > SESSION_EXPIRATION_TIME) {
          console.log("Session expired, removing from storage");
          localStorage.removeItem(SESSION_STORAGE_KEY);
          return null;
        }

        // Return valid non-expired session
        return storedSession.userData;
      } catch (e) {
        console.error("Failed to parse stored session:", e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
    };

    // Load from storage first for immediate UI display
    const storedUserData = loadStoredSession();
    if (storedUserData) {
      setSession(storedUserData);
    }

    // Always fetch fresh session from API regardless of stored session
    const fetchSession = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.userSession_UserSession();

        // Store session with timestamp
        const sessionWithTimestamp: StoredSession = {
          userData,
          timestamp: new Date().getTime(),
        };

        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(sessionWithTimestamp),
        );
        setSession(userData);
        setError(null);

        // If we're at the root and have a session, redirect to dashboard
        if (location.pathname === "/") {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError(err instanceof Error ? err : new Error(String(err)));

        // Clear invalid session
        setSession(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);

        // If we're not at root and have no session, redirect to root
        if (location.pathname !== "/") {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [apiClient, navigate, location.pathname]);

  const saveSession = (userData: UserSession) => {
    const sessionWithTimestamp: StoredSession = {
      userData,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(sessionWithTimestamp),
    );
    setSession(userData);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.href = `${config.apiBaseURL}/session/logout?redirectUri=${encodeURIComponent(config.webUIUrl) + "/dashboard"}`;
  };

  const contextValue: SessionContextType = {
    session,
    loading,
    error,
    logout,
    saveSession,
  };
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
