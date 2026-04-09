import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f111a]/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center transition-all">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
            N
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Nutino
          </h1>
        </Link>
        <div className="flex space-x-1 lg:space-x-3 bg-white/5 p-1 rounded-2xl border border-white/5">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              location.pathname === '/' 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Feed
          </Link>
          <Link 
            to="/summaries" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              location.pathname === '/summaries' 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Library
          </Link>
        </div>
      </div>
    </nav>
  )
}
