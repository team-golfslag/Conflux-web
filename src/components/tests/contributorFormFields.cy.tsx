/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  ContributorPositionType,
  ContributorRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import ContributorFormFields, {
  ContributorFormData,
} from "../contributorFormFields";
import { mount } from "cypress/react";

describe("ContributorFormFields Component", () => {
  const initialValues: ContributorFormData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    roles: [ContributorRoleType.Supervision],
    positions: [ContributorPositionType.PrincipalInvestigator],
    orcidId: "0000-0002-3456-7890",
    leader: true,
    contact: true,
  };

  const emptyInitialValues: ContributorFormData = {
    name: "",
    email: "",
    roles: [],
    positions: [],
    orcidId: "",
    leader: true,
    contact: true,
  };

  beforeEach(() => {
    mount(
      <ContributorFormFields
        formData={initialValues}
        handleInputChange={cy.stub().as("handleInputChange")}
        handleRoleChange={cy.stub().as("handleRoleChange")}
        handlePositionChange={cy.stub().as("handlePositionChange")}
        setFormData={cy.stub().as("setFormData")}
      />,
    );

    // Wait for the component to be fully rendered
    cy.get("body").should("be.visible");
  });

  it("renders all form fields with correct initial values", () => {
    cy.get('input[id="name"]').should("have.value", initialValues.name);
    cy.get('input[id="email"]').should("have.value", initialValues.email);
    cy.contains(initialValues.roles[0]).should("have.class", "bg-primary");
    cy.get('input[id="orcidId"]').should("have.value", initialValues.orcidId);
  });

  it("triggers onChange handlers when inputs change", () => {
    // Test name input
    cy.get('input[id="name"]').clear();
    cy.get('input[id="name"]').type("New Name");
    cy.get("@handleInputChange").should("have.been.called");

    // Test email input
    cy.get('input[id="email"]').clear();
    cy.get('input[id="email"]').type("new.email@example.com");
    cy.get("@handleInputChange").should("have.been.called");

    // Test orcid input
    cy.get('input[id="orcidId"]').clear();
    cy.get('input[id="orcidId"]').type("0000-0003-4567-8901");
    cy.get("@handleInputChange").should("have.been.called");
  });

  it("displays proper labels for each field", () => {
    cy.contains("Name").should("exist");
    cy.contains("Email").should("exist");
    cy.contains("Role").should("exist");
    cy.contains("ORCID").should("exist");
  });

  it("handles empty initial values gracefully", () => {
    mount(
      <ContributorFormFields
        formData={emptyInitialValues}
        handleInputChange={cy.stub().as("changeHandler")}
        handleRoleChange={cy.stub().as("changeHandler")}
        handlePositionChange={cy.stub().as("changeHandler")}
        setFormData={cy.stub().as("changeHandler")}
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
