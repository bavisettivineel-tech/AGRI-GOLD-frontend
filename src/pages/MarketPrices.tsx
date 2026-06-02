import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Navigation, RefreshCw, AlertTriangle, Search,
  Package, TrendingUp, TrendingDown, Minus, Clock,
  BarChart2, ArrowUp, ArrowDown, LayoutGrid,
  Leaf, Wheat, Bean, Sprout, DollarSign,
} from 'lucide-react';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

interface Commodity {
  name: string;
  localName: string;
  emoji: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  market: string;
  category: string;
}

interface MarketData {
  location: string;
  date: string;
  currency: string;
  unit: string;
  lastUpdated: string;
  commodities: Commodity[];
}

const CATEGORIES = ['All', 'Cereals', 'Pulses', 'Vegetables', 'Cash Crops'];

const CategoryIcon = ({ cat, size = 14 }: { cat: string; size?: number }) => {
  const props = { size, strokeWidth: 2.2 };
  if (cat === 'Cereals')    return <Wheat {...props} />;
  if (cat === 'Pulses')     return <Bean {...props} />;
  if (cat === 'Vegetables') return <Leaf {...props} />;
  if (cat === 'Cash Crops') return <DollarSign {...props} />;
  return <LayoutGrid {...props} />;
};

const CommodityIcon = ({ category }: { category: string }) => {
  const style = { opacity: 0.85 };
  if (category === 'Cereals')    return <Wheat size={22} color="#92400e" style={style} />;
  if (category === 'Pulses')     return <Bean size={22} color="#1e6b3c" style={style} />;
  if (category === 'Vegetables') return <Leaf size={22} color="#15803d" style={style} />;
  if (category === 'Cash Crops') return <DollarSign size={22} color="#b45309" style={style} />;
  return <Sprout size={22} color="#2D6A4F" style={style} />;
};

