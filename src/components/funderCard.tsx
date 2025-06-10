/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card } from "@/components/ui/card";
import { ProjectOrganisationResponseDTO } from "@team-golfslag/conflux-api-client/src/client";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

type CardProps = { organisation: ProjectOrganisationResponseDTO };

export default function ({ organisation }: Readonly<CardProps>) {
  // URL validation regex - checks for http/https URLs
  const isValidUrl = (url: string): boolean => {
    const urlRegex =
      /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$/;
    return urlRegex.test(url);
  };
  return (
    <>
      <Card className="flex flex-col gap-1 border border-gray-200 p-3 shadow-sm">
        <div className="space-y-2 px-3">
          <h3 className="mt-2 ml-2 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover/productCard:text-gray-800">
            {organisation.organisation.name}
          </h3>
          {organisation.organisation.ror_id && (
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2">
              {isValidUrl(organisation.organisation.ror_id) ? (
                <div className="flex items-center gap-2">
                  <a
                    href={organisation.organisation.ror_id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs break-all text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                  >
                    {organisation.organisation.ror_id}
                  </a>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 text-blue-500" />
                </div>
              ) : (
                <p className="font-mono text-xs break-all text-gray-600">
                  {organisation.organisation.ror_id}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-transform duration-200 hover:scale-105"
            >
              Funder
            </Badge>
          </div>
        </div>
      </Card>
    </>
  );
}
