/**
 * Cloudflare Worker for HTTP 410 Gone responses for unknown color pages
 * 
 * This worker intercepts requests to /colors/{hex} URLs and:
 * 1. Extracts the hex parameter from the URL
 * 2. Normalizes the hex (lowercase, strips #)
 * 3. Checks if the hex exists in our known colors database
 * 4. Returns HTTP 410 Gone for unknown valid hex codes
 * 5. Proxies known colors to the Pages site normally (200 OK)
 * 6. Passes through invalid formats to be handled by the page component
 */

// Import the known hex codes array (1534 entries)
import { KNOWN_HEXES } from './known-hexes-array';

export interface Env {
	// Define environment variables here if needed
}

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		// Only handle /colors/* URLs
		if (!pathname.startsWith('/colors/')) {
			// Not a color page - proxy to Pages site normally
			return fetch(request);
		}

		// Extract hex parameter from URL
		// Expected format: /colors/{hex}
		const pathParts = pathname.split('/');
		const hexParam = pathParts[2]; // Third part after splitting by '/'

		// If no hex parameter, proxy to Pages site
		if (!hexParam) {
			return fetch(request);
		}

		// HEX NORMALIZATION
		// Convert to lowercase and strip leading # if present
		let normalizedHex = hexParam.toLowerCase();
		if (normalizedHex.startsWith('#')) {
			normalizedHex = normalizedHex.substring(1);
		}

		// Validate hex format (must be 3 or 6 hexadecimal digits)
		const hexRegex = /^[0-9a-f]{3}$|^[0-9a-f]{6}$/;
		if (!hexRegex.test(normalizedHex)) {
			// Invalid hex format - pass through to Pages site
			// The page component will handle this with notFound()
			return fetch(request);
		}

		// CHECK AGAINST KNOWN COLORS DATABASE
		// Compare against our static array of known hex codes

		// If hex is NOT in our known colors database, return HTTP 410 Gone
		if (!KNOWN_HEXES.includes(normalizedHex)) {
			// UNKNOWN COLOR - RETURN HTTP 410 GONE
			// - Empty response body
			// - No HTML, JSX, or layout rendering
			// - Immediate edge response
			// - Signals to search engines that this resource is permanently gone
			return new Response(null, {
				status: 410,
				statusText: 'Gone',
				headers: {
					'Content-Type': 'text/html',
				},
			});
		}

		// KNOWN COLOR - PROXY TO PAGES SITE NORMALLY
		// Forward the request to the Cloudflare Pages site for normal rendering
		// This preserves all existing Next.js functionality, SEO metadata, etc.
		return fetch(request);
	},
};