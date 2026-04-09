import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-yellow-300 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        <h1 className="text-xl font-bold text-violet-700">Nutino</h1>
        <div className="space-x-4">
          <Link to="/" className="text-white-700 hover:text-violet-500">Home</Link>
          <Link to="/summaries" className="text-white-700 hover:text-violet-500">My Summaries</Link>
        </div>
      </div>
    </nav>
  )
}
