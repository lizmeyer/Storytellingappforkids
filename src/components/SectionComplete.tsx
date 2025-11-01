import { Button } from './ui/button';
import { Sparkles, ArrowRight, List, Eye } from 'lucide-react';

interface SectionCompleteProps {
  sectionName: string;
  onContinue: () => void;
  onViewAllSections?: () => void;
  onReviewCards?: () => void;
  isLastSection?: boolean;
}

export function SectionComplete({ sectionName, onContinue, onViewAllSections, onReviewCards, isLastSection }: SectionCompleteProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Celebration */}
        <div className="animate-bounce">
          <div className="text-8xl mb-4">
            {isLastSection ? '🎉' : '⭐'}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl">
            {isLastSection ? 'Story Complete!' : `${sectionName} Complete!`}
          </h1>
          <p className="text-xl text-gray-700">
            {isLastSection 
              ? "You've created an amazing story! Let's see what you made."
              : "Great work! You're doing an amazing job on your story."
            }
          </p>
          {!isLastSection && (
            <p className="text-sm text-gray-600">
              Want to make changes? You can review and edit your cards anytime!
            </p>
          )}
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-6 text-xl gap-3 w-full"
        >
          {isLastSection ? (
            <>
              <Sparkles className="w-6 h-6" />
              View My Story
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </Button>

        {/* Review Cards Button */}
        {onReviewCards && (
          <Button
            onClick={onReviewCards}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg gap-3 w-full border-purple-300 hover:bg-purple-50"
          >
            <Eye className="w-5 h-5" />
            Review & Edit This Section
          </Button>
        )}

        {/* View All Sections Button */}
        {onViewAllSections && !isLastSection && (
          <Button
            onClick={onViewAllSections}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg gap-3 w-full"
          >
            <List className="w-5 h-5" />
            View All Sections
          </Button>
        )}
      </div>
    </div>
  );
}