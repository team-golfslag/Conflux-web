/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { mount } from "cypress/react";
import { LoadingWrapper } from "@/components/loadingWrapper.tsx";

describe("<LoadingWrapper />", () => {
  it("renders the loading message when isLoading is true", () => {
    mount(<LoadingWrapper isLoading={true}>Content</LoadingWrapper>);
    cy.contains("Loading...").should("be.visible");
    cy.contains("Content").should("not.exist");
  });

  it("renders the children when isLoading is false", () => {
    mount(
      <LoadingWrapper isLoading={false}>
        <div>Actual Content</div>
      </LoadingWrapper>,
    );
    cy.contains("Actual Content").should("be.visible");
    cy.contains("Loading...").should("not.exist");
  });

  it("renders a custom loading message when provided and isLoading is true", () => {
    const customMessage = "Please wait...";
    mount(
      <LoadingWrapper isLoading={true} loadingMessage={customMessage}>
        Content
      </LoadingWrapper>,
    );
    cy.contains(customMessage).should("be.visible");
    cy.contains("Loading...").should("not.exist");
    cy.contains("Content").should("not.exist");
  });

  it("renders complex children when isLoading is false", () => {
    mount(
      <LoadingWrapper isLoading={false}>
        <section>
          <h1>Title</h1>
          <p>Paragraph text.</p>
          <button>Click Me</button>
        </section>
      </LoadingWrapper>,
    );
    cy.contains("h1", "Title").should("be.visible");
    cy.contains("p", "Paragraph text.").should("be.visible");
    cy.contains("button", "Click Me").should("be.visible");
    cy.contains("Loading...").should("not.exist");
  });

  it("does not render loading state container when isLoading is false", () => {
    mount(
      <LoadingWrapper isLoading={false}>
        <div>Content</div>
      </LoadingWrapper>,
    );
    cy.get("div.bg-secondary.min-h-full.p-8").should("not.exist");
    cy.get(
      "div.flex.items-center.justify-between.rounded-lg.bg-white.p-3.text-2xl.font-semibold",
    ).should("not.exist");
    cy.contains("Content").should("be.visible");
  });
});
