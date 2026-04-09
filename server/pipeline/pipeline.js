/**
 * Nutino Pipeline — Core 3-Stage Processing
 * 
 * Stage 1: ingestArticle()  — Validates input
 * Stage 2: summarizeArticle() — Calls Gemini API (1 retry)
 * Stage 3: storeSummary()   — Saves to MongoDB
 * 
 * Each function is independent and returns structured output.
 */

import axios from 'axios'
import Summary from '../models/Summary.js'
import { logIngest, logSummarize, logStore, logError } from './logger.js'

// ─── Stage 1: Ingestion & Validation ─────────────────────────────────────────

export async function ingestArticle(content, metadata = {}) {
  logIngest('Request received', { contentLength: content?.length, hasMetadata: !!Object.keys(metadata).length })

  // Null / undefined / empty check
  if (!content || typeof content !== 'string') {
    logIngest('Rejected — content is null or not a string')
    return {
      status: 'error',
      message: 'Invalid input: content must be a non-empty string',
    }
  }

  // Trim and re-check
  const trimmed = content.trim()

  if (trimmed.length === 0) {
    logIngest('Rejected — content is empty after trimming')
    return {
      status: 'error',
      message: 'Invalid input: content cannot be empty',
    }
  }

  // Min length check
  if (trimmed.length < 100) {
    logIngest('Rejected — content too short', { length: trimmed.length })
    return {
      status: 'error',
      message: `Invalid input: content must be at least 100 characters (received ${trimmed.length})`,
    }
  }

  // Malformed check — ensure it's mostly readable text (not binary/garbage)
  const nonPrintableRatio = (trimmed.match(/[^\x20-\x7E\n\r\t]/g) || []).length / trimmed.length
  if (nonPrintableRatio > 0.3) {
    logIngest('Rejected — content appears malformed', { nonPrintableRatio: nonPrintableRatio.toFixed(2) })
    return {
      status: 'error',
      message: 'Invalid input: content appears malformed or contains too many non-printable characters',
    }
  }

  logIngest('Validation passed', { contentLength: trimmed.length })
  return {
    status: 'success',
    data: {
      content: trimmed,
      metadata,
    },
  }
}

// ─── Stage 2: Summarization via Gemini ───────────────────────────────────────

const GEMINI_MODEL = 'gemini-2.0-flash'
const MAX_RETRIES = 1

async function callGemini(content) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  const response = await axios.post(url, {
    contents: [
      {
        parts: [
          {
            text: `Summarize the following article in 3 bullet points:\n${content}`,
          },
        ],
      },
    ],
  })

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned empty or malformed response')
  }

  return text
}

export async function summarizeArticle(content) {
  logSummarize('Summarization started', { contentLength: content.length })
  const startTime = Date.now()
  let lastError = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        logSummarize(`Retry attempt ${attempt}/${MAX_RETRIES}`)
      }

      const summary = await callGemini(content)
      const processingTime = `${Date.now() - startTime}ms`

      logSummarize('Summarization successful', { processingTime })
      return {
        status: 'success',
        summary,
        processing_time: processingTime,
      }
    } catch (error) {
      lastError = error
      const errMsg = error.response?.data?.error?.message || error.message
      logError(`Gemini API failed (attempt ${attempt + 1}/${MAX_RETRIES + 1})`, { error: errMsg })

      // Brief pause before retry
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  // All retries exhausted
  const processingTime = `${Date.now() - startTime}ms`
  logError('Summarization failed after all retries', { processingTime })
  return {
    status: 'error',
    message: 'Gemini API failed after retries: ' + (lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error'),
    processing_time: processingTime,
  }
}

// ─── Stage 3: Storage ────────────────────────────────────────────────────────

export async function storeSummary(summaryData) {
  logStore('Storage started', { title: summaryData.title })

  try {
    const doc = new Summary({
      title: summaryData.title || 'Untitled',
      source: summaryData.source || 'Unknown',
      date: summaryData.date || new Date().toLocaleDateString(),
      url: summaryData.url || '',
      summary: summaryData.summary,
    })

    await doc.save()
    logStore('Storage successful', { id: doc._id.toString() })

    return {
      status: 'success',
      id: doc._id.toString(),
    }
  } catch (error) {
    logError('Storage failed', { error: error.message })
    return {
      status: 'error',
      message: 'Failed to store summary: ' + error.message,
    }
  }
}
