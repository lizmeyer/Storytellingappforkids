import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { VoiceInput } from './VoiceInput';
import { DrawingCanvas } from './DrawingCanvas';
import { Button } from './ui/button';
import { Paintbrush, MessageSquare, X, SkipForward, Lightbulb, Sparkles, ChevronRight, RotateCcw, Loader2, Grid3x3, Check } from 'lucide-react';
import { StoryAnswer, StorySection } from '../types/story';
import { analyzeDrawing, getCardTypeFromId } from '../utils/drawingAnalysis';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

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

export function SectionCardDeck({ 
  section,
  answers,
  onAnswer,
  onSkip,
  onSectionComplete,
  onSaveAndExit,
  onViewAllSections,
  onPreviewStory
}: SectionCardDeckProps) {
  // Active deck of card IDs (cards not yet answered)
  const [activeDeck, setActiveDeck] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // Track if deck has been initialized
  const [answer, setAnswer] = useState('');
  const [showDrawing, setShowDrawing] = useState(false);
  const [drawing, setDrawing] = useState<string | undefined>();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [removedCards, setRemovedCards] = useState<string[]>([]); // For undo
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Track drawing analysis state
  const [showCardNavigator, setShowCardNavigator] = useState(false); // Card grid view

  // Motion values for drag - MUST be before any conditional returns
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.3, 1, 1, 1, 0.3]);
  const skipIndicatorOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const saveIndicatorOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const skipIndicatorScale = useTransform(skipIndicatorOpacity, [0, 1], [0.8, 1]);
  const saveIndicatorScale = useTransform(saveIndicatorOpacity, [0, 1], [0.8, 1]);

  // Initialize deck with all unanswered cards - ONLY when section changes
  useEffect(() => {
    const unansweredCards = section.cards
      .filter(card => !answers.has(card.id))
      .map(card => card.id);
    
    // If all cards are answered (reviewing a completed section), show all cards
    // Otherwise, show only unanswered cards
    const cardsToShow = unansweredCards.length === 0 
      ? section.cards.map(card => card.id)
      : unansweredCards;
    
    setActiveDeck(cardsToShow);
    setExitDirection(null); // Reset animation state
    setRemovedCards([]); // Reset undo history for new section
    x.set(0); // Reset card position
    setIsInitialized(true); // Mark deck as initialized
  }, [section.id]); // Only re-run when section changes, not when answers change

  // Get current card from active deck
  const currentCardId = activeDeck[0];
  const currentCard = section.cards.find(c => c.id === currentCardId);
  const existingAnswer = currentCard ? answers.get(currentCard.id) : undefined;

  // Load existing answer when card changes
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

  // Check if section is complete - ONLY after initialization
  useEffect(() => {
    if (isInitialized && activeDeck.length === 0 && section.cards.length > 0) {
      // All cards answered!
      setTimeout(() => {
        onSectionComplete();
      }, 300);
    }
  }, [activeDeck.length, isInitialized]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const distance = Math.abs(info.offset.x);
    
    // Consider both distance and velocity for more natural feel
    const shouldSwipe = distance > threshold || (velocity > 500 && distance > 50);
    
    if (shouldSwipe) {
      if (info.offset.x > 0) {
        // Swiped right - save and remove from deck
        handleSaveCard();
      } else {
        // Swiped left - skip (move to back of deck)
        handleSkipCard();
      }
    } else {
      // Snap back with spring animation
      x.set(0);
    }
  };

  const handleSaveCard = () => {
    if (!currentCard) return;
    
    // If there's no content, treat as skip instead
    if (!answer.trim() && !drawing) {
      handleSkipCard();
      return;
    }
    
    // Save the answer
    onAnswer(currentCard.id, answer, drawing);
    
    setExitDirection('right');
    
    // Remove card from active deck with smooth timing
    setTimeout(() => {
      setActiveDeck(prev => {
        const newDeck = prev.slice(1); // Remove first card
        return newDeck;
      });
      setRemovedCards(prev => [...prev, currentCard.id]);
      setExitDirection(null);
      x.set(0);
    }, 300);
  };

  const handleSkipCard = () => {
    if (!currentCard) return;
    
    onSkip(currentCard.id);
    setExitDirection('left');
    
    // Move card to back of deck with smooth timing
    setTimeout(() => {
      setActiveDeck(prev => {
        const newDeck = [...prev.slice(1), prev[0]]; // Move first to last
        return newDeck;
      });
      setExitDirection(null);
      x.set(0);
    }, 300);
  };

  const handleUndo = () => {
    if (removedCards.length > 0) {
      const lastRemoved = removedCards[removedCards.length - 1];
      setActiveDeck(prev => [lastRemoved, ...prev]);
      setRemovedCards(prev => prev.slice(0, -1));
      x.set(0);
    }
  };

  const handleDrawingSave = async (dataUrl: string) => {
    setDrawing(dataUrl);
    
    // Auto-analyze drawing for character-related cards
    if (currentCard) {
      const cardType = getCardTypeFromId(currentCard.id);
      
      // Only auto-analyze for character, setting, and obstacle cards
      if (cardType === 'character' || cardType === 'setting' || cardType === 'obstacle') {
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeDrawing(dataUrl, cardType);
          setAnswer(analysis.description);
          // Don't close drawing mode yet - wait for analysis
        } catch (error) {
          console.error('Failed to analyze drawing:', error);
          // Continue without analysis if it fails
        } finally {
          setIsAnalyzing(false);
          // Close drawing mode after analysis is complete
          setShowDrawing(false);
        }
      } else {
        // For non-analyzed cards, just close drawing mode immediately
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
    // Save current card if there's content
    if (currentCard && (answer.trim() || drawing)) {
      onAnswer(currentCard.id, answer, drawing);
    }
    
    // If the card is already answered, temporarily add it to the deck to work on it
    if (isAnswered(cardId)) {
      setActiveDeck(prev => [cardId, ...prev.filter(id => id !== cardId)]);
    } else {
      // Move the selected card to the front of the deck
      setActiveDeck(prev => [cardId, ...prev.filter(id => id !== cardId)]);
    }
    
    setShowCardNavigator(false);
    x.set(0);
  };

  const isAnswered = (cardId: string) => answers.has(cardId);
  const totalCards = section.cards.length;
  const answeredCount = section.cards.filter(card => isAnswered(card.id)).length;
  const remainingCount = activeDeck.length;
  const isReviewMode = answeredCount === totalCards && activeDeck.length === totalCards;

  // If no current card (all done), show loading state
  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl text-gray-800">Great work!</h2>
          <p className="text-gray-600">Processing your answers...</p>
        </div>
      </div>
    );
  }

  // Get next few cards for stack preview
  const nextCards = activeDeck.slice(1, 4).map(cardId => 
    section.cards.find(c => c.id === cardId)
  ).filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-2xl">
        {/* Header with Section Info */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800">{section.name}</h2>
            <p className="text-sm text-gray-600">
              {answeredCount} answered • {remainingCount} remaining
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCardNavigator(true)}
              className="gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              View All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExitDialog(true)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Save & Exit
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalCards) * 100}%` }}
            />
          </div>
        </div>

        {/* Review Mode Banner */}
        {isReviewMode && (
          <div className="mb-4 bg-green-50 border-2 border-green-300 rounded-xl p-3">
            <div className="flex items-center justify-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4" />
              <span>
                ✨ Review Mode - All cards completed! You can edit any answer.
              </span>
            </div>
          </div>
        )}

        {/* Swipe Instructions */}
        <div className="text-center mb-4 space-y-1">
          <p className="text-sm text-gray-600">
            Swipe right to save • Swipe left to skip
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>← Skip (goes to back)</span>
            <span>•</span>
            <span>Save (completes card) →</span>
          </div>
        </div>

        {/* Card Stack Container */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Background Cards (stacked behind) */}
          {nextCards.map((card, index) => (
            <motion.div 
              key={card!.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 10 - index - 1 }}
              initial={false}
              animate={{
                scale: 0.95 - index * 0.025,
                y: (index + 1) * 10,
                opacity: 0.7 - index * 0.2,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              <div 
                className="bg-white rounded-3xl shadow-xl w-full max-w-xl h-[550px] border-4 border-white"
              >
                {/* Subtle preview of next card's question */}
                <div className="p-8 text-center">
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm mb-4">
                    ✨ Creative Companion
                  </div>
                  <h3 className="text-xl text-gray-600">
                    {card!.question}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Active Card */}
          <motion.div
            key={currentCard.id}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ 
              x, 
              rotate, 
              opacity,
              zIndex: 20
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            drag={showDrawing ? false : "x"} // Disable swiping when drawing
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            whileTap={{ scale: 0.98 }}
            animate={exitDirection ? {
              x: exitDirection === 'right' ? 1000 : -1000,
              opacity: 0,
              rotate: exitDirection === 'right' ? 25 : -25,
              scale: 0.9,
              transition: { 
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            } : {
              x: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
              }
            }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border-4 border-white w-full max-w-xl select-none">
              {/* Question */}
              <div className="text-center space-y-2">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm">
                  ✨ Creative Companion
                </div>
                <h3 className="text-2xl text-gray-800">
                  {currentCard.question}
                </h3>
                
                {/* Help Text */}
                {currentCard.helpText && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 text-left">
                        {currentCard.helpText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {!showDrawing && !isAnalyzing ? (
                <VoiceInput
                  value={answer}
                  onChange={setAnswer}
                  placeholder={currentCard.placeholder}
                  onComplete={handleSaveCard}
                />
              ) : isAnalyzing ? (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
                    <p className="text-purple-700">✨ Analyzing your drawing...</p>
                    <p className="text-sm text-gray-600">Creating a description for you!</p>
                  </div>
                </div>
              ) : (
                <DrawingCanvas
                  onSave={handleDrawingSave}
                  initialDrawing={drawing}
                />
              )}

              {/* Examples - moved below input */}
              {currentCard.examples && currentCard.examples.length > 0 && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="text-sm text-gray-700 mb-2">For example:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {currentCard.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span className="italic">"{example}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawing Option Toggle */}
              {currentCard.allowDrawing && !showDrawing && (
                <Button
                  variant="outline"
                  onClick={() => setShowDrawing(true)}
                  className="w-full gap-2"
                >
                  <Paintbrush className="w-4 h-4" />
                  Draw Instead
                </Button>
              )}

              {currentCard.allowDrawing && showDrawing && (
                <Button
                  variant="outline"
                  onClick={() => setShowDrawing(false)}
                  className="w-full gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Describe Instead
                </Button>
              )}

              {/* Drawing Preview */}
              {drawing && !showDrawing && (
                <div className="space-y-2">
                  {isAnalyzing ? (
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                      <div className="flex items-center justify-center gap-2 text-purple-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">✨ Analyzing your drawing...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-center text-gray-600">Your drawing:</p>
                      <img 
                        src={drawing} 
                        alt="Your drawing" 
                        className="w-full rounded-lg border-2 border-purple-200"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowDrawing(true)}
                        className="w-full"
                        size="sm"
                      >
                        Edit Drawing
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Swipe Direction Indicators */}
          <motion.div 
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              opacity: skipIndicatorOpacity,
              scale: skipIndicatorScale,
              zIndex: 30
            }}
          >
            <div className="bg-yellow-400 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-xl">← SKIP</span>
            </div>
          </motion.div>

          <motion.div 
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              opacity: saveIndicatorOpacity,
              scale: saveIndicatorScale,
              zIndex: 30
            }}
          >
            <div className="bg-green-400 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-xl">SAVE →</span>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleUndo}
            disabled={removedCards.length === 0}
            className="gap-2"
            size="lg"
          >
            <RotateCcw className="w-5 h-5" />
            Undo
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkipCard}
              className="gap-2 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
              size="lg"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </Button>
            
            {(answer.trim() || drawing) && (
              <Button
                onClick={handleSaveCard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
                size="lg"
              >
                Save
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Deck Info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          {remainingCount > 1 && (
            <p>{remainingCount - 1} more card{remainingCount - 1 !== 1 ? 's' : ''} in deck</p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="text-center mt-2 space-x-2">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>☁️</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>⭐</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>🌈</span>
        </div>
      </div>

      {/* Save & Exit Dialog */}
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
            <AlertDialogAction onClick={handleSaveAndExit}>
              Save & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card Navigator Dialog */}
      <Dialog open={showCardNavigator} onOpenChange={setShowCardNavigator}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Jump to Any Card</DialogTitle>
            <DialogDescription>
              Select any card to jump to it. Green cards are completed, purple is your current card.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {section.cards.map((card, index) => {
              const answered = isAnswered(card.id);
              const isCurrent = card.id === currentCardId;
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleJumpToCard(card.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left group hover:scale-105 ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : answered
                      ? 'border-green-300 bg-green-50 hover:border-green-400'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  {/* Card Number Badge */}
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    answered
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {answered ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  
                  {/* Current Indicator */}
                  {isCurrent && (
                    <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Current
                    </div>
                  )}
                  
                  {/* Card Question */}
                  <div className={`text-sm mt-6 ${
                    answered ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {card.question}
                  </div>
                  
                  {/* Answer Preview */}
                  {answered && (
                    <div className="mt-2 text-xs text-gray-500 line-clamp-2 italic">
                      "{answers.get(card.id)?.answer || 'Drawing added'}"
                    </div>
                  )}
                  
                  {/* Status Label */}
                  <div className={`mt-3 text-xs ${
                    answered ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {answered ? '✓ Completed' : 'Not answered'}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Progress:</span>
              <span className="text-purple-700">
                {answeredCount} of {totalCards} cards completed
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / totalCards) * 100}%` }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}