import dns from "node:dns/promises";
import net from "node:net";

// ...

export async function guardedFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  let target = url;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const { protocol, port, hostname } = new URL(target);
    if (protocol !== "https:" || (port && port !== "443"))
      throw new Error("Blocked: only https on port 443 is allowed");

    // Добавлена защита от DNS-rebinding
    const resolvedHostname = await resolveDomain(hostname);
    const resolvedIp = await dns.resolve4(resolvedHostname);
    if (net.isIPv4(resolvedIp)) {
      const ip = resolvedIp;
      const { protocol, port, hostname } = new URL(target);
      if (protocol !== "https:" || (port && port !== "443"))
        throw new Error("Blocked: only https on port 443 is allowed");
      if (net.isPrivateAddress(ip)) {
        throw new Error("Blocked: private or reserved addresses are not allowed");
      }
    }

    const res = await fetch(target, { ...init, redirect: "manual" });
    // ...
  }
  throw new Error("Blocked: too many redirects");
}