/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ApiClientContext } from "@/lib/ApiClientContext";

interface BackendStatusContextType {
  isBackendDown: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  retryConnection: () => void;
}

const BackendStatusContext = createContext<BackendStatusContextType>({
  isBackendDown: false,
  isChecking: false,
  lastChecked: null,
  retryConnection: () => {},
});

interface BackendStatusProviderProps {
  children: ReactNode;
}

export function BackendStatusProvider({
  children,
}: BackendStatusProviderProps) {
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const apiClient = useContext(ApiClientContext);

  const checkBackendStatus = useCallback(async (): Promise<boolean> => {
    try {
      setIsChecking(true);
      // Use the new health endpoint to check if backend is responsive
      await apiClient.health_GetHealth();
      setLastChecked(new Date());
      return true;
    } catch (error: unknown) {
      console.error("Backend connectivity check failed:", error);
      setLastChecked(new Date());

      // Check for different types of errors that indicate the backend is down
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : "";

      if (
        error instanceof TypeError ||
        errorName === "NetworkError" ||
        errorMessage.includes("fetch") ||
        errorName === "TimeoutError" ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("Network request failed")
      ) {
        // Network error or timeout - backend is likely down
        return false;
      }

      // For other errors, try the userSession endpoint as fallback
      try {
        await apiClient.userSession_UserSession();
        return true;
      } catch (fallbackError: unknown) {
        // If this also fails with a network error, backend is down
        const fallbackErrorMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);
        if (
          fallbackError instanceof TypeError ||
          fallbackErrorMessage.includes("fetch") ||
          fallbackErrorMessage.includes("ECONNREFUSED")
        ) {
          return false;
        }
        // If it fails with other errors (401, 403, etc.), backend is up
        return true;
      }
    } finally {
      setIsChecking(false);
    }
  }, [apiClient]);

  const retryConnection = useCallback(async () => {
    const isUp = await checkBackendStatus();
    setIsBackendDown(!isUp);
  }, [checkBackendStatus]);

  useEffect(() => {
    const initialCheck = async () => {
      const isUp = await checkBackendStatus();
      setIsBackendDown(!isUp);
    };

    initialCheck();
  }, [checkBackendStatus]);

  // Periodic health check every 30 seconds when backend is marked as down
  useEffect(() => {
    if (!isBackendDown) return;

    const interval = setInterval(async () => {
      const isUp = await checkBackendStatus();
      if (isUp) {
        setIsBackendDown(false);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isBackendDown, checkBackendStatus]);

  const contextValue: BackendStatusContextType = {
    isBackendDown,
    isChecking,
    lastChecked,
    retryConnection,
  };

  return (
    <BackendStatusContext.Provider value={contextValue}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus() {
  return useContext(BackendStatusContext);
}
