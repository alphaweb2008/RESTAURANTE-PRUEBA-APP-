import { useState } from 'react';
import { useStore } from '../store';

export default function MenuSection() {
  const { menuItems } = useStore();
  const [filter, setFilter] = useState<'todos' | 'tarde' | 'noche'>('todos');

  const filtered = menuItems.filter((i) => i.available && (filter === 'todos' || i.category === filter));

  return (
    <section id="menu" className="py-20 sm:py-28 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-orange-400 text-sm uppercase tracking-[0.3em] font-medium">Nuestra Carta</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Menú</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-5 rounded-full" />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12">
          {[
            { key: 'todos' as const, label: 'Todos' },
            { key: 'tarde' as const, label: '☀️ Tarde' },
            { key: 'noche' as const, label: '🔥 Asados' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay platos disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-orange-500/30 hover:bg-white/[0.05] transition-all duration-500"
              >
                {/* Image */}
                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                      item.category === 'tarde'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {item.category === 'tarde' ? '☀️ Tarde' : '🔥 Noche'}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {!item.image && (
                    <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium ${
                      item.category === 'tarde'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {item.category === 'tarde' ? '☀️ Tarde' : '🔥 Noche'}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-orange-400 font-bold text-lg whitespace-nowrap">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
