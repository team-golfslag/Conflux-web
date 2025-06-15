/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import EditContributorModal from "@/components/contributor/editContributorModal";
import { mount } from "cypress/react";
import { mockContributor } from "./mocks";
import { ContributorResponseDTO } from "@team-golfslag/conflux-api-client/src/client";

describe("EditContributorModal Component", () => {
  // Type cast mockContributor to ContributorResponseDTO
  const mockEditContributor =
    mockContributor as unknown as ContributorResponseDTO;

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
