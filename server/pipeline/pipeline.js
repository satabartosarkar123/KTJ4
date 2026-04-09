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

// ─── Stage 2: Summarization via Gemini & Groq ────────────────────────────────

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

async function callGroq(content) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }
  
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: `Summarize the following article in 3 bullet points:\n${content}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const text = response.data?.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('Groq returned empty or malformed response')
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

      logSummarize('Summarization successful (via Gemini)', { processingTime })
      return {
        status: 'success',
        summary,
        processing_time: processingTime,
      }
    } catch (error) {
      lastError = error
      const errMsg = error.response?.data?.error?.message || error.message
      logError(`Gemini API failed (attempt ${attempt + 1}/${MAX_RETRIES + 1})`, { error: errMsg })

      // Brief pause before retry Gemini
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  // Gemini exhausted, try Groq fallback
  logSummarize('Gemini exhausted, attempting Groq fallback...')
  try {
    const summary = await callGroq(content)
    const processingTime = `${Date.now() - startTime}ms`

    logSummarize('Summarization successful (via Groq fallback)', { processingTime })
    return {
      status: 'success',
      summary,
      processing_time: processingTime,
    }
  } catch (groqError) {
    logError('Groq fallback failed', { error: groqError.response?.data || groqError.message })
    
    // Both failed
    const processingTime = `${Date.now() - startTime}ms`
    logError('Summarization failed entirely', { processingTime })
    return {
      status: 'error',
      message: 'Both Gemini and Groq API failed. Last error: ' + (groqError?.response?.data?.error?.message || groqError?.message || 'Unknown error'),
      processing_time: processingTime,
    }
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
