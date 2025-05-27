/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "../dashboardListView.tsx";
import { BrowserRouter } from "react-router-dom";
import { mount } from "cypress/react";
import {
  Project,
  ProjectTitle,
  ProjectDescription,
  TitleType,
  DescriptionType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";

/// <reference types="cypress" />

describe("<DashboardListView />", () => {
  const mockInfo = [
    { id: "123", title: "Project 1", description: "Description for project 1" },
    { id: "456", title: "Project 2", description: "Description for project 2" },
    { id: "789", title: "Project 3", description: "Description for project 3" },
  ];
  const mockProjects: Project[] = mockInfo.map(
    (info) =>
      new Project({
        id: info.id,
        users: [],
        contributors: [],
        products: [],
        start_date: new Date(),
        organisations: [],
        lastest_edit: new Date(),
        titles: [
          new ProjectTitle({
            text: info.title,
            type: TitleType.Primary,
            start_date: new Date(),
            project_id: info.id,
            id: `title-${info.id}`,
            type_schema_uri: "",
            type_uri: "",
          }),
        ],
        descriptions: [
          new ProjectDescription({
            text: info.description,
            type: DescriptionType.Primary,
            project_id: info.id,
            id: `desc-${info.id}`,
            type_schema_uri: "",
            type_uri: "",
          }),
        ],
      }),
  );

  // Create projects with primary_title and primary_description properties needed by ProjectCard
  const mockData = mockProjects.map((p) => {
    // Add the primary_title and primary_description properties expected by ProjectCard
    const enhancedProject = {
      ...p,
      primary_title: p.titles.find((t) => t.type === TitleType.Primary),
      primary_description: p.descriptions.find(
        (d) => d.type === DescriptionType.Primary,
      ),
    };

    return {
      project: enhancedProject as unknown as ProjectResponseDTO,
      role: "Member",
    };
  });

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
      cy.contains("h3", project.titles[0]!.text).should("be.visible");
    });
  });

  it("renders all project descriptions (truncated)", () => {
    mockProjects.forEach((project) => {
      // Check for the beginning of each description, since they get truncated
      const beginningOfDesc = project.descriptions[0].text.substring(0, 20);
      cy.contains("p", beginningOfDesc).should("exist");
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
