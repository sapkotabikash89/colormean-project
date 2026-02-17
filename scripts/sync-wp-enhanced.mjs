import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GRAPHQL_URL = 'https://cms.colormean.com/graphql';

// Extract all image URLs from HTML content
function extractImageUrlsFromContent(content) {
    const urls = new Set();
    const imgRegex = /<img[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
        const url = match[1];
        if (url && (url.includes('cms.colormean.com') || url.includes('colormean.com'))) {
            urls.add(url);
        }
    }

    return Array.from(urls);
}

// Generate content hash for change detection
function generateContentHash(content) {
    return crypto.createHash('md5').update(content || '').digest('hex');
}

async function fetchGraphQL(query, variables = {}) {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    const json = await response.json();
    if (json.errors) {
        console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        throw new Error('GraphQL query failed');
    }
    return json;
}

async function fetchItems(type) {
    console.log(`Fetching all ${type}...`);
    const allItems = [];
    let hasNextPage = true;
    let after = null;

    while (hasNextPage) {
        const query = type === 'posts' ? `
            query GetPosts($after: String) {
                posts(first: 100, after: $after) {
                    pageInfo { hasNextPage endCursor }
                    nodes {
                        id
                        databaseId
                        title
                        excerpt
                        content
                        uri
                        date
                        featuredImage { node { sourceUrl altText } }
                        categories { nodes { name slug } }
                        tags { nodes { name uri } }
                        seo {
                            title
                            metaDesc
                            canonical
                            opengraphTitle
                            opengraphDescription
                            opengraphImage { sourceUrl }
                            schema { raw }
                        }
                    }
                }
            }
        ` : `
            query GetPages($after: String) {
                pages(first: 100, after: $after) {
                    pageInfo { hasNextPage endCursor }
                    nodes {
                        id
                        databaseId
                        title
                        content
                        uri
                        date
                        seo {
                            title
                            metaDesc
                            canonical
                            schema { raw }
                        }
                    }
                }
            }
        `;

        const json = await fetchGraphQL(query, { after });
        const { nodes, pageInfo } = json.data[type];

        allItems.push(...nodes);
        hasNextPage = pageInfo.hasNextPage;
        after = pageInfo.endCursor;

        console.log(`Fetched ${allItems.length} ${type}...`);
    }

    return allItems;
}

// Enhanced sync function that detects both new posts and image changes
async function sync() {
    try {
        const posts = await fetchItems('posts');
        const pages = await fetchItems('pages');
        const items = [...posts, ...pages];

        const postsDir = path.resolve(__dirname, '../lib/posts');
        const indexFile = path.resolve(__dirname, '../lib/blog-posts-data.json');
        const imageTrackingFile = path.resolve(__dirname, '../lib/image-tracking.json');

        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir, { recursive: true });
        }

        // Load existing image tracking data
        let imageTracking = {};
        if (fs.existsSync(imageTrackingFile)) {
            imageTracking = JSON.parse(fs.readFileSync(imageTrackingFile, 'utf8'));
        }

        // 1. Update Index File (Blog posts only)
        fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
        console.log(`Updated index: ${indexFile}`);

        // 2. Save individual JSON files and detect changes
        let newItemsCount = 0;
        let updatedItemsCount = 0;
        let newImagesCount = 0;
        const newItems = [];
        const updatedItems = [];
        const newImages = [];

        items.forEach(item => {
            if (!item.uri || item.uri === '/') return;

            const slug = item.uri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
            const itemPath = path.join(postsDir, `${slug}.json`);

            // Extract images from content
            const contentImages = extractImageUrlsFromContent(item.content);
            const featuredImageUrl = item.featuredImage?.node?.sourceUrl;
            const allImages = [...contentImages];
            if (featuredImageUrl) {
                allImages.unshift(featuredImageUrl); // Put featured image first
            }

            // Generate content hash for change detection
            const contentHash = generateContentHash(item.content + JSON.stringify(item.featuredImage));

            // Check if this is a new item or if content has changed
            let isNewItem = false;
            let hasContentChanges = false;
            let hasImageChanges = false;

            if (!fs.existsSync(itemPath)) {
                isNewItem = true;
                newItemsCount++;
                newItems.push(item.title);
            } else {
                // Check for content changes
                const existingItem = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
                const existingHash = generateContentHash(existingItem.content + JSON.stringify(existingItem.featuredImage));

                if (contentHash !== existingHash) {
                    hasContentChanges = true;
                    updatedItemsCount++;
                    updatedItems.push(item.title);
                }

                // Check for image changes
                const existingImages = imageTracking[slug] || [];
                const newImageUrls = allImages.filter(img => !existingImages.includes(img));

                if (newImageUrls.length > 0) {
                    hasImageChanges = true;
                    newImagesCount += newImageUrls.length;
                    newImageUrls.forEach(url => {
                        newImages.push(`${item.title}: ${url}`);
                    });
                }
            }

            // Save the item data
            fs.writeFileSync(itemPath, JSON.stringify(item, null, 2));

            // Update image tracking
            imageTracking[slug] = allImages;
        });

        // Save image tracking data
        fs.writeFileSync(imageTrackingFile, JSON.stringify(imageTracking, null, 2));

        console.log(`Successfully saved ${items.length} items to ${postsDir}`);

        if (newItemsCount > 0) {
            console.log(`\nDETECTED ${newItemsCount} NEW POSTS:`);
            newItems.forEach(title => console.log(` - ${title}`));
        }

        if (updatedItemsCount > 0) {
            console.log(`\nDETECTED ${updatedItemsCount} UPDATED POSTS:`);
            updatedItems.forEach(title => console.log(` - ${title}`));
        }

        if (newImagesCount > 0) {
            console.log(`\nDETECTED ${newImagesCount} NEW IMAGES:`);
            newImages.forEach(imgInfo => console.log(` - ${imgInfo}`));
        }

        if (newItemsCount === 0 && updatedItemsCount === 0 && newImagesCount === 0) {
            console.log('\nNo new posts, updates, or images detected.');
        }

        console.log('Sync complete!');

        // Regenerate hex-to-blog mapping and known colors
        console.log('\n--- Regenerating hex-to-blog mapping ---');
        execSync('node scripts/map-hex-to-blog.mjs', { stdio: 'inherit' });

        console.log('\n--- Regenerating known hex lists ---');
        execSync('node scripts/generate-known-hexes.js', { stdio: 'inherit' });

        // Return summary for deployment script
        return {
            hasChanges: newItemsCount > 0 || updatedItemsCount > 0 || newImagesCount > 0,
            newPosts: newItemsCount,
            updatedPosts: updatedItemsCount,
            newImages: newImagesCount
        };

    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

// Export for use in deployment script
export { sync };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    sync();
}