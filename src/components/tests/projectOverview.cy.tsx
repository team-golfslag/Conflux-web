/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectOverview from "../projectOverview";
import { mount } from "cypress/react";

describe("ProjectOverview Component", () => {
  const title = "Project Title";
  const description = "Project Description";
  const longDescription =
    "sunt veniam eiusmod Lorem commodo laborum non sit minim exercitation minim irure ex proident minim qui est ea adipisicing sunt ut minim sunt fugiat ex adipisicing proident ut aliquip mollit mollit pariatur do consectetur commodo id deserunt labore laboris adipisicing magna magna irure occaecat eiusmod ex irure ad ipsum anim aute labore proident mollit incididunt consectetur minim ea ut in in excepteur veniam velit pariatur occaecat elit nostrud dolor et et ipsum elit labore sit consectetur in nulla nisi proident id exercitation labore Lorem anim exercitation elit amet irure adipisicing amet non elit Lorem ullamco ipsum minim proident qui exercitation deserunt aute cupidatat elit eiusmod ullamco cillum irure cupidatat sint labore exercitation aliquip ipsum non excepteur minim eu mollit incididunt velit labore incididunt culpa aboris non dolor et consectetur qui deserunt eiusmod aboris non dolor et consectetur qui deserunt eiusmod";

  beforeEach(() => {
    mount(
      <ProjectOverview
        title={title}
        description={description}
        onSaveTitle={cy.stub()}
        onSaveDescription={cy.stub()}
      />,
    );
  });

  it("renders the project title and description", () => {
    cy.contains(title).should("exist");
    cy.contains(description).should("exist");
  });

  it("renders the project description in a truncated form", () => {
    mount(
      <ProjectOverview
        title={title}
        description={longDescription}
        onSaveTitle={cy.stub()}
        onSaveDescription={cy.stub()}
      />,
    );
    cy.contains(longDescription.substring(0, 200)).should("exist");
    cy.contains("...").should("exist");
    cy.contains(longDescription.substring(880)).should("not.exist");
  });

  it("renders the project description in full form when the button is clicked", () => {
    mount(
      <ProjectOverview
        title={title}
        description={longDescription}
        onSaveTitle={cy.stub()}
        onSaveDescription={cy.stub()}
      />,
    );
    cy.contains("Show more").click();
    cy.contains(longDescription).should("exist");
  });

  // This test is currently disabled because the edit buttons are not yet implemented
  // it("verifies edit buttons are present for editable sections", () => {
  //   // Check for edit buttons in different sections
  //   cy.contains("button", /edit/i).should("exist");
  // });

  it("has a responsive layout that adapts to different screen sizes", () => {
    // Test mobile view
    cy.viewport("iphone-6");
    cy.get(".flex-col").should("exist");

    // Test desktop view
    cy.viewport(1024, 768);
    cy.get(".flex").should("exist");
  });
});
