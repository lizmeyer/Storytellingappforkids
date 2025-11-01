import { StoryAnswer } from '../types/story';
import { preprocessAnswers } from './inputInterpreter';

/**
 * Story Compiler - Transforms raw user inputs into a polished early reader story
 * 
 * This compiler INTERPRETS CREATIVELY and creates cohesive narratives that read like 
 * real children's literature, inspired by classic early readers (ages 6-12) such as:
 * - Magic Tree House series
 * - Ramona Quimby series  
 * - Charlotte's Web
 * - The Tale of Despereaux
 * 
 * Key principles:
 * - CREATIVE INTERPRETATION: Transform silly/weird inputs into coherent narratives
 * - EMBELLISH GENEROUSLY: Add rich details and descriptions
 * - FIX SPELLING/GRAMMAR: Polish all language while keeping ideas
 * - Natural narrative voice with personality
 * - Varied sentence structure and rhythm
 * - Smooth transitions between scenes
 * - Emotional depth and character interiority
 * - Vivid, sensory language
 * - Clear cause-and-effect throughout
 * - Satisfying narrative arc
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
    charName: getAnswer('char-name'),
    charWho: getAnswer('char-who'),
    charWant: getAnswer('char-want'),
    charWhy: getAnswer('char-why'),
    charObstacle: getAnswer('char-obstacle'),
    charSpecial: getAnswer('char-special'),
    
    worldWhere: getAnswer('world-where'),
    worldWhen: getAnswer('world-when'),
    worldSpecial: getAnswer('world-special'),
    worldRules: getAnswer('world-rules'),
    worldMood: getAnswer('world-mood'),
    
    beginOrdinary: getAnswer('begin-ordinary'),
    beginIncident: getAnswer('begin-incident'),
    beginReaction: getAnswer('begin-reaction'),
    beginDecision: getAnswer('begin-decision'),
    beginFirstStep: getAnswer('begin-first-step'),
    
    challengeFirst: getAnswer('challenge-first'),
    challengeHow: getAnswer('challenge-how'),
    challengeSecond: getAnswer('challenge-second'),
    challengeMistake: getAnswer('challenge-mistake'),
    challengeLowest: getAnswer('challenge-lowest'),
    challengeRealize: getAnswer('challenge-realize'),
    
    climaxMoment: getAnswer('climax-moment'),
    climaxAction: getAnswer('climax-action'),
    climaxResult: getAnswer('climax-result'),
    endingChange: getAnswer('ending-change'),
    endingWorld: getAnswer('ending-world'),
    endingFinal: getAnswer('ending-final'),
  };
}

function cleanAndFormat(text: string): string {
  if (!text) return '';
  
  // Fix common spelling errors
  text = text.replace(/\bteh\b/gi, 'the');
  text = text.replace(/\bwuz\b/gi, 'was');
  text = text.replace(/\bu\b/gi, 'you');
  text = text.replace(/\br\b/gi, 'are');
  text = text.replace(/\bkinda\b/gi, 'kind of');
  text = text.replace(/\bgonna\b/gi, 'going to');
  text = text.replace(/\bwanna\b/gi, 'want to');
  text = text.replace(/\bdont\b/gi, "don't");
  text = text.replace(/\bcant\b/gi, "can't");
  text = text.replace(/\bwont\b/gi, "won't");
  text = text.replace(/\bdidnt\b/gi, "didn't");
  
  // Fix repeated letters/words
  text = text.replace(/(.)\1{3,}/g, '$1$1'); // yesssss → yes
  text = text.replace(/\s{2,}/g, ' '); // Multiple spaces
  
  // Remove stray brackets and special characters
  text = text.replace(/[\[\]{}]/g, '');
  text = text.replace(/\.{2,}/g, '.');
  
  // Remove common prefixes kids might add
  text = text.replace(/^(My hero |They |My character |The character |He |She )/i, '');
  text = text.replace(/^(is |are |was |were )/i, '');
  
  // Trim
  text = text.trim();
  if (!text) return '';
  
  // Convert to past tense for narrative consistency
  text = ensurePastTense(text);
  
  // Ensure first letter is capitalized
  text = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Ensure it ends with proper punctuation
  if (!text.match(/[.!?]$/)) {
    text += '.';
  }
  
  return text;
}

/**
 * Creatively interpret potentially silly or inappropriate content
 */
