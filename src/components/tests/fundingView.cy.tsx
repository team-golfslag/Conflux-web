/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  OrganisationRoleType,
  ProductCategoryType,
  ProductSchema,
  ProductType,
  ProjectOrganisationResponseDTO,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import {
  OrganisationResponseDTO,
  OrganisationRoleResponseDTO,
  Product,
} from "@team-golfslag/conflux-api-client/src/client";
import { mount } from "cypress/react";
import FundingView from "@/components/funding/fundingView";

describe("Project Funding View", () => {
  const mockOrganisationRole = new OrganisationRoleResponseDTO({
    role: OrganisationRoleType.Funder,
    start_date: new Date(),
  });

  const mockOrganisation = new OrganisationResponseDTO({
    id: "321",
    ror_id: "https://ror.org/000000000",
    name: "Funder",
    roles: [mockOrganisationRole],
  });

  const mockProduct = new Product({
    id: "111",
    schema: ProductSchema.Doi,
    url: "https://doi.org/",
    title: "Product",
    type: ProductType.Funding,
    categories: [ProductCategoryType.Input],
    project_id: "123",
    schema_uri: "",
    get_type_uri: "https://doi.org/",
  });

  const mockProject = new ProjectResponseDTO({
    id: "123",
    contributors: [],
    titles: [],
    descriptions: [],
    start_date: new Date(),
    end_date: undefined,
    users: [],
    products: [mockProduct],
    organisations: [],
  });

  const mockProjectOrganisation = new ProjectOrganisationResponseDTO({
    project_id: "123",
    organisation: mockOrganisation,
  });

  mockProject.organisations = [mockProjectOrganisation];

  beforeEach(() => {
    mount(<FundingView project={mockProject}></FundingView>);
  });

  it("Funding should be shown with right information", () => {
    cy.contains("Product").should("exist");
    cy.contains("Product")
      .parent()
      .contains("https://doi.org/")
      .should("exist");
    cy.contains("Product").parent().contains("Funding").should("exist");
    cy.contains("Product").parent().contains("Doi").should("exist");
    cy.contains("Product").parent().contains("Input").should("exist");
  });

  it("Funding should be shown with right information", () => {
    cy.contains("Funder").should("exist");
    cy.contains("Funder")
      .parent()
      .contains("https://ror.org/000000000")
      .should("exist");
    cy.contains("Funder").parent().contains("Funder").should("exist");
  });
});
