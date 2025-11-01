# AI Story Generation Setup

This app uses Claude Sonnet 4.5 to generate compelling children's stories from user inputs.

## ⚡ Quick Start

**The app works perfectly without AI!** It has a sophisticated local story compiler built-in. Adding an API key simply enhances stories with AI.

### No API Key Needed to Use the App

- ✅ App runs fully functional without any setup
- ✅ Stories are generated using sophisticated local compiler
- ✅ All features work (drawing, voice input, card navigation, etc.)
- ✨ **Optional:** Add API key for AI-enhanced stories

### Visual Indicator

When viewing a story, look for the badge under the title:
- **"✨ AI Enhanced"** = Generated with Claude Sonnet 4.5
- **No badge** = Generated with local compiler (still great stories!)

## Setup Instructions

### 1. Get an Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy your API key

### 2. Add API Key to Your App

Create a `.env` file in the root of your project:

```bash
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

**Important:** Never commit your `.env` file to version control!

### 3. How It Works

When a child completes their story, the app:

1. Extracts all their story elements (character, setting, plot, etc.)
2. Sends these elements to Claude Sonnet 4.5
3. Claude transforms the raw inputs into a polished, cohesive narrative
4. The story is displayed with proper formatting and illustrations

### 4. Fallback Behavior

If the API call fails (no API key, network error, etc.), the app automatically falls back to the local story compiler (`/utils/storyCompiler.ts`) which uses rule-based generation.

This ensures the app always works, even without AI!

### 5. Model Used

- **Model:** `claude-sonnet-4-20250514`
- **Max tokens:** 4000 (enough for 800-1200 word stories)
- **Age range:** Optimized for 6-12 year old readers
- **Style:** Early reader books (Magic Tree House, Charlotte's Web, etc.)

### 6. Privacy & Safety

- Stories are generated per-request and not stored by Anthropic
- All user inputs are only used for story generation
- The app is designed for children ages 6-12
- No PII (Personally Identifiable Information) should be collected

## API Cost Estimation

Claude Sonnet 4 pricing (as of Oct 2024):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

Per story cost:
- ~500 input tokens (story elements)
- ~1500 output tokens (generated story)
- **Estimated cost: ~$0.025 per story**

## Testing Without API Key

The app works perfectly without an API key using the local compiler. To test AI generation:

1. Add your API key to `.env`
2. Complete a story
3. The final story will be AI-generated!

## Troubleshooting

**Story not generating with AI:**
- Check that your `.env` file exists and has the correct key
- Verify the API key is valid in Anthropic Console
- Check browser console for error messages
- The app will automatically fall back to local generation

**API errors:**
- Rate limits: Anthropic has rate limits on API keys
- Invalid key: Double-check your API key
- Network issues: Check internet connection

## Development Notes

The AI generation happens in `/utils/storyGenerator.ts`. The prompt is carefully crafted to:

1. Preserve the child's creative vision
2. Add rich descriptive language
3. Create emotional depth
4. Maintain age-appropriate vocabulary
5. Follow classic story structure
6. Generate 800-1200 word stories