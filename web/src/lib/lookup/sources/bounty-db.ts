import yaml from "js-yaml";
import { getRegistrableDomain, stripWww } from "@lib/domain";
import type {
  LookupSource,
  LookupResult,
  ResolvedDomain,
  ContactInfo,
} from "@lib/lookup/types";
import {
  HOSTING_DOMAINS,
  DOMAIN_ALIASES,
  normalizeName,
} from "@lib/lookup/util";

import platformRaw from "../../../../../platform-programs.yml?raw";
import independentRaw from "../../../../../independent-programs.yml?raw";

interface YamlProgram {
  company: string;
  url: string;
  contact?: string;
  reporting_url?: string;
  pgp_key?: string;
  domains?: string[];
  rewards?: string[];
  safe_harbor?: string;
  program_type?: string;
}

function domainFromUrl(u: string): string | null {
  try {
    return getRegistrableDomain(stripWww(new URL(u).hostname));
  } catch {
    return null;
  }
}

/* `primary` marks a program that owns the domain, as opposed to one that
   merely lists a subdomain of it (an extension on addons.mozilla.org, say) */
interface IndexEntry {
  prog: YamlProgram;
  primary: boolean;
}

let index: Map<string, IndexEntry[]> | null = null;
let programs: YamlProgram[] | null = null;

function load() {
  if (index) return { index, programs: programs! };
  const p =
    (yaml.load(platformRaw) as { companies: YamlProgram[] })?.companies || [];
  const i =
    (yaml.load(independentRaw) as { companies: YamlProgram[] })?.companies ||
    [];
  programs = [...p, ...i].filter((e) => e.company && e.url);
  index = new Map();
  for (const prog of programs) {
    const domains = new Map<string, boolean>();

    /* Platform-hosted programs never name their own domain in the URL, so
       let the company name vouch for it too */
    const named = (registrable: string) => {
      const label = registrable.split(".")[0];
      return (
        label.length >= 3 &&
        normalizeName(prog.company).includes(normalizeName(label))
      );
    };

    const d = domainFromUrl(prog.url);
    if (d && !HOSTING_DOMAINS.has(d)) domains.set(d, true);
    for (const dn of prog.domains || []) {
      try {
        const host = stripWww(dn.replace(/\*\./g, ""));
        const r = getRegistrableDomain(host);
        if (!r.includes(".") || HOSTING_DOMAINS.has(r)) continue;
        domains.set(r, domains.get(r) || host === r || named(r));
      } catch {
        /* skip */
      }
    }
    for (const [domain, primary] of domains) {
      const arr = index.get(domain) || [];
      arr.push({ prog, primary });
      index.set(domain, arr);
    }
  }
  return { index, programs };
}

export const bountyDb: LookupSource = {
  name: "bounty-db",
  tier: 1,
  async execute(ctx: ResolvedDomain): Promise<LookupResult | null> {
    const { index, programs } = load();

    /* Owners answer for the domain; fall back to subdomain-only listings so a
       target whose program never names the apex is still found */
    const owners = (entries: IndexEntry[] = []) => {
      const primary = entries.filter((e) => e.primary);
      return (primary.length ? primary : entries).map((e) => e.prog);
    };

    let matches = owners(index.get(ctx.baseDomain));
    if (!matches.length && ctx.domain !== ctx.baseDomain) {
      matches = owners(index.get(ctx.domain));
    }
    if (!matches.length) {
      const hint = normalizeName(ctx.companyHint);
      const aliases = [hint, ...(DOMAIN_ALIASES[hint] || [])];
      if (hint.length >= 3) {
        matches = programs.filter((p) =>
          aliases.includes(normalizeName(p.company)),
        );
      }
    }
    if (!matches.length) return null;

    const contacts: ContactInfo[] = [];
    const meta: Record<string, unknown>[] = [];

    for (const m of matches) {
      if (m.contact) {
        const cleaned = m.contact.replace(/^(mail\w*:)+/gi, "");
        const isEmail = cleaned.includes("@") && !cleaned.startsWith("http");
        contacts.push({
          type: isEmail ? "email" : "url",
          value: cleaned,
          label: `${m.company} - Bug bounty program contact`,
        });
      }
      if (m.reporting_url) {
        contacts.push({
          type: "url",
          value: m.reporting_url,
          label: `${m.company} - Report submission`,
        });
      }
      if (!m.contact && !m.reporting_url) {
        contacts.push({
          type: "url",
          value: m.url,
          label: `${m.company} - Program page`,
        });
      }
      if (m.pgp_key) {
        contacts.push({ type: "pgp_key", value: m.pgp_key, label: "PGP key" });
      }
      meta.push({
        company: m.company,
        url: m.url,
        safe_harbor: m.safe_harbor,
        rewards: m.rewards,
        program_type: m.program_type,
      });
    }

    return {
      source: "bounty-db",
      tier: 1,
      url: matches[0].url,
      contacts,
      metadata: { programs: meta },
    };
  },
};
