import { useState } from 'react';
import { Button } from './ui/button';
import { 
  BookOpen, 
  Trash2, 
  Eye, 
  Download, 
  Home, 
  Calendar,
  Sparkles,
  Image as ImageIcon,
  TrendingUp,
  ArrowLeft,
  Edit,
  FileText
} from 'lucide-react';
import { SavedStory, getAllStories, deleteStory, getLibraryStats, formatStorageSize, getLibraryStorageSize } from '../utils/storyLibrary';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface StoryLibraryProps {
  onViewStory: (story: SavedStory) => void;
  onGoHome: () => void;
  onResumeDraft?: (story: SavedStory) => void;
}

export function StoryLibrary({ onViewStory, onGoHome, onResumeDraft }: StoryLibraryProps) {
  const [stories, setStories] = useState<SavedStory[]>(getAllStories());
  const [storyToDelete, setStoryToDelete] = useState<SavedStory | null>(null);
  const stats = getLibraryStats();
  const storageSize = getLibraryStorageSize();

  const handleDeleteStory = (story: SavedStory) => {
    setStoryToDelete(story);
  };

  const confirmDelete = () => {
    if (!storyToDelete) return;

    const success = deleteStory(storyToDelete.id);
    if (success) {
      setStories(getAllStories());
      toast.success('Story deleted from your library');
    } else {
      toast.error('Failed to delete story');
    }
    setStoryToDelete(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const truncateStory = (story: string, maxLength: number = 150) => {
    if (story.length <= maxLength) return story;
    return story.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onGoHome}
              variant="outline"
              size="lg"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-full shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Home
            </Button>
            <div className="flex-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="w-10 h-10 text-gray-900" />
              <h1 className="text-4xl text-gray-900">
                My Story Library
              </h1>
            </div>
            <p className="text-gray-500">
              All your amazing stories in one place
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-4 shadow-sm text-center">
              <div className="text-3xl mb-1">📚</div>
              <div className="text-2xl text-gray-900">{stats.totalStories}</div>
              <div className="text-sm text-gray-500">Stories</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-sm text-center">
              <div className="text-3xl mb-1">✍️</div>
              <div className="text-2xl text-gray-900">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Words</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-sm text-center">
              <div className="text-3xl mb-1">🎨</div>
              <div className="text-2xl text-gray-900">{stats.storiesWithDrawings}</div>
              <div className="text-sm text-gray-500">With Art</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-sm text-center">
              <div className="text-3xl mb-1">✨</div>
              <div className="text-2xl text-gray-900">{stats.aiEnhancedCount}</div>
              <div className="text-sm text-gray-500">AI Enhanced</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center space-y-6">
            <div className="text-6xl">📖</div>
            <div className="space-y-2">
              <h2 className="text-2xl text-gray-900">Your Library is Empty</h2>
              <p className="text-gray-500">
                Complete your first story and it will automatically be saved here!
              </p>
            </div>
            <Button
              onClick={onGoHome}
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white gap-2 rounded-full shadow-sm"
            >
              <Home className="w-5 h-5" />
              Start Writing
            </Button>
          </div>
        )}

        {/* Story Grid */}
        {stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Story Preview Image or Placeholder */}
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {story.characterDrawing ? (
                    <img
                      src={story.characterDrawing}
                      alt="Story illustration"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl opacity-30">
                      📖
                    </div>
                  )}
                  
                  {/* Overlay with badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {story.isDraft && (
                      <div className="bg-[#ff9b5e] text-white px-3 py-1 rounded-full text-xs">
                        Draft
                      </div>
                    )}
                    {story.usedAI && !story.isDraft && (
                      <div className="bg-[#b19cd9] text-white px-3 py-1 rounded-full text-xs">
                        AI
                      </div>
                    )}
                    {(story.characterDrawing || story.settingDrawing) && (
                      <div className="bg-[#ffb3d9] text-white px-3 py-1 rounded-full text-xs">
                        Art
                      </div>
                    )}
                  </div>
                </div>

                {/* Story Details */}
                <div className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="text-xl text-gray-900 line-clamp-2 min-h-[3.5rem]">
                    {story.title}
                  </h3>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(story.createdAt)}
                  </div>

                  {/* Story Preview */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {story.isDraft 
                      ? `In progress: ${story.answers.length} answers so far` 
                      : truncateStory(story.story)}
                  </p>

                  {/* Word Count or Progress */}
                  {story.isDraft ? (
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-[#ff9b5e] h-2 rounded-full transition-all"
                        style={{ width: `${story.progress || 0}%` }}
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      {story.story.split(/\s+/).length} words
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {story.isDraft ? (
                      <>
                        <Button
                          onClick={() => onResumeDraft && onResumeDraft(story)}
                          className="flex-1 bg-[#ff9b5e] hover:bg-[#ff8a45] text-white gap-2 rounded-full shadow-sm"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                          Resume
                        </Button>
                        <Button
                          onClick={() => handleDeleteStory(story)}
                          variant="outline"
                          size="sm"
                          className="rounded-full border-gray-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => onViewStory(story)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white gap-2 rounded-full shadow-sm"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDeleteStory(story)}
                          variant="outline"
                          size="sm"
                          className="rounded-full border-gray-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Storage Info */}
        {stories.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Library size: {formatStorageSize(storageSize)}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Story?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{storyToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}