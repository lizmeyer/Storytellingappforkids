import { useEffect } from 'react';
import { motion } from 'motion/react';
import { STORY_SECTIONS } from '../types/story';
import { Sparkles, Check } from 'lucide-react';

interface ProgressInterstitialProps {
  currentSection: number;
  currentCard: number;
  totalAnswers: number;
  onComplete: () => void;
  duration?: number;
}

const BG   = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';

const SECTION_STYLE = [
  { color: '#FF6B6B' },
  { color: '#00C9B1' },
  { color: '#F7C948' },
  { color: '#C77DFF' },
  { color: '#06D6A0' },
];

export function ProgressInterstitial({
  currentSection, currentCard, totalAnswers,
  onComplete, duration = 2000,
}: ProgressInterstitialProps) {

  useEffect(() => {
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  const totalCards   = STORY_SECTIONS.reduce((s, sec) => s + sec.cards.length, 0);
  const progressPct  = (totalAnswers / totalCards) * 100;
  const secData      = STORY_SECTIONS[currentSection];
  const secProgress  = currentCard + 1;
  const secTotal     = secData.cards.length;
  const secColor     = SECTION_STYLE[currentSection]?.color ?? '#6334CD';

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
      <div style={{ position: 'fixed', top: '-5%', left: '15%', width: '460px', height: '460px', borderRadius: '50%', background: `radial-gradient(circle, ${secColor}12 0%, transparent 65%)`, animation: 'ww-aurora 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,52,205,0.06) 0%, transparent 65%)', animation: 'ww-aurora 10s ease-in-out reverse infinite', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', width: '100%' }}>

        {/* Animated sparkle orb */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '88px', height: '88px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${secColor}, #6334CD)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 12px 40px ${secColor}40`,
              }}
            >
              <Sparkles size={40} color="#fff" />
            </motion.div>
            {/* Pulse ring */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: `3px solid ${secColor}50`,
              animation: 'ww-pulse-ring 1.8s ease-out infinite',
            }} />
          </div>
        </div>

        {/* Message */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: TEXT, marginBottom: '0.4rem' }}>
            Great job! 🌟
          </h2>
          <p style={{ color: MUTED, fontSize: '1.05rem' }}>
            You're <strong style={{ color: secColor }}>{Math.round(progressPct)}%</strong> done with your story
          </p>
        </div>

        {/* Progress cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
          {/* Overall */}
          <div style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.1)', borderRadius: '18px', padding: '1.1rem 1.25rem', boxShadow: '0 3px 16px rgba(99,52,205,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
              <span style={{ fontSize: '0.82rem', color: MUTED, fontWeight: 800 }}>Overall Progress</span>
              <span style={{ fontSize: '0.82rem', color: '#6334CD', fontWeight: 900 }}>{totalAnswers} of {totalCards} cards</span>
            </div>
            <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #6334CD, #00C9B1)', borderRadius: '100px' }}
              />
            </div>
          </div>

          {/* Current section */}
          <div style={{ background: '#fff', border: `1.5px solid ${secColor}30`, borderRadius: '18px', padding: '1.1rem 1.25rem', boxShadow: `0 3px 16px ${secColor}15` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
              <span style={{ fontSize: '0.82rem', color: MUTED, fontWeight: 800 }}>{secData.name}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: secColor }}>{secProgress} of {secTotal} cards</span>
            </div>
            <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(secProgress / secTotal) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${secColor}, ${secColor}aa)`, borderRadius: '100px' }}
              />
            </div>
          </div>
        </div>

        {/* Section journey checklist */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.1)', borderRadius: '18px', padding: '1.1rem 1.25rem', boxShadow: '0 3px 16px rgba(99,52,205,0.07)' }}>
          <p style={{ color: TEXT, fontWeight: 900, textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>Your Story Journey</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {STORY_SECTIONS.map((sec, i) => {
              const done    = i < currentSection;
              const current = i === currentSection;
              const sc      = SECTION_STYLE[i]?.color ?? '#6334CD';

              return (
                <div
                  key={sec.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: current ? `${sc}12` : 'transparent',
                    border: current ? `1.5px solid ${sc}30` : '1.5px solid transparent',
                  }}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    background: done ? '#06D6A0' : current ? sc : '#EDE9FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done
                      ? <Check size={14} color="#fff" />
                      : <span style={{ color: done || current ? '#fff' : MUTED, fontSize: '0.75rem', fontWeight: 900 }}>{i + 1}</span>
                    }
                  </div>
                  <span style={{
                    fontWeight: current ? 900 : 700,
                    color: current ? sc : done ? TEXT : MUTED,
                    fontSize: '0.9rem',
                  }}>
                    {sec.name}
                  </span>
                  {current && (
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Sparkles size={14} color={sc} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
