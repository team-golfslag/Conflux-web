/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  ContributorResponseDTO,
  ContributorPositionType,
  ContributorRoleType,
  ApiClient,
  PersonResponseDTO,
  ContributorRoleResponseDTO,
  ContributorPositionResponseDTO,
  Person,
} from "@team-golfslag/conflux-api-client/src/client.ts";

// Factory functions for creating properly typed mock objects

/**
 * Creates a mock PersonResponseDTO for use in response contexts
 */
export const createMockPersonResponse = (): PersonResponseDTO => {
  return new PersonResponseDTO({
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    orcid_id: "0000-0002-1825-0097",
  });
};

/**
 * Creates a mock Person for use in request contexts
 */
export const createMockPerson = (): Person => {
  return new Person({
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    orcid_id: "0000-0002-1825-0097",
    schema_uri: "",
  });
};

/**
 * Creates a mock ContributorRoleResponseDTO
 */
export const createMockContributorRole = (): ContributorRoleResponseDTO => {
  return new ContributorRoleResponseDTO({
    role_type: ContributorRoleType.Supervision,
    person_id: "1",
    project_id: "1",
  });
};

/**
 * Creates a mock ContributorPositionResponseDTO
 */
export const createMockContributorPosition =
  (): ContributorPositionResponseDTO => {
    return new ContributorPositionResponseDTO({
      start_date: new Date(),
      end_date: new Date(2026, 1, 1),
      position: ContributorPositionType.PrincipalInvestigator,
      person_id: "1",
      project_id: "1",
    });
  };

/**
 * Creates a mock ContributorResponseDTO using proper constructors
 */
export const createMockContributorResponse = (): ContributorResponseDTO => {
  return new ContributorResponseDTO({
    person: createMockPersonResponse(),
    roles: [createMockContributorRole()],
    positions: [createMockContributorPosition()],
    project_id: "1",
    leader: true,
    contact: true,
  });
};

// Export the mock contributor for backward compatibility
export const mockContributor = createMockContributorResponse();

/**
 * Creates a properly typed full mock API client for testing that satisfies the ApiClient interface
 * Only implements the methods commonly used in tests with correct return types
 * @returns A mock API client that can be used directly with ApiClientContext.Provider
 */
export function createApiClientMock(): ApiClient {
  // Create a real ApiClient instance to serve as the base
  const baseClient = new ApiClient("http://localhost:8000");

  // Create our mock by extending the real client with our mock methods
  const mockClient = Object.assign({}, baseClient, {
    contributors_CreateContributor: () => Promise.resolve(mockContributor),
    contributors_UpdateContributor: () => Promise.resolve(mockContributor),
    contributors_DeleteContributor: () => Promise.resolve(undefined),
    people_GetPersonsByQuery: () => Promise.resolve([createMockPerson()]),
    people_CreatePerson: () => Promise.resolve(createMockPerson()),
    language_GetAvailableLanguageCodes: () =>
      Promise.resolve({
        eng: "English",
        nld: "Dutch",
        deu: "German",
        fra: "French",
      }),
    projects_GetProjectById: (id: string) =>
      Promise.resolve({
        id,
        titles: [],
        descriptions: [],
        start_date: new Date(),
        end_date: undefined,
        users: [],
        products: [],
        organisations: [],
      }),
    projects_GetProjectTimeline: () => Promise.resolve([]),
  });

  return mockClient;
}
