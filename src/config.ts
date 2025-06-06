/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

export type Config = {
  apiBaseURL: string;
  webUIUrl: string;
};

const config: Config = {
  apiBaseURL: import.meta.env.VITE_API_URL,
  webUIUrl: import.meta.env.VITE_WEBUI_URL,
};

export default config;
