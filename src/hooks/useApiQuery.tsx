/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState, useEffect } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { useContext } from "react";
import {
  ApiClient,
  SwaggerException,
} from "@team-golfslag/conflux-api-client/src/client";

export function useApiQuery<T>(
  queryFn: (apiClient: ApiClient) => Promise<T>,
  dependencies: readonly unknown[] = [],
) {
  const apiClient = useContext(ApiClientContext);
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<SwaggerException | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await queryFn(apiClient);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof SwaggerException
              ? err
              : new SwaggerException(
                  "An error occurred",
                  0,
                  JSON.stringify(err),
                  {},
                  err,
                ),
          );
          console.error("Error fetching data:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, ...dependencies]);

  return { data, isLoading, error };
}
