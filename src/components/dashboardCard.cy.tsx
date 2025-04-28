/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
/// <reference types="cypress" />

import DashboardCard from "./dashboardCard";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for Link component
import { mount } from "cypress/react";
import { IProject } from "@team-golfslag/conflux-api-client/src/client";

describe.only("<DashboardCard />", () => {
  const mockProject: IProject = {
    id: "123",
    title: "Test Project Title",
    description:
      "This is a longer description that should be truncated because it exceeds the one hundred character limit set in the component.",
    users: [],
    contributors: [],
    products: [],
    parties: [],
  };
  const mockRole = "Admin";

  beforeEach(() => {
    // Mount the component within BrowserRouter because it uses <Link>
    mount(
      <BrowserRouter>
        <DashboardCard project={mockProject} role={mockRole} />
      </BrowserRouter>,
    );
  });

  it("renders the project title", () => {
    cy.contains("h4", mockProject.title).should("be.visible");
  });

  it("renders the truncated project description", () => {
    const truncatedDescription =
      "This is a longer description that should be truncated because it exceeds the one hundred...";
    cy.contains("p", truncatedDescription).should("be.visible");
    // Ensure the full description is not visible
    cy.contains(mockProject.description!).should("not.exist");
  });

  it("renders the user role", () => {
    cy.contains(`Roles: ${mockRole}`).should("be.visible");
  });

  it('renders the "View Details" button with the correct link', () => {
    cy.contains("button", "View Details")
      .should("be.visible")
      .closest("a") // Find the parent Link component
      .should("have.attr", "href", `/projects/${mockProject.id}`);
  });

  it("renders the card structure", () => {
    cy.get(".m-3.flex.h-60").should("exist"); // Check for the main card container
    cy.get('[data-slot="card-header"]').should("exist"); // Check for CardHeader
    cy.get('[data-slot="card-content"').should("exist"); // Check for CardContent
  });
});
