import { useState, useEffect } from 'react';
import { Mic, Keyboard, Volume2, RotateCcw } from 'lucide-react';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onComplete: () => void;
  accentColor?: string;
}

const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';

export function VoiceInput({ value, onChange, placeholder, onComplete, accentColor = '#6334CD' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [useKeyboard, setUseKeyboard] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const r  = new SR();
      r.continuous      = false;
      r.interimResults  = false;
      r.lang            = 'en-US';
      r.onresult = (e: any) => { onChange(e.results[0][0].transcript); setIsListening(false); };
      r.onerror  = () => setIsListening(false);
      r.onend    = () => setIsListening(false);
      setRecognition(r);
    }
  }, [onChange]);

  const startListening = () => { if (recognition) { setIsListening(true); recognition.start(); } };
  const stopListening  = () => { if (recognition) { recognition.stop(); setIsListening(false); } };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(placeholder);
      u.rate  = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) { e.preventDefault(); onComplete(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontFamily: "'Nunito', sans-serif" }}>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {[
          { label: '🎙 Speak', key: false, icon: <Mic size={14} /> },
          { label: '⌨ Type',   key: true,  icon: <Keyboard size={14} /> },
        ].map(btn => (
          <button
            key={String(btn.key)}
            onClick={() => setUseKeyboard(btn.key)}
            style={{
              background: useKeyboard === btn.key ? accentColor : '#EDE9FF',
              color: useKeyboard === btn.key ? '#fff' : MUTED,
              border: 'none', borderRadius: '100px',
              padding: '0.45rem 1rem', fontSize: '0.82rem',
              fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontFamily: 'inherit',
              boxShadow: useKeyboard === btn.key ? `0 3px 12px ${accentColor}40` : 'none',
              transition: 'all 0.2s',
            }}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
        <button
          onClick={speakQuestion}
          title="Read question aloud"
          style={{ background: '#EDE9FF', border: 'none', borderRadius: '100px', padding: '0.45rem 0.75rem', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', fontFamily: 'inherit' }}
        >
          <Volume2 size={14} />
        </button>
      </div>

      {/* Keyboard mode */}
      {useKeyboard ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows={4}
          style={{
            width: '100%',
            background: '#F0EDFF',
            border: `2px solid ${value ? accentColor + '55' : 'transparent'}`,
            borderRadius: '14px',
            padding: '0.85rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
            color: TEXT,
            resize: 'none',
            lineHeight: 1.55,
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        /* Voice mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!recognition}
            style={{
              width: '88px', height: '88px',
              borderRadius: '50%',
              border: 'none',
              background: isListening
                ? 'linear-gradient(135deg, #FF3B30, #FF6B6B)'
                : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: recognition ? 'pointer' : 'not-allowed',
              opacity: recognition ? 1 : 0.5,
              boxShadow: isListening
                ? '0 8px 30px rgba(255,59,48,0.45)'
                : `0 8px 30px ${accentColor}45`,
              animation: isListening ? 'pulse 1.2s ease-in-out infinite' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Mic size={36} color="#fff" />
          </button>

          {isListening && (
            <p style={{ color: accentColor, fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>
              🎙 Listening…
            </p>
          )}

          {!recognition && (
            <p style={{ color: MUTED, fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>
              Voice input not available in this browser. Switch to Type mode.
            </p>
          )}

          {value && (
            <div style={{
              background: `${accentColor}10`,
              border: `1.5px solid ${accentColor}30`,
              borderRadius: '14px', padding: '1rem',
              width: '100%', position: 'relative',
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: TEXT, lineHeight: 1.5 }}>{value}</p>
              <button
                onClick={() => onChange('')}
                style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: MUTED, display: 'flex', alignItems: 'center',
                  gap: '0.3rem', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'inherit',
                }}
              >
                <RotateCcw size={12} /> Re-record
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #b0a8d0; }
      `}</style>
    </div>
  );
}
