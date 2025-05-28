/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/// <reference types="cypress" />

import { mount } from "cypress/react";
import { BrowserRouter } from "react-router-dom";
import ProjectCard from "../projectCard.tsx";
import {
  Contributor,
  DescriptionType,
  Person,
  ProjectDescriptionResponseDTO,
  ProjectTitleResponseDTO,
  TitleType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";

// Helper function to create dates relative to today (at 00:00:00.000)
const getDateRelativeToToday = (daysOffset: number): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysOffset);
  return targetDate;
};

// --- Test Data ---
// Create a base project with properties needed by ProjectResponseDTO
const createBaseProject = (): ProjectResponseDTO => {
  const project = new ProjectResponseDTO({
    id: "proj-123",
    titles: [
      new ProjectTitleResponseDTO({
        text: "Test Project Alpha",
        type: TitleType.Primary,
        start_date: new Date("2023-01-01"),
        id: "title-1",
        project_id: "proj-123",
      }),
    ],
    descriptions: [
      new ProjectDescriptionResponseDTO({
        text: "This is a test project description.",
        type: DescriptionType.Primary,
        id: "desc-1",
        project_id: "proj-123",
      }),
    ],
    users: [],
    contributors: [],
    products: [],
    start_date: new Date("2023-01-01"),
    organisations: [],
  });

  // These properties are not needed, the component looks for titles and descriptions
  // with TitleType.Primary and DescriptionType.Primary

  return project;
};

// Create separate project objects for each test scenario
const projectUpcoming = {
  ...createBaseProject(),
  id: "proj-upcoming",
  start_date: getDateRelativeToToday(5),
  end_date: getDateRelativeToToday(10),
} as unknown as ProjectResponseDTO;

const projectActive = {
  ...createBaseProject(),
  id: "proj-active",
  start_date: getDateRelativeToToday(-5),
  end_date: getDateRelativeToToday(10),
} as unknown as ProjectResponseDTO;

const projectInProgress = {
  ...createBaseProject(),
  id: "proj-active-no-end",
  start_date: getDateRelativeToToday(-5),
  end_date: undefined,
} as unknown as ProjectResponseDTO;

const projectCompleted = {
  ...createBaseProject(),
  id: "proj-ended",
  start_date: getDateRelativeToToday(-10),
  end_date: getDateRelativeToToday(-5),
} as unknown as ProjectResponseDTO;

const projectNoDates = {
  ...createBaseProject(),
  id: "proj-no-dates",
  start_date: null as unknown as Date,
  end_date: null as unknown as Date,
} as unknown as ProjectResponseDTO;

// --- Test Suite ---
describe("<ProjectCard /> Component Rendering", () => {
  // Accept ProjectResponseDTO as project type
  const mountCard = (project: ProjectResponseDTO, roles?: string[]) => {
    mount(
      <BrowserRouter>
        <ProjectCard project={project} roles={roles} />
      </BrowserRouter>,
    );
  };

  it("renders basic project information", () => {
    mountCard(projectActive);
    const primaryTitle = projectActive.titles.find(
      (title) => title.type === TitleType.Primary,
    );
    const primaryDescription = projectActive.descriptions.find(
      (desc) => desc.type === DescriptionType.Primary,
    );

    cy.contains("h3", primaryTitle!.text).should("be.visible");
    cy.contains("p", primaryDescription!.text).should("be.visible");
    cy.get("a").should("have.attr", "href", `/projects/${projectActive.id}`);
  });

  it('renders "Not Started" status when start date is undefined', () => {
    mountCard(projectNoDates);
    cy.get('[data-cy="project-status"]').should("contain", "Not Started");
    cy.contains("No start date").should("be.visible");
  });

  it('renders "Upcoming" status when start date is in the future', () => {
    mountCard(projectUpcoming);
    cy.get('[data-cy="project-status"]').should("contain", "Upcoming");
    cy.contains(
      new Date(projectUpcoming.start_date!).toLocaleDateString(),
    ).should("be.visible");
  });

  it('renders "Active" status when project is currently active', () => {
    mountCard(projectActive);
    cy.get('[data-cy="project-status"]').should("contain", "Active");
    cy.contains(
      new Date(projectActive.start_date!).toLocaleDateString(),
    ).should("be.visible");
    cy.contains(new Date(projectActive.end_date!).toLocaleDateString()).should(
      "be.visible",
    );
  });

  it('renders "In Progress" status when project has no end date', () => {
    mountCard(projectInProgress);
    cy.get('[data-cy="project-status"]').should("contain", "In Progress");
    cy.contains(
      new Date(projectInProgress.start_date!).toLocaleDateString(),
    ).should("be.visible");
    // Check for the combined date display that includes "Ongoing"
    cy.contains(
      `${new Date(projectInProgress.start_date!).toLocaleDateString()}`,
    ).should("be.visible");
    // The "Ongoing" text might be part of the date line, so we need to check more specifically
    cy.get(".text-xs.text-gray-500").contains("Ongoing").should("be.visible");
  });

  it('renders "Completed" status when end date is in the past', () => {
    mountCard(projectCompleted);
    cy.get('[data-cy="project-status"]').should("contain", "Completed");
    cy.contains(
      new Date(projectCompleted.start_date!).toLocaleDateString(),
    ).should("be.visible");
    cy.contains(
      new Date(projectCompleted.end_date!).toLocaleDateString(),
    ).should("be.visible");
  });

  it("shows the correct contributor count", () => {
    const mockContributors = [
      { id: "1", name: "Contributor 1" },
      { id: "2", name: "Contributor 2" },
      { id: "3", name: "Contributor 3" },
    ];
    // Create a new project with required fields
    const projectWithContributors = {
      ...createBaseProject(),
      contributors: mockContributors.map(
        (c) =>
          new Contributor({
            person: new Person({
              id: c.id,
              name: c.name,
              schema_uri: "",
            }),
            person_id: c.id, // Add required field
            roles: [],
            project_id: projectActive.id,
            positions: [],
            leader: false,
            contact: false,
          }),
      ),
    };
    // Type cast to ProjectResponseDTO to match component requirements
    mountCard(projectWithContributors as unknown as ProjectResponseDTO);
    cy.contains("3 contributors").should("be.visible");
  });

  it("shows singular 'contributor' text when count is 1", () => {
    // Create project with just one contributor and required fields
    const projectWithOneContributor = {
      ...createBaseProject(),
      contributors: [
        new Contributor({
          person: new Person({
            id: "1",
            name: "Single Contributor",
            schema_uri: "",
          }),
          person_id: "1", // Add required field
          roles: [],
          project_id: projectActive.id,
          positions: [],
          leader: false,
          contact: false,
        }),
      ],
    };
    // Type cast to ProjectResponseDTO to match component requirements
    mountCard(projectWithOneContributor as unknown as ProjectResponseDTO);
    cy.contains("1 contributor").should("be.visible");
  });

  it("shows the role when provided", () => {
    mountCard(projectActive, ["Owner"]);
    cy.contains("Owner").should("be.visible");
  });

  it("has the correct link wrapping the card", () => {
    mountCard(projectActive);
    cy.get("a")
      .should("have.attr", "href", `/projects/${projectActive.id}`)
      .and("have.class", "group");
  });
});
