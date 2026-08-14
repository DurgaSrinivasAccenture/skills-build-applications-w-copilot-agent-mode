/**
 * API Configuration for Octofit Tracker
 * 
 * Environment Variables:
 * - VITE_CODESPACE_NAME: GitHub Codespace name (set in .env.local)
 *   When not set, falls back to http://localhost:8000
 * 
 * Example .env.local:
 * VITE_CODESPACE_NAME=bookish-palm-tree-xr97xv5qwxvxfppp6
 */

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export const getApiEndpoint = (path) => {
  return `${API_BASE_URL}${path}`;
};

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Support both array responses and paginated responses
    return Array.isArray(data) ? data : data.data || data.items || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
