/**
 * Structured Logger for Nutino Pipeline
 * Format: [STAGE] message
 * 
 * Stages: INGEST, SUMMARIZE, STORE, ERROR, PIPELINE
 */

const STAGES = {
  INGEST: 'INGEST',
  SUMMARIZE: 'SUMMARIZE',
  STORE: 'STORE',
  ERROR: 'ERROR',
  PIPELINE: 'PIPELINE',
}

function formatLog(stage, message, meta = null) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${stage}] ${message}`
  if (meta) {
    return `${base} | ${JSON.stringify(meta)}`
  }
  return base
}

export function logIngest(message, meta = null) {
  console.log(formatLog(STAGES.INGEST, message, meta))
}

export function logSummarize(message, meta = null) {
  console.log(formatLog(STAGES.SUMMARIZE, message, meta))
}

export function logStore(message, meta = null) {
  console.log(formatLog(STAGES.STORE, message, meta))
}

export function logError(message, meta = null) {
  console.error(formatLog(STAGES.ERROR, message, meta))
}

export function logPipeline(message, meta = null) {
  console.log(formatLog(STAGES.PIPELINE, message, meta))
}

export default { logIngest, logSummarize, logStore, logError, logPipeline }
