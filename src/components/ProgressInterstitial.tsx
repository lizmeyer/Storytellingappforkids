import { useEffect } from 'react';
import { STORY_SECTIONS } from '../types/story';
import { Sparkles, Check } from 'lucide-react';

interface ProgressInterstitialProps {
  currentSection: number;
  currentCard: number;
  totalAnswers: number;
  onComplete: () => void;
  duration?: number;
}

export function ProgressInterstitial({ 
  currentSection, 
  currentCard, 
  totalAnswers,
  onComplete,
  duration = 2000 
}: ProgressInterstitialProps) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  const totalCards = STORY_SECTIONS.reduce((sum, section) => sum + section.cards.length, 0);
  const progressPercent = (totalAnswers / totalCards) * 100;
  
  const currentSectionData = STORY_SECTIONS[currentSection];
  const sectionProgress = currentCard + 1;
  const sectionTotal = currentSectionData.cards.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-md space-y-8">
        {/* Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping opacity-30"></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl text-gray-800">
            Great job!
          </h2>
          <p className="text-xl text-gray-600">
            You're {Math.round(progressPercent)}% done with your story
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span>{totalAnswers} of {totalCards} cards</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Section Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{currentSectionData.name} Section</span>
              <span>{sectionProgress} of {sectionTotal} cards</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(sectionProgress / sectionTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sections Checklist */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-center mb-4 text-gray-700">Your Story Journey</h3>
          <div className="space-y-3">
            {STORY_SECTIONS.map((section, index) => {
              const isComplete = index < currentSection || (index === currentSection && currentCard >= section.cards.length);
              const isCurrent = index === currentSection;
              
              return (
                <div 
                  key={section.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isCurrent ? 'bg-purple-50 border-2 border-purple-300' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isComplete 
                      ? 'bg-green-500' 
                      : isCurrent 
                        ? 'bg-purple-500 animate-pulse' 
                        : 'bg-gray-300'
                  }`}>
                    {isComplete ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={`${
                    isCurrent ? 'text-purple-600 font-medium' : isComplete ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {section.name}
                  </span>
                  {isCurrent && (
                    <Sparkles className="w-4 h-4 text-purple-500 ml-auto animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="text-center space-x-2 text-2xl">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>⭐</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>✨</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>🌟</span>
        </div>
      </div>
    </div>
  );
}
