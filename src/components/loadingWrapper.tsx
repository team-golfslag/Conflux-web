/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";

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
      <div className="bg-secondary min-h-full p-8">
        <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
          {loadingMessage}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
