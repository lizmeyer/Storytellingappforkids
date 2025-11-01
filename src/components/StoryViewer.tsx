import { Button } from './ui/button';
import { Download, RotateCcw, Sparkles, Loader2, RefreshCw, Edit, FileText, Save, ArrowLeft, X } from 'lucide-react';
import { StoryAnswer } from '../types/story';
import { compileStory, generateTitle } from '../utils/storyCompiler';
import { generateStoryWithAI } from '../utils/storyGenerator';
import { exportStoryAsPDF, exportStoryAsHTML } from '../utils/pdfExport';
import { saveStoryToLibrary, SavedStory, updateStoryInLibrary } from '../utils/storyLibrary';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface StoryViewerProps {
  answers: StoryAnswer[];
  savedStory?: SavedStory; // If viewing from library
  onExport: () => void;
  onStartNew: () => void;
  onBackToEditing?: () => void;
  onBackToLibrary?: () => void;
}

export function StoryViewer({ answers, savedStory, onExport, onStartNew, onBackToEditing, onBackToLibrary }: StoryViewerProps) {
  const getAnswer = (cardId: string): StoryAnswer | undefined => {
    return answers.find(a => a.cardId === cardId);
  };

  const characterDrawing = getAnswer('char-drawing')?.drawing;
  const settingDrawing = getAnswer('world-drawing')?.drawing;

  const [story, setStory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [regenerateKey, setRegenerateKey] = useState<number>(0);
  const [usedAI, setUsedAI] = useState<boolean>(false);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [editedStory, setEditedStory] = useState<string>('');
  const [editedTitle, setEditedTitle] = useState<string>('');

  useEffect(() => {
    const generateStory = async () => {
      setLoading(true);
      setError('');
      
      // If viewing a saved story, load it instead of generating
      if (savedStory) {
        setStory(savedStory.story);
        setTitle(savedStory.title);
        setUsedAI(savedStory.usedAI);
        setLoading(false);
        return;
      }
      
      try {
        const result = await generateStoryWithAI(answers);
        setStory(result.story);
        setTitle(result.title);
        setUsedAI(result.usedAI);
        
        // Auto-save to library when story is first generated
        if (!savedStory) {
          saveStoryToLibrary({
            title: result.title,
            story: result.story,
            characterDrawing,
            settingDrawing,
            answers,
            usedAI: result.usedAI
          });
        }
      } catch (err) {
        console.error('Failed to generate story:', err);
        // Fallback to local generation
        const localStory = compileStory(answers);
        const localTitle = generateTitle(answers);
        setStory(localStory);
        setTitle(localTitle);
        setUsedAI(false);
        
        // Auto-save to library even with local generation
        if (!savedStory) {
          saveStoryToLibrary({
            title: localTitle,
            story: localStory,
            characterDrawing,
            settingDrawing,
            answers,
            usedAI: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  }, [answers, regenerateKey, savedStory]);

  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
  };

  const handleExportPDF = async () => {
    try {
      await exportStoryAsPDF({
        title,
        story,
        characterDrawing,
        settingDrawing,
        answers
      });
      toast.success('Story exported as PDF!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export story. Please try again.');
    }
  };

  const handleExportHTML = () => {
    try {
      exportStoryAsHTML({
        title,
        story,
        characterDrawing,
        settingDrawing,
        answers
      });
      toast.success('Story exported as HTML!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export story. Please try again.');
    }
  };

  const handleStartEditing = () => {
    setEditedStory(story);
    setEditedTitle(title);
    setIsEditingText(true);
  };

  const handleCancelEditing = () => {
    setIsEditingText(false);
    setEditedStory('');
    setEditedTitle('');
  };

  const handleSaveEdits = () => {
    // Update the current state
    setStory(editedStory);
    setTitle(editedTitle);
    
    // Update in library if this is a saved story
    if (savedStory) {
      const updated = updateStoryInLibrary(savedStory.id, {
        story: editedStory,
        title: editedTitle
      });
      
      if (updated) {
        toast.success('Story changes saved!');
      } else {
        toast.error('Failed to save changes.');
      }
    }
    
    setIsEditingText(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl text-gray-900">
            Your Story
          </h1>
          <p className="text-gray-500">by You</p>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
          {/* Title */}
          <div className="text-center border-b border-gray-200 pb-4">
            {isEditingText ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl text-center text-gray-900 border-gray-200 bg-gray-50 rounded-2xl"
                placeholder="Story Title"
              />
            ) : (
              <h2 className="text-3xl text-gray-900">
                {title}
              </h2>
            )}
            {!loading && usedAI && !isEditingText && (
              <div className="mt-2 inline-flex items-center gap-1 bg-[#b19cd9] text-white px-3 py-1 rounded-full text-xs">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </div>
            )}
          </div>

          {/* Character Illustration */}
          {characterDrawing && (
            <div className="space-y-2">
              <p className="text-center text-sm text-gray-500">Your Character</p>
              <img 
                src={characterDrawing} 
                alt="Character" 
                className="w-full max-w-sm mx-auto rounded-2xl border border-gray-200"
              />
            </div>
          )}

          {/* Story Text */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
              <div className="text-center space-y-2">
                <p className="text-lg text-gray-900">✨ Creating your story...</p>
                <p className="text-sm text-gray-500">Our AI storyteller is weaving your ideas into a magical tale!</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-orange-600">{error}</p>
            </div>
          ) : null}
          
          {!loading && (
            <>
              {isEditingText ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Edit className="w-4 h-4" />
                    <span>Edit your story text below:</span>
                  </div>
                  <Textarea
                    value={editedStory}
                    onChange={(e) => setEditedStory(e.target.value)}
                    className="min-h-[400px] text-gray-800 leading-relaxed border-gray-200 bg-gray-50 rounded-2xl"
                    placeholder="Your story text..."
                  />
                  <p className="text-xs text-gray-400">
                    {editedStory.split(/\s+/).length} words
                  </p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  {story.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Setting Illustration */}
          {settingDrawing && (
            <div className="space-y-2">
              <p className="text-center text-sm text-gray-500">The Setting</p>
              <img 
                src={settingDrawing} 
                alt="Setting" 
                className="w-full max-w-sm mx-auto rounded-2xl border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Edit Mode Actions */}
        {isEditingText && (
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSaveEdits}
              size="lg"
              className="bg-[#8fce7b] hover:bg-[#7cbd69] text-white gap-2 rounded-full shadow-sm"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancelEditing}
              size="lg"
              variant="outline"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
            >
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        )}

        {/* Normal Actions */}
        {!isEditingText && (
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              onClick={handleStartEditing}
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white gap-2 rounded-full shadow-sm"
            >
              <Edit className="w-5 h-5" />
              Edit Story Text
            </Button>
            <Button
              onClick={handleExportPDF}
              size="lg"
              variant="outline"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </Button>
            {!savedStory && (
              <Button
                onClick={onStartNew}
                size="lg"
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                Start New Story
              </Button>
            )}
            {!savedStory && (
              <Button
                onClick={handleRegenerate}
                size="lg"
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
                Regenerate Story
              </Button>
            )}
            {onBackToEditing && (
              <Button
                onClick={onBackToEditing}
                size="lg"
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
              >
                <Edit className="w-5 h-5" />
                Edit Answers
              </Button>
            )}
            {onBackToLibrary && (
              <Button
                onClick={onBackToLibrary}
                size="lg"
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Library
              </Button>
            )}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="text-center space-x-2 text-2xl opacity-40">
          <span>⭐</span>
          <span>✨</span>
          <span>🌟</span>
          <span>💫</span>
          <span>⭐</span>
        </div>
      </div>
    </div>
  );
}
