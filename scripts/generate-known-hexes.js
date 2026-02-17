#!/usr/bin/env node

// Script to generate the complete list of known hex codes for middleware and static params
// Run: node scripts/generate-known-hexes.js

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

// Read the color-meaning.json file
const colorData = JSON.parse(readFileSync('./lib/color-meaning.json', 'utf8'));

// Load hex-to-blog mapping if it exists
let hexToBlog = {};
if (existsSync('./lib/hex-to-blog.json')) {
  hexToBlog = JSON.parse(readFileSync('./lib/hex-to-blog.json', 'utf8'));
}

const excludedHexes = new Set(Object.keys(hexToBlog).map(h => h.toUpperCase()));

// Extract all hex codes
const allHexes = Object.keys(colorData).map(hex => hex.toUpperCase());

// Filter out hexes that have blog posts
const filteredHexes = allHexes.filter(hex => !excludedHexes.has(hex));

console.log(`Total hexes in color-meaning.json: ${allHexes.length}`);
console.log(`Excluding ${excludedHexes.size} hexes with blog posts`);
console.log(`Remaining known hexes: ${filteredHexes.length}`);

// Sort for consistency
filteredHexes.sort();

// --- Generate lib/known-hexes-array.ts ---
const hexArrayStr = filteredHexes.map(hex => `"${hex.toLowerCase()}"`).join(',\n  ');
const middlewareContent = `// Known color hex codes (${filteredHexes.length} entries filtered from color-meaning.json)
// Generated on: ${new Date().toISOString()}
// Stored as static array for Edge runtime compatibility
const KNOWN_HEXES = [
  ${hexArrayStr}
];

export { KNOWN_HEXES };
`;

writeFileSync('./lib/known-hexes-array.ts', middlewareContent);
console.log('Generated: ./lib/known-hexes-array.ts');

// --- Generate lib/known-colors-complete.ts ---
const setEntries = filteredHexes.map(hex => `  "${hex}"`).join(',\n');
const completeContent = `// All known hex codes (used for static page generation and linking)
// Generated on: ${new Date().toISOString()}
export const KNOWN_COLOR_HEXES = new Set([
${setEntries}
]);
`;

writeFileSync('./lib/known-colors-complete.ts', completeContent);
console.log('Generated: ./lib/known-colors-complete.ts');

// Show sample
console.log('\nSample of first 10 hexes:');
filteredHexes.slice(0, 10).forEach((hex) => console.log(`- ${hex}`));