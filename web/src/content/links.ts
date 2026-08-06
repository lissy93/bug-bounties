export interface LinkItem {
  title: string;
  url: string;
  description: string;
  /** Optional secondary line shown between title and description. */
  subtitle?: string;
  /** Optional icon URL. Lists without one can opt into auto favicons. */
  icon?: string;
  /** Target-aware link template, using {URL}, {URL_ENCODED} or {DOMAIN}. */
  searchLink?: string;
}

export const learningResources: LinkItem[] = [
  {
    title: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    description:
      "Free, interactive labs and learning paths covering every common web vulnerability class",
  },
  {
    title: "Hacker101",
    url: "https://www.hacker101.com/",
    description:
      "HackerOne's free training videos and CTF challenges, aimed squarely at bug bounty hunters",
  },
  {
    title: "Bugcrowd University",
    url: "https://www.bugcrowd.com/hackers/bugcrowd-university/",
    description:
      "Bug hunting methodology modules and webinars from the Bugcrowd team",
  },
  {
    title: "Hack The Box Academy",
    url: "https://academy.hackthebox.com/",
    description:
      "Structured offensive security courses with hands-on labs and certifications",
  },
  {
    title: "TryHackMe",
    url: "https://tryhackme.com/",
    description:
      "Gamified rooms and guided learning paths covering everything from beginner to advanced topics",
  },
  {
    title: "PentesterLab",
    url: "https://pentesterlab.com/",
    description:
      "Hands-on exercises focused on real-world web vulnerabilities and CVE recreations",
  },
  {
    title: "pwn.college",
    url: "https://pwn.college/",
    description:
      "Free, university-grade binary exploitation and systems security course from ASU, with hands-on dojos",
  },
  {
    title: "picoCTF",
    url: "https://picoctf.org/",
    description:
      "Carnegie Mellon's beginner CTF platform, free to play year round with a deep archive of past challenges",
  },
  {
    title: "OWASP WebGoat",
    url: "https://owasp.org/www-project-webgoat/",
    description:
      "Deliberately insecure web app you can run locally to practice exploitation safely",
  },
  {
    title: "OWASP Juice Shop",
    url: "https://owasp.org/www-project-juice-shop/",
    description:
      "Modern, intentionally vulnerable JavaScript app with dozens of challenges across all OWASP categories",
  },
  {
    title: "VulnHub",
    url: "https://www.vulnhub.com/",
    description:
      "Downloadable vulnerable VMs you can attack offline, great for practicing without an account",
  },
  {
    title: "OverTheWire",
    url: "https://overthewire.org/wargames/",
    description:
      "Classic wargames teaching command line, networking, and exploitation fundamentals",
  },
  {
    title: "Root-Me",
    url: "https://www.root-me.org/",
    description:
      "Hundreds of free challenges across web, crypto, forensics, and reverse engineering",
  },
  {
    title: "HackerOne Hacktivity",
    url: "https://hackerone.com/hacktivity",
    description:
      "Stream of disclosed bug bounty reports, the single best resource for learning what real bugs look like",
  },
  {
    title: "Pentester Land Newsletter",
    url: "https://pentester.land/newsletter.html",
    description:
      "Weekly roundup of bug bounty writeups, new tooling, and conference talks",
  },
  {
    title: "tl;dr sec",
    url: "https://tldrsec.com/",
    description:
      "Clint Gibler's weekly application security newsletter, the best single source for keeping up with appsec",
  },
  {
    title: "PortSwigger Research",
    url: "https://portswigger.net/research",
    description:
      "Original web security research from the team behind Burp Suite, often introducing entire bug classes",
  },
  {
    title: "NahamSec",
    url: "https://www.youtube.com/@NahamSec",
    description:
      "Live bug bounty hunting sessions, interviews, and beginner-friendly walkthroughs on YouTube",
  },
  {
    title: "IppSec",
    url: "https://www.youtube.com/@ippsec",
    description:
      "In-depth Hack The Box machine walkthroughs, an unmatched library for learning offensive technique",
  },
  {
    title: "LiveOverflow",
    url: "https://www.youtube.com/@LiveOverflow",
    description:
      "Long-form videos digging into how vulnerabilities and exploits actually work under the hood",
  },
  {
    title: "John Hammond",
    url: "https://www.youtube.com/@_JohnHammond",
    description:
      "CTF walkthroughs, malware analysis, and tooling demos on one of the most watched security channels on YouTube",
  },
  {
    title: "TCM Security",
    url: "https://www.youtube.com/@TCMSecurityAcademy",
    description:
      "Heath Adams' free tutorials covering pentesting fundamentals, OSINT, and Active Directory",
  },
];

