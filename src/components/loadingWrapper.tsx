/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { SwaggerException } from "@team-golfslag/conflux-api-client/src/client";

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
  mode = "page",
}: LoadingWrapperProps) {
  // Only show loading UI on initial load if isInitialLoad is provided
  // This prevents flickering on updates after initial load
  if (isLoading && (isInitialLoad === undefined || isInitialLoad === true)) {
    if (mode === "component") {
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-gray-100 bg-white/95 p-6 shadow-xl">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300/30"></div>
                <Loader2 className="text-primary relative h-8 w-8 animate-spin" />
              </div>
              <span className="text-center text-sm font-medium text-gray-700">
                {loadingMessage}
              </span>
            </div>
          </div>
          <div className="pointer-events-none opacity-50">{children}</div>
        </div>
      );
    }

    return (
      // Adjust min-height to account for the header (assuming 3rem height)
      <div className="flex min-h-screen items-center justify-center p-8 pt-16">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300/30"></div>
            <Loader2 className="text-primary relative h-12 w-12 animate-spin" />
          </div>
          <div className="space-y-2 text-center">
            <span className="text-lg font-medium text-gray-800">
              {loadingMessage}
            </span>
          </div>
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
              <AlertCircle className="text-destructive mx-auto h-6 w-6" />
              <span className="text-center text-sm font-medium">
                Error: {error.message || "An unexpected error occurred"}
              </span>
            </div>
          </div>
          <div className="pointer-events-none opacity-60">{children}</div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-8 pt-16">
        <div className="flex max-w-2xl flex-col items-center justify-center space-y-6 rounded-2xl border border-red-100 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10"></div>
            <AlertCircle className="text-destructive relative h-16 w-16" />
          </div>
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Something went wrong
            </h2>
            <p className="text-base leading-relaxed font-normal text-gray-600">
              {error.message || "An unexpected error occurred"}
              {error.status ? ` (Status: ${error.status})` : ""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
