import { StoryAnswer } from '../types/story';

const STORAGE_KEY = 'story-creator-progress';

export interface SavedProgress {
  currentSection: number;
  currentCard: number;
  answers: StoryAnswer[];
  lastUpdated: number;
}

/**
 * Save story progress to localStorage
 */
export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log('Progress saved:', progress);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * Load story progress from localStorage
 */
export function loadProgress(): SavedProgress | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const progress = JSON.parse(stored) as SavedProgress;
    console.log('Progress loaded:', progress);
    return progress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

/**
 * Clear saved progress (when starting new story)
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Progress cleared');
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

/**
 * Check if there is saved progress
 */
export function hasSavedProgress(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null;
  } catch (error) {
    console.error('Failed to check for saved progress:', error);
    return false;
  }
}

/**
 * Get the last updated timestamp of saved progress
 */
export function getLastUpdated(): number | null {
  const progress = loadProgress();
  return progress?.lastUpdated || null;
}
