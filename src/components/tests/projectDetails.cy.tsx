/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectDetails from "@/components/projectDetails.tsx";
import { mount } from "cypress/react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { createApiClientMock } from "./mocks";
import {
  ProjectDTO,
  Person,
  ContributorDTO,
  OrganisationDTO,
} from "@team-golfslag/conflux-api-client/src/client";

describe("ProjectDetails Component", () => {
  const mockProject = new ProjectDTO({
    id: "123",
    contributors: [
      new ContributorDTO({
        person: new Person({
          id: "1",
          name: "Project Lead",
          email: "lead@example.com",
          schema_uri: "",
        }),
        leader: true,
        contact: false,
        roles: [],
        positions: [],
        project_id: "123",
      }),
      new ContributorDTO({
        person: new Person({
          id: "2",
          name: "Team Member",
          email: "member@example.com",
          schema_uri: "",
        }),
        leader: false,
        contact: false,
        roles: [],
        positions: [],
        project_id: "123",
      }),
    ],
    organisations: [
      new OrganisationDTO({
        id: "org1",
        name: "Lead Organization",
        roles: [],
      }),
      new OrganisationDTO({
        id: "org2",
        name: "Partner Organization",
        roles: [],
      }),
    ],
    titles: [],
    descriptions: [],
    start_date: new Date("2023-01-01"),
    end_date: new Date("2024-12-31"),
    users: [],
    products: [],
  });

  const onProjectUpdate = cy.stub().as("updateFn");
  const mockApiClient = createApiClientMock();

  beforeEach(() => {
    cy.stub(mockApiClient, "projects_PatchProject").resolves({});
    cy.stub(mockApiClient, "contributors_UpdateContributor").resolves({});

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectDetails
          project={mockProject}
          onProjectUpdate={onProjectUpdate}
        />
      </ApiClientContext.Provider>,
    );
  });

  it("displays project status correctly", () => {
    cy.contains("Status").should("be.visible");
    cy.contains("Ended").should("be.visible"); // Based on the dates provided
  });

  it("displays project lead correctly", () => {
    cy.contains("Project Lead").should("be.visible");
    cy.contains("Project Lead").should("be.visible"); // Name of the leader
  });

  it("displays project dates correctly", () => {
    cy.contains("Start:").should("be.visible");
    cy.contains("1 January 2023").should("be.visible");
    cy.contains("End:").should("be.visible");
    cy.contains("31 December 2024").should("be.visible");
  });

  it("displays lead organization correctly", () => {
    cy.contains("Lead Organisation").should("be.visible");
    cy.contains("Lead Organization").should("be.visible");
  });

  it("enters edit mode when edit button is clicked", () => {
    cy.contains("button", "Edit").click();
    cy.contains("Start Date").should("be.visible");
    cy.contains("End Date").should("be.visible");
    cy.contains("Project Lead").should("be.visible");
    cy.contains("Lead Organization").should("be.visible");
  });

  it("can select a different project lead", () => {
    cy.contains("button", "Edit").click();

    // Open the project lead dropdown
    cy.contains("Project Lead").parent().find("button").click();

    // Select Team Member as the new lead
    cy.contains("Team Member").click();

    // Save changes
    cy.contains("button", "Save Changes").click();

    // API calls should be made to update leader status
    cy.wrap(mockApiClient.contributors_UpdateContributor).should(
      "have.been.calledWith",
      mockProject.id,
      "1", // Previous leader ID
      Cypress.sinon.match({ leader: false }),
    );

    cy.wrap(mockApiClient.contributors_UpdateContributor).should(
      "have.been.calledWith",
      mockProject.id,
      "2", // New leader ID
      Cypress.sinon.match({ leader: true }),
    );

    // Check project update callback was called
    cy.get("@updateFn").should("have.been.called");
  });

  it("can update project dates", () => {
    cy.contains("button", "Edit").click();

    // Click on the start date button to open calendar
    cy.contains("Start Date").parent().find("button").click();

    // Select a new date from the calendar (e.g., 15th of current month)
    cy.get('[data-selected="false"]').eq(15).click();

    // Click on the end date button to open calendar
    cy.contains("End Date").parent().find("button").click();

    // Select a new date from the calendar (e.g., 20th of current month)
    cy.get('[data-selected="false"]').eq(20).click();

    // Save changes
    cy.contains("button", "Save Changes").click();

    // Check that the API was called with the updated dates
    cy.wrap(mockApiClient.projects_PatchProject).should(
      "have.been.calledWith",
      mockProject.id,
      Cypress.sinon.match({
        start_date: Cypress.sinon.match.date,
        end_date: Cypress.sinon.match.date,
      }),
    );

    // Check project update callback was called
    cy.get("@updateFn").should("have.been.called");
  });

  it("cancels edit mode when cancel button is clicked", () => {
    cy.contains("button", "Edit").click();

    // Open the project lead dropdown
    cy.contains("Project Lead").parent().find("button").click();

    // Select Team Member as the new lead
    cy.contains("Team Member").click();

    // Cancel the edit
    cy.contains("button", "Cancel").click();

    // We should be back in view mode
    cy.contains("Status").should("be.visible");

    // No API calls should have been made
    cy.wrap(mockApiClient.contributors_UpdateContributor).should(
      "not.have.been.called",
    );
    cy.wrap(mockApiClient.projects_PatchProject).should("not.have.been.called");
  });
});
