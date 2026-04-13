import { motion } from 'motion/react';
import { Sparkles, BookOpen } from 'lucide-react';
import { getLastUpdated } from '../utils/localStorage';
import { getAllStories } from '../utils/storyLibrary';

interface WelcomeScreenProps {
  onStart: () => void;
  isReturning?: boolean;
  progress?: number;
  onViewLibrary?: () => void;
}

const BG   = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';

const AURORA_ORBS = [
  { top: '-8%',  left: '15%',  w: 520, h: 520, color: 'rgba(99,52,205,0.07)',   dur: 9,  dir: 1  },
  { top: '35%',  right: '-6%', w: 400, h: 400, color: 'rgba(0,201,177,0.06)',   dur: 11, dir: -1 },
  { bottom: '5%',left: '-4%',  w: 320, h: 320, color: 'rgba(247,201,72,0.07)',  dur: 7,  dir: 1  },
];

export function WelcomeScreen({ onStart, isReturning, progress = 0, onViewLibrary }: WelcomeScreenProps) {
  const lastUpdated = getLastUpdated();
  const savedStories = getAllStories();
  const storyCount = savedStories.length;

  const formatLastSaved = (ts: number) => {
    const diffMs = Date.now() - ts;
    const mins  = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days  = Math.floor(diffMs / 86400000);
    if (mins < 1)   return 'just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Aurora orbs */}
      {AURORA_ORBS.map((o, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: o.top, left: o.left, right: (o as any).right, bottom: (o as any).bottom,
          width: o.w, height: o.h,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 65%)`,
          animation: `ww-aurora ${o.dur}s ease-in-out ${o.dir === -1 ? 'reverse' : ''} infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '420px', width: '100%' }}>

        {/* Floating book icon */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginBottom: '1.5rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '96px', height: '96px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(99,52,205,0.15), rgba(0,201,177,0.12))',
            border: '2px solid rgba(99,52,205,0.15)',
            boxShadow: '0 12px 40px rgba(99,52,205,0.15)',
            fontSize: '2.8rem',
          }}>
            📖
          </div>
        </motion.div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 10vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #1A0F3C 0%, #6334CD 55%, #00C9B1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Story<br />Creator
        </h1>

        <p style={{ color: MUTED, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {isReturning
            ? 'Welcome back! Your story is waiting ✨'
            : 'Create your own amazing story — one magical card at a time ✨'}
        </p>

        {/* Returning-user progress card */}
        {isReturning && progress > 0 && (
          <div style={{
            background: '#fff',
            border: '2px solid rgba(99,52,205,0.12)',
            borderRadius: '20px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(99,52,205,0.08)',
          }}>
            <p style={{ color: TEXT, fontWeight: 800, marginBottom: '0.25rem' }}>
              Your story is <span style={{ color: '#6334CD' }}>{Math.round(progress)}% complete!</span>
            </p>
            {lastUpdated && (
              <p style={{ color: MUTED, fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                Last saved {formatLastSaved(lastUpdated)}
              </p>
            )}
            <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '7px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #6334CD, #00C9B1)', borderRadius: '100px' }}
              />
            </div>
          </div>
        )}

        {/* How it works — new users only */}
        {!isReturning && (
          <div style={{
            background: '#fff',
            border: '2px solid rgba(99,52,205,0.1)',
            borderRadius: '20px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 20px rgba(99,52,205,0.07)',
            textAlign: 'left',
          }}>
            <p style={{ color: TEXT, fontWeight: 800, textAlign: 'center', marginBottom: '1rem' }}>How it works:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { n: '1', label: 'Answer fun questions about your story' },
                { n: '2', label: 'Speak, type, or draw your answers' },
                { n: '3', label: 'Watch your complete story come to life' },
              ].map(({ n, label }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6334CD, #9B79FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 900, fontSize: '0.85rem',
                    boxShadow: '0 3px 10px rgba(99,52,205,0.25)',
                  }}>
                    {n}
                  </div>
                  <p style={{ color: TEXT, margin: 0, fontWeight: 700 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.03, boxShadow: '0 14px 40px rgba(247,201,72,0.5)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F7C948 0%, #FF9500 100%)',
            color: '#1A0F3C',
            border: 'none',
            borderRadius: '100px',
            padding: '1.1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            boxShadow: '0 8px 28px rgba(247,201,72,0.38)',
            marginBottom: '0.85rem',
            fontFamily: 'inherit',
          }}
        >
          <Sparkles size={20} />
          {isReturning ? 'Continue My Story' : "Let's Create My Story!"}
        </motion.button>

        {/* Library button */}
        {onViewLibrary && (
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <motion.button
              onClick={onViewLibrary}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                background: '#fff',
                color: MUTED,
                border: '2px solid rgba(99,52,205,0.15)',
                borderRadius: '100px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 2px 12px rgba(99,52,205,0.07)',
                fontFamily: 'inherit',
              }}
            >
              <BookOpen size={18} />
              My Story Library
            </motion.button>
            {storyCount > 0 && (
              <div style={{
                position: 'absolute', top: '-8px', right: '12px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF9500)',
                color: '#fff',
                borderRadius: '100px',
                width: '26px', height: '26px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 900,
                boxShadow: '0 2px 8px rgba(255,107,107,0.4)',
              }}>
                {storyCount}
              </div>
            )}
          </div>
        )}

        {/* Floating emoji row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '2.25rem' }}>
          {['🎨', '✨', '📚', '🌟', '🖊️'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2 + i * 0.35, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
              style={{ fontSize: '1.5rem' }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
