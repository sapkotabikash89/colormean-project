#!/usr/bin/env node

/**
 * Script to detect new posts in headless WordPress CMS, generate static pages,
 * and push changes to GitHub branch "static-deploy"
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    console.log('--- STEP 1: Enhanced Syncing from WordPress (posts + images) ---');
    execSync('node scripts/sync-wp-enhanced.mjs', { stdio: 'inherit' });

    console.log('\n--- STEP 2: Checking for changes ---');
    // Check if there are changes in lib/posts or lib/blog-posts-data.json
    const status = execSync('git status --porcelain', { encoding: 'utf8' });

    if (!status.includes('lib/posts/') && !status.includes('lib/blog-posts-data.json')) {
      console.log('No new posts or updates detected. Nothing to do.');
      return;
    }

    console.log('\n--- STEP 3: Building project to generate static pages ---');
    // Build the project to generate static pages
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\n--- STEP 4: Committing and pushing to GitHub branch "static-deploy" ---');
    
    // Make sure we're on the correct branch
    execSync('git checkout static-deploy', { stdio: 'inherit' });
    
    // Add the changed files (only the source files, not the built output)
    execSync('git add lib/posts/ lib/blog-posts-data.json', { stdio: 'inherit' });
    
    // Check if there are actually changes to commit
    const hasChanges = execSync('git status --porcelain -- lib/posts/ lib/blog-posts-data.json', { encoding: 'utf8' });
    
    if (!hasChanges.trim()) {
      console.log('No changes to commit after build.');
      return;
    }
    
    // Commit the changes
    execSync('git commit -m "feat: Auto-sync new WordPress posts and generated static pages"', { stdio: 'inherit' });

    // Push to the static-deploy branch
    console.log('Pushing to static-deploy branch...');
    execSync('git push origin static-deploy', { stdio: 'inherit' });

    console.log('\n✅ SUCCESS: New posts detected, static pages generated, and changes pushed to GitHub branch "static-deploy".');
    console.log('Cloudflare Pages will now build the project and make the new posts live.');

  } catch (error) {
    console.error('\n❌ FAILED during detect-and-deploy process:');
    console.error(error.message);
    process.exit(1);
  }
}

console.log('🚀 Starting detection and deployment of new WordPress posts...');
run();