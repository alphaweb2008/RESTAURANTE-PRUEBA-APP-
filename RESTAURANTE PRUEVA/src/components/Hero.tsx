import { useStore } from '../store';

export default function Hero() {
  const { businessName, slogan } = useStore();

  return (
    <section id="home" className="relative min-h-screen flex items-end sm:items-center justify-center overflow-hidden pb-24 sm:pb-0">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/95 to-gray-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24 sm:pt-28">
        <h1 className="text-3xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight break-words">
          {businessName}
        </h1>

        <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          {slogan || 'Comida de tarde & asados nocturnos — el sabor que enciende la noche'}
        </p>

        {/* Horarios */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 sm:px-6 sm:py-3">
            <span className="text-orange-400">☀️</span>
            <span className="text-gray-300 text-xs sm:text-sm">Tarde: 12:00 – 17:00</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 sm:px-6 sm:py-3">
            <span className="text-orange-400">🔥</span>
            <span className="text-gray-300 text-xs sm:text-sm">Asados: 18:00 – 23:00</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#menu"
            className="w-full sm:w-auto text-center px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm uppercase tracking-widest"
          >
            Ver Menú
          </a>
          <a
            href="#reservar"
            className="w-full sm:w-auto text-center px-8 py-3.5 sm:py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
          >
            Reservar Mesa
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
