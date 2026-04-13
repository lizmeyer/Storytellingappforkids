import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { VoiceInput } from './VoiceInput';
import { DrawingCanvas } from './DrawingCanvas';
import {
  Paintbrush, MessageSquare, X, SkipForward, Lightbulb,
  Sparkles, ChevronRight, RotateCcw, Loader2, Grid3x3, Check, Home,
} from 'lucide-react';
import { StoryAnswer, StorySection } from '../types/story';
import { analyzeDrawing, getCardTypeFromId } from '../utils/drawingAnalysis';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from './ui/dialog';

// ── Section colour palette ──────────────────────────────────────────────────
const SECTION_COLORS = [
  { color: '#FF6B6B', glow: 'rgba(255,107,107,0.18)' },
  { color: '#00C9B1', glow: 'rgba(0,201,177,0.18)'   },
  { color: '#F7C948', glow: 'rgba(247,201,72,0.18)'  },
  { color: '#C77DFF', glow: 'rgba(199,125,255,0.18)' },
  { color: '#06D6A0', glow: 'rgba(6,214,160,0.18)'   },
];

const BG   = '#F8F5FF';
const TEXT  = '#1A0F3C';
const MUTED = '#7C6FA0';
const CARD  = '#ffffff';

// ── Props ───────────────────────────────────────────────────────────────────
interface SectionCardDeckProps {
  section: StorySection;
  answers: Map<string, StoryAnswer>;
  onAnswer: (cardId: string, answer: string, drawing?: string) => void;
  onSkip: (cardId: string) => void;
  onSectionComplete: () => void;
  onSaveAndExit: () => void;
  onViewAllSections?: () => void;
  onPreviewStory?: () => void;
}

// Resolve section index from section ID
function getSectionIndex(sectionId: string): number {
  const map: Record<string, number> = {
    character: 0, setting: 1, beginning: 2, obstacles: 3, ending: 4,
  };
  for (const [key, idx] of Object.entries(map)) {
    if (sectionId.includes(key)) return idx;
  }
  return 0;
}

