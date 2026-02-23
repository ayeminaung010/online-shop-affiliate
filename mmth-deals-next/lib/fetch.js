/**
 * Fetch utility with retry logic
 */

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with exponential backoff retry
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @param {number} backoff - Initial backoff in ms
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(
  url,
  options = {},
  { retries = 3, backoff = 1000 } = {}
) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Retry on server errors (5xx) or network errors
      if (response.ok) {
        return response;
      }
      
      // Server error, might succeed on retry
      lastError = new Error(`Server error: ${response.status}`);
    } catch (error) {
      // Network error, retry
      lastError = error;
    }
    
    // Wait before retrying (exponential backoff)
    if (i < retries) {
      const delay = backoff * Math.pow(2, i) + Math.random() * 1000;
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(response) {
  return response?.status === 429;
}

/**
 * Get retry-after header value in seconds
 */
export function getRetryAfter(response) {
  const retryAfter = response?.headers?.get('Retry-After');
  if (retryAfter) {
    return parseInt(retryAfter, 10) * 1000;
  }
  return null;
}
