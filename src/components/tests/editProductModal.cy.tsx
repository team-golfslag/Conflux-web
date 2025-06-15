/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import EditProductModal from "@/components/editProductModal.tsx";
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

describe("<EditProductModal/>", () => {
  const mockProducts = [
    {
      id: "123",
      project_id: "proj-123",
      schema: ProductSchema.Doi,
      url: "https://",
      title: "Lorem ipsum",
      type: ProductType.Workflow,
      get_type_uri: "https://example.com/workflow",
      categories: [ProductCategoryType.Input],
    },
    {
      id: "456",
      project_id: "proj-123",
      schema: ProductSchema.Handle,
      url: "https://",
      title: "Dolor sit",
      type: ProductType.OutputManagementPlan,
      get_type_uri: "https://example.com/omp",
      categories: [ProductCategoryType.Output],
    },
    {
      id: "789",
      project_id: "proj-123",
      schema: ProductSchema.Archive,
      url: "https://",
      title: "Amet, consectetur",
      type: ProductType.Dissertation,
      get_type_uri: "https://example.com/dissertation",
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
        id: "title-123",
        project_id: "123",
      }),
    ],
    descriptions: [
      new ProjectDescriptionResponseDTO({
        text: "Description for project 1",
        type: DescriptionType.Primary,
        id: "desc-123",
        project_id: "123",
      }),
    ],
    latest_edit: new Date().toISOString(),
  };

  const mockData = {
    project: new ProjectResponseDTO(mockProject),
  };

  beforeEach(() => {
    mount(
      <EditProductModal
        isOpen={true}
        onOpenChange={cy.stub().as("openChangeHandler")}
        project={mockData.project}
        product={mockProductDTOs[0]}
      />,
    );
  });

  it("renders the modal when isOpen is true", () => {
    cy.get('div[role="dialog"]').should("exist");
    cy.contains("Edit Product").should("exist");
  });

  it("pre-fills input fields with product data", () => {
    cy.get("input[id=title]").should(
      "have.value",
      mockData.project.products[0].title,
    );
    cy.get("input[id=url]").should(
      "have.value",
      mockData.project.products[0].url,
    );
    cy.contains(mockData.project.products[0].categories[0].toString()).should(
      "exist",
    );
  });

  it("disables the Apply Changes button when required fields are empty", () => {
    // Apply button should be enabled in when the modal is opened, since all fields are filled
    cy.get("button").contains("Apply Changes").should("not.be.disabled");

    // Clear the title field
    cy.get('input[id="title"]').clear();

    // Check that the Apply button is disabled
    cy.get("button").contains("Apply Changes").should("be.disabled");

    // Fill in a new title
    cy.get('input[id="title"]').type("adipiscing elit");

    // Now the button should be enabled
    cy.get("button").contains("Apply Changes").should("not.be.disabled");
  });

  it("calls onOpenChange when Cancel button is clicked", () => {
    cy.get("button").contains("Cancel").click();
    cy.get("@openChangeHandler").should("have.been.calledOnce");
    cy.get("@openChangeHandler").should("have.been.calledWith", false);
  });

  it("does not render the modal when isOpen is false", () => {
    mount(
      <EditProductModal
        isOpen={false}
        onOpenChange={cy.stub().as("openChangeHandler")}
        project={mockData.project}
        product={mockProductDTOs[0]}
      />,
    );

    cy.get('div[role="dialog"]').should("not.exist");
  });
});
