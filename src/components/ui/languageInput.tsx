import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/languageContext";

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
  const { validateLanguage, getLanguageName, isLoading } = useLanguage();

  const languageName = getLanguageName(value);
  const isValid = validateLanguage(value);

  return (
    <div className="flex flex-col">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="eng, nld, fra..."
        className={`${className} ${error ? "border-red-500 focus:border-red-500" : ""}`}
        disabled={isLoading}
      />
      <div className="mt-1 flex h-4 items-center gap-2">
        {isLoading && (
          <div className="flex min-w-0 items-center gap-1">
            <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-gray-400"></span>
            <p className="truncate text-xs text-gray-500">
              Loading languages...
            </p>
          </div>
        )}
        {!isLoading && value && value.trim() && (
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
