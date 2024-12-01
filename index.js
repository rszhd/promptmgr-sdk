// promptmgr-sdk/index.js
import * as dotenv from 'dotenv';
import Logger from './utils/logger.js';

dotenv.config();

class PromptManager {
  constructor(config) {
    this.baseUrl = config.baseUrl || process.env.PROMPTMGR_URL;
    this.secretKey = config.secretKey || process.env.PROMPTMGR_SECRET_KEY;
    this.environment = config.environment || process.env.PROMPTMGR_ENVIRONMENT;
    this.projectId = config.projectId || process.env.PROMPTMGR_PROJECT_ID;
    this.chainResults = new Map();
    this.isChaining = false;
    
    if (!this.baseUrl) {
      throw new Error('Base URL is required');
    }
    
    if (!this.secretKey) {
      throw new Error('Secret key is required');
    }

    if (process.env.NODE_ENV === 'development') {
      Logger.debug('PromptManager initialized with:', {
        baseUrl: this.baseUrl,
        secretKey: '***'
      });
    }
  }

  async #fetchUtil(url, {
    method = 'POST',
    headers = {},
    body = {},
  } = {}) {
    try {
      if (process.env.NODE_ENV === 'development') {
        Logger.debug('Making API request:', {
          url,
          method,
          headers: { ...headers, Authorization: '***' },
          body: JSON.stringify(body)
        });
      }

      const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secretKey}`
      };

      const response = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      Logger.error('Fetch error:', error);
      throw error;
    }
  }

  async getPrompt({
    promptId,
    variables = []
  }) {
    if (!promptId) {
      throw new Error('Prompt ID is required');
    }
  
    return await this.#fetchUtil(`${this.baseUrl}/get-prompt`, {
      method: 'POST',
      body: {
        env: this.environment,
        projectId: this.projectId,
        promptId,
        variables
      }
    });
  }

  async vectorizeFile({
    promptId,
    fileData,
    sessionId
  }) {
    if (!promptId) {
      throw new Error('Prompt ID is required');
    }
  
    return await this.#fetchUtil(`${this.baseUrl}/vectorize-file`, {
      method: 'POST',
      body: {
        env: this.environment,
        projectId: this.projectId,
        promptId,
        sessionId,
        fileData: {
          name: fileData.name,
          awsKey: fileData.key
        }
      }
    });
  }

  async run({
    projectId,
    promptId,
    action,
    openaiFileIds = null,
    variables = []
  }) {
    if (!(projectId || this.projectId)) {
      throw new Error('Project ID is required');
    }
    if (!promptId) {
      throw new Error('Prompt ID is required');
    }
    if (!action) {
      throw new Error('Action is required');
    }

    return await this.#fetchUtil(`${this.baseUrl}/run`, {
      body: {
        env: this.environment,
        projectId: projectId || this.projectId,
        promptId,
        action,
        openaiFileIds,
        variables
      }
    });
  }

  chain() {
    this.chainResults.clear();
    this.isChaining = true;
    return new ChainBuilder(this);
  }
}

class ChainBuilder {
  constructor(promptManager) {
    this.promptManager = promptManager;
    this.steps = [];
  }

  run(config) {
    if (!config.id) {
      throw new Error('Each run in a chain must have an id');
    }
    
    // Check for duplicate IDs
    if (this.steps.some(step => step.id === config.id)) {
      throw new Error(`Duplicate run ID: ${config.id}`);
    }
    
    this.steps.push(config);
    return this;
  }

  async execute() {
    const results = {};
    
    for (const step of this.steps) {
      const { id, variables, ...restConfig } = step;
      
      try {
        let processedVariables = variables;
        if (typeof variables === 'function') {
          processedVariables = variables({ prevResults: results });
          
          if (!Array.isArray(processedVariables)) {
            throw new Error(`Variables function for run ${id} must return an array`);
          }
        }

        const result = await this.promptManager.run({
          ...restConfig,
          variables: processedVariables
        });

        results[id] = result;
      } catch (error) {
        throw new Error(`Error in run ${id}: ${error.message}`);
      }
    }

    return results;
  }
}


export default PromptManager;