export const coolStuff: LinkItem[] = [
  {
    title: "HackTricks",
    url: "https://book.hacktricks.wiki/",
    description:
      "Carlos Polop's pentesting wiki, the closest thing to a single reference for web, cloud, and AD attack technique",
  },
  {
    title: "PayloadsAllTheThings",
    url: "https://github.com/swisskyrepo/PayloadsAllTheThings",
    description:
      "The de facto reference for web attack payloads, bypasses, and exploitation tricks, organized by bug class",
  },
  {
    title: "SecLists",
    url: "https://github.com/danielmiessler/SecLists",
    description:
      "The standard wordlist collection for content discovery, fuzzing, brute forcing, and password attacks",
  },
  {
    title: "GTFOBins",
    url: "https://gtfobins.github.io/",
    description:
      "Curated index of Unix binaries that can be abused for privilege escalation and shell escapes",
  },
  {
    title: "LOLBAS",
    url: "https://lolbas-project.github.io/",
    description:
      "The Windows equivalent of GTFOBins, mapping built-in binaries to their offensive uses",
  },
  {
    title: "OWASP Cheat Sheet Series",
    url: "https://cheatsheetseries.owasp.org/",
    description:
      "Concise, scannable reference cards for both attackers and defenders, covering specific vulnerability classes",
  },
  {
    title: "OWASP Top 10",
    url: "https://owasp.org/Top10/",
    description:
      "The canonical reference list of the most critical web application security risks, with examples and prevention notes",
  },
  {
    title: "CWE Top 25",
    url: "https://cwe.mitre.org/top25/",
    description:
      "MITRE's annual ranking of the most dangerous software weaknesses, useful as a lookup index",
  },
  {
    title: "Hacking the Cloud",
    url: "https://hackingthe.cloud/",
    description:
      "Encyclopedic reference of offensive cloud security techniques across AWS, Azure, and GCP",
  },
  {
    title: "Exploit-DB",
    url: "https://www.exploit-db.com/",
    description:
      "OffSec's public exploit archive, the canonical place to find and verify proof-of-concept code",
  },
  {
    title: "CVE.org",
    url: "https://www.cve.org/",
    description:
      "The official CVE program site, the source of truth for tracking publicly disclosed vulnerabilities",
  },
  {
    title: "OSINT Framework",
    url: "https://osintframework.com/",
    description:
      "Long-running tree of OSINT tools and resources, organized by what you are trying to find",
  },
  {
    title: "CTFtime",
    url: "https://ctftime.org/",
    description:
      "The hub for finding upcoming CTFs, browsing past challenges, and reading writeups from competing teams",
  },
];

