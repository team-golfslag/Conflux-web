/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { UseQueryOptions } from "@tanstack/react-query";
import config from "@/config.ts";
import { User } from "@/types/user";

export function userSessionQuery(): UseQueryOptions<User> {
  return {
    queryFn: (): Promise<User> => getUserSession(),
    queryKey: [],
  };
}

const getUserSession = async (): Promise<User> => {
  const response = await fetch(`${config.apiBaseURL}/session`, {
    method: "GET", // Default method is 'GET', so this is optional
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures that cookies are sent with the request
  });

  if (!response.ok) {
    throw new Error("User session not found");
  }

  const user: User = await response.json();
  return user;
};
