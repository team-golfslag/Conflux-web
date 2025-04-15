/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Role } from "@/types/role.ts";

export type Contributor = {
  id: string;
  or_ci_d?: string;
  name: string;
  roles: Role[];
  given_name?: string;
  family_name?: string;
  email?: string;
};
