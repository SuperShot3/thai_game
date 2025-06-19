interface AIHelpRequest {
  target_sentence: string[];
  user_answer: string[];
  available_words: string[];
  help_clicked_round: number;
  help_count_for_current_answer?: number;
  english_translation?: string;
  current_sentence_index?: number;
  total_sentences_in_level?: number;
  user_answer_length?: number;
  target_sentence_length?: number;
  filled_positions?: Array<{ position: number; word: string }>;
  empty_positions?: number[];
  used_words_count?: number;
  remaining_words_count?: number;
}

interface AIHelpResponse {
  message: string;
  success: boolean;
}

class AIHelpService {
  private static instance: AIHelpService;
  private readonly ASSISTANT_ID = 'asst_hocZxHFiHsETqhNHuiHCBCng';

  private constructor() {}

  public static getInstance(): AIHelpService {
    if (!AIHelpService.instance) {
      AIHelpService.instance = new AIHelpService();
    }
    return AIHelpService.instance;
  }

  /**
   * Get AI help for Thai sentence puzzle using OpenAI Assistant
   */
  public async getHelp(request: AIHelpRequest): Promise<AIHelpResponse> {
    try {
      console.log('🤖 AI Help Request:', request);
      
      // Use real OpenAI Assistant API
      const response = await this.callOpenAIAssistant(request);
      
      console.log('🤖 AI Response:', response);
      
      return {
        message: response,
        success: true
      };
    } catch (error) {
      console.error('❌ AI Help Error:', error);
      
      // Fallback to simulation if API fails
      const fallbackResponse = this.generateAIResponse(request);
      
      return {
        message: fallbackResponse,
        success: false
      };
    }
  }

  /**
   * Call OpenAI Assistant API
   */
  private async callOpenAIAssistant(request: AIHelpRequest): Promise<string> {
    // Check if API key is configured
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
    }

    try {
      // Create a thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!threadResponse.ok) {
        throw new Error(`Failed to create thread: ${threadResponse.statusText}`);
      }

      const thread = await threadResponse.json();
      const threadId = thread.id;

      // Prepare the message for the assistant
      const userMessage = `Target sentence: ${request.target_sentence.join(' ')}
User answer: ${request.user_answer.join(' ')}
Available words: ${request.available_words.join(' ')}
Help clicked round: ${request.help_clicked_round}
Help count for current answer: ${request.help_count_for_current_answer || 1}
English translation: ${request.english_translation || ''}
Current sentence index: ${request.current_sentence_index || ''}
Total sentences in level: ${request.total_sentences_in_level || ''}
User answer length: ${request.user_answer_length || ''}
Target sentence length: ${request.target_sentence_length || ''}
Filled positions: ${request.filled_positions ? JSON.stringify(request.filled_positions) : ''}
Empty positions: ${request.empty_positions ? JSON.stringify(request.empty_positions) : ''}
Used words count: ${request.used_words_count || ''}
Remaining words count: ${request.remaining_words_count || ''}`;

