import { Button } from './ui/button';
import { StorySection, StoryAnswer } from '../types/story';
import { Check, Circle, ChevronRight, BookOpen, Home, Sparkles } from 'lucide-react';

interface SectionOverviewProps {
  sections: StorySection[];
  currentSection: number;
  answers: Map<string, StoryAnswer>;
  onSelectSection: (sectionIndex: number) => void;
  onGoHome: () => void;
  onPreviewStory?: () => void;
}

export function SectionOverview({
  sections,
  currentSection,
  answers,
  onSelectSection,
  onGoHome,
  onPreviewStory
}: SectionOverviewProps) {
  
  const getSectionProgress = (section: StorySection) => {
    const answeredCards = section.cards.filter(card => answers.has(card.id)).length;
    const totalCards = section.cards.length;
    const percentage = (answeredCards / totalCards) * 100;
    
    return {
      answeredCards,
      totalCards,
      percentage,
      isComplete: answeredCards === totalCards,
      isStarted: answeredCards > 0
    };
  };

  const totalProgress = () => {
    const totalCards = sections.reduce((sum, section) => sum + section.cards.length, 0);
    const answeredCards = Array.from(answers.keys()).length;
    return Math.round((answeredCards / totalCards) * 100);
  };

  const canPreviewStory = () => {
    // Allow preview if they have at least 3 answers
    return answers.size >= 3;
  };

  const sectionIcons = ['🦸', '🌍', '📖', '⚡', '🎉'];
  const sectionColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500'
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onGoHome}
              className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <div className="text-sm text-gray-500">
              {totalProgress()}% Complete
            </div>
          </div>
          
          <h1 className="text-4xl text-gray-900 mb-3">Your Story Journey</h1>
          <p className="text-lg text-gray-500">Jump to any section to continue building your story!</p>
          
          {/* Overall Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-4">
          {sections.map((section, index) => {
            const progress = getSectionProgress(section);
            const isCurrent = index === currentSection;
            
            return (
              <button
                key={section.id}
                onClick={() => onSelectSection(index)}
                className={`w-full p-6 rounded-3xl transition-all text-left bg-white shadow-sm hover:shadow-md ${
                  isCurrent
                    ? 'ring-2 ring-gray-900'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Section Icon */}
                  <div className="text-5xl flex-shrink-0">
                    {sectionIcons[index]}
                  </div>

                  {/* Section Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl text-gray-900">
                            {section.name}
                          </h2>
                          {isCurrent && (
                            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">{section.description}</p>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0 ml-4">
                        {progress.isComplete ? (
                          <div className="w-12 h-12 rounded-full bg-[#8fce7b] flex items-center justify-center">
                            <Check className="w-7 h-7 text-white" />
                          </div>
                        ) : progress.isStarted ? (
                          <div className="w-12 h-12 rounded-full bg-[#ff9b5e] flex items-center justify-center">
                            <Circle className="w-7 h-7 text-white fill-current" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <ChevronRight className="w-7 h-7 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">
                          {progress.answeredCards} of {progress.totalCards} cards completed
                        </span>
                        <span className="text-gray-900">
                          {Math.round(progress.percentage)}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress.isComplete
                              ? 'bg-[#8fce7b]'
                              : progress.isStarted
                              ? 'bg-[#ff9b5e]'
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Preview Dots */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {section.cards.map((card) => (
                        <div
                          key={card.id}
                          className={`w-2 h-2 rounded-full transition-all ${
                            answers.has(card.id)
                              ? 'bg-[#8fce7b]'
                              : 'bg-gray-200'
                          }`}
                          title={card.question}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fun Story Tip */}
        <div className="mt-8 p-6 bg-white rounded-3xl shadow-sm">
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-gray-900 flex-shrink-0" />
            <div>
              <h3 className="text-lg text-gray-900 mb-2">💡 Story Tip</h3>
              <p className="text-gray-600">
                You can work on sections in any order! Feel stuck on one part? Jump to another section 
                and come back later. Sometimes working on the ending helps you figure out the beginning!
              </p>
            </div>
          </div>
        </div>

        {/* Preview Story Button */}
        {canPreviewStory() && onPreviewStory && (
          <div className="mt-6">
            <Button
              onClick={onPreviewStory}
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-3 py-6 text-lg rounded-full shadow-sm"
            >
              <Sparkles className="w-6 h-6" />
              Preview My Story Now
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              {totalProgress() < 100 
                ? "See what you've created so far! Your story will get even better as you add more details." 
                : "Your story is complete! Click to see the final result."}
            </p>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="text-center mt-6 space-x-2 opacity-40">
          <span>📚</span>
          <span>✨</span>
          <span>🎨</span>
        </div>
      </div>
    </div>
  );
}