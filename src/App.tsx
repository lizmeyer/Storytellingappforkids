import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SectionCardDeck } from './components/SectionCardDeck';
import { SectionComplete } from './components/SectionComplete';
import { SectionOverview } from './components/SectionOverview';
import { StoryViewer } from './components/StoryViewer';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryAnswer, STORY_SECTIONS } from './types/story';
import { toast, Toaster } from 'sonner@2.0.3';
import { saveProgress, loadProgress, clearProgress, hasSavedProgress } from './utils/localStorage';
import { SavedStory, saveDraftStory } from './utils/storyLibrary';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

type AppState = 'welcome' | 'overview' | 'section' | 'section-complete' | 'complete' | 'library' | 'view-saved-story';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Map<string, StoryAnswer>>(new Map());
  const [isReturning, setIsReturning] = useState(false);
  const [viewingStory, setViewingStory] = useState<SavedStory | null>(null);
  const [showStartNewDialog, setShowStartNewDialog] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setCurrentSection(savedProgress.currentSection);
      
      // Convert array back to Map
      const answersMap = new Map<string, StoryAnswer>();
      savedProgress.answers.forEach(answer => {
        answersMap.set(answer.cardId, answer);
      });
      setAnswers(answersMap);
      setIsReturning(true);
      
      console.log('Loaded saved progress with', savedProgress.answers.length, 'answers');
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (answers.size > 0) {
      saveProgress({
        currentSection,
        currentCard: 0, // Not needed with new card deck approach
        answers: Array.from(answers.values()),
        lastUpdated: Date.now()
      });
    }
  }, [currentSection, answers]);

  const handleStart = () => {
    setAppState('overview');
  };

  const handleAnswer = (cardId: string, answer: string, drawing?: string) => {
    const card = STORY_SECTIONS[currentSection].cards.find(c => c.id === cardId);
    if (!card) return;

    const newAnswer: StoryAnswer = {
      cardId,
      question: card.question,
      answer,
      drawing,
      timestamp: Date.now()
    };

    setAnswers(prev => {
      const updated = new Map(prev);
      updated.set(cardId, newAnswer);
      return updated;
    });
  };

  const handleSkip = (cardId: string) => {
    // Optionally track skipped cards
    console.log('Skipped card:', cardId);
  };

  const handleSectionComplete = () => {
    setAppState('section-complete');
  };

  const handleContinueToNextSection = () => {
    if (currentSection < STORY_SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
      setAppState('section');
    } else {
      // Story complete!
      setAppState('complete');
    }
  };

  const handleReviewCards = () => {
    // Go back to the card deck for the current section
    setAppState('section');
  };

  const handleSaveAndExit = () => {
    setAppState('welcome');
    toast.success('Your story has been saved! Come back anytime to continue.');
  };

  const handleExportPDF = () => {
    toast.success('Story exported! (PDF export would happen here in production)');
  };

  const handleStartNew = () => {
    // Show dialog to offer save option if user has answers
    if (answers.size > 0) {
      setShowStartNewDialog(true);
    } else {
      // No answers, just start fresh
      clearProgress();
      setCurrentSection(0);
      setAnswers(new Map());
      setAppState('welcome');
      setIsReturning(false);
    }
  };

  const handleStartNewWithSave = () => {
    // Save current story as draft
    const savedStory = saveDraftStory(
      Array.from(answers.values()),
      currentSection,
      calculateProgress()
    );
    toast.success(`Draft saved to library!`);
    
    // Clear and start new
    clearProgress();
    setCurrentSection(0);
    setAnswers(new Map());
    setAppState('welcome');
    setIsReturning(false);
    setShowStartNewDialog(false);
  };

  const handleStartNewWithoutSave = () => {
    clearProgress();
    setCurrentSection(0);
    setAnswers(new Map());
    setAppState('welcome');
    setIsReturning(false);
    setShowStartNewDialog(false);
  };

  const handleResumeDraft = (story: SavedStory) => {
    // Load the draft story into the app
    const answersMap = new Map<string, StoryAnswer>();
    story.answers.forEach(answer => {
      answersMap.set(answer.cardId, answer);
    });
    
    setAnswers(answersMap);
    setCurrentSection(story.currentSection || 0);
    setIsReturning(true);
    setAppState('overview');
    toast.success('Draft loaded! Continue where you left off.');
  };

  const handleViewStory = () => {
    setAppState('complete');
  };

  const calculateProgress = () => {
    const totalCards = STORY_SECTIONS.reduce((sum, section) => sum + section.cards.length, 0);
    return (answers.size / totalCards) * 100;
  };

  const handleOpenLibrary = () => {
    setAppState('library');
  };

  const handleViewSavedStory = (story: SavedStory) => {
    setViewingStory(story);
    setAppState('view-saved-story');
  };

  const handleSaveStoryToLibrary = () => {
    const story: SavedStory = {
      currentSection,
      answers: Array.from(answers.values()),
      lastUpdated: Date.now()
    };
    saveDraftStory(story);
    toast.success('Story saved to library!');
  };

  return (
    <div className="min-h-screen">
      {appState === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStart}
          isReturning={isReturning}
          progress={calculateProgress()}
          onViewLibrary={handleOpenLibrary}
        />
      )}

      {appState === 'overview' && (
        <SectionOverview
          sections={STORY_SECTIONS}
          currentSection={currentSection}
          answers={answers}
          onSelectSection={(sectionIndex) => {
            setCurrentSection(sectionIndex);
            setAppState('section');
          }}
          onGoHome={() => setAppState('welcome')}
          onPreviewStory={handleViewStory}
        />
      )}

      {appState === 'section' && (
        <SectionCardDeck
          section={STORY_SECTIONS[currentSection]}
          answers={answers}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          onSectionComplete={handleSectionComplete}
          onSaveAndExit={handleSaveAndExit}
          onViewAllSections={() => setAppState('overview')}
          onPreviewStory={handleViewStory}
        />
      )}

      {appState === 'section-complete' && (
        <SectionComplete
          sectionName={STORY_SECTIONS[currentSection].name}
          onContinue={handleContinueToNextSection}
          onViewAllSections={() => setAppState('overview')}
          isLastSection={currentSection === STORY_SECTIONS.length - 1}
          onReviewCards={handleReviewCards}
        />
      )}

      {appState === 'complete' && (
        <StoryViewer
          answers={Array.from(answers.values())}
          onExport={handleExportPDF}
          onStartNew={handleStartNew}
          onBackToEditing={() => setAppState('overview')}
        />
      )}

      {appState === 'library' && (
        <StoryLibrary
          onViewStory={handleViewSavedStory}
          onGoHome={() => setAppState('welcome')}
          onResumeDraft={handleResumeDraft}
        />
      )}

      {appState === 'view-saved-story' && viewingStory && (
        <StoryViewer
          savedStory={viewingStory}
          answers={viewingStory.answers}
          onExport={handleExportPDF}
          onStartNew={handleStartNew}
          onBackToLibrary={() => setAppState('library')}
        />
      )}
      <Toaster />
      <AlertDialog open={showStartNewDialog} onOpenChange={setShowStartNewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Story</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved answers. Would you like to save them as a draft before starting a new story?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStartNewWithoutSave}>Discard</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartNewWithSave}>Save Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;