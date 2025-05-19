/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { SwaggerException } from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "./ui/button";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingMessage?: React.ReactNode;
  error?: SwaggerException | null;
  onRetry?: () => void;
  mode?: "page" | "component";
}

export function LoadingWrapper({
  isLoading,
  children,
  loadingMessage = "Loading...",
  error = null,
  onRetry,
  mode = "page",
}: LoadingWrapperProps) {
  if (isLoading) {
    if (mode === "component") {
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/80 p-4 shadow-md">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="text-sm font-medium">{loadingMessage}</span>
            </div>
          </div>
          <div className="pointer-events-none opacity-60">{children}</div>
        </div>
      );
    }

    return (
      // Adjust min-height to account for the header (assuming 3rem height)
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl font-semibold shadow-md">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span>{loadingMessage}</span>
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
              <AlertCircle className="text-destructive h-6 w-6" />
              <span className="text-sm font-medium">
                Error: {error.message || "An unexpected error occurred"}
              </span>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="mt-1 flex items-center gap-1"
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

  return <>{children}</>;
}
