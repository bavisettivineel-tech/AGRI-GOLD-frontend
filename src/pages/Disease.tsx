import { useState } from 'react';
import { Upload, ScanLine, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import API from '../api/axios';

interface DiseaseResult {
  diseaseName: string; cropAffected: string; severity: string;
  cause: string; symptoms: string[]; treatment: string[];
  medicines: string[]; preventionTips: string[]; isHealthy: boolean;
}

const Disease = () => {
  const { t, lang } = useLang();
  const [image, setImage]     = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<DiseaseResult | null>(null);
  const [error, setError]     = useState('');
  const [cropName, setCropName] = useState('');
  const [location, setLocation] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('treatment');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(null); setError(''); }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('image', image);
      if (cropName) fd.append('cropName', cropName);
      if (location) fd.append('location', location);
      const res = await API.post('/disease/detect', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Detection failed. Please try again.');
    } finally { setLoading(false); }
  };

  const severityBg = (s: string) =>
    s === 'High' ? { bg: '#FEF2F2', color: '#C0392B', border: '#FECACA' } :
    s === 'Medium' ? { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' } :
    { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' };

  const sections = result ? [
    { key: 'symptoms',     title: lang === 'en' ? 'Symptoms'        : 'లక్షణాలు',      items: result.symptoms },
    { key: 'treatment',    title: lang === 'en' ? 'Treatment Steps' : 'చికిత్స దశలు',   items: result.treatment },
    { key: 'medicines',    title: lang === 'en' ? 'Medicines'       : 'మందులు',          items: result.medicines },
    { key: 'prevention',   title: lang === 'en' ? 'Prevention Tips' : 'నివారణ చిట్కాలు', items: result.preventionTips },
  ] : [];

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
          {t('diseaseDetect')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          {lang === 'en' ? 'Upload a crop photo to detect diseases' : 'రోగాలను గుర్తించడానికి పంట ఫోటో అప్‌లోడ్ చేయండి'}
        </p>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Upload Area */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <label style={{ display: 'block', cursor: 'pointer' }}>
            <div style={{
              border: `2px dashed ${preview ? 'var(--primary-light)' : 'var(--border)'}`,
              borderRadius: 12, overflow: 'hidden',
              background: preview ? 'transparent' : 'var(--surface2)',
              minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {preview ? (
                <img src={preview} alt="crop" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 10 }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{
                    width: 56, height: 56, background: '#E8F5E9', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <Upload size={26} color="var(--primary)" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
                    {t('uploadImage')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    JPG, PNG, WEBP — Max 5MB
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <input type="text" value={cropName} onChange={e => setCropName(e.target.value)}
              placeholder={lang === 'en' ? 'Crop name (optional)' : 'పంట పేరు (ఐచ్ఛికం)'}
              className="input-field" style={{ fontSize: 13, padding: '10px 12px' }} />
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder={lang === 'en' ? 'Location (optional)' : 'స్థలం (ఐచ్ఛికం)'}
              className="input-field" style={{ fontSize: 13, padding: '10px 12px' }} />
          </div>

          <button onClick={handleDetect} disabled={!image || loading} className="btn-primary" style={{ marginTop: 14 }}>
            {loading ? (
              <><div className="spinner" /> {t('analysing')}</>
            ) : (
              <><ScanLine size={18} /> {t('detectDisease')}</>
            )}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, color: 'var(--danger)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="fade-up">
            {result.isHealthy ? (
              <div className="card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={36} color="#16A34A" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#16A34A', marginBottom: 6 }}>
                  {t('healthyCrop')}
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  {lang === 'en' ? 'No disease detected. Keep up the good farming practices!' : 'రోగం గుర్తించబడలేదు. మంచి వ్యవసాయ పద్ధతులు కొనసాగించండి!'}
                </p>
              </div>
            ) : (
              <>
                {/* Disease Summary Card */}
                <div className="card" style={{ padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--danger)', marginBottom: 4 }}>
                        {result.diseaseName}
                      </h2>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {lang === 'en' ? 'Crop: ' : 'పంట: '}<span style={{ fontWeight: 600, color: 'var(--text)' }}>{result.cropAffected}</span>
                      </div>
                    </div>
                    <div style={{
                      ...severityBg(result.severity),
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                      border: `1px solid ${severityBg(result.severity).border}`,
                    }}>
                      {result.severity}
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                      {lang === 'en' ? 'Cause: ' : 'కారణం: '}
                    </span>
                    {result.cause}
                  </div>
                </div>

                {/* Accordion Sections */}
                {sections.map(sec => (
                  <div key={sec.key} className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
                    <button
                      onClick={() => setExpandedSection(expandedSection === sec.key ? null : sec.key)}
                      style={{
                        width: '100%', padding: '14px 16px', background: 'none',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{sec.title}</span>
                      {expandedSection === sec.key ? <ChevronUp size={18} color="var(--muted)" /> : <ChevronDown size={18} color="var(--muted)" />}
                    </button>
                    {expandedSection === sec.key && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                        {sec.items.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '8px 0', borderBottom: i < sec.items.length - 1 ? '1px solid var(--border)' : 'none'
                          }}>
                            <div style={{
                              width: 22, height: 22, background: 'var(--primary)',
                              borderRadius: '50%', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', flexShrink: 0, marginTop: 1
                            }}>
                              <span style={{ color: 'white', fontSize: 10, fontWeight: 800 }}>{i + 1}</span>
                            </div>
                            <span style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Disease;