function interpretCreatively(text: string, context: 'name' | 'place' | 'thing'): string {
  if (!text) return '';
  
  const lower = text.toLowerCase().trim();
  
  // Transform inappropriate/silly content into creative alternatives
  if (lower.includes('poop') || lower.includes('poo')) {
    if (context === 'name') return 'Bingle'; // Keep the core name if it's unique
    if (context === 'place') return 'the Floating Isles';
    return 'a mysterious fog';
  }
  
  if (lower.includes('fart') || lower.includes('butt')) {
    if (context === 'place') return 'the Windy Peaks';
    return 'a sudden gust of wind';
  }
  
  // Handle very brief responses
  if (lower === 'cool' || lower === 'nice' || lower === 'good') {
    if (context === 'thing') return 'remarkable and unique';
    return text;
  }
  
  return text;
}

/**
 * Intelligently weaves user input into narrative prose
 * Adds contextual transitions and emotional depth
 */
function weaveIntoNarrative(text: string, context: {
  name: string;
  pronouns: { subject: string; object: string; possessive: string };
  addName?: boolean;
  prefix?: string;
  ensureSubject?: boolean;
}): string {
  if (!text) return '';
  
  // Clean common prefixes
  text = text.replace(/^(My hero |They |My character |The character |He |She |I |The hero )/i, '');
  text = text.replace(/^(is |are |was |were |would |could )/i, '');
  
  // If we need to ensure there's a subject, add the name or pronoun
  if (context.ensureSubject) {
    const hasSubject = text.match(/^(he|she|they|it|this|that|there|the)/i) || 
                       text.toLowerCase().includes(context.name.toLowerCase());
    
    if (!hasSubject) {
      if (context.addName) {
        text = `${context.name} ${text.toLowerCase()}`;
      } else {
        text = `${context.pronouns.subject} ${text.toLowerCase()}`;
      }
    }
  }
  
  // Add prefix if provided
  if (context.prefix) {
    text = `${context.prefix} ${text}`;
  }
  
  // Ensure past tense for narrative consistency
  text = ensurePastTense(text);
  
  // Ensure capitalization
  text = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Ensure proper punctuation
  if (!text.match(/[.!?]$/)) {
    text += '.';
  }
  
  return text;
}

/**
 * Creates varied sentence openings for better rhythm
 */
function varyOpening(baseText: string, options: string[]): string {
  const randomIndex = Math.floor(Math.random() * options.length);
  return `${options[randomIndex]} ${baseText}`;
}

/**
 * Adds emotional interiority to actions
 */
function addEmotionalDepth(action: string, emotion?: string): string {
  if (!emotion) return action;
  
  const emotionWords = emotion.toLowerCase();
  
  if (emotionWords.includes('scared') || emotionWords.includes('afraid') || emotionWords.includes('fear')) {
    return `${action} Even though fear whispered in the back of their mind, they pushed forward.`;
  }
  if (emotionWords.includes('excited') || emotionWords.includes('eager')) {
    return `${action} Excitement bubbled up inside like fizzy soda.`;
  }
  if (emotionWords.includes('determined') || emotionWords.includes('brave')) {
    return `${action} Their determination burned brighter than ever.`;
  }
  
  return action;
}

function pronounFor(name: string, who?: string): { subject: string; object: string; possessive: string } {
  // Try to detect from the "who" description
  if (who) {
    const lowerWho = who.toLowerCase();
    if (lowerWho.includes('girl') || lowerWho.includes('she') || lowerWho.includes('woman') || lowerWho.includes('princess')) {
      return { subject: 'she', object: 'her', possessive: 'her' };
    }
    if (lowerWho.includes('boy') || lowerWho.includes('he') || lowerWho.includes('man') || lowerWho.includes('prince')) {
      return { subject: 'he', object: 'him', possessive: 'his' };
    }
  }
  
  // Default to they/them (neutral and inclusive)
  return { subject: 'they', object: 'them', possessive: 'their' };
}

