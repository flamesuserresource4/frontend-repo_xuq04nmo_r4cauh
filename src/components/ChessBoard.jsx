import { useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'

// Very lightweight board renderer using pure CSS grid and SVG for pieces
// Coordinates: a1 (bottom-left for White)

const files = ['a','b','c','d','e','f','g','h']
const ranks = ['8','7','6','5','4','3','2','1']

const unicodePieces = {
  P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔',
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚'
}

function parseFEN(fen) {
  const [placement] = fen.split(' ')
  const rows = placement.split('/')
  const board = []
  for (const row of rows) {
    const arr = []
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let i=0;i<Number(ch);i++) arr.push(null)
      } else {
        arr.push(ch)
      }
    }
    board.push(arr)
  }
  return board // 8x8 from rank 8 to 1
}

export default function ChessBoard({ fen, onSquareClick, lastMove }) {
  const board = useMemo(() => parseFEN(fen), [fen])
  const containerRef = useRef(null)

  useEffect(() => {
    // simple resize handling could go here
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-[560px] aspect-square rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rIdx) => (
          files.map((file, fIdx) => {
            const light = (rIdx + fIdx) % 2 === 0
            const piece = board[rIdx][fIdx]
            const sq = `${file}${rank}`
            const isHighlight = lastMove && (lastMove.from === sq || lastMove.to === sq)
            return (
              <button
                key={`${sq}`}
                onClick={() => onSquareClick(sq)}
                className={`relative flex items-center justify-center select-none ${light ? 'bg-emerald-50' : 'bg-emerald-300/40'} ${isHighlight ? 'ring-4 ring-blue-400/70' : ''}`}
                style={{fontSize: '2.2rem'}}
              >
                {piece && (
                  <span className={`drop-shadow ${piece === piece.toUpperCase() ? 'text-slate-900' : 'text-slate-900'}`}>
                    {unicodePieces[piece]}
                  </span>
                )}
                <span className="absolute bottom-1 right-1 text-[10px] text-slate-600/60">
                  {fIdx === 0 && rank}
                  {rIdx === 7 && ` ${file}`}
                </span>
              </button>
            )
          })
        ))}
      </div>
    </div>
  )
}

ChessBoard.propTypes = {
  fen: PropTypes.string.isRequired,
  onSquareClick: PropTypes.func.isRequired,
  lastMove: PropTypes.object,
}
