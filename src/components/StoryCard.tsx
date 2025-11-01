import { useState } from 'react';
import { VoiceInput } from './VoiceInput';
import { DrawingCanvas } from './DrawingCanvas';
import { Button } from './ui/button';
import { Paintbrush, MessageSquare } from 'lucide-react';
import { StoryCard as StoryCardType } from '../types/story';

interface StoryCardProps {
  card: StoryCardType;
  onAnswer: (answer: string, drawing?: string) => void;
  initialAnswer?: string;
  initialDrawing?: string;
  cardNumber: number;
  totalCards: number;
}

export function StoryCard({ 
  card, 
  onAnswer, 
  initialAnswer = '', 
  initialDrawing,
  cardNumber,
  totalCards 
}: StoryCardProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [showDrawing, setShowDrawing] = useState(!!card.allowDrawing && !initialAnswer);
  const [drawing, setDrawing] = useState<string | undefined>(initialDrawing);

  const handleVoiceComplete = () => {
    if (card.allowDrawing) {
      // Option to add drawing
      return;
    }
    onAnswer(answer);
  };

  const handleDrawingSave = (dataUrl: string) => {
    setDrawing(dataUrl);
    setShowDrawing(false);
  };

  const handleSubmit = () => {
    onAnswer(answer, drawing);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="text-center mb-4">
          <p className="text-sm text-purple-600">
            Card {cardNumber} of {totalCards}
          </p>
          <div className="w-full bg-white/50 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(cardNumber / totalCards) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border-4 border-white">
          {/* Question */}
          <div className="text-center space-y-2">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm">
              ✨ Creative Companion
            </div>
            <h2 className="text-2xl text-gray-800">
              {card.question}
            </h2>
          </div>

          {/* Input Area */}
          {!showDrawing ? (
            <VoiceInput
              value={answer}
              onChange={setAnswer}
              placeholder={card.placeholder}
              onComplete={handleVoiceComplete}
            />
          ) : (
            <DrawingCanvas
              onSave={handleDrawingSave}
              initialDrawing={drawing}
            />
          )}

          {/* Drawing Option Toggle */}
          {card.allowDrawing && !showDrawing && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDrawing(true)}
                className="flex-1 gap-2"
              >
                <Paintbrush className="w-4 h-4" />
                Draw Instead
              </Button>
              {answer.trim() && (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Continue
                </Button>
              )}
            </div>
          )}

          {card.allowDrawing && showDrawing && (
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
              <p className="text-sm text-center text-gray-600">Your drawing:</p>
              <img 
                src={drawing} 
                alt="Your drawing" 
                className="w-full rounded-lg border-2 border-purple-200"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDrawing(true)}
                  className="flex-1"
                  size="sm"
                >
                  Edit Drawing
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  size="sm"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="text-center mt-4 space-x-2">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>☁️</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>⭐</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>🌈</span>
        </div>
      </div>
    </div>
  );
}
