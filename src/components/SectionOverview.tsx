import { motion } from 'motion/react';
import { StorySection, StoryAnswer } from '../types/story';
import { Check, ChevronRight, BookOpen, Home, Sparkles } from 'lucide-react';

interface SectionOverviewProps {
  sections: StorySection[];
  currentSection: number;
  answers: Map<string, StoryAnswer>;
  onSelectSection: (sectionIndex: number) => void;
  onGoHome: () => void;
  onPreviewStory?: () => void;
}

const BG   = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';

const SECTION_STYLE = [
  { icon: '🦸', color: '#FF6B6B', glow: 'rgba(255,107,107,0.12)' },
  { icon: '🌊', color: '#00C9B1', glow: 'rgba(0,201,177,0.12)'   },
  { icon: '🌟', color: '#F7C948', glow: 'rgba(247,201,72,0.12)'  },
  { icon: '⚡', color: '#C77DFF', glow: 'rgba(199,125,255,0.12)' },
  { icon: '🎉', color: '#06D6A0', glow: 'rgba(6,214,160,0.12)'   },
];

export function SectionOverview({
  sections, currentSection, answers,
  onSelectSection, onGoHome, onPreviewStory,
}: SectionOverviewProps) {

  const getSectionProgress = (section: StorySection) => {
    const answered  = section.cards.filter(c => answers.has(c.id)).length;
    const total     = section.cards.length;
    return { answered, total, pct: (answered / total) * 100, done: answered === total, started: answered > 0 };
  };

  const totalCards   = sections.reduce((s, sec) => s + sec.cards.length, 0);
  const answeredAll  = answers.size;
  const overallPct   = Math.round((answeredAll / totalCards) * 100);
  const canPreview   = answers.size >= 3;

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Aurora orbs */}
      <div style={{ position: 'fixed', top: '-5%', right: '10%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,52,205,0.06) 0%, transparent 65%)', animation: 'ww-aurora 10s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '-3%', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,177,0.05) 0%, transparent 65%)', animation: 'ww-aurora 8s ease-in-out reverse infinite', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <motion.button
            onClick={onGoHome}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)',
              borderRadius: '100px', padding: '0.5rem 1rem',
              color: MUTED, cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: 800, display: 'flex', alignItems: 'center',
              gap: '0.4rem', fontFamily: 'inherit',
              boxShadow: '0 2px 10px rgba(99,52,205,0.07)',
            }}
          >
            <Home size={14} /> Home
          </motion.button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#6334CD', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Story Journey
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: MUTED, fontWeight: 800 }}>{overallPct}% done</div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: TEXT, marginBottom: '0.4rem' }}>
          Your Story Journey
        </h1>
        <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Each chapter is a new adventure. Jump in anywhere!
        </p>

        {/* Overall progress */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(99,52,205,0.1)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          boxShadow: '0 3px 16px rgba(99,52,205,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
            <span style={{ fontSize: '0.82rem', color: MUTED, fontWeight: 800 }}>Overall progress</span>
            <span style={{ fontSize: '0.82rem', color: '#6334CD', fontWeight: 900 }}>{answeredAll} of {totalCards} cards</span>
          </div>
          <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '7px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #6334CD, #00C9B1)', borderRadius: '100px' }}
            />
          </div>
        </div>

        {/* Section rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {sections.map((section, i) => {
            const prog    = getSectionProgress(section);
            const style   = SECTION_STYLE[i] || SECTION_STYLE[0];
            const isCurrent = i === currentSection;

            return (
              <motion.button
                key={section.id}
                onClick={() => onSelectSection(i)}
                whileHover={{ scale: 1.012, x: 3 }}
                whileTap={{ scale: 0.988 }}
                style={{
                  background: '#fff',
                  border: `2px solid ${isCurrent ? style.color + '60' : 'rgba(99,52,205,0.08)'}`,
                  borderRadius: '20px',
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: TEXT,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: isCurrent
                    ? `0 6px 28px ${style.glow}, 0 2px 8px rgba(0,0,0,0.05)`
                    : '0 2px 10px rgba(99,52,205,0.06)',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {/* Icon chip */}
                <div style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  borderRadius: '15px',
                  background: `linear-gradient(135deg, ${style.color}22, ${style.color}12)`,
                  border: `2px solid ${style.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.55rem',
                }}>
                  {style.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', color: TEXT }}>
                      Ch. {i + 1}: {section.name}
                    </span>
                    {isCurrent && (
                      <span style={{ background: style.color, color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        In Progress
                      </span>
                    )}
                    {prog.done && (
                      <span style={{ background: 'rgba(6,214,160,0.15)', color: '#06D6A0', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px' }}>
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: MUTED, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    {section.description}
                  </p>

                  {/* Progress pips */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {section.cards.map((card, di) => (
                      <div key={card.id} style={{
                        flex: 1, height: '4px', borderRadius: '100px',
                        background: answers.has(card.id) ? style.color : '#EDE9FF',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Status icon / arrow */}
                <div style={{ flexShrink: 0 }}>
                  {prog.done ? (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(6,214,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={18} color="#06D6A0" />
                    </div>
                  ) : (
                    <ChevronRight size={20} color={isCurrent ? style.color : 'rgba(99,52,205,0.25)'} />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Story tip */}
        <div style={{
          marginTop: '1.75rem',
          background: 'rgba(247,201,72,0.1)',
          border: '1.5px solid rgba(247,201,72,0.3)',
          borderRadius: '18px',
          padding: '1.1rem 1.25rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}>
          <BookOpen size={22} color="#F7C948" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ color: '#9A7B10', fontWeight: 900, fontSize: '0.85rem', marginBottom: '0.2rem' }}>💡 Story Tip</p>
            <p style={{ color: '#7A6010', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
              You can work on any chapter in any order! Sometimes writing the ending first helps you figure out the perfect beginning.
            </p>
          </div>
        </div>

        {/* Preview story CTA */}
        {canPreview && onPreviewStory && (
          <div style={{ marginTop: '1.5rem' }}>
            <motion.button
              onClick={onPreviewStory}
              whileHover={{ scale: 1.02, boxShadow: '0 14px 40px rgba(247,201,72,0.45)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F7C948 0%, #FF9500 100%)',
                color: '#1A0F3C', border: 'none',
                borderRadius: '100px', padding: '1rem 2rem',
                fontSize: '1.05rem', fontWeight: 900,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 28px rgba(247,201,72,0.35)',
                fontFamily: 'inherit',
              }}
            >
              <Sparkles size={20} />
              {overallPct < 100 ? 'Preview My Story So Far' : 'See My Complete Story!'}
            </motion.button>
            <p style={{ textAlign: 'center', color: MUTED, fontSize: '0.82rem', marginTop: '0.6rem' }}>
              {overallPct < 100
                ? 'Your story gets better as you add more details!'
                : 'Your story is complete! Time to read it!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
