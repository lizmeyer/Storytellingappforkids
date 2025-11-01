import { StoryAnswer } from '../types/story';

export interface SavedStory {
  id: string;
  title: string;
  story: string;
  answers: StoryAnswer[];
  createdAt: number;
  updatedAt: number;
  characterDrawing?: string;
  settingDrawing?: string;
  usedAI: boolean;
  isDraft?: boolean;
  currentSection?: number;
  progress?: number;
}

const LIBRARY_KEY = 'story-library';

/**
 * Get all saved stories from localStorage
 */
export function getAllStories(): SavedStory[] {
  try {
    const data = localStorage.getItem(LIBRARY_KEY);
    if (!data) return [];
    
    const stories = JSON.parse(data) as SavedStory[];
    // Sort by most recent first
    return stories.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Failed to load stories:', error);
    return [];
  }
}

/**
 * Save a new story to the library
 */
export function saveStoryToLibrary(story: Omit<SavedStory, 'id' | 'createdAt' | 'updatedAt'>): SavedStory {
  try {
    const stories = getAllStories();
    
    const newStory: SavedStory = {
      ...story,
      id: generateStoryId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    stories.push(newStory);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(stories));
    
    return newStory;
  } catch (error) {
    console.error('Failed to save story:', error);
    throw error;
  }
}

/**
 * Update an existing story in the library
 */
export function updateStoryInLibrary(storyId: string, updates: Partial<SavedStory>): SavedStory | null {
  try {
    const stories = getAllStories();
    const index = stories.findIndex(s => s.id === storyId);
    
    if (index === -1) return null;
    
    stories[index] = {
      ...stories[index],
      ...updates,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(stories));
    return stories[index];
  } catch (error) {
    console.error('Failed to update story:', error);
    return null;
  }
}

/**
 * Get a single story by ID
 */
export function getStoryById(storyId: string): SavedStory | null {
  const stories = getAllStories();
  return stories.find(s => s.id === storyId) || null;
}

/**
 * Delete a story from the library
 */
export function deleteStory(storyId: string): boolean {
  try {
    const stories = getAllStories();
    const filtered = stories.filter(s => s.id !== storyId);
    
    if (filtered.length === stories.length) {
      return false; // Story not found
    }
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete story:', error);
    return false;
  }
}

/**
 * Delete all stories from the library
 */
export function clearLibrary(): boolean {
  try {
    localStorage.removeItem(LIBRARY_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear library:', error);
    return false;
  }
}

/**
 * Get library statistics
 */
export function getLibraryStats() {
  const stories = getAllStories();
  
  return {
    totalStories: stories.length,
    completedStories: stories.filter(s => !s.isDraft).length,
    draftStories: stories.filter(s => s.isDraft).length,
    totalWords: stories.reduce((sum, s) => sum + (s.story ? s.story.split(/\s+/).length : 0), 0),
    aiEnhancedCount: stories.filter(s => s.usedAI && !s.isDraft).length,
    storiesWithDrawings: stories.filter(s => s.characterDrawing || s.settingDrawing).length,
    oldestStory: stories.length > 0 ? new Date(Math.min(...stories.map(s => s.createdAt))) : null,
    newestStory: stories.length > 0 ? new Date(Math.max(...stories.map(s => s.createdAt))) : null
  };
}

/**
 * Export library as JSON for backup
 */
export function exportLibraryAsJSON(): string {
  const stories = getAllStories();
  return JSON.stringify(stories, null, 2);
}

/**
 * Import library from JSON backup
 */
export function importLibraryFromJSON(jsonString: string): boolean {
  try {
    const stories = JSON.parse(jsonString) as SavedStory[];
    
    // Validate the data structure
    if (!Array.isArray(stories)) {
      throw new Error('Invalid library format');
    }
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(stories));
    return true;
  } catch (error) {
    console.error('Failed to import library:', error);
    return false;
  }
}

/**
 * Generate a unique story ID
 */
function generateStoryId(): string {
  return `story-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get total storage used by library (approximate)
 */
export function getLibraryStorageSize(): number {
  try {
    const data = localStorage.getItem(LIBRARY_KEY);
    if (!data) return 0;
    
    // Approximate size in bytes (each character is ~2 bytes in UTF-16)
    return data.length * 2;
  } catch (error) {
    return 0;
  }
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Save an in-progress story as a draft
 */
export function saveDraftStory(
  answers: StoryAnswer[], 
  currentSection: number, 
  progress: number
): SavedStory {
  const characterDrawing = answers.find(a => a.cardId === 'char-drawing')?.drawing;
  const settingDrawing = answers.find(a => a.cardId === 'world-drawing')?.drawing;
  
  // Generate a draft title from available answers
  const characterName = answers.find(a => a.cardId === 'char-name')?.answer || 'My Character';
  const title = `Draft: Story of ${characterName}`;
  
  return saveStoryToLibrary({
    title,
    story: '', // No story text for drafts
    answers,
    characterDrawing,
    settingDrawing,
    usedAI: false,
    isDraft: true,
    currentSection,
    progress
  });
}

/**
 * Get all draft stories
 */
export function getDraftStories(): SavedStory[] {
  return getAllStories().filter(s => s.isDraft);
}

/**
 * Get all completed stories
 */
export function getCompletedStories(): SavedStory[] {
  return getAllStories().filter(s => !s.isDraft);
}

/**
 * Generate a title for a draft story
 */
export function generateDraftTitle(answers: StoryAnswer[]): string {
  // Try to extract character name or setting for a meaningful title
  const characterName = answers.find(a => a.cardId === 'char-name')?.answer;
  const setting = answers.find(a => a.cardId === 'world-type')?.answer;
  
  if (characterName) {
    return `Draft: ${characterName}'s Story`;
  } else if (setting) {
    return `Draft: Adventure in ${setting}`;
  } else {
    return `Draft Story (${Math.round((answers.length / 25) * 100)}% complete)`;
  }
}