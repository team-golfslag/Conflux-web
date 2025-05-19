/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React, { useState } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { LoadingWrapper } from "./loadingWrapper";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

interface ApiWrapperProps<T> {
  queryFn: (apiClient: ApiClient) => Promise<T>;
  dependencies?: readonly unknown[];
  loadingMessage?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function ApiWrapper<T>({
  queryFn,
  dependencies = [],
  loadingMessage = "Loading...",
  children,
}: ApiWrapperProps<T>) {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error } = useApiQuery(queryFn, [
    ...dependencies,
    retryCount,
  ]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <LoadingWrapper
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      error={error}
      onRetry={handleRetry}
    >
      {data !== undefined && children(data)}
    </LoadingWrapper>
  );
}
