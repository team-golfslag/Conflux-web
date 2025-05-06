/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "./dashboardListView";
import { BrowserRouter } from "react-router-dom";
import { mount } from "cypress/react";
import { Project } from "@team-golfslag/conflux-api-client/src/client";

/// <reference types="cypress" />

describe("<DashboardListView />", () => {
  const mockProjects = [
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

  const mockData = mockProjects.map((p) => ({
    project: new Project({
      ...p,
    }),
    role: "Member",
  }));

  beforeEach(() => {
    // Mount the component within BrowserRouter because ProjectCard uses <Link>
    mount(
      <BrowserRouter>
        <DashboardListView data={mockData} />
      </BrowserRouter>,
    );
  });

  it("renders the correct number of ProjectCards", () => {
    // Using the Card component from the updated ProjectCard
    cy.get(".flex.h-full.flex-col.rounded-xl").should(
      "have.length",
      mockData.length * 2,
    );
  });

  it("renders the grid structure with appropriate classes", () => {
    cy.get("div.grid").should("exist");
    cy.get("div.grid").should("have.class", "grid-cols-1");
    cy.get("div.grid").should("have.class", "sm:grid-cols-2");
    cy.get("div.grid").should("have.class", "lg:grid-cols-3");
  });

  it("renders all project titles", () => {
    mockProjects.forEach((project) => {
      cy.contains("h3", project.title).should("be.visible");
    });
  });

  it("renders all project descriptions (truncated)", () => {
    mockProjects.forEach((project) => {
      // Check for the beginning of each description, since they get truncated
      const beginningOfDesc = project.description.substring(0, 20);
      cy.contains("p", beginningOfDesc).should("exist");
    });
  });

  it("renders the user role for each card", () => {
    mockData.forEach(() => {
      cy.get(".text-primary.bg-primary\\/10")
        .contains("Member")
        .should("exist");
    });
  });

  it("renders cards with correct links", () => {
    // Get all link elements and verify each one has the correct project link
    cy.get("a").each(($link, index) => {
      const project = mockProjects[index];
      cy.wrap($link).should("have.attr", "href", `/projects/${project.id}`);
    });
  });

  it("renders empty grid when no data is provided", () => {
    mount(
      <BrowserRouter>
        <DashboardListView />
      </BrowserRouter>,
    );
    cy.get("div.grid").should("exist");
    cy.get(".flex.h-full.flex-col.rounded-xl").should("not.exist"); // No cards should be present
  });
});