export const youtubers: LinkItem[] = [
  {
    title: "IppSec",
    subtitle: "HackTheBox walkthroughs",
    url: "https://www.youtube.com/@ippsec",
    description:
      "Weekly, methodical walkthroughs of retired HackTheBox machines, focused on real methodology rather than just the solution",
  },
  {
    title: "LiveOverflow",
    subtitle: "Fabian Faessler",
    url: "https://www.youtube.com/@LiveOverflow",
    description:
      "Long-form, research-driven deep dives into exploitation techniques and vulnerability classes for people who want to understand why things work",
  },
  {
    title: "NahamSec",
    subtitle: "Ben Sadeghipour",
    url: "https://www.youtube.com/@NahamSec",
    description:
      "Live bug bounty hunting sessions, recon tips, and interviews with top hackers from the founder of NahamCon",
  },
  {
    title: "John Hammond",
    subtitle: "Huntress security researcher",
    url: "https://www.youtube.com/@_JohnHammond",
    description:
      "Near-daily CTF walkthroughs, live malware analysis, and breakdowns of real incidents from a Huntress threat researcher",
  },
  {
    title: "The Cyber Mentor",
    subtitle: "Heath Adams (TCM Security)",
    url: "https://www.youtube.com/@TCMSecurityAcademy",
    description:
      "Practical pentesting tutorials, Active Directory attacks, and career advice from one of the most trusted voices in entry-level offensive security",
  },
  {
    title: "InsiderPhD",
    subtitle: "Dr. Katie Paxton-Fear",
    url: "https://www.youtube.com/@InsiderPhD",
    description:
      "Beginner-friendly bug bounty tutorials and API hacking research from an academic and active HackerOne hunter",
  },
  {
    title: "Farah Hawa",
    subtitle: "AppSec engineer and bug bounty hunter",
    url: "https://www.youtube.com/@FarahHawa",
    description:
      "Clear, concept-first explanations of web vulnerability classes, OAuth/JWT flaws, and bug bounty workflows",
  },
  {
    title: "Low Level",
    subtitle: "Formerly LowLevelLearning",
    url: "https://www.youtube.com/@LowLevelTV",
    description:
      "Short, focused explainers on memory corruption, CPU internals, and low-level security bugs",
  },
  {
    title: "LaurieWired",
    subtitle: "Reverse engineering and malware",
    url: "https://www.youtube.com/@LaurieWired",
    description:
      "Reverse engineering, malware internals, and low-level systems explainers from one of the fastest-growing security channels",
  },
  {
    title: "13Cubed",
    subtitle: "Richard Davis (DFIR)",
    url: "https://www.youtube.com/@13Cubed",
    description:
      "Best-in-class digital forensics and incident response education, with a strong focus on Windows artifacts",
  },
  {
    title: "SimplyCyber",
    subtitle: "Gerald Auger",
    url: "https://www.youtube.com/@SimplyCyber",
    description:
      "Daily cybersecurity news, defender-focused content, and career guidance from a working CISO",
  },
  {
    title: "DEF CON Conference",
    subtitle: "Official channel",
    url: "https://www.youtube.com/@DEFCONConference",
    description:
      "The official archive of DEF CON talks, where much of the most influential offensive research of the year gets published for free",
  },
  {
    title: "Black Hat",
    subtitle: "Official briefings",
    url: "https://www.youtube.com/@BlackHatOfficialYT",
    description:
      "Full-length briefings from Black Hat USA, Europe, and Asia covering cutting-edge vulnerability research and defensive engineering",
  },
];

