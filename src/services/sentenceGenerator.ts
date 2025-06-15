import { Difficulty, ThaiSentence } from '../types';
import { sentences } from '../data/sentences';

// Get all sentences for a specific difficulty level
const getSentencesByDifficulty = (difficulty: Difficulty): ThaiSentence[] => {
  const allSentences: ThaiSentence[] = [];
  
  Object.values(sentences.collections).forEach(collection => {
    collection.sentences.forEach(sentence => {
      if (sentence.difficulty === difficulty) {
        allSentences.push(sentence);
      }
    });
  });
  
  return allSentences;
};

export const generateSentence = (difficulty: Difficulty, currentSentence?: ThaiSentence): ThaiSentence => {
  const sentences = getSentencesByDifficulty(difficulty);
  
  // If there's only one sentence in the difficulty level, return it
  if (sentences.length === 1) {
    return sentences[0];
  }

  // If we have a current sentence, find a different one
  if (currentSentence) {
    const availableSentences = sentences.filter(s => 
      s.thai.join('') !== currentSentence.thai.join('')
    );
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    return availableSentences[randomIndex];
  }

  // If no current sentence, return a random one
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
};

// TODO: Implement GPT integration
export const generateSentenceWithGPT = async (difficulty: Difficulty): Promise<ThaiSentence> => {
  // This will be implemented later with GPT API
  return generateSentence(difficulty);
}; 