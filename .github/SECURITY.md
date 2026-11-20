# Security


> [!NOTE]
> This repo is a public, community-maintained list of companies that run bug bounty or responsible disclosure programs. It's just a directory of other programs, and **not a program itself**.<br>
> There's no user accounts nor personal data collected or stored, no database, and no write actions. There's no access control, nor rate-limiting, we just use default Cloudflare setup. If you wish to pen-test anything, you must fork and deploy your own instance, and not use our public site. We receive a lot of low-quality AI reports, so please ensure you've read the security policy before submitting.

## Reporting a security issue

Please report it privately, either:
- Open a [security advisory](https://github.com/lissy93/bug-bounties/security/advisories/new) here on GitHub
- Or email me at `security@as93.net`, PGP [`E10EE533A8E5D6F6E231BBCD4C8DEAFFCE3B8D03`](https://keys.openpgp.org/vks/v1/by-fingerprint/E10EE533A8E5D6F6E231BBCD4C8DEAFFCE3B8D03)

## Out of Scope

Activity in the following areas is prohibited, and any reports will be closed without a response.

### Prohibited testing
- Any testing against the live site, API or MCP server at `bug-bounties.as93.net`. Run the project locally instead
- Denial of service, load testing, or anything else that degrades availability
- Testing rate limits, brute-forcing, fuzzing or running automated scanners against production
- Opening, editing or commenting on issues, PRs or discussions to test the repo or its GitHub Actions workflows. Test on your own fork instead
- Submitting fake, test or spam programs through the issue templates, the submit form or the `submit-anonymous` API
- Social engineering or phishing of maintainers or contributors
- Accessing, changing or deleting other people's data or accounts

### Third parties
- The companies and programs listed in this repo. Report those to the program itself using the link in its listing
- Services this project uses (GitHub, Vercel, npm, Docker Hub, icon.horse, gitgost etc). Report to their own security programs
- Vulnerable dependencies with no proven, exploitable impact on this project (eg. raw `npm audit` or Dependabot output)

### Low or no impact findings
- Wrong, outdated or broken program listings. Open a normal issue or PR instead
- Missing or weak rate limiting
- Missing security headers or cookie flags (CSP, HSTS, X-Frame-Options, etc) without a working exploit
- Clickjacking on pages that have no sensitive actions
- CSRF on unauthenticated or no-impact forms
- Permissive CORS on public, read-only API endpoints
- Access to public data. The program list and API are public by design
- SPF, DKIM or DMARC configuration
- TLS/SSL configuration or cipher suite issues
- Version or software disclosure, banners, or verbose errors that leak nothing sensitive
- Self-XSS, or any attack that needs the victim to paste code or already have a compromised device
- Open redirects with no further impact
- Content spoofing, text injection or reverse tabnabbing
- Theoretical issues with no proof of concept
- Unverified output from automated scanners or AI tools

## Report Requirements

Reports that don't meet all of these will be closed without a response:
- Reproduced on a local copy or your own fork, never on production
- Includes clear steps to reproduce and a working proof of concept
- Explains the real-world impact
- Written and verified by you, not pasted from a scanner or AI tool
- Sent privately as a GitHub advisory (or email), not as a public issue or PR

> [!IMPORTANT]
> Due to an influx of low-quality and invalid reports recently, we're no longer accepting AI reports.
