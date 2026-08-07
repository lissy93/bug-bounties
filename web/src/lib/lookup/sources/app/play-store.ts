import type { AppLookupSource, ContactInfo } from "@lib/lookup/types";
import {
  safeFetch,
  EMAIL_RE,
  decodeGoogleRedirect,
  buildResult,
} from "@lib/lookup/util";

export const playStore: AppLookupSource = {
  name: "play-store",
  tier: 1,
  async execute(ctx, signal) {
    if (ctx.store !== "play") return null;

    const res = await safeFetch(
      `https://play.google.com/store/apps/details?id=${ctx.packageId}&hl=en&gl=US`,
      signal,
    );
    if (!res) return null;

    const html = await res.text();
    if (html.length > 2_000_000) return null;

    const contacts: ContactInfo[] = [];
    const metadata: Record<string, unknown> = {};

    /* Developer name. The id in the href is a numeric account id for many
       publishers, so read the text from the span inside the anchor */
    const devNameMatch = html.match(
      /href="\/store\/apps\/dev(?:eloper)?\?id=[^"]*"[^>]*>\s*<span[^>]*>([^<]+)/,
    );
    if (devNameMatch) metadata.developer = devNameMatch[1].trim();

    /* Developer email - use frequency analysis to pick the real one.
       The developer email appears multiple times in structured data
       while "similar apps" emails appear once. */
    const emailMatches = html.match(EMAIL_RE);
    if (emailMatches) {
      const freq = new Map<string, number>();
      for (const email of emailMatches) {
        const lower = email.toLowerCase();
        if (lower.endsWith("@google.com") || lower.endsWith("@email.com"))
          continue;
        freq.set(lower, (freq.get(lower) || 0) + 1);
      }
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        contacts.push({
          type: "email",
          value: sorted[0][0],
          label: "Play Store developer email",
        });
      }
    }

    /* Google's own chrome links carry the same visible text, so anchor on the
       aria-label the store only puts on the app's developer-contact links */
    const devLink = (label: string): string | null => {
      const m = html.match(
        new RegExp(`href="(https?://[^"]+)"[^>]*aria-label="${label} `, "i"),
      );
      return m ? decodeGoogleRedirect(m[1]) : null;
    };

    const devWebsite = devLink("Website");
    if (devWebsite) {
      contacts.push({
        type: "url",
        value: devWebsite,
        label: "Developer website",
      });
      metadata.developerWebsite = devWebsite;
    }

    const privacyPolicy = devLink("Privacy Policy");
    if (privacyPolicy) metadata.privacyPolicy = privacyPolicy;

    return buildResult("play-store", 1, contacts, ctx.storeUrl, metadata);
  },
};
