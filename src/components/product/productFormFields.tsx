/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  ProductCategoryType,
  ProductType,
  ProductSchema,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useState, useEffect, useContext } from "react";
import { ArrowRight, Archive, Loader2, CheckCircle } from "lucide-react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";

export interface ProductFormData {
  title: string;
  url: string;
  productType: ProductType;
  productSchema: ProductSchema;
  categories: ProductCategoryType[];
}

interface ValidationError {
  field: string;
  message: string;
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  setProductTitle: (title: string) => void;
  setUrl: (url: string) => void;
  setProductType: (productType: ProductType) => void;
  setSchema: (schema: ProductSchema) => void;
  onCategoryChange: (category: ProductCategoryType) => void;
  onValidationChange?: (hasErrors: boolean) => void;
  onError?: (message: string) => void;
}

function getEnumKeys<
  T extends string,
  TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
  return Object.keys(enumVariable) as Array<T>;
}

// Currently supported schemas - only DOI and Archive are fully supported
const supportedSchemas = [ProductSchema.Doi, ProductSchema.Archive];

// Function to detect schema type from URL
const detectSchemaFromUrl = (url: string): ProductSchema | null => {
  // Check each schema's validation pattern to see if the URL matches
  for (const [schema, config] of Object.entries(urlValidationFunctions)) {
    if (
      config.validate(url) &&
      supportedSchemas.includes(schema as ProductSchema)
    ) {
      return schema as ProductSchema;
    }
  }
  return null;
};

// Validation functions for different schemas
const urlValidationFunctions = {
  [ProductSchema.Doi]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/(?:dx\.)?doi\.org\/10\.\d+\/.+$/.test(url);
    },
    placeholder: "https://doi.org/10.1000/example",
    description: "DOI URL (e.g., https://doi.org/10.1000/example)",
  },
  [ProductSchema.Ark]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/.+\/ark:\/\d+\/.+$/.test(url);
    },
    placeholder: "https://example.org/ark:/12345/example",
    description: "ARK URL (e.g., https://example.org/ark:/12345/example)",
  },
  [ProductSchema.Handle]: {
    validate: (url: string): boolean => {
      return /^([^/]+(?:\.[^/]+)*)\/([^/]+)$/.test(url);
    },
    placeholder: "12345/hdl1",
    description: "Handle URL (e.g., 12345/hdl1)",
  },
  [ProductSchema.Isbn]: {
    validate: (url: string): boolean => {
      const isbnWithoutHyphens = url.replace(/-/g, "");
      const digits: number[] = [];
      for (let i = 0; i < isbnWithoutHyphens.length; i++) {
        const char = isbnWithoutHyphens[i];
        if (char >= "0" && char <= "9") {
          digits.push(parseInt(char, 10));
        } else if (char === "X" && i === 9) {
          digits.push(10);
        } else if (char !== " ") {
          return false;
        }
      }

      if (digits.length !== 10 && digits.length !== 13) {
        return false;
      }
      let t = 0,
        s = 0;

      if (digits.length === 10) {
        for (let i = 0; i < 10; ++i) {
          t += digits[i];
          s += t;
        }
        return s % 11 === 0;
      }

      for (let i = 0; i < 12; ++i) {
        t += digits[i] * (i % 2 === 0 ? 1 : 3);
      }
      return (10 - (t % 10)) % 10 === digits[12];
    },
    placeholder: "978-0123456789 or URL",
    description: "ISBN (978-0123456789) or URL containing ISBN",
  },
  [ProductSchema.Rrid]: {
    validate: (url: string): boolean => {
      return /^RRID:.+$/.test(url);
    },
    placeholder: "RRID:AB_123456 or URL",
    description: "RRID identifier (RRID:AB_123456) or URL",
  },
  [ProductSchema.Archive]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/web.archive.org\/.+$/.test(url);
    },
    placeholder:
      "https://web.archive.org/web/20230101000000/https://example.com",
    description:
      "Web Archive URL (e.g., https://web.archive.org/web/20230101000000/https://example.com)",
  },
};

