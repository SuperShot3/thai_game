# Thai Sentence Builder

A fun and interactive Thai language learning game where players build sentences by dragging and dropping Thai words.

## Features

- **Three Difficulty Levels**: Beginner, Intermediate, and Advanced
- **Interactive Drag & Drop**: Intuitive word placement system
- **Progress Tracking**: Save your progress across sessions
- **Leaderboard**: Compare scores with other players
- **AI Help Assistant**: Get intelligent hints when stuck
- **Multiple Thai Fonts**: Beautiful typography for better learning
- **Responsive Design**: Works on desktop and mobile devices
- **Exit & Save**: Exit anytime and save your progress to leaderboard

## AI Help Assistant

The game includes an intelligent AI assistant that provides contextual help:

- **Floating Help Button**: Green circular button in the bottom-right corner
- **Smart Suggestions**: AI analyzes your current progress and suggests the next word
- **Error Detection**: Identifies when words are in the wrong order
- **Progressive Help**: Different responses for first-time vs. repeated help requests
- **Auto-hide**: Help bubble disappears after 3 seconds

### OpenAI Assistant Setup

The AI Help Assistant uses OpenAI's Assistant API. To enable it:

1. **Get OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com/) and get an API key
2. **Create Environment File**: Create a `.env.local` file in the project root:
   ```
   REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
3. **Assistant ID**: The app is configured to use assistant ID: `asst_hocZxHFiHsETqhNHuiHCBCng`

**Note**: If the OpenAI API is not configured, the AI assistant will fall back to a local simulation mode.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd thai_game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (optional, for AI features):
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your OpenAI API key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Mode

When running in development mode (localhost), the app automatically:
- Clears the leaderboard on each restart
- Resets player progress for fresh testing
- Shows development mode indicators

## Game Rules

1. **Objective**: Complete 5 sentences correctly in each difficulty level
2. **Progression**: Unlock higher levels by completing lower ones
3. **Scoring**: Track correct answers, incorrect attempts, and completion time
4. **Help**: Use the AI assistant for hints when needed

## Technologies Used

- **Frontend**: React with TypeScript
- **Styling**: Styled Components
- **Drag & Drop**: Custom implementation
- **AI**: OpenAI Assistant API
- **Database**: Supabase (for leaderboard)
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub.

## Exit Feature

The game includes a convenient exit button that allows players to:
- **Save Progress**: Current session stats are automatically saved to the leaderboard
- **Return to Menu**: Safely exit to the main menu without losing progress
- **View Stats**: See current session performance before exiting
- **Confirmation Dialog**: Prevents accidental exits with a confirmation prompt

### How to Exit

1. Click the red "Exit" button in the top-right corner during gameplay
2. Review your current session statistics in the confirmation dialog
3. Click "Yes, Exit" to save and return to main menu
4. Your stats will be saved to the leaderboard automatically
5. You'll be returned to the main screen with the entrance form for a fresh start
