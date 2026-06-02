import { useState } from 'react';
import { MapPin, Search, Droplets, Wind, Thermometer, CloudRain } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import API from '../api/axios';

interface WeatherData {
  city: string; country: string;
  current: { temp: number; feelsLike: number; humidity: number; windSpeed: number; description: string; icon: string; };
  forecast: { time: string; temp: number; humidity: number; description: string; rain: number; }[];
}

const Weather = () => {
  const { t, lang } = useLang();
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [city, setCity]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fetch = async (params: string) => {
    setLoading(true); setError('');
    try {
      const res = await API.get(`/weather/get?${params}`);
      setWeather(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch weather');
    } finally { setLoading(false); }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      p => fetch(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
      () => setError('Location access denied')
    );
  };

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>

      <div style={{ background: 'var(--surface)', padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{t('weather')}</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          {lang === 'en' ? 'Live weather for better farming decisions' : 'మెరుగైన వ్యవసాయ నిర్ణయాల కోసం లైవ్ వాతావరణం'}
        </p>
      </div>

      <div style={{ padding: 16 }}>

        {/* Search Card */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <button onClick={handleGPS} style={{
            width: '100%', background: 'var(--primary)', border: 'none',
            borderRadius: 10, padding: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'white', fontWeight: 700, fontSize: 14,
            fontFamily: 'Nunito, sans-serif', marginBottom: 12,
          }}>
            <MapPin size={17} /> {t('autoDetect')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder={t('enterCity')}
              className="input-field" style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && fetch(`city=${city}`)}
            />
            <button onClick={() => fetch(`city=${city}`)} style={{
              background: 'var(--primary)', border: 'none', borderRadius: 10,
              width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}>
              <Search size={18} color="white" />
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>{error}</div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)', fontSize: 14 }}>
            <div className="spinner" style={{ margin: '0 auto 12px', borderTopColor: 'var(--primary)', border: '3px solid var(--border)', width: 28, height: 28 }} />
            {lang === 'en' ? 'Fetching weather...' : 'వాతావరణం తీసుకుంటున్నారు...'}
          </div>
        )}

        {weather && (
          <div className="fade-up">
            {/* Current Weather */}
            <div style={{
              background: 'linear-gradient(135deg, #1565C0, #1976D2)',
              borderRadius: 16, padding: '20px 18px', marginBottom: 12,
              boxShadow: '0 4px 20px rgba(21,101,192,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {weather.city}, {weather.country}
                  </div>
                  <div style={{ color: 'white', fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
                    {Math.round(weather.current.temp)}°
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, textTransform: 'capitalize' }}>
                    {weather.current.description}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                    alt="weather icon" style={{ width: 72, height: 72 }}
                  />
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                    Feels like {Math.round(weather.current.feelsLike)}°
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { icon: Droplets,    label: t('humidity'),    value: `${weather.current.humidity}%` },
                  { icon: Wind,        label: t('windSpeed'),   value: `${weather.current.windSpeed}m/s` },
                  { icon: Thermometer, label: t('temperature'), value: `${Math.round(weather.current.temp)}°C` },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                      <Icon size={16} color="rgba(255,255,255,0.8)" style={{ marginBottom: 4 }} />
                      <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>{stat.value}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Forecast */}
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                {lang === 'en' ? '24-Hour Forecast' : '24 గంటల అంచనా'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {weather.forecast.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 10,
                    background: i % 2 === 0 ? 'var(--surface2)' : 'transparent',
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)', width: 70, fontWeight: 600 }}>
                      {new Date(f.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <span style={{ fontWeight: 800, color: '#1565C0', fontSize: 15, width: 50 }}>
                      {Math.round(f.temp)}°C
                    </span>
                    <span style={{ flex: 1, fontSize: 12, color: 'var(--muted)', textAlign: 'center', textTransform: 'capitalize' }}>
                      {f.description}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 50, justifyContent: 'flex-end' }}>
                      {f.rain > 0 ? (
                        <><CloudRain size={13} color="#1976D2" /><span style={{ fontSize: 11, color: '#1976D2', fontWeight: 700 }}>{f.rain}mm</span></>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Dry</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;