import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';

const clientDir = fileURLToPath(new URL('./dist/client/', import.meta.url));
const serverEntry = new URL('./dist/server/entry.mjs', import.meta.url);

if (!existsSync(serverEntry) || !existsSync(clientDir)) {
	console.error(
		'No build found in ./dist - run `npm run build` before `npm start`.\n' +
			'(if DEPLOY_TARGET is set, it must be `node` for this server)',
	);
	process.exit(1);
}

const { handler: ssr } = await import(serverEntry);

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 8080);

const securityHeaders = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const serveStatic = sirv(clientDir, {
	etag: true,
	gzip: true,
	brotli: true,
	maxAge: 60 * 60 * 24 * 7,
	immutable: false,
});

/* Real ones are prerendered above; Astro 500s on the rest, unlike Vercel/Netlify */
const MISSING_PROGRAM = /^\/api\/programs\/(?!search\.json)[^/]+\.json(\?|$)/;

const server = createServer((req, res) => {
	for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
	if (req.url?.startsWith('/api/'))
		res.setHeader('Access-Control-Allow-Origin', '*');
	serveStatic(req, res, () => {
		if (MISSING_PROGRAM.test(req.url ?? '')) {
			const path = (req.url ?? '').split('?')[0];
			res.writeHead(404, {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			});
			return res.end(
				JSON.stringify({ error: `Not found: ${path}`, status: 404 }),
			);
		}
		return ssr(req, res);
	});
});

const shutdown = (signal) => {
	console.log(`Received ${signal}, shutting down`);
	server.close(() => process.exit(0));
	setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

server.listen(port, host, () => {
	console.log(`Listening on http://${host}:${port}`);
});