function validateField(
  field: string,
  value: string,
  schema?: ProductSchema,
): ValidationError | null {
  switch (field) {
    case "title":
      if (!value.trim()) {
        return { field, message: "Title is required" };
      }
      if (value.length < 3) {
        return { field, message: "Title must be at least 3 characters long" };
      }
      break;

    case "url":
      if (!value.trim()) {
        return { field, message: "URL is required" };
      }

      if (schema && urlValidationFunctions[schema]) {
        const { validate, description } = urlValidationFunctions[schema];
        if (!validate(value)) {
          return { field, message: `Invalid format. Expected: ${description}` };
        }
      } else {
        // Fallback to basic URL validation
        const basicUrlPattern = /^https?:\/\/.+$/;
        if (!basicUrlPattern.test(value)) {
          return { field, message: "URL must start with http:// or https://" };
        }
      }
      break;

    case "schema":
      if (schema && !supportedSchemas.includes(schema)) {
        return {
          field,
          message: `${schema} schema is not yet supported by the Dutch RAiD implementation. Currently supported: ${supportedSchemas.join(", ")}`,
        };
      }
      break;
  }

  return null;
}

export default function ProductFormFields({
  formData,
  setProductTitle,
  setUrl,
  setSchema,
  setProductType,
  onCategoryChange,
  onValidationChange,
  onError,
}: Readonly<ProductFormFieldsProps>) {
  const apiClient = useContext(ApiClientContext);

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isCreatingArchive, setIsCreatingArchive] = useState<boolean>(false);
  const [showArchiveSuggestion, setShowArchiveSuggestion] =
    useState<boolean>(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState<boolean>(false);

  // DOI autofill state
  const [doiError, setDoiError] = useState<string | null>(null);
  const [isLoadingDoi, setIsLoadingDoi] = useState<boolean>(false);

  // DOI autofill function
  const handleDoiAutoFill = async (): Promise<boolean> => {
    if (!formData.url || formData.productSchema !== ProductSchema.Doi)
      return false;

    setDoiError(null);
    setIsLoadingDoi(true);

    try {
      // Extract DOI from URL if it's a full DOI URL
      let doi = formData.url;
      const doiMatch = formData.url.match(/(?:doi\.org\/|DOI:)?(10\.\d+\/.+)$/);
      if (doiMatch) {
        doi = doiMatch[1];
      }

      const result = await apiClient.productInfo_GetInfoFromDoi(doi);
      if (result) {
        if (result.title) {
          setProductTitle(result.title);
        }
        if (result.type) {
          setProductType(result.type);
        }
        return true;
      } else {
        setDoiError("No information found for this DOI.");
        return false;
      }
    } catch (error) {
      console.error("Error fetching DOI info:", error);
      setDoiError("Failed to fetch DOI information. Please try again.");
      return false;
    } finally {
      setIsLoadingDoi(false);
    }
  };

  // Archive creation function
  const handleCreateArchiveInternal = async (
    url: string,
  ): Promise<string | null> => {
    try {
      const archiveUrl = await apiClient.productInfo_GetArchiveLinkForUrl(url);
      return archiveUrl;
    } catch (error) {
      console.error("Error creating archive:", error);
      if (onError) {
        onError(
          `Failed to create archive: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
      return null;
    }
  };

  // Validate fields when form data changes
  useEffect(() => {
    const errors: ValidationError[] = [];

    if (touched.title) {
      const titleError = validateField("title", formData.title);
      if (titleError) errors.push(titleError);
    }

    if (touched.url) {
      const urlError = validateField(
        "url",
        formData.url,
        formData.productSchema,
      );
      if (urlError) errors.push(urlError);
    }

    // Always validate schema when it's set (no need for touched state)
    if (formData.productSchema) {
      const schemaError = validateField("schema", "", formData.productSchema);
      if (schemaError) errors.push(schemaError);
    }

    setValidationErrors(errors);

    // Notify parent about validation state
    if (onValidationChange) {
      onValidationChange(errors.length > 0);
    }
  }, [formData, touched, onValidationChange]);

  const handleTitleChange = (value: string) => {
    setProductTitle(value);
    setTouched((prev) => ({ ...prev, title: true }));
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setTouched((prev) => ({ ...prev, url: true }));
    setShowArchiveSuggestion(false); // Hide suggestion when URL changes
    setShowArchiveSuccess(false); // Hide success message when URL changes
    if (doiError) setDoiError(null); // Clear DOI error when URL changes

    // Always auto-detect and set schema based on URL pattern
    if (value.trim()) {
      const detectedSchema = detectSchemaFromUrl(value.trim());
      if (detectedSchema) {
        // Only update schema if it's different from current or if no schema is selected
        if (
          !formData.productSchema ||
          formData.productSchema !== detectedSchema
        ) {
          setSchema(detectedSchema);
        }
      } else {
        // If no schema detected and it's a valid HTTP URL, show archive suggestion
        const basicUrlPattern = /^https?:\/\/.+$/;
        if (basicUrlPattern.test(value.trim())) {
          setShowArchiveSuggestion(true);
        }
      }
    }

    // Special case: if current schema is Archive but URL is valid HTTP and NOT already an archive URL
    if (formData.productSchema === ProductSchema.Archive && value.trim()) {
      const basicUrlPattern = /^https?:\/\/.+$/;
      const isAlreadyArchiveUrl = urlValidationFunctions[
        ProductSchema.Archive
      ].validate(value.trim());
      if (basicUrlPattern.test(value.trim()) && !isAlreadyArchiveUrl) {
        // Check if it matches another schema first
        const detectedSchema = detectSchemaFromUrl(value.trim());
        if (!detectedSchema) {
          setShowArchiveSuggestion(true);
        }
      }
    }
  };

  const handleCreateArchive = async () => {
    if (!formData.url.trim()) return;

    setIsCreatingArchive(true);
    setShowArchiveSuggestion(false);

    try {
      const archiveUrl = await handleCreateArchiveInternal(formData.url.trim());
      if (archiveUrl) {
        setUrl(archiveUrl);
        setSchema(ProductSchema.Archive);
        setTouched((prev) => ({ ...prev, url: true }));
        setShowArchiveSuccess(true);

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowArchiveSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error creating archive:", error);
      // Error is already handled in handleCreateArchiveInternal
    } finally {
      setIsCreatingArchive(false);
    }
  };

  const handleSchemaChange = (schema: ProductSchema) => {
    setSchema(schema);
    setShowArchiveSuggestion(false); // Hide suggestion when user manually selects a schema
    setShowArchiveSuccess(false); // Hide success message when schema changes

    // Mark URL as touched to trigger validation when schema changes
    if (formData.url.trim()) {
      setTouched((prev) => ({ ...prev, url: true }));
    }

    // Show archive suggestion if Archive schema is selected, URL is valid HTTP, but NOT already an archive URL
    if (schema === ProductSchema.Archive && formData.url.trim()) {
      const basicUrlPattern = /^https?:\/\/.+$/;
      const isAlreadyArchiveUrl = urlValidationFunctions[
        ProductSchema.Archive
      ].validate(formData.url.trim());
      if (basicUrlPattern.test(formData.url.trim()) && !isAlreadyArchiveUrl) {
        setShowArchiveSuggestion(true);
      }
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find((error) => error.field === field);
  };

  const getUrlPlaceholder = () => {
    if (
      formData.productSchema &&
      urlValidationFunctions[formData.productSchema]
    ) {
      return urlValidationFunctions[formData.productSchema].placeholder;
    }
    return "https://doi.org/";
  };

  return (
    <div className="grid gap-6 py-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor="title"
          className="text-right font-semibold text-gray-700"
        >
          Title
        </Label>
        <div className="col-span-3">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`${getFieldError("title") ? "border-red-500 focus:border-red-500" : ""}`}
            placeholder="Enter product title"
          />
          {getFieldError("title") && (
            <p className="mt-1 text-sm text-red-500">
              {getFieldError("title")?.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label
          htmlFor="url"
          className="pt-2 text-right font-semibold text-gray-700"
        >
          URL
        </Label>
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={getUrlPlaceholder()}
              className={`flex-1 ${(getFieldError("url") || doiError) && !showArchiveSuggestion && !isCreatingArchive ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {formData.productSchema === ProductSchema.Doi && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDoiAutoFill}
                      disabled={!formData.url || isLoadingDoi}
                    >
                      {isLoadingDoi ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isLoadingDoi
                        ? "Loading DOI information..."
                        : "Autofill title and type using DOI"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {(getFieldError("url") || doiError) &&
            !showArchiveSuggestion &&
            !isCreatingArchive && (
              <p className="mt-1 text-sm text-red-500">
                {doiError || getFieldError("url")?.message}
              </p>
            )}
          {showArchiveSuggestion && !isCreatingArchive && (
            <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="mb-2 text-sm text-blue-800">
                {formData.productSchema === ProductSchema.Archive
                  ? "This URL is not an archive link yet. Would you like to create an archived version?"
                  : "No supported schema detected for this URL. Would you like to create an archived version?"}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateArchive}
                className="border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                <Archive className="mr-2 h-4 w-4" />
                Create Archive URL
              </Button>
            </div>
          )}
          {isCreatingArchive && (
            <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Creating archive URL... This may take a moment.
                </p>
              </div>
            </div>
          )}
          {showArchiveSuccess && (
            <div className="mt-2 rounded-md border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800">
                  Archive URL created successfully! The URL and schema have been
                  updated.
                </p>
              </div>
            </div>
          )}
          {formData.productSchema &&
            urlValidationFunctions[formData.productSchema] && (
              <p className="mt-1 text-xs text-gray-500">
                {urlValidationFunctions[formData.productSchema].description}
              </p>
            )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="col-span-1 text-right font-semibold text-gray-700">
          Type
        </Label>
        <Select
          onValueChange={(e) => {
            setProductType(ProductType[e as keyof typeof ProductType]);
          }}
          value={formData.productType}
        >
          <SelectTrigger className="col-span-3 w-[180px]">
            <SelectValue placeholder="Select a product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Product types</SelectLabel>
              {getEnumKeys(ProductType).map((key, index) => (
                <SelectItem key={index} value={ProductType[key]}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label
          htmlFor="schema"
          className="col-span-1 text-right font-semibold text-gray-700"
        >
          Schema
        </Label>
        <div className="col-span-3">
          <Select
            onValueChange={(e) => {
              handleSchemaChange(
                ProductSchema[e as keyof typeof ProductSchema],
              );
            }}
            value={formData.productSchema}
          >
            <SelectTrigger
              className={`w-[180px] ${getFieldError("schema") ? "border-red-500 focus:border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select a schema" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Schema</SelectLabel>
                {getEnumKeys(ProductSchema).map((key, index) => (
                  <SelectItem key={index} value={ProductSchema[key]}>
                    {key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {getFieldError("schema") && (
            <p className="mt-1 text-sm text-red-500">
              {getFieldError("schema")?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right font-semibold text-gray-700">
          Categories
        </Label>
        <div className="col-span-3 flex flex-wrap gap-3">
          {Object.values(ProductCategoryType).map((category) => (
            <TooltipProvider key={category}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={
                      formData.categories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Click to{" "}
                  {formData.categories.includes(category) ? "remove" : "add"}{" "}
                  {category} category
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
