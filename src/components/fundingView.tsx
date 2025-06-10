/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  OrganisationRoleType,
  ProductType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import FundingCard from "@/components/fundingCard.tsx";
import FunderCard from "@/components/funderCard.tsx";

type ProjectFundingViewProps = { project: ProjectResponseDTO };

export default function FundingView({
  project,
}: Readonly<ProjectFundingViewProps>) {
  return (
    <Card>
      <CardHeader className="relative flex justify-between">
        <CardTitle className="text-xl font-semibold">Funding</CardTitle>
      </CardHeader>
      <CardContent>
        {project.products
          .filter((p) => p.type === ProductType.Funding)
          .map((p) => (
            <FundingCard product={p} />
          ))}
        {project.organisations
          .filter((o) =>
            o.organisation.roles.some(
              (e) => e.role === OrganisationRoleType.Funder,
            ),
          )
          .map((o) => (
            <FunderCard organisation={o} />
          ))}
      </CardContent>
    </Card>
  );
}
