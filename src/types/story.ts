export interface StoryAnswer {
  cardId: string;
  question: string;
  answer: string;
  drawing?: string;
  timestamp: number;
}

export interface StorySection {
  id: string;
  name: string;
  description: string;
  writingPrinciple: string;
  cards: StoryCard[];
  completed: boolean;
}

export interface StoryCard {
  id: string;
  question: string;
  placeholder: string;
  allowDrawing?: boolean;
  isDrawingOnly?: boolean;
  helpText?: string; // Educational guidance about this story element
  examples?: string[]; // Age-appropriate examples to inspire kids
}

export interface StoryProgress {
  currentSection: number;
  currentCard: number;
  answers: StoryAnswer[];
  lastUpdated: number;
}

/**
 * Story structure based on classic narrative principles adapted for ages 6-12
 * Following the Hero's Journey and Three-Act Structure in an age-appropriate way
 */
export const STORY_SECTIONS: StorySection[] = [
  {
    id: 'character',
    name: 'Meet Your Hero',
    description: 'Every great story needs a hero we care about',
    writingPrinciple: 'Character Development - Creating relatable, dimensional characters with desires and fears',
    completed: false,
    cards: [
      {
        id: 'char-name',
        question: "What's your hero's name?",
        placeholder: "My hero's name is...",
        helpText: "This is the main character in your story - the person or creature we'll follow on their adventure!"
      },
      {
        id: 'char-who',
        question: 'Who is your hero? Are they a kid, an animal, a magical creature, or something else?',
        placeholder: "My hero is...",
        helpText: "Think about what kind of character would be fun to follow on an adventure.",
        examples: [
          "a curious 10-year-old who loves science",
          "a brave young dragon who's afraid of heights", 
          "a clever fox who wants to be a detective"
        ]
      },
      {
        id: 'char-want',
        question: 'What does your hero want more than anything in the world?',
        placeholder: "More than anything, they want to...",
        helpText: "This is your hero's GOAL - what they're trying to achieve in your story. This is super important!",
        examples: [
          "find their missing best friend",
          "prove they're brave enough to join the adventure club",
          "save their village from a mysterious problem"
        ]
      },
      {
        id: 'char-why',
        question: 'WHY is this so important to them? Why do they care so much?',
        placeholder: "This matters because...",
        helpText: "When we know WHY your hero cares, we care too! This makes your story powerful.",
        examples: [
          "their best friend believed in them when no one else did",
          "they've always felt like they weren't good enough",
          "their family depends on them"
        ]
      },
      {
        id: 'char-obstacle',
        question: "What makes it hard for them to get what they want? What's in their way?",
        placeholder: "The problem is...",
        helpText: "This could be something outside them (like a villain) or inside them (like being scared or doubtful).",
        examples: [
          "they're too shy to ask for help",
          "everyone says they're too young",
          "a magical spell blocks their path"
        ]
      },
      {
        id: 'char-special',
        question: 'What special quality or strength does your hero have that will help them?',
        placeholder: "They are really good at...",
        helpText: "Even if they don't know it yet, your hero has something special inside them!",
        examples: [
          "they never give up, even when things are hard",
          "they notice details others miss",
          "they're kind and make friends easily"
        ]
      },
      {
        id: 'char-drawing',
        question: 'Draw your hero or describe what they look like!',
        placeholder: "My hero looks like...",
        allowDrawing: true,
        helpText: "Show us your hero! What do they wear? How do they look? What makes them unique?"
      }
    ]
  },
  {
    id: 'world',
    name: 'Build Your World',
    description: "Where and when does your adventure happen?",
    writingPrinciple: 'Setting & Atmosphere - Creating a vivid world that influences the story',
    completed: false,
    cards: [
      {
        id: 'world-where',
        question: 'Where does your story take place?',
        placeholder: "This story happens in...",
        helpText: "The setting is the world of your story. Make it interesting!",
        examples: [
          "a mysterious forest where the trees whisper secrets",
          "a busy city where magic and technology mix together",
          "a small village by the ocean with an underwater kingdom nearby"
        ]
      },
      {
        id: 'world-when',
        question: 'When does this story happen?',
        placeholder: "This story takes place...",
        helpText: "Is it modern times? The past? The future? A timeless fairy tale world?",
        examples: [
          "in present day, but with secret magic",
          "100 years in the future",
          "long ago, when dragons still roamed"
        ]
      },
      {
        id: 'world-special',
        question: 'What makes this place special, different, or magical?',
        placeholder: "This place is special because...",
        helpText: "What can happen here that couldn't happen anywhere else?",
        examples: [
          "at midnight, all the toys come to life",
          "the weather changes based on how people feel",
          "animals can talk, but only to children"
        ]
      },
      {
        id: 'world-rules',
        question: 'What are the rules of this world? What can and cannot happen here?',
        placeholder: "In this world...",
        helpText: "Every world has rules, even magical ones! This helps readers know what to expect.",
        examples: [
          "magic only works if you truly believe",
          "you can fly, but only when the sun is setting",
          "wishes come true, but always with a twist"
        ]
      },
      {
        id: 'world-mood',
        question: 'How does this place feel? Mysterious? Exciting? Cozy? Dangerous?',
        placeholder: "This place feels...",
        helpText: "The MOOD helps readers imagine being there.",
        examples: [
          "mysterious and a little bit spooky, but also exciting",
          "warm and friendly during the day, but strange at night",
          "beautiful but dangerous, like a garden with thorns"
        ]
      },
      {
        id: 'world-drawing',
        question: 'Draw this amazing place or describe what we would see!',
        placeholder: "If you were standing there, you would see...",
        allowDrawing: true,
        helpText: "Help us picture your world! What colors? What sounds? What do we notice first?"
      }
    ]
  },
  {
    id: 'beginning',
    name: 'Start the Adventure',
    description: 'How does your story begin?',
    writingPrinciple: 'Act I - Establishing normal world and the inciting incident that changes everything',
    completed: false,
    cards: [
      {
        id: 'begin-ordinary',
        question: "What is life like for your hero BEFORE the adventure begins?",
        placeholder: "Usually, my hero...",
        helpText: "Show us their ORDINARY WORLD first. This helps us see how much things will change!",
        examples: [
          "goes to school, helps at home, and wishes for something more exciting",
          "lives a quiet life in the village, doing the same thing every day",
          "practices their skills, but nobody notices or believes in them"
        ]
      },
      {
        id: 'begin-incident',
        question: "What happens that changes EVERYTHING? This is your story's big beginning moment!",
        placeholder: "One day, something happened...",
        helpText: "This is called the INCITING INCIDENT - the moment that starts the adventure! Make it exciting!",
        examples: [
          "they discovered a mysterious message that nobody else could read",
          "a strange visitor arrived asking for help with an impossible quest",
          "something they loved was suddenly in terrible danger"
        ]
      },
      {
        id: 'begin-reaction',
        question: 'How does your hero feel about this? What do they think?',
        placeholder: "At first, they felt...",
        helpText: "It's normal for heroes to feel scared or unsure at first. That makes them real!",
        examples: [
          "excited but also nervous - could they really do this?",
          "scared and wanted to say no, but they knew they had to help",
          "confused and wasn't sure what to do"
        ]
      },
      {
        id: 'begin-decision',
        question: 'What makes your hero decide to go on this adventure anyway?',
        placeholder: "They decided to go because...",
        helpText: "This is the moment they CROSS THE THRESHOLD into the adventure. Why do they say yes?",
        examples: [
          "they realized no one else could help",
          "they remembered their special quality and felt a spark of courage",
          "someone they cared about needed them"
        ]
      },
      {
        id: 'begin-first-step',
        question: 'What is the first brave thing your hero does to start the adventure?',
        placeholder: "The first thing they did was...",
        helpText: "Show your hero taking action! This is where the journey truly begins.",
        examples: [
          "packed a small bag and set off at sunrise",
          "asked for help from someone unexpected",
          "entered the place they'd always been afraid to go"
        ]
      }
    ]
  },
  {
    id: 'challenges',
    name: 'Face the Challenges',
    description: 'Every hero faces obstacles that test them',
    writingPrinciple: 'Act II - Rising action, complications, and character growth through conflict',
    completed: false,
    cards: [
      {
        id: 'challenge-first',
        question: 'What is the FIRST big challenge or problem your hero faces?',
        placeholder: "First, they had to...",
        helpText: "Good stories have obstacles that get harder and harder. Start with something challenging!",
        examples: [
          "cross a dangerous river with no bridge",
          "convince someone who didn't trust them to help",
          "solve a tricky puzzle to move forward"
        ]
      },
      {
        id: 'challenge-how',
        question: 'How does your hero try to overcome this first challenge?',
        placeholder: "They tried to...",
        helpText: "Show us what your hero DOES. Do they use their special quality? Make a plan? Ask for help?",
        examples: [
          "used their cleverness to build a raft",
          "showed kindness and patience until the person believed them",
          "tried several different solutions until one worked"
        ]
      },
      {
        id: 'challenge-second',
        question: 'What is an even HARDER challenge they face next?',
        placeholder: "Then, things got harder when...",
        helpText: "The second challenge should be tougher! This is called RISING ACTION.",
        examples: [
          "they lost something important they needed",
          "someone they trusted turned out to be working against them",
          "time was running out faster than they thought"
        ]
      },
      {
        id: 'challenge-mistake',
        question: 'Does your hero make a mistake or fail at something? What happens?',
        placeholder: "Things went wrong when...",
        helpText: "Heroes aren't perfect! Mistakes make them real and give them a chance to grow.",
        examples: [
          "they rushed ahead without thinking and got into trouble",
          "they didn't listen to advice and regretted it",
          "their fear took over and they almost gave up"
        ]
      },
      {
        id: 'challenge-lowest',
        question: "What is the darkest moment when everything seems hopeless?",
        placeholder: "The worst moment was when...",
        helpText: "This is called the DARK NIGHT - when your hero feels most lost. But it's not over yet!",
        examples: [
          "they were all alone with no idea what to do next",
          "it seemed like they'd failed and let everyone down",
          "the obstacle seemed impossible to overcome"
        ]
      },
      {
        id: 'challenge-realize',
        question: 'What does your hero realize or learn that gives them new hope?',
        placeholder: "Then they realized...",
        helpText: "This is a turning point! What truth do they discover? What do they finally understand?",
        examples: [
          "they'd been strong enough all along - they just needed to believe it",
          "the answer was inside them, not outside",
          "they didn't have to do it alone - asking for help was brave, not weak"
        ]
      }
    ]
  },
  {
    id: 'climax',
    name: 'The Big Moment',
    description: 'How does your story end?',
    writingPrinciple: 'Act III - Climax, resolution, and transformation showing character growth',
    completed: false,
    cards: [
      {
        id: 'climax-moment',
        question: 'What is the BIGGEST, most exciting moment of your entire story?',
        placeholder: "The biggest moment was when...",
        helpText: "This is the CLIMAX - the most important moment! Everything has led to this!",
        examples: [
          "they faced their biggest fear head-on",
          "they had to make a really hard choice",
          "they used everything they'd learned in one final effort"
        ]
      },
      {
        id: 'climax-action',
        question: 'What brave or clever thing does your hero do in this big moment?',
        placeholder: "My hero...",
        helpText: "Show us your hero using their special quality and everything they've learned!",
        examples: [
          "combined their special talent with the help of their new friends",
          "did the thing they were most afraid of",
          "made a choice that showed how much they'd grown"
        ]
      },
      {
        id: 'climax-result',
        question: 'What happens? How is the main problem solved or resolved?',
        placeholder: "In the end...",
        helpText: "This is the RESOLUTION. Show us how the story's big problem gets solved!",
        examples: [
          "their bravery broke the spell and everything returned to normal",
          "they saved what needed saving and became a hero",
          "they achieved their goal, but in a surprising way"
        ]
      },
      {
        id: 'ending-change',
        question: 'How has your hero CHANGED? What did they learn?',
        placeholder: "Now my hero...",
        helpText: "Great stories change the hero! What's different about them now?",
        examples: [
          "learned that being scared doesn't mean you can't be brave",
          "discovered they were stronger than they knew",
          "realized that asking for help makes you stronger, not weaker"
        ]
      },
      {
        id: 'ending-world',
        question: 'How is the world different now because of what your hero did?',
        placeholder: "Now the world...",
        helpText: "Heroes make a difference! How is the world better because of your hero's journey?",
        examples: [
          "is safer because they solved the problem",
          "has more magic/hope/friendship in it",
          "changed in a small way that mattered a lot"
        ]
      },
      {
        id: 'ending-final',
        question: 'What is your hero doing at the very end of your story?',
        placeholder: "At the end, my hero...",
        helpText: "Give us a final image of your hero in their NEW NORMAL. How do we leave them?",
        examples: [
          "returned home, but everything felt different now",
          "set off on a new adventure, ready for anything",
          "found peace, knowing they'd done something important"
        ]
      }
    ]
  }
];
