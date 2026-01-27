# HTTP 410 Gone Middleware Testing Guide

## Overview
This middleware implements HTTP 410 Gone responses for unknown color pages under `/colors/[hex]` URLs. It runs before page rendering and handles the response entirely server-side.

## How It Works

### URL Pattern Matching
- Only intercepts URLs matching `/colors/{hex}`
- Uses Next.js middleware matcher configuration

### Processing Flow
1. **Hex Normalization**: Converts input to lowercase and strips leading `#`
2. **Format Validation**: Ensures 3 or 6 hexadecimal digits only
3. **Database Lookup**: Checks against `color-meaning.json` (1534 known colors)
4. **Response Decision**:
   - Known colors → Pass through (200 OK, normal rendering)
   - Unknown valid hex → HTTP 410 Gone (empty body)
   - Invalid format → Pass through (handled by page component)

## Test Cases

### ✅ Known Color (Should Return 200 OK)
```
URL: /colors/ffffff
Expected: Full page renders with JSX, metadata, layout
Status: 200 OK
Body: Complete HTML with color information
```

### ✅ Another Known Color
```
URL: /colors/ff0000
Expected: Full page renders normally
Status: 200 OK
```

### ❌ Unknown Valid Hex (Should Return 410 Gone)
```
URL: /colors/123456
Expected: Empty response body, no HTML rendering
Status: 410 Gone
Body: (empty)
Headers: Content-Type: text/html
```

### ❌ Another Unknown Hex
```
URL: /colors/abcdef
Expected: HTTP 410 Gone response
Status: 410 Gone
```

### ⚠️ Invalid Format (Handled by Page Component)
```
URL: /colors/xyz123
Expected: Passed through to page component for 404 handling
Status: 404 Not Found (from page component)
```

### ⚠️ Wrong Length
```
URL: /colors/12
Expected: Passed through to page component
Status: 404 Not Found
```

### ⚠️ Too Long
```
URL: /colors/1234567
Expected: Passed through to page component
Status: 404 Not Found
```

## Testing Methods

### 1. Local Development Testing
```bash
# Start development server
npm run dev

# Test URLs in browser
http://localhost:3000/colors/ffffff    # 200 OK
http://localhost:3000/colors/123456    # 410 Gone
http://localhost:3000/colors/xyz123    # 404 Not Found
```

### 2. Command Line Testing
```bash
# Test with curl
curl -I http://localhost:3000/colors/ffffff    # Should show 200
curl -I http://localhost:3000/colors/123456    # Should show 410
curl -I http://localhost:3000/colors/xyz123    # Should show 404
```

### 3. Production Testing (After Deployment)
```bash
# Test deployed site
curl -I https://your-domain.com/colors/ffffff    # 200 OK
curl -I https://your-domain.com/colors/123456    # 410 Gone
```

## Verification Points

### HTTP Status Codes
- ✅ Known colors: `200 OK`
- ✅ Unknown valid hex: `410 Gone`
- ✅ Invalid formats: `404 Not Found`

### Response Bodies
- ✅ Known colors: Full HTML with JSX rendering
- ✅ Unknown colors: Empty body (null response)
- ✅ Invalid formats: Standard 404 page

### Headers
- ✅ 410 responses should include `Content-Type: text/html`
- ✅ No layout or metadata in 410 responses

## Edge Cases Handled

1. **Case Sensitivity**: All hex codes normalized to lowercase
2. **Leading Hash**: Automatically stripped from input
3. **Path Variations**: Handles `/colors/ffffff` and `/colors/#ffffff`
4. **Non-Hex Characters**: Invalid formats bypass middleware
5. **Wrong Length**: Only 3 or 6 digit hex codes processed

## SEO Impact

- ✅ **410 Gone** tells search engines the page is permanently removed
- ✅ **No Indexing** of unknown color pages
- ✅ **Canonical Preservation** for known colors
- ✅ **Clean Removal** of invalid/dynamic color URLs from search results

## Troubleshooting

### If 410 responses aren't working:
1. Check that middleware.ts is in the `app/` directory
2. Verify the matcher configuration includes `/colors/:path*`
3. Confirm color-meaning.json is properly imported
4. Test with curl `-I` flag to see actual status codes

### If known colors aren't rendering:
1. Verify the hex exists in color-meaning.json
2. Check that normalization matches the JSON keys
3. Ensure the page component isn't interfering

## Deployment Notes

- Middleware runs at the Edge in Next.js
- No additional server configuration required
- Works with Cloudflare Pages static export
- Zero runtime overhead for non-color URLs