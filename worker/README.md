# Cloudflare Worker for HTTP 410 Responses

This directory contains a Cloudflare Worker that handles HTTP 410 Gone responses for unknown color pages.

## Project Structure

```
project/
│
├─ worker/
│   ├─ worker.ts                // Main worker logic
│   ├─ known-hexes-array.ts     // 1534 known hex codes
│   ├─ package.json             // Worker dependencies
│   └─ tsconfig.json            // TypeScript configuration
│
├─ app/                         // Next.js App Router (unchanged)
│   ├─ page.tsx                 // Page components (no 410 logic)
│   └─ (other Next.js pages)    
│
├─ wrangler.toml                // Worker deployment configuration
└─ (other project files)
```

## Worker Logic

The worker intercepts requests to `/colors/{hex}` URLs and:

1. **Extracts the hex parameter** from the URL path
2. **Normalizes the hex** (converts to lowercase, strips leading #)
3. **Validates hex format** (must be 3 or 6 hexadecimal digits)
4. **Checks against known colors** using the `KNOWN_HEXES` array
5. **Returns appropriate response**:
   - Known color → Proxy to Pages site (200 OK)
   - Unknown valid hex → HTTP 410 Gone (empty body)
   - Invalid format → Pass through to Pages site (handled by page component)

## Testing Instructions

### Local Development
```bash
cd worker
npm install
npm run dev
```

### Deploy to Cloudflare
```bash
cd worker
npm run deploy
```

### Test Cases

**Known Color (Should Return 200 OK)**
```
URL: https://colormean.com/colors/ffffff
Expected: Full page renders with JSX, metadata, layout
Status: 200 OK
Body: Complete HTML with color information
```

**Unknown Valid Hex (Should Return 410 Gone)**
```
URL: https://colormean.com/colors/123456
Expected: Empty response body, no HTML rendering
Status: 410 Gone
Body: (empty)
Headers: Content-Type: text/html
```

**Invalid Format (Should Return 404)**
```
URL: https://colormean.com/colors/xyz123
Expected: Passed through to page component for 404 handling
Status: 404 Not Found
```

## Deployment Configuration

The `wrangler.toml` file configures:
- Worker name: `color-410-worker`
- Route pattern: `colormean.com/colors/*`
- Zone: `colormean.com`
- Compatibility date: `2024-01-29`

## How It Works

1. **Request Interception**: Worker only activates for `/colors/*` URLs
2. **Hex Processing**: Normalizes and validates the hex parameter
3. **Database Lookup**: Checks against static array of 1534 known hex codes
4. **Response Decision**: 
   - Known colors are proxied to the Pages site for normal rendering
   - Unknown colors receive immediate HTTP 410 response at the edge
   - Invalid formats bypass the worker and are handled by Next.js

## Benefits

- **Performance**: 410 responses served directly from Cloudflare's edge network
- **SEO**: Proper HTTP 410 status signals permanent removal to search engines
- **Scalability**: No server-side processing for unknown color requests
- **Compatibility**: Works seamlessly with existing Next.js functionality
- **Maintenance**: Centralized logic in worker, no changes needed to Next.js pages

## Troubleshooting

If 410 responses aren't working:
1. Verify the worker is deployed and active
2. Check that the route pattern matches your domain
3. Confirm the `KNOWN_HEXES` array contains all valid color codes
4. Test with curl to see actual HTTP status codes

If known colors aren't rendering:
1. Verify the worker is proxying requests correctly
2. Check that Next.js pages are functioning normally
3. Ensure the Pages site is properly configured