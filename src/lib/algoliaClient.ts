// lib/algoliaClient.ts
import algoliasearch from 'algoliasearch/lite';

// Replace with your actual App ID and Search API Key
const appId = 'ZH3ARANS5B';
const searchApiKey = 'd113a1c7700d347fffa92ef96a3def05';

export const searchClient = algoliasearch(appId, searchApiKey);
