/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  DescriptionType,
  ProductCategoryType,
  ProductDTO,
  ProductType,
  ProjectDescriptionDTO,
  ProjectDTO,
  ProjectTitleDTO,
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
      schema: undefined,
      url: "https://",
      title: "Lorem ipsum",
      type: ProductType.Workflow,
      categories: [ProductCategoryType.Input],
    },
    {
      id: "456",
      schema: undefined,
      url: "https://",
      title: "Dolor sit",
      type: ProductType.OutputManagementPlan,
      categories: [ProductCategoryType.Output],
    },
    {
      id: "789",
      schema: undefined,
      url: "https://",
      title: "Amet, consectetur",
      type: ProductType.Dissertation,
      categories: [ProductCategoryType.Internal],
    },
  ];
  const mockProductDTOs = mockProducts.map((p) => new ProductDTO({ ...p }));
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
      new ProjectTitleDTO({
        text: "Project 1",
        type: TitleType.Primary,
        start_date: new Date(),
      }),
    ],
    descriptions: [
      new ProjectDescriptionDTO({
        text: "Description for project 1",
        type: DescriptionType.Primary,
      }),
    ],
    latest_edit: new Date().toISOString(),
  };

  const mockData = {
    project: new ProjectDTO(mockProject),
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
          new ProductDTO({
            id: "123",
            title: "adipiscing elit",
            type: ProductType.Workflow,
            categories: [ProductCategoryType.Input],
          }),
        ],
        parties: [],
        start_date: new Date(),
        organisations: [],
        titles: [
          new ProjectTitleDTO({
            text: "Project 1",
            type: TitleType.Primary,
            start_date: new Date(),
          }),
        ],
        descriptions: [
          new ProjectDescriptionDTO({
            text: "Description for project 1",
            type: DescriptionType.Primary,
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
    cy.contains("Select a product category type").should("exist");
  });

  it("disables the Add button when required fields are empty", () => {
    // Check that the Add button is initially disabled
    cy.get("button").contains("Add Product").should("be.disabled");

    // Fill required fields
    cy.get('input[id="title"]').type("adipiscing elit");

    cy.contains("Select a product type").type("Workflow{enter}");

    cy.contains("Select a product category type").type("Input{enter}");

    // Now the button should be enabled
    cy.get("button").contains("Add Product").should("not.be.disabled");
  });

  it("makes a PATCH request to /people endpoint when Add button is clicked", () => {
    // Fill required fields
    cy.get('input[id="title"]').type("adipiscing elit");

    cy.contains("Select a product type").type("Workflow{enter}");

    cy.contains("Select a product category type").type("Input{enter}");

    // Click the Add button
    cy.get("button").contains("Add Product").click();

    // Verify that the POST request to the /people endpoint was made
    cy.wait("@createProduct").then((interception) => {
      // Verify it was a POST request
      expect(interception.request.method).to.equal("PATCH");

      // Verify status code (our mock returns 201)
      expect(interception.response?.statusCode).to.equal(200);

      // Verify request payload contains expected data
      expect(interception.request.body.products[3]).to.include({
        title: "adipiscing elit",
        type: ProductType.Workflow,
      });
      expect(interception.request.body.products[3].categories).to.include(
        ProductCategoryType.Input,
      );

      // Log success message
      cy.log("Successfully verified POST to /people endpoint");
    });
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
