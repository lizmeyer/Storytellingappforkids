# 📚 Story Creator - iOS Storytelling App for Children

A warm, playful iOS storytelling app designed for children ages 6-12. Guide young writers through creating complete, well-structured stories using an intuitive card-based interface with voice-first interaction and optional drawing features.

## ✨ Features

### 🎴 Card-Based Storytelling System
- **5 Story Sections**: Character Development, Setting, Beginning, Obstacles, and Ending
- **20-30 Interactive Cards**: Each card guides children through specific storytelling elements
- **Smooth Swipe Animations**: Spring-based physics for natural card interactions
- **Jump Between Cards**: Easy navigation with visual progress tracking

### 🎨 Multimodal Input
- **Type or Speak**: Default typing mode with voice input as an alternative
- **Drawing Integration**: Optional drawing feature for character, setting, and obstacle cards
- **AI Drawing Analysis**: Automatic Claude Sonnet 4 analysis of drawings into descriptive text
- **Flexible Input**: Children can mix text, voice, and drawings throughout their story

### 🤖 AI-Powered Story Generation
- **Claude Sonnet 4.5**: Advanced AI creates polished, age-appropriate stories
- **Intelligent Interpretation**: Converts raw inputs into proper narrative prose
- **Grammar Excellence**: Perfect grammar with varied vocabulary
- **Early Reader Style**: Stories inspired by juvenile/middle grade literature

### 💾 Story Management
- **Draft System**: Auto-save progress and resume anytime
- **Story Library**: Browse all completed and draft stories
- **PDF Export**: Beautiful, shareable story documents with jsPDF
- **Story Viewer**: Read completed stories with smooth pagination

### 🎨 Design Philosophy
- **iOS-Inspired**: Clean, minimalist design with subtle shadows and smooth animations
- **Warm & Playful**: Gradient backgrounds, friendly colors, cheerful emojis
- **Creative Companion**: Supportive, encouraging guidance throughout
- **Child-Friendly**: Intuitive interface designed for ages 6-12

## 🏗️ Architecture

### Technology Stack
- **React** with TypeScript
- **Motion (Framer Motion)** for smooth animations
- **Tailwind CSS 4.0** for styling
- **Anthropic Claude API** for AI story generation
- **jsPDF** for PDF export
- **LocalStorage** for data persistence

### Key Components

```
components/
├── WelcomeScreen.tsx          # App entry point
├── SectionOverview.tsx        # Story section navigation
├── SectionCardDeck.tsx        # Swipeable card interface
├── VoiceInput.tsx             # Type/speak input switcher
├── DrawingCanvas.tsx          # Drawing interface
├── SectionComplete.tsx        # Section completion celebration
├── ProgressInterstitial.tsx   # Story generation loading
├── StoryViewer.tsx            # Read completed stories
└── StoryLibrary.tsx           # Browse all stories
```

### Story Generation Pipeline

1. **Input Collection** (`SectionCardDeck.tsx`)
   - Collect answers via typing, voice, or drawing
   - Store in Map structure with card IDs

2. **Input Interpretation** (`inputInterpreter.ts`)
   - Analyze and enhance raw inputs
   - Preserve child's voice while improving clarity

3. **Story Compilation** (`storyCompiler.ts`)
   - Structure story into proper narrative format
   - Create scene-by-scene breakdown

4. **AI Generation** (`storyGenerator.ts`)
   - Send to Claude Sonnet 4.5 with simplified prompt
   - Generate polished, age-appropriate story
   - Ensure perfect grammar and varied vocabulary

5. **Export** (`pdfExport.ts`)
   - Create beautiful PDF with proper formatting
   - Include title, author, and story text

## 🎯 Story Quality Features

