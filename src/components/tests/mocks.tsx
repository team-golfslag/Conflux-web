/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  ContributorDTO,
  ContributorPositionDTO,
  ContributorPositionType,
  ContributorRoleType,
  Person,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client.ts";

const mockContributor: ContributorDTO = new ContributorDTO({
  person: new Person({
    id: "1",
    schema_uri: "",
    orcid_id: "0000-0002-1825-0097",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  }),
  project_id: "1",
  roles: [ContributorRoleType.Supervision],
  positions: [
    new ContributorPositionDTO({
      start_date: new Date(),
      end_date: new Date(2026, 1, 1),
      type: ContributorPositionType.PrincipalInvestigator,
    }),
  ],
  leader: true,
  contact: true,
});

/**
 * Creates a mock API client for testing
 * @returns A mock API client with all methods stubbed
 */
export function createApiClientMock() {
  return {
    projects_GetProjectById: cy.stub(),
    projects_GetProjects: cy.stub(),
    projects_GetProject: cy.stub(),
    projects_UpdateProject: cy.stub(),
    projects_PatchProject: cy.stub(),
    contributors_CreateContributor: cy.stub(),
    contributors_UpdateContributor: cy.stub(),
    contributors_DeleteContributor: cy.stub(),
    people_GetPersonsByQuery: cy.stub(),
    people_CreatePerson: cy.stub(),
  } as unknown as ApiClient;
}

export { mockContributor };
