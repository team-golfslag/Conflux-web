/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { createContext } from "react";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

const ApiClientContext = createContext<ApiClient>(new ApiClient());

export { ApiClientContext };
