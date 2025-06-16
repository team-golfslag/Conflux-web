/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  ContributorPositionType,
  ContributorRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import ContributorFormFields from "../contributor/contributorFormFields";
import type { ContributorFormData } from "../contributor/contributorFormFields";
import { mount } from "cypress/react";

describe("ContributorFormFields Component", () => {
  const initialValues: ContributorFormData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    roles: [ContributorRoleType.Supervision],
    position: ContributorPositionType.PrincipalInvestigator,
    orcidId: "0000-0002-3456-7890",
    leader: true,
    contact: true,
  };

  const emptyInitialValues: ContributorFormData = {
    name: "",
    email: "",
    roles: [],
    position: undefined,
    orcidId: "",
    leader: true,
    contact: true,
  };

  beforeEach(() => {
    mount(
      <ContributorFormFields
        formData={initialValues}
        onNameChange={cy.stub().as("handleNameChange")}
        onEmailChange={cy.stub().as("handleEmailChange")}
        onOrcidIdChange={cy.stub().as("handleOrcidIdChange")}
        onRoleChange={cy.stub().as("handleRoleChange")}
        onPositionChange={cy.stub().as("handlePositionChange")}
        onLeaderChange={cy.stub().as("handleLeaderChange")}
        onContactChange={cy.stub().as("handleContactChange")}
        onOrcidAutoFill={cy.stub().as("handleOrcidAutoFill")}
      />,
    );

    // Wait for the component to be fully rendered
    cy.get("body").should("be.visible");
  });

  it("renders all form fields with correct initial values", () => {
    cy.get('input[id="name"]').should("have.value", initialValues.name);
    cy.get('input[id="email"]').should("have.value", initialValues.email);
    cy.contains(initialValues.roles[0]);
    cy.get('input[id="orcidId"]').should("have.value", initialValues.orcidId);
  });

  it("triggers onChange handlers when inputs change", () => {
    // Test name input
    cy.get('input[id="name"]').clear();
    cy.get('input[id="name"]').type("New Name");
    cy.get("@handleNameChange").should("have.been.called");

    // Test email input
    cy.get('input[id="email"]').clear();
    cy.get('input[id="email"]').type("new.email@example.com");
    cy.get("@handleEmailChange").should("have.been.called");

    // Test orcid input
    cy.get('input[id="orcidId"]').clear();
    cy.get('input[id="orcidId"]').type("0000-0003-4567-8901");
    cy.get("@handleOrcidIdChange").should("have.been.called");
  });

  it("displays proper labels for each field", () => {
    cy.contains("Name").should("exist");
    cy.contains("Email").should("exist");
    cy.contains("Role").should("exist");
    cy.contains("ORCID ID").should("exist");
  });

  it("handles empty initial values gracefully", () => {
    mount(
      <ContributorFormFields
        formData={emptyInitialValues}
        onNameChange={cy.stub().as("handleNameChange")}
        onEmailChange={cy.stub().as("handleEmailChange")}
        onOrcidIdChange={cy.stub().as("handleOrcidIdChange")}
        onRoleChange={cy.stub().as("handleRoleChange")}
        onPositionChange={cy.stub().as("handlePositionChange")}
        onLeaderChange={cy.stub().as("handleLeaderChange")}
        onContactChange={cy.stub().as("handleContactChange")}
        onOrcidAutoFill={cy.stub().as("handleOrcidAutoFill")}
      />,
    );

    cy.get('input[id="name"]').should("have.value", "");
    cy.get('input[id="email"]').should("have.value", "");
    cy.get('input[id="orcidId"]').should("have.value", "");
  });

  it("has appropriate form layout and styling", () => {
    cy.get(".grid").should("exist");
    cy.get("label").should("have.length.at.least", 4);
  });

  // Test role interaction
  it("Test role interaction", () => {
    cy.contains(initialValues.roles[0]).click();
    cy.get("@handleRoleChange").should("have.been.called");
  });
});
