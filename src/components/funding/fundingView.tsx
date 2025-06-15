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
import FundingCard from "@/components/funding/fundingCard";

type ProjectFundingViewProps = { project: ProjectResponseDTO };

export default function FundingView({
  project,
}: Readonly<ProjectFundingViewProps>) {
  const productFunding = project.products.filter(
    (p) => p.type === ProductType.Funding,
  );
  const organisationFunding = project.organisations.filter((o) =>
    o.organisation.roles.some((e) => e.role === OrganisationRoleType.Funder),
  );

  if (productFunding.length === 0 && organisationFunding.length === 0) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader className="relative flex justify-between">
        <CardTitle className="text-xl font-semibold">Funding</CardTitle>
      </CardHeader>
      <CardContent>
        {productFunding.map((p) => (
          <FundingCard key={p.id} object={p} />
        ))}
        {organisationFunding.map((o) => (
          <FundingCard key={o.organisation.id} object={o} />
        ))}
      </CardContent>
    </Card>
  );
}
