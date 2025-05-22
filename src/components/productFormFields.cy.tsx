/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { ProductType } from "@team-golfslag/conflux-api-client/src/client.ts";
import { ProductCategoryType } from "@team-golfslag/conflux-api-client/src/client";
import ProductFormFields from "@/components/productFormFields.tsx";
import { ProductFormData } from "@/components/productFormFields.tsx";
import { mount } from "cypress/react";

describe("productFormFields Component", () => {
  const initialValues: ProductFormData = {
    title: "Lorem Ipsum",
    url: "https://lorem-ipsum.vercel.app/",
    productType: ProductType.Workflow,
    productCategory: ProductCategoryType.Input,
  };

  const emptyInitialValues: ProductFormData = {
    title: "",
    url: "",
    productType: undefined!,
    productCategory: undefined!,
  };

  beforeEach(() => {
    mount(
      <ProductFormFields
        formData={initialValues}
        setProductTitle={cy.stub().as("handleTitleChange")}
        setUrl={cy.stub().as("handleUrlChange")}
        setCategory={cy.stub().as("handleCategoryChange")}
        setProductType={cy.stub().as("handleTypeChange")}
      />,
    );

    // Wait for the component to be fully rendered
    cy.get("body").should("be.visible");
  });

  it("renders all form fields with correct initial values", () => {
    cy.get('input[id="title"]').should("have.value", initialValues.title);
    cy.get('input[id="url"]').should("have.value", initialValues.url);
    cy.contains(initialValues.productType).should("exist");
    cy.contains(initialValues.productCategory).should("exist");
  });

  it("triggers onChange handlers when inputs change", () => {
    // Test title input
    cy.get('input[id="title"]').clear();
    cy.get('input[id="title"]').type("New Title");
    cy.get("@handleTitleChange").should("have.been.called");

    // Test url input
    cy.get('input[id="url"]').clear();
    cy.get('input[id="url"]').type("https://dolor-sit.vercel.app/");
    cy.get("@handleUrlChange").should("have.been.called");

    // Test type input
    cy.contains(initialValues.productType).type("Dissertation{Enter}");
    cy.get("@handleTypeChange").should("have.been.called");

    // Test category input
    cy.contains(initialValues.productCategory).type("Output{Enter}");
    cy.get("@handleCategoryChange").should("have.been.called");
  });

  it("displays proper labels for each field", () => {
    cy.contains("Title").should("exist");
    cy.contains("url").should("exist");
    cy.contains("Type").should("exist");
    cy.contains("Category").should("exist");
  });

  it("handles empty initial values gracefully", () => {
    mount(
      <ProductFormFields
        formData={emptyInitialValues}
        setProductTitle={cy.stub().as("handleTitleChange")}
        setUrl={cy.stub().as("handleUrlChange")}
        setCategory={cy.stub().as("handleCategoryChange")}
        setProductType={cy.stub().as("handleTypeChange")}
      />,
    );

    cy.get('input[id="title"]').should("have.value", emptyInitialValues.title);
    cy.get('input[id="url"]').should("have.value", emptyInitialValues.url);
    cy.contains("Select a product type").should("have.value", "");
    cy.contains("Select a product category type").should("have.value", "");
  });
});
