import { lookup } from "node:dns/promises";
import { getRegistrableDomain, stripWww } from "@lib/domain";
import type { ResolvedDomain } from "./types";

const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^0\./,
  /^::1$/,
  /^f[cd]/i,
  /^fe80:/i,
];

function isPrivateAddress(addr: string): boolean {
  const ip = addr.replace(/^::ffff:/i, "");
  return PRIVATE_RANGES.some((r) => r.test(ip));
}

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

  const hostname = url.hostname;
  if (!hostname.includes(".")) throw new Error("Invalid hostname");

  /* Resolving first also normalises IP literals written in octal, decimal or
     IPv4-mapped form, which a textual check on the hostname would miss */
  const addresses = await lookup(hostname, { all: true }).catch(() => []);
  if (!addresses.length) throw new Error("Could not resolve hostname");
  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Private/reserved addresses are not allowed");
  }

  const clean = stripWww(hostname);
  const baseDomain = getRegistrableDomain(clean);
  const companyHint = baseDomain.split(".")[0].toLowerCase();

  return { domain: clean, baseDomain, companyHint };
}
