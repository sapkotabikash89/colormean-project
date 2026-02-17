import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMapping() {
    const postsPath = path.join(process.cwd(), 'lib/blog-posts-data.json');
    const outputPath = path.join(process.cwd(), 'lib/hex-to-blog.json');

    if (!fs.existsSync(postsPath)) {
        console.error('Error: lib/blog-posts-data.json not found!');
        process.exit(1);
    }

    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    const mapping = {};

    // Extract both 6-char hex and 3-char hex (normalized to 6)
    // Pattern matches hex code at the start of the title
    // Example: "FF0000 Color Red Meaning" or "800000 Color Maroon Meaning"
    const hexRegex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\s/;

    posts.forEach(post => {
        const match = post.title.match(hexRegex);
        if (match) {
            let hex = match[1].toUpperCase();
            // Normalize 3-char hex to 6-char
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            mapping[hex] = post.uri;
            console.log(`Mapped ${hex} -> ${post.uri}`);
        }
    });

    fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
    console.log(`Successfully generated ${outputPath} with ${Object.keys(mapping).length} mappings.`);
}

generateMapping().catch(console.error);
