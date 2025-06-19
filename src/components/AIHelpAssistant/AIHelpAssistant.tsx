import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { aiHelpService } from '../../services/aiHelpService';

interface AIHelpAssistantProps {
  targetSentence: string[];
  userAnswer: string[];
  availableWords: string[];
  helpClickedThisRound: boolean;
  onHelpClick: () => void;
  englishTranslation?: string;
  currentSentenceIndex?: number;
  totalSentencesInLevel?: number;
}

const HelpButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const HelpBubble = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  max-width: 250px;
  background: white;
  border: 2px solid #4CAF50;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  z-index: 1001;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #4CAF50;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AIHelpAssistant: React.FC<AIHelpAssistantProps> = ({
  targetSentence,
  userAnswer,
  availableWords,
  helpClickedThisRound,
  onHelpClick,
  englishTranslation,
  currentSentenceIndex,
  totalSentencesInLevel
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [helpCount, setHelpCount] = useState(0);
  const [lastUserAnswer, setLastUserAnswer] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track changes in user answer to provide better progressive help
  useEffect(() => {
    const userAnswerString = userAnswer.join('|');
    const lastAnswerString = lastUserAnswer.join('|');
    
    // If user answer changed significantly, reset help count for better progressive help
    if (lastAnswerString !== userAnswerString && lastUserAnswer.length > 0) {
      setHelpCount(0);
      console.log('🔄 User answer changed, resetting help count');
    }
    
    setLastUserAnswer([...userAnswer]);
  }, [userAnswer, lastUserAnswer]);

  // Auto-hide bubble after 3 seconds
  useEffect(() => {
    if (isVisible && aiResponse) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, aiResponse]);

  const getAIHelp = async () => {
    setIsLoading(true);
    setIsVisible(true);
    onHelpClick();
    
    // Increment help count for this answer state
    setHelpCount(prev => prev + 1);

    try {
      // Prepare comprehensive data for AI
      const helpData = {
        target_sentence: targetSentence,
        user_answer: userAnswer,
        available_words: availableWords,
        help_clicked_round: helpClickedThisRound ? 2 : 1,
        help_count_for_current_answer: helpCount + 1, // Add progressive help tracking
        english_translation: englishTranslation,
        current_sentence_index: currentSentenceIndex,
        total_sentences_in_level: totalSentencesInLevel,
        // Additional context for better AI understanding
        user_answer_length: userAnswer.length,
        target_sentence_length: targetSentence.length,
        filled_positions: userAnswer.map((word, index) => ({ position: index, word: word || 'empty' })),
        empty_positions: userAnswer.map((word, index) => word === '' ? index : -1).filter(pos => pos !== -1),
        used_words_count: targetSentence.length - availableWords.length,
        remaining_words_count: availableWords.length
      };

      console.log('🤖 AI Help Request (Enhanced):', helpData);

      // Use real AI service
      const response = await aiHelpService.getHelp(helpData);
      
      setAiResponse(response.message);
      console.log('🤖 AI Response:', response.message);
      
    } catch (error) {
      console.error('❌ AI Help Error:', error);
      setAiResponse('Sorry, I cannot help right now. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpClick = () => {
    if (isLoading) return;
    getAIHelp();
  };

  return (
    <>
      <HelpButton onClick={handleHelpClick} disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : 'Help'}
      </HelpButton>
      
      <HelpBubble isVisible={isVisible}>
        {isLoading ? (
          <>
            <LoadingSpinner />
            Getting help...
          </>
        ) : (
          aiResponse
        )}
      </HelpBubble>
    </>
  );
};

export default AIHelpAssistant; 