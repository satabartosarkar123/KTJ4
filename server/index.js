import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db.js'
import summaryRoutes from './routes/summaryRoutes.js'
import newsRoutes from './routes/newsRoutes.js'
import summarizeRoutes from './routes/summarizeRoutes.js'
import { logPipeline } from './pipeline/logger.js'

// Load env variables first
dotenv.config()

// Create express app
const app = express()

// Middlewares — whitelist Vercel frontend in production
const allowedOrigins = [
  'http://localhost:5173',           // Vite dev
  'http://localhost:5174',           // Vite dev (alternate port)
  process.env.FRONTEND_URL,         // Vercel production URL (set in Render env)
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return cb(null, true)
    if (allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

// Logging
logPipeline('Server starting...')

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/summaries', summaryRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/summarize', summarizeRoutes)

// Optional test route
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running!')
})

// Listen on assigned port (important for Render)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => logPipeline(`Server running on port ${PORT}`))
