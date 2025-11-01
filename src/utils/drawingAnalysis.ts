/**
 * Drawing Analysis Utility
 * 
 * Analyzes drawings to generate text descriptions.
 * In production, this would call an AI image analysis API.
 * For now, generates creative, age-appropriate descriptions.
 */

interface DrawingAnalysisResult {
  description: string;
  confidence: number;
}

/**
 * Analyzes a drawing and returns a text description
 * 
 * @param drawingDataUrl - Base64 data URL of the drawing
 * @param cardType - Type of card (e.g., "character", "setting", "obstacle")
 * @returns Description of the drawing
 */
export async function analyzeDrawing(
  drawingDataUrl: string,
  cardType: 'character' | 'setting' | 'obstacle' | 'other' = 'other'
): Promise<DrawingAnalysisResult> {
  // In production, this would call an image analysis API like:
  // - OpenAI Vision API
  // - Google Cloud Vision
  // - Azure Computer Vision
  // 
  // Example API call:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4-vision-preview',
  //     messages: [{
  //       role: 'user',
  //       content: [
  //         {
  //           type: 'text',
  //           text: getPromptForCardType(cardType)
  //         },
  //         {
  //           type: 'image_url',
  //           image_url: { url: drawingDataUrl }
  //         }
  //       ]
  //     }],
  //     max_tokens: 150
  //   })
  // });

  // For now, simulate API delay and generate a creative description
  await new Promise(resolve => setTimeout(resolve, 1000));

  return generateMockDescription(cardType);
}

/**
 * Generates appropriate prompts for different card types
 */
function getPromptForCardType(cardType: string): string {
  switch (cardType) {
    case 'character':
      return 'Describe this character drawing in 1-2 sentences. Focus on their appearance, what they\'re wearing, and any distinctive features. Use simple, vivid language suitable for a children\'s story.';
    
    case 'setting':
      return 'Describe this setting/location drawing in 1-2 sentences. Focus on what the place looks like and what makes it special. Use simple, vivid language suitable for a children\'s story.';
    
    case 'obstacle':
      return 'Describe what challenge or obstacle is shown in this drawing. Keep it brief and suitable for a children\'s story.';
    
    default:
      return 'Describe what you see in this drawing in 1-2 simple sentences suitable for a children\'s story.';
  }
}

/**
 * Mock description generator
 * In production, this would be replaced by actual AI analysis
 */
function generateMockDescription(cardType: string): DrawingAnalysisResult {
  const descriptions: Record<string, string[]> = {
    character: [
      'A brave hero with bright, curious eyes and a determined smile. They wear comfortable clothes perfect for adventure.',
      'A clever character with messy hair and a backpack full of supplies. Their shoes look well-worn from many journeys.',
      'A kind-hearted hero with a warm expression and colorful clothing. They carry something special that helps them on their quest.',
      'An adventurous character with wild hair and sparkling eyes. They look ready to face any challenge with courage.',
      'A creative hero wearing unique, colorful clothes and a confident expression. They seem full of interesting ideas.'
    ],
    setting: [
      'A magical place filled with interesting details and hidden corners. The colors make it feel both exciting and welcoming.',
      'A mysterious location with unusual features that spark curiosity. It looks like the perfect place for an adventure to begin.',
      'A cozy but intriguing spot with plenty of nooks and crannies to explore. Something about it feels special and important.',
      'A vibrant area full of life and possibility. The scenery suggests both beauty and hidden secrets.',
      'An enchanting space that feels both familiar and wonderfully strange. It\'s the kind of place where anything could happen.'
    ],
    obstacle: [
      'A challenging situation that will require cleverness to overcome. It looks difficult but not impossible.',
      'A tricky problem that stands in the way of the goal. Solving it will take creativity and courage.',
      'An unexpected difficulty that changes everything. It\'s the kind of challenge that helps heroes grow.',
      'A formidable barrier that demands a creative solution. Getting past it won\'t be easy, but it\'s definitely possible.',
      'A surprising complication that makes the adventure more interesting. It\'s exactly the kind of challenge a hero needs.'
    ],
    other: [
      'An interesting element with vivid colors and unique details. It adds something special to the story.',
      'A creative addition full of imagination and personality. It brings the story to life in a unique way.',
      'Something colorful and imaginative that captures attention. It makes the story more memorable.',
      'A thoughtful detail that shows creativity and care. It adds depth to the adventure.',
      'An inventive element with distinctive features. It makes the story feel personal and special.'
    ]
  };

  const options = descriptions[cardType] || descriptions.other;
  const randomIndex = Math.floor(Math.random() * options.length);
  
  return {
    description: options[randomIndex],
    confidence: 0.85
  };
}

/**
 * Determines the card type from a card ID or question
 */
export function getCardTypeFromId(cardId: string): 'character' | 'setting' | 'obstacle' | 'other' {
  const id = cardId.toLowerCase();
  
  if (id.includes('appearance') || id.includes('looks') || id.includes('character')) {
    return 'character';
  }
  
  if (id.includes('setting') || id.includes('where') || id.includes('place') || id.includes('location')) {
    return 'setting';
  }
  
  if (id.includes('obstacle') || id.includes('challenge') || id.includes('problem')) {
    return 'obstacle';
  }
  
  return 'other';
}