export const securityResearchers: LinkItem[] = [
  {
    title: "Bruce Schneier",
    subtitle: "Schneier on Security",
    url: "https://www.schneier.com/",
    description:
      "Cryptographer, author, and one of the longest-running voices in security policy and applied cryptography",
  },
  {
    title: "Brian Krebs",
    subtitle: "Krebs on Security",
    url: "https://krebsonsecurity.com/",
    description:
      "Investigative cybercrime journalist, consistently first to break major breach and threat actor stories",
  },
  {
    title: "Troy Hunt",
    subtitle: "troyhunt.com",
    url: "https://www.troyhunt.com/",
    description:
      "Founder of Have I Been Pwned, writes prolifically on web security, breach disclosure, and password hygiene",
  },
  {
    title: "Matthew Green",
    subtitle: "A Few Thoughts on Cryptographic Engineering",
    url: "https://blog.cryptographyengineering.com/",
    description:
      "Cryptography professor at Johns Hopkins, known for accessible deep dives on real-world crypto failures",
  },
  {
    title: "Filippo Valsorda",
    subtitle: "filippo.io",
    url: "https://filippo.io/",
    description:
      "Cryptographer and former Go security lead, writes about applied cryptography and protocol design",
  },
  {
    title: "Daniel Miessler",
    subtitle: "danielmiessler.com",
    url: "https://danielmiessler.com/",
    description:
      "Long-running security blog and Unsupervised Learning newsletter covering offensive security and AI security",
  },
  {
    title: "Marcus Hutchins",
    subtitle: "MalwareTech",
    url: "https://www.malwaretech.com/",
    description:
      "Reverse engineer best known for stopping WannaCry, writes detailed malware analysis and exploitation posts",
  },
  {
    title: "Tavis Ormandy",
    subtitle: "lock.cmpxchg8b.com",
    url: "https://lock.cmpxchg8b.com/",
    description:
      "Google Project Zero researcher with a track record of finding critical bugs in widely deployed software",
  },
  {
    title: "Orange Tsai",
    subtitle: "blog.orange.tw",
    url: "https://blog.orange.tw/",
    description:
      "Offensive researcher behind ProxyLogon, ProxyShell, and a string of other landmark Microsoft Exchange findings",
  },
  {
    title: "Mathy Vanhoef",
    subtitle: "mathyvanhoef.com",
    url: "https://www.mathyvanhoef.com/",
    description:
      "Academic security researcher who discovered KRACK, FragAttacks, and other foundational Wi-Fi vulnerabilities",
  },
  {
    title: "Mikko Hyppönen",
    subtitle: "mikko.hypponen.com",
    url: "https://mikko.hypponen.com/",
    description:
      "Long-time malware researcher and Chief Research Officer at WithSecure, writes on threat landscape trends",
  },
  {
    title: "Google Project Zero",
    subtitle: "Project Zero Blog",
    url: "https://googleprojectzero.blogspot.com/",
    description:
      "Google's elite vulnerability research team, publishing technical writeups of zero-day discoveries",
  },
  {
    title: "PortSwigger Research",
    subtitle: "portswigger.net/research",
    url: "https://portswigger.net/research",
    description:
      "James Kettle and the PortSwigger team, regularly introducing entire new bug classes for the web",
  },
  {
    title: "Patrick Wardle",
    subtitle: "Objective-See",
    url: "https://objective-see.org/blog.html",
    description:
      "macOS security researcher and creator of the Objective-See suite of free defensive tools for Mac users",
  },
  {
    title: "Halvar Flake",
    subtitle: "ADD / XOR / ROL",
    url: "https://addxorrol.blogspot.com/",
    description:
      "Thomas Dullien, longtime reverse engineering and program analysis researcher behind BinDiff and zynamics",
  },
  {
    title: "Bunnie Huang",
    subtitle: "bunnie:studios",
    url: "https://www.bunniestudios.com/blog/",
    description:
      "Hardware hacker behind Chumby, Novena, and Precursor, writing on supply chain security and physical reverse engineering",
  },
  {
    title: "Mateusz Jurczyk",
    subtitle: "j00ru//vx tech blog",
    url: "https://j00ru.vexillium.org/",
    description:
      "Google Project Zero researcher specializing in Windows kernel internals, font parsers, and large-scale fuzzing",
  },
  {
    title: "Gynvael Coldwind",
    subtitle: "gynvael.coldwind.pl",
    url: "https://gynvael.coldwind.pl/",
    description:
      "Google security engineer and CTF veteran, posting on low-level reversing, exploitation, and security education",
  },
  {
    title: "Kelly Shortridge",
    subtitle: "kellyshortridge.com",
    url: "https://kellyshortridge.com/blog/",
    description:
      "Resilience engineering and security decision making, author of Security Chaos Engineering",
  },
  {
    title: "Joshua Stein",
    subtitle: "jcs.org",
    url: "https://jcs.org/",
    description:
      "OpenBSD developer writing detailed deep dives on embedded hardware, low-level systems, and reverse engineering",
  },
];

export const podcasts: LinkItem[] = [
  {
    title: "Darknet Diaries",
    subtitle: "Jack Rhysider",
    url: "https://darknetdiaries.com/",
    description:
      "Long-form, narrative storytelling about hackers, breaches, and the hidden side of the internet, the gold standard for security true-crime",
  },
  {
    title: "Risky Business",
    subtitle: "Patrick Gray",
    url: "https://risky.biz/",
    description:
      "Weekly infosec news and interviews with serious practitioners, widely regarded as the industry's news podcast of record",
  },
  {
    title: "CyberWire Daily",
    subtitle: "N2K CyberWire",
    url: "https://thecyberwire.com/podcasts/daily-podcast",
    description:
      "A concise, well-produced daily briefing on the most important cybersecurity news, policy moves, and threat intel",
  },
  {
    title: "SANS Internet Stormcast",
    subtitle: "Dr. Johannes Ullrich",
    url: "https://isc.sans.edu/podcast.html",
    description:
      "A daily five-minute briefing from the SANS Internet Storm Center on emerging threats, CVEs, and attack trends spotted in honeypots",
  },
  {
    title: "Critical Thinking",
    subtitle: "Justin Gardner and Joseph Thacker",
    url: "https://www.criticalthinkingpodcast.io/",
    description:
      "Technical, tactical weekly conversations on bug bounty methodology and novel web vulnerabilities, hosted by two full-time hunters",
  },
  {
    title: "Smashing Security",
    subtitle: "Graham Cluley and Carole Theriault",
    url: "https://www.smashingsecurity.com/",
    description:
      "A weekly, irreverent roundtable on breaches, scams, and privacy stories that still manages to be genuinely informative",
  },
  {
    title: "Click Here",
    subtitle: "Dina Temple-Raston, Recorded Future",
    url: "https://therecord.media/podcast",
    description:
      "Award-winning investigative journalism on ransomware crews, state-sponsored hackers, and the people trying to stop them",
  },
  {
    title: "Malicious Life",
    subtitle: "Ran Levi (Cybereason)",
    url: "https://malicious.life/",
    description:
      "Narrative cybersecurity history that unpacks the people, hacks, and campaigns that shaped the industry",
  },
  {
    title: "Hacking Humans",
    subtitle: "Dave Bittner and Joe Carrigan",
    url: "https://thecyberwire.com/podcasts/hacking-humans",
    description:
      "A weekly look at social engineering, phishing lures, and scams, practical listening for anyone running an awareness program",
  },
  {
    title: "7 Minute Security",
    subtitle: "Brian Johnson",
    url: "https://7minsec.com/",
    description:
      "Short, hands-on field notes from a working pentester, heavy on Active Directory abuse and blue-team gotchas",
  },
  {
    title: "Defensive Security Podcast",
    subtitle: "Jerry Bell and Andrew Kalat",
    url: "https://defensivesecurity.org/",
    description:
      "A weekly blue-team focused rundown of breaches and defensive lessons learned from two veteran security leaders",
  },
  {
    title: "Security Now",
    subtitle: "Steve Gibson and Leo Laporte",
    url: "https://twit.tv/shows/security-now",
    description:
      "Running since 2005 and still weekly, one of the longest-lived deep-dive security podcasts on the internet",
  },
];