### Grammar & Writing
- ✅ Perfect grammar (their/there/they're, etc.)
- ✅ Varied vocabulary (no repetitive words)
- ✅ Natural sentence flow
- ✅ Age-appropriate language
- ✅ Proper punctuation and capitalization

### Story Structure
- ✅ Complete narrative arc
- ✅ Scene-based storytelling
- ✅ Character development
- ✅ Clear setting description
- ✅ Engaging obstacles
- ✅ Satisfying resolution

### Writing Principles
- Trusts Claude's natural abilities (simplified 200-line prompt vs. 700+ lines)
- Preserves child's creative intent
- Enhances without overwriting
- Maintains consistent tone

## 📖 Documentation

- **[AI Setup Guide](AI_SETUP.md)** - Configure Claude API
- **[Story Engine](README_STORY_ENGINE.md)** - How story generation works
- **[Grammar Guide](GRAMMAR_GUIDE.md)** - Quality assurance details
- **[Animation Guide](ANIMATION_IMPROVEMENTS.md)** - Card animation system
- **[Guidelines](guidelines/Guidelines.md)** - Design principles

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Anthropic API key (for Claude Sonnet 4.5)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/story-creator.git
   cd story-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```
   
   Or configure through the app's UI (stored in localStorage)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Creating a Story

1. **Start**: Tap "Create New Story" on the welcome screen
2. **Navigate Sections**: View all 5 sections in the overview
3. **Answer Cards**: 
   - Swipe right to save an answer
   - Swipe left to skip (card goes to back of deck)
   - Type, speak, or draw your answers
4. **Complete Sections**: Celebrate after finishing each section
5. **Generate Story**: After all sections, AI creates your complete story
6. **Read & Share**: View your story and export to PDF

### Managing Stories

- **Resume Drafts**: Tap any draft story to continue where you left off
- **Read Stories**: Tap completed stories to read them
- **Export PDFs**: Download stories as shareable PDF documents
- **Delete Stories**: Remove drafts or completed stories from library

## 🎨 Design System

### Colors
- **Background**: Gradient pastels (purple, pink, yellow)
- **Inputs**: Subtle cool grey (#f5f5f7)
- **Accents**: Purple-to-pink gradients
- **Success**: Green tones
- **Warning**: Yellow tones

### Typography
- **Font**: Quicksand (warm, friendly, rounded)
- **Hierarchy**: Clear visual hierarchy for different text levels

### Animations
- **Spring Physics**: Natural, bouncy card movements
- **Smooth Transitions**: 300ms timing with proper easing
- **Micro-interactions**: Hover, tap, and swipe feedback

## 🔒 Privacy & Data

- **Local Storage Only**: All data stored on device
- **No User Accounts**: No sign-up required
- **API Calls**: Only for AI story generation (Claude Sonnet)
- **No Tracking**: No analytics or user tracking
- **Child-Safe**: Designed for ages 6-12 without PII collection

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ⚠️ Voice input requires browser speech recognition support

## 🛠️ Development

### Key Files to Understand

- `App.tsx` - Main app state and routing
- `types/story.ts` - TypeScript interfaces
- `utils/storyGenerator.ts` - AI prompt and generation
- `components/SectionCardDeck.tsx` - Card swipe system
- `styles/globals.css` - Design tokens and typography

### Making Changes

1. **UI Components**: Edit files in `/components`
2. **Styling**: Modify `/styles/globals.css` or use Tailwind classes
3. **Story Logic**: Update files in `/utils`
4. **AI Prompt**: Edit `/utils/storyGenerator.ts`

## 🐛 Known Issues

- Voice recognition availability varies by browser
- PDF export styling could be enhanced
- Mobile responsiveness could be improved

## 🚀 Future Enhancements

- [ ] Mobile-optimized responsive design
- [ ] Story illustrations in final output
- [ ] Multiple story templates
- [ ] Story sharing features
- [ ] Collaborative storytelling
- [ ] Enhanced PDF styling with images
- [ ] Story analytics for parents/teachers

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Claude Sonnet 4.5** by Anthropic for AI story generation
- **Framer Motion** for smooth animations
- **shadcn/ui** for UI components
- **Lucide** for beautiful icons

## 💬 Support

For questions, issues, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for young storytellers everywhere 📖✨
