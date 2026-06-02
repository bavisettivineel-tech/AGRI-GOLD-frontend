import { useLang } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { lang, toggleLang } = useLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 12h20" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;