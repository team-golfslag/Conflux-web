/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { SwaggerException } from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "./ui/button";

interface ProjectLoadingWrapperProps {
  isLoading: boolean;
  isInitialLoad: boolean;
  children: React.ReactNode;
  loadingMessage?: React.ReactNode;
  error?: SwaggerException | null;
  onRetry?: () => void;
}

/**
 * A specialized loading wrapper for project pages that prevents flickering
 * on updates after initial load
 */
export function ProjectLoadingWrapper({
  isLoading,
  isInitialLoad,
  children,
  loadingMessage = "Loading...",
  error = null,
  onRetry,
}: ProjectLoadingWrapperProps) {
  // Only show loading UI on initial load to prevent flickering
  if (isLoading && isInitialLoad) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl font-semibold shadow-md">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8">
        <div className="flex max-w-2xl flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl shadow-md">
          <AlertCircle className="text-destructive h-12 w-12" />
          <h2 className="text-center text-xl font-semibold">Error</h2>
          <p className="text-center text-base font-normal">
            {error.message || "An unexpected error occurred"}
            {error.status ? ` (Status: ${error.status})` : ""}
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-2 flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // If there's a background refresh, just show the current content
  // to avoid flickering
  return <>{children}</>;
}
