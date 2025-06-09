/**
 *import {
  DescriptionType,
  ProductCategoryType,
  Product,
  ProductType,
  ProjectDescription,
  Project,
  ProjectTitle,
  TitleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";ram has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  DescriptionType,
  ProductCategoryType,
  ProductResponseDTO,
  ProductSchema,
  ProductType,
  ProjectDescriptionResponseDTO,
  ProjectResponseDTO,
  ProjectTitleResponseDTO,
  TitleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { mount } from "cypress/react";
import AddProductModal from "@/components/addProductModal.tsx";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

describe("<addProductModal/>", () => {
  const mockProducts = [
    {
      id: "123",
      project_id: "123",
      schema: ProductSchema.Doi,
      url: "https://",
      title: "Lorem ipsum",
      type: ProductType.Workflow,
      categories: [ProductCategoryType.Input],
    },
    {
      id: "456",
      project_id: "123",
      schema: ProductSchema.Handle,
      url: "https://",
      title: "Dolor sit",
      type: ProductType.OutputManagementPlan,
      categories: [ProductCategoryType.Output],
    },
    {
      id: "789",
      project_id: "123",
      schema: ProductSchema.Archive,
      url: "https://",
      title: "Amet, consectetur",
      type: ProductType.Dissertation,
      categories: [ProductCategoryType.Internal],
    },
  ];
  const mockProductDTOs = mockProducts.map(
    (p) => new ProductResponseDTO({ ...p }),
  );
  const mockProject = {
    id: "123",
    title: "Project 1",
    description: "Description for project 1",
    users: [],
    contributors: [],
    products: mockProductDTOs,
    parties: [],
    start_date: new Date(),
    organisations: [],
    titles: [
      new ProjectTitleResponseDTO({
        text: "Project 1",
        type: TitleType.Primary,
        start_date: new Date(),
        id: "title-1",
        project_id: "123",
      }),
    ],
    descriptions: [
      new ProjectDescriptionResponseDTO({
        text: "Description for project 1",
        type: DescriptionType.Primary,
        id: "desc-1",
        project_id: "123",
      }),
    ],
    latest_edit: new Date().toISOString(),
  };

  const mockData = {
    project: new ProjectResponseDTO(mockProject),
  };

  beforeEach(() => {
    // Intercept and mock the POST request to /people endpoint
    cy.intercept("PATCH", "http://localhost:8000/projects/**", {
      statusCode: 200,
      body: {
        id: "123",
        title: "Project 1",
        description: "Description for project 1",
        users: [],
        contributors: [],
        products: [
          new ProductResponseDTO({
            id: "123",
            title: "adipiscing elit",
            type: ProductType.Workflow,
            categories: [ProductCategoryType.Input],
            project_id: "123",
            schema: ProductSchema.Doi,
            url: "https://",
          }),
        ],
        parties: [],
        start_date: new Date(),
        organisations: [],
        titles: [
          new ProjectTitleResponseDTO({
            text: "Project 1",
            type: TitleType.Primary,
            start_date: new Date(),
            id: "title-1",
            project_id: "123",
          }),
        ],
        descriptions: [
          new ProjectDescriptionResponseDTO({
            text: "Description for project 1",
            type: DescriptionType.Primary,
            id: "desc-1",
            project_id: "123",
          }),
        ],
        latest_edit: new Date().toISOString(),
      },
    }).as("createProduct");

    mount(
      <ApiClientContext value={new ApiClient("http://localhost:8000/")}>
        <AddProductModal
          isOpen={true}
          onOpenChange={cy.stub().as("openChangeHandler")}
          project={mockData.project}
        />
      </ApiClientContext>,
    );
  });

  it("renders the modal when isOpen is true", () => {
    cy.get('div[role="dialog"]').should("exist");
    cy.contains("Add Product").should("exist");
  });

  it("contains the input fields for product information", () => {
    cy.get("input[id=title]").should("exist");
    cy.get("input[id=url]").should("exist");
    cy.contains("Select a product type").should("exist");
    cy.contains("Select a schema").should("exist");
    cy.contains("Categories").should("exist");
    cy.contains("Input").should("exist");
    cy.contains("Output").should("exist");
    cy.contains("Internal").should("exist");
  });

  it("disables the Add button when required fields are empty", () => {
    // Check that the Add button is initially disabled
    cy.get("button").contains("Add Product").should("be.disabled");

    // Fill required fields
    cy.get('input[id="title"]').type("adipiscing elit");

    // Select product type using a more reliable approach
    cy.contains("Select a product type").click();
    cy.contains("Workflow").scrollIntoView().click({ force: true });

    // Select schema using a more reliable approach
    cy.contains("Select a schema").click();
    cy.contains("Doi").scrollIntoView().click({ force: true });

    // Select category
    cy.contains("Input").click();

    // Now the button should be enabled
    cy.get("button").contains("Add Product").should("not.be.disabled");
  });

  it("calls onOpenChange when Cancel button is clicked", () => {
    cy.get("button").contains("Cancel").click();
    cy.get("@openChangeHandler").should("have.been.calledOnce");
    cy.get("@openChangeHandler").should("have.been.calledWith", false);
  });

  it("does not render the modal when isOpen is false", () => {
    mount(
      <AddProductModal
        isOpen={false}
        onOpenChange={cy.stub().as("openChangeHandler")}
        project={mockData.project}
      />,
    );

    cy.get('div[role="dialog"]').should("not.exist");
  });
});
