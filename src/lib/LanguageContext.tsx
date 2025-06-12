/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ApiClientContext } from "./ApiClientContext";

interface LanguageContextType {
  availableLanguages: { [key: string]: string } | null;
  isLoading: boolean;
  error: string | null;
  validateLanguage: (language: string) => boolean;
  getLanguageName: (language: string) => string | null;
  getLanguageValidationError: (language: string) => string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<{
    [key: string]: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useContext(ApiClientContext);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const languages = await apiClient.language_GetAvailableLanguageCodes();
        setAvailableLanguages(languages);
      } catch (err) {
        console.error("Failed to load available languages:", err);
        setError("Failed to load available languages");
        // Fallback to empty object to prevent app from breaking
        setAvailableLanguages({});
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguages();
  }, [apiClient]);

  // Language validation function using the loaded dictionary
  const validateLanguage = (language: string): boolean => {
    if (!language.trim()) return true; // Allow empty string
    if (!availableLanguages) return false; // If not loaded yet, consider invalid
    return Object.prototype.hasOwnProperty.call(
      availableLanguages,
      language.toLowerCase(),
    );
  };

  // Helper function to get language name from code
  const getLanguageName = (language: string): string | null => {
    if (language === "") return "Default";
    if (!availableLanguages) return null;
    return availableLanguages[language.toLowerCase()] || null;
  };

  // Helper function to get language validation error message
  const getLanguageValidationError = (language: string): string | null => {
    if (!language.trim()) return null;
    if (!validateLanguage(language)) {
      return "Must be a valid language code (e.g., 'eng', 'nld').";
    }
    return null;
  };

  const contextValue: LanguageContextType = {
    availableLanguages,
    isLoading,
    error,
    validateLanguage,
    getLanguageName,
    getLanguageValidationError,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
