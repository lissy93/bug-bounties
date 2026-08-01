import type { APIRoute } from "astro";
import { json, OPTIONS } from "@lib/lookup/api-helpers";

export const prerender = false;
export { OPTIONS };

const LOOKUPS = [
  {
    type: "website",
    endpoint: "/api/lookup/website",
    param: "url",
    description: "Find security contacts for a website domain",
  },
  {
    type: "github",
    endpoint: "/api/lookup/github",
    param: "repo",
    description: "Find security contacts for a GitHub repository",
  },
  {
    type: "package",
    endpoint: "/api/lookup/package",
    param: "name",
    description:
      "Find security contacts for an npm, PyPI, or crates.io package",
  },
  {
    type: "forge",
    endpoint: "/api/lookup/forge",
    param: "repo",
    description: "Find security contacts for a GitLab or Codeberg repository",
  },
  {
    type: "app",
    endpoint: "/api/lookup/app",
    param: "id",
    description: "Find security contacts for a mobile app",
  },
];

export const GET: APIRoute = () => json({ lookups: LOOKUPS });
