#!/usr/bin/env node

// Script to generate the complete list of known hex codes for middleware
// Run: node scripts/generate-known-hexes.js

import { readFileSync, writeFileSync } from 'fs';

// Read the color-meaning.json file (using relative path)
const colorData = JSON.parse(readFileSync('./lib/color-meaning.json', 'utf8'));

// Extract all hex codes and convert to lowercase
const knownHexes = Object.keys(colorData).map(hex => hex.toLowerCase());

// Format as JavaScript array
const hexArray = knownHexes.map(hex => `"${hex}"`).join(',\n  ');

// Generate the complete middleware array
const middlewareContent = `// Known color hex codes (1534 entries from color-meaning.json)
// Generated on: ${new Date().toISOString()}
// Stored as static array for Edge runtime compatibility
const KNOWN_HEXES = [
  ${hexArray}
];

export { KNOWN_HEXES };
`;

// Write to a separate file that can be imported
writeFileSync('./lib/known-hexes-array.ts', middlewareContent);

console.log(`Generated ${knownHexes.length} known hex codes`);
console.log('Output written to: ./lib/known-hexes-array.ts');

// Also show sample of the first 20 for verification
console.log('\nFirst 20 hex codes:');
knownHexes.slice(0, 20).forEach((hex, i) => {
  console.log(`${i + 1}. ${hex}`);
});