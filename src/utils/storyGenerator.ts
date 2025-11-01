import { StoryAnswer } from '../types/story';
import { preprocessAnswers, detectSillyPattern } from './inputInterpreter';

/**
 * Story Generator - Uses Claude Sonnet 4.5 for high-quality children's stories
 */

interface StoryElements {
  // Character
  charName?: string;
  charWho?: string;
  charWant?: string;
  charWhy?: string;
  charObstacle?: string;
  charSpecial?: string;
  
  // World
  worldWhere?: string;
  worldWhen?: string;
  worldSpecial?: string;
  worldRules?: string;
  worldMood?: string;
  
  // Beginning
  beginOrdinary?: string;
  beginIncident?: string;
  beginReaction?: string;
  beginDecision?: string;
  beginFirstStep?: string;
  
  // Challenges
  challengeFirst?: string;
  challengeHow?: string;
  challengeSecond?: string;
  challengeMistake?: string;
  challengeLowest?: string;
  challengeRealize?: string;
  
  // Climax
  climaxMoment?: string;
  climaxAction?: string;
  climaxResult?: string;
  endingChange?: string;
  endingWorld?: string;
  endingFinal?: string;
}

function extractElements(answers: StoryAnswer[]): StoryElements {
  const getAnswer = (cardId: string) => answers.find(a => a.cardId === cardId)?.answer?.trim();
  
  return {
    // Character cards
    charName: getAnswer('char-name'),
    charWho: getAnswer('char-who'),
    charWant: getAnswer('char-want'),
    charWhy: getAnswer('char-why'),
    charObstacle: getAnswer('char-obstacle'),
    charSpecial: getAnswer('char-special'),
    
    // World cards
    worldWhere: getAnswer('world-where'),
    worldWhen: getAnswer('world-when'),
    worldSpecial: getAnswer('world-special'),
    worldRules: getAnswer('world-rules'),
    worldMood: getAnswer('world-mood'),
    
    // Beginning cards
    beginOrdinary: getAnswer('begin-ordinary'),
    beginIncident: getAnswer('begin-incident'),
    beginReaction: getAnswer('begin-reaction'),
    beginDecision: getAnswer('begin-decision'),
    beginFirstStep: getAnswer('begin-first-step'),
    
    // Challenge cards
    challengeFirst: getAnswer('challenge-first'),
    challengeHow: getAnswer('challenge-how'),
    challengeSecond: getAnswer('challenge-second'),
    challengeMistake: getAnswer('challenge-mistake'),
    challengeLowest: getAnswer('challenge-lowest'),
    challengeRealize: getAnswer('challenge-realize'),
    
    // Ending cards
    climaxMoment: getAnswer('climax-moment'),
    climaxAction: getAnswer('climax-action'),
    climaxResult: getAnswer('climax-result'),
    endingChange: getAnswer('ending-change'),
    endingWorld: getAnswer('ending-world'),
    endingFinal: getAnswer('ending-final')
  };
}

