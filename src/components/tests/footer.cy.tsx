/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import Footer from "../layout/footer";
import { mount } from "cypress/react";

describe("Footer component", () => {
  beforeEach(() => {
    mount(<Footer />);
  });

  it("renders correctly", () => {
    // Check if the footer element exists
    cy.get("footer").should("exist");
  });

  it("displays the logo", () => {
    cy.get("img").should("exist");
    cy.get("img").should("have.attr", "alt", "");
  });

  it("displays the Conflux title", () => {
    cy.contains("Conflux").should("exist");
  });

  it("shows copyright information", () => {
    cy.contains("© Utrecht University (ICS)").should("exist");
    cy.contains("2025").should("exist");
  });

  it("displays GitHub link", () => {
    cy.get("a")
      .should("have.attr", "href", "https://github.com/team-golfslag")
      .should("contain", "Github");
  });

  it("has a responsive layout", () => {
    // Test for mobile view
    cy.viewport("iphone-6");
    cy.get(".flex-col").should("exist");

    // Test for desktop view
    cy.viewport(1024, 768);
    cy.contains("2025").should("be.visible");
  });
});
