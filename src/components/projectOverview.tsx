import { CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  ProjectDescriptionResponseDTO,
  ProjectTitleResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import ProjectTitleSection from "@/components/projectTitleSection";
import ProjectDescriptionSection from "@/components/projectDescriptionSection";

type ProjectOverviewProps = {
  projectId: string;
  titles?: ProjectTitleResponseDTO[];
  descriptions?: ProjectDescriptionResponseDTO[];
  isAdmin?: boolean;
  onProjectUpdate: () => void;
};

/**
 * Project Overview component that displays and allows editing of project
 * titles and descriptions. It acts as a high-level container for the
 * title and description sections.
 */
export default function ProjectOverview({
  projectId,
  titles,
  descriptions,
  isAdmin,
  onProjectUpdate,
}: Readonly<ProjectOverviewProps>) {
  return (
    <>
      <CardHeader>
        <ProjectTitleSection
          projectId={projectId}
          titles={titles}
          isAdmin={isAdmin}
          onProjectUpdate={onProjectUpdate}
        />
      </CardHeader>
      <CardContent data-cy="description-section">
        <ProjectDescriptionSection
          projectId={projectId}
          descriptions={descriptions}
          isAdmin={isAdmin}
          onProjectUpdate={onProjectUpdate}
        />
      </CardContent>
    </>
  );
}