function ensurePeriod(text: string): string {
  if (!text) return '';
  return text.match(/[.!?]$/) ? text : text + '.';
}

/**
 * Ensure text has consistent past tense
 */
function ensurePastTense(text: string): string {
  if (!text) return '';
  
  // Common present → past tense conversions
  const conversions: [RegExp, string][] = [
    [/\b(is)\b/gi, 'was'],
    [/\b(are)\b/gi, 'were'],
    [/\b(has)\b/gi, 'had'],
    [/\b(have)\b/gi, 'had'],
    [/\b(does)\b/gi, 'did'],
    [/\b(do)\b/gi, 'did'],
    [/\b(goes)\b/gi, 'went'],
    [/\b(go)\b/gi, 'went'],
    [/\b(comes)\b/gi, 'came'],
    [/\b(come)\b/gi, 'came'],
    [/\b(says)\b/gi, 'said'],
    [/\b(say)\b/gi, 'said'],
    [/\b(thinks)\b/gi, 'thought'],
    [/\b(think)\b/gi, 'thought'],
    [/\b(feels)\b/gi, 'felt'],
    [/\b(feel)\b/gi, 'felt'],
    [/\b(wants)\b/gi, 'wanted'],
    [/\b(want)\b/gi, 'wanted'],
    [/\b(needs)\b/gi, 'needed'],
    [/\b(need)\b/gi, 'needed'],
  ];
  
  let result = text;
  for (const [pattern, replacement] of conversions) {
    result = result.replace(pattern, replacement);
  }
  
  return result;
}

/**
 * Join paragraphs with proper spacing
 */
function joinParagraphs(paragraphs: string[]): string {
  return paragraphs
    .filter(p => p && p.trim().length > 0)
    .map(p => p.trim())
    .join('\n\n');
}

