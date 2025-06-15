/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useBackendStatus } from "@/lib/backendStatusContext";

interface BackendStatusWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that monitors backend status and redirects to landing page
 * when backend is down. This ensures users always see the proper error message
 * instead of trying to load pages that won't work.
 */
export function BackendStatusWrapper({ children }: BackendStatusWrapperProps) {
  const { isBackendDown } = useBackendStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If backend is down and we're not already on the landing page, redirect
    if (isBackendDown && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [isBackendDown, location.pathname, navigate]);

  return <>{children}</>;
}
