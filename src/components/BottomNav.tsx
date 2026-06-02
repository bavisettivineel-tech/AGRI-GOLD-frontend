import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ScanLine, MessageCircle, CloudSun, BarChart3 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const tabs = [
  { path: '/',        icon: Home,          labelEn: 'Home',    labelTe: 'హోమ్'         },
  { path: '/disease', icon: ScanLine,      labelEn: 'Detect',  labelTe: 'రోగం'         },
  { path: '/chat',    icon: MessageCircle, labelEn: 'Chat',    labelTe: 'చాట్'         },
  { path: '/weather', icon: CloudSun,      labelEn: 'Weather', labelTe: 'వాతావరణం'    },
  { path: '/market',  icon: BarChart3,     labelEn: 'Market',  labelTe: 'మార్కెట్'    },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLang();

  const hideOn = ['/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--bottom-h)',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path ||
          (tab.path !== '/' && location.pathname.startsWith(tab.path));

        /* Center Disease Detection tab — special FAB style */
        if (tab.path === '/disease') {
          return (
            <button key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative', paddingTop: 4,
              }}>
              <div style={{
                width: 52, height: 52,
                background: active ? 'var(--primary)' : 'var(--primary)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(27,67,50,0.35)',
                position: 'relative', top: -14,
                border: '3px solid var(--bg)',
              }}>
                <Icon size={22} color="white" strokeWidth={2} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, marginTop: -10,
                color: active ? 'var(--primary)' : 'var(--muted)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {lang === 'en' ? tab.labelEn : tab.labelTe}
              </span>
            </button>
          );
        }

        return (
          <button key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 4px', position: 'relative',
            }}>
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 32, height: 3, background: 'var(--primary)', borderRadius: '0 0 4px 4px'
              }} />
            )}
            <Icon
              size={22}
              color={active ? 'var(--primary)' : 'var(--muted)'}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? 'var(--primary)' : 'var(--muted)',
              fontFamily: 'Nunito, sans-serif',
            }}>
              {lang === 'en' ? tab.labelEn : tab.labelTe}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;