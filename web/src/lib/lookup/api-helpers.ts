import { ALL, OPTIONS, cacheFor, error, json as jsonResponse } from "@lib/api";
import { checkRateLimit } from "./rate-limit";

export { ALL, OPTIONS, error };

export const json = (body: unknown) => jsonResponse(body, 200, cacheFor(86400));

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function enforceRateLimit(ip: string): Response | null {
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return error(429, limit.message, {
      "Retry-After": String(limit.retryAfter),
    });
  }
  return null;
}
