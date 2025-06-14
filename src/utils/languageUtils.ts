/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useLanguage } from "@/lib/LanguageContext";

// Hook to get language utility functions
export const useLanguageHelpers = () => {
  const { validateLanguage, getLanguageName, getLanguageValidationError } =
    useLanguage();

  return {
    validateLanguage,
    getLanguageName,
    getLanguageValidationError,
  };
};

// Standalone functions for backward compatibility with existing code
// These will work but won't have the dynamic language data loaded from the API
// Components should migrate to use the context directly for full functionality

export const getLanguageName = (language: string): string | null => {
  if (language === "") return "Default";
  // This is a fallback - components should use the context for real data
  return null;
};

export const getLanguageValidationError = (language: string): string | null => {
  if (!language.trim()) return null;
  // This is a fallback - components should use the context for real validation
  return "Must be a valid language code (e.g., 'eng', 'nld').";
};
