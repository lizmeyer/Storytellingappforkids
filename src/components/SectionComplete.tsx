import { motion } from 'motion/react';
import { Sparkles, ArrowRight, List, Eye, Star } from 'lucide-react';

interface SectionCompleteProps {
  sectionName: string;
  onContinue: () => void;
  onViewAllSections?: () => void;
  onReviewCards?: () => void;
  isLastSection?: boolean;
}

const BG   = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';

export function SectionComplete({ sectionName, onContinue, onViewAllSections, onReviewCards, isLastSection }: SectionCompleteProps) {
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
      <div style={{ position: 'fixed', top: '-5%', left: '20%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,177,0.08) 0%, transparent 65%)', animation: 'ww-aurora 7s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,201,72,0.09) 0%, transparent 65%)', animation: 'ww-aurora 9s ease-in-out reverse infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '0%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(199,125,255,0.07) 0%, transparent 65%)', animation: 'ww-aurora 6s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px', width: '100%', textAlign: 'center' }}>

        {/* Celebration emoji */}
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '5rem', marginBottom: '1.25rem', display: 'block' }}
        >
          {isLastSection ? '🎉' : '⭐'}
        </motion.div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: '0.6rem',
          background: isLastSection
            ? 'linear-gradient(135deg, #F7C948, #FF9500)'
            : 'linear-gradient(135deg, #6334CD, #00C9B1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {isLastSection ? 'Story Complete!' : `${sectionName} Complete!`}
        </h1>

        <p style={{ color: TEXT, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          {isLastSection
            ? "You've created an amazing story! Let's see what you made."
            : "Great work! You're doing an amazing job on your story."}
        </p>

        {!isLastSection && (
          <p style={{ color: MUTED, fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            Want to make changes? You can review and edit your cards anytime!
          </p>
        )}

        {isLastSection && <div style={{ marginBottom: '1.75rem' }} />}

        {/* Stars earned */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.18, type: 'spring', stiffness: 280, damping: 18 }}
            >
              <Star size={40} fill="#F7C948" color="#F7C948" />
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.03, boxShadow: '0 14px 40px rgba(247,201,72,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #F7C948 0%, #FF9500 100%)',
              color: '#1A0F3C', border: 'none',
              borderRadius: '100px', padding: '1.1rem 2rem',
              fontSize: '1.05rem', fontWeight: 900,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 28px rgba(247,201,72,0.38)',
              fontFamily: 'inherit',
            }}
          >
            {isLastSection ? (
              <><Sparkles size={20} /> View My Story</>
            ) : (
              <>Next Chapter <ArrowRight size={20} /></>
            )}
          </motion.button>

          {onReviewCards && (
            <motion.button
              onClick={onReviewCards}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                background: '#fff', color: '#6334CD',
                border: '2px solid rgba(99,52,205,0.2)',
                borderRadius: '100px', padding: '0.95rem 2rem',
                fontSize: '0.95rem', fontWeight: 800,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 12px rgba(99,52,205,0.08)',
                fontFamily: 'inherit',
              }}
            >
              <Eye size={17} /> Review & Edit This Section
            </motion.button>
          )}

          {onViewAllSections && !isLastSection && (
            <motion.button
              onClick={onViewAllSections}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                background: 'transparent', color: MUTED,
                border: '1.5px solid rgba(99,52,205,0.15)',
                borderRadius: '100px', padding: '0.9rem 2rem',
                fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', fontFamily: 'inherit',
              }}
            >
              <List size={16} /> View All Chapters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
