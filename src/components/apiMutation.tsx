/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React, { useState, useContext } from "react";
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
}: ApiMutationProps<T, R>) {
  const apiClient = useContext(ApiClientContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SwaggerException | null>(null);
  const [result, setResult] = useState<R | undefined>(undefined);

  const handleSubmit = async () => {
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
  };

  // Use useEffect to safely provide the submit function to the parent component
  // This runs after render and avoids setState-during-render issues
  React.useEffect(() => {
    if (onInitialize) {
      onInitialize(handleSubmit);
    }
  }, [onInitialize, handleSubmit]);

  // During the actual mutation, show a full-page loading state
  if (isLoading) {
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
  return <>{children({ isLoading, error, onSubmit: handleSubmit, result })}</>;
}
