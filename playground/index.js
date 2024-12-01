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
    console.log('\n--- Testing basic run ---');
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

    // Test case 2: Get Prompt
    console.log('\n--- Testing getPrompt ---');
    const promptResponse = await promptManager.getPrompt({
      promptId: 'fbf07b98-b535-4665-8500-af00fdb85f89',
      variables: [
        {
          field: 'content_type',
          value: 'tweet'
        },
        {
          field: 'topic',
          value: 'Local SEO'
        }
      ]
    });
    console.log('GetPrompt response:', promptResponse);

    // Test case 3: Chain
    console.log('\n--- Testing chain ---');
    const chainResults = await promptManager.chain()
      .run({
        id: 'step1',
        promptId: 'fbf07b98-b535-4665-8500-af00fdb85f89',
        action: 'test/generate',
        variables: [
          {
            field: 'content_type',
            value: 'tweet'
          },
          {
            field: 'topic',
            value: 'AI Technology'
          }
        ]
      })
      .run({
        id: 'step2',
        promptId: 'fbf07b98-b535-4665-8500-af00fdb85f89',
        action: 'test/generate',
        variables: ({ prevResults }) => [
          {
            field: 'content_type',
            value: 'linkedin post'
          },
          {
            field: 'topic',
            value: prevResults.step1.response
          }
        ]
      })
      .execute();

    console.log('Chain results:', chainResults);

  } catch (error) {
    console.error('Test Error:', error);
  }
}

// Run tests
console.log('Starting SDK tests...');
testSDK();