/**
 * Input Interpreter - Intelligently transforms silly/repetitive kid inputs
 * into meaningful story elements
 * 
 * When kids enter "poop" 20 times, we need to figure out what they REALLY mean:
 * - Are they being silly? → Create a whimsical fantasy story
 * - Do they like gross stuff? → Transform to mud, slime, magical goo
 * - Are they testing boundaries? → Channel into creative chaos/mischief themes
 */

import { StoryAnswer } from '../types/story';

interface InterpretationTheme {
  keywords: string[];
  interpretAs: string;
  nameTransform: (name: string) => string;
  worldTransform: string;
  conceptMap: { [key: string]: string };
}

/**
 * Thematic transformation rules
 */
const INTERPRETATION_THEMES: InterpretationTheme[] = [
  {
    keywords: ['poop', 'poo', 'poopy', 'pooped', 'pooping', 'poopoo'],
    interpretAs: 'magical_chaos',
    nameTransform: (name) => {
      // Keep the first part of the name if unique, transform silly parts
      const cleaned = name
        .replace(/poop/gi, 'Puff')
        .replace(/poo/gi, 'Puff')
        .replace(/^the /i, '')
        .replace(/^a /i, '');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    },
    worldTransform: 'the Cloud Kingdoms where magical mist dances through crystal spires',
    conceptMap: {
      'poop': 'wisp of cloud',
      'poops': 'swirling mists',
      'poopy': 'misty',
      'pooped': 'conjured magical vapor',
      'pooping': 'weaving clouds',
      'poopoo': 'mystical fog',
      'poopooland': 'the Sky Realm',
      'poopland': 'the Floating Isles',
      'a poop': 'a cloud spirit',
      'the poop': 'the mist weaver',
      'pooped his': 'created magical',
      'pooped her': 'created magical',
      'pooped on': 'showered with stardust on',
      'eat poops': 'collect enchanted crystals',
      'eat all the poops': 'gather all the sky gems',
    }
  },
  {
    keywords: ['fart', 'farted', 'farting', 'butt'],
    interpretAs: 'wind_magic',
    nameTransform: (name) => name.replace(/fart/gi, 'Gale').replace(/butt/gi, 'Boulder'),
    worldTransform: 'the Windy Peaks where breezes carry ancient secrets',
    conceptMap: {
      'fart': 'gust of wind',
      'farted': 'summoned a whirlwind',
      'farting': 'creating wind magic',
      'butt': 'boulder',
    }
  },
  {
    keywords: ['stupid', 'dumb', 'idiot'],
    interpretAs: 'cleverness_journey',
    nameTransform: (name) => name,
    worldTransform: 'a world where wit matters more than strength',
    conceptMap: {
      'stupid': 'puzzling',
      'dumb': 'mysterious',
      'idiot': 'trickster',
    }
  }
];

/**
 * Detect if there's a pattern of silly/inappropriate content
 */
export function detectSillyPattern(answers: StoryAnswer[]): {
  hasSillyPattern: boolean;
  theme?: InterpretationTheme;
  frequency: number;
} {
  const allText = answers
    .map(a => a.answer?.toLowerCase() || '')
    .join(' ');
  
  // Check each theme
  for (const theme of INTERPRETATION_THEMES) {
    let totalCount = 0;
    
    for (const keyword of theme.keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = allText.match(regex);
      totalCount += matches ? matches.length : 0;
    }
    
    // If we find 5+ instances, this is clearly a pattern
    if (totalCount >= 5) {
      return {
        hasSillyPattern: true,
        theme,
        frequency: totalCount
      };
    }
  }
  
  return { hasSillyPattern: false, frequency: 0 };
}

/**
 * Transform silly content based on detected theme
 */
