/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/// <reference types="cypress" />

import { mount } from "cypress/react";
import { BrowserRouter } from "react-router-dom";
import ProjectCard from "./projectCard";
import {
  DescriptionType,
  ProjectDescriptionDTO,
  ProjectDTO,
  ProjectTitleDTO,
  TitleType,
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
const mockProjectBase: ProjectDTO = new ProjectDTO({
  id: "proj-123",
  primary_title: new ProjectTitleDTO({
    text: "Test Project Alpha",
    type: TitleType.Primary,
    start_date: new Date("2023-01-01"),
  }),
  primary_description: new ProjectDescriptionDTO({
    text: "This is a test project description.",
    type: DescriptionType.Primary,
  }),
  titles: [],
  descriptions: [],
  users: [],
  contributors: [],
  products: [],
  start_date: new Date("2023-01-01"),
  organisations: [],
});

const projectUpcoming: ProjectDTO = {
  ...mockProjectBase,
  id: "proj-upcoming",
  start_date: getDateRelativeToToday(5), // Starts in 5 days
  end_date: getDateRelativeToToday(10),
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectActive: ProjectDTO = {
  ...mockProjectBase,
  id: "proj-active",
  start_date: getDateRelativeToToday(-5), // Started 5 days ago
  end_date: getDateRelativeToToday(10), // Ends in 10 days
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectInProgress: ProjectDTO = {
  ...mockProjectBase,
  id: "proj-active-no-end",
  start_date: getDateRelativeToToday(-5), // Started 5 days ago
  end_date: undefined,
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectCompleted: ProjectDTO = {
  ...mockProjectBase,
  id: "proj-ended",
  start_date: getDateRelativeToToday(-10), // Started 10 days ago
  end_date: getDateRelativeToToday(-5), // Ended 5 days ago
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectNoDates: ProjectDTO = {
  ...mockProjectBase,
  id: "proj-no-dates",
  start_date: null as unknown as Date, // Handle null as Date for testing
  end_date: null as unknown as Date, // Handle null as Date for testing
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

// --- Test Suite ---
describe("<ProjectCard /> Component Rendering", () => {
  const mountCard = (project: ProjectDTO, role?: string) => {
    mount(
      <BrowserRouter>
        <ProjectCard project={project} role={role} />
      </BrowserRouter>,
    );
  };

  it("renders basic project information", () => {
    mountCard(projectActive);
    cy.contains("h3", projectActive.primary_title!.text).should("be.visible");
    cy.contains("p", projectActive.primary_description!.text).should(
      "be.visible",
    );
    cy.get("a").should("have.attr", "href", `/projects/${projectActive.id}`);
  });

  it('renders "Not Started" status when start date is undefined', () => {
    mountCard(projectNoDates);
    cy.contains("Not Started").should("be.visible");
    cy.contains("No start date").should("be.visible");
  });

  it('renders "Upcoming" status when start date is in the future', () => {
    mountCard(projectUpcoming);
    cy.contains("Upcoming").should("be.visible");
    cy.contains(
      new Date(projectUpcoming.start_date!).toLocaleDateString(),
    ).should("be.visible");
  });

  it('renders "Active" status when project is currently active', () => {
    mountCard(projectActive);
    cy.contains("Active").should("be.visible");
    cy.contains(
      new Date(projectActive.start_date!).toLocaleDateString(),
    ).should("be.visible");
    cy.contains(new Date(projectActive.end_date!).toLocaleDateString()).should(
      "be.visible",
    );
  });

  it('renders "In Progress" status when project has no end date', () => {
    mountCard(projectInProgress);
    cy.contains("In Progress").should("be.visible");
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
    cy.contains("Completed").should("be.visible");
    cy.contains(
      new Date(projectCompleted.start_date!).toLocaleDateString(),
    ).should("be.visible");
    cy.contains(
      new Date(projectCompleted.end_date!).toLocaleDateString(),
    ).should("be.visible");
  });

  it("shows the correct contributor count", () => {
    const projectWithContributors: ProjectDTO = {
      ...mockProjectBase,
      contributors: [
        {
          person: {
            id: "1",
            name: "Contributor 1",
            init: mockProjectBase.init,
            toJSON: mockProjectBase.toJSON,
            schema_uri: "",
          },
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
          project_id: "",
          positions: [],
          leader: false,
          contact: false,
        },
        {
          person: {
            id: "2",
            name: "Contributor 2",
            init: mockProjectBase.init,
            toJSON: mockProjectBase.toJSON,
            schema_uri: "",
          },
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
          project_id: "",
          positions: [],
          leader: false,
          contact: false,
        },
        {
          person: {
            id: "3",
            name: "Contributor 3",
            init: mockProjectBase.init,
            toJSON: mockProjectBase.toJSON,
            schema_uri: "",
          },
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
          project_id: "",
          positions: [],
          leader: false,
          contact: false,
        },
      ],
      init: mockProjectBase.init,
      toJSON: mockProjectBase.toJSON,
    };
    mountCard(projectWithContributors);
    cy.contains("3 contributors").should("be.visible");
  });

  it("shows singular 'contributor' text when count is 1", () => {
    const projectWithOneContributor: ProjectDTO = {
      ...mockProjectBase,
      contributors: [
        {
          person: {
            id: "1",
            name: "Single Contributor",
            init: mockProjectBase.init,
            toJSON: mockProjectBase.toJSON,
            schema_uri: "",
          },
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
          project_id: "",
          positions: [],
          leader: false,
          contact: false,
        },
      ],
      init: mockProjectBase.init,
      toJSON: mockProjectBase.toJSON,
    };
    mountCard(projectWithOneContributor);
    cy.contains("1 contributor").should("be.visible");
  });

  it("shows the role when provided", () => {
    mountCard(projectActive, "Owner");
    cy.contains("Owner").should("be.visible");
  });

  it("has the correct link wrapping the card", () => {
    mountCard(projectActive);
    cy.get("a")
      .should("have.attr", "href", `/projects/${projectActive.id}`)
      .and("have.class", "group");
  });
});
