/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectOverview from "@/components/overview/projectOverview";
import { mount } from "cypress/react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { LanguageProvider } from "@/lib/LanguageContext";
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
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
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
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockLongDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );
    cy.contains("Show more").should("exist");
  });

  it("renders the project description in full form when the show more button is clicked", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockLongDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );
    cy.contains("Show more").click();
    cy.contains("Show less").should("exist");
    cy.contains(mockLongDescription.text).should("exist");
  });

  it("enters edit mode for title when edit button is clicked", () => {
    // Hover over the title section to make the edit button visible - be more specific
    cy.get("[data-slot='card-header'] .group\\/cardHeader")
      .first()
      .trigger("mouseover");

    // Title section - look for the edit button and click it
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", mockTitle.text);
  });

  it("updates title when saving changes", () => {
    const newTitle = "Updated Title";

    // Hover over the title section and enter edit mode - be more specific
    cy.get("[data-slot='card-header'] .group\\/cardHeader")
      .first()
      .trigger("mouseover");
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").clear().type(newTitle);
    cy.contains("button", "Save").click();

    // Check that update callback was triggered (API calls are mocked)
    cy.get("@updateFn").should("have.been.called");
  });

  it("enters edit mode for description when edit button is clicked", () => {
    // Trigger hover on the description section to make the edit button visible
    cy.get('[data-cy="description-section"]').trigger("mouseover");

    // Click the Edit button - it should be visible after hover
    cy.get('[data-cy="description-section"] .group')
      .trigger("mouseover")
      .within(() => {
        cy.contains("button", "Edit").should("be.visible").click();
      });

    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", mockDescription.text);
  });

  it("cancels edit mode without saving when cancel button is clicked", () => {
    // Title section - be more specific
    cy.get("[data-slot='card-header'] .group\\/cardHeader")
      .first()
      .trigger("mouseover");
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").clear().type("This should not be saved");
    cy.contains("button", "Cancel").click();

    // Original text should still be displayed
    cy.contains(mockTitle.text).should("be.visible");

    // API should not have been called for updating
    cy.wrap(mockApiClient.projectTitles_UpdateTitle).should(
      "not.have.been.called",
    );
  });

  it("cancels description edit mode without saving when cancel button is clicked", () => {
    // Trigger hover on the description section to make the edit button visible
    cy.get('[data-cy="description-section"]').trigger("mouseover");

    // Click the Edit button
    cy.get('[data-cy="description-section"] .group')
      .trigger("mouseover")
      .within(() => {
        cy.contains("button", "Edit").should("be.visible").click();
      });

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
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
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
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockDescription, briefDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );

    // Should show description type selector
    cy.contains("Description:").should("exist");

    // Should be able to find the description type selector by looking for SelectTrigger
    cy.get('[data-cy="description-section"] [role="combobox"]').should("exist");

    // Should show the current description type (Primary by default)
    cy.get('[data-cy="description-section"] [role="combobox"]').should(
      "contain",
      "Primary",
    );
  });

  it("handles empty descriptions array", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );

    // Should still render without errors
    cy.contains(mockTitle.text).should("exist");
  });

  it("shows title type selector when multiple title types exist", () => {
    const alternativeTitle = new ProjectTitleResponseDTO({
      id: "title-2",
      project_id: projectId,
      type: TitleType.Alternative,
      text: "Alternative Title",
      start_date: new Date(),
    });

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle, alternativeTitle]}
            descriptions={[mockDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );

    // Should show title type selector
    cy.get("select, [role='combobox']").should("exist");
  });

  it("displays add new buttons for admin users", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={true}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );

    // Hover over title section to reveal add button - be more specific
    cy.get("[data-slot='card-header'] .group\\/cardHeader")
      .first()
      .trigger("mouseover");
    cy.contains("button", "Add New").should("exist");

    // Hover over description section to reveal add button
    cy.get('[data-cy="description-section"] .group').trigger("mouseover");
    cy.contains("button", "Add New").should("exist");
  });

  it("does not show edit buttons for non-admin users", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <LanguageProvider>
          <ProjectOverview
            projectId={projectId}
            titles={[mockTitle]}
            descriptions={[mockDescription]}
            onProjectUpdate={onProjectUpdate}
            isAdmin={false}
          />
        </LanguageProvider>
      </ApiClientContext.Provider>,
    );

    // Edit buttons should not be visible even on hover - be more specific
    cy.get("[data-slot='card-header'] .group\\/cardHeader")
      .first()
      .trigger("mouseover");
    cy.contains("button", "Edit").should("not.exist");

    cy.get('[data-cy="description-section"] .group').trigger("mouseover");
    cy.contains("button", "Edit").should("not.exist");
  });
});
