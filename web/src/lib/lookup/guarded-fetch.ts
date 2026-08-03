import dns from "node:dns/promises";
import net from "node:net";

const MAX_REDIRECTS = 5;
const CACHE_TTL_MS = 300_000;
const MAPPED_V6 = /^::ffff:([\da-f]{1,4}):([\da-f]{1,4})$/;

/* URL rewrites ::ffff:127.0.0.1 to its hex form, so put it back */
function unmap(addr: string): string {
  const hex = MAPPED_V6.exec(addr);
  if (!hex) return addr.startsWith("::ffff:") ? addr.slice(7) : addr;
  const [h, l] = hex.slice(1).map((x) => parseInt(x, 16));
  return [h >> 8, h & 255, l >> 8, l & 255].join(".");
}

export function isPrivateAddress(ip: string): boolean {
  const v4 = unmap(ip.toLowerCase().split("%")[0]);
  if (net.isIPv4(v4)) {
    const [a, b, c] = v4.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b < 128) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b < 32) ||
      (a === 192 && (b === 168 || (b === 0 && c === 0))) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  /* Bare :: is a no-IPv6 placeholder plenty of live domains publish */
  return (v4 !== "::" && v4.startsWith("::")) || /^f[cd]|^fe[89ab]/.test(v4);
}

/* Resolve over DNS, falling back to the system resolver for local-only names */
async function addressesFor(name: string): Promise<string[]> {
  const settled = await Promise.allSettled([
    dns.resolve4(name),
    dns.resolve6(name),
  ]);
  const addrs = settled.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  return addrs.length
    ? addrs
    : (await dns.lookup(name, { all: true })).map((a) => a.address);
}

async function resolvesPublic(name: string): Promise<boolean> {
  try {
    const found = net.isIP(name) ? [name] : await addressesFor(name);
    const addrs = found.filter((a) => a !== "::");
    return !!addrs.length && !addrs.some(isPrivateAddress);
  } catch {
    return false;
  }
}

/* Successful lookups, cached briefly; at = 0 marks one as stale */
const hostCache = new Map<string, { at: number; pub: Promise<boolean> }>();

export function isPublicHost(host: string): Promise<boolean> {
  const name = host.replace(/^\[|\]$/g, "");
  const hit = hostCache.get(name);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.pub;
  if (hostCache.size > 5000) hostCache.clear();
  const entry = { at: Date.now(), pub: resolvesPublic(name) };
  hostCache.set(name, entry);
  void entry.pub.then((pub) => {
    if (!pub) entry.at = 0;
  });
  return entry.pub;
}

/* Follows redirects manually, re-checking any host the chain moves to.
   The starting host is the caller's to vet, via resolveDomain */
export async function guardedFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  let target = url;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const { protocol, port, hostname } = new URL(target);
    if (protocol !== "https:" || (port && port !== "443"))
      throw new Error("Blocked: only https on port 443 is allowed");
    const res = await fetch(target, { ...init, redirect: "manual" });
    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) return res;
    await res.body?.cancel().catch(() => {});
    const next = new URL(location, target);
    if (next.hostname !== hostname && !(await isPublicHost(next.hostname)))
      throw new Error("Blocked: private or unresolvable redirect target");
    target = next.href;
  }
  throw new Error("Blocked: too many redirects");
}
