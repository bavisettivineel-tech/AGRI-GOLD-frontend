import { useState } from 'react';
import { Leaf, Droplets, Clock, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import API from '../api/axios';

interface Crop {
  cropName: string; localName: string; suitabilityScore: number;
  expectedYield: string; waterRequirement: string; growingDuration: string;
  marketDemand: string; estimatedProfit: string;
  careTips: string[]; bestSowingTime: string;
}

const soilTypes = ['Black Cotton Soil', 'Red Soil', 'Sandy Loam', 'Clay Soil', 'Loamy Soil', 'Laterite Soil', 'Alluvial Soil'];
const seasons   = ['Kharif (June-October)', 'Rabi (November-February)', 'Zaid (March-June)'];
const states    = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Bihar'];
const waterSources = ['Rainfed', 'Borewell', 'Canal Irrigation', 'Drip Irrigation', 'Sprinkler Irrigation'];

const CropRecommend = () => {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ soilType: '', season: '', state: '', district: '', waterAvailability: '', farmSize: '', previousCrop: '' });
  const [result, setResult]   = useState<{ recommendations: Crop[]; soilPreparationTips: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.soilType || !form.season || !form.state || !form.waterAvailability) {
      setError(lang === 'en' ? 'Please fill all required fields' : 'అన్ని అవసరమైన ఫీల్డ్‌లు నింపండి');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await API.post('/crop/recommend', { ...form, language: lang });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally { setLoading(false); }
  };

  const demandStyle = (d: string) =>
    d === 'High' ? { color: '#16A34A', bg: '#F0FDF4' } :
    d === 'Medium' ? { color: '#D97706', bg: '#FFFBEB' } :
    { color: '#C0392B', bg: '#FEF2F2' };

  const SelectField = ({ label, value, options, onChange }: any) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          className="input-field"
          style={{ appearance: 'none', paddingRight: 36 }}>
          <option value="">Select...</option>
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} color="var(--muted)" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>

      <div style={{ background: 'var(--surface)', padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
          {t('cropRecommend')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          {lang === 'en' ? 'Get AI-powered crop suggestions for your farm' : 'మీ వ్యవసాయానికి AI పంట సూచనలు పొందండి'}
        </p>
      </div>

      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SelectField label={t('soilType') + ' *'} value={form.soilType} options={soilTypes} onChange={(v: string) => update('soilType', v)} />
            <SelectField label={t('season') + ' *'}   value={form.season}   options={seasons}   onChange={(v: string) => update('season', v)} />
            <SelectField label={t('state') + ' *'}    value={form.state}    options={states}    onChange={(v: string) => update('state', v)} />

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('district')}
              </label>
              <input type="text" value={form.district} onChange={e => update('district', e.target.value)}
                placeholder="e.g. Guntur" className="input-field" />
            </div>

            <SelectField label={t('waterSource') + ' *'} value={form.waterAvailability} options={waterSources} onChange={(v: string) => update('waterAvailability', v)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Farm Size
                </label>
                <input type="text" value={form.farmSize} onChange={e => update('farmSize', e.target.value)}
                  placeholder="e.g. 2 acres" className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Prev. Crop
                </label>
                <input type="text" value={form.previousCrop} onChange={e => update('previousCrop', e.target.value)}
                  placeholder="e.g. Rice" className="input-field" />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ marginTop: 16 }}>
            {loading ? <><div className="spinner" /> {lang === 'en' ? 'Getting recommendations...' : 'సూచనలు తీసుకుంటున్నారు...'}</> : <><Leaf size={18} /> {t('getRecommend')}</>}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="fade-up">
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
              {lang === 'en' ? 'Top Crop Recommendations' : 'అగ్రశ్రేణి పంట సూచనలు'}
            </h2>

            {result.recommendations.map((crop, i) => (
              <div key={i} className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
                {/* Crop Header */}
                <div style={{ background: 'var(--primary)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 17, fontFamily: 'Raleway, sans-serif' }}>{crop.cropName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{crop.localName}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--accent)', fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{crop.suitabilityScore}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>/10 match</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {[
                      { icon: Droplets,   label: lang === 'en' ? 'Water' : 'నీరు',         value: crop.waterRequirement },
                      { icon: Clock,      label: lang === 'en' ? 'Duration' : 'వ్యవధి',     value: crop.growingDuration },
                      { icon: Leaf,       label: lang === 'en' ? 'Yield' : 'దిగుబడి',       value: crop.expectedYield },
                      { icon: TrendingUp, label: lang === 'en' ? 'Profit' : 'లాభం',          value: crop.estimatedProfit },
                    ].map((stat, j) => {
                      const Icon = stat.icon;
                      return (
                        <div key={j} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <Icon size={13} color="var(--primary)" />
                            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{stat.label}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{stat.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                      {lang === 'en' ? 'Market Demand:' : 'మార్కెట్ డిమాండ్:'}
                    </span>
                    <span style={{
                      ...demandStyle(crop.marketDemand),
                      padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800
                    }}>
                      {crop.marketDemand}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--surface2)', padding: '8px 12px', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                      {lang === 'en' ? 'Best time to sow: ' : 'విత్తడానికి మంచి సమయం: '}
                    </span>
                    {crop.bestSowingTime}
                  </div>
                </div>
              </div>
            ))}

            {result.soilPreparationTips?.length > 0 && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <h3 style={{ fontWeight: 800, fontSize: 14, color: '#D97706', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowRight size={15} />
                  {lang === 'en' ? 'Soil Preparation Tips' : 'నేల తయారీ చిట్కాలు'}
                </h3>
                {result.soilPreparationTips.map((tip, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#92400E', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommend;