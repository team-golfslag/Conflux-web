/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import allRoutes from "./routes";
import "./index.css";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";
import config from "@/config.ts";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { SessionProvider } from "@/lib/SessionContext";

/*
This is the main entry point into the program
*/

const apiClient = new ApiClient(config.apiBaseURL, {
  fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(url, { ...init, credentials: "include" });
  },
});

const root = document.getElementById("root");

createRoot(root!).render(
  <StrictMode>
    <ApiClientContext.Provider value={apiClient}>
      <BrowserRouter>
        <SessionProvider>{allRoutes}</SessionProvider>
      </BrowserRouter>
    </ApiClientContext.Provider>
  </StrictMode>,
);
