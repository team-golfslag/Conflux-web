/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "./dashboardListView";
import { BrowserRouter } from "react-router-dom";
import { mount } from "cypress/react";
import { IProject } from "@team-golfslag/conflux-api-client/src/client";

// filepath: /Users/benstokmans/Documents/workspace/uni/INFOSP/Conflux-web/src/components/dashboardListView.cy.tsx
/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
/// <reference types="cypress" />

describe("<DashboardListView />", () => {
  const mockProjects: IProject[] = [
    {
      id: "123",
      title: "Project 1",
      description: "Description for project 1",
      users: [],
      contributors: [],
      products: [],
      parties: [],
    },
    {
      id: "456",
      title: "Project 2",
      description: "Description for project 2",
      users: [],
      contributors: [],
      products: [],
      parties: [],
    },
    {
      id: "789",
      title: "Project 3",
      description: "Description for project 3",
      users: [],
      contributors: [],
      products: [],
      parties: [],
    },
  ];

  const mockData = mockProjects.map((project) => ({
    project,
    role: "Member",
  }));

  beforeEach(() => {
    // Mount the component within BrowserRouter because DashboardCard uses <Link>
    mount(
      <BrowserRouter>
        <DashboardListView data={mockData} />
      </BrowserRouter>,
    );
  });

  it("renders the correct number of DashboardCards", () => {
    // Based on the Card component structure in dashboardCard.tsx
    cy.get(".m-3.flex.h-60").should("have.length", mockData.length);
  });

  it("renders the grid structure with appropriate classes", () => {
    cy.get("div.grid").should("exist");
    cy.get("div.grid").should("have.class", "grid-cols-1");
    cy.get("div.grid").should("have.class", "sm:grid-cols-2");
    cy.get("div.grid").should("have.class", "lg:grid-cols-3");
  });

  it("renders all project titles", () => {
    mockProjects.forEach((project) => {
      cy.contains("h4", project.title).should("be.visible");
    });
  });

  it("renders all project descriptions (truncated)", () => {
    mockProjects.forEach((project) => {
      // Check for the beginning of each description, since they get truncated
      const beginningOfDesc = project.description!.substring(0, 20);
      cy.contains("p", beginningOfDesc).should("exist");
    });
  });

  it("renders the user role for each card", () => {
    mockData.forEach(() => {
      cy.contains("Roles: Member").should("exist");
    });
  });

  it('renders "View Details" buttons with correct links', () => {
    // Get all cards and verify each one has the correct project link
    cy.get(".m-3.flex.h-60").each(($card, index) => {
      const project = mockProjects[index];

      // Within this specific card, find the "View Details" link
      cy.wrap($card)
        .contains("View Details")
        .should("be.visible")
        .closest("a")
        .should("have.attr", "href", `/projects/${project.id}`);
    });
  });

  it("renders empty grid when no data is provided", () => {
    mount(
      <BrowserRouter>
        <DashboardListView />
      </BrowserRouter>,
    );
    cy.get("div.grid").should("exist");
    cy.get(".m-3.flex.h-60").should("not.exist"); // No cards should be present
  });
});
