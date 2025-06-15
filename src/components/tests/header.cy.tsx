/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for Link component
import { mount } from "cypress/react";
import Header from "@/components/layout/header";

/// <reference types="cypress" />

describe("<Header />", () => {
  beforeEach(() => {
    // Mount the component within BrowserRouter because it uses <Link>
    mount(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
  });

  it("renders the logo and brand name", () => {
    cy.get('img[alt="Logo"]').should("be.visible");
    cy.contains("span", "Conflux").should("be.visible");
  });

  it("initially shows header at top position when scrolling up", () => {
    cy.get("header").should("have.class", "top-0");
  });

  it("renders desktop navigation for large screens", () => {
    cy.get("nav").should("have.class", "hidden");
    cy.get("nav").should("have.class", "md:flex");
  });

  it("initially hides the user dropdown menu", () => {
    // The dropdown menu should not exist initially
    cy.get('[data-testid="user-dropdown"]').should("not.exist");
  });

  it("renders mobile navigation for small screens", () => {
    cy.get("div.md\\:hidden").should("exist");

    // Should contain search and user buttons
    cy.get("div.md\\:hidden").within(() => {
      cy.get('a[href="/projects/search"]').should("exist");
      cy.get('a[href="/profile"]').should("exist");
    });
  });

  it("changes header position on scroll", () => {
    // Initial state
    cy.get("header").should("have.class", "top-0");

    // Simulate scrolling down
    cy.scrollTo(0, 0);
    // Then scroll down
    cy.scrollTo(0, 100);

    // Header should now be hidden
    cy.get("header").should("have.class", "-top-20");

    // Simulate scrolling up
    cy.scrollTo(0, 50);

    // Header should now be visible again
    cy.get("header").should("have.class", "top-0");
  });

  it("renders search icon in both desktop and mobile views", () => {
    // Check desktop search icon
    cy.get("nav").within(() => {
      cy.get("svg").first().should("be.visible");
    });

    // Check mobile search icon
    cy.get("div.md\\:hidden").within(() => {
      cy.get("svg").first().should("be.visible");
    });
  });
});
