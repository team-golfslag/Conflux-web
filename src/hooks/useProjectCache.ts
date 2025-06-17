/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useContext } from "react";
import {
  ProjectCacheContext,
  ProjectCacheContextType,
} from "@/lib/ProjectCacheContext";

export function useProjectCache(): ProjectCacheContextType {
  const context = useContext(ProjectCacheContext);
  if (context === undefined) {
    throw new Error(
      "useProjectCache must be used within a ProjectCacheProvider",
    );
  }
  return context;
}