export function transformSillyContent(text: string, theme: InterpretationTheme): string {
  if (!text) return text;
  
  let transformed = text;
  
  // Sort concept map by length (longest first) to handle multi-word phrases
  const sortedMappings = Object.entries(theme.conceptMap)
    .sort((a, b) => b[0].length - a[0].length);
  
  // Apply concept mapping
  for (const [silly, meaningful] of sortedMappings) {
    const regex = new RegExp(silly.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    transformed = transformed.replace(regex, meaningful);
  }
  
  // Additional cleanup
  transformed = transformed
    .replace(/\[+/g, '') // Remove stray brackets
    .replace(/\.{2,}/g, '.') // Fix multiple periods
    .replace(/\s{2,}/g, ' ') // Fix multiple spaces
    .trim();
  
  return transformed;
}

/**
 * Create a narrative guidance based on the silly pattern
 */
export function createNarrativeGuidance(theme: InterpretationTheme, frequency: number): string {
  if (theme.interpretAs === 'magical_chaos') {
    return `
🎨 **CREATIVE INTERPRETATION REQUIRED** 🎨

⚠️ The child has entered silly/inappropriate content (${frequency} instances). 

**YOUR JOB:** Completely transform this into a MAGICAL FANTASY story.

---

**STRICT TRANSFORMATION RULES:**

1. **NEVER use the silly words** - Not even once in your story
2. **REPLACE WITH:** Clouds, mist, fog, vapor, stardust, moonbeams, magic light
3. **CHARACTER:** A young magical being (cloud spirit, sky dancer, mist weaver, storm caller)
4. **WORLD:** Sky Realm, Floating Isles, Cloud Kingdoms, Star Peaks, Crystal Heights
5. **MAGIC SYSTEM:** Weather control, cloud shaping, mist manipulation, wind calling
6. **CONFLICT:** Master their powers, save their realm, help others, overcome fear
7. **TONE:** Whimsical adventure (like Studio Ghibli meets Avatar: The Last Airbender)

---

**STORY EXAMPLES TO EMULATE:**
- Hayao Miyazaki's "Castle in the Sky" - floating islands and wonder
- "Kiki's Delivery Service" - young person learning magic
- Avatar: The Last Airbender - elemental bending
- How to Train Your Dragon - finding courage and friendship

---

**WHAT TO WRITE:**
A 600-800 word adventure about a young magical being discovering their powers, facing challenges, making friends, and learning to believe in themselves. Include:
- Vivid descriptions of a magical sky world
- A clear character arc (growth/change)
- Specific magical challenges to overcome
- Emotional depth and stakes
- A satisfying, uplifting conclusion

**DO NOT:**
- ❌ Use ANY bathroom/toilet/silly words
- ❌ Be literal with the child's input
- ❌ Create a sparse or vague story
- ❌ Include anything inappropriate

**This should read like a published children's fantasy book.**
`;
  }
  
  if (theme.interpretAs === 'wind_magic') {
    return `
🎨 **CREATIVE INTERPRETATION NEEDED**

Transform silly wind/gas references into a WIND MAGIC story:

**Thematic Transformation:**
- Wind/air magic powers
- Storm manipulation
- Weather control adventure
- Flying or gliding abilities

Think Avatar: The Last Airbender meets Studio Ghibli.
`;
  }
  
  return '';
}

/**
 * Pre-process all answers for silly content
 */
export function preprocessAnswers(answers: StoryAnswer[]): {
  transformedAnswers: StoryAnswer[];
  guidanceNote: string;
} {
  const pattern = detectSillyPattern(answers);
  
  if (!pattern.hasSillyPattern || !pattern.theme) {
    return {
      transformedAnswers: answers,
      guidanceNote: ''
    };
  }
  
  // Transform all answers
  const transformedAnswers = answers.map(answer => ({
    ...answer,
    answer: answer.answer ? transformSillyContent(answer.answer, pattern.theme!) : answer.answer
  }));
  
  const guidanceNote = createNarrativeGuidance(pattern.theme, pattern.frequency);
  
  return {
    transformedAnswers,
    guidanceNote
  };
}

/**
 * Get a character name transformation if needed
 */
export function transformCharacterName(name: string, theme?: InterpretationTheme): string {
  if (!name || !theme) return name;
  return theme.nameTransform(name);
}

/**
 * Get a world setting transformation if needed
 */
export function transformWorldSetting(setting: string, theme?: InterpretationTheme): string {
  if (!theme) return setting;
  
  // If setting is silly or undefined, use theme's world
  const lower = setting?.toLowerCase() || '';
  const hasSillyContent = theme.keywords.some(kw => lower.includes(kw));
  
  if (hasSillyContent || !setting) {
    return theme.worldTransform;
  }
  
  return setting;
}
