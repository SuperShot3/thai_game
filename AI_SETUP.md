# AI Help Assistant Setup Guide

## Overview

The Thai Sentence Builder game includes an intelligent AI assistant that provides contextual help to players. The assistant uses OpenAI's Assistant API to analyze the current game state and provide helpful suggestions with progressive assistance.

## Features

- **Smart Word Suggestions**: AI suggests the next word to place
- **Error Detection**: Identifies when words are in wrong order
- **Progressive Help**: Different responses for first-time vs. repeated help on the same answer state
- **Contextual Analysis**: Considers target sentence, user's current answer, and available words
- **Answer State Tracking**: Resets help progression when user changes their answer

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root directory
2. Add your OpenAI API key:

```bash
REACT_APP_OPENAI_API_KEY=sk-your_actual_api_key_here
```

**Important**: 
- Never commit your API key to version control
- The `.env.local` file is already in `.gitignore`
- Replace `sk-your_actual_api_key_here` with your actual API key

### 3. Assistant Configuration

The app is pre-configured to use the assistant with ID: `asst_hocZxHFiHsETqhNHuiHCBCng`

This assistant is configured with the following system prompt:
```
You are a Thai sentence game helper. When given the correct sentence, the player's current answer, and available words, suggest the best next word to place. If any words are in the wrong order, provide specific guidance on how to fix them. The help count indicates how many times the player has asked for help on the same answer state - provide more specific guidance for higher counts. Limit all replies to 15 words. On the first help request per sentence, introduce yourself briefly.
```

### 4. Restart the Application

After setting up the environment variables:

1. Stop the development server (Ctrl+C)
2. Restart the application: `npm start`
3. The AI Help Assistant will now use the real OpenAI API

## Usage

### In the Game

1. **Floating Help Button**: Look for the green circular "Help" button in the bottom-right corner
2. **Click for Help**: Click the button when you need assistance
3. **Read the Response**: A speech bubble will appear with AI suggestions
4. **Auto-hide**: The bubble disappears after 3 seconds
5. **Progressive Help**: Click again for more specific guidance if needed

### Help Scenarios

- **First Help Request**: AI introduces itself and suggests the next word
- **Subsequent Requests**: Direct suggestions for the next word
- **Wrong Order Detection**: AI detects when words are misplaced and suggests rearrangement
- **Progressive Guidance**: Each additional help click provides more specific instructions
- **Answer State Reset**: When you change your answer, help progression resets for fresh guidance
- **Complete Sentence**: AI confirms when the sentence is correct

### Progressive Help Examples

**First Click (Wrong Order)**: "Some words are in wrong positions. Try rearranging them."
**Second Click**: "Position 2 should be 'word'. Try swapping words."
**Third Click**: "Try this order: word1 word2 word3 word4"

## Troubleshooting

### API Key Issues

**Error**: "OpenAI API key not configured"
- **Solution**: Make sure you've created `.env.local` with the correct API key
- **Check**: Verify the key starts with `sk-` and is properly formatted

**Error**: "Failed to create thread" or "Authorization failed"
- **Solution**: Check if your API key is valid and has sufficient credits
- **Check**: Verify the key in your OpenAI dashboard

### Network Issues

**Error**: "Assistant run timed out"
- **Solution**: Check your internet connection
- **Retry**: Click the help button again

### Fallback Mode

If the OpenAI API is not configured or fails, the app automatically falls back to a local simulation mode that provides basic help functionality with progressive assistance.

## Development

### Testing the AI Assistant

1. Start the game in development mode
2. Complete a few sentences to test the help functionality
3. Try placing words in wrong positions and clicking help multiple times
4. Check browser console for API request/response logs
5. Verify the assistant provides appropriate progressive suggestions

### Customizing the Assistant

To use a different OpenAI Assistant:

1. Create a new assistant in OpenAI Platform
2. Configure it with the system prompt above
3. Update the `ASSISTANT_ID` in `src/services/aiHelpService.ts`
4. Restart the application

### Progressive Help Logic

The system tracks:
- **Help Count**: How many times help was clicked for the current answer state
- **Answer Changes**: Automatically resets help count when user modifies their answer
- **Context Awareness**: Provides different levels of specificity based on help count
- **State Persistence**: Maintains help context until answer changes or new sentence

## Security Notes

- API keys are stored in environment variables (not in code)
- Keys are never sent to the client-side
- All API calls are made server-side (in this case, through the React app)
- Consider using a backend proxy for production applications

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is correct and active
3. Ensure you have sufficient OpenAI credits
4. Check your internet connection
5. Try the fallback mode if API is unavailable 