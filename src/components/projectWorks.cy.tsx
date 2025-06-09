/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  DescriptionType,
  ProductType,
  ProjectDescriptionResponseDTO,
  ProjectTitleResponseDTO,
  TitleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import {
  ProductCategoryType,
  ProductResponseDTO,
  ProjectResponseDTO,
  ProductSchema,
} from "@team-golfslag/conflux-api-client/src/client";
import { mount } from "cypress/react";
import ProjectWorks from "@/components/projectWorks.tsx";

describe("<ProjectWorks />", () => {
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
        id: "title-1",
        project_id: "123",
        text: "Project 1",
        type: TitleType.Primary,
        start_date: new Date(),
      }),
    ],
    descriptions: [
      new ProjectDescriptionResponseDTO({
        id: "desc-1",
        project_id: "123",
        text: "Description for project 1",
        type: DescriptionType.Primary,
      }),
    ],
    latest_edit: new Date().toISOString(),
  };

  const mockData = {
    project: new ProjectResponseDTO(mockProject),
  };

  beforeEach(() => {
    // Mount the component within BrowserRouter because ProjectWorks uses <Link>
    mount(
      <ProjectWorks
        project={mockData.project}
        isAdmin={true}
        onProjectUpdate={cy.stub().as("onProjectUpdate")}
      />,
    );
  });

  it("edit and delete button appear when the edit button is clicked", () => {
    cy.get("button.text-gray-600").should("not.exist");
    cy.get("button.text-red-600").should("not.exist");

    cy.get("button").contains("Edit").click();

    cy.contains(
      "Edit mode active. You can edit or delete products from the project.",
    ).should("exist");

    cy.contains(mockProducts[0].title)
      .parent()
      .parent()
      .get("button.text-gray-600")
      .should("exist");
    cy.contains(mockProducts[0].title)
      .parent()
      .parent()
      .get("button.text-red-600")
      .should("exist");

    cy.contains(mockProducts[1].title)
      .parent()
      .parent()
      .get("button.text-gray-600")
      .should("exist");
    cy.contains(mockProducts[1].title)
      .parent()
      .parent()
      .get("button.text-red-600")
      .should("exist");

    cy.contains(mockProducts[2].title)
      .parent()
      .parent()
      .get("button.text-gray-600")
      .should("exist");
    cy.contains(mockProducts[2].title)
      .parent()
      .parent()
      .get("button.text-red-600")
      .should("exist");
  });

  it("edit and delete button disappear again after edit button is pressed again", () => {
    // Press the edit button two times
    cy.get("button").contains("Edit").click();
    cy.get("button").contains("Edit").click();

    // The edit and delete button should be gone, as well as the Edit mode message
    cy.get("button.text-gray-600").should("not.exist");
    cy.get("button.text-red-600").should("not.exist");
    cy.contains(
      "Edit mode active. You can edit or delete products from the project.",
    ).should("not.exist");
  });
});
