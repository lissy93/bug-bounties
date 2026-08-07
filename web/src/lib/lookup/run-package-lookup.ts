import { log } from "@lib/log";
import { runPackageLookup, runLookup } from "./runner";
import { resolveDomain } from "./resolve-domain";
import { runFullGitHubLookup } from "./run-github-lookup";
import { runFullForgeLookup } from "./run-forge-lookup";
import { resolveForgeFromUrl } from "./resolve-forge-repo";
import { resolveRepo } from "./resolve-repo";
import { pkgTier1, pkgTier2, pkgSkipT2Only } from "./package-tiers";
import { webTier1, webTier2 } from "./website-tiers";
import type {
  ResolvedPackage,
  LookupResponse,
  LookupResult,
  SummaryStatus,
} from "./types";

const GITHUB_RE = /github\.com\/([^/\s]+)\/([^/\s#?.]+)/;

const SKIP_HOMEPAGE_HOSTS = new Set([
  "github.com",
  "gitlab.com",
  "codeberg.org",
  "crates.io",
  "npmjs.com",
  "pypi.org",
  "docs.rs",
  "readthedocs.io",
  "readthedocs.org",
]);

function isUsableHomepage(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !SKIP_HOMEPAGE_HOSTS.has(host);
  } catch {
    return false;
  }
}

/* Better-known statuses win when the same check is merged twice */
const STATUS_RANK: Record<SummaryStatus, number> = {
  found: 4,
  partial: 3,
  missing: 2,
  error: 1,
  skipped: 0,
};

const resultKey = (r: LookupResult) =>
  `${r.source}|${r.url ?? ""}|${JSON.stringify(r.contacts)}`;

/* The repo and the homepage often resolve to the same site, so a plain concat
   would repeat whole blocks of website checks */
function mergeResponse(target: LookupResponse, source: LookupResponse): void {
  const seen = new Set(target.results.map(resultKey));
  for (const r of source.results) {
    const key = resultKey(r);
    if (seen.has(key)) continue;
    seen.add(key);
    target.results.push(r);
  }

  target.errors.push(...source.errors);

  for (const s of source.summary) {
    const at = target.summary.findIndex((t) => t.item === s.item);
    if (at < 0) target.summary.push(s);
    else if (STATUS_RANK[s.status] > STATUS_RANK[target.summary[at].status])
      target.summary[at] = s;
  }
}

/** Extract repository and homepage URLs from source result metadata. */
function extractLinksFromResults(data: LookupResponse): {
  repository: string | null;
  homepage: string | null;
} {
  let repository: string | null = null;
  let homepage: string | null = null;

  for (const r of data.results) {
    const meta = r.metadata as Record<string, unknown> | undefined;
    if (!meta) continue;
    if (!repository && meta.repository) {
      repository = String(meta.repository)
        .replace(/^git\+/, "")
        .replace(/\.git$/, "");
    }
    if (!homepage && meta.homepage) homepage = String(meta.homepage);
    if (repository && homepage) break;
  }

  return { repository, homepage };
}

export async function runFullPackageLookup(
  ctx: ResolvedPackage,
  deep = false,
): Promise<LookupResponse> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20_000);

  try {
    const data = await runPackageLookup(
      ctx,
      pkgTier1,
      pkgTier2,
      pkgSkipT2Only,
      deep,
    );

    const { repository, homepage } = extractLinksFromResults(data);

    /* Run the linked repository through the appropriate lookup pipeline */
    if (repository) {
      try {
        /* Registry metadata is third-party, so validate it like user input */
        if (GITHUB_RE.test(repository)) {
          const gh = resolveRepo(repository);
          mergeResponse(
            data,
            await runFullGitHubLookup(gh.owner, gh.repo, deep),
          );
        } else {
          const forgeCtx = resolveForgeFromUrl(repository);
          if (forgeCtx) {
            mergeResponse(data, await runFullForgeLookup(forgeCtx, deep));
          }
        }
      } catch (err) {
        log.warn("package-lookup", `Repo lookup failed for ${repository}`, err);
      }
    }

    /* Run website lookup against the homepage if it's not a repo host */
    if (homepage && isUsableHomepage(homepage)) {
      try {
        const domainCtx = await resolveDomain(homepage);
        mergeResponse(
          data,
          await runLookup(domainCtx, webTier1, webTier2, deep),
        );
      } catch (err) {
        log.warn(
          "package-lookup",
          `Homepage lookup failed for ${homepage}`,
          err,
        );
      }
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}
