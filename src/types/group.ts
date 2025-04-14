/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { GroupMember } from "./groupmember";

export type Group = {
  id: string;
  urn: string;
  display_name: string;
  description?: string;
  url?: string;
  logo_url?: string;
  external_id: string;
  sram_id: string;
  members: GroupMember[];
};
