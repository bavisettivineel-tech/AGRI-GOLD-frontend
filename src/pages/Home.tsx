import { useNavigate } from 'react-router-dom';
import { ScanLine, MessageCircle, CloudSun, BarChart3, Leaf, ArrowRight, ShieldCheck, Hand } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const features = [
  {
    icon: ScanLine, path: '/disease',
    en: { title: 'Disease Detection', desc: 'Upload photo, AI detects crop disease instantly' },
    te: { title: 'రోగ నిర్ధారణ',      desc: 'ఫోటో అప్‌లోడ్ చేయండి, AI వెంటనే రోగం గుర్తిస్తుంది' },
    color: '#E8F5E9', icon_color: '#2D6A4F',
  },
  {
    icon: MessageCircle, path: '/chat',
    en: { title: 'AI Chatbot',      desc: 'Ask farming questions in Telugu or English' },
    te: { title: 'AI చాట్‌బాట్',    desc: 'తెలుగు లేదా ఇంగ్లీష్‌లో వ్యవసాయ ప్రశ్నలు అడగండి' },
    color: '#E3F2FD', icon_color: '#1565C0',
  },
  {
    icon: Leaf, path: '/crops',
    en: { title: 'Crop Advisor',    desc: 'AI-powered crop suggestions for your soil & season' },
    te: { title: 'పంట సలహాదారు',   desc: 'మీ నేల & సీజన్ కోసం AI పంట సూచనలు' },
    color: '#FFF8E1', icon_color: '#F57F17',
  },
  {
    icon: CloudSun, path: '/weather',
    en: { title: 'Live Weather',    desc: 'Real-time weather data for your farm location' },
    te: { title: 'లైవ్ వాతావరణం',  desc: 'మీ వ్యవసాయ స్థానానికి రియల్-టైమ్ వాతావరణ డేటా' },
    color: '#E8EAF6', icon_color: '#3949AB',
  },
  {
    icon: BarChart3, path: '/market',
    en: { title: 'Market Prices',   desc: 'Daily mandi prices across Andhra & Telangana' },
    te: { title: 'మార్కెట్ ధరలు',  desc: 'ఆంధ్ర & తెలంగాణ అంతటా రోజువారీ మండీ ధరలు' },
    color: '#FCE4EC', icon_color: '#C62828',
  },
];

const Home = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
        padding: '28px 20px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, right: 40,
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(212,160,23,0.15)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {user ? (
            <>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                {lang === 'en' ? 'Good morning,' : 'శుభోదయం,'}
              </div>
              <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.name} <Hand size={22} style={{ transform: 'rotate(15deg)', color: 'var(--accent)', display: 'inline-block' }} />
              </h1>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(212,160,23,0.2)', borderRadius: 20,
                padding: '5px 12px', border: '1px solid rgba(212,160,23,0.3)'
              }}>
                <ShieldCheck size={13} color="var(--accent)" />
                <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                  {lang === 'en' ? 'Your farm is protected' : 'మీ వ్యవసాయం రక్షించబడింది'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 6 }}>
                {lang === 'en' ? 'Welcome to' : 'స్వాగతం'}
              </div>
              <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                Agri Gold
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                {lang === 'en'
                  ? 'AI-powered agriculture assistant for Indian farmers'
                  : 'భారతీయ రైతులకు AI వ్యవసాయ సహాయకుడు'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => navigate('/register')} style={{
                  background: 'var(--accent)', color: 'var(--primary)',
                  border: 'none', borderRadius: 10, padding: '11px 20px',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Get Started <ArrowRight size={15} />
                </button>
                <button onClick={() => navigate('/login')} style={{
                  background: 'rgba(255,255,255,0.12)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10,
                  padding: '11px 20px', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                }}>
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Action - Disease Detection */}
      <div style={{ padding: '20px 16px 0' }}>
        <button onClick={() => navigate('/disease')} style={{
          width: '100%', background: 'var(--primary)',
          borderRadius: 14, padding: '18px 20px',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(27,67,50,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, background: 'var(--accent)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ScanLine size={24} color="var(--primary)" strokeWidth={2} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: 'Raleway, sans-serif' }}>
                {lang === 'en' ? 'Scan Your Crop' : 'పంటను స్కాన్ చేయండి'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
                {lang === 'en' ? 'Detect diseases in seconds' : 'సెకన్లలో రోగాలను గుర్తించండి'}
              </div>
            </div>
          </div>
          <ArrowRight size={20} color="var(--accent)" />
        </button>
      </div>

      {/* Features Grid */}
      <div style={{ padding: '20px 16px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          {lang === 'en' ? 'All Features' : 'అన్ని ఫీచర్లు'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const info = lang === 'en' ? f.en : f.te;
            return (
              <button key={i} onClick={() => navigate(f.path)}
                className="fade-up"
                style={{
                  background: f.color, border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 14, padding: '16px 14px',
                  cursor: 'pointer', textAlign: 'left',
                  animationDelay: `${i * 0.07}s`,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                <div style={{
                  width: 40, height: 40, background: 'white',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  <Icon size={20} color={f.icon_color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', fontFamily: 'Raleway, sans-serif', marginBottom: 3 }}>
                    {info.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
                    {info.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Home;