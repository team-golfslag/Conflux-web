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
import { Project } from "@team-golfslag/conflux-api-client/src/client";

// Helper function to create dates relative to today (at 00:00:00.000)
const getDateRelativeToToday = (daysOffset: number): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysOffset);
  return targetDate;
};

// --- Test Data ---
const mockProjectBase: Project = {
  id: "proj-123",
  title: "Test Project Alpha",
  description:
    "This is the description for Test Project Alpha. It should be visible.",
  users: [],
  contributors: [],
  products: [],
  parties: [],
  init: function (this: Project, _data?: unknown) {
    if (_data) {
      for (const property in _data) {
        if (Object.prototype.hasOwnProperty.call(_data, property)) {
          // Avoid overwriting class methods if they are present in _data
          if (property !== "init" && property !== "toJSON") {
            (this as unknown as Record<string, unknown>)[property] = (
              _data as unknown as Record<string, unknown>
            )[property];
          }
        }
      }
    }
  },
  toJSON: function (this: Project): Record<string, unknown> {
    const output: Record<string, unknown> = {};
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        if (key === "init" || key === "toJSON") {
          continue; // Skip methods
        }
        const value = this[key as keyof Project];
        if (value instanceof Date) {
          output[key] = value.toISOString();
        } else {
          output[key] = value;
        }
      }
    }
    return output;
  },
};

const projectUpcoming: Project = {
  ...mockProjectBase,
  id: "proj-upcoming",
  title: "Upcoming Project",
  start_date: getDateRelativeToToday(5), // Starts in 5 days
  end_date: getDateRelativeToToday(10),
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectActive: Project = {
  ...mockProjectBase,
  id: "proj-active",
  title: "Active Project",
  start_date: getDateRelativeToToday(-5), // Started 5 days ago
  end_date: getDateRelativeToToday(10), // Ends in 10 days
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectInProgress: Project = {
  ...mockProjectBase,
  id: "proj-active-no-end",
  title: "Ongoing Project",
  start_date: getDateRelativeToToday(-5), // Started 5 days ago
  end_date: undefined,
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectCompleted: Project = {
  ...mockProjectBase,
  id: "proj-ended",
  title: "Completed Project",
  start_date: getDateRelativeToToday(-10), // Started 10 days ago
  end_date: getDateRelativeToToday(-5), // Ended 5 days ago
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

const projectNoDates: Project = {
  ...mockProjectBase,
  id: "proj-no-dates",
  title: "Project Without Dates",
  start_date: undefined,
  end_date: undefined,
  init: mockProjectBase.init,
  toJSON: mockProjectBase.toJSON,
};

// --- Test Suite ---
describe("<ProjectCard /> Component Rendering", () => {
  const mountCard = (project: Project, role?: string) => {
    mount(
      <BrowserRouter>
        <ProjectCard project={project} role={role} />
      </BrowserRouter>,
    );
  };

  it("renders basic project information", () => {
    mountCard(projectActive);
    cy.contains("h3", projectActive.title).should("be.visible");
    cy.contains("p", projectActive.description!).should("be.visible");
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
    cy.contains("Ongoing").should("be.visible");
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
    const projectWithContributors = {
      ...mockProjectBase,
      contributors: [
        {
          id: "1",
          name: "Contributor 1",
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
        },
        {
          id: "2",
          name: "Contributor 2",
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
        },
        {
          id: "3",
          name: "Contributor 3",
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
        },
      ],
      init: mockProjectBase.init,
      toJSON: mockProjectBase.toJSON,
    };
    mountCard(projectWithContributors);
    cy.contains("3 contributors").should("be.visible");
  });

  it("shows singular 'contributor' text when count is 1", () => {
    const projectWithOneContributor = {
      ...mockProjectBase,
      contributors: [
        {
          id: "1",
          name: "Contributor 1",
          roles: [],
          init: mockProjectBase.init,
          toJSON: mockProjectBase.toJSON,
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
