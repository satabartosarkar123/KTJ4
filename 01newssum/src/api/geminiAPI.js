import axios from 'axios'

// Backend API base URL — default to localhost to avoid Render cold starts
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001'

/**
 * Summarize an article via the backend pipeline.
 * The backend handles: validation → Gemini API call → storage.
 * No API key is exposed to the frontend.
 * 
 * @param {string} articleText - The article content to summarize
 * @param {object} metadata - Optional metadata (title, source, date, url)
 * @returns {object} { status, summary, processing_time } or { status, message }
 */
export const summarizeArticle = async (articleText, metadata = {}) => {
  try {
    const response = await axios.post(`${API_BASE}/api/summarize`, {
      content: articleText,
      ...metadata,
    })
    return response.data
  } catch (error) {
    const errorData = error.response?.data
    console.error('Summarization error:', errorData || error.message)
    return {
      status: 'error',
      message: errorData?.message || 'Failed to connect to summarization service',
    }
  }
}
