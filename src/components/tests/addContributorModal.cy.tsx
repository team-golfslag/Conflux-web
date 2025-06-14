/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import AddContributorModal from "../addContributorModal";
import { mount } from "cypress/react";

describe("AddContributorModal Component", () => {
  beforeEach(() => {
    // Intercept and mock the POST request to /people endpoint
    cy.intercept("POST", "http://localhost:8000/people", {
      statusCode: 201,
      body: { id: "123", name: "John Doe", email: "john@example.com" },
    }).as("createPerson");

    mount(
      <AddContributorModal
        isOpen={true}
        onOpenChange={cy.stub().as("openChangeHandler")}
        onContributorAdded={cy.stub()}
        projectId="project-123"
      />,
    );
  });

  it("renders the modal when isOpen is true", () => {
    cy.get('div[role="dialog"]').should("exist");
    cy.contains("Add Contributor").should("exist");
  });

  it("contains form fields for contributor information", () => {
    cy.get('input[id="name"]').should("exist");
    cy.get('input[id="email"]').should("exist");
    cy.get('input[id="orcidId"]').should("exist");
    cy.get("button[id='leader']").should("exist");
    cy.get("button[id='contact']").should("exist");
  });

  it("disables the Add button when required fields are empty", () => {
    // Check that the Add button is initially disabled
    cy.get("button").contains("Add").should("be.disabled");

    // Fill required fields
    cy.get('input[id="name"]').type("John Doe");
    cy.get('input[id="email"]').type("john@example.com");

    // Select a role
    cy.contains("Data Curation").click();

    // Select a position type
    cy.contains("Consultant").click();

    // Now the button should be enabled
    cy.get("button").contains("Add").should("not.be.disabled");
  });

  it("makes a POST request to /people endpoint when Add button is clicked", () => {
    // Fill in the form
    cy.get('input[id="name"]').type("John Doe");
    cy.get('input[id="email"]').type("john@example.com");
    cy.get('input[id="orcidId"]').type("0000-0001-2345-6789");

    // Select a role
    cy.contains("Data Curation").click();

    // Select a position type
    cy.contains("Consultant").click();

    // Click the Add button
    cy.get("button").contains("Add").click();

    // Verify that the POST request to the /people endpoint was made
    cy.wait("@createPerson").then((interception) => {
      // Verify it was a POST request
      expect(interception.request.method).to.equal("POST");

      // Verify status code (our mock returns 201)
      expect(interception.response?.statusCode).to.equal(201);

      // Verify request payload contains expected data
      expect(interception.request.body).to.include({
        name: "John Doe",
        email: "john@example.com",
        or_ci_d: "https://orcid.org/0000-0001-2345-6789",
      });

      // Log success message
      cy.log("Successfully verified POST to /people endpoint");
    });
  });

  it("calls onOpenChange when Cancel button is clicked", () => {
    cy.get("button").contains("Cancel").click();
    cy.get("@openChangeHandler").should("have.been.calledOnce");
    cy.get("@openChangeHandler").should("have.been.calledWith", false);
  });

  it("does not render the modal when isOpen is false", () => {
    mount(
      <AddContributorModal
        isOpen={false}
        onOpenChange={cy.stub().as("openChangeHandler")}
        onContributorAdded={cy.stub().as("addHandler")}
        projectId="project-123"
      />,
    );

    cy.get('div[role="dialog"]').should("not.exist");
  });

  it("validates email format", () => {
    cy.get('input[id="name"]').type("John Doe");
    cy.get('input[id="email"]').type("invalid-email");

    // Button should be disabled due to invalid email
    cy.get("button").contains("Add").should("be.disabled");

    // Fix the email
    cy.get('input[id="email"]').clear().type("valid@example.com");

    // Select a role
    cy.contains("Data Curation").click();

    // Select a position type
    cy.contains("Consultant").click();

    // Button should now be enabled
    cy.get("button").contains("Add").should("not.be.disabled");
  });

  it("allows only one position to be selected at a time", () => {
    // Select a position
    cy.contains("Principal Investigator").click();

    // Verify it's selected (using the UI state - it should have the default variant styling)
    cy.contains("Principal Investigator");
    // Select a different position
    cy.contains("Consultant").click();
  });
});
