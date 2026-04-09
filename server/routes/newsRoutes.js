import express from 'express'
import axios from 'axios'

const router = express.Router()

// In-memory cache for NewsAPI
const newsCache = {
  data: {},
  timestamp: {}
}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

router.get('/', async (req, res) => {
  const category = req.query.category || 'general'
  const NEWS_API_KEY = process.env.NEWS_API_KEY
  
  // 1. Check cache
  if (newsCache.data[category] && (Date.now() - newsCache.timestamp[category] < CACHE_TTL)) {
    console.log(`[CACHE HIT] Returning cached news for category: ${category}`)
    return res.json(newsCache.data[category])
  }

  // 2. Fetch fresh data if not in cache
  try {
    console.log(`[CACHE MISS] Fetching fresh news for category: ${category}`)
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        category,
        pageSize: 9,
        apiKey: NEWS_API_KEY
      }
    })
    
    // Update cache
    newsCache.data[category] = response.data.articles
    newsCache.timestamp[category] = Date.now()
    
    res.json(response.data.articles)
  } catch (err) {
    console.error('❌ Error fetching news:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

export default router
