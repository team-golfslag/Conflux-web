/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { createContext, useContext } from "react";
import { UserSession } from "@team-golfslag/conflux-api-client/src/client";

// Define the context type
export type SessionContextType = {
  session: UserSession | null;
  loading: boolean;
  error: Error | null;
  logout: () => void;
  saveSession: (session: UserSession) => void;
};

// Create the context with a default value
export const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  error: null,
  logout: () => {},
  saveSession: () => {},
});

// Custom hook to use the session context
export function useSession() {
  return useContext(SessionContext);
}

// Storage key for session data
export const SESSION_STORAGE_KEY = "conflux_user_session";
