import { lookup } from "node:dns/promises";
import { getRegistrableDomain, stripWww } from "@lib/domain";
import { isPrivateAddress } from "./guarded-fetch";
import type { ResolvedDomain } from "./types";

export async function resolveDomain(input: string): Promise<ResolvedDomain> {
  let raw = input.trim();
  if (!raw) throw new Error("Empty input");

  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only http/https URLs are allowed");
  }

  /* Trailing dots are valid in DNS but break registrable-domain parsing */
  const hostname = url.hostname.replace(/\.$/, "");
  if (!hostname.includes(".")) throw new Error("Invalid hostname");

  const clean = stripWww(hostname);
  const baseDomain = getRegistrableDomain(clean);

  /* Resolving first also normalises IP literals written in octal, decimal or
     IPv4-mapped form, which a textual check on the hostname would miss */
  const addresses = await lookup(hostname, { all: true }).catch(() => []);
  if (!addresses.length) throw new Error("Could not resolve hostname");

  /* Sources fetch clean and baseDomain too, so those must also be checked */
  const derived = await Promise.all(
    [...new Set([clean, baseDomain])]
      .filter((h) => h !== hostname)
      .map((h) => lookup(h, { all: true }).catch(() => [])),
  );
  for (const { address } of [addresses, ...derived].flat()) {
    if (isPrivateAddress(address)) {
      throw new Error("Private/reserved addresses are not allowed");
    }
  }

  const companyHint = baseDomain.split(".")[0].toLowerCase();

  return { domain: clean, baseDomain, companyHint };
}
