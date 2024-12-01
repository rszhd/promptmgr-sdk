# PROMPTMGR SDK

PROMPTMGR SDK is a powerful tool that enables developers to integrate and interact with the PROMPTMGR platform, a prompt management solution for teams working with AI.

## Installation

```bash
npm install promptmgr-sdk
```

## Configuration

First, initialize the SDK with your credentials:

```javascript
import PromptManager from 'promptmgr-sdk';

const promptManager = new PromptManager({
  baseUrl: 'YOUR_BASE_URL', // Required only when self-hosting
  secretKey: 'YOUR_SECRET_KEY',
  environment: 'YOUR_ENVIRONMENT',
  projectId: 'YOUR_PROJECT_ID'
});
```

You can also use environment variables:
```
PROMPTMGR_URL=YOUR_BASE_URL
PROMPTMGR_SECRET_KEY=YOUR_SECRET_KEY
PROMPTMGR_ENVIRONMENT=YOUR_ENVIRONMENT
PROMPTMGR_PROJECT_ID=YOUR_PROJECT_ID
```

## Basic Usage

### Running a Single Prompt

Use the `run` method to execute a single prompt:

```javascript
const response = await promptManager.run({
  promptId: 'your-prompt-id',
  action: 'your-action',
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
});
```

### Getting Prompt Content

Retrieve a prompt's content using `getPrompt`:

```javascript
const prompt = await promptManager.getPrompt({
  promptId: 'your-prompt-id',
  variables: [
    {
      field: 'content_type',
      value: 'tweet'
    },
    {
      field: 'topic',
      value: 'AI'
    }
  ]
});
```

### Chaining Prompts

The SDK supports chaining multiple prompts where the output of one prompt can be used as input for the next:

```javascript
const results = await promptManager.chain()
  .run({
    id: 'step1',
    promptId: 'first-prompt-id',
    action: 'generate',
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
    promptId: 'second-prompt-id',
    action: 'generate',
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
```

In chain operations:
- Each step must have a unique `id`
- You can access previous results using the `prevResults` parameter in variable functions
- Use `execute()` to run the chain

## API Reference

### PromptManager.run(config)
- `config.promptId` (required): The ID of the prompt to run
- `config.action`: The action to perform (for monitoring)
- `config.variables`: Array of variable objects with `field` and `value`

### PromptManager.getPrompt(config)
- `config.promptId` (required): The ID of the prompt to retrieve
- `config.variables`: Array of variable objects with `field` and `value`

### PromptManager.chain()
Creates a chain builder for running multiple prompts in sequence. Each `run()` call in the chain requires:
- `id`: Unique identifier for the step
- `promptId`: The ID of the prompt to run
- `action`: The action identifier for monitoring
- `variables`: Array of variables or function returning variables

## Error Handling

The SDK throws errors for:
- Missing required configuration
- Invalid API responses
- Chain execution failures
- Duplicate step IDs in chains

Wrap your SDK calls in try-catch blocks for proper error handling:

```javascript
try {
  const response = await promptManager.run({
    promptId: 'your-prompt-id',
    action: 'generate',
    variables: [...]
  });
} catch (error) {
  console.error('Error running prompt:', error);
}
```

Common errors include:
- Missing or invalid credentials
- Network connectivity issues 
- Invalid prompt IDs
- Missing required parameters
- Chain execution failures

## Debugging

When running in development mode (`NODE_ENV=development`), the SDK provides detailed logging of:
- API requests
- Configuration
- Errors

## Support

For support:
- Email: contact@reqres.dev


