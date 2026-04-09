import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MySummaries from './pages/MySummaries'
import ArticleDetail from './components/ArticleDetail'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-slate-100 selection:bg-brand-600 selection:text-white">
      {/* Background ambient light effects */}
      <div className="fixed top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="pb-12 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summaries" element={<MySummaries />} />
            <Route path="/article" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