const MarketPrices = () => {
  const { lang } = useLang();
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'trend'>('name');

  const fetchPrices = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { language: lang };
      if (lat && lon) { params.lat = lat; params.lon = lon; }
      const res = await API.get('/market/prices', { params });
      setData(res.data.data);
      setLocationName(
        res.data.resolvedLocation?.district
          ? `${res.data.resolvedLocation.district}, ${res.data.resolvedLocation.state}`
          : res.data.data?.location || ''
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch market prices');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const detectLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lon: c.longitude });
        setLocationLoading(false);
        fetchPrices(c.latitude, c.longitude);
      },
      () => { setLocationLoading(false); fetchPrices(); },
      { timeout: 10000 }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const filtered = (data?.commodities || [])
    .filter(c => {
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.market.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.modalPrice - a.modalPrice;
      if (sortBy === 'trend') {
        const order = { up: 0, stable: 1, down: 2 };
        return order[a.trend] - order[b.trend];
      }
      return a.name.localeCompare(b.name);
    });

  const upCount   = data?.commodities.filter(c => c.trend === 'up').length   || 0;
  const downCount = data?.commodities.filter(c => c.trend === 'down').length || 0;
  const avgModal  = data?.commodities.length
    ? Math.round(data.commodities.reduce((s, c) => s + c.modalPrice, 0) / data.commodities.length)
    : 0;

  return (
    <>
      <style>{`
        @keyframes mktSpin  { to { transform: rotate(360deg); } }
        @keyframes mktFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .mkt-card { animation: mktFadeUp 0.35s ease both; background: white; border-radius: 16px; border: 1.5px solid #E8F0E3; box-shadow: 0 2px 10px rgba(0,0,0,0.055); overflow: hidden; transition: all 0.2s; }
        .mkt-card:hover { box-shadow: 0 6px 24px rgba(27,67,50,0.12); transform: translateY(-2px); border-color: #c8dfc0; }
        .cat-pill { padding: 7px 14px; border-radius: 20px; border: 1.5px solid #DDE5D8; font-size: 13px; font-weight: 700; font-family:'Nunito',sans-serif; cursor:pointer; transition:all 0.18s; background:white; color:#4a6741; white-space:nowrap; display:flex; align-items:center; gap:5px; }
        .cat-pill.active { background:linear-gradient(135deg,#1B4332,#2D6A4F); color:white; border-color:transparent; box-shadow:0 3px 10px rgba(27,67,50,0.28); }
        .cat-pill:not(.active):hover { border-color:#1B4332; color:#1B4332; }
        .loc-btn { display:flex; align-items:center; gap:7px; padding:9px 16px; border-radius:22px; border:none; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .loc-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .mkt-search { width:100%; border:2px solid #DDE5D8; border-radius:24px; padding:11px 18px 11px 44px; font-size:14px; font-family:'Nunito',sans-serif; outline:none; background:#FAFCF8; color:#1A1C1A; transition:border-color 0.2s,box-shadow 0.2s; }
        .mkt-search:focus { border-color:#40916C; box-shadow:0 0 0 3px rgba(64,145,108,0.12); background:white; }
        .sort-sel { border:1.5px solid #DDE5D8; border-radius:20px; padding:7px 14px; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; color:#2D6A4F; background:white; cursor:pointer; outline:none; }
        @media(max-width:600px){ .mkt-stat-grid{grid-template-columns:1fr 1fr !important;} .mkt-price-grid{grid-template-columns:1fr !important;} }
      `}</style>

      <div className="page" style={{ background: '#F1F5EE' }}>

        {/* Hero Header */}
        <div style={{ background:'linear-gradient(135deg,#1B4332 0%,#2D6A4F 60%,#40916C 100%)', padding:'20px 16px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute',bottom:-20,left:-20,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.04)' }} />

          <div style={{ maxWidth:760, margin:'0 auto', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <BarChart2 size={24} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize:20,fontWeight:800,color:'white',fontFamily:'Raleway,sans-serif',lineHeight:1.2 }}>
                  {lang==='te' ? 'మార్కెట్ ధరలు' : 'Live Market Prices'}
                </h1>
                <p style={{ fontSize:12,color:'rgba(255,255,255,0.72)',marginTop:2 }}>
                  {lang==='te' ? 'మీ స్థానానికి దగ్గరలో APMC మండీ ధరలు' : 'APMC Mandi prices near your location'}
                </p>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginTop:10 }}>
              {locationName && !loading && (
                <div style={{ display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.15)',borderRadius:20,padding:'5px 12px' }}>
                  <MapPin size={13} color="white" />
                  <span style={{ fontSize:13,color:'white',fontWeight:700 }}>{locationName}</span>
                </div>
              )}
              <button className="loc-btn" style={{ background:coords?'rgba(255,255,255,0.15)':'white', color:coords?'white':'#1B4332' }} onClick={detectLocation} disabled={locationLoading||loading}>
                {locationLoading
                  ? <span style={{ width:14,height:14,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block',animation:'mktSpin 0.7s linear infinite' }} />
                  : <Navigation size={14} />}
                {locationLoading ? (lang==='te'?'స్థానం గుర్తిస్తోంది...':'Detecting...') : (lang==='te'?'స్థానం గుర్తించు':'Detect Location')}
              </button>
              {data && (
                <button className="loc-btn" style={{ background:'rgba(255,255,255,0.12)',color:'white',border:'1px solid rgba(255,255,255,0.25)' }} onClick={() => fetchPrices(coords?.lat,coords?.lon)} disabled={loading}>
                  <RefreshCw size={14} />
                  {lang==='te'?'తాజా ధరలు':'Refresh'}
                </button>
              )}
            </div>

            {data && (
              <p style={{ fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:8,display:'flex',alignItems:'center',gap:5 }}>
                <Clock size={10} color="rgba(255,255,255,0.55)" />
                {lang==='te'?'చివరిగా అప్‌డేట్':'Updated'}: {data.lastUpdated} &nbsp;•&nbsp; {lang==='te'?'ఆధారం':'Source'}: APMC / Agmarknet
              </p>
            )}
          </div>
        </div>

        <div style={{ padding:'16px', maxWidth:760, margin:'0 auto' }}>

          {/* Error */}
          {error && (
            <div style={{ background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10 }}>
              <AlertTriangle size={18} color="#dc2626" />
              <span style={{ fontSize:14,color:'#dc2626',fontWeight:600 }}>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 16px',gap:16 }}>
              <div style={{ width:52,height:52,border:'3px solid #DDE5D8',borderTopColor:'#1B4332',borderRadius:'50%',animation:'mktSpin 0.8s linear infinite' }} />
              <div style={{ textAlign:'center' }}>
                <p style={{ fontWeight:700,color:'#1B4332',fontSize:16 }}>{lang==='te'?'ధరలు లోడ్ అవుతున్నాయి...':'Fetching live prices...'}</p>
                <p style={{ color:'#6B7A6B',fontSize:13,marginTop:4,display:'flex',alignItems:'center',justifyContent:'center',gap:4 }}>
                  <MapPin size={12} color="#6B7A6B" />
                  {locationName || (lang==='te'?'మీ స్థానాన్ని విశ్లేషిస్తోంది':'Analysing your location')}
                </p>
              </div>
            </div>
          )}

          {/* Stats Row */}
          {data && !loading && (
            <>
              <div className="mkt-stat-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:16 }}>
                {[
                  { Icon:Package,      label:lang==='te'?'పంటలు':'Total Crops',  value:data.commodities.length, color:'#1B4332' },
                  { Icon:TrendingUp,   label:lang==='te'?'ధర పెరిగింది':'Price Up', value:upCount,             color:'#16a34a' },
                  { Icon:TrendingDown, label:lang==='te'?'ధర తగ్గింది':'Price Down', value:downCount,           color:'#dc2626' },
                  { Icon:BarChart2,    label:lang==='te'?'సగటు ధర':'Avg Price',   value:`₹${avgModal.toLocaleString()}`, color:'#b45309' },
                ].map(({ Icon, label, value, color }, i) => (
                  <div key={i} style={{ background:'white',borderRadius:14,padding:'12px 8px',textAlign:'center',border:'1.5px solid #E8F0E3',boxShadow:'0 2px 8px rgba(0,0,0,0.045)',animation:`mktFadeUp 0.3s ${i*0.06}s ease both` }}>
                    <div style={{ display:'flex',justifyContent:'center',marginBottom:4 }}><Icon size={20} color={color} /></div>
                    <div style={{ fontSize:17,fontWeight:800,color,fontFamily:'Raleway,sans-serif',lineHeight:1.2 }}>{value}</div>
                    <div style={{ fontSize:10,color:'#6B7A6B',fontWeight:600,marginTop:2,lineHeight:1.3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Search + Sort */}
              <div style={{ display:'flex',gap:10,marginBottom:14,alignItems:'center' }}>
                <div style={{ flex:1, position:'relative' }}>
                  <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',display:'flex',pointerEvents:'none' }}>
                    <Search size={17} color="#9aab9a" />
                  </span>
                  <input className="mkt-search" type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder={lang==='te'?'పంట లేదా మార్కెట్ వెతకండి...':'Search crop or market...'} />
                </div>
                <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                  <option value="name">A–Z</option>
                  <option value="price">Price ↓</option>
                  <option value="trend">Trend</option>
                </select>
              </div>

              {/* Category Pills */}
              <div style={{ display:'flex',gap:8,overflowX:'auto',marginBottom:16,paddingBottom:4,scrollbarWidth:'none' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} className={`cat-pill ${activeCategory===cat?'active':''}`} onClick={() => setActiveCategory(cat)}>
                    <CategoryIcon cat={cat} size={13} /> {cat}
                  </button>
                ))}
              </div>

              {/* Price Cards */}
              <div className="mkt-price-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                {filtered.map((c, i) => {
                  const spreadPct = ((c.maxPrice - c.minPrice) / c.minPrice * 100).toFixed(0);
                  const modalPct  = ((c.modalPrice - c.minPrice) / Math.max(c.maxPrice - c.minPrice, 1)) * 100;
                  const isUp     = c.trend === 'up';
                  const isDown   = c.trend === 'down';
                  const trendColor = isUp ? '#16a34a' : isDown ? '#dc2626' : '#ca8a04';
                  const trendBg   = isUp ? '#dcfce7' : isDown ? '#fee2e2' : '#fef9c3';
                  const TrendIcon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;

                  return (
                    <div key={i} className="mkt-card" style={{ animationDelay:`${i*0.04}s`, padding:'14px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                        <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                          <div style={{ width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,#F1F5EE,#dcefd6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                            <CommodityIcon category={c.category} />
                          </div>
                          <div>
                            <div style={{ fontWeight:800,fontSize:14,color:'#1A1C1A',fontFamily:'Raleway,sans-serif',lineHeight:1.2 }}>{c.name}</div>
                            <div style={{ fontSize:11,color:'#6B7A6B',marginTop:1 }}>{c.localName} · {c.variety}</div>
                          </div>
                        </div>
                        <span style={{ fontSize:11,fontWeight:800,padding:'3px 8px',borderRadius:10,display:'flex',alignItems:'center',gap:3,flexShrink:0,color:trendColor,background:trendBg }}>
                          <TrendIcon size={10} strokeWidth={3} />{Math.abs(c.changePercent).toFixed(1)}%
                        </span>
                      </div>

                      <div style={{ textAlign:'center',margin:'8px 0' }}>
                        <div style={{ fontSize:26,fontWeight:800,color:'#1B4332',fontFamily:'Raleway,sans-serif',lineHeight:1 }}>
                          ₹{c.modalPrice.toLocaleString()}
                        </div>
                        <div style={{ fontSize:11,color:'#6B7A6B',marginTop:2 }}>
                          {lang==='te'?'మాడల్ ధర / క్వింటాల్':'Modal Price / Quintal'}
                        </div>
                      </div>

                      <div style={{ background:'#F1F5EE',borderRadius:8,padding:'8px 10px' }}>
                        <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:700,marginBottom:5 }}>
                          <span style={{ color:'#dc2626' }}>₹{c.minPrice.toLocaleString()}</span>
                          <span style={{ color:'#6B7A6B',fontSize:10 }}>{spreadPct}% spread</span>
                          <span style={{ color:'#16a34a' }}>₹{c.maxPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ height:6,background:'#DDE5D8',borderRadius:4,overflow:'hidden',position:'relative' }}>
                          <div style={{ position:'absolute',height:'100%',background:'linear-gradient(90deg,#dc2626,#16a34a)',borderRadius:4,width:'100%',opacity:0.15 }} />
                          <div style={{ position:'absolute',height:'100%',width:8,background:'#1B4332',borderRadius:4,left:`calc(${Math.max(0,Math.min(100,modalPct))}% - 4px)`,boxShadow:'0 0 0 2px white' }} />
                        </div>
                        <div style={{ fontSize:10,color:'#6B7A6B',marginTop:5,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:4 }}>
                          <MapPin size={9} color="#6B7A6B" /> {c.market}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && !loading && (
                  <div style={{ gridColumn:'1/-1',textAlign:'center',padding:'40px 16px',color:'#6B7A6B',display:'flex',flexDirection:'column',alignItems:'center',gap:10 }}>
                    <Search size={36} color="#DDE5D8" />
                    <div style={{ fontWeight:700 }}>No results for "{search}"</div>
                  </div>
                )}
              </div>

              <p style={{ textAlign:'center',fontSize:11,color:'#9aab9a',marginTop:20,paddingBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:5 }}>
                <BarChart2 size={11} color="#9aab9a" />
                AI-powered prices based on APMC / Agmarknet data
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketPrices;