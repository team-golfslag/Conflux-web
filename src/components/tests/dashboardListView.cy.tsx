/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import React from "react";
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
  ProjectTitleResponseDTO,
  ProjectDescriptionResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { ProjectCacheProvider } from "@/lib/ProjectCacheContext";
import { createApiClientMock } from "./mocks";
import type { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

/// <reference types="cypress" />

describe("<DashboardListView />", () => {
  let mockApiClient: ApiClient;

  const mountWithProviders = (component: React.ReactElement) => {
    return mount(
      <BrowserRouter>
        <ApiClientContext.Provider value={mockApiClient}>
          <ProjectCacheProvider>{component}</ProjectCacheProvider>
        </ApiClientContext.Provider>
      </BrowserRouter>,
    );
  };

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
    const projectResponseDTO = new ProjectResponseDTO({
      id: p.id,
      start_date: p.start_date,
      end_date: p.end_date,
      titles: p.titles.map(
        (title) =>
          new ProjectTitleResponseDTO({
            text: title.text,
            type: title.type,
            start_date: title.start_date,
            id: title.id,
            project_id: title.project_id,
          }),
      ),
      descriptions: p.descriptions.map(
        (desc) =>
          new ProjectDescriptionResponseDTO({
            text: desc.text,
            type: desc.type,
            id: desc.id,
            project_id: desc.project_id,
          }),
      ),
      users: [],
      contributors: [],
      products: [],
      organisations: [],
    });

    return {
      project: projectResponseDTO,
      roles: ["Member"],
    };
  });

  beforeEach(() => {
    // Create a fresh mock API client for each test
    mockApiClient = createApiClientMock();
    // Add required mock methods for the project cache (must be inside beforeEach)
    mockApiClient.projects_GetProjectById = cy.stub().resolves({});
    mockApiClient.projects_GetProjectTimeline = cy.stub().resolves([]);

    // Mount the component within BrowserRouter because ProjectCard uses <Link>
    mountWithProviders(<DashboardListView data={mockData} />);
  });

  it("renders the correct number of ProjectCards", () => {
    // Using the Card component from the updated ProjectCard
    cy.get(".flex.h-full.flex-col.rounded-xl").should(
      "have.length",
      mockData.length,
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
    mountWithProviders(<DashboardListView />);
    cy.contains("h3", "No projects yet").should("be.visible");
  });
});
