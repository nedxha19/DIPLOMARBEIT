#!/usr/bin/env node

/**
 * Color Validation Script for Houseo Admin Dashboard
 * Validates color contrast ratios and accessibility compliance
 * Ensures WCAG 2.1 Level AA standards are met
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

console.log('🎨 Running Color Validation for Houseo Dashboard...\n');

// Color contrast validation
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Color combinations to validate
const colorCombinations = [
  { name: 'Primary Text on White', foreground: '#000000', background: '#ffffff', required: 4.5 },
  { name: 'Secondary Text on White', foreground: '#4b5563', background: '#ffffff', required: 4.5 },
  { name: 'White Text on Primary', foreground: '#ffffff', background: '#1a2236', required: 4.5 },
  { name: 'White Text on Accent', foreground: '#ffffff', background: '#0ea5e9', required: 4.5 },
  { name: 'Success Text on Light', foreground: '#065f46', background: '#d1fae5', required: 4.5 },
  { name: 'Error Text on Light', foreground: '#ef4444', background: '#fee2e2', required: 4.5 },
  { name: 'Accent on White', foreground: '#0ea5e9', background: '#ffffff', required: 3.0 }, // For UI elements
  { name: 'Success on White', foreground: '#10b981', background: '#ffffff', required: 3.0 },
];

console.log('📏 Checking Color Contrast Ratios (WCAG 2.1 Level AA):\n');

let passedTests = 0;
let totalTests = colorCombinations.length;

colorCombinations.forEach(combo => {
  const ratio = getContrastRatio(combo.foreground, combo.background);
  const passed = ratio >= combo.required;
  
  console.log(
    `${passed ? '✅' : '❌'} ${combo.name}: ${ratio?.toFixed(2) || 'N/A'} ` +
    `(Required: ${combo.required}) - ${passed ? 'PASS' : 'FAIL'}`
  );
  
  if (passed) passedTests++;
});

console.log(`\n📊 Results: ${passedTests}/${totalTests} tests passed\n`);

// Validate design system colors
const designSystemPath = resolve(projectRoot, 'src/lib/styles/design-system.css');
if (existsSync(designSystemPath)) {
  const designSystem = readFileSync(designSystemPath, 'utf8');
  
  console.log('🔍 Validating Design System Colors:\n');
  
  // Extract color definitions
  const colorDefinitions = designSystem.match(/--[a-z-]+:\s*#[0-9a-fA-F]{6}/g) || [];
  
  console.log(`✅ Found ${colorDefinitions.length} hex color definitions`);
  
  // Check for pure black text
  if (designSystem.includes('--text-primary: #000000')) {
    console.log('✅ Pure black (#000000) used for primary text - maximum contrast');
  } else {
    console.log('⚠️  Primary text is not pure black - verify contrast');
  }
  
  // Check for pure white
  if (designSystem.includes('--text-white: #ffffff')) {
    console.log('✅ Pure white (#ffffff) used for white text');
  } else {
    console.log('⚠️  White text is not pure white');
  }
  
  console.log('');
}

// Check for remaining !important declarations
console.log('🔍 Checking for Excessive !important Usage:\n');

const cssFiles = [
  'src/routes/admin/+layout.svelte',
  'src/routes/admin/calendarSchedule/+page.svelte',
  'src/lib/components/AdminSidebar.svelte'
];

let importantCount = 0;

cssFiles.forEach(filePath => {
  const fullPath = resolve(projectRoot, filePath);
  if (existsSync(fullPath)) {
    const content = readFileSync(fullPath, 'utf8');
    const matches = content.match(/!important/g) || [];
    importantCount += matches.length;
    
    if (matches.length > 0) {
      console.log(`⚠️  ${filePath}: ${matches.length} !important declarations`);
    } else {
      console.log(`✅ ${filePath}: No !important declarations`);
    }
  }
});

console.log(`\n📊 Total !important count: ${importantCount}\n`);

// Accessibility recommendations
console.log('♿ Accessibility Recommendations:\n');
console.log('✅ Use high contrast colors for text (21:1 for Level AAA)');
console.log('✅ Ensure focus indicators are clearly visible');
console.log('✅ Test with screen readers and color blindness simulators');
console.log('✅ Provide alternative text for color-coded information');
console.log('✅ Test in different lighting conditions\n');

// Final summary
if (passedTests === totalTests && importantCount < 5) {
  console.log('🎉 Color validation PASSED! Ready for professor review.');
} else {
  console.log('⚠️  Some issues found. Review and fix before submission.');
  if (passedTests < totalTests) {
    console.log(`   - ${totalTests - passedTests} contrast ratio failures`);
  }
  if (importantCount >= 5) {
    console.log(`   - Too many !important declarations (${importantCount})`);
  }
}

console.log('\n✨ Color validation complete!');
