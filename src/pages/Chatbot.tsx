import { useEffect, useRef, useState } from 'react';
import {
  Send, Trash2, Bot, User, AlertTriangle,
  Sprout, Leaf, Droplets, TrendingUp, CloudRain, FlaskConical,
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import API from '../api/axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface QuickQuestion {
  icon: React.ReactNode;
  text: string;
  send: string;
}

const QUICK_EN: QuickQuestion[] = [
  { icon: <Sprout size={13} />,      text: 'Best crops for black soil?',    send: 'Best crops for black soil?' },
  { icon: <Leaf size={13} />,        text: 'How to prevent pest attacks?',  send: 'How to prevent pest attacks?' },
  { icon: <Droplets size={13} />,    text: 'When to irrigate wheat?',       send: 'When to irrigate wheat?' },
  { icon: <TrendingUp size={13} />,  text: 'Tomato market prices today',    send: 'What are tomato market prices today?' },
  { icon: <CloudRain size={13} />,   text: 'Rain-resistant crop varieties', send: 'What are rain-resistant crop varieties?' },
  { icon: <FlaskConical size={13} />,text: 'Organic fertilizer tips',       send: 'Share organic fertilizer tips for farmers.' },
];

const QUICK_TE: QuickQuestion[] = [
  { icon: <Sprout size={13} />,      text: 'నల్ల నేలకు మంచి పంటలు?',         send: 'నల్ల నేలకు మంచి పంటలు?' },
  { icon: <Leaf size={13} />,        text: 'చీడపురుగులను ఎలా నివారించాలి?',    send: 'చీడపురుగులను ఎలా నివారించాలి?' },
  { icon: <Droplets size={13} />,    text: 'గోధుమలకు నీరు ఎప్పుడు పెట్టాలి?', send: 'గోధుమలకు నీరు ఎప్పుడు పెట్టాలి?' },
  { icon: <TrendingUp size={13} />,  text: 'టమాటా మార్కెట్ ధర?',              send: 'టమాటా మార్కెట్ ధర ఎంత?' },
  { icon: <CloudRain size={13} />,   text: 'వర్షాలకు తట్టుకునే పంటలు',        send: 'వర్షాలకు తట్టుకునే పంటలు ఏవి?' },
  { icon: <FlaskConical size={13} />,text: 'సేంద్రీయ ఎరువు చిట్కాలు',         send: 'సేంద్రీయ ఎరువు చిట్కాలు చెప్పండి.' },
];

const TypingDots = () => (
  <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 2px' }}>
    {[0,1,2].map(i => (
      <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#40916C', display:'inline-block', animation:`chatBounce 1.2s ${i*0.2}s ease-in-out infinite` }} />
    ))}
  </div>
);

const BotAvatar = () => (
  <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#1B4332 0%,#40916C 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(27,67,50,0.3)' }}>
    <Bot size={18} color="white" strokeWidth={2} />
  </div>
);

const UserAvatar = () => (
  <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#2D6A4F 0%,#D4A017 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(45,106,79,0.25)' }}>
    <User size={18} color="white" strokeWidth={2} />
  </div>
);

const formatTime = (date?: Date) =>
  date ? date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : '';

