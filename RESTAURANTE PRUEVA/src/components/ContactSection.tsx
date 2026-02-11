import { useStore } from '../store';

export default function ContactSection() {
  const { phone, address } = useStore();

  const cards = [
    { icon: '📞', title: 'Teléfono', value: phone || '(+593) 000-000-000' },
    { icon: '📍', title: 'Dirección', value: address || 'Calle Principal S/N' },
    { icon: '☀️', title: 'Horario Tarde', value: '12:00 – 17:00' },
    { icon: '🔥', title: 'Horario Asados', value: '18:00 – 23:00' },
  ];

  return (
    <section id="contacto" className="py-20 sm:py-28 bg-gray-950 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-orange-400 text-sm uppercase tracking-[0.3em] font-medium">Encuéntranos</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Contacto</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-orange-500/20 hover:bg-white/[0.05] transition-all duration-500 group"
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
