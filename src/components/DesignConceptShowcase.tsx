import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, BookOpen, Star, ChevronRight,
  SkipForward, Paintbrush, Check, Home, Mic,
} from 'lucide-react';

// ─────────────────────────────────────────────
//  WONDER WORLDS — Light Mode Design Prototype
// ─────────────────────────────────────────────

type Screen = 'welcome' | 'chapters' | 'card' | 'celebrate';

const BG    = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';
const CARD  = '#ffffff';

const SECTIONS = [
  { key: 'character', label: 'Your Hero',      icon: '🦸', color: '#FF6B6B', glow: 'rgba(255,107,107,0.15)', answered: 5, total: 5,  done: true  },
  { key: 'setting',   label: 'Your World',     icon: '🌊', color: '#00C9B1', glow: 'rgba(0,201,177,0.15)',   answered: 2, total: 5,  done: false, current: true },
  { key: 'beginning', label: 'The Beginning',  icon: '🌟', color: '#F7C948', glow: 'rgba(247,201,72,0.15)', answered: 0, total: 5,  done: false },
  { key: 'obstacles', label: 'The Challenge',  icon: '⚡', color: '#C77DFF', glow: 'rgba(199,125,255,0.15)', answered: 0, total: 6,  done: false },
  { key: 'ending',    label: 'The Ending',     icon: '🎉', color: '#06D6A0', glow: 'rgba(6,214,160,0.15)',   answered: 0, total: 4,  done: false },
];

