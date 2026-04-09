import express from 'express'
import { summarizeSingle, summarizeBatch } from '../controllers/summarizeController.js'

const router = express.Router()

// POST /api/summarize — Single article summarization
router.post('/', summarizeSingle)

// POST /api/summarize/batch — Batch article summarization (concurrent)
router.post('/batch', summarizeBatch)

export default router
