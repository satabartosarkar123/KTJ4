import { useNavigate } from 'react-router-dom'

export default function ArticleCard({ article }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/article', { state: { article } })
  }

  // Generate placeholder domain logic for source styling if missing
  const sourceName = article.source?.name || 'Unknown Source'
  const domainChar = sourceName.charAt(0).toUpperCase()

  return (
    <div
      className="group relative flex flex-col bg-[#1e1b4b]/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-brand-500/50 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/20"
      onClick={handleClick}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] to-transparent opacity-80 z-10"></div>
        <img
          src={article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt="thumbnail"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-[10px] font-bold text-white">
            {domainChar}
          </div>
          <span className="text-xs font-semibold text-white/90 truncate max-w-[120px]">
            {sourceName}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col pt-4">
        {/* Timestamp */}
        <p className="text-xs text-brand-400 font-medium mb-2 uppercase tracking-wider">
          {new Date(article.publishedAt || Date.now()).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </p>
        
        <h2 className="text-xl font-semibold text-slate-100 group-hover:text-brand-300 transition-colors duration-300 line-clamp-3 mb-4 leading-snug">
          {article.title}
        </h2>
        
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/article', { state: { article } })
            }}
          >
            <span className="w-8 h-8 rounded-full bg-brand-600/20 group-hover:bg-brand-500 text-brand-400 group-hover:text-white flex items-center justify-center transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Synthesize
          </button>
        </div>
      </div>
    </div>
  )
}
