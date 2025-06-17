/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import {
  ProjectResponseDTO,
  ITimelineItemResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";

interface CachedProject {
  data: ProjectResponseDTO;
  timeline?: ITimelineItemResponseDTO[];
  timestamp: number;
  isLoading?: boolean;
}

interface CachedDashboardData {
  projects: ProjectResponseDTO[];
  timestamp: number;
}

interface ProjectCacheContextType {
  // Get cached project data
  getCachedProject: (projectId: string) => CachedProject | null;

  // Consume cached project data (returns it and removes from cache)
  consumeCachedProject: (projectId: string) => CachedProject | null;

  // Preload a project in the background
  preloadProject: (projectId: string) => Promise<void>;

  // Check if a project is currently being preloaded
  isPreloading: (projectId: string) => boolean;

  // Dashboard data caching
  getCachedDashboardData: () => CachedDashboardData | null;
  setCachedDashboardData: (projects: ProjectResponseDTO[]) => void;
  invalidateDashboardData: () => void;
  refreshDashboardData: () => Promise<void>;

  // Clear cache (useful for memory management)
  clearCache: () => void;

  // Remove specific project from cache
  removeFromCache: (projectId: string) => void;

  // Update cache with fresh data
  updateCache: (
    projectId: string,
    data: ProjectResponseDTO,
    timeline?: ITimelineItemResponseDTO[],
  ) => void;
}

export const ProjectCacheContext = createContext<
  ProjectCacheContextType | undefined
>(undefined);

export type { ProjectCacheContextType };

interface ProjectCacheProviderProps {
  children: ReactNode;
}

// Cache expiration time: 15 seconds for hover-based preloading
const CACHE_EXPIRATION_TIME = 15 * 1000;
// Dashboard cache expiration time: 2 minutes for dashboard data
const DASHBOARD_CACHE_EXPIRATION_TIME = 2 * 60 * 1000;

export function ProjectCacheProvider({ children }: ProjectCacheProviderProps) {
  const [cache, setCache] = useState<Map<string, CachedProject>>(new Map());
  const [dashboardCache, setDashboardCache] =
    useState<CachedDashboardData | null>(null);
  const [preloadingSet, setPreloadingSet] = useState<Set<string>>(new Set());
  const apiClient = useContext(ApiClientContext);

  // Get cached project if it exists and is not expired
  const getCachedProject = useCallback(
    (projectId: string): CachedProject | null => {
      const cached = cache.get(projectId);
      if (!cached) return null;

      const now = Date.now();
      const isExpired = now - cached.timestamp > CACHE_EXPIRATION_TIME;

      if (isExpired) {
        // Remove expired cache entry
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(projectId);
          return newCache;
        });
        return null;
      }

      return cached;
    },
    [cache],
  );

  // Consume cached project (returns it and removes from cache)
  const consumeCachedProject = useCallback(
    (projectId: string): CachedProject | null => {
      const cached = getCachedProject(projectId);
      if (cached) {
        // Clear whole cache when consuming
        // This is to ensure we don't keep stale data around
        setCache(new Map());
      }
      return cached;
    },
    [getCachedProject],
  );

  // Check if project is currently being preloaded
  const isPreloading = useCallback(
    (projectId: string): boolean => {
      return preloadingSet.has(projectId);
    },
    [preloadingSet],
  );

  // Preload project data in the background
  const preloadProject = useCallback(
    async (projectId: string): Promise<void> => {
      // Don't preload if already cached and not expired
      const existing = getCachedProject(projectId);
      if (existing && !existing.isLoading) {
        return;
      }

      // Don't preload if already preloading
      if (isPreloading(projectId)) {
        return;
      }

      try {
        // Mark as preloading
        setPreloadingSet((prev) => new Set(prev).add(projectId));

        // Add loading entry to cache
        setCache((prev) =>
          new Map(prev).set(projectId, {
            data: {} as ProjectResponseDTO, // Placeholder
            timestamp: Date.now(),
            isLoading: true,
          }),
        );

        // Fetch project data and timeline in parallel
        const [projectData, timelineData] = await Promise.all([
          apiClient.projects_GetProjectById(projectId),
          apiClient.projects_GetProjectTimeline(projectId).catch(() => []), // Timeline is optional
        ]);

        // Update cache with real data
        setCache((prev) =>
          new Map(prev).set(projectId, {
            data: projectData,
            timeline: timelineData,
            timestamp: Date.now(),
            isLoading: false,
          }),
        );
      } catch (error) {
        console.error("Error preloading project:", error);
        // Remove failed preload from cache
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(projectId);
          return newCache;
        });
      } finally {
        // Remove from preloading set
        setPreloadingSet((prev) => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
      }
    },
    [apiClient, getCachedProject, isPreloading],
  );

  // Clear entire cache
  const clearCache = useCallback(() => {
    setCache(new Map());
    setDashboardCache(null);
    setPreloadingSet(new Set());
  }, []);

  // Remove specific project from cache
  const removeFromCache = useCallback((projectId: string) => {
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.delete(projectId);
      return newCache;
    });
  }, []);

  // Update cache with fresh data (useful after mutations)
  const updateCache = useCallback(
    (
      projectId: string,
      data: ProjectResponseDTO,
      timeline?: ITimelineItemResponseDTO[],
    ) => {
      setCache((prev) =>
        new Map(prev).set(projectId, {
          data,
          timeline,
          timestamp: Date.now(),
          isLoading: false,
        }),
      );
    },
    [],
  );

  // Get cached dashboard data if not expired
  const getCachedDashboardData = useCallback((): CachedDashboardData | null => {
    if (!dashboardCache) return null;

    const now = Date.now();
    const isExpired =
      now - dashboardCache.timestamp > DASHBOARD_CACHE_EXPIRATION_TIME;

    if (isExpired) {
      setDashboardCache(null);
      return null;
    }

    return dashboardCache;
  }, [dashboardCache]);

  // Set cached dashboard data
  const setCachedDashboardData = useCallback(
    (projects: ProjectResponseDTO[]) => {
      setDashboardCache({
        projects,
        timestamp: Date.now(),
      });
    },
    [],
  );

  // Invalidate dashboard data (clear cache)
  const invalidateDashboardData = useCallback(() => {
    setDashboardCache(null);
  }, []);

  // Refresh dashboard data (fetch fresh data and update cache)
  const refreshDashboardData = useCallback(async (): Promise<void> => {
    try {
      const freshData = await apiClient.projects_GetAllProjects();
      setCachedDashboardData(freshData);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      throw error;
    }
  }, [apiClient, setCachedDashboardData]);

  const contextValue = useMemo(
    (): ProjectCacheContextType => ({
      getCachedProject,
      consumeCachedProject,
      preloadProject,
      isPreloading,
      getCachedDashboardData,
      setCachedDashboardData,
      invalidateDashboardData,
      refreshDashboardData,
      clearCache,
      removeFromCache,
      updateCache,
    }),
    [
      getCachedProject,
      consumeCachedProject,
      preloadProject,
      isPreloading,
      getCachedDashboardData,
      setCachedDashboardData,
      invalidateDashboardData,
      refreshDashboardData,
      clearCache,
      removeFromCache,
      updateCache,
    ],
  );

  return (
    <ProjectCacheContext.Provider value={contextValue}>
      {children}
    </ProjectCacheContext.Provider>
  );
}