export function compileStory(answers: StoryAnswer[]): string {
  // Pre-process answers to transform silly patterns
  const { transformedAnswers } = preprocessAnswers(answers);
  
  const e = extractElements(transformedAnswers);
  const name = e.charName || 'our hero';
  const pronouns = pronounFor(name, e.charWho);
  const ctx = { name, pronouns, ensureSubject: true, addName: false };
  
  const paragraphs: string[] = [];
  
  // === OPENING: SET THE SCENE ===
  let worldIntro = '';
  
  // Build an engaging opening that sets time and place
  if (e.worldWhen && e.worldWhere) {
    const when = cleanAndFormat(e.worldWhen).replace(/\.$/, '').trim();
    let where = e.worldWhere.replace(/^(in |at |on )/i, '').replace(/\.$/, '').trim();
    where = interpretCreatively(where, 'place');
    worldIntro = `${when}, in ${where}`;
  } else if (e.worldWhere) {
    let where = e.worldWhere.replace(/\.$/, '').trim();
    where = interpretCreatively(where, 'place');
    worldIntro = where.match(/^(in |at |on )/i) ? where : `In ${where.toLowerCase()}`;
  } else if (e.worldWhen) {
    worldIntro = cleanAndFormat(e.worldWhen).replace(/\.$/, '').trim();
  } else {
    worldIntro = 'In a world not so different from our own';
  }
  
  // Add world's special quality with vivid detail
  if (e.worldSpecial) {
    let special = cleanAndFormat(e.worldSpecial).replace(/\.$/, '').trim().toLowerCase();
    special = interpretCreatively(special, 'thing');
    const specialClean = special.replace(/^(it was |it is |there was |there were )/i, '').trim();
    if (specialClean && specialClean !== 'remarkable and unique') {
      worldIntro += `, where ${specialClean}`;
    } else if (specialClean === 'remarkable and unique') {
      worldIntro += `, a place unlike any other`;
    }
  }
  
  // Add world rules if they exist (creates intrigue)
  if (e.worldRules) {
    let rules = cleanAndFormat(e.worldRules).replace(/\.$/, '').trim().toLowerCase();
    rules = interpretCreatively(rules, 'thing');
    if (rules) {
      worldIntro += `, and ${rules}`;
    }
  }
  
  paragraphs.push(worldIntro + '.');
  
  // === INTRODUCE THE CHARACTER WITH PERSONALITY ===
  let charIntro = '';
  
  if (e.charWho) {
    const whoClean = e.charWho.replace(/^(a |an |the )/i, '').replace(/\.$/, '').trim().toLowerCase();
    const article = /^[aeiou]/i.test(whoClean) ? 'an' : 'a';
    charIntro = `Here lived ${article} ${whoClean} named ${name}.`;
  } else {
    charIntro = `Here lived ${name}.`;
  }
  
  // Add character's special quality (make it vivid)
  if (e.charSpecial) {
    const special = e.charSpecial
      .replace(/^(they are |they were |is |are |was |were |who was |who is )/i, '')
      .replace(/\.$/, '')
      .trim()
      .toLowerCase();
    
    // Vary the construction for better prose
    const variations = [
      `Unlike others, ${name} was ${special}.`,
      `${name} was ${special}—something everyone noticed right away.`,
      `What made ${name} special? ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} was ${special}.`,
      `${name} had always been ${special}.`
    ];
    charIntro += ' ' + variations[Math.floor(Math.random() * variations.length)];
  }
  
  paragraphs.push(charIntro);
  
  // === CHARACTER'S BURNING DESIRE (Heart of the story) ===
  if (e.charWant) {
    const desire = e.charWant
      .replace(/^(to |they want to |they wanted to |I want to |wants to |wanted to )/i, '')
      .replace(/\.$/, '')
      .trim()
      .toLowerCase();
    
    let desireParagraph = '';
    
    // Create emotional stakes with the WHY
    if (e.charWhy) {
      const why = e.charWhy
        .replace(/^(because |since |this matters because |it matters because )/i, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase();
      
      desireParagraph = `More than anything else in the world, ${name} wanted to ${desire}. ${why.charAt(0).toUpperCase() + why.slice(1)}.`;
    } else {
      desireParagraph = `More than anything else in the world, ${name} longed to ${desire}.`;
    }
    
    // Add internal obstacle if present (raises tension)
    if (e.charObstacle) {
      const obstacle = e.charObstacle
        .replace(/^(but |however |though |although )/i, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase();
      desireParagraph += ` But there was a problem: ${obstacle}.`;
    }
    
    paragraphs.push(desireParagraph);
  }
  
  // === ORDINARY WORLD (The "before" picture) ===
  if (e.beginOrdinary) {
    const ordinary = weaveIntoNarrative(e.beginOrdinary, ctx);
    
    // Add mood if available
    if (e.worldMood) {
      const mood = e.worldMood.replace(/\.$/, '').trim().toLowerCase();
      paragraphs.push(`Every day was much the same. ${ordinary} Life felt ${mood}.`);
    } else {
      paragraphs.push(`Every day was much the same. ${ordinary}`);
    }
  } else if (e.worldMood) {
    const mood = e.worldMood.replace(/\.$/, '').trim().toLowerCase();
    paragraphs.push(`Life in this world was ${mood}.`);
  }
  
  // === INCITING INCIDENT (Everything changes!) ===
  if (e.beginIncident) {
    const incident = e.beginIncident
      .replace(/^(one day,? |then,? |suddenly,? |but then,? )/i, '')
      .replace(/\.$/, '')
      .trim();
    
    // Create narrative tension with varied openings
    const openings = [
      'But one day, everything changed.',
      'Then, without warning, something happened.',
      'Everything changed on one ordinary morning.',
      'Life had other plans.'
    ];
    const opening = openings[Math.floor(Math.random() * openings.length)];
    
    paragraphs.push(`${opening} ${incident.charAt(0).toUpperCase() + incident.slice(1)}.`);
    
    // Add emotional reaction (interiority)
    if (e.beginReaction) {
      const reaction = weaveIntoNarrative(e.beginReaction, { ...ctx, addName: true });
      paragraphs.push(reaction);
    }
  }
  
  // === DECISION TO ACT (Commitment to the journey) ===
  if (e.beginDecision || e.beginFirstStep) {
    let decisionParagraph = '';
    
    if (e.beginDecision) {
      const decision = e.beginDecision
        .replace(/^(because |so |they decided |I decided |to )/i, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase();
      
      decisionParagraph = `${name} knew exactly what ${pronouns.subject} had to do: ${decision}.`;
    }
    
    // Add the first step (action follows decision)
    if (e.beginFirstStep) {
      const firstStep = weaveIntoNarrative(e.beginFirstStep, ctx);
      
      if (decisionParagraph) {
        decisionParagraph += ` Without another moment's hesitation, ${firstStep.toLowerCase()}`;
      } else {
        decisionParagraph = `The adventure began right then. ${firstStep}`;
      }
    }
    
    if (decisionParagraph) {
      paragraphs.push(decisionParagraph);
    }
  }
  
  // === RISING ACTION: FIRST CHALLENGE ===
  if (e.challengeFirst) {
    const challenge = e.challengeFirst
      .replace(/^(first,? |they had to |I had to |the first challenge was )/i, '')
      .replace(/\.$/, '')
      .trim();
    
    paragraphs.push(`The path ahead wasn't easy. ${challenge.charAt(0).toUpperCase() + challenge.slice(1)}.`);
    
    // How they overcame it (shows character growth)
    if (e.challengeHow) {
      const solution = weaveIntoNarrative(e.challengeHow, ctx);
      paragraphs.push(solution);
    }
  }
  
  // === SECOND CHALLENGE (Raises stakes) ===
  if (e.challengeSecond) {
    const challenge2 = e.challengeSecond
      .replace(/^(then,? |next,? |things got harder when |when |but )/i, '')
      .replace(/\.$/, '')
      .trim();
    
    const transitions = [
      'But the journey was far from over.',
      'Just when things seemed manageable, a new problem appeared.',
      'The next challenge proved even harder.',
      `${name} thought the hard part was finished. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} was wrong.`
    ];
    
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    paragraphs.push(`${transition} ${challenge2.charAt(0).toUpperCase() + challenge2.slice(1)}.`);
  }
  
  // === MISTAKE/FAILURE (Dark night of the soul) ===
  if (e.challengeMistake || e.challengeLowest) {
    let darkMoment = '';
    
    if (e.challengeMistake) {
      const mistake = weaveIntoNarrative(e.challengeMistake, ctx);
      darkMoment = mistake;
    }
    
    if (e.challengeLowest) {
      const emotional = e.challengeLowest
        .replace(/^(they felt |I felt |feeling |felt )/i, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase();
      
      if (darkMoment) {
        darkMoment += ` Sitting there, ${name} felt ${emotional}. This was ${pronouns.possessive} darkest moment.`;
      } else {
        darkMoment = `This was ${name}'s darkest moment. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} felt ${emotional}, wondering if ${pronouns.subject}'d made a terrible mistake.`;
      }
    }
    
    if (darkMoment) {
      paragraphs.push(darkMoment);
    }
    
    // === REALIZATION (The internal shift) ===
    if (e.challengeRealize) {
      const realization = e.challengeRealize
        .replace(/^(then,? |but then,? |they realized |I realized |realized that )/i, '')
        .replace(/\.$/, '')
        .trim();
      
      const revelationIntros = [
        `But then, something shifted inside ${pronouns.object}.`,
        `In that moment of despair, ${name} suddenly understood.`,
        `That's when it hit ${pronouns.object}—a realization that changed everything.`,
        `But wait. Something clicked in ${pronouns.possessive} mind.`
      ];
      
      const intro = revelationIntros[Math.floor(Math.random() * revelationIntros.length)];
      paragraphs.push(`${intro} ${realization.charAt(0).toUpperCase() + realization.slice(1)}.`);
    }
  }
  
  // === CLIMAX (The final confrontation) ===
  if (e.climaxMoment) {
    const climaxSetup = e.climaxMoment
      .replace(/^(finally,? |at last,? |in the end,? )/i, '')
      .replace(/\.$/, '')
      .trim();
    
    paragraphs.push(`This was it. The final moment. ${climaxSetup.charAt(0).toUpperCase() + climaxSetup.slice(1)}.`);
    
    // The decisive action
    if (e.climaxAction) {
      const action = e.climaxAction
        .replace(/^(they |I |the hero |my hero )/i, '')
        .replace(/\.$/, '')
        .trim()
        .toLowerCase();
      
      // Check if action already has a subject
      const hasSubject = action.match(/^(he|she|they|it)/i) || action.toLowerCase().includes(name.toLowerCase());
      
      if (hasSubject) {
        paragraphs.push(`Drawing on every ounce of courage ${pronouns.subject} possessed, ${action}.`);
      } else {
        paragraphs.push(`Drawing on every ounce of courage ${pronouns.subject} possessed, ${name} ${action}.`);
      }
    }
  }
  
  // === RESOLUTION (What happened?) ===
  if (e.climaxResult) {
    const result = e.climaxResult
      .replace(/^(and |then |finally )/i, '')
      .replace(/\.$/, '')
      .trim();
    
    paragraphs.push(`${result.charAt(0).toUpperCase() + result.slice(1)}.`);
  }
  
  // === TRANSFORMATION (How they've changed) ===
  if (e.endingChange) {
    const change = weaveIntoNarrative(e.endingChange, { ...ctx, addName: false });
    
    // Add reflective depth
    const reflections = [
      `${change} The journey had changed ${pronouns.object} in ways ${pronouns.subject} was only beginning to understand.`,
      `${change} ${name} wasn't the same person who had started this adventure.`,
      `${change} Everything was different now—especially ${name}.`,
      change
    ];
    
    paragraphs.push(reflections[Math.floor(Math.random() * reflections.length)]);
  }
  
  // === NEW NORMAL (The "after" picture) ===
  if (e.endingWorld) {
    const newWorld = e.endingWorld
      .replace(/\.$/, '')
      .trim();
    
    paragraphs.push(`${newWorld.charAt(0).toUpperCase() + newWorld.slice(1)}.`);
  }
  
  // === FINAL IMAGE (Leave them with something memorable) ===
  if (e.endingFinal) {
    const finalImage = weaveIntoNarrative(e.endingFinal, ctx);
    paragraphs.push(finalImage);
  } else {
    // Create a satisfying default ending
    const defaultEndings = [
      `And so ${name}'s adventure came to an end. But somehow, ${pronouns.subject} knew it was really just the beginning.`,
      `The story ends here, but ${name}'s journey continues. After all, every ending is a new beginning.`,
      `${name} smiled, knowing that this was only the first of many adventures to come.`
    ];
    paragraphs.push(defaultEndings[Math.floor(Math.random() * defaultEndings.length)]);
  }
  
  // Add "The End" with a touch of magic
  paragraphs.push('The End.');
  
  // Join paragraphs with proper spacing and ensure grammar
  return joinParagraphs(paragraphs);
}

export function generateTitle(answers: StoryAnswer[]): string {
  // Pre-process answers to transform silly patterns
  const { transformedAnswers } = preprocessAnswers(answers);
  
  const e = extractElements(transformedAnswers);
  const name = e.charName || 'the Hero';
  
  // Try to create an interesting title
  if (e.charWant) {
    const want = e.charWant
      .replace(/^(to |they want to |they wanted to )/i, '')
      .replace(/\.$/, '');
    
    // Title patterns
    const patterns = [
      `${name} and the ${want}`,
      `The Adventures of ${name}`,
      `How ${name} Saved the Day`,
      `${name}'s Quest`,
    ];
    
    // Pick a pattern based on content
    if (e.climaxResult || e.endingChange) {
      return `How ${name} ${want}`;
    }
    
    return `${name} and the Quest to ${want}`;
  }
  
  return `The Adventures of ${name}`;
}