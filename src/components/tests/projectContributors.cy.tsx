/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectContributors from "@/components/contributor/projectContributors";
import { mount } from "cypress/react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { createApiClientMock, mockContributor } from "./mocks";
import {
  ProjectResponseDTO,
  ContributorRoleType,
  ContributorResponseDTO,
  PersonResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ContributorRole } from "@team-golfslag/conflux-api-client/src/client.ts";

describe("ProjectContributors Component", () => {
  // Create a properly typed mock project using ProjectResponseDTO
  const mockProject = new ProjectResponseDTO({
    id: "123",
    contributors: [
      new ContributorResponseDTO({
        person: new PersonResponseDTO({
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          orcid_id: "0000-0001-2345-6789",
        }),
        project_id: "123",
        leader: true,
        contact: true,
        roles: [
          new ContributorRole({
            person_id: "1",
            project_id: "123",
            role_type: ContributorRoleType.Conceptualization,
            schema_uri: "321",
          }),
        ],
        positions: [],
      }),
      new ContributorResponseDTO({
        person: new PersonResponseDTO({
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          orcid_id: "0000-0002-3456-7890",
        }),
        project_id: "123",
        leader: false,
        contact: false,
        roles: [
          new ContributorRole({
            person_id: "1",
            project_id: "123",
            role_type: ContributorRoleType.DataCuration,
            schema_uri: "321",
          }),
        ],
        positions: [],
      }),
    ],
    titles: [],
    descriptions: [],
    start_date: new Date(),
    end_date: undefined,
    users: [],
    products: [],
    organisations: [],
  });

  // Define onProjectUpdate as a function type
  let onProjectUpdate: () => void;
  // Get the mock API client from the factory function
  const mockApiClient = createApiClientMock();

  beforeEach(() => {
    // Create a fresh stub for each test
    onProjectUpdate = cy.stub().as("updateFn");

    cy.stub(mockApiClient, "contributors_DeleteContributor").resolves();
    cy.stub(mockApiClient, "contributors_UpdateContributor").resolves({});
    cy.stub(mockApiClient, "contributors_CreateContributor").resolves(
      mockContributor,
    );
    cy.stub(mockApiClient, "people_GetPersonsByQuery").resolves([]);

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectContributors
          project={mockProject}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
  });

  it("displays the contributors list", () => {
    // Check that each contributor is visible
    cy.contains("John Doe").should("be.visible");
    cy.contains("john.doe@example.com").should("be.visible");
    cy.contains("Jane Smith").should("be.visible");
    cy.contains("jane.smith@example.com").should("be.visible");
  });

  it("enters edit mode when edit button is clicked", () => {
    cy.contains("button", "Edit").click();
    cy.contains("Edit mode active").should("be.visible");

    // Edit and delete buttons should be visible on contributor cards in edit mode
    cy.get('[aria-label="Edit contributor"]').should("have.length", 2);
    cy.get('[aria-label="Delete contributor"]').should("have.length", 2);
  });

  it("opens contributor edit modal when edit button is clicked", () => {
    // Enter edit mode
    cy.contains("button", "Edit").click();

    // Click edit on the first contributor
    cy.get('[aria-label="Edit contributor"]').first().click();

    // Verify edit modal is open
    cy.contains("Edit Contributor").should("be.visible");
    cy.contains("John Doe").should("be.visible");

    // Close the modal
    cy.contains("button", "Cancel").click();
  });

  it("shows delete confirmation dialog when delete button is clicked", () => {
    // Enter edit mode
    cy.contains("button", "Edit").click();

    // Click delete on the first contributor
    cy.get('[aria-label="Delete contributor"]').first().click();

    // Verify delete dialog is open
    cy.contains("Are you absolutely sure?").should("be.visible");
    cy.contains("This will remove John Doe from this project").should(
      "be.visible",
    );

    // Cancel deletion
    cy.contains("button", "Cancel").click();

    // Dialog should be closed
    cy.contains("Are you absolutely sure?").should("not.exist");
  });

  it("deletes a contributor when delete is confirmed", () => {
    // Enter edit mode
    cy.contains("button", "Edit").click();

    // Click delete on the first contributor
    cy.get('[aria-label="Delete contributor"]').first().click();

    // Confirm deletion
    cy.contains("button", "Delete").click();

    // API should be called to delete the contributor via ApiMutation
    cy.wrap(mockApiClient.contributors_DeleteContributor).should(
      "have.been.calledWith",
      mockProject.id,
      "1",
    );

    // Update callback should be called by ApiMutation's onSuccess handler
    cy.get("@updateFn").should("have.been.called");
  });

  it("exits edit mode when exit button is clicked", () => {
    // Enter edit mode
    cy.contains("button", "Edit").click();
    cy.contains("Edit mode active").should("be.visible");

    // Exit edit mode
    cy.contains("button", "Exit Edit Mode").click();

    // Edit mode message should no longer be visible
    cy.contains("Edit mode active").should("not.exist");
  });

  it("only shows the contributors which satisfy to the filter", () => {
    //select the conceptualizations filter
    cy.get("#radix-«r63»").click();
    cy.get("#radix-«r64» > :nth-child(3)").click();

    //check that only contributors with the conceptualization role are visible
    cy.contains("John Doe").should("be.visible");
    cy.contains("john.doe@example.com").should("be.visible");
    cy.contains("Jane Smith").should("not.exist");
    cy.contains("jane.smith@example.com").should("not.exist");
  });
});
