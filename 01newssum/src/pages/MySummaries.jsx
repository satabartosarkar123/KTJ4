import axios from 'axios'
import { useEffect, useState } from 'react'

export default function MySummaries() {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001'
        const res = await axios.get(`${API_BASE}/api/summaries`)
        setSummaries(res.data)
      } catch (err) {
        console.error("❌ Failed to fetch summaries:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSummaries()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <header className="mb-12 border-b border-white/10 pb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-4">
          <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </span>
          Intelligence Library
        </h2>
        <p className="mt-4 text-slate-400 text-lg">Your synchronized collection of high-value insights.</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium">Accessing records...</p>
        </div>
      ) : summaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-300 mb-2">No Records Found</h3>
          <p className="text-slate-500 max-w-md">You haven't synthesized any articles yet. Head back to the feed to start collecting insights.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {summaries.map((item, index) => (
            <div key={index} className="group bg-[#1e1b4b]/40 backdrop-blur-md shadow-xl rounded-3xl p-6 md:p-8 border border-white/10 hover:border-brand-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand-600/10 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors flex-1 pr-4">
                    {item.title}
                  </h3>
                  <div className="flex flex-col items-end text-sm">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-medium whitespace-nowrap mb-1">
                      {item.source}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>
                
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5 md:p-6 mb-6">
                  <p className="whitespace-pre-line text-slate-300 leading-relaxed font-medium">
                    {item.summary}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all border border-white/5 group-hover:border-brand-500/30"
                  >
                    View Source Context
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