const CARDS = [
  { question: 'What is your world called, and what makes it magical?', hint: 'Maybe it has two suns, talking animals, or candy trees!', placeholder: 'My world is called…' },
  { question: 'What does the sky look like in your world?',           hint: 'The sky sets the mood for everything below it!',         placeholder: 'The sky is…' },
  { question: 'Who else lives in your world besides your hero?',      hint: 'Friends, creatures, or mysterious neighbours?',          placeholder: 'In my world there are…' },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const SPOTS = Array.from({ length: 18 }, (_, i) => {
  const r = seededRandom(i * 137 + 7);
  return { id: i, x: r() * 100, y: r() * 100, size: r() * 5 + 3, opacity: r() * 0.12 + 0.05, color: ['#6334CD','#00C9B1','#F7C948','#FF6B6B'][i % 4] };
});

export function DesignConceptShowcase() {
  const [screen, setScreen]       = useState<Screen>('welcome');
  const [answer, setAnswer]       = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir]   = useState<'left' | 'right' | null>(null);
  const [saved, setSaved]         = useState(2);

  const activeSection = SECTIONS[1];
  const card          = CARDS[cardIndex % CARDS.length];
  const totalCards    = CARDS.length;

  const handleSave = () => {
    if (!answer.trim()) return;
    setSwipeDir('right');
    setTimeout(() => {
      const next = cardIndex + 1;
      setCardIndex(next); setSaved(c => c + 1); setAnswer(''); setSwipeDir(null);
      if (next >= totalCards) setScreen('celebrate');
    }, 380);
  };
  const handleSkip = () => {
    setSwipeDir('left');
    setTimeout(() => { setCardIndex(c => c + 1); setAnswer(''); setSwipeDir(null); }, 380);
  };

  const NAV: { s: Screen; label: string }[] = [
    { s: 'welcome',   label: '🏠 Home'     },
    { s: 'chapters',  label: '📚 Chapters' },
    { s: 'card',      label: '🃏 Card'     },
    { s: 'celebrate', label: '🎉 Win'      },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Nunito', sans-serif", color: TEXT, overflowX: 'hidden', position: 'relative' }}>

      {/* Soft decorative spots */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {SPOTS.map(s => (
          <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: '50%', background: s.color, opacity: s.opacity }} />
        ))}
      </div>

      {/* Design Concept badge */}
      <div style={{ position: 'fixed', top: '0.85rem', right: '1rem', background: 'rgba(99,52,205,0.12)', border: '1px solid rgba(99,52,205,0.2)', borderRadius: '100px', padding: '0.3rem 0.85rem', fontSize: '0.65rem', fontWeight: 900, color: '#6334CD', zIndex: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        ✦ Design Concept
      </div>

      {/* Screens */}
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: '4.5rem' }}>
        <AnimatePresence mode="wait">

          {/* ══ WELCOME ══ */}
          {screen === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
              style={{ minHeight: 'calc(100vh - 4.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}
            >
              {/* Aurora orbs */}
              <div style={{ position: 'fixed', top: '-8%', left: '15%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,52,205,0.07) 0%, transparent 65%)', animation: 'ww-aurora 9s ease-in-out infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'fixed', top: '40%', right: '-6%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,177,0.06) 0%, transparent 65%)', animation: 'ww-aurora 11s ease-in-out reverse infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'fixed', bottom: '8%', left: '-4%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,201,72,0.07) 0%, transparent 65%)', animation: 'ww-aurora 7s ease-in-out infinite', pointerEvents: 'none' }} />

              <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
                <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '28px', background: 'linear-gradient(135deg, rgba(99,52,205,0.15), rgba(0,201,177,0.12))', border: '2px solid rgba(99,52,205,0.15)', boxShadow: '0 12px 40px rgba(99,52,205,0.15)', fontSize: '2.8rem' }}>
                    📖
                  </div>
                </motion.div>

                <h1 style={{ fontSize: 'clamp(2.8rem, 10vw, 4rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '0.75rem', background: 'linear-gradient(135deg, #1A0F3C 0%, #6334CD 55%, #00C9B1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Story<br />Creator
                </h1>
                <p style={{ color: MUTED, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Create your own amazing story —<br /><span style={{ color: '#6334CD' }}>one magical card at a time</span> ✨
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <motion.button onClick={() => setScreen('chapters')} whileHover={{ scale: 1.03, boxShadow: '0 14px 40px rgba(247,201,72,0.55)' }} whileTap={{ scale: 0.97 }}
                    style={{ background: 'linear-gradient(135deg, #F7C948, #FF9500)', color: '#1A0F3C', border: 'none', borderRadius: '100px', padding: '1.1rem 2rem', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', boxShadow: '0 8px 28px rgba(247,201,72,0.4)', fontFamily: 'inherit' }}
                  >
                    <Sparkles size={20} /> Let's Create My Story!
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ background: '#fff', color: MUTED, border: '2px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', boxShadow: '0 2px 12px rgba(99,52,205,0.08)', fontFamily: 'inherit' }}
                  >
                    <BookOpen size={18} /> My Story Library
                    <span style={{ background: '#FF6B6B', color: '#fff', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, padding: '1px 7px' }}>3</span>
                  </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '2.5rem' }}>
                  {['🎨', '✨', '📚', '🌟', '🖊️'].map((emoji, i) => (
                    <motion.span key={i} animate={{ y: [0, -9, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, delay: i * 0.25 }} style={{ fontSize: '1.55rem' }}>{emoji}</motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ CHAPTERS ══ */}
          {screen === 'chapters' && (
            <motion.div key="chapters" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}
              style={{ minHeight: 'calc(100vh - 4.5rem)', padding: '1.5rem', maxWidth: '640px', margin: '0 auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <motion.button onClick={() => setScreen('welcome')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.5rem 1rem', color: MUTED, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.07)' }}
                >
                  <Home size={14} /> Home
                </motion.button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#6334CD', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Story Journey</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: MUTED, fontWeight: 800 }}>{Math.round((saved / 25) * 100)}% done</div>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: TEXT, marginBottom: '0.4rem' }}>Your Story Journey</h1>
              <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Each chapter is a new world. Jump in anywhere!</p>

              <div style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.1)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.75rem', boxShadow: '0 3px 16px rgba(99,52,205,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', color: MUTED, fontWeight: 800 }}>Overall progress</span>
                  <span style={{ fontSize: '0.82rem', color: '#6334CD', fontWeight: 900 }}>{saved} of 25 cards</span>
                </div>
                <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '7px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(saved / 25) * 100}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: 'linear-gradient(90deg, #6334CD, #00C9B1)', borderRadius: '100px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {SECTIONS.map((sec, i) => (
                  <motion.button key={sec.key} onClick={() => { if (sec.current) setScreen('card'); }} whileHover={{ scale: 1.012, x: sec.current ? 3 : 0 }} whileTap={{ scale: 0.988 }}
                    style={{ background: '#fff', border: `2px solid ${sec.current ? sec.color + '55' : 'rgba(99,52,205,0.08)'}`, borderRadius: '20px', padding: '1.1rem', cursor: sec.current ? 'pointer' : 'default', textAlign: 'left', color: TEXT, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: sec.current ? `0 6px 28px ${sec.glow}` : '0 2px 10px rgba(99,52,205,0.06)', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  >
                    <div style={{ width: '50px', height: '50px', flexShrink: 0, borderRadius: '14px', background: `linear-gradient(135deg, ${sec.color}22, ${sec.color}10)`, border: `2px solid ${sec.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', opacity: sec.done || sec.current ? 1 : 0.55 }}>
                      {sec.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>Ch. {i + 1}: {sec.label}</span>
                        {sec.done    && <span style={{ background: 'rgba(6,214,160,0.15)', color: '#06D6A0', fontSize: '0.6rem', fontWeight: 900, padding: '2px 7px', borderRadius: '100px' }}>✓ DONE</span>}
                        {sec.current && <span style={{ background: sec.color, color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>In Progress</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {Array.from({ length: sec.total }).map((_, di) => (
                          <div key={di} style={{ flex: 1, height: '4px', borderRadius: '100px', background: di < sec.answered ? sec.color : '#EDE9FF', transition: 'background 0.3s' }} />
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={18} color={sec.current ? sec.color : 'rgba(99,52,205,0.25)'} style={{ flexShrink: 0 }} />
                  </motion.button>
                ))}
              </div>

              <div style={{ marginTop: '1.75rem', background: 'rgba(247,201,72,0.1)', border: '1.5px solid rgba(247,201,72,0.3)', borderRadius: '16px', padding: '1.1rem' }}>
                <p style={{ color: '#9A7B10', fontWeight: 900, fontSize: '0.85rem', marginBottom: '0.2rem' }}>💡 Story Tip</p>
                <p style={{ color: '#7A6010', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>You can work on any chapter in any order! Sometimes writing the ending first helps you figure out the perfect beginning.</p>
              </div>
            </motion.div>
          )}

          {/* ══ CARD ══ */}
          {screen === 'card' && (
            <motion.div key="card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}
              style={{ minHeight: 'calc(100vh - 4.5rem)', display: 'flex', flexDirection: 'column', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'fixed', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${activeSection.glow} 0%, transparent 65%)`, pointerEvents: 'none', animation: 'ww-aurora 9s ease-in-out infinite', zIndex: 0 }} />

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <motion.button onClick={() => setScreen('chapters')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.5rem 1rem', color: MUTED, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.07)' }}>
                  <Home size={14} /> Chapters
                </motion.button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: activeSection.color, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{activeSection.icon} {activeSection.label}</div>
                  <div style={{ color: MUTED, fontSize: '0.78rem' }}>Card {(cardIndex % totalCards) + 1} of {totalCards}</div>
                </div>
                <div style={{ width: '80px' }} />
              </div>

              <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '5px', marginBottom: '1.25rem', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
                <motion.div animate={{ width: `${(((cardIndex % totalCards) + 1) / totalCards) * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: `linear-gradient(90deg, ${activeSection.color}, ${activeSection.color}bb)`, borderRadius: '100px' }} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '0.75rem', color: MUTED, fontSize: '0.78rem', position: 'relative', zIndex: 2 }}>← Skip &nbsp;|&nbsp; Swipe to save →</div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                {[2, 1].map(offset => (
                  <div key={offset} style={{ position: 'absolute', width: 'calc(100% - 1rem)', maxWidth: '500px', background: CARD, borderRadius: '28px', height: '440px', transform: `scale(${1 - offset * 0.045}) translateY(${offset * 14}px)`, opacity: 1 - offset * 0.28, zIndex: 10 - offset, boxShadow: '0 8px 40px rgba(99,52,205,0.1)', borderTop: `5px solid ${activeSection.color}${offset === 1 ? '60' : '30'}` }} />
                ))}

                <AnimatePresence mode="wait">
                  <motion.div key={cardIndex} initial={{ scale: 0.88, opacity: 0, y: 18 }}
                    animate={swipeDir ? { x: swipeDir === 'right' ? 420 : -420, opacity: 0, rotate: swipeDir === 'right' ? 18 : -18 } : { scale: 1, opacity: 1, y: 0, rotate: 0, x: 0 }}
                    transition={swipeDir ? { type: 'spring', stiffness: 280, damping: 26 } : { type: 'spring', stiffness: 360, damping: 32 }}
                    style={{ position: 'relative', width: 'calc(100% - 1rem)', maxWidth: '500px', background: CARD, borderRadius: '28px', padding: '1.75rem', zIndex: 20, boxShadow: `0 12px 50px rgba(99,52,205,0.12), 0 0 50px ${activeSection.glow}`, borderTop: `5px solid ${activeSection.color}` }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: `${activeSection.color}15`, border: `1.5px solid ${activeSection.color}35`, borderRadius: '100px', padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 900, color: activeSection.color, marginBottom: '1.1rem' }}>
                      <Sparkles size={12} /> Creative Companion
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: TEXT, marginBottom: '1rem', lineHeight: 1.35 }}>{card.question}</h2>
                    <div style={{ background: 'rgba(247,201,72,0.1)', border: '1.5px solid rgba(247,201,72,0.3)', borderRadius: '12px', padding: '0.7rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>💡</span>
                      <p style={{ fontSize: '0.82rem', color: '#7A6010', lineHeight: 1.45, margin: 0 }}>{card.hint}</p>
                    </div>
                    <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder={card.placeholder} rows={3}
                      style={{ width: '100%', background: '#F0EDFF', border: `2px solid ${answer ? activeSection.color + '60' : 'transparent'}`, borderRadius: '14px', padding: '0.8rem', fontSize: '0.95rem', fontFamily: 'inherit', color: TEXT, resize: 'none', lineHeight: 1.5, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {[{ icon: <Mic size={14} />, label: 'Speak It' }, { icon: <Paintbrush size={14} />, label: 'Draw It' }].map(btn => (
                        <button key={btn.label} style={{ flex: 1, background: '#EDE9FF', border: 'none', borderRadius: '10px', padding: '0.6rem', fontSize: '0.8rem', fontWeight: 800, color: '#6334CD', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: 'inherit' }}>{btn.icon} {btn.label}</button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div style={{ position: 'absolute', left: '0.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: '#FF6B6B', color: '#fff', borderRadius: '100px', padding: '0.45rem 0.9rem', fontWeight: 900, fontSize: '0.8rem', opacity: 0.35, boxShadow: '0 3px 12px rgba(255,107,107,0.3)' }}>← SKIP</div>
                <div style={{ position: 'absolute', right: '0.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: activeSection.color, color: '#fff', borderRadius: '100px', padding: '0.45rem 0.9rem', fontWeight: 900, fontSize: '0.8rem', opacity: answer ? 0.95 : 0.35, transition: 'opacity 0.2s', boxShadow: `0 3px 12px ${activeSection.glow}` }}>SAVE →</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', position: 'relative', zIndex: 2 }}>
                <motion.button onClick={handleSkip} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{ flex: 1, background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 800, color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.06)' }}>
                  <SkipForward size={15} /> Skip
                </motion.button>
                <motion.button onClick={handleSave} whileHover={{ scale: answer.trim() ? 1.04 : 1 }} whileTap={{ scale: answer.trim() ? 0.96 : 1 }}
                  style={{ flex: 2, background: answer.trim() ? `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}bb)` : '#EDE9FF', border: 'none', borderRadius: '100px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 900, color: answer.trim() ? '#fff' : MUTED, cursor: answer.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: answer.trim() ? `0 6px 22px ${activeSection.glow}` : 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  Save & Next <ChevronRight size={17} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ CELEBRATE ══ */}
          {screen === 'celebrate' && (
            <motion.div key="celebrate" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ minHeight: 'calc(100vh - 4.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}
            >
              <div style={{ position: 'fixed', top: '-5%', left: '25%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,177,0.1) 0%, transparent 65%)', animation: 'ww-aurora 7s ease-in-out infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,201,72,0.1) 0%, transparent 65%)', animation: 'ww-aurora 9s ease-in-out reverse infinite', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '380px', width: '100%' }}>
                <motion.div animate={{ y: [0, -16, 0], rotate: [0, 6, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity }} style={{ fontSize: '5rem', marginBottom: '1.25rem', display: 'block' }}>🎉</motion.div>

                <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '0.6rem', background: `linear-gradient(135deg, ${activeSection.color}, #00C9B1)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Chapter Complete!
                </h1>
                <p style={{ color: TEXT, fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  You've answered all the cards for <strong style={{ color: activeSection.color }}>Chapter 2: Your World</strong>. Ready for the next adventure?
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                  {[1, 2, 3].map(i => (
                    <motion.div key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 280 }}>
                      <Star size={40} fill="#F7C948" color="#F7C948" />
                    </motion.div>
                  ))}
                </div>

                <div style={{ background: 'rgba(247,201,72,0.1)', border: '1.5px solid rgba(247,201,72,0.28)', borderRadius: '18px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ fontSize: '1.6rem' }}>🌟</div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ color: '#9A7B10', fontWeight: 900, fontSize: '0.78rem', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Up Next</p>
                    <p style={{ color: TEXT, fontWeight: 900, fontSize: '0.95rem', margin: 0 }}>Chapter 3: The Beginning</p>
                  </div>
                  <ChevronRight size={18} color="rgba(154,123,16,0.5)" style={{ marginLeft: 'auto' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <motion.button onClick={() => { setScreen('chapters'); setCardIndex(0); setAnswer(''); }} whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(247,201,72,0.5)' }} whileTap={{ scale: 0.97 }}
                    style={{ background: 'linear-gradient(135deg, #F7C948, #FF9500)', color: '#1A0F3C', border: 'none', borderRadius: '100px', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 28px rgba(247,201,72,0.38)', fontFamily: 'inherit' }}>
                    <ChevronRight size={18} /> Next Chapter
                  </motion.button>
                  <motion.button onClick={() => setScreen('chapters')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ background: '#fff', color: MUTED, border: '2px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.85rem 2rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Back to All Chapters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(248,245,255,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(99,52,205,0.1)', padding: '0.7rem 1.5rem 0.75rem', display: 'flex', justifyContent: 'space-around', zIndex: 200 }}>
        {NAV.map(({ s, label }) => {
          const active = screen === s;
          return (
            <button key={s} onClick={() => { if (s === 'card') { setCardIndex(0); setAnswer(''); } setScreen(s); }}
              style={{ background: 'none', border: 'none', color: active ? '#6334CD' : MUTED, fontSize: '0.78rem', fontWeight: active ? 900 : 700, cursor: 'pointer', padding: '0.25rem 0.5rem', borderBottom: `2px solid ${active ? '#6334CD' : 'transparent'}`, transition: 'all 0.2s', fontFamily: 'inherit' }}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
