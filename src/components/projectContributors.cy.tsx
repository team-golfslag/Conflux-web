/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/// <reference types="cypress" />

import { mount } from "cypress/react";
import ProjectContributors from "./projectContributors"; // Adjust the import path if necessary
import {
  Contributor,
  Role,
} from "@team-golfslag/conflux-api-client/src/client";

// --- Mock Data ---

const mockRole1: Role = {
  id: "role-1",
  name: "Developer",
  project_id: "",
  urn: "",
  scim_id: "",
  init: () => {},
  toJSON: () => {},
};

const mockRole2: Role = {
  id: "role-2",
  name: "Designer",
  project_id: "",
  urn: "",
  scim_id: "",
  init: () => {},
  toJSON: () => {},
};
const mockRole3: Role = {
  id: "role-3",
  name: "Tester",
  project_id: "",
  urn: "",
  scim_id: "",
  init: () => {},
  toJSON: () => {},
};

const mockContributor1: Contributor = {
  id: "contrib-1",
  name: "Alice Wonderland",
  roles: [mockRole1],
  init: () => {},
  toJSON: () => {},
};

const mockContributor2: Contributor = {
  id: "contrib-2",
  name: "Bob The Builder",
  roles: [mockRole1, mockRole2],
  init: () => {},
  toJSON: () => {},
};

const mockContributor3: Contributor = {
  id: "contrib-3",
  name: "Charlie Chaplin",
  roles: [mockRole3],
  init: () => {},
  toJSON: () => {},
};

const mockContributorsList: Contributor[] = [
  mockContributor1,
  mockContributor2,
  mockContributor3,
];

// --- Test Suite ---
describe("<ProjectContributors /> Component Rendering", () => {
  const mountComponent = (contributors?: Contributor[]) => {
    mount(<ProjectContributors contributors={contributors} />);
  };

  it("renders the section title correctly", () => {
    mountComponent(); // Mount without contributors
    cy.contains("h2", "Contributors").should("be.visible");
  });

  it("renders correctly when no contributors are provided", () => {
    mountComponent();
    cy.contains("h2", "Contributors").should("be.visible");
    // Check that no contributor cards are rendered
    cy.get('section > div[class*="bg-gray-200"]').should("not.exist"); // Check for Card component absence
  });

  it("renders correctly when contributors list is explicitly empty", () => {
    mountComponent([]);
    cy.contains("h2", "Contributors").should("be.visible");
    cy.get('section > div[class*="bg-gray-200"]').should("not.exist");
  });

  it("renders a single contributor correctly", () => {
    mountComponent([mockContributor1]);
    cy.contains("h2", "Contributors").should("be.visible");
    // Find the card containing the contributor's name
    cy.contains("p", mockContributor1.name)
      .parents('div[class*="bg-gray-200"]') // Assuming this class identifies the card container
      .first() // Ensure we target the correct card if multiple elements match
      .within(() => {
        // Check details within this specific contributor's card
        cy.contains("p", mockContributor1.name).should("be.visible");
        cy.contains("p", mockContributor1.roles[0].name).should("be.visible");
      });

    // Verify only one card is present overall (optional, but good sanity check)
    cy.get('section > div[class*="bg-gray-200"]').should("have.length", 1);
  });

  it("renders multiple contributors correctly", () => {
    mountComponent(mockContributorsList);
    cy.contains("h2", "Contributors").should("be.visible");
    cy.get('section > div[class*="bg-gray-200"]').should(
      "have.length",
      mockContributorsList.length,
    );

    // Check details for each contributor
    mockContributorsList.forEach((contributor) => {
      cy.contains("p", contributor.name).should("be.visible");
      const expectedRoles = contributor.roles
        .map((role) => role.name)
        .join(", ");
      cy.contains("p", expectedRoles).should("be.visible");
    });
    // Check that the correct number of avatar placeholders are rendered
    cy.get('div[class*="rounded-full bg-gray-500"]').should(
      "have.length",
      mockContributorsList.length,
    );
  });

  it("renders contributor roles joined by a comma and space", () => {
    mountComponent([mockContributor2]); // Contributor with multiple roles
    cy.contains("p", mockContributor2.name).should("be.visible");
    const expectedRolesString = `${mockRole1.name}, ${mockRole2.name}`;
    cy.contains("p", expectedRolesString).should("be.visible");
  });
});
