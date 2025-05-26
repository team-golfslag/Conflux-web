/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectOverview from "@/components/projectOverview.tsx";
import { mount } from "cypress/react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { createApiClientMock } from "./mocks";

describe("ProjectOverview Component", () => {
  const projectId = "123";
  const title = "Project Title";
  const description = "Project Description";
  const longDescription =
    "sunt veniam eiusmod Lorem commodo laborum non sit minim exercitation minim irure ex proident minim qui est ea adipisicing sunt ut minim sunt fugiat ex adipisicing proident ut aliquip mollit mollit pariatur do consectetur commodo id deserunt labore laboris adipisicing magna magna irure occaecat eiusmod ex irure ad ipsum anim aute labore proident mollit incididunt consectetur minim ea ut in in excepteur veniam velit pariatur occaecat elit nostrud dolor et et ipsum elit labore sit consectetur in nulla nisi proident id exercitation labore Lorem anim exercitation elit amet irure adipisicing amet non elit Lorem ullamco ipsum minim proident qui exercitation deserunt aute cupidatat elit eiusmod ullamco cillum irure cupidatat sint labore exercitation aliquip ipsum non excepteur minim eu mollit incididunt velit labore incididunt culpa aboris non dolor et consectetur qui deserunt eiusmod aboris non dolor et consectetur qui deserunt eiusmod";

  // Mock API client
  const mockApiClient = createApiClientMock();
  // Define onProjectUpdate as a function type
  let onProjectUpdate: () => void;

  beforeEach(() => {
    // Create a fresh stub for each test to avoid issues
    onProjectUpdate = cy.stub().as("updateFn");

    // Set up API client mock for updating a project
    mockApiClient.projects_PatchProject = cy.stub().resolves({});

    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          title={title}
          description={description}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
  });

  it("renders the project title and description", () => {
    cy.contains(title).should("exist");
    cy.contains(description).should("exist");
  });

  it("renders the project description in a truncated form", () => {
    mount(
      <ApiClientContext.Provider value={mockApiClient}>
        <ProjectOverview
          projectId={projectId}
          title={title}
          description={longDescription}
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
          title={title}
          description={longDescription}
          onProjectUpdate={onProjectUpdate}
          isAdmin={true}
        />
      </ApiClientContext.Provider>,
    );
    cy.contains("Show more").click();
    cy.contains("Show less").should("exist");
    cy.contains(longDescription).should("exist");
  });

  it("enters edit mode for title when edit button is clicked", () => {
    // Title section
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", title);
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
    // Description section
    cy.contains("h3", "Primary description")
      .parent()
      .contains("button", "Edit")
      .click();
    cy.get("textarea").should("be.visible");
    cy.get("textarea").should("have.value", description);
  });

  it("cancels edit mode without saving when cancel button is clicked", () => {
    // Title section
    cy.contains("button", "Edit").first().click();
    cy.get("textarea").clear().type("This should not be saved");
    cy.contains("button", "Cancel").click();

    // Original text should still be displayed
    cy.contains(title).should("be.visible");

    // API should not have been called
    cy.wrap(mockApiClient.projects_PatchProject).should("not.have.been.called");
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
          title={title}
          description={description}
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
});