export const osintTools: LinkItem[] = [
  {
    title: "Hudson Rock",
    url: "https://hudsonrock.com/free-tools/?=webcheck",
    icon: "https://pixelflare.cc/alicia/icons/hudson-rock.png/w128",
    description:
      "Identify Infostealer infection data related to domains and emails",
  },
  {
    title: "SSL Labs Test",
    url: "https://ssllabs.com/ssltest/analyze.html",
    icon: "https://pixelflare.cc/alicia/icons/qualys-ssl-labs.png/w128",
    description: "Analyzes the SSL configuration of a server and grades it",
    searchLink: "https://www.ssllabs.com/ssltest/analyze.html?d={URL}",
  },
  {
    title: "Virus Total",
    url: "https://virustotal.com",
    icon: "https://pixelflare.cc/alicia/icons/virustotal.png/w128",
    description: "Checks a URL against multiple antivirus engines",
    searchLink: "https://www.virustotal.com/gui/search/{URL_ENCODED}",
  },
  {
    title: "Shodan",
    url: "https://shodan.io/",
    icon: "https://pixelflare.cc/alicia/icons/shodan.png/w128",
    description: "Search engine for Internet-connected devices",
    searchLink: "https://www.shodan.io/search/report?query={URL}",
  },
  {
    title: "Archive",
    url: "https://archive.org/",
    icon: "https://pixelflare.cc/alicia/icons/internet-archive.png/w128",
    description: "View previous versions of a site via the Internet Archive",
    searchLink: "https://web.archive.org/web/*/{URL}",
  },
  {
    title: "URLScan",
    url: "https://urlscan.io/",
    icon: "https://pixelflare.cc/alicia/icons/urlscan.png/w128",
    description: "Scans a URL and provides information about the page",
    searchLink: "https://urlscan.io/search/#{URL}",
  },
  {
    title: "Sucuri SiteCheck",
    url: "https://sitecheck.sucuri.net/",
    icon: "https://pixelflare.cc/alicia/icons/sucuri.png/w128",
    description: "Checks a URL against blacklists and known threats",
    searchLink: "https://sitecheck.sucuri.net/results/{URL}",
  },
  {
    title: "Domain Tools",
    url: "https://whois.domaintools.com/",
    icon: "https://pixelflare.cc/alicia/icons/domaintools.png/w128",
    description: "Run a WhoIs lookup on a domain",
    searchLink: "https://whois.domaintools.com/{DOMAIN}",
  },
  {
    title: "NS Lookup",
    url: "https://nslookup.io/",
    icon: "https://pixelflare.cc/alicia/icons/nslookup.png/w128",
    description: "View DNS records for a domain",
    searchLink: "https://www.nslookup.io/domains/{DOMAIN}/dns-records/",
  },
  {
    title: "DNS Checker",
    url: "https://dnschecker.org/",
    icon: "https://pixelflare.cc/alicia/icons/dns-checker.png/w128",
    description: "Check global DNS propagation across multiple servers",
    searchLink: "https://dnschecker.org/#A/{DOMAIN}",
  },
  {
    title: "Censys",
    url: "https://search.censys.io/",
    icon: "https://pixelflare.cc/alicia/icons/censys.png/w128",
    description: "Lookup hosts associated with a domain",
    searchLink: "https://search.censys.io/search?resource=hosts&q={URL}",
  },
  {
    title: "Page Speed Insights",
    url: "https://developers.google.com/speed/pagespeed/insights/",
    icon: "https://pixelflare.cc/alicia/icons/page-speed-insights.png/w128",
    description:
      "Checks the performance, accessibility and SEO of a page on mobile + desktop",
    searchLink:
      "https://developers.google.com/speed/pagespeed/insights/?url={URL}",
  },
  {
    title: "Built With",
    url: "https://builtwith.com/",
    icon: "https://pixelflare.cc/alicia/icons/built-with.png/w128",
    description: "View the tech stack of a website",
    searchLink: "https://builtwith.com/{URL}",
  },
  {
    title: "DNS Dumpster",
    url: "https://dnsdumpster.com/",
    icon: "https://pixelflare.cc/alicia/icons/dnsdumpster.png/w128",
    description: "DNS recon tool, to map out a domain from it's DNS records",
  },
  {
    title: "BGP Tools",
    url: "https://bgp.tools/",
    icon: "https://pixelflare.cc/alicia/icons/bgp-tools.png/w128",
    description: "View realtime BGP data for any ASN, Prefix or DNS",
    searchLink: "https://bgp.tools/dns/{URL}",
  },
  {
    title: "Similar Web",
    url: "https://similarweb.com/",
    icon: "https://pixelflare.cc/alicia/icons/similar-web.png/w128",
    description: "View approx traffic and engagement stats for a website",
    searchLink: "https://similarweb.com/website/{URL}",
  },
  {
    title: "Blacklist Checker",
    url: "https://blacklistchecker.com/",
    icon: "https://pixelflare.cc/alicia/icons/black-list-checker.png/w128",
    description:
      "Check if a domain, IP or email is present on the top blacklists",
    searchLink: "https://blacklistchecker.com/check?input={URL}",
  },
  {
    title: "Cloudflare Radar",
    url: "https://radar.cloudflare.com/",
    icon: "https://pixelflare.cc/alicia/icons/cloudflare.png/w128",
    description:
      "View traffic source locations for a domain through Cloudflare",
    searchLink: "https://radar.cloudflare.com/domains/domain/{URL}",
  },
  {
    title: "Mozilla HTTP Observatory",
    url: "https://developer.mozilla.org/en-US/observatory",
    icon: "https://pixelflare.cc/alicia/icons/mozilla.png/w128",
    description:
      "Assesses website security posture by analyzing various security headers and practices",
    searchLink:
      "https://developer.mozilla.org/en-US/observatory/analyze?host={URL}",
  },
  {
    title: "AbuseIPDB",
    url: "https://abuseipdb.com/",
    icon: "https://pixelflare.cc/alicia/icons/abuseipdb.png/w128",
    description:
      "Community-sourced database of IPs and domains reported for abuse",
    searchLink: "https://www.abuseipdb.com/check?query={DOMAIN}",
  },
  {
    title: "IBM X-Force Exchange",
    url: "https://exchange.xforce.ibmcloud.com/",
    icon: "https://pixelflare.cc/alicia/icons/ibm-x-force-exchange.png/w128",
    description: "View shared human and machine generated threat intelligence",
    searchLink: "https://exchange.xforce.ibmcloud.com/url/{URL_ENCODED}",
  },
  {
    title: "URLVoid",
    url: "https://urlvoid.com/",
    icon: "https://pixelflare.cc/alicia/icons/urlvoid.png/w128",
    description:
      "Checks a website across 30+ blocklist engines and website reputation services",
    searchLink: "https://urlvoid.com/scan/{DOMAIN}",
  },
  {
    title: "URLhaus",
    url: "https://urlhaus.abuse.ch/",
    icon: "https://pixelflare.cc/alicia/icons/urlhaus.png/w128",
    description: "Checks if the site is in URLhaus's malware URL exchange",
    searchLink: "https://urlhaus.abuse.ch/browse.php?search={URL_ENCODED}",
  },
  {
    title: "ANY.RUN",
    url: "https://any.run/",
    icon: "https://pixelflare.cc/alicia/icons/anyrun.png/w128",
    description: "An interactive malware and web sandbox",
  },
];
