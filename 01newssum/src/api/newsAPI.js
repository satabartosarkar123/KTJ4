import axios from 'axios'

// Default to localhost for local testing so we don't hit Render's 60-second cold start!
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001'
const BASE_URL = `${API_BASE}/api/news`

export const getNewsByCategory = async (category = 'general') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { category }
    })
    return response.data
  } catch (error) {
    console.error('❌ Error fetching news:', error.response?.data || error.message)
    return []
  }
}
