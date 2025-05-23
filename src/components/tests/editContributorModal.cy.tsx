/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import EditContributorModal from "../editContributorModal";
import { mount } from "cypress/react";
import { mockContributor } from "./mocks";

describe("EditContributorModal Component", () => {
  const mockEditContributor = mockContributor;

  beforeEach(() => {
    // Mount with explicit stub creation inside the test
    const updateHandler = cy.stub().as("updateHandler");
    const openChangeHandler = cy.stub().as("openChangeHandler");

    mount(
      <EditContributorModal
        isOpen={true}
        onOpenChange={openChangeHandler}
        contributor={mockEditContributor}
        projectId="1"
        onContributorUpdated={updateHandler}
      />,
    );

    // Wait for the modal to be fully rendered
    cy.get('div[role="dialog"]').should("be.visible");
  });

  it("renders the modal when isOpen is true", () => {
    cy.get('div[role="dialog"]').should("exist");
    cy.contains("Edit Contributor").should("exist");
  });

  it("pre-fills form fields with contributor data", () => {
    // Now try with more flexible selectors
    cy.contains("Name")
      .parent()
      .find("input")
      .should("have.value", mockEditContributor.person.name);

    // Check if email is pre-filled
    cy.contains("Email")
      .parent()
      .find("input")
      .should("have.value", mockEditContributor.person.email);

    // Check if ORCID is pre-filled
    cy.contains("ORCID").parent().find("input").should("exist");

    // Check for leader checkbox
    cy.contains("Leader")
      .parent()
      .find("button")
      .should("have.attr", "data-state", "checked");

    // Check for contact checkbox
    cy.contains("Contact")
      .parent()
      .find("button")
      .should("have.attr", "data-state", "checked");
  });

  it("disables the Save Changes button when required fields are empty", () => {
    // Clear the name field using the label as a more reliable selector
    cy.contains("Name").parent().find("input").clear();
    cy.get("button").contains("Save Changes").should("be.disabled");

    // Add a name to enable the button
    cy.contains("Name").parent().find("input").type("Updated Name");
    cy.get("button").contains("Save Changes").should("not.be.disabled");
  });

  it("calls onOpenChange when Cancel button is clicked", () => {
    cy.get("button").contains("Cancel").click();
    cy.get("@openChangeHandler").should("have.been.calledOnce");
    cy.get("@openChangeHandler").should("have.been.calledWith", false);
  });

  it("does not render the modal when isOpen is false", () => {
    mount(
      <EditContributorModal
        isOpen={false}
        contributor={mockEditContributor}
        projectId="1"
        onOpenChange={cy.stub()}
        onContributorUpdated={cy.stub()}
      />,
    );

    cy.get('div[role="dialog"]').should("not.exist");
  });
});
