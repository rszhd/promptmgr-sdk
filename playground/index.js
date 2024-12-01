import * as dotenv from 'dotenv';
import PromptManager from '../index.js';

dotenv.config();

async function testSDK() {
  const promptManager = new PromptManager({
    baseUrl: process.env.PROMPTMGR_URL,
    secretKey: process.env.PROMPTMGR_SECRET_KEY,
    environment: process.env.PROMPTMGR_ENVIRONMENT,
    projectId: process.env.PROMPTMGR_PROJECT_ID
  });

  try {
    // Test case 1: Basic run
    console.log('Testing basic run...');
    const response1 = await promptManager.run({
      promptId: 'fbf07b98-b535-4665-8500-af00fdb85f89',
      action: 'test/generate',
      variables: [
        {
          field: 'content_type',
          value: 'tweet'
        },
        {
          field: 'topic',
          value: 'SEO'
        }
      ]
    });
    console.log('Basic run response:', response1);
  } catch (error) {
    console.error('Test Error:', error);
  }
}

// Run tests and watch for changes
console.log('Starting SDK tests...');
testSDK();