/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import EditProductModal from "@/components/editProductModal.tsx";
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

describe("<EditProductModal/>", () => {
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
    cy.contains(mockData.project.products[0].type.toString()).should("exist");
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
