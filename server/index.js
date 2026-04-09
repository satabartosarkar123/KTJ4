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

// Middlewares
app.use(cors())
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
