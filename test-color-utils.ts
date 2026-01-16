// Test script to verify color utilities are working correctly
import { isStaticColor } from './lib/color-linking-utils';
import { KNOWN_COLOR_HEXES } from './lib/known-colors-complete';

console.log('Testing color utilities...');
console.log('Total known colors:', KNOWN_COLOR_HEXES.size);

// Test some known colors
const testColors = ['FF69B4', '4169E1', '32CD32', 'FFD700', '8A2BE2', 'invalid'];

testColors.forEach(hex => {
  const result = isStaticColor(hex);
  console.log(`${hex}: ${result ? 'STATIC' : 'NOT STATIC'}`);
});

// Test edge cases
console.log('\nEdge case tests:');
console.log('Empty string:', isStaticColor(''));
console.log('With hash:', isStaticColor('#FF69B4'));
console.log('Lowercase:', isStaticColor('ff69b4'));
console.log('Mixed case:', isStaticColor('Ff69B4'));