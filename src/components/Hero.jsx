import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/UGnf9D1Hp3OG8vSG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 text-center px-6 py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">Play Chess vs AI</h1>
        <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">Choose a difficulty by ELO and challenge a smart, fast, and fun opponent. Learn, practice, and enjoy.</p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/40 to-slate-900" />
    </section>
  )
}
