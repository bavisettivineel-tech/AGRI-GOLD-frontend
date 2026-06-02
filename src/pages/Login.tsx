import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top green section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
        padding: '48px 24px 56px', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, background: 'var(--accent)',
          borderRadius: 18, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <Sprout size={32} color="var(--primary)" strokeWidth={2.5} />
        </div>
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Welcome Back
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
          Sign in to your Agri Gold account
        </p>
      </div>

      {/* Form card */}
      <div style={{
        flex: 1, background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        marginTop: -24, padding: '32px 20px 40px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}>
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 10, padding: '12px 16px',
            color: 'var(--danger)', fontSize: 14, fontWeight: 600, marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6 }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={17} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field"
              style={{ paddingLeft: 44 }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={17} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPwd ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field"
              style={{ paddingLeft: 44, paddingRight: 44 }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={() => setShowPwd(!showPwd)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)'
            }}>
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ marginBottom: 16 }}>
          {loading ? <div className="spinner" /> : <><ArrowRight size={18} /> Sign In</>}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;