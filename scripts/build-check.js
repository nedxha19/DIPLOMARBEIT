#!/usr/bin/env node

/**
 * Build Check Script for Houseo Project
 * Validates CSS variable consistency and build optimization
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Color variables that must be consistent
const CRITICAL_VARIABLES = [
  '--primary-color',
  '--accent-color',
  '--bg-primary',
  '--bg-secondary',
  '--text-primary',
  '--text-white',
  '--success-color',
  '--error-color',
  '--border-light'
];

console.log('🔍 Running Houseo Build Check...\n');

// Check if design system exists
const designSystemPath = resolve(projectRoot, 'src/lib/styles/design-system.css');
if (!existsSync(designSystemPath)) {
  console.error('❌ Design system file not found at:', designSystemPath);
  process.exit(1);
}

// Read design system
const designSystem = readFileSync(designSystemPath, 'utf8');

// Validate critical variables are defined
console.log('📋 Checking critical CSS variables...');
const missingVariables = [];

CRITICAL_VARIABLES.forEach(variable => {
  if (!designSystem.includes(variable)) {
    missingVariables.push(variable);
  }
});

if (missingVariables.length > 0) {
  console.error('❌ Missing critical variables:');
  missingVariables.forEach(variable => console.error(`   ${variable}`));
  process.exit(1);
}

console.log('✅ All critical CSS variables are defined');

// Check for CSS variable fallbacks
console.log('\n🔧 Checking CSS variable fallbacks...');
const variableFallbackRegex = /var\(--[\w-]+,\s*[^)]+\)/g;
const fallbacks = designSystem.match(variableFallbackRegex) || [];

console.log(`✅ Found ${fallbacks.length} fallback values`);

// Check package.json for proper build configuration
const packageJsonPath = resolve(projectRoot, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📦 Checking build configuration...');
  
  if (!packageJson.scripts?.build) {
    console.error('❌ No build script found in package.json');
    process.exit(1);
  }
  
  console.log('✅ Build script configured');
}

// Check vite.config.js for CSS optimization
const viteConfigPath = resolve(projectRoot, 'vite.config.js');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf8');
  
  console.log('\n⚡ Checking Vite configuration...');
  
  if (viteConfig.includes('cssCodeSplit: false')) {
    console.log('✅ CSS bundling configured for consistency');
  } else {
    console.warn('⚠️  Consider setting cssCodeSplit: false for better CSS consistency');
  }
}

console.log('\n🎨 Color consistency recommendations:');
console.log('1. Always use CSS variables with fallback values');
console.log('2. Test on multiple devices and browsers');
console.log('3. Clear browser cache when testing changes');
console.log('4. Monitor Vercel build logs for CSS warnings');

console.log('\n✅ Build check completed successfully!');
console.log('\n🚀 Ready for deployment to Vercel');