      // Add message to thread
      const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          role: 'user',
          content: userMessage
        })
      });

      if (!messageResponse.ok) {
        throw new Error(`Failed to add message: ${messageResponse.statusText}`);
      }

      // Run the assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          assistant_id: this.ASSISTANT_ID
        })
      });

      if (!runResponse.ok) {
        throw new Error(`Failed to run assistant: ${runResponse.statusText}`);
      }

      const run = await runResponse.json();
      const runId = run.id;

      // Poll for completion
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (!completed && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to check run status: ${statusResponse.statusText}`);
        }

        const runStatus = await statusResponse.json();
        
        if (runStatus.status === 'completed') {
          completed = true;
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
          throw new Error(`Assistant run failed: ${runStatus.status}`);
        }

        attempts++;
      }

      if (!completed) {
        throw new Error('Assistant run timed out');
      }

      // Get the response
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!messagesResponse.ok) {
        throw new Error(`Failed to get messages: ${messagesResponse.statusText}`);
      }

      const messages = await messagesResponse.json();
      const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');

      if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
        throw new Error('No response from assistant');
      }

      const responseText = assistantMessage.content[0].text.value;
      
      // Clean up the thread
      try {
        await fetch(`https://api.openai.com/v1/threads/${threadId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        });
      } catch (cleanupError) {
        console.warn('Failed to cleanup thread:', cleanupError);
      }

      return responseText;

    } catch (error) {
      console.error('OpenAI Assistant API Error:', error);
      throw error;
    }
  }

  /**
   * Fallback: Generate AI response based on game state
   * This simulates what an AI model would return
   */
  private generateAIResponse(request: AIHelpRequest): string {
    const { 
      target_sentence, 
      user_answer, 
      available_words, 
      help_clicked_round,
      help_count_for_current_answer = 1,
      english_translation,
      current_sentence_index,
      total_sentences_in_level,
      filled_positions,
      empty_positions
    } = request;
    
    console.log('🔄 Fallback AI Response - Enhanced Data:', {
      target_sentence,
      user_answer,
      available_words,
      help_clicked_round,
      help_count_for_current_answer,
      english_translation,
      current_sentence_index,
      total_sentences_in_level,
      filled_positions,
      empty_positions
    });
    
    // Check if sentence is complete
    if (user_answer.length === target_sentence.length) {
      // Check if sentence is correct
      const isCorrect = user_answer.every((word: string, index: number) => word === target_sentence[index]);
      if (isCorrect) {
        return 'Perfect! Sentence complete!';
      } else {
        // Provide specific guidance for complete but incorrect sentences
        const wrongPositions = user_answer
          .map((word: string, index: number) => ({ word, index, correct: word === target_sentence[index] }))
          .filter(item => !item.correct);
        
        if (help_count_for_current_answer === 1) {
          if (wrongPositions.length === 1) {
            return `Almost there! The word "${wrongPositions[0].word}" is in the wrong position. Try moving it.`;
          } else {
            return `Some words are in wrong positions. Try rearranging them to match the correct order.`;
          }
        } else if (help_count_for_current_answer === 2) {
          // More specific help on second click
          const firstWrong = wrongPositions[0];
          const correctWord = target_sentence[firstWrong.index];
          return `Position ${firstWrong.index + 1} should be "${correctWord}". Try swapping words.`;
        } else {
          // Even more specific help on third+ click
          return `Try this order: ${target_sentence.join(' ')}`;
        }
      }
    }
    
    // Check if words are in wrong order (but sentence is not complete)
    const correctSoFar = user_answer.every((word: string, index: number) => word === target_sentence[index]);
    
    if (!correctSoFar && user_answer.length > 0) {
      // Find the first wrong position
      const firstWrongIndex = user_answer.findIndex((word: string, index: number) => word !== target_sentence[index]);
      
      if (firstWrongIndex !== -1) {
        const wrongWord = user_answer[firstWrongIndex];
        const correctWord = target_sentence[firstWrongIndex];
        
        // Check if the wrong word exists elsewhere in the target sentence
        const correctPosition = target_sentence.findIndex(word => word === wrongWord);
        
        if (help_count_for_current_answer === 1) {
          if (correctPosition !== -1 && correctPosition !== firstWrongIndex) {
            return `The word "${wrongWord}" should be in position ${correctPosition + 1}, not position ${firstWrongIndex + 1}. Try moving it.`;
          } else if (available_words.includes(correctWord)) {
            return `Position ${firstWrongIndex + 1} should be "${correctWord}", not "${wrongWord}". Try replacing it.`;
          } else {
            return `Position ${firstWrongIndex + 1} should be "${correctWord}". Try rearranging the words.`;
          }
        } else if (help_count_for_current_answer === 2) {
          // More specific help on second click
          if (correctPosition !== -1) {
            return `Move "${wrongWord}" to position ${correctPosition + 1} and put "${correctWord}" in position ${firstWrongIndex + 1}.`;
          } else {
            return `Remove "${wrongWord}" from position ${firstWrongIndex + 1} and put "${correctWord}" there instead.`;
          }
        } else {
          // Show the correct order for this part
          const correctOrder = target_sentence.slice(0, firstWrongIndex + 1).join(' ');
          return `The correct order so far: ${correctOrder}`;
        }
      }
    }
    
    // Suggest next word if everything is correct so far
    const nextWordIndex = user_answer.length;
    const nextWord = target_sentence[nextWordIndex];
    
    if (help_clicked_round === 1 && help_count_for_current_answer === 1) {
      return `Hi! I help you with next word: ${nextWord}`;
    } else if (help_count_for_current_answer === 1) {
      return `Next word: ${nextWord}`;
    } else {
      return `Place "${nextWord}" in the next empty position.`;
    }
  }
}

export const aiHelpService = AIHelpService.getInstance(); 