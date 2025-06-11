import { Input } from "@/components/ui/input";
import { iso6392 } from "iso-639-2";

// Language validation function using ISO 639-2
const validateLanguage = (language: string): boolean => {
  if (!language.trim()) return true; // Allow empty string
  return iso6392.some(
    (lang) =>
      lang.iso6392B === language.toLowerCase() ||
      (lang.iso6392T && lang.iso6392T === language.toLowerCase()),
  );
};

// Helper function to get language name from ISO code
export const getLanguageName = (language: string): string | null => {
  if (language === "") return "Default";
  const langData = iso6392.find(
    (lang) =>
      lang.iso6392B === language.toLowerCase() ||
      (lang.iso6392T && lang.iso6392T === language.toLowerCase()),
  );
  return langData ? langData.name : null;
};

// Helper function to get language validation error message
export const getLanguageValidationError = (language: string): string | null => {
  if (!language.trim()) return null;
  if (!validateLanguage(language)) {
    return "Must be a valid ISO 639-2 code (e.g., 'eng', 'nld').";
  }
  return null;
};

interface LanguageInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string | null;
}

export const LanguageInput: React.FC<LanguageInputProps> = ({
  value,
  onChange,
  className = "",
  error,
}) => {
  const languageName = getLanguageName(value);
  const isValid = validateLanguage(value);

  return (
    <div className="flex flex-col">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="eng, nld, fra..."
        className={`${className} ${error ? "border-red-500 focus:border-red-500" : ""}`}
      />
      <div className="mt-1 flex h-4 items-center gap-2">
        {value && value.trim() && (
          <div className="flex min-w-0 items-center gap-1">
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <p
              className={`truncate text-xs ${isValid ? "text-green-600" : "text-red-600"}`}
            >
              {isValid && languageName ? languageName : "Invalid code"}
            </p>
          </div>
        )}
      </div>
      <div className="flex h-4 items-start">
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};
