/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Collaboration } from "./collaboration";

export type User = {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  collaborations: Collaboration[];
};