function buildPrompt(elements: StoryElements, guidanceNote?: string): string {
  const e = elements;
  
  // Helper to format sections
  const formatSection = (items: Array<{label: string, value?: string}>): string => {
    const nonEmpty = items.filter(item => item.value);
    return nonEmpty.length > 0 
      ? nonEmpty.map(item => `- ${item.label}: ${item.value}`).join('\n')
      : '(No information provided)';
  };
  
  const characterSection = formatSection([
    { label: 'Name', value: e.charName },
    { label: 'Who they are', value: e.charWho },
    { label: 'What they want', value: e.charWant },
    { label: 'Why it matters', value: e.charWhy },
    { label: "What's in their way", value: e.charObstacle },
    { label: 'Special quality', value: e.charSpecial }
  ]);
  
  const worldSection = formatSection([
    { label: 'Where', value: e.worldWhere },
    { label: 'When', value: e.worldWhen },
    { label: 'What makes it special', value: e.worldSpecial },
    { label: 'Rules of this world', value: e.worldRules },
    { label: 'How it feels', value: e.worldMood }
  ]);
  
  const beginningSection = formatSection([
    { label: 'Ordinary life', value: e.beginOrdinary },
    { label: 'Inciting incident', value: e.beginIncident },
    { label: 'Initial reaction', value: e.beginReaction },
    { label: 'Decision to act', value: e.beginDecision },
    { label: 'First step', value: e.beginFirstStep }
  ]);
  
  const challengesSection = formatSection([
    { label: 'First challenge', value: e.challengeFirst },
    { label: 'How they overcame it', value: e.challengeHow },
    { label: 'Second challenge', value: e.challengeSecond },
    { label: 'Mistake/failure', value: e.challengeMistake },
    { label: 'Darkest moment', value: e.challengeLowest },
    { label: 'Realization', value: e.challengeRealize }
  ]);
  
  const endingSection = formatSection([
    { label: 'Big moment', value: e.climaxMoment },
    { label: "Hero's action", value: e.climaxAction },
    { label: 'Result', value: e.climaxResult },
    { label: 'How hero changed', value: e.endingChange },
    { label: 'How world changed', value: e.endingWorld },
    { label: 'Final scene', value: e.endingFinal }
  ]);
  
  return `You are a professional children's book author. A child (ages 6-12) has provided story elements below. Write a polished, engaging story from their ideas.

${guidanceNote ? guidanceNote + '\n' : ''}## STORY ELEMENTS FROM THE CHILD:

**CHARACTER:**
${characterSection}

**WORLD:**
${worldSection}

**BEGINNING:**
${beginningSection}

**CHALLENGES:**
${challengesSection}

**ENDING:**
${endingSection}

---

## YOUR TASK:

Write a complete children's story (500-800 words) that:

**1. Has perfect grammar and spelling**
- Use past tense consistently (was, went, said, thought - NOT is, goes, says, thinks)
- Get their/there/they're, your/you're, its/it's correct
- Use complete sentences with proper punctuation
- Vary your vocabulary - don't repeat the same words/phrases over and over
- Make sure pronouns are clear (reader always knows who "he/she/they" refers to)

**2. Tells a complete, logical story**
- Clear beginning, middle, and end
- Smooth transitions between paragraphs
- Character actions that make sense
- Vivid descriptions and sensory details
- Show don't tell (e.g., "her hands trembled" not "she was scared")

**3. Interprets creatively**
- Transform silly/inappropriate content into fantasy themes
- If the child used bathroom humor, transform it to cloud magic, wind powers, or similar fantasy
- Embellish brief answers into rich scenes
- Fill gaps with logical details
- Make the story feel complete and professional

**OUTPUT FORMAT:**
Just write the story directly. No title, no preamble. Start with the first sentence of the story.

End with: "The End."`;
}

export async function generateStoryWithAI(answers: StoryAnswer[]): Promise<{
  story: string;
  title: string;
  usedAI: boolean;
}> {
  // Pre-process answers to detect and transform silly patterns
  const { transformedAnswers, guidanceNote } = preprocessAnswers(answers);
  
  const elements = extractElements(transformedAnswers);
  const prompt = buildPrompt(elements, guidanceNote);
  
  // Check if API key is available
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_ANTHROPIC_API_KEY 
    : undefined;
  
  if (!apiKey) {
    console.log('No Anthropic API key found. Using local story generation.');
    // Fallback to local generation
    const { compileStory, generateTitle } = await import('./storyCompiler');
    return {
      story: compileStory(answers),
      title: generateTitle(answers),
      usedAI: false
    };
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const story = data.content[0].text.trim();
    
    // Generate title from the story
    const title = await generateTitle(story, elements);
    
    return {
      story,
      title,
      usedAI: true
    };
  } catch (error) {
    console.error('Error generating story with AI:', error);
    // Fallback to local generation
    const { compileStory, generateTitle } = await import('./storyCompiler');
    return {
      story: compileStory(answers),
      title: generateTitle(answers),
      usedAI: false
    };
  }
}

async function generateTitle(story: string, elements: StoryElements): Promise<string> {
  const name = elements.charName || 'The Hero';
  const want = elements.charWant;
  
  // Try to extract a good title from the story or elements
  if (want && want.length < 50) {
    const cleanWant = want.replace(/^(to |they want to |I want to )/i, '').trim();
    return `${name} and the Quest to ${cleanWant.charAt(0).toUpperCase() + cleanWant.slice(1)}`;
  }
  
  return `The Adventures of ${name}`;
}
