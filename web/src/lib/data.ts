import yaml from "js-yaml";
import { slugify, resetSlugs } from "./slugify";
import type { BountyProgram } from "@app-types/Company";

import platformRaw from "../../../platform-programs.yml?raw";
import independentRaw from "../../../independent-programs.yml?raw";

let cached: BountyProgram[] | null = null;

export function loadBounties(): BountyProgram[] {
  if (cached) return cached;

  const platformParsed = yaml.load(platformRaw) as {
    companies: Record<string, unknown>[];
  };

  let allCompanies = platformParsed.companies || [];

  const independentParsed = yaml.load(independentRaw) as {
    companies: Record<string, unknown>[];
  };
  if (independentParsed?.companies) {
    allCompanies = allCompanies.concat(independentParsed.companies);
  }

  resetSlugs();

  cached = allCompanies
    .filter((entry) => {
      if (!entry.company || typeof entry.company !== "string") return false;
      if (!entry.url || typeof entry.url !== "string") return false;
      try {
        new URL(entry.url as string);
      } catch {
        return false;
      }
      return true;
    })
    .map((entry) => ({
      ...entry,
      slug: slugify(entry.company as string),
    })) as BountyProgram[];

  return cached;
}
