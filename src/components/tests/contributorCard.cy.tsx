/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ContributorCard from "@/components/contributor/contributorCard";
import type { ContributorResponseDTO } from "@team-golfslag/conflux-api-client/src/client";
import { mockContributor } from "./mocks";
import { mount } from "cypress/react";

describe("ContributorCard Component", () => {
  const mockCardContributor: ContributorResponseDTO = mockContributor;

  beforeEach(() => {
    mount(
      <ContributorCard
        onEdit={cy.stub().as("editHandler")}
        onDelete={cy.stub().as("deleteHandler")}
        name={mockCardContributor.person!.name}
        roles={mockCardContributor.roles.map((r) => r.role_type)}
        orcidId={mockCardContributor.person?.orcid_id}
        isLeader={mockCardContributor.leader}
        isContact={mockCardContributor.contact}
        position={
          mockCardContributor.positions.find((p) => !p.end_date)?.position
        }
        id={mockCardContributor.person!.id}
        email={mockCardContributor.person?.email}
        editMode={false}
      />,
    );
  });

  it("renders the contributor information correctly", () => {
    cy.contains(mockCardContributor.person!.name).should("exist");
  });

  it("renders the email correctly", () => {
    cy.contains(mockCardContributor.person!.email!).should("exist");
  });

  it("renders the roles of the contributor", () => {
    cy.contains(
      mockCardContributor.roles[0]?.role_type.toString() || "",
    ).should("exist");
  });

  it("indicates if the contributor is a leader", () => {
    cy.get(".text-amber-500").should("exist");
  });

  it("indicates if the contributor is a contact person", () => {
    cy.get(".text-blue-500").should("exist");
  });
});

describe("ContributorCard Component in Edit Mode", () => {
  const mockCardContributor: ContributorResponseDTO = mockContributor;

  beforeEach(() => {
    mount(
      <ContributorCard
        onEdit={cy.stub().as("editHandler")}
        onDelete={cy.stub().as("deleteHandler")}
        openDeleteDialog={cy.stub().as("openDeleteDialogHandler")}
        name={mockCardContributor.person!.name}
        roles={mockCardContributor.roles.map((r) => r.role_type)}
        orcidId={mockCardContributor.person?.orcid_id}
        isLeader={mockCardContributor.leader}
        isContact={mockCardContributor.contact}
        isConfluxUser={false}
        position={
          mockCardContributor.positions.find((p) => !p.end_date)?.position
        }
        id={mockCardContributor.person!.id}
        email={mockCardContributor.person?.email}
        editMode={true}
      />,
    );
  });

  it("displays edit and delete buttons when in edit mode", () => {
    cy.get("button.text-blue-500").should("exist");
    cy.get("button.text-destructive").should("exist");
  });

  it("does not display ORCID button when in edit mode", () => {
    cy.get("Button[onClick='copyOrcidToClipboard']").should("not.exist");
  });

  it("calls the edit handler when edit button is clicked", () => {
    cy.get("button.text-blue-500").click();
    cy.get("@editHandler").should("have.been.calledOnce");
  });

  it("calls the openDeleteDialog handler when delete button is clicked", () => {
    cy.get("button.text-destructive").click();
    cy.get("@openDeleteDialogHandler").should("have.been.calledOnce");
  });
});

describe("ContributorCard for Conflux User in Edit Mode", () => {
  const mockCardContributor: ContributorResponseDTO = mockContributor;

  beforeEach(() => {
    mount(
      <ContributorCard
        onEdit={cy.stub().as("editHandler")}
        onDelete={cy.stub().as("deleteHandler")}
        openDeleteDialog={cy.stub().as("openDeleteDialogHandler")}
        name={mockCardContributor.person!.name}
        roles={mockCardContributor.roles.map((r) => r.role_type)}
        orcidId={mockCardContributor.person?.orcid_id}
        isLeader={mockCardContributor.leader}
        isConfluxUser={true}
        isContact={mockCardContributor.contact}
        position={
          mockCardContributor.positions.find((p) => !p.end_date)?.position
        }
        id={mockCardContributor.person!.id}
        email={mockCardContributor.person?.email}
        editMode={true}
      />,
    );
  });

  it("does not display edit and delete buttons for Conflux users", () => {
    cy.get("button.text-blue-500").should("not.exist");
    cy.get("button.text-destructive").should("not.exist");
  });

  it("displays Conflux user icon", () => {
    cy.get("div").find("svg").should("exist");
  });
});
