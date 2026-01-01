/**
 * Utility functions for API calls
 */

/**
 * Fetch with timeout to prevent hanging requests
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (signal, headers, etc.)
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>}
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Merge abort signals if both exist
    const signal = options.signal
      ? (() => {
          const mergedController = new AbortController();
          options.signal.addEventListener('abort', () => mergedController.abort());
          controller.signal.addEventListener('abort', () => mergedController.abort());
          return mergedController.signal;
        })()
      : controller.signal;

    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' && !options.signal) {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * Fetch with automatic error handling and status checking
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<any>} - Parsed JSON response
 */
export const fetchJSON = async (url, options = {}, timeout = 10000) => {
  const response = await fetchWithTimeout(url, options, timeout);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

