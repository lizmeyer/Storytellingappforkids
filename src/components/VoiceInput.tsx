import { useState, useEffect } from 'react';
import { Mic, Keyboard, Volume2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onComplete: () => void;
}

export function VoiceInput({ value, onChange, placeholder, onComplete }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [useKeyboard, setUseKeyboard] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onChange]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(placeholder);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={!useKeyboard ? "default" : "outline"}
          size="sm"
          onClick={() => setUseKeyboard(false)}
          className="gap-2"
        >
          <Mic className="w-4 h-4" />
          Speak
        </Button>
        <Button
          variant={useKeyboard ? "default" : "outline"}
          size="sm"
          onClick={() => setUseKeyboard(true)}
          className="gap-2"
        >
          <Keyboard className="w-4 h-4" />
          Type
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={speakQuestion}
          className="gap-2"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Input Area */}
      {useKeyboard ? (
        <div className="space-y-3">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[120px] text-lg resize-none"
            autoFocus
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!recognition}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-300' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105'
              } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>
          
          {isListening && (
            <p className="text-center text-purple-600 animate-pulse">
              Listening...
            </p>
          )}

          {!recognition && (
            <p className="text-center text-sm text-gray-500">
              Voice input not available. Use keyboard mode.
            </p>
          )}

          {value && (
            <div className="bg-purple-50 rounded-lg p-4 relative">
              <p className="text-lg">{value}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Re-record
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {value.trim() && (
        <Button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          size="lg"
        >
          Continue
        </Button>
      )}
    </div>
  );
}