/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Collaborator } from "@/types/collaborator.ts";
import { Product } from "@/types/product.ts";
import { Party } from "@/types/party.ts";

export type Project = {
  id: string;
  title: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  people?: Collaborator[];
  products?: Product[];
  parties?: Party[];
};
