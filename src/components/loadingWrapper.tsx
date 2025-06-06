/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { SwaggerException } from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "./ui/button";

/**
 * Props for the LoadingWrapper component
 */
interface LoadingWrapperProps {
  /** Whether the content is currently loading */
  isLoading: boolean;
  /** Content to display when not loading or when there's a background refresh */
  children: React.ReactNode;
  /** If set to false and isLoading is true, the loading UI won't be shown.
   * This prevents flickering during background updates after initial load. */
  isInitialLoad?: boolean;
  /** Message to display during loading */
  loadingMessage?: React.ReactNode;
  /** Error object to display, if any */
  error?: SwaggerException | null;
  /** Function to call when the retry button is clicked */
  onRetry?: () => void;
  /** Display mode - "page" for full-page loading UI, "component" for inline loading */
  mode?: "page" | "component";
}

/**
 * A loading wrapper component that handles loading states, errors, and background refreshes.
 * Can be used for both page-level and component-level loading states.
 *
 * When using with background refreshes (to prevent flickering):
 * 1. Track an `isInitialLoad` state in your component
 * 2. Set it to `true` on initial load and `false` after loading completes
 * 3. Pass both `isLoading` and `isInitialLoad` to this component
 */
export function LoadingWrapper({
  isLoading,
  children,
  isInitialLoad,
  loadingMessage = "Loading...",
  error = null,
  onRetry,
  mode = "page",
}: LoadingWrapperProps) {
  // Only show loading UI on initial load if isInitialLoad is provided
  // This prevents flickering on updates after initial load
  if (isLoading && (isInitialLoad === undefined || isInitialLoad === true)) {
    if (mode === "component") {
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/80 p-4 shadow-md">
              <Loader2 className="text-primary h-6 w-6 animate-spin mx-auto" />
              <span className="text-sm font-medium text-center">{loadingMessage}</span>
            </div>
          </div>
          <div className="pointer-events-none opacity-60">{children}</div>
        </div>
      );
    }

    return (
      // Adjust min-height to account for the header (assuming 3rem height)
      <div className="flex min-h-screen items-center justify-center p-8 pt-16">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl font-semibold shadow-md">
          <Loader2 className="text-primary h-8 w-8 animate-spin mx-auto" />
          <span className="text-center">{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (error) {
    if (mode === "component") {
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/80 p-4 shadow-md">
              <AlertCircle className="text-destructive h-6 w-6 mx-auto" />
              <span className="text-sm font-medium text-center">
                Error: {error.message || "An unexpected error occurred"}
              </span>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="mt-1 flex items-center gap-1 mx-auto"
                >
                  <RefreshCcw className="h-3 w-3" />
                  Retry
                </Button>
              )}
            </div>
          </div>
          <div className="pointer-events-none opacity-60">{children}</div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-8 pt-16">
        <div className="flex max-w-2xl flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl shadow-md">
          <AlertCircle className="text-destructive h-12 w-12 mx-auto" />
          <h2 className="text-center text-xl font-semibold">Error</h2>
          <p className="text-center text-base font-normal">
            {error.message || "An unexpected error occurred"}
            {error.status ? ` (Status: ${error.status})` : ""}
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-2 flex items-center gap-2 mx-auto">
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
