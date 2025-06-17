/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useEffect, useContext, useRef } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  SwaggerException,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { useProjectCache } from "@/hooks/useProjectCache";

export function useDashboardData() {
  const apiClient = useContext(ApiClientContext);
  const projectCache = useProjectCache();
  const projectCacheRef = useRef(projectCache);

  // Update ref when projectCache changes
  projectCacheRef.current = projectCache;

  const [data, setData] = useState<ProjectResponseDTO[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<SwaggerException | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Check for cached data first
      const cachedData = projectCacheRef.current.getCachedDashboardData();
      if (cachedData) {
        // Use cached data immediately for instant display
        if (isMounted) {
          setData(cachedData.projects);
          setIsLoading(false);
          setIsInitialLoad(false);
          setError(null);
        }

        // Still fetch fresh data in background to update cache
        try {
          const freshData = await apiClient.projects_GetAllProjects();
          if (isMounted) {
            setData(freshData);
            // Update cache with fresh data
            projectCacheRef.current.setCachedDashboardData(freshData);
          }
        } catch (err) {
          // If background update fails, just log it - we already have cached data showing
          console.error("Background dashboard update failed:", err);
        }
        return;
      }

      // No cached data, show loading and fetch fresh data
      setIsLoading(true);
      try {
        const result = await apiClient.projects_GetAllProjects();
        if (isMounted) {
          setData(result);
          setError(null);
          // Cache the fresh data
          projectCacheRef.current.setCachedDashboardData(result);
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
          console.error("Error fetching dashboard data:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  return { data, isLoading, isInitialLoad, error };
}
