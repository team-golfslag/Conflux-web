/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React, { useState, useContext, useCallback } from "react";
import {
  ApiClient,
  SwaggerException,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { Button } from "./ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface ApiMutationProps<T, R> {
  /**
   * The function to call when performing the API mutation
   */
  mutationFn: (apiClient: ApiClient, data: T) => Promise<R>;

  /**
   * The data to pass to the mutation function
   */
  data: T;

  /**
   * Function to render the form or content
   */
  children: (props: {
    isLoading: boolean;
    error: SwaggerException | null;
    onSubmit: () => void;
    result: R | undefined;
  }) => React.ReactNode;

  /**
   * Text to display while loading
   */
  loadingMessage?: string;

  /**
   * Callback when mutation completes successfully
   */
  onSuccess?: (result: R) => void;

  /**
   * Callback when mutation fails
   */
  onError?: (error: SwaggerException) => void;

  /**
   * Function to access the submit function without needing to update state
   * during rendering
   */
  onInitialize?: (submitFn: () => void) => void;

  /**
   * Display mode for loading and error states
   * - 'page': full-page loading/error state
   * - 'component': overlay on top of the component with a blurred background
   */
  mode?: "page" | "component";
}

/**
 * A component for handling API mutations (create, update, delete operations)
 * with built-in loading and error states
 */
export function ApiMutation<T, R>({
  mutationFn,
  data,
  children,
  loadingMessage = "Processing...",
  onSuccess,
  onError,
  onInitialize,
  mode = "page",
}: ApiMutationProps<T, R>) {
  const apiClient = useContext(ApiClientContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SwaggerException | null>(null);
  const [result, setResult] = useState<R | undefined>(undefined);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(apiClient, data);
      setResult(response);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      const swaggerError =
        err instanceof SwaggerException
          ? err
          : new SwaggerException(
              "An error occurred",
              0,
              JSON.stringify(err),
              {},
              err,
            );

      setError(swaggerError);

      if (onError) {
        onError(swaggerError);
      }

      console.error("Error during API mutation:", err);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, data, mutationFn, onSuccess, onError]);

  // Use useRef to track if we've already initialized to prevent infinite loops
  const initializeRef = React.useRef(false);
  
  // Use useEffect to safely provide the submit function to the parent component
  // This runs after render and avoids setState-during-render issues
  React.useEffect(() => {
    if (onInitialize && !initializeRef.current) {
      onInitialize(handleSubmit);
      initializeRef.current = true;
    }
  }, [onInitialize, handleSubmit]);

  // Reset the ref when onInitialize changes (component remounts or prop changes)
  React.useEffect(() => {
    initializeRef.current = false;
  }, [onInitialize]);

  // During the actual mutation, show a loading state based on mode
  if (isLoading) {
    if (mode === "component") {
      const childContent = children({
        isLoading: true,
        error: null,
        onSubmit: handleSubmit,
        result: undefined,
      });

      return (
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="absolute -inset-4 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"
            style={{
              WebkitMaskImage:
                "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
              maskImage:
                "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/90 p-4 shadow-lg ring-1 ring-white/30">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="text-sm font-medium">{loadingMessage}</span>
            </div>
          </div>
          {/* Show a disabled version of children */}
          <div className="pointer-events-none opacity-50">{childContent}</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-md">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-center font-medium">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // If there's an error during submission that we want to highlight (not inline)
  if (error && !children) {
    if (mode === "component") {
      return (
        <div className="relative overflow-hidden">
          <div
            className="absolute -inset-4 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm"
            style={{
              WebkitMaskImage:
                "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
              maskImage:
                "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/90 p-4 shadow-lg ring-1 ring-white/30">
              <AlertCircle className="text-destructive h-6 w-6" />
              <span className="text-sm font-medium">
                Error: {error.message}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit()}
                className="mt-1"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4 shadow-md">
          <AlertCircle className="text-destructive h-8 w-8" />
          <p className="text-lg font-semibold">Error</p>
          <p className="text-center text-gray-600">{error.message}</p>
          <Button
            variant="outline"
            onClick={() => handleSubmit()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render the children with the necessary props
  if (error && mode === "component") {
    const childContent = children({
      isLoading,
      error,
      onSubmit: handleSubmit,
      result,
    });

    return (
      <div className="relative h-full w-full">
        <div
          className="absolute -inset-4 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
          style={{
            WebkitMaskImage:
              "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            maskImage:
              "radial-gradient(rectangle 200% 200% at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/80 p-4 shadow-md ring-1 ring-white/30">
            <AlertCircle className="text-destructive h-6 w-6" />
            <span className="text-sm font-medium">Error: {error.message}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSubmit()}
              className="mt-1"
            >
              Retry
            </Button>
          </div>
        </div>
        <div className="pointer-events-none opacity-60">{childContent}</div>
      </div>
    );
  }

  return <>{children({ isLoading, error, onSubmit: handleSubmit, result })}</>;
}