const Chatbot = () => {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [input, setInput]       = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const quickQuestions = lang === 'te' ? QUICK_TE : QUICK_EN;

  useEffect(() => {
    API.get('/chat/history')
      .then(res => setMessages(res.data.messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
        timestamp: new Date(m.createdAt || Date.now()),
      }))))
      .catch(() => {})
      .finally(() => setHistoryLoaded(true));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const handleSend = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', content:msg, timestamp:new Date() }]);
    setLoading(true);
    try {
      const res = await API.post('/chat/send', { message:msg, language:lang });
      setMessages(prev => [...prev, { role:'assistant', content:res.data.reply, timestamp:new Date() }]);
    } catch (err: any) {
      const errText = err?.response?.data?.message || 'Failed to get reply. Please try again.';
      setMessages(prev => [...prev, { role:'assistant', content:`Error: ${errText}`, timestamp:new Date() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClear = async () => {
    try { await API.delete('/chat/clear'); setMessages([]); } catch {}
  };

  const isEmpty = historyLoaded && messages.length === 0;

  return (
    <>
      <style>{`
        @keyframes chatBounce { 0%,80%,100%{transform:translateY(0);opacity:0.5} 40%{transform:translateY(-6px);opacity:1} }
        @keyframes chatFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes chatSlideIn { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .chat-msg { animation: chatFadeIn 0.3s ease forwards; }
        .quick-btn { background:white; border:1.5px solid #DDE5D8; border-radius:20px; padding:7px 13px; font-size:13px; font-family:'Nunito',sans-serif; color:#2D6A4F; cursor:pointer; white-space:nowrap; transition:all 0.2s; font-weight:600; display:flex; align-items:center; gap:6px; }
        .quick-btn:hover { background:#1B4332; color:white; border-color:#1B4332; transform:translateY(-1px); box-shadow:0 4px 12px rgba(27,67,50,0.2); }
        .quick-btn:hover svg { stroke: white; }
        .chat-input { flex:1; border:2px solid #DDE5D8; border-radius:24px; padding:12px 20px; font-family:'Nunito',sans-serif; font-size:15px; color:#1A1C1A; outline:none; background:#FAFCF8; transition:border-color 0.2s,box-shadow 0.2s; }
        .chat-input:focus { border-color:#40916C; background:white; box-shadow:0 0 0 3px rgba(64,145,108,0.12); }
        .chat-input::placeholder { color:#9aab9a; }
        .send-btn { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,#1B4332 0%,#40916C 100%); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; box-shadow:0 4px 12px rgba(27,67,50,0.35); }
        .send-btn:hover:not(:disabled) { transform:scale(1.08); box-shadow:0 6px 18px rgba(27,67,50,0.45); }
        .send-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
        .clear-btn { height:36px; border:1.5px solid #DDE5D8; border-radius:18px; background:white; padding:0 14px; font-size:12px; font-weight:700; font-family:'Nunito',sans-serif; color:#6B7A6B; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:5px; }
        .clear-btn:hover { border-color:#C0392B; color:#C0392B; background:#fff5f5; }
        .msg-bubble-user { background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%); color:white; border-radius:20px 20px 4px 20px; padding:12px 18px; max-width:min(75%,520px); line-height:1.6; font-size:14.5px; box-shadow:0 3px 12px rgba(27,67,50,0.22); word-break:break-word; white-space:pre-wrap; }
        .msg-bubble-bot { background:white; color:#1A1C1A; border-radius:20px 20px 20px 4px; padding:12px 18px; max-width:min(80%,580px); line-height:1.7; font-size:14.5px; border:1.5px solid #E8F0E3; box-shadow:0 2px 8px rgba(0,0,0,0.06); word-break:break-word; white-space:pre-wrap; }
        .msg-time { font-size:11px; opacity:0.55; margin-top:4px; }
        @media(max-width:600px){ .msg-bubble-user{max-width:85%;font-size:14px} .msg-bubble-bot{max-width:90%;font-size:14px} .quick-btn{font-size:12px;padding:6px 10px} }
      `}</style>

      <div className="page" style={{ background:'var(--bg)', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ background:'white', borderBottom:'1px solid var(--border)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:'var(--header-h)', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#1B4332,#40916C)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(27,67,50,0.28)' }}>
              <Bot size={22} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, color:'var(--text)', fontFamily:'Raleway,sans-serif' }}>Agri Gold AI</div>
              <div style={{ fontSize:12, color:'#40916C', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#52b788', display:'inline-block' }} />
                Online — Agriculture Expert
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="clear-btn" onClick={handleClear}>
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>

        {/* Messages area */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:4, minHeight:0, height:'calc(100vh - var(--header-h) - var(--bottom-h) - 145px)' }}>
          <div style={{ maxWidth:760, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:4, flex:1 }}>

            {/* Empty state */}
            {isEmpty && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, padding:'32px 16px', textAlign:'center', animation:'chatSlideIn 0.4s ease' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#1B4332,#40916C)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:'0 8px 24px rgba(27,67,50,0.3)' }}>
                  <Bot size={40} color="white" strokeWidth={1.5} />
                </div>
                <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text)', fontFamily:'Raleway,sans-serif', marginBottom:8 }}>
                  {lang==='te' ? 'నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని' : "Hello! I'm your Agriculture AI"}
                </h2>
                <p style={{ color:'var(--muted)', fontSize:14, maxWidth:340, lineHeight:1.6 }}>
                  {lang==='te'
                    ? 'పంట రోగాలు, నేల, వాతావరణం, మార్కెట్ ధరల గురించి అడగండి'
                    : 'Ask me about crops, soil health, weather, diseases, market prices, and more'}
                </p>
                <div style={{ marginTop:28, display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', maxWidth:480 }}>
                  {quickQuestions.map((q, i) => (
                    <button key={i} className="quick-btn" onClick={() => handleSend(q.send)}>
                      {q.icon} {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg" style={{ display:'flex', flexDirection:msg.role==='user'?'row-reverse':'row', alignItems:'flex-end', gap:10, marginBottom:8 }}>
                {msg.role==='assistant' ? <BotAvatar /> : <UserAvatar />}
                <div style={{ display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                  <div className={msg.role==='user'?'msg-bubble-user':'msg-bubble-bot'}>{msg.content}</div>
                  <div className="msg-time" style={{ textAlign:msg.role==='user'?'right':'left' }}>{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="chat-msg" style={{ display:'flex', alignItems:'flex-end', gap:10, marginBottom:8 }}>
                <BotAvatar />
                <div className="msg-bubble-bot" style={{ padding:'12px 18px' }}><TypingDots /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Quick suggestions strip */}
        {!isEmpty && messages.length > 0 && (
          <div style={{ background:'white', borderTop:'1px solid var(--border)', padding:'8px 16px', overflowX:'auto' }}>
            <div style={{ display:'flex', gap:8, maxWidth:760, margin:'0 auto', width:'max-content' }}>
              {quickQuestions.slice(0,4).map((q, i) => (
                <button key={i} className="quick-btn" onClick={() => handleSend(q.send)}>
                  {q.icon} {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div style={{ background:'white', borderTop:'1px solid var(--border)', padding:'12px 16px', paddingBottom:'max(12px, env(safe-area-inset-bottom))' }}>
          <div style={{ maxWidth:760, margin:'0 auto', display:'flex', gap:10, alignItems:'center' }}>
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend(input)}
              placeholder={t('typeMessage')}
              disabled={loading}
              autoComplete="off"
            />
            <button className="send-btn" onClick={() => handleSend(input)} disabled={loading || !input.trim()} aria-label="Send message">
              <Send size={18} color="white" />
            </button>
          </div>
          <p style={{ textAlign:'center', fontSize:11, color:'var(--muted)', marginTop:6, fontFamily:'Nunito,sans-serif' }}>
            {lang==='te' ? 'వ్యవసాయ విషయాలు మాత్రమే · Powered by Groq AI' : 'Agriculture topics only · Powered by Groq AI'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;