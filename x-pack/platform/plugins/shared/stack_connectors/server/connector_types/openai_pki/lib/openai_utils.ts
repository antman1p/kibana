/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { OPENAI_CHAT_URL, OPENAI_LEGACY_COMPLETION_URL } from '../../../../common/openai/constants';

const APIS_ALLOWING_STREAMING = new Set<string>([OPENAI_CHAT_URL, OPENAI_LEGACY_COMPLETION_URL]);

/**
 * Sanitizes the Open AI request body to set stream to false
 * so users cannot specify a streaming response when the framework
 * is not prepared to handle streaming
 */
export const sanitizeRequest = (url: string, body: string, defaultModel: string): string => {
  return getRequestWithStreamOption(url, body, false, defaultModel);
};

/**
 * Intercepts the Open AI request body to set the stream parameter
 */
export const getRequestWithStreamOption = (
  url: string,
  body: string,
  stream: boolean,
  defaultModel: string
): string => {
  try {
    const jsonBody = JSON.parse(body);
    if (jsonBody) {
      if (APIS_ALLOWING_STREAMING.has(url)) {
        jsonBody.stream = stream;
        if (stream) {
          jsonBody.stream_options = {
            include_usage: true,
          };
        }
      }
      jsonBody.model = jsonBody.model || defaultModel;
    }
    return JSON.stringify(jsonBody);
  } catch (err) {
    // swallow the error
  }
  return body;
};

/**
 * Removes the chat completions endpoint from the OpenAI URL
 */
export const removeEndpointFromUrl = (url: string): string => {
  const endpointToRemove = /\/chat\/completions\/?$/;
  return url.replace(endpointToRemove, '');
};
