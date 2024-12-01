// promptmgr-sdk/index.js
import * as dotenv from 'dotenv';
import Logger from './utils/logger.js';

dotenv.config();

class PromptManager {
  constructor(config) {
    this.baseUrl = config.baseUrl || process.env.PROMPTMGR_URL;
    this.secretKey = config.secretKey || process.env.PROMPTMGR_SECRET_KEY;
    this.environment = config.environment || process.env.PROMPTMGR_ENVIRONMENT,
    this.projectId = config.projectId || process.env.PROMPTMGR_PROJECT_ID
    
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
}

export default PromptManager;