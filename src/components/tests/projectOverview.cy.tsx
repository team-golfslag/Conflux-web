/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectOverview from "@/components/projectOverview.tsx";
import { mount } from "cypress/react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { createApiClientMock } from "./mocks";
import {
  ProjectTitleResponseDTO,
  ProjectDescriptionResponseDTO,
  TitleType,
  DescriptionType,
} from "@team-golfslag/conflux-api-client/src/client";

describe("ProjectOverview Component", () => {
  const projectId = "123";

  // Create mock data using the proper DTOs
  const mockTitle = new ProjectTitleResponseDTO({
    id: "title-1",
    project_id: projectId,
    type: TitleType.Primary,
    text: "Project Title",
    start_date: new Date(),
  });

  const mockDescription = new ProjectDescriptionResponseDTO({
    id: "desc-1",
    project_id: projectId,
    type: DescriptionType.Primary,
    text: "Project Description",
  });

  const mockLongDescription = new ProjectDescriptionResponseDTO({
    id: "desc-2",
    project_id: projectId,
    type: DescriptionType.Primary,
    text: "sunt veniam eiusmod Lorem commodo laborum non sit minim exercitation minim irure ex proident minim qui est ea adipisicing sunt ut minim sunt fugiat ex adipisicing proident ut aliquip mollit mollit pariatur do consectetur commodo id deserunt labore laboris adipisicing magna magna irure occaecat eiusmod ex irure ad ipsum anim aute labore proident mollit incididunt consectetur minim ea ut in in excepteur veniam velit pariatur occaecat elit nostrud dolor et et ipsum elit labore sit consectetur in nulla nisi proident id exercitation labore Lorem anim exercitation elit amet irure adipisicing amet non elit Lorem ullamco ipsum minim proident qui exercitation deserunt aute cupidatat elit eiusmod ullamco cillum irure cupidatat sint labore exercitation aliquip ipsum non excepteur minim eu mollit incididunt velit labore incididunt culpa aboris non dolor et consectetur qui deserunt eiusmod aboris non dolor et consectetur qui deserunt eiusmod",
  });

  // Mock API client
  const mockApiClient = createApiClientMock();
  // Define onProjectUpdate as a function type
  let onProjectUpdate: () => void;

  beforeEach(() => {
    // Create a fresh stub for each test to avoid issues
    onProjectUpdate = cy.stub().as("updateFn");

    // Set up API client mock for updating projects and related data
    mockApiClient.projects_PutProject = cy.stub().resolves({});
    mockApiClient.projectTitles_UpdateTitle = cy.stub().resolves({});
    mockApiClient.projectDescriptions_UpdateDescription = cy
      .stub()
      .resolves({});
    mockApiClient.projectDescriptions_CreateDescription = cy
      .stub()
      .resolves({});

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[mockDescription]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
  });

  it("renders the project title and description", () => {
    cy.contains(mockTitle.text).should("exist");
    cy.contains(mockDescription.text).should("exist");
  });

  it("renders the project description in a truncated form", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[mockLongDescription]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
    cy.contains("Show more").should("exist");
  });

  it("renders the project description in full form when the show more button is clicked", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[mockLongDescription]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
    cy.contains("Show more").click();
    cy.contains("Show less").should("exist");
    cy.contains(mockLongDescription.text).should("exist");
  });

  it("enters edit mode for title when edit button is clicked", () => {
    // Title section
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", mockTitle.text);
  });

  it("updates title when saving changes", () => {
    const newTitle = "Updated Title";

    // Title section
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").clear().type(newTitle);
    cy.contains("button", "Save").click();

    // Check API was called with correct arguments
    // cy.wrap(mockApiClient.projects_PatchProject).should(
    //   "have.been.calledWith",
    //   projectId,
    //   Cypress.sinon.match({ title: newTitle }),
    // );

    // Check update callback was triggered
    // cy.get("@updateFn").should("have.been.called");
  });

  it("enters edit mode for description when edit button is clicked", () => {
    // Trigger hover on the description section to make the edit button visible
    cy.get('[data-cy="description-section"]').trigger("mouseover");

    // Click the Edit button using its data-cy attribute
    cy.get('[data-cy="edit-description-btn"]').should("be.visible").click();

    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", mockDescription.text);
  });

  it("cancels edit mode without saving when cancel button is clicked", () => {
    // Title section
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").clear().type("This should not be saved");
    cy.contains("button", "Cancel").click();

    // Original text should still be displayed
    cy.contains(mockTitle.text).should("be.visible");

    // API should not have been called
    cy.wrap(mockApiClient.projects_PutProject).should("not.have.been.called");
  });

  it("cancels description edit mode without saving when cancel button is clicked", () => {
    // Trigger hover on the description section to make the edit button visible
    cy.get('[data-cy="description-section"]').trigger("mouseover");

    // Click the Edit button using its data-cy attribute
    cy.get('[data-cy="edit-description-btn"]').should("be.visible").click();

    // Modify the description text
    cy.get("textarea").clear().type("This should not be saved");
    cy.contains("button", "Cancel").click();

    // Original description text should still be displayed
    cy.contains(mockDescription.text).should("be.visible");
  });

  // This test is currently disabled because the edit buttons are not yet implemented
  // it("verifies edit buttons are present for editable sections", () => {
  //   // Check for edit buttons in different sections
  //   cy.contains("button", /edit/i).should("exist");
  // });

  it("has a responsive layout that adapts to different screen sizes", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[mockDescription]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );

    // Test mobile view
    cy.viewport("iphone-6");
    cy.get(".flex-col").should("exist");

    // Test desktop view
    cy.viewport(1024, 768);
    cy.get(".flex").should("exist");
  });

  it("handles multiple description types", () => {
    const briefDescription = new ProjectDescriptionResponseDTO({
      id: "desc-brief",
      project_id: projectId,
      type: DescriptionType.Brief,
      text: "Brief description text",
    });

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[mockDescription, briefDescription]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );

    // Should show description type selector
    cy.contains("Description:").should("exist");

    // Should be able to find the description type selector by looking for SelectTrigger
    cy.get('[role="combobox"]').first().should("exist");

    // Should show the current description type (Primary by default)
    cy.get('[role="combobox"]').first().should("contain", "Primary");
  });

  it("handles empty descriptions array", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          titles={[mockTitle]}
          descriptions={[]}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );

    // Should still render without errors
    cy.contains(mockTitle.text).should("exist");
  });
});
