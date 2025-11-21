import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import ChessBoard from './components/ChessBoard'
import Controls from './components/Controls'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [fen, setFen] = useState('rn1qkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 3')
  const [aiElo, setAiElo] = useState(1200)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Choose an ELO and start a new game!')
  const [lastMove, setLastMove] = useState(null)
  const [selected, setSelected] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])

  const turn = useMemo(() => fen.split(' ')[1] === 'w' ? 'white' : 'black', [fen])

  const startGame = async (elo) => {
    setLoading(true)
    setMessage('Setting up your game...')
    try {
      const res = await fetch(`${API}/api/new-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elo })
      })
      const data = await res.json()
      setFen(data.fen)
      setAiElo(data.ai_elo)
      setLegalMoves(data.legal_moves || [])
      setMessage('Your move!')
      setSelected(null)
      setLastMove(null)
    } catch (e) {
      setMessage('Failed to start game.')
    } finally {
      setLoading(false)
    }
  }

  const resetGame = () => {
    setFen('rn1qkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 3')
    setMessage('Choose an ELO and start a new game!')
    setSelected(null)
    setLastMove(null)
    setLegalMoves([])
  }

  const coordToUci = (from, to) => {
    return `${from}${to}`
  }

  const onSquareClick = async (sq) => {
    // very minimal move builder: select from then to, then send to backend in UCI
    if (!selected) {
      setSelected(sq)
      return
    }
    const from = selected
    const to = sq
    if (from === to) { setSelected(null); return }
    setSelected(null)

    try {
      const moveUci = coordToUci(from, to)
      const res = await fetch(`${API}/api/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen, move: moveUci, ai_elo: aiElo })
      })
      const data = await res.json()
      if (res.ok) {
        setFen(data.fen)
        setLastMove({ from, to: to })
        setLegalMoves(data.legal_moves || [])
        if (data.result) {
          setMessage(`Game Over: ${data.result}`)
        } else {
          setMessage('Your move!')
        }
      } else {
        setMessage(data.detail || 'Illegal move')
      }
    } catch (e) {
      setMessage('Failed to play move')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <Hero />
      <div className="relative z-10 container mx-auto px-6 pb-24 -mt-20">
        <div className="flex flex-col items-center gap-6">
          <Controls onStart={startGame} onReset={resetGame} loading={loading} defaultElo={aiElo} />
          <ChessBoard fen={fen} onSquareClick={onSquareClick} lastMove={lastMove} />
          <p className="text-white/80">{message}</p>
        </div>
      </div>
    </div>
  )
}
