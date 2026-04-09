import axios from 'axios'
import { useEffect, useState } from 'react'

export default function MySummaries() {
  const [summaries, setSummaries] = useState([])

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001'
        const res = await axios.get(`${API_BASE}/api/summaries`)
        setSummaries(res.data)
        console.log("Fetched summaries:", res.data)
      } catch (err) {
        console.error("❌ Failed to fetch summaries:", err.message)
      }
    }
    fetchSummaries()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">My Summaries</h2>

      {summaries.length === 0 ? (
        <p className="text-gray-500">No summaries saved yet.</p>
      ) : (
        <div className="space-y-6">
          {summaries.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {item.source} | {item.date}
              </p>
              <p className="whitespace-pre-line text-gray-800">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Read Full Article →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
