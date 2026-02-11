import { useState } from 'react';
import { useStore } from '../store';

export default function ReservationForm() {
  const { addReservation } = useStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    type: 'noche' as 'tarde' | 'noche',
    notes: '',
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await addReservation({
        ...form,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, type: 'noche', notes: '' });
      setTimeout(() => setSent(false), 5000);
    } catch {
      alert('Error al enviar la reserva. Intenta de nuevo.');
    }
    setSending(false);
  };

  const inputClass = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.06] transition-all text-sm';

  return (
    <section id="reservar" className="py-20 sm:py-28 bg-gray-950 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-orange-400 text-sm uppercase tracking-[0.3em] font-medium">Tu Mesa Espera</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Reservar</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-5 rounded-full" />
        </div>

        {sent ? (
          <div className="text-center py-16 bg-white/[0.03] border border-green-500/20 rounded-2xl">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Reserva Enviada!</h3>
            <p className="text-gray-400">Nos pondremos en contacto contigo para confirmarla.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-5">
            {/* Tipo */}
            <div className="grid grid-cols-2 gap-3">
              {(['tarde', 'noche'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    form.type === t
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {t === 'tarde' ? '☀️ Comida de Tarde' : '🔥 Asados Noche'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Tu teléfono"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Fecha *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Hora *</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Personas *</label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                    <option key={n} value={n} className="bg-gray-900">{n} {n === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Notas</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Algún pedido especial, alergias, etc."
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 text-sm uppercase tracking-widest"
            >
              {sending ? 'Enviando...' : 'Confirmar Reserva'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
