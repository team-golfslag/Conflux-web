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
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (e) {
        console.error("Failed to parse stored session:", e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  // Check for session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.userSession_UserSession();
        setSession(userData);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));

        // If we're at the root and have a session, redirect to dashboard
        if (location.pathname === "/") {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
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

    checkSession();
  }, [apiClient, navigate, location.pathname]);

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    navigate("/");
  };

  const contextValue: SessionContextType = { session, loading, error, logout };
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
