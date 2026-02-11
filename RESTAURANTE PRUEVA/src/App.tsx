import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import ReservationForm from './components/ReservationForm';
import ContactSection from './components/ContactSection';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import { useStore } from './store';

export default function App() {
  const { isAdminLoggedIn, loading, initFirebase } = useStore();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  useEffect(() => {
    const handler = () => setLoginOpen(true);
    window.addEventListener('openLogin', handler);
    return () => window.removeEventListener('openLogin', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Hero />
      <MenuSection />
      <ReservationForm />
      {isAdminLoggedIn && <AdminPanel />}
      <ContactSection />

      {/* Footer */}
      <footer className="py-8 border-t border-white/[0.04] bg-black/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} — Todos los derechos reservados
          </p>
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
