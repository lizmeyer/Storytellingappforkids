import { Button } from './ui/button';
import { Sparkles, BookOpen } from 'lucide-react';
import { getLastUpdated } from '../utils/localStorage';
import { getAllStories } from '../utils/storyLibrary';

interface WelcomeScreenProps {
  onStart: () => void;
  isReturning?: boolean;
  progress?: number;
  onViewLibrary?: () => void;
}

export function WelcomeScreen({ onStart, isReturning, progress = 0, onViewLibrary }: WelcomeScreenProps) {
  const lastUpdated = getLastUpdated();
  const savedStories = getAllStories();
  const storyCount = savedStories.length;
  
  const formatLastSaved = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f7]">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Logo/Title */}
        <div className="space-y-4">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-5xl text-gray-900">
            Story Creator
          </h1>
          <p className="text-xl text-gray-500">
            {isReturning ? 'Welcome back!' : 'Create Your Own Amazing Story'}
          </p>
        </div>

        {/* Progress Indicator for Returning Users */}
        {isReturning && progress > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
            <p className="text-gray-800">Your story is {Math.round(progress)}% complete!</p>
            {lastUpdated && (
              <p className="text-sm text-gray-400">
                Last saved {formatLastSaved(lastUpdated)}
              </p>
            )}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* How It Works */}
        {!isReturning && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h2 className="text-xl text-center text-gray-900">How it works:</h2>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm">1</div>
                <p className="text-gray-700">Answer fun questions about your story</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm">2</div>
                <p className="text-gray-700">Speak or type your answers</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm">3</div>
                <p className="text-gray-700">Draw pictures if you want to!</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm">4</div>
                <p className="text-gray-700">See your complete story come to life</p>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-xl gap-3 rounded-full shadow-sm"
        >
          <Sparkles className="w-6 h-6" />
          {isReturning ? 'Continue My Story' : "Let's Create!"}
        </Button>

        {/* View Library Button */}
        {onViewLibrary && (
          <div className="relative inline-block">
            <Button
              onClick={onViewLibrary}
              size="lg"
              variant="outline"
              className="px-8 py-6 text-xl gap-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm"
            >
              <BookOpen className="w-6 h-6" />
              My Stories
            </Button>
            {storyCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">
                {storyCount}
              </div>
            )}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="flex justify-center gap-3 text-3xl opacity-40">
          <span>🎨</span>
          <span>✨</span>
          <span>📚</span>
          <span>🌟</span>
        </div>
      </div>
    </div>
  );
}