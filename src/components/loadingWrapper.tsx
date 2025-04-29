/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingMessage?: React.ReactNode;
}

export function LoadingWrapper({
  isLoading,
  children,
  loadingMessage = "Loading...",
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      // Adjust min-height to account for the header (assuming 3rem height)
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8">
        {" "}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 text-xl font-semibold shadow-md">
          {" "}
          <Loader2 className="text-primary h-8 w-8 animate-spin" />{" "}
          <span>{loadingMessage}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
