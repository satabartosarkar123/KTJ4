import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { summarizeArticle } from '../api/geminiAPI' 

export default function ArticleDetail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const article = state?.article

  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')

    const fullText = article.content || article.description || article.title

    const result = await summarizeArticle(fullText, {
      title: article.title,
      source: article.source.name,
      date: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
    })

    if (result.status === 'success') {
      setSummary(result.summary)
    } else {
      setError(result.message || 'Summarization failed')
    }

    setLoading(false)
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">No Intelligence Feed Found</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">We couldn't retrieve the article data. This might happen if you refresh the page directly.</p>
        <button
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border border-white/10"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Feed
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={() => navigate('/')}
        className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Back to Feed
      </button>

      <article className="bg-[#1e1b4b]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-72 md:h-96 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/95 via-[#1e1b4b]/50 to-transparent z-10"></div>
          <img
            src={article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
            alt="Article Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-500/80 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                {article.source.name}
              </span>
              <span className="text-slate-300 text-sm font-medium">
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              {article.title}
            </h1>
            <p className="text-brand-300 font-medium">By {article.author || 'Network Contributor'}</p>
          </div>
        </div>
        
        <div className="p-6 md:p-10">
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 border-l-4 border-brand-500 pl-6 py-2">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8 mt-8">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="relative px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Key Insights</span>
                </>
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 justify-center w-full sm:w-auto"
            >
              Read Original Article
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/20 backdrop-blur-sm p-5 rounded-2xl flex gap-4 items-start">
              <div className="mt-0.5 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">Synthesis Failed</h3>
                <p className="text-red-200/80">{error}</p>
              </div>
            </div>
          )}

          {summary && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent flex-1 opacity-50"></div>
                <div className="px-4 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                  AI Synthesis
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent flex-1 opacity-50"></div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                <div className="prose prose-invert prose-brand max-w-none relative z-10">
                  <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium">
                    {summary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
