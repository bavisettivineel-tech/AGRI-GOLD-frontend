import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSend: (msg: string) => void;
  loading: boolean;
  onClear: () => void;
}

const ChatBox = ({ messages, onSend, loading, onClear }: ChatBoxProps) => {
  const { t } = useLang();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="mr-3 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3a9 9 0 00-9 9v6a3 3 0 003 3h4l3 3 3-3h4a3 3 0 003-3v-6a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 13h8M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <div className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-7 ${msg.role === 'user' ? 'rounded-br-none bg-emerald-600 text-white' : 'rounded-bl-none bg-slate-50 text-slate-900 shadow-sm'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="ml-3 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2a7 7 0 00-7 7c0 4.97 5 11 7 13 2-2 7-8.03 7-13a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 10v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3a9 9 0 00-9 9v6a3 3 0 003 3h4l3 3 3-3h4a3 3 0 003-3v-6a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 13h8M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600" />
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600 opacity-80" />
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600 opacity-60" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('send')}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
