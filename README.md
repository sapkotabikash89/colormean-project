# ColorMean - Static Site Deployment

This is a static export of the ColorMean Next.js application, ready for deployment on Cloudflare Pages.

## Deployment to Cloudflare Pages

### Build Settings
- **Build Command**: `npm run export`
- **Build Output Directory**: `out`
- **Root Directory**: `/`

### Environment Variables (Optional)
- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://your-site.pages.dev`)

### Features
- Fully static site with pre-generated color pages
- SEO optimized with sitemaps and structured data
- All color tools and pages pre-rendered
- Lightweight and fast loading

### Local Testing
To test the static build locally:

```bash
# Install dependencies
npm install

# Build the static site
npm run export

# Serve the static files locally
npx serve out
```

Visit `http://localhost:3000` to test the site locally.

### Included Pages
- Homepage
- All color pages (pre-generated ~1500+ color pages)
- Color tools (picker, wheel, contrast checker, etc.)
- Blog posts
- Legal pages
- Sitemap files

### Known Limitations
- Dynamic search functionality is disabled in static export
- API routes are not available in static export
- Image optimization is disabled (using unoptimized images)

### Performance
- Optimized for fast loading
- All images served from Gumlet CDN
- Minimal JavaScript for core functionality
- Efficient color algorithms