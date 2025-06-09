/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  ProductSchema,
  ProductType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { ProductCategoryType } from "@team-golfslag/conflux-api-client/src/client";
import ProductFormFields from "@/components/productFormFields.tsx";
import { ProductFormData } from "@/components/productFormFields.tsx";
import { mount } from "cypress/react";

describe("productFormFields Component", () => {
  const initialValues: ProductFormData = {
    title: "Lorem Ipsum",
    url: "https://lorem-ipsum.vercel.app/",
    productType: ProductType.Workflow,
    categories: [ProductCategoryType.Input],
    productSchema: ProductSchema.Ark,
  };

  const emptyInitialValues: ProductFormData = {
    title: "",
    url: "",
    productType: undefined!,
    categories: [],
    productSchema: undefined!,
  };

  beforeEach(() => {
    mount(
      <ProductFormFields
        formData={initialValues}
        setProductTitle={cy.stub().as("handleTitleChange")}
        setUrl={cy.stub().as("handleUrlChange")}
        onCategoryChange={cy.stub().as("handleCategoryChange")}
        setProductType={cy.stub().as("handleTypeChange")}
        setSchema={cy.stub().as("handleSchemaChange")}
      />,
    );

    // Wait for the component to be fully rendered
    cy.get("body").should("be.visible");
  });

  it("renders all form fields with correct initial values", () => {
    cy.get('input[id="title"]').should("have.value", initialValues.title);
    cy.get('input[id="url"]').should("have.value", initialValues.url);
    cy.contains(initialValues.productType).should("exist");
    cy.contains(initialValues.categories[0]).should("exist");
    cy.contains(initialValues.productSchema).should("exist");
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

    // Test type input by clicking the select trigger and choosing an option
    cy.get('[data-slot="select-trigger"]').first().click();
    cy.contains("Dissertation").click();
    cy.get("@handleTypeChange").should("have.been.called");

    // Test category input by clicking on a badge
    cy.contains("Output").click();
    cy.get("@handleCategoryChange").should("have.been.called");
  });

  it("displays proper labels for each field", () => {
    cy.contains("Title").should("exist");
    cy.contains("URL").should("exist");
    cy.contains("Type").should("exist");
    cy.contains("Categories").should("exist");
  });

  it("handles empty initial values gracefully", () => {
    mount(
      <ProductFormFields
        formData={emptyInitialValues}
        setProductTitle={cy.stub().as("handleTitleChange")}
        setUrl={cy.stub().as("handleUrlChange")}
        onCategoryChange={cy.stub().as("handleCategoryChange")}
        setProductType={cy.stub().as("handleTypeChange")}
        setSchema={cy.stub().as("handleSchemaChange")}
      />,
    );

    cy.get('input[id="title"]').should("have.value", emptyInitialValues.title);
    cy.get('input[id="url"]').should("have.value", emptyInitialValues.url);
    cy.contains("Select a product type").should("exist");
    cy.contains("Select a schema").should("exist");
  });
});
