#!/usr/bin/env node

// Test script to verify worker logic locally
// Run: node worker/test-worker-logic.js

// Mock the KNOWN_HEXES array for testing
const KNOWN_HEXES = [
  "b0bf1a", "7cb9e8", "c9ffe5", "b284be", "b5b8b1", "5d8aa8", "00308f", 
  "72a0c1", "af002a", "f0f8ff", "e32636", "c46210", "efdecd", "e52b50",
  "ab274f", "f19cbb", "d3212d", "3b7a57", "ffbf00", "ff7e00", "ff033e",
  "9966cc", "a4c639", "293133", "f2f3f4", "cd9575", "665d1e", "915c83",
  "d36e70", "841b2d", "faebd7", "ffee00", "eedfcc", "cdc0b0", "8b8378",
  "008000", "8db600", "fbceb1", "00ffff", "7fffd4", "76eec6", "458b74",
  "4b5320", "3b444b", "8f9779", "e9d66b", "b2beb5", "87a96b", "ff9966",
  "6d351a", "a52a2a", "6e7f80", "568203", "ff2052", "007fff", "e0eeee",
  "c1cdcd", "838b8b", "dbe9f4", "89cff0", "a1caf1", "f4c2c2", "fefefa",
  "ff91af", "21abcd", "fae7b5", "ffd12a", "ffe135", "006a4e", "e0218a",
  "7c0a02", "4e5754", "848482", "98777b", "2e5894", "bcd4e6", "9f8170",
  "c2b078", "f5f5dc", "79553d", "6d6552", "c1876b", "9c2542", "ffe4c4",
  "eed5b7", "cdb79e", "8b7d6b", "3d2b1f", "967117", "cae00d", "bfff00",
  "fe6f5e", "bf4f51", "000000", "3d0c02", "18171c", "212121", "343e40",
  "23282b", "ffffff", "ff0000"
  // NOTE: This is a partial list for demonstration
  // In production, all 1534 hex codes from known-hexes-array.ts
];

// Test cases
const testCases = [
  { hex: 'ffffff', description: 'Known color (white)' },
  { hex: 'ff0000', description: 'Known color (red)' },
  { hex: '123456', description: 'Unknown valid hex' },
  { hex: 'abcdef', description: 'Unknown valid hex' },
  { hex: 'xyz123', description: 'Invalid format (non-hex characters)' },
  { hex: '12', description: 'Invalid format (too short)' },
  { hex: '1234567', description: 'Invalid format (too long)' },
  { hex: '#ffffff', description: 'Known color with hash prefix' },
  { hex: '#123456', description: 'Unknown valid hex with hash prefix' },
];

console.log('Testing Worker Logic\n');
console.log('Known hexes in database:', KNOWN_HEXES.length);
console.log('Sample known hexes:', KNOWN_HEXES.slice(0, 5));
console.log('\n--- Test Results ---\n');

testCases.forEach(({ hex, description }) => {
  // Simulate worker normalization
  let normalizedHex = hex.toLowerCase();
  if (normalizedHex.startsWith('#')) {
    normalizedHex = normalizedHex.substring(1);
  }

  // Validate hex format
  const hexRegex = /^[0-9a-f]{3}$|^[0-9a-f]{6}$/;
  const isValidFormat = hexRegex.test(normalizedHex);
  
  // Check if known
  const isKnown = KNOWN_HEXES.includes(normalizedHex);
  
  // Determine expected response
  let expectedResult;
  if (!isValidFormat) {
    expectedResult = 'PASS THROUGH (404 via page component)';
  } else if (isKnown) {
    expectedResult = 'PROXY TO PAGES (200 OK)';
  } else {
    expectedResult = 'RETURN 410 GONE';
  }

  console.log(`${description}:`);
  console.log(`  Input: ${hex}`);
  console.log(`  Normalized: ${normalizedHex}`);
  console.log(`  Valid format: ${isValidFormat}`);
  console.log(`  Is known: ${isKnown}`);
  console.log(`  Expected response: ${expectedResult}`);
  console.log('');
});