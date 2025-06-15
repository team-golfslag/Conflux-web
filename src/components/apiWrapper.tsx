/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { LoadingWrapper } from "./loadingWrapper";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

interface ApiWrapperProps<T> {
  queryFn: (apiClient: ApiClient) => Promise<T>;
  dependencies?: readonly unknown[];
  loadingMessage?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  mode?: "page" | "component";
}

export function ApiWrapper<T>({
  queryFn,
  dependencies = [],
  loadingMessage = "Loading...",
  children,
  mode = "page",
}: ApiWrapperProps<T>) {
  const { data, isLoading, error } = useApiQuery(queryFn, [...dependencies]);

  return (
    <LoadingWrapper
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      error={error}
      mode={mode}
    >
      {data !== undefined && children(data)}
    </LoadingWrapper>
  );
}
