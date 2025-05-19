/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for Link component
import { mount } from "cypress/react";
import Header from "@/components/header.tsx";

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

  it("renders the header with correct classes", () => {
    cy.get("header").should("have.class", "bg-primary");
    cy.get("header").should("have.class", "text-primary-foreground");
    cy.get("header").should("have.class", "sticky");
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

    // First, set the initial state with a proper scroll event
    cy.window().invoke("scrollTo", 0, 0);

    // Manually manipulate the component state via a custom command
    cy.window().then((win) => {
      // Simulate scrolling down with a significant distance
      win.scrollTo(0, 300);

      // Create a proper scroll event with all properties a native scroll would have
      const scrollEvent = new Event("scroll", { bubbles: true });
      win.dispatchEvent(scrollEvent);

      return cy.wrap(win);
    });

    // Using a longer wait to ensure state updates complete (including any transition times)
    cy.wait(200);

    // Header should now be hidden
    // Using should with a retry/timeout strategy
    cy.get("header").should("have.class", "-top-20");

    // Simulate scrolling up - properly chain this after the previous assertion
    cy.window().then((win) => {
      // Mock the scroll event to simulate scrolling up
      // Scroll up with deliberate action that ensures detection
      win.scrollTo(0, 10); // Scroll almost to top to clearly trigger "up" direction

      // Create a proper scroll event with all properties a native scroll would have
      const scrollEvent = new Event("scroll", { bubbles: true });
      win.dispatchEvent(scrollEvent);

      return cy.wrap(win);
    });

    // Using a longer wait to ensure state updates complete (including any transition times)
    cy.wait(200);

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
