import { registrableLabel } from "@lib/domain";

const DIACRITICS = /\p{Diacritic}/gu;
const DOMAIN_LIKE =
  /^(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?:[/:?#].*)?$/i;

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(DIACRITICS, "");
}

export function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/* Every token must match, so a TLD would exclude everything: "google.com" -> "google" */
export function tokenizeQuery(q: string): string[] {
  return q
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((term) => {
      const host = DOMAIN_LIKE.exec(term)?.[1];
      return tokenize(host ? registrableLabel(host) : term);
    });
}
