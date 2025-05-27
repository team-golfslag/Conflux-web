/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  Contributor,
  ContributorPosition,
  ContributorPositionType,
  ContributorRoleType,
  ContributorRole,
  Person,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client.ts";

const mockContributor: Contributor = new Contributor({
  person: new Person({
    id: "1",
    schema_uri: "",
    orcid_id: "0000-0002-1825-0097",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  }),
  person_id: "1", // Add missing required field
  project_id: "1",
  roles: [
    new ContributorRole({
      role_type: ContributorRoleType.Supervision,
      schema_uri: "",
      person_id: "1",
      project_id: "1",
    }),
  ],
  positions: [
    new ContributorPosition({
      start_date: new Date(),
      end_date: new Date(2026, 1, 1),
      position: ContributorPositionType.PrincipalInvestigator,
      schema_uri: "",
      get_uri: "",
      person_id: "1",
      project_id: "1",
    }),
  ],
  leader: true,
  contact: true,
});

/**
 * Creates a mock API client for testing
 * @returns A mock API client with methods that can be stubbed later
 */
export function createApiClientMock() {
  return {
    projects_GetProjectById: () => ({}),
    projects_GetProjects: () => [],
    projects_GetProject: () => ({}),
    projects_UpdateProject: () => ({}),
    projects_PutProject: () => ({}),
    projectTitles_UpdateTitle: () => ({}),
    projectDescriptions_UpdateDescription: () => ({}),
    projectDescriptions_CreateDescription: () => ({}),
    contributors_CreateContributor: () => ({}),
    contributors_UpdateContributor: () => ({}),
    contributors_DeleteContributor: () => ({}),
    people_GetPersonsByQuery: () => [],
    people_CreatePerson: () => ({}),
  } as unknown as ApiClient;
}

export { mockContributor };
