#!/usr/bin/env node

// Simple script to create and deploy Netlify site via API
const { execSync } = require('child_process');
const https = require('https');

async function deploySite() {
  console.log('🚀 Creating Netlify site...');

  try {
    // Get the Netlify token
    const result = execSync('netlify status --json', { encoding: 'utf8' });
    console.log('✅ Netlify authenticated');

    // Link to GitHub repo and deploy
    console.log('📦 Linking to GitHub and deploying...');
    execSync('netlify link --repo Morgs-75/midnightmafia-fundraiser', {
      stdio: 'inherit',
      input: 'TaxBot\n'
    });

    // Deploy
    execSync('netlify deploy --prod --dir dist', { stdio: 'inherit' });

    console.log('✅ Deployment complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Manual deployment steps:');
    console.log('1. Go to: https://app.netlify.com/start/deploy?repository=https://github.com/Morgs-75/midnightmafia-fundraiser');
    console.log('2. Click "Connect to GitHub"');
    console.log('3. Select the repository');
    console.log('4. Deploy!');
  }
}

deploySite();
