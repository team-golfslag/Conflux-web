/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  ProjectDescriptionResponseDTO,
  ProjectTitleResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import ProjectTitleSection from "@/components/overview/projectTitleSection";
import ProjectDescriptionSection from "@/components/overview/projectDescriptionSection";

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
