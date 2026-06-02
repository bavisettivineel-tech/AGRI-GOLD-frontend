import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, Sprout, LogOut, ChevronRight,
  Leaf, TrendingUp, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const TopHeader = () => {
  const { user, logout } = useAuth();
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); navigate('/login'); setOpen(false);
  };

  const drawerLinks = [
    { label: lang === 'en' ? 'Crop Recommendations' : 'పంట సూచనలు', path: '/crops', icon: <Leaf size={18} /> },
    { label: lang === 'en' ? 'Market Prices' : 'మార్కెట్ ధరలు',    path: '/market', icon: <TrendingUp size={18} /> },
  ];

  return (
    <>
      {/* TOP HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--header-h)', background: 'var(--primary)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
      }}>
        {/* Menu */}
        <button onClick={() => setOpen(true)} style={{
          background: 'rgba(255,255,255,0.12)', border: 'none',
          borderRadius: 10, padding: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', color: 'white', flexShrink: 0
        }}>
          <Menu size={22} />
        </button>

        {/* Logo + Name */}
        <Link to="/" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Sprout size={20} color="var(--primary)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ color: 'white', fontFamily: 'Raleway, sans-serif', fontWeight: 800, fontSize: 19, lineHeight: 1.1 }}>
              Agri Gold
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 500 }}>
              {lang === 'en' ? 'Smart Farming Assistant' : 'స్మార్ట్ వ్యవసాయ సహాయకుడు'}
            </div>
          </div>
        </Link>

        {/* Lang toggle + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={toggleLang} style={{
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', padding: '5px 10px', borderRadius: 20,
            cursor: 'pointer', fontSize: 11, fontWeight: 700,
            fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap'
          }}>
            {lang === 'en' ? 'తెలుగు' : 'ENG'}
          </button>

          {user ? (
            <div style={{
              width: 34, height: 34, background: 'var(--accent)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: 'Raleway, sans-serif',
              fontWeight: 800, fontSize: 15, color: 'var(--primary)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <Link to="/login" style={{
              background: 'white', color: 'var(--primary)', padding: '6px 12px',
              borderRadius: 20, fontWeight: 700, fontSize: 12,
              textDecoration: 'none', fontFamily: 'Nunito, sans-serif'
            }}>
              Login
            </Link>
          )}
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 200, backdropFilter: 'blur(3px)'
        }} />
      )}

      {/* SIDE DRAWER */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 290,
        background: 'var(--surface)', zIndex: 300,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Drawer Header */}
        <div style={{ background: 'var(--primary)', padding: '20px 16px 24px' }}>
          <button onClick={() => setOpen(false)} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: 8, padding: 6, cursor: 'pointer', color: 'white', display: 'flex'
          }}>
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <div style={{
              width: 52, height: 52, background: 'var(--accent)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user ? (
                <span style={{ fontFamily: 'Raleway,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--primary)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={26} color="var(--primary)" />
              )}
            </div>
            <div>
              <div style={{ color: 'white', fontFamily: 'Raleway,sans-serif', fontWeight: 700, fontSize: 16 }}>
                {user ? user.name : 'Guest User'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>
                {user ? user.email : 'Login to access all features'}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            More Features
          </div>
          {drawerLinks.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
              color: 'var(--text)', marginBottom: 6, background: 'var(--surface2)',
              border: '1px solid var(--border)', fontWeight: 600, fontSize: 15
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                {item.label}
              </div>
              <ChevronRight size={16} color="var(--muted)" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
            <button onClick={handleLogout} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, padding: 14,
              borderRadius: 12, background: '#FEF2F2',
              color: 'var(--danger)', border: '1px solid #FECACA',
              cursor: 'pointer', fontWeight: 700,
              fontFamily: 'Nunito,sans-serif', fontSize: 15
            }}>
              <LogOut size={18} />
              {lang === 'en' ? 'Logout' : 'లాగ్‌అవుట్'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default TopHeader;