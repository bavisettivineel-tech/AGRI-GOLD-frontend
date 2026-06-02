import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', location: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return; }
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data); navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { name: 'name',     icon: User,   placeholder: 'Full Name *',           type: 'text'     },
    { name: 'email',    icon: Mail,   placeholder: 'Email Address *',        type: 'email'    },
    { name: 'password', icon: Lock,   placeholder: 'Password (min 6 chars)*', type: 'password' },
    { name: 'phone',    icon: Phone,  placeholder: 'Phone Number (optional)',type: 'tel'      },
    { name: 'location', icon: MapPin, placeholder: 'Village / District',     type: 'text'     },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
        padding: '40px 24px 50px', textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, background: 'var(--accent)', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <Sprout size={28} color="var(--primary)" strokeWidth={2.5} />
        </div>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Create Account</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Join Agri Gold today</p>
      </div>

      <div style={{
        flex: 1, background: 'var(--surface)',
        borderRadius: '24px 24px 0 0', marginTop: -24,
        padding: '28px 20px 40px',
      }}>
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '12px 16px', color: 'var(--danger)', fontSize: 14, fontWeight: 600, marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => {
            const Icon = f.icon;
            const isPassword = f.name === 'password';
            return (
              <div key={f.name}>
                <div style={{ position: 'relative' }}>
                  <Icon size={17} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    name={f.name}
                    type={isPassword ? (showPwd ? 'text' : 'password') : f.type}
                    placeholder={f.placeholder}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: 44, paddingRight: isPassword ? 44 : 16 }}
                  />
                  {isPassword && (
                    <button onClick={() => setShowPwd(!showPwd)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)'
                    }}>
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleRegister} disabled={loading} className="btn-primary" style={{ marginTop: 24, marginBottom: 16 }}>
          {loading ? <div className="spinner" /> : <><ArrowRight size={18} /> Create Account</>}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;