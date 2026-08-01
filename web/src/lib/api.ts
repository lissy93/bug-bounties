import type { APIRoute } from "astro";

export const cacheFor = (seconds: number) => ({
  "Cache-Control": `public, max-age=${seconds}, s-maxage=${seconds}`,
});

export const json = (
  body: unknown,
  status = 200,
  headers?: Record<string, string>,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
  });

export const error = (
  status: number,
  message: string,
  headers?: Record<string, string>,
) =>
  json({ error: message, status }, status, {
    "Cache-Control": "no-store",
    ...headers,
  });

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });

/* ALL shadows Astro's HEAD-from-GET fallback, so answer HEAD here */
export const ALL: APIRoute = ({ request }) =>
  request.method === "HEAD"
    ? new Response(null, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    : error(405, "Method not allowed", { Allow: "GET, HEAD, OPTIONS" });
