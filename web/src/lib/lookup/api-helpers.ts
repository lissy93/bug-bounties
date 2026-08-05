import { ALL, OPTIONS, cacheFor, error, json as jsonResponse } from "@lib/api";
import { checkRateLimit } from "./rate-limit";

export { ALL, OPTIONS, error };

export const json = (body: unknown) => jsonResponse(body, 200, cacheFor(86400));

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
