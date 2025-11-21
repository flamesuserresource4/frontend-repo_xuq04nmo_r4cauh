import { useState } from 'react'

export default function Controls({ onStart, onReset, loading, defaultElo }) {
  const [elo, setElo] = useState(defaultElo || 1200)

  return (
    <div className="w-full max-w-[560px] mx-auto bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-white/80">AI ELO</label>
        <input
          type="range"
          min="600"
          max="2000"
          step="50"
          value={elo}
          onChange={e => setElo(Number(e.target.value))}
          className="w-40"
        />
        <span className="text-white font-semibold w-14 text-center">{elo}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onStart(elo)} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50">
          {loading ? 'Starting...' : 'Start Game'}
        </button>
        <button onClick={onReset} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Reset</button>
      </div>
    </div>
  )
}
