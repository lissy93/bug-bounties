import type { BountyProgram } from "@app-types/Company";
import {
  getRegistrableDomain,
  isPlatformHost,
  registrableLabel,
  stripWww,
} from "@lib/domain";
import { normalize, tokenize } from "./tokens";
import { fuzzyThreshold, levenshtein } from "./levenshtein";

export type SearchField =
  | "company"
  | "handle"
  | "slug"
  | "domains"
  | "description"
  | "notes"
  | "url"
  | "standards"
  | "scope";

const FIELD_WEIGHTS: Record<SearchField, number> = {
  company: 1.0,
  handle: 0.9,
  slug: 0.8,
  domains: 0.7,
  description: 0.45,
  notes: 0.4,
  url: 0.3,
  standards: 0.3,
  scope: 0.3,
};

export const ALL_FIELDS: SearchField[] = Object.keys(
  FIELD_WEIGHTS,
) as SearchField[];

const IDENTITY_FIELDS: SearchField[] = ["company", "slug", "handle", "url"];

export function isSearchField(v: string): v is SearchField {
  return Object.hasOwn(FIELD_WEIGHTS, v);
}

interface FieldEntry {
  raw: string;
  tokens: string[];
}

export interface PreparedProgram {
  program: BountyProgram;
  fields: Partial<Record<SearchField, FieldEntry[]>>;
}

const NULL_OR_EMPTY = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

function entries(values: (string | undefined | null)[]): FieldEntry[] {
  return values
    .filter(NULL_OR_EMPTY)
    .map((v) => ({ raw: normalize(v), tokens: tokenize(v) }));
}

/* Separate from PLATFORM_HOSTNAMES, which logo and enrichment still need */
const SHARED_HOSTS = new Set(["zendesk.com", "responsibledisclosure.com"]);

/* Shared hosts name the host, not the company, so index nothing */
function urlLabel(url: string): string | null {
  let host: string;
  try {
    host = stripWww(new URL(url).hostname);
  } catch {
    return null;
  }
  if (isPlatformHost(host)) return null;
  if (SHARED_HOSTS.has(getRegistrableDomain(host))) return null;
  return registrableLabel(host);
}

function prepareOne(p: BountyProgram): PreparedProgram {
  const fields: Partial<Record<SearchField, FieldEntry[]>> = {};
  fields.company = entries([p.company]);
  if (p.handle) fields.handle = entries([p.handle]);
  fields.slug = entries([p.slug]);
  const label = urlLabel(p.url);
  if (label) fields.url = entries([label]);
  if (p.domains?.length) fields.domains = entries(p.domains);
  if (p.description) fields.description = entries([p.description]);
  if (p.notes) fields.notes = entries([p.notes]);
  if (p.standards?.length) fields.standards = entries(p.standards);
  if (p.scope?.length) {
    fields.scope = entries(p.scope.map((s) => s.target));
  }
  return { program: p, fields };
}

let cacheKey: BountyProgram[] | null = null;
let cacheValue: PreparedProgram[] | null = null;

export function prepare(programs: BountyProgram[]): PreparedProgram[] {
  if (programs === cacheKey && cacheValue) return cacheValue;
  cacheKey = programs;
  cacheValue = programs.map(prepareOne);
  return cacheValue;
}

function scoreToken(token: string, entry: FieldEntry): number {
  if (!entry.raw) return 0;
  if (entry.raw === token) return 100;
  if (entry.tokens.includes(token)) return 60;
  if (entry.raw.startsWith(token)) return 50;
  if (entry.raw.includes(token)) return 25;

  const max = fuzzyThreshold(token.length);
  if (max === 0) return 0;
  let best = max + 1;
  for (const t of entry.tokens) {
    if (Math.abs(t.length - token.length) > max) continue;
    const d = levenshtein(token, t, max);
    if (d < best) {
      best = d;
      if (best === 1) break;
    }
  }
  if (best > max) return 0;
  return Math.max(0, 20 - best * 5);
}

export interface ScoredProgram {
  program: BountyProgram;
  score: number;
  matchedFields: SearchField[];
}

export function scoreProgram(
  pp: PreparedProgram,
  queryTokens: string[],
  normalizedQuery: string,
  fields: SearchField[],
): ScoredProgram | null {
  if (!queryTokens.length) return null;
  const matched = new Set<SearchField>();
  let total = 0;

  for (const tok of queryTokens) {
    let bestPoints = 0;
    let bestField: SearchField | null = null;
    for (const field of fields) {
      const list = pp.fields[field];
      if (!Array.isArray(list)) continue;
      const w = FIELD_WEIGHTS[field];
      for (const entry of list) {
        const pts = scoreToken(tok, entry) * w;
        if (pts > bestPoints) {
          bestPoints = pts;
          bestField = field;
        }
      }
    }
    if (bestPoints === 0) return null;
    total += bestPoints;
    if (bestField) matched.add(bestField);
  }

  /* Keeps "Crypto.com" above "Crypto" after the TLD is dropped. Identity
     fields only: one of 25 scope domains must not outrank a company's name */
  let exact = 0;
  for (const field of IDENTITY_FIELDS) {
    if (!fields.includes(field)) continue;
    const list = pp.fields[field];
    if (list?.some((e) => e.raw === normalizedQuery)) {
      exact = Math.max(exact, 100 * FIELD_WEIGHTS[field]);
    }
  }
  total += exact;

  if (normalizedQuery.includes(" ")) {
    const company = pp.fields.company?.[0];
    if (company?.raw.includes(normalizedQuery)) total += 30;
  }

  return { program: pp.program, score: total, matchedFields: [...matched] };
}