// ── Component ───────────────────────────────────────────────────────────────
export function SectionCardDeck({
  section, answers, onAnswer, onSkip,
  onSectionComplete, onSaveAndExit,
  onViewAllSections, onPreviewStory,
}: SectionCardDeckProps) {

  const [activeDeck, setActiveDeck]             = useState<string[]>([]);
  const [isInitialized, setIsInitialized]       = useState(false);
  const [answer, setAnswer]                     = useState('');
  const [showDrawing, setShowDrawing]           = useState(false);
  const [drawing, setDrawing]                   = useState<string | undefined>();
  const [showExitDialog, setShowExitDialog]     = useState(false);
  const [exitDirection, setExitDirection]       = useState<'left' | 'right' | null>(null);
  const [removedCards, setRemovedCards]         = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing]           = useState(false);
  const [showCardNavigator, setShowCardNavigator] = useState(false);

  // Motion values – must be before any early return
  const x                 = useMotionValue(0);
  const rotate            = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const opacity           = useTransform(x, [-300, -150, 0, 150, 300], [0.3, 1, 1, 1, 0.3]);
  const skipOpacity       = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const saveOpacity       = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const skipScale         = useTransform(skipOpacity, [0, 1], [0.8, 1]);
  const saveScale         = useTransform(saveOpacity, [0, 1], [0.8, 1]);

  const secIdx   = getSectionIndex(section.id);
  const secColor = SECTION_COLORS[secIdx] ?? SECTION_COLORS[0];

  // Init deck
  useEffect(() => {
    const unanswered = section.cards.filter(c => !answers.has(c.id)).map(c => c.id);
    setActiveDeck(unanswered.length === 0 ? section.cards.map(c => c.id) : unanswered);
    setExitDirection(null);
    setRemovedCards([]);
    x.set(0);
    setIsInitialized(true);
  }, [section.id]);

  const currentCardId  = activeDeck[0];
  const currentCard    = section.cards.find(c => c.id === currentCardId);
  const existingAnswer = currentCard ? answers.get(currentCard.id) : undefined;

  // Sync answer state when card changes
  useEffect(() => {
    if (currentCard) {
      if (existingAnswer) {
        setAnswer(existingAnswer.answer);
        setDrawing(existingAnswer.drawing);
        setShowDrawing(!!existingAnswer.drawing && !existingAnswer.answer);
      } else {
        setAnswer('');
        setDrawing(undefined);
        setShowDrawing(false);
      }
    }
  }, [currentCardId, existingAnswer]);

  // Check section complete
  useEffect(() => {
    if (isInitialized && activeDeck.length === 0 && section.cards.length > 0) {
      setTimeout(onSectionComplete, 300);
    }
  }, [activeDeck.length, isInitialized]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDragEnd = (_: any, info: PanInfo) => {
    const dist = Math.abs(info.offset.x);
    const vel  = Math.abs(info.velocity.x);
    if (dist > 100 || (vel > 500 && dist > 50)) {
      info.offset.x > 0 ? handleSaveCard() : handleSkipCard();
    } else {
      x.set(0);
    }
  };

  const handleSaveCard = () => {
    if (!currentCard) return;
    if (!answer.trim() && !drawing) { handleSkipCard(); return; }
    onAnswer(currentCard.id, answer, drawing);
    setExitDirection('right');
    setTimeout(() => {
      setActiveDeck(prev => prev.slice(1));
      setRemovedCards(prev => [...prev, currentCard.id]);
      setExitDirection(null);
      x.set(0);
    }, 300);
  };

  const handleSkipCard = () => {
    if (!currentCard) return;
    onSkip(currentCard.id);
    setExitDirection('left');
    setTimeout(() => {
      setActiveDeck(prev => [...prev.slice(1), prev[0]]);
      setExitDirection(null);
      x.set(0);
    }, 300);
  };

  const handleUndo = () => {
    if (removedCards.length > 0) {
      const last = removedCards[removedCards.length - 1];
      setActiveDeck(prev => [last, ...prev]);
      setRemovedCards(prev => prev.slice(0, -1));
      x.set(0);
    }
  };

  const handleDrawingSave = async (dataUrl: string) => {
    setDrawing(dataUrl);
    if (currentCard) {
      const cardType = getCardTypeFromId(currentCard.id);
      if (cardType === 'character' || cardType === 'setting' || cardType === 'obstacle') {
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeDrawing(dataUrl, cardType);
          setAnswer(analysis.description);
        } catch { /* continue without analysis */ }
        finally {
          setIsAnalyzing(false);
          setShowDrawing(false);
        }
      } else {
        setShowDrawing(false);
      }
    } else {
      setShowDrawing(false);
    }
  };

  const handleSaveAndExit = () => {
    if (currentCard && (answer.trim() || drawing)) {
      onAnswer(currentCard.id, answer, drawing);
    }
    setShowExitDialog(false);
    onSaveAndExit();
  };

  const handleJumpToCard = (cardId: string) => {
    if (currentCard && (answer.trim() || drawing)) {
      onAnswer(currentCard.id, answer, drawing);
    }
    setActiveDeck(prev => [cardId, ...prev.filter(id => id !== cardId)]);
    setShowCardNavigator(false);
    x.set(0);
  };

  const isAnswered    = (cardId: string) => answers.has(cardId);
  const totalCards    = section.cards.length;
  const answeredCount = section.cards.filter(c => isAnswered(c.id)).length;
  const remainingCount = activeDeck.length;
  const isReviewMode  = answeredCount === totalCards && activeDeck.length === totalCards;

  // Empty state
  if (!currentCard) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: TEXT }}>Great work!</h2>
          <p style={{ color: MUTED }}>Processing your answers…</p>
        </div>
      </div>
    );
  }

  const nextCards = activeDeck.slice(1, 4).map(id => section.cards.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Section ambient glow */}
      <div style={{
        position: 'fixed', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: `radial-gradient(circle, ${secColor.glow} 0%, transparent 65%)`,
        pointerEvents: 'none', animation: 'ww-aurora 9s ease-in-out infinite', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: TEXT, margin: 0 }}>{section.name}</h2>
            <p style={{ fontSize: '0.78rem', color: MUTED, margin: 0 }}>
              {answeredCount} answered · {remainingCount} remaining
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onViewAllSections && (
              <button
                onClick={onViewAllSections}
                style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.45rem 0.9rem', color: MUTED, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.06)' }}
              >
                <Home size={13} /> Chapters
              </button>
            )}
            <button
              onClick={() => setShowCardNavigator(true)}
              style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.45rem 0.9rem', color: MUTED, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.06)' }}
            >
              <Grid3x3 size={13} /> View All
            </button>
            <button
              onClick={() => setShowExitDialog(true)}
              style={{ background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.45rem 0.9rem', color: MUTED, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(99,52,205,0.06)' }}
            >
              <X size={13} /> Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${(answeredCount / totalCards) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${secColor.color}, ${secColor.color}aa)`, borderRadius: '100px' }}
          />
        </div>

        {/* Review mode banner */}
        {isReviewMode && (
          <div style={{ background: 'rgba(6,214,160,0.1)', border: '1.5px solid rgba(6,214,160,0.3)', borderRadius: '12px', padding: '0.6rem 1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Check size={16} color="#06D6A0" />
            <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 800 }}>
              ✨ Review Mode — All cards done! You can edit any answer.
            </span>
          </div>
        )}

        {/* Swipe instructions */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '0.78rem', color: MUTED, margin: 0 }}>
            ← Skip &nbsp;•&nbsp; Swipe right to save →
          </p>
        </div>

        {/* Card stack */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '520px' }}>

          {/* Ghost cards */}
          {nextCards.map((card, index) => (
            <motion.div
              key={card!.id}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 - index - 1 }}
              animate={{ scale: 0.95 - index * 0.025, y: (index + 1) * 12, opacity: 0.65 - index * 0.2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div style={{
                background: CARD,
                borderRadius: '28px',
                width: '100%', maxWidth: '520px', height: '520px',
                boxShadow: '0 8px 40px rgba(99,52,205,0.1)',
                borderTop: `5px solid ${secColor.color}40`,
              }}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    background: `${secColor.color}15`,
                    border: `1.5px solid ${secColor.color}30`,
                    borderRadius: '100px', padding: '0.3rem 0.85rem',
                    fontSize: '0.75rem', fontWeight: 900, color: secColor.color,
                    marginBottom: '1rem',
                  }}>
                    <Sparkles size={12} /> Creative Companion
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: TEXT }}>{card!.question}</h3>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Active card */}
          <motion.div
            key={currentCard.id}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: showDrawing ? 'default' : 'grab', zIndex: 20, x, rotate, opacity }}
            initial={{ scale: 0.9, opacity: 0 }}
            drag={showDrawing ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            whileTap={{ scale: 0.98 }}
            animate={exitDirection ? {
              x: exitDirection === 'right' ? 1000 : -1000,
              opacity: 0, rotate: exitDirection === 'right' ? 25 : -25, scale: 0.9,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            } : {
              x: 0, opacity: 1, rotate: 0, scale: 1,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
          >
            <div style={{
              background: CARD,
              borderRadius: '28px',
              padding: '2rem',
              width: '100%', maxWidth: '520px',
              boxShadow: `0 12px 50px rgba(99,52,205,0.12), 0 0 60px ${secColor.glow}`,
              borderTop: `5px solid ${secColor.color}`,
              userSelect: 'none',
              overflowY: 'auto',
              maxHeight: '520px',
            }}>

              {/* Companion badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: `${secColor.color}15`,
                border: `1.5px solid ${secColor.color}35`,
                borderRadius: '100px', padding: '0.3rem 0.85rem',
                fontSize: '0.75rem', fontWeight: 900, color: secColor.color,
                marginBottom: '1.1rem', letterSpacing: '0.04em',
              }}>
                <Sparkles size={12} /> Creative Companion
              </div>

              {/* Question */}
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: TEXT, marginBottom: '1rem', lineHeight: 1.3 }}>
                {currentCard.question}
              </h3>

              {/* Help text */}
              {currentCard.helpText && (
                <div style={{ background: 'rgba(247,201,72,0.1)', border: '1.5px solid rgba(247,201,72,0.35)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Lightbulb size={16} color="#B08A00" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.83rem', color: '#7A6010', lineHeight: 1.45, margin: 0 }}>
                    {currentCard.helpText}
                  </p>
                </div>
              )}

              {/* Input / drawing / analyzing */}
              {!showDrawing && !isAnalyzing ? (
                <VoiceInput
                  value={answer}
                  onChange={setAnswer}
                  placeholder={currentCard.placeholder}
                  onComplete={handleSaveCard}
                  accentColor={secColor.color}
                />
              ) : isAnalyzing ? (
                <div style={{ background: `${secColor.color}10`, border: `1.5px solid ${secColor.color}30`, borderRadius: '16px', padding: '2.5rem', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Loader2 size={44} color={secColor.color} style={{ marginBottom: '0.75rem', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: secColor.color, fontWeight: 800, margin: 0 }}>✨ Analyzing your drawing…</p>
                    <p style={{ color: MUTED, fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Creating a description for you!</p>
                  </div>
                </div>
              ) : (
                <DrawingCanvas onSave={handleDrawingSave} initialDrawing={drawing} />
              )}

              {/* Examples */}
              {currentCard.examples && currentCard.examples.length > 0 && (
                <div style={{ background: `${secColor.color}10`, border: `1.5px solid ${secColor.color}25`, borderRadius: '12px', padding: '0.85rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Sparkles size={15} color={secColor.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', color: MUTED, margin: '0 0 0.4rem', fontWeight: 800 }}>For example:</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {currentCard.examples.map((ex, idx) => (
                          <li key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: TEXT, marginBottom: '0.25rem' }}>
                            <span style={{ color: secColor.color }}>•</span>
                            <em>"{ex}"</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Draw / describe toggle */}
              {currentCard.allowDrawing && !showDrawing && (
                <button
                  onClick={() => setShowDrawing(true)}
                  style={{ width: '100%', marginTop: '0.85rem', background: '#F8F5FF', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '12px', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}
                >
                  <Paintbrush size={15} /> Draw Instead
                </button>
              )}

              {currentCard.allowDrawing && showDrawing && (
                <button
                  onClick={() => setShowDrawing(false)}
                  style={{ width: '100%', marginTop: '0.85rem', background: '#F8F5FF', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '12px', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}
                >
                  <MessageSquare size={15} /> Describe Instead
                </button>
              )}

              {/* Drawing preview */}
              {drawing && !showDrawing && (
                <div style={{ marginTop: '0.85rem' }}>
                  {isAnalyzing ? (
                    <div style={{ background: `${secColor.color}10`, border: `1.5px solid ${secColor.color}30`, borderRadius: '12px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Loader2 size={16} color={secColor.color} style={{ animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '0.83rem', color: secColor.color, fontWeight: 800 }}>Analyzing your drawing…</span>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.82rem', textAlign: 'center', color: MUTED, marginBottom: '0.5rem' }}>Your drawing:</p>
                      <img src={drawing} alt="Your drawing" style={{ width: '100%', borderRadius: '12px', border: `1.5px solid ${secColor.color}30` }} />
                      <button
                        onClick={() => setShowDrawing(true)}
                        style={{ width: '100%', marginTop: '0.5rem', background: '#F8F5FF', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '12px', padding: '0.55rem', fontSize: '0.82rem', fontWeight: 800, color: MUTED, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Edit Drawing
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Swipe direction indicators */}
          <motion.div style={{ position: 'absolute', left: '0.5rem', top: '50%', translateY: '-50%', pointerEvents: 'none', opacity: skipOpacity, scale: skipScale, zIndex: 30 }}>
            <div style={{ background: '#FF6B6B', color: '#fff', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(255,107,107,0.35)' }}>
              ← SKIP
            </div>
          </motion.div>

          <motion.div style={{ position: 'absolute', right: '0.5rem', top: '50%', translateY: '-50%', pointerEvents: 'none', opacity: saveOpacity, scale: saveScale, zIndex: 30 }}>
            <div style={{ background: secColor.color, color: '#fff', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 900, fontSize: '0.9rem', boxShadow: `0 4px 16px ${secColor.glow}` }}>
              SAVE →
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <motion.button
            onClick={handleUndo}
            disabled={removedCards.length === 0}
            whileHover={{ scale: removedCards.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: removedCards.length > 0 ? 0.95 : 1 }}
            style={{ flex: 1, background: '#fff', border: '1.5px solid rgba(99,52,205,0.15)', borderRadius: '100px', padding: '0.85rem', fontSize: '0.88rem', fontWeight: 800, color: removedCards.length > 0 ? TEXT : MUTED, cursor: removedCards.length > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: removedCards.length > 0 ? 1 : 0.45, boxShadow: '0 2px 10px rgba(99,52,205,0.06)', fontFamily: 'inherit' }}
          >
            <RotateCcw size={15} /> Undo
          </motion.button>

          <motion.button
            onClick={handleSkipCard}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ flex: 1, background: '#fff', border: '1.5px solid #FF6B6B40', borderRadius: '100px', padding: '0.85rem', fontSize: '0.88rem', fontWeight: 800, color: '#FF6B6B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 2px 10px rgba(255,107,107,0.1)', fontFamily: 'inherit' }}
          >
            <SkipForward size={15} /> Skip
          </motion.button>

          {(answer.trim() || drawing) && (
            <motion.button
              onClick={handleSaveCard}
              whileHover={{ scale: 1.04, boxShadow: `0 10px 30px ${secColor.glow}` }}
              whileTap={{ scale: 0.96 }}
              style={{ flex: 2, background: `linear-gradient(135deg, ${secColor.color} 0%, ${secColor.color}bb 100%)`, border: 'none', borderRadius: '100px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 900, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: `0 6px 22px ${secColor.glow}`, fontFamily: 'inherit' }}
            >
              Save <ChevronRight size={17} />
            </motion.button>
          )}
        </div>

        {/* Deck info */}
        {remainingCount > 1 && (
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: MUTED }}>
            {remainingCount - 1} more card{remainingCount - 1 !== 1 ? 's' : ''} in deck
          </p>
        )}

        {/* Floating decorative */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          {['☁️', '⭐', '🌈'].map((e, i) => (
            <span key={i} style={{ display: 'inline-block', animation: 'ww-float 2s ease-in-out infinite', animationDelay: `${i * 0.15}s`, fontSize: '1.2rem', opacity: 0.55, marginLeft: i > 0 ? '0.5rem' : 0 }}>{e}</span>
          ))}
        </div>
      </div>

      {/* Save & Exit dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save and come back later?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved and you can continue your story anytime!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Creating</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndExit}>Save & Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card navigator dialog */}
      <Dialog open={showCardNavigator} onOpenChange={setShowCardNavigator}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Jump to Any Card</DialogTitle>
            <DialogDescription>
              Select any card to jump to it. Green = completed, highlighted = current.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {section.cards.map((card, index) => {
              const answered  = isAnswered(card.id);
              const isCurrent = card.id === currentCardId;
              return (
                <button
                  key={card.id}
                  onClick={() => handleJumpToCard(card.id)}
                  style={{
                    position: 'relative', padding: '1rem', borderRadius: '14px',
                    border: `2px solid ${isCurrent ? secColor.color : answered ? '#06D6A040' : 'rgba(99,52,205,0.1)'}`,
                    background: isCurrent ? `${secColor.color}12` : answered ? 'rgba(6,214,160,0.06)' : '#fff',
                    textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '50%', background: answered ? '#06D6A0' : '#EDE9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: answered ? '#fff' : MUTED }}>
                    {answered ? <Check size={13} color="#fff" /> : index + 1}
                  </div>
                  {isCurrent && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: secColor.color, color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 6px', borderRadius: '100px' }}>
                      Current
                    </div>
                  )}
                  <p style={{ fontSize: '0.82rem', color: TEXT, marginTop: isCurrent ? '1.5rem' : '0.25rem', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {card.question}
                  </p>
                  {answered && (
                    <p style={{ fontSize: '0.75rem', color: MUTED, fontStyle: 'italic', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{answers.get(card.id)?.answer || 'Drawing added'}"
                    </p>
                  )}
                  <p style={{ fontSize: '0.72rem', color: answered ? '#06D6A0' : MUTED, marginTop: '0.5rem', fontWeight: 800 }}>
                    {answered ? '✓ Completed' : 'Not answered'}
                  </p>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', background: `${secColor.color}10`, border: `1.5px solid ${secColor.color}30`, borderRadius: '14px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: MUTED, fontWeight: 800 }}>Progress:</span>
              <span style={{ color: secColor.color, fontWeight: 900 }}>{answeredCount} of {totalCards} cards</span>
            </div>
            <div style={{ background: '#EDE9FF', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${(answeredCount / totalCards) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${secColor.color}, ${secColor.color}aa)`, borderRadius: '100px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
