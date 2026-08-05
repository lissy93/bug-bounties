import type { APIRoute } from "astro";
import { checkRateLimit } from "./rate-limit";

export const json = (
  body: unknown,
  status = 200,
  headers?: Record<string, string>,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        status === 200 ? "public, max-age=86400, s-maxage=86400" : "no-store",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
  });

export const error = (
  status: number,
  message: string,
  headers?: Record<string, string>,
) => json({ error: message, status }, status, headers);

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });

export const ALL: APIRoute = () =>
  error(405, "Method not allowed", { Allow: "GET, OPTIONS" });

const env = import.meta.env as unknown as Record<string, string | undefined>;
const IP_HEADER =
  env.CLIENT_IP_HEADER || process.env.CLIENT_IP_HEADER || "cf-connecting-ip";

function getClientIp(request: Request): string {
  return request.headers.get(IP_HEADER) || "unknown";
}

export function enforceRateLimit(
  request: Request,
  scope = "",
): Response | null {
  const limit = checkRateLimit(scope + getClientIp(request));
  if (!limit.ok) {
    return error(429, limit.message, {
      "Retry-After": String(limit.retryAfter),
    });
  }
  return null;
}
