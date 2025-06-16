/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState, useContext, useCallback } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  ApiClient,
  SwaggerException,
} from "@team-golfslag/conflux-api-client/src/client";

type MutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: SwaggerException) => void;
};

/**
 * A custom hook to handle API mutations (CUD operations).
 * It encapsulates API client access, loading, and error state management.
 */
export const useApiMutation = <TData, TVariables>(
  mutationFn: (apiClient: ApiClient, variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData>,
) => {
  const apiClient = useContext(ApiClientContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SwaggerException | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(apiClient, variables);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const swaggerError =
          err instanceof SwaggerException
            ? err
            : new SwaggerException(
                "An unexpected error occurred.",
                500,
                JSON.stringify(err),
                {},
                err as Error,
              );
        setError(swaggerError);
        options?.onError?.(swaggerError);
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, apiClient, options],
  );

  return { mutate, isLoading, error };
};
