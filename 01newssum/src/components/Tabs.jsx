const categories = [
  { label: 'General', value: 'general' },
  { label: 'Business', value: 'business' },
  { label: 'Tech', value: 'technology' },
  { label: 'Sports', value: 'sports' },
  { label: 'Health', value: 'health' }
]

export default function Tabs({ setCategory, current }) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
      {categories.map(cat => {
        const isActive = current === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out overflow-hidden shadow-sm ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 z-0"></div>
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        );
      })}
    </div>
  )
}
