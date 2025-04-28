/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for Link component
import { mount } from "cypress/react";
import Header from "@/components/header";

// filepath: /Users/benstokmans/Documents/workspace/uni/INFOSP/Conflux-web/src/components/header.cy.tsx
/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
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
    cy.get(".bg-primary.absolute").should("not.exist");
  });

  it("shows user dropdown menu when user button is clicked", () => {
    // Click the user button in desktop navigation
    cy.get("nav").within(() => {
      cy.get("button").last().click();
    });

    // Dropdown should now be visible
    cy.get(".bg-primary.absolute").should("be.visible");

    // Check dropdown items
    cy.contains("a", "Profile").should("be.visible");
    cy.contains("a", "Settings").should("be.visible");
    cy.contains("a", "Log Out").should("be.visible");
  });

  it("closes user dropdown menu when clicked again", () => {
    // Open menu
    cy.get("nav").within(() => {
      cy.get("button").last().click();
    });

    // Menu should be visible
    cy.get(".bg-primary.absolute").should("be.visible");

    // Close menu
    cy.get("nav").within(() => {
      cy.get("button").last().click();
    });

    // Menu should be hidden
    cy.get(".bg-primary.absolute").should("not.exist");
  });

  it("renders mobile navigation for small screens", () => {
    cy.get("div.md\\:hidden").should("exist");

    // Should contain search and user buttons
    cy.get("div.md\\:hidden").within(() => {
      cy.get('a[href="/projects/search"]').should("exist");
      cy.get('a[href="/profile"]').should("exist");
    });
  });

  it("has correct navigation links", () => {
    // Logo links to dashboard
    cy.get('a[href="/dashboard"]').should("exist");

    // Desktop nav links
    cy.get("nav").within(() => {
      cy.get('a[href="/projects/search"]').should("exist");
    });

    // Mobile nav links
    cy.get("div.md\\:hidden").within(() => {
      cy.get('a[href="/projects/search"]').should("exist");
      cy.get('a[href="/profile"]').should("exist");
    });
  });

  it("changes header position on scroll", () => {
    // Initial state
    cy.get("header").should("have.class", "top-0");

    // Simulate scrolling down
    cy.window().then((win) => {
      // Set a previous scroll position
      win.scrollY = 0;
      // Then scroll down
      win.scrollY = 100;
      win.dispatchEvent(new Event("scroll"));
    });

    // Header should now be hidden
    cy.get("header").should("have.class", "-top-20");

    // Simulate scrolling up
    cy.window().then((win) => {
      // Mock the scroll event to simulate scrolling up
      win.scrollY = 50; // Less than previous value
      win.dispatchEvent(new Event("scroll"));
    });

    // Header should now be visible again
    cy.get("header").should("have.class", "top-0");
  });

  it("has the correct logout URL with redirectUri parameter", () => {
    // Click to open the menu
    cy.get("nav").within(() => {
      cy.get("button").last().click();
    });

    // Check the logout URL contains the expected pattern
    cy.get(".bg-primary.absolute a")
      .last()
      .should("have.attr", "href")
      .and("include", "/session/logout?redirectUri=");
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
