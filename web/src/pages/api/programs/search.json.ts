import type { APIRoute } from "astro";
import { ALL, OPTIONS, cacheFor, error, json } from "@lib/api";
import { loadBounties } from "@lib/data";
import {
  ALL_FIELDS,
  isSearchField,
  searchPrograms,
  type SearchField,
  type SearchFilters,
  type SortMode,
} from "@lib/search";

export const prerender = false;
export { ALL, OPTIONS };

const MAX_Q = 200;
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;
const MAX_OFFSET = 10000;
const VALID_SORTS: ReadonlySet<SortMode> = new Set([
  "relevance",
  "name",
  "payout",
]);
const VALID_PROGRAM_TYPES = new Set(["bounty", "vdp", "hybrid"]);

const SUBMIT_URL =
  "https://github.com/Lissy93/bug-bounties/issues/new?template=add.yml";

function noResultsHint(q: string) {
  return {
    message:
      "No bug bounty or VDP program matched this query. The company may not have a public program, or it may not yet be listed in this directory.",
    suggestions: [
      {
        action: "lookup",
        description:
          "Search for security contact channels (security.txt, RDAP, DNS, headers, common pages) for this target instead.",
        endpoint: "/api/lookup/website",
        param: "url",
        example: `/api/lookup/website?url=${encodeURIComponent(q)}`,
      },
      {
        action: "submit",
        description:
          "If you know of a program we have not yet listed, submit it to the directory.",
        url: SUBMIT_URL,
      },
    ],
  };
}

function clampInt(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
): number | null {
  if (raw == null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) {
    return null;
  }
  return n;
}

function parseBool(v: string | null): boolean | null | undefined {
  if (v == null) return undefined;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return null;
}

function parseFields(raw: string | null): SearchField[] | null | undefined {
  if (!raw) return undefined;
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return undefined;
  const out: SearchField[] = [];
  for (const p of parts) {
    if (!isSearchField(p)) return null;
    if (!out.includes(p)) out.push(p);
  }
  return out;
}

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  const q = params.get("q")?.trim() ?? "";
  if (!q) return error(400, "Missing 'q' query parameter");
  if (q.length > MAX_Q) return error(400, `'q' must be <= ${MAX_Q} characters`);

  const limit = clampInt(params.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);
  if (limit == null)
    return error(400, `'limit' must be an integer 1-${MAX_LIMIT}`);

  const offset = clampInt(params.get("offset"), 0, 0, MAX_OFFSET);
  if (offset == null)
    return error(400, `'offset' must be an integer 0-${MAX_OFFSET}`);

  const sortRaw = params.get("sort") ?? "relevance";
  if (!VALID_SORTS.has(sortRaw as SortMode)) {
    return error(400, `'sort' must be one of: ${[...VALID_SORTS].join(", ")}`);
  }
  const sort = sortRaw as SortMode;

  const fields = parseFields(params.get("fields"));
  if (fields === null) {
    return error(
      400,
      `'fields' must be a comma list of: ${ALL_FIELDS.join(", ")}`,
    );
  }

  const filters: SearchFilters = {};
  const hasBounty = parseBool(params.get("has_bounty"));
  if (hasBounty === null)
    return error(400, "'has_bounty' must be true or false");
  if (hasBounty !== undefined) filters.hasBounty = hasBounty;

  const managed = parseBool(params.get("managed"));
  if (managed === null) return error(400, "'managed' must be true or false");
  if (managed !== undefined) filters.managed = managed;

  const safeHarbor = params.get("safe_harbor");
  if (safeHarbor) {
    if (safeHarbor !== "full" && safeHarbor !== "partial") {
      return error(400, "'safe_harbor' must be 'full' or 'partial'");
    }
    filters.safeHarbor = safeHarbor;
  }

  const programType = params.get("program_type");
  if (programType) {
    if (!VALID_PROGRAM_TYPES.has(programType)) {
      return error(400, "'program_type' must be 'bounty', 'vdp', or 'hybrid'");
    }
    filters.programType = programType as SearchFilters["programType"];
  }

  const { scored, tokens } = searchPrograms(loadBounties(), {
    q,
    fields,
    sort,
    filters,
  });

  const page = scored
    .slice(offset, offset + limit)
    .map(({ program: p, score, matchedFields }) => ({
      company: p.company,
      slug: p.slug,
      url: p.url,
      handle: p.handle,
      rewards: p.rewards,
      min_payout: p.min_payout,
      max_payout: p.max_payout,
      currency: p.currency,
      safe_harbor: p.safe_harbor,
      managed: p.managed,
      contact: p.contact,
      domains: p.domains,
      program_type: p.program_type,
      score: Math.round(score),
      matched_fields: matchedFields,
    }));

  return json(
    {
      meta: {
        query: q,
        tokens,
        total: scored.length,
        count: page.length,
        limit,
        offset,
        sort,
        generated: new Date().toISOString(),
      },
      results: page,
      ...(scored.length === 0 ? { hint: noResultsHint(q) } : {}),
    },
    200,
    cacheFor(300),
  );
};
