#!/usr/bin/env node

// Simple build script for Vercel deployment
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('Building Age Calculator...');
  
  // Change to project directory
  process.chdir(__dirname);
  
  // Run Vite build directly
  const vitePath = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  execSync(`node "${vitePath}" build`, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
