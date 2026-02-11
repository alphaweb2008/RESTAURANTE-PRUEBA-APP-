import { useState, useRef } from 'react';
import { useStore } from '../store';
import type { MenuItem } from '../types';

type Tab = 'negocio' | 'menu' | 'reservas' | 'password';

export default function AdminPanel() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>('menu');

  // ---- BUSINESS STATE ----
  const [bName, setBName] = useState(store.businessName);
  const [bSlogan, setBSlogan] = useState(store.slogan);
  const [bPhone, setBPhone] = useState(store.phone);
  const [bAddress, setBAddress] = useState(store.address);
  const [bLogo, setBLogo] = useState(store.logoUrl);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ---- MENU STATE ----
  const [menuFilter, setMenuFilter] = useState<'todos' | 'tarde' | 'noche'>('todos');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '', description: '', price: 0, category: 'noche', image: '', available: true,
  });
  const menuImageRef = useRef<HTMLInputElement>(null);
  const editImageRef = useRef<HTMLInputElement>(null);

  // ---- RESERVAS STATE ----
  const [resFilter, setResFilter] = useState<'todas' | 'pendiente' | 'confirmada' | 'rechazada'>('todas');
  const [resSearch, setResSearch] = useState('');

  // ---- PASSWORD STATE ----
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // ---- HELPERS ----
  const compressImage = (file: File, maxW: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxW / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await compressImage(file, 300, 0.8);
    setBLogo(data);
  };

  const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await compressImage(file, 600, 0.7);
    if (target === 'new') {
      setNewItem({ ...newItem, image: data });
    } else if (editingItem) {
      setEditingItem({ ...editingItem, image: data });
    }
  };

  const saveBusiness = () => {
    store.setBusinessInfo({
      businessName: bName,
      slogan: bSlogan,
      phone: bPhone,
      address: bAddress,
      logoUrl: bLogo,
    });
    alert('✅ Datos del negocio actualizados');
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return alert('Nombre y precio son requeridos');
    await store.addMenuItem(newItem);
    setNewItem({ name: '', description: '', price: 0, category: 'noche', image: '', available: true });
    setShowAddForm(false);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    await store.updateMenuItem(editingItem);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('¿Eliminar este plato?')) return;
    await store.removeMenuItem(id);
  };

  const filteredMenu = store.menuItems.filter((i) => menuFilter === 'todos' || i.category === menuFilter);

  const filteredReservations = store.reservations.filter((r) => {
    const matchStatus = resFilter === 'todas' || r.status === resFilter;
    const matchSearch = !resSearch || r.name.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.phone.includes(resSearch) || r.email.toLowerCase().includes(resSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const resCounts = {
    pendiente: store.reservations.filter((r) => r.status === 'pendiente').length,
    confirmada: store.reservations.filter((r) => r.status === 'confirmada').length,
    rechazada: store.reservations.filter((r) => r.status === 'rechazada').length,
  };

  const inputClass = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all text-sm';
  const btnPrimary = 'px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition-all text-sm font-medium';
  const btnSecondary = 'px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all text-sm border border-white/10';

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'negocio', label: 'Negocio', icon: '🏪' },
    { key: 'menu', label: 'Menú', icon: '🍽️' },
    { key: 'reservas', label: 'Reservas', icon: '📅' },
    { key: 'password', label: 'Contraseña', icon: '🔑' },
  ];

  return (
    <section id="admin" className="py-20 sm:py-28 bg-black/50 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-orange-400 text-sm uppercase tracking-[0.3em] font-medium">Administración</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Panel de Control</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                tab === t.key
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 sm:p-8">

          {/* ============ NEGOCIO ============ */}
          {tab === 'negocio' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Datos del Negocio</h3>

              {/* Logo */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Logo</label>
                <div className="flex items-center gap-4">
                  {bLogo ? (
                    <img src={bLogo} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/30" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 text-2xl">
                      {bName.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    <button onClick={() => logoInputRef.current?.click()} className={btnSecondary}>
                      📷 Subir foto
                    </button>
                    {bLogo && (
                      <button onClick={() => setBLogo('')} className="px-3 py-2 text-red-400 hover:text-red-300 text-sm">
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Nombre del Restaurante</label>
                  <input value={bName} onChange={(e) => setBName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Slogan</label>
                  <input value={bSlogan} onChange={(e) => setBSlogan(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Teléfono</label>
                  <input value={bPhone} onChange={(e) => setBPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Dirección</label>
                  <input value={bAddress} onChange={(e) => setBAddress(e.target.value)} className={inputClass} />
                </div>
              </div>

              <button onClick={saveBusiness} className={btnPrimary}>
                💾 Guardar Cambios
              </button>
            </div>
          )}

          {/* ============ MENÚ ============ */}
          {tab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">Gestión del Menú</h3>
                <button onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }} className={btnPrimary}>
                  {showAddForm ? '✕ Cerrar' : '+ Agregar Plato'}
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {(['todos', 'tarde', 'noche'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setMenuFilter(f)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      menuFilter === f ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                  >
                    {f === 'todos' ? 'Todos' : f === 'tarde' ? '☀️ Tarde' : '🔥 Noche'}
                  </button>
                ))}
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div className="bg-white/[0.03] border border-orange-500/20 rounded-xl p-5 space-y-4">
                  <h4 className="text-white font-semibold">Nuevo Plato</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Nombre *" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className={inputClass} />
                    <input placeholder="Precio *" type="number" step="0.01" value={newItem.price || ''} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} className={inputClass} />
                  </div>
                  <textarea placeholder="Descripción" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className={inputClass + ' resize-none'} rows={2} />

                  <div className="flex flex-wrap gap-3 items-center">
                    <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value as 'tarde' | 'noche' })} className={inputClass + ' !w-auto'}>
                      <option value="tarde" className="bg-gray-900">☀️ Tarde</option>
                      <option value="noche" className="bg-gray-900">🔥 Noche</option>
                    </select>
                    <input type="file" ref={menuImageRef} onChange={(e) => handleMenuImageUpload(e, 'new')} accept="image/*" className="hidden" />
                    <button onClick={() => menuImageRef.current?.click()} className={btnSecondary}>
                      📷 Subir foto
                    </button>
                    {newItem.image && (
                      <img src={newItem.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleAddItem} className={btnPrimary}>✅ Agregar</button>
                    <button onClick={() => setShowAddForm(false)} className={btnSecondary}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {editingItem && (
                <div className="bg-white/[0.03] border border-blue-500/20 rounded-xl p-5 space-y-4">
                  <h4 className="text-white font-semibold">Editando: {editingItem.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className={inputClass} />
                    <input type="number" step="0.01" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })} className={inputClass} />
                  </div>
                  <textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className={inputClass + ' resize-none'} rows={2} />

                  <div className="flex flex-wrap gap-3 items-center">
                    <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as 'tarde' | 'noche' })} className={inputClass + ' !w-auto'}>
                      <option value="tarde" className="bg-gray-900">☀️ Tarde</option>
                      <option value="noche" className="bg-gray-900">🔥 Noche</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingItem.available} onChange={(e) => setEditingItem({ ...editingItem, available: e.target.checked })} className="accent-orange-500" />
                      <span className="text-gray-400 text-sm">Disponible</span>
                    </label>
                    <input type="file" ref={editImageRef} onChange={(e) => handleMenuImageUpload(e, 'edit')} accept="image/*" className="hidden" />
                    <button onClick={() => editImageRef.current?.click()} className={btnSecondary}>
                      📷 Cambiar foto
                    </button>
                    {editingItem.image && (
                      <>
                        <img src={editingItem.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                        <button onClick={() => setEditingItem({ ...editingItem, image: '' })} className="text-red-400 text-xs hover:text-red-300">Quitar foto</button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleUpdateItem} className={btnPrimary}>💾 Guardar</button>
                    <button onClick={() => setEditingItem(null)} className={btnSecondary}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {filteredMenu.length === 0 && (
                  <p className="text-gray-600 text-center py-8">No hay platos en esta categoría.</p>
                )}
                {filteredMenu.map((item) => (
                  <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${item.available ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-red-500/5 border-red-500/10 opacity-60'}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                        {item.category === 'tarde' ? '☀️' : '🔥'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium truncate">{item.name}</span>
                        {!item.available && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Oculto</span>}
                      </div>
                      <span className="text-orange-400 text-sm font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingItem(item); setShowAddForm(false); }} className="p-2 text-gray-400 hover:text-blue-400 transition-colors" title="Editar">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ RESERVAS ============ */}
          {tab === 'reservas' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Gestión de Reservas</h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{resCounts.pendiente}</div>
                  <div className="text-yellow-400/60 text-xs mt-1">Pendientes</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{resCounts.confirmada}</div>
                  <div className="text-green-400/60 text-xs mt-1">Confirmadas</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{resCounts.rechazada}</div>
                  <div className="text-red-400/60 text-xs mt-1">Rechazadas</div>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap gap-3">
                <input
                  placeholder="🔍 Buscar por nombre, teléfono, email..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  className={inputClass + ' sm:!w-64'}
                />
                <div className="flex gap-2">
                  {(['todas', 'pendiente', 'confirmada', 'rechazada'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setResFilter(f)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        resFilter === f ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reservations List */}
              <div className="space-y-3">
                {filteredReservations.length === 0 && (
                  <p className="text-gray-600 text-center py-8">No hay reservas.</p>
                )}
                {filteredReservations.map((r) => (
                  <div key={r.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-white font-semibold">{r.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 text-xs mt-1">
                          <span>📞 {r.phone}</span>
                          {r.email && <span>✉️ {r.email}</span>}
                          <span>📅 {r.date}</span>
                          <span>🕐 {r.time}</span>
                          <span>👥 {r.guests}</span>
                          <span>{r.type === 'tarde' ? '☀️ Tarde' : '🔥 Noche'}</span>
                        </div>
                        {r.notes && <p className="text-gray-600 text-xs mt-2 italic">"{r.notes}"</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        r.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        r.status === 'confirmada' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {r.status !== 'confirmada' && (
                        <button onClick={() => store.updateReservationStatus(r.id, 'confirmada')} className="px-3 py-1.5 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all">
                          ✅ Confirmar
                        </button>
                      )}
                      {r.status !== 'rechazada' && (
                        <button onClick={() => store.updateReservationStatus(r.id, 'rechazada')} className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
                          ❌ Rechazar
                        </button>
                      )}
                      {r.status !== 'pendiente' && (
                        <button onClick={() => store.updateReservationStatus(r.id, 'pendiente')} className="px-3 py-1.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all">
                          🟡 Pendiente
                        </button>
                      )}
                      <button onClick={() => { if (confirm('¿Eliminar esta reserva?')) store.removeReservation(r.id); }} className="px-3 py-1.5 text-xs bg-white/5 text-gray-500 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all ml-auto">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {store.reservations.length > 0 && (
                <button
                  onClick={() => { if (confirm('⚠️ ¿Eliminar TODAS las reservas? Esta acción no se puede deshacer.')) store.clearAllReservations(); }}
                  className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm border border-red-500/20"
                >
                  🗑️ Eliminar Todas las Reservas
                </button>
              )}
            </div>
          )}

          {/* ============ PASSWORD ============ */}
          {tab === 'password' && (
            <div className="space-y-6 max-w-md">
              <h3 className="text-xl font-bold text-white">Cambiar Contraseña</h3>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Contraseña actual</label>
                <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Nueva contraseña</label>
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Confirmar nueva contraseña</label>
                <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={inputClass} />
              </div>

              {passMsg && <p className={`text-sm ${passMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{passMsg}</p>}

              <button
                onClick={() => {
                  if (oldPass !== store.adminPassword) { setPassMsg('❌ La contraseña actual es incorrecta'); return; }
                  if (newPass.length < 4) { setPassMsg('❌ La nueva contraseña debe tener al menos 4 caracteres'); return; }
                  if (newPass !== confirmPass) { setPassMsg('❌ Las contraseñas no coinciden'); return; }
                  store.changePassword(newPass);
                  setOldPass(''); setNewPass(''); setConfirmPass('');
                  setPassMsg('✅ Contraseña actualizada correctamente');
                  setTimeout(() => setPassMsg(''), 3000);
                }}
                className={btnPrimary}
              >
                🔑 Cambiar Contraseña
